# Monorepo instructions

## Scope and ownership

- `apps/[name]`: [deployable application and owner]
- `packages/[name]`: [shared package and consumers]
- `tooling/[name]`: [shared build, lint, or release configuration]

Make a change in the package that owns the behavior. Do not reach into another
package's private source or duplicate a shared contract inside an application.

## Setup

```sh
[workspace package-manager install command]
```

Use the lockfile at the repository root. Do not create nested lockfiles.

## Iteration commands

Run checks for the affected workspace first:

```sh
[package-manager] --filter [workspace] test
[package-manager] --filter [workspace] lint
[package-manager] --filter [workspace] typecheck
```

Before finishing, run the repository-wide gates:

```sh
[full test command]
[full lint command]
[full build command]
```

## Dependency boundaries

- Applications may depend on shared packages; shared packages must not depend on
  applications.
- Import public package entry points, not another package's internal files.
- Update every affected consumer when a shared type or API changes.
- Explain and validate any dependency-graph or lockfile change.

## Generated and deployed artifacts

- Do not hand-edit `[generated paths]`; run `[generator command]`.
- Keep environment-specific values out of source control.
- Test a deployable application with its own build command after changing a
  shared package it consumes.

## Done means

- Focused checks pass for every affected workspace.
- Repository-wide required gates pass.
- Package boundaries remain valid.
- Changes to shared contracts include consumer coverage or migration notes.
