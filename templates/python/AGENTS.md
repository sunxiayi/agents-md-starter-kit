# Python repository instructions

## Runtime and layout

- Supported Python: `[version range]`
- Environment manager: `[uv, Poetry, pip-tools, or other]`
- Application code: `[src/package or service path]`
- Tests: `[tests path]`

## Setup

Create an isolated environment and install locked dependencies:

```sh
[exact environment and install command]
```

Do not add a second dependency manager or regenerate the lockfile unless the
task changes dependencies.

## Required checks

```sh
[focused pytest command]
[ruff or configured lint command]
[mypy, pyright, or configured type-check command]
[full pytest command]
```

Use the repository's configured tools and settings. Do not add blanket
`# noqa`, `type: ignore`, or warning filters to hide a real defect.

## Python change rules

- Preserve supported Python versions and public import paths.
- Add type annotations at the same boundary and strictness used nearby.
- Keep I/O, time, randomness, and external services injectable in tested code.
- Do not make network calls in unit tests.
- Generate migrations with the project's migration tool; never rewrite an
  applied migration unless the project explicitly permits it.
- Do not log secrets, access tokens, or complete user payloads.

## Done means

- The focused regression test fails before the fix and passes after it when
  practical.
- Linting, typing, and the relevant test suite pass.
- Dependency or schema changes include their lockfile or migration artifact.
- Public behavior changes are documented.
