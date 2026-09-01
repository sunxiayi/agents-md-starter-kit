import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const cli = path.join(repositoryRoot, 'bin', 'agents-md-starter-kit.js');

function run(arguments_, cwd = repositoryRoot) {
  return spawnSync(process.execPath, [cli, ...arguments_], {
    cwd,
    encoding: 'utf8',
  });
}

test('shows help and the GitHub npx command', () => {
  const result = run(['--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /npx --yes github:sunxiayi\/agents-md-starter-kit/);
});

test('lists every available template', () => {
  const result = run(['--list']);
  assert.equal(result.status, 0);
  for (const name of ['minimal', 'monorepo', 'python', 'nextjs'])
    assert.match(result.stdout, new RegExp(`^${name}\\s`, 'm'));
});

test('copies the selected template and creates parent directories', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'agents-md-kit-'));
  try {
    const result = run(
      ['--template', 'python', '--output', 'docs/AGENTS.md'],
      directory,
    );
    assert.equal(result.status, 0, result.stderr);
    const output = await readFile(path.join(directory, 'docs/AGENTS.md'), 'utf8');
    assert.match(output, /^# Python repository instructions/m);
    assert.match(result.stdout, /utm_source=github-cli/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('refuses to overwrite by default and supports an explicit force flag', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'agents-md-kit-'));
  const destination = path.join(directory, 'AGENTS.md');
  try {
    await writeFile(destination, 'keep me\n');
    const refused = run([], directory);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /already exists/);
    assert.equal(await readFile(destination, 'utf8'), 'keep me\n');

    const replaced = run(['--template', 'nextjs', '--force'], directory);
    assert.equal(replaced.status, 0, replaced.stderr);
    assert.match(
      await readFile(destination, 'utf8'),
      /^# Next\.js repository instructions/m,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('rejects an unknown template without writing a file', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'agents-md-kit-'));
  try {
    const result = run(['--template', '../private'], directory);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /unknown template/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
