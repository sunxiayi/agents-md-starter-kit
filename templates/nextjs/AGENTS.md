# Next.js repository instructions

## Stack and layout

- Next.js: `[version]` using `[App Router or Pages Router]`
- Package manager: `[pnpm, npm, yarn, or bun]`
- Routes: `[app/ or pages/]`
- Shared UI: `[components path]`
- Server logic and data access: `[paths]`

## Setup

```sh
[locked install command]
[development command]
```

## Required checks

```sh
[focused test command]
[lint command]
[type-check command, if separate]
[production build command]
```

## Next.js boundaries

- Keep components server-rendered unless browser state, effects, or event
  handlers require a client boundary.
- Never import server-only code, secrets, or privileged clients into a client
  component.
- Validate untrusted input at route-handler and server-action boundaries.
- Preserve loading, empty, error, and success states for changed flows.
- Use the framework metadata APIs for titles, descriptions, canonicals, and
  share cards.
- Reuse established UI primitives and design tokens before creating new ones.

## Data and caching

- State whether changed data is static, cached, revalidated, or request-time.
- Invalidate or tag the same cache layer that owns the changed data.
- Do not expose a secret through `NEXT_PUBLIC_*`.
- Keep database migrations and environment-variable documentation aligned with
  the code that consumes them.

## Done means

- The affected route works at narrow and wide layouts.
- Keyboard and accessible-name behavior remains correct for changed controls.
- Focused tests and the production build pass.
- No server secret or private data appears in the client bundle or logs.
