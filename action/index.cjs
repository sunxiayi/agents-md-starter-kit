#!/usr/bin/env node
'use strict';

const { appendFile, readFile } = require('node:fs/promises');
const path = require('node:path');

const {
  analyzeInstructions,
  instructionGrade,
  instructionScore,
  parseThreshold,
} = require('./analyze.cjs');

const reportUrl =
  'https://repoagentkit.com/audit?utm_source=github-action&utm_medium=ci&utm_campaign=agents-md';

function commandEscape(value) {
  return String(value)
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A');
}

function annotation(level, title, message) {
  console.log(
    `::${level} title=${commandEscape(title)}::${commandEscape(message)}`,
  );
}

async function setOutputs(values) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const body = Object.entries(values)
    .map(([key, value]) => `${key}=${String(value).replaceAll('\n', ' ')}`)
    .join('\n');
  await appendFile(outputPath, `${body}\n`, 'utf8');
}

function resolveWorkspaceFile(workspace, inputPath) {
  const resolvedWorkspace = path.resolve(workspace);
  const resolvedFile = path.resolve(resolvedWorkspace, inputPath);
  const relative = path.relative(resolvedWorkspace, resolvedFile);
  if (relative.startsWith('..') || path.isAbsolute(relative))
    throw new Error('path must stay inside GITHUB_WORKSPACE');
  return resolvedFile;
}

function summaryMarkdown(inputPath, score, grade, threshold, results) {
  const rows = results
    .map(
      (result) =>
        `| ${result.passed ? 'Pass' : 'Review'} | ${result.label} | ${result.weight} | ${result.passed ? result.description : result.fix} |`,
    )
    .join('\n');
  const safePath = inputPath.replaceAll('`', '\\`');

  return `## AGENTS.md readiness: ${score}/100 — ${grade}

Checked \`${safePath}\` with a failure threshold of ${threshold}.

| Result | Check | Points | Evidence or next step |
| --- | --- | ---: | --- |
${rows}

[Review or improve the file privately in your browser](${reportUrl}). Pasted text is not uploaded.
`;
}

async function run() {
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  const inputPath = (process.env.INPUT_PATH || 'AGENTS.md').trim();
  const threshold = parseThreshold(
    (process.env.INPUT_FAIL_BELOW || '45').trim(),
  );
  const filePath = resolveWorkspaceFile(workspace, inputPath);

  let content;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT')
      throw new Error(`instruction file not found: ${inputPath}`);
    throw error;
  }

  const results = analyzeInstructions(content);
  const score = instructionScore(results);
  const grade = instructionGrade(score);

  for (const result of results) {
    if (!result.passed)
      annotation('warning', `Review: ${result.label}`, result.fix);
  }

  await setOutputs({ score, grade, report_url: reportUrl });

  const summary = summaryMarkdown(
    inputPath,
    score,
    grade,
    threshold,
    results,
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
  else console.log(summary);

  if (score < threshold) {
    annotation(
      'error',
      'AGENTS.md readiness threshold not met',
      `${score}/100 is below the configured threshold of ${threshold}.`,
    );
    process.exitCode = 1;
    return;
  }

  annotation(
    'notice',
    'AGENTS.md readiness check passed',
    `${score}/100 meets the configured threshold of ${threshold}.`,
  );
}

run().catch((error) => {
  annotation('error', 'AGENTS.md readiness check failed', error.message);
  process.exitCode = 1;
});

module.exports = { resolveWorkspaceFile, summaryMarkdown };
