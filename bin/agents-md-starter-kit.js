#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const packageJson = JSON.parse(
  await readFile(path.join(packageRoot, 'package.json'), 'utf8'),
);

const templates = {
  minimal: 'Small repositories and a general starting point',
  monorepo: 'Multi-package repositories with ownership boundaries',
  python: 'Python libraries and services',
  nextjs: 'Next.js applications',
};

const auditUrl =
  'https://repoagentkit.com/audit?utm_source=github-cli&utm_medium=package&utm_campaign=agents-md';

const help = `AGENTS.md Starter Kit ${packageJson.version}

Copy a focused instruction template into the current repository.

Usage:
  agents-md-starter-kit [options]

Options:
  -t, --template <name>  minimal, monorepo, python, or nextjs (default: minimal)
  -o, --output <path>    destination file (default: AGENTS.md)
  -f, --force            replace an existing destination file
      --dry-run          print the selected template without writing it
      --list             list available templates
  -v, --version          print the version
  -h, --help             show this help

Examples:
  npx --yes github:sunxiayi/agents-md-starter-kit
  npx --yes github:sunxiayi/agents-md-starter-kit --template nextjs
  npx --yes github:sunxiayi/agents-md-starter-kit -t python -o docs/AGENTS.md
`;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

function parseArguments(argv) {
  const options = {
    template: 'minimal',
    output: 'AGENTS.md',
    force: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '-h' || argument === '--help') return { action: 'help' };
    if (argument === '-v' || argument === '--version')
      return { action: 'version' };
    if (argument === '--list') return { action: 'list' };
    if (argument === '-f' || argument === '--force') {
      options.force = true;
      continue;
    }
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (argument === '-t' || argument === '--template') {
      const value = argv[index + 1];
      if (!value || value.startsWith('-'))
        return { error: `${argument} requires a template name` };
      options.template = value.toLowerCase();
      index += 1;
      continue;
    }
    if (argument === '-o' || argument === '--output') {
      const value = argv[index + 1];
      if (!value || value.startsWith('-'))
        return { error: `${argument} requires a destination path` };
      options.output = value;
      index += 1;
      continue;
    }

    return { error: `unknown option ${argument}` };
  }

  return { action: 'copy', options };
}

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const result = parseArguments(process.argv.slice(2));

  if (result.error) {
    fail(`${result.error}. Run with --help for usage.`);
    return;
  }
  if (result.action === 'help') {
    console.log(help);
    return;
  }
  if (result.action === 'version') {
    console.log(packageJson.version);
    return;
  }
  if (result.action === 'list') {
    for (const [name, description] of Object.entries(templates))
      console.log(`${name.padEnd(9)} ${description}`);
    return;
  }

  const { options } = result;
  if (!Object.hasOwn(templates, options.template)) {
    fail(
      `unknown template "${options.template}". Choose ${Object.keys(templates).join(', ')}.`,
    );
    return;
  }

  const source = path.join(
    packageRoot,
    'templates',
    options.template,
    'AGENTS.md',
  );

  if (options.dryRun) {
    process.stdout.write(await readFile(source, 'utf8'));
    return;
  }

  const destination = path.resolve(process.cwd(), options.output);
  if (await exists(destination)) {
    const destinationStats = await stat(destination);
    if (destinationStats.isDirectory()) {
      fail(`destination is a directory: ${options.output}`);
      return;
    }
    if (!options.force) {
      fail(
        `${options.output} already exists. Use --force only if replacing it is intentional.`,
      );
      return;
    }
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);

  console.log(`Created ${options.output} from the ${options.template} template.`);
  console.log('Replace every bracketed placeholder, then run each command once.');
  console.log(`Review the finished file: ${auditUrl}`);
}

await run();
