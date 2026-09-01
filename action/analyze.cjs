'use strict';

function analyzeInstructions(content) {
  const text = content.toLowerCase();
  const lines = content.split('\n');
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const contains = (...terms) => terms.some((term) => text.includes(term));

  return [
    {
      key: 'purpose',
      label: 'Repository purpose',
      description: 'Explains what the project does so an agent can make relevant choices.',
      passed:
        words > 18 &&
        (contains(
          'project',
          'application',
          'service',
          'library',
          'dashboard',
          'repository',
        ) || /^#\s+.+/m.test(content)),
      weight: 14,
      fix: 'Describe what the repository does, who it serves, and its primary runtime.',
    },
    {
      key: 'stack',
      label: 'Stack and runtime',
      description: 'Names the language, framework, runtime, or package manager.',
      passed: contains(
        'typescript',
        'javascript',
        'python',
        'rust',
        'go ',
        'java',
        'react',
        'next.js',
        'node',
        'django',
        'rails',
        'npm',
        'pnpm',
        'yarn',
        'bun',
      ),
      weight: 10,
      fix: 'List the primary language, framework, runtime version, and package manager.',
    },
    {
      key: 'commands',
      label: 'Runnable commands',
      description: 'Provides copyable setup, build, test, lint, or development commands.',
      passed:
        /`[^`]*(npm|pnpm|yarn|bun|pytest|cargo|go test|gradle|mvn|make)[^`]*`/i.test(
          content,
        ) && contains('build', 'test', 'lint', 'dev', 'run'),
      weight: 18,
      fix: 'Add exact install, focused test, lint, and build commands in code formatting.',
    },
    {
      key: 'architecture',
      label: 'Architecture map',
      description: 'Points to important directories, boundaries, or established patterns.',
      passed: contains(
        'architecture',
        'repository structure',
        'project structure',
        'module boundaries',
        'src/',
        'app/',
        'packages/',
        'components/',
      ),
      weight: 12,
      fix: 'List the few directories and module boundaries an agent must understand.',
    },
    {
      key: 'validation',
      label: 'Validation loop',
      description: 'States which checks must run before work is complete.',
      passed:
        contains(
          'run the relevant',
          'tests pass',
          'test command',
          'before declaring',
          'before completing',
          'validation',
          'verify',
        ) && contains('test', 'build', 'lint', 'typecheck'),
      weight: 16,
      fix: 'Require relevant tests, type checks, lint, and the production build.',
    },
    {
      key: 'scope',
      label: 'Change boundaries',
      description: 'Prevents broad rewrites and keeps work aligned with the request.',
      passed: contains(
        'keep changes scoped',
        'avoid speculative',
        'do not refactor',
        'minimal change',
        'preserve the existing',
        'do not rewrite',
      ),
      weight: 10,
      fix: 'Require scoped changes, preserved architecture, and no speculative refactors.',
    },
    {
      key: 'safety',
      label: 'Safety guardrails',
      description: 'Protects secrets, user changes, migrations, and destructive operations.',
      passed: contains(
        'secret',
        'credential',
        'destructive',
        'user changes',
        'migration',
        'never overwrite',
        'do not delete',
      ),
      weight: 12,
      fix: 'Protect credentials and user changes; guard destructive commands and migrations.',
    },
    {
      key: 'done',
      label: 'Definition of done',
      description: 'Makes final evidence and handoff explicit.',
      passed:
        contains(
          'definition of done',
          'done when',
          'completion criteria',
          'handoff',
        ) && contains('verified', 'tests pass', 'what changed', 'remaining risk'),
      weight: 8,
      fix: 'State what must work, which checks pass, and what the final handoff reports.',
    },
    {
      key: 'focus',
      label: 'Focused length',
      description: 'Keeps the root file useful without burying critical rules.',
      passed: words >= 35 && words <= 900 && lines.length <= 220,
      weight: 0,
      fix:
        words < 35
          ? 'Add missing project-specific details; the file is too thin.'
          : 'Move path-specific guidance into nested files and remove enforced rules.',
    },
  ];
}

function instructionScore(results) {
  return results.reduce(
    (total, result) => total + (result.passed ? result.weight : 0),
    0,
  );
}

function instructionGrade(score) {
  if (score >= 86) return 'Ready to use';
  if (score >= 68) return 'Solid start';
  if (score >= 45) return 'Needs context';
  return 'Too thin';
}

function parseThreshold(value) {
  if (!/^\d{1,3}$/.test(value))
    throw new Error('fail_below must be a whole number from 0 to 100');
  const threshold = Number(value);
  if (threshold < 0 || threshold > 100)
    throw new Error('fail_below must be a whole number from 0 to 100');
  return threshold;
}

module.exports = {
  analyzeInstructions,
  instructionGrade,
  instructionScore,
  parseThreshold,
};
