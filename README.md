# AGENTS.md Starter Kit

Copy-ready instruction files for AI coding agents. Start with one maintained
`AGENTS.md`, replace the bracketed placeholders, and add tool-specific bridge
files only when your workflow actually needs them.

## Start in 60 seconds

1. Copy [`templates/minimal/AGENTS.md`](templates/minimal/AGENTS.md) to the root
   of your repository.
2. Replace every `[bracketed placeholder]` with a real command or path.
3. Run each command once. Remove instructions that are not true.
4. Ask your coding agent to read the file before its next change.

```sh
curl -fsSL https://raw.githubusercontent.com/sunxiayi/agents-md-starter-kit/main/templates/minimal/AGENTS.md -o AGENTS.md
```

## Pick the closest starting point

| Template | Best for | What it emphasizes |
| --- | --- | --- |
| [Minimal](templates/minimal/AGENTS.md) | Any small repository | Exact setup, test, and completion commands |
| [Monorepo](templates/monorepo/AGENTS.md) | Multi-package repositories | Package ownership and scoped checks |
| [Python](templates/python/AGENTS.md) | Python libraries and services | Virtual environments, linting, typing, and tests |
| [Next.js](templates/nextjs/AGENTS.md) | Next.js applications | App Router boundaries, validation, and secrets |

The root [`AGENTS.md`](AGENTS.md) is a filled example for this repository, not a
universal template.

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
