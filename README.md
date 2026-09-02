# AGENTS.md Starter Kit

Copy-ready AGENTS.md templates, a portable agent skill, a dependency-free
generator, and a GitHub Action for Codex, Claude Code, Cursor, GitHub Copilot,
Gemini CLI, and Windsurf. Start with one maintained `AGENTS.md`, replace the
bracketed placeholders, and add tool-specific bridge files only when your
workflow actually needs them.

[Audit this starter kit](https://repoagentkit.com/github-repo-audit?repo=sunxiayi%2Fagents-md-starter-kit&utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md&utm_content=readme-self-audit)
· [Generate from a GitHub repository](https://repoagentkit.com/github-to-agents-md?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md&utm_content=readme-hero)
· [Check an AGENTS.md file](https://repoagentkit.com/audit?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md&utm_content=readme-hero)
· [Compare AGENTS.md and CLAUDE.md](https://repoagentkit.com/agents-md-vs-claude-md?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md&utm_content=readme-hero)
· [Scan instruction security](https://repoagentkit.com/agent-instruction-security-scanner?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md-security&utm_content=readme-hero)

## Start in 60 seconds

Run the dependency-free CLI from GitHub:

```sh
npx --yes github:sunxiayi/agents-md-starter-kit
```

Choose a stack-specific starting point when useful:

```sh
npx --yes github:sunxiayi/agents-md-starter-kit --template nextjs
```

The CLI refuses to replace an existing `AGENTS.md` unless you explicitly add
`--force`. It performs no telemetry or network request after installation. Run
with `--list` or `--help` to see every option.

Prefer GitHub CLI? Install the companion extension once, then create a file with
the same bundled templates:

```sh
gh extension install sunxiayi/gh-agents-md
gh agents-md init
```

The [`gh-agents-md`](https://github.com/sunxiayi/gh-agents-md) extension also
prints repository-prefilled Repo Agent Kit audit and generator links with
`gh agents-md audit` and `gh agents-md generate`. It does not open a browser or
send repository data during `init`.

Alternatively, copy the minimal template directly:

```sh
curl -fsSL https://raw.githubusercontent.com/sunxiayi/agents-md-starter-kit/main/templates/minimal/AGENTS.md -o AGENTS.md
```

Then:

1. Put the selected `AGENTS.md` at the root of your repository.
2. Replace every `[bracketed placeholder]` with a real command or path.
3. Run each command once. Remove instructions that are not true.
4. Ask your coding agent to read the file before its next change.

## Use one source with Codex and Claude Code

Codex uses `AGENTS.md` as repository instructions. Claude Code uses
`CLAUDE.md`, so this kit includes a small import bridge that keeps
`AGENTS.md` as the maintained source:

```sh
cp bridges/CLAUDE.md CLAUDE.md
```

The bridge contains `@AGENTS.md` plus a short maintenance note. Add
Claude-specific instructions there only when they cannot live in the shared
file. See the
[file-by-file decision guide](https://repoagentkit.com/agents-md-vs-claude-md?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md&utm_content=claude-bridge)
for shared and separate-file setups.

## Pick the closest starting point

| Template | Best for | What it emphasizes |
| --- | --- | --- |
| [Minimal](templates/minimal/AGENTS.md) | Any small repository | Exact setup, test, and completion commands |
| [Monorepo](templates/monorepo/AGENTS.md) | Multi-package repositories | Package ownership and scoped checks |
| [Python](templates/python/AGENTS.md) | Python libraries and services | Virtual environments, linting, typing, and tests |
| [Next.js](templates/nextjs/AGENTS.md) | Next.js applications | App Router boundaries, validation, and secrets |

The root [`AGENTS.md`](AGENTS.md) is a filled example for this repository, not a
universal template.

## Install the agent skills

Install the evidence-based `create-agentsmd` skill for Codex, Claude Code,
Cursor, GitHub Copilot, or another Agent Skills-compatible tool:

```sh
npx skills add sunxiayi/agents-md-starter-kit --skill create-agentsmd
```

The skill creates, revises, or audits `AGENTS.md` from repository evidence. It
preserves accurate maintainer rules, verifies commands against manifests and
CI, handles nested monorepo scope, and avoids guessed or unsafe instructions.
It is stored at [`skills/create-agentsmd/SKILL.md`](skills/create-agentsmd/SKILL.md)
and can also be copied directly.

Install the companion `scan-agent-instructions` skill to review instruction
files before a coding agent trusts them:

```sh
npx skills add sunxiayi/agents-md-starter-kit --skill scan-agent-instructions
```

It locates the instruction surfaces used by major coding agents, runs the
immutable v1.1.2 scanner locally, reviews every match in context, and reports
evidence without executing instruction content or claiming that a clean scan
proves safety. The source is stored at
[`skills/scan-agent-instructions/SKILL.md`](skills/scan-agent-instructions/SKILL.md).

## Keep instruction quality checked in CI

Add the public GitHub Action to a workflow after checking out the repository:

```yaml
- name: Check AGENTS.md readiness
  uses: sunxiayi/agents-md-starter-kit@v1
  with:
    path: AGENTS.md
    fail_below: '45'
```

The Action applies the same deterministic 100-point checks as the browser tool,
adds a Markdown report to the job summary, and exposes `score`, `grade`, and
`report_url` outputs. It reads only the selected repository-relative file,
rejects paths outside the workspace, uses no secrets, and makes no network
request.

Set `fail_below` to `0` for a report-only rollout. The default `45` blocks only
the `Too thin` grade, allowing teams to improve the file incrementally.

## Scan instructions before an agent trusts them

Review repository instructions for hidden Unicode, download-and-execute chains,
secret transfer, permission bypasses, destructive commands, and encoded
execution before a coding agent reads them. The
[browser security scanner](https://repoagentkit.com/agent-instruction-security-scanner?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md-security&utm_content=security-workflow)
accepts any public GitHub repository. To scan the current checkout locally:

```sh
npx --yes github:sunxiayi/repo-agent-instruction-security-scan#v1.1.2 .
```

The zero-dependency scanner executes none of the instruction content, makes no
network request during scanning, and collects no telemetry. It emits text,
JSON, or SARIF 2.1.0 and includes a pre-commit hook and GitHub Action. Findings
are deterministic review prompts, not proof that a repository is safe or
malicious.

## Keep one source of truth

Instruction drift starts when `AGENTS.md`, `CLAUDE.md`, Copilot instructions,
and editor rules are maintained independently. Prefer this order:

1. Keep repository-wide commands, boundaries, and completion rules in
   `AGENTS.md`.
2. Add a tool-native bridge only if a selected tool or surface requires it.
3. Keep the bridge short and point back to the maintained source when that
   tool supports imports.
4. Review all instruction files together whenever a command or directory moves.

[`bridges/CLAUDE.md`](bridges/CLAUDE.md) shows the small Claude Code import
pattern. Support differs by product and surface, so confirm the current plan
before adding more files.

## Free browser tools

- [Check an AGENTS.md file and compare instruction drift](https://repoagentkit.com/audit?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md)
- [Scan AGENTS.md, CLAUDE.md, and editor instructions for risky patterns](https://repoagentkit.com/agent-instruction-security-scanner?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md-security&utm_content=free-tools)
- [Convert CLAUDE.md or editor rules to AGENTS.md](https://repoagentkit.com/instruction-file-converter?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md)
- [Plan files for Codex, Claude Code, Cursor, Copilot, Gemini CLI, and Windsurf](https://repoagentkit.com/ai-agent-instruction-files?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md)
- [Generate AGENTS.md from a public GitHub repository](https://repoagentkit.com/github-to-agents-md?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md)

The file checker and converter run in the browser. Pasted instruction text is
not uploaded.

## A useful AGENTS.md is evidence, not aspiration

Before committing a file, verify that it answers these questions:

- What command installs the project from a clean checkout?
- What is the smallest relevant test command?
- Which lint, type, or build checks are required?
- Which directories own which behavior?
- Which files are generated or sensitive?
- What must be true before the work is considered complete?

Use [`CHECKLIST.md`](CHECKLIST.md) for a pull-request review.

## Contributing

Small corrections and additional evidence-backed templates are welcome. Keep
examples runnable, avoid invented commands, and explain any tool-specific claim
with an official documentation link in the pull request.

## License

MIT
