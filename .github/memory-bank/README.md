# RIPER Memory Bank (GitHub Copilot)

This folder is the **only** allowed location for RIPER artifacts when using GitHub Copilot in this repo.

## Structure

Artifacts are stored by `branchSlug` (a normalized version of the git branch name):

- Replace `/` and `\\` with `-`
- Replace any non `[A-Za-z0-9-]` with `-`
- Collapse multiple `-` into one, trim leading/trailing `-`

- `.github/memory-bank/<branchSlug>/plans/`
- `.github/memory-bank/<branchSlug>/reviews/`
- `.github/memory-bank/<branchSlug>/sessions/`

If the branch cannot be determined, use: `unknown-branch`.

## Naming

Use:

- If a ticket id is available (format: `^[A-Za-z]+-\d+$`):
	- Plans/Reviews/Sessions: `<TICKET>-YYYY-MM-DD-<branchSlug>.md`
		- Example: `EN-1234-2026-02-13-feature-user-auth.md`
- Otherwise:
	- Plans: `<branchSlug>-YYYY-MM-DD-<topic>.md`
	- Reviews: `<branchSlug>-YYYY-MM-DD-<topic>.md`
	- Sessions: `<branchSlug>-YYYY-MM-DD-<title>.md`

## Notes
- These artifacts are intended to be committed so the team has a durable history of decisions, plans, and reviews.
