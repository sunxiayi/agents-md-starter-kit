'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const {
  analyzeInstructions,
  instructionGrade,
  instructionScore,
  parseThreshold,
} = require('../action/analyze.cjs');

const repositoryRoot = path.resolve(__dirname, '..');
const runner = path.join(repositoryRoot, 'action', 'index.cjs');

test('keeps the deterministic score and grade thresholds stable', () => {
  const content = `# Repository instructions

This Node project ships a small application.

## Architecture
- \`src/\`: application code

## Commands
- \`npm test\`: run tests
- \`npm run build\`: build production output

## Validation
Verify tests pass before completing a change.

## Change boundaries
Keep changes scoped and preserve the existing architecture.

## Safety
Never expose secrets or credentials. Do not delete user changes.

## Definition of done
Done when the behavior is verified, tests pass, and the handoff states what changed and any remaining risk.
`;
  const score = instructionScore(analyzeInstructions(content));
  assert.equal(score, 100);
  assert.equal(instructionGrade(score), 'Ready to use');
  assert.equal(instructionGrade(68), 'Solid start');
  assert.equal(instructionGrade(45), 'Needs context');
  assert.equal(instructionGrade(44), 'Too thin');
});

test('validates the configured failure threshold', () => {
  assert.equal(parseThreshold('0'), 0);
  assert.equal(parseThreshold('100'), 100);
  assert.throws(() => parseThreshold('-1'), /0 to 100/);
  assert.throws(() => parseThreshold('101'), /0 to 100/);
  assert.throws(() => parseThreshold('4.5'), /0 to 100/);
});

test('runs against a workspace file and writes outputs and a summary', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'agents-md-action-'));
  try {
    const output = path.join(directory, 'output.txt');
    const summary = path.join(directory, 'summary.md');
    await writeFile(
      path.join(directory, 'AGENTS.md'),
      '# Project\n\nThis Node project uses npm. Run `npm test` to verify tests.\n',
    );

    const result = spawnSync(process.execPath, [runner], {
      cwd: directory,
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_WORKSPACE: directory,
        GITHUB_OUTPUT: output,
        GITHUB_STEP_SUMMARY: summary,
        INPUT_PATH: 'AGENTS.md',
        INPUT_FAIL_BELOW: '0',
      },
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(await readFile(output, 'utf8'), /^score=\d+/m);
    assert.match(await readFile(output, 'utf8'), /report_url=.*utm_source=github-action/);
    assert.match(await readFile(summary, 'utf8'), /AGENTS\.md readiness:/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('fails closed for a path outside the workspace', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'agents-md-action-'));
  try {
    const result = spawnSync(process.execPath, [runner], {
      cwd: directory,
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_WORKSPACE: directory,
        INPUT_PATH: '../outside.md',
        INPUT_FAIL_BELOW: '0',
      },
    });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /path must stay inside GITHUB_WORKSPACE/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
