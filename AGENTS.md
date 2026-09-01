# Repository instructions

## Purpose

This repository provides small, copy-ready AGENTS.md templates. A contribution
must make an instruction more accurate, easier to adapt, or safer to follow.

## Files

- `templates/`: starting points grouped by repository type.
- `bridges/`: deliberately small tool-specific compatibility files.
- `CHECKLIST.md`: review checklist shared by every template.

## Validation

Run these checks before finishing:

```sh
git diff --check
find . -type f -name '*.md' -print0 | xargs -0 grep -n '\[.*\]' || true
```

Bracketed placeholders are expected inside `templates/`; explain any new one in
the surrounding instruction. Do not add commands that have not been verified
for the named stack.

## Change rules

- Keep the minimal template under 120 lines.
- Prefer exact commands, paths, and observable completion criteria.
- Do not claim that every coding-agent product reads the same files.
- Keep tool-specific bridges shorter than the canonical template.
- Do not add credentials, private repository names, or personal data.

## Done means

- Markdown renders clearly on GitHub.
- All relative links resolve.
- Copying a template does not bring repository-specific instructions with it.
- The README table and template directory remain in sync.
