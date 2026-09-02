import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const releaseUrl =
  'https://github.com/sunxiayi/repo-agent-instruction-security-scan/' +
  'releases/tag/v1.2.0';
const releaseDigest =
  'd47c96668525357f60d0b9528118bc668f8eaabf7e2fd0fe87809536115851da';

test('keeps scanner guidance on the verified release without remote bootstrap', async () => {
  const readme = await readFile(path.join(repositoryRoot, 'README.md'), 'utf8');
  const skill = await readFile(
    path.join(repositoryRoot, 'skills', 'scan-agent-instructions', 'SKILL.md'),
    'utf8',
  );
  const packageJson = JSON.parse(
    await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'),
  );

  assert.match(readme, new RegExp(releaseUrl.replaceAll('.', '\\.')));
  assert.match(readme, new RegExp(releaseDigest));
  assert.equal(packageJson.version, '1.4.2');
  assert.match(skill, /already installed before this task/);
  assert.match(skill, /repo-agent-scan --version/);
  assert.doesNotMatch(skill, /releases\/download|npx\s+https?:|curl\s|wget\s/);

  for (const document of [readme, skill]) {
    assert.doesNotMatch(document, /v1\.1\.2/);
    assert.doesNotMatch(document, /v1\.1\.3/);
    assert.doesNotMatch(document, /4e0a03940411c3a6a79f28b5e0c200838884486d/);
  }
});
