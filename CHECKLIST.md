# AGENTS.md review checklist

Use this checklist when adding or changing repository instructions.

## Commands

- [ ] The install command works from a clean checkout.
- [ ] The test command is the smallest command that proves the changed behavior.
- [ ] Lint, type-check, build, and formatting commands are named when required.
- [ ] Commands do not depend on an unexplained local alias or global package.

## Repository map

- [ ] Important directories have a short purpose statement.
- [ ] Package or service boundaries are explicit.
- [ ] Generated files and their source files are identified.
- [ ] Nested instruction files are used only where scope genuinely differs.

## Safety

- [ ] Secrets, production data, and destructive commands are out of scope or
      guarded by a clear approval rule.
- [ ] Migrations, dependency changes, and public API changes have an explicit
      review or verification step.
- [ ] The file contains no credentials, personal data, or private URLs.

## Completion

- [ ] The definition of done describes observable evidence.
- [ ] Documentation changes are required when behavior or commands change.
- [ ] Tool-specific bridge files do not contradict the canonical instructions.

You can also run the free browser-based
[AGENTS.md checker](https://repoagentkit.com/audit?utm_source=github-starter-kit&utm_medium=repository&utm_campaign=agents-md-checklist).
