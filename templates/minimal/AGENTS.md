# Repository instructions

## Project context

- Purpose: [one sentence describing what this repository ships]
- Primary runtime: [language and version]
- Package manager: [tool and version]

## Repository map

- `[path]`: [what this directory owns]
- `[path]`: [what this directory owns]
- `[path]`: [tests, fixtures, or documentation]

## Setup

From a clean checkout:

```sh
[exact install command]
```

## Required checks

Run the smallest relevant test while iterating, then run the full required set
before finishing:

```sh
[unit test command]
[lint or format-check command]
[type-check or build command]
```

## Change rules

- Follow existing patterns in the package that owns the behavior.
- Keep public interfaces backward compatible unless the task requires a breaking
  change.
- Do not edit generated files; update `[source path or generator command]`.
- Do not add or expose secrets, credentials, or production data.
- Update documentation when a command, configuration key, or public behavior
  changes.

## Done means

- The requested behavior works and has focused test coverage.
- Required checks pass.
- The diff contains no unrelated changes or sensitive data.
- User-visible behavior and migration steps are documented when relevant.
