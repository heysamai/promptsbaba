# PromptsBaba Foundation Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver a reviewable local PromptsBaba foundation without inheriting upstream accounts or unsupported claims.

**Architecture:** Retain Astro static pages and JSON content with a Vercel MCP function. Share a small site identity module between website configuration, metadata and API. Telemetry is opt-in and absent by default.

**Tech Stack:** Existing Astro, Tailwind, Node and sharp; no new dependencies.

**Spec:** docs/superpowers/specs/2026-11-15-promptsbaba-foundation-design.md

## Global Constraints

- Preserve imported prompt data and the original MIT copyright notice.
- Use supplied brand colors; default to dark; keep light mode accessible.
- No invented ownership, contact information, testing badges or MCP counts.
- No commits, pushes, deployment or account changes.
- Work on local branch codex/promptsbaba-foundation in the user's checkout; preserve existing untracked tooling.

## Review Focus

- No configured telemetry: reading and copying prompts must send no upstream counter requests.
- Missing contact/repository: no dead links or upstream identity masquerading as the fork.
- Browser search, prompt placeholders and copy must still work.
- Light/dark and mobile layouts must remain legible and usable.
- Metadata, assets and MCP output must agree on the new identity.

## Task 1: Identity and ownership

- [x] Add src/site.config.mjs and use it in Astro, SEO, MCP catalog and shared layout.
- [x] Update MCP protocol assertions for PromptsBaba and add a failing default-telemetry regression test.
- [x] Disable counters and MCP telemetry without explicitly configured endpoints; remove original donation/analytics destinations.
- [x] Update branding manifests, plugin, robots, governance and documentation; preserve upstream attribution.

## Task 2: Visual foundation

- [x] Apply the supplied palette and type roles, replace the logo/share assets, and default to dark mode.
- [x] Update navigation and hero with truthful counts; remove inherited donation and live counter UI.
- [x] Preserve working catalog routes, search and placeholder filling.

## Task 3: Verification

- [x] Run npm test and npm run build.
- [x] Verify generated artifacts contain the correct canonical URLs and no inherited account destinations.
- [x] Run browser checks for desktop/mobile, themes, search, and a filled/copied prompt.
- [x] Review diff, run graphify update ., and record remaining work.

## Execution record

The user requested that implementation proceed step by step following the prior recommendation. No additional approval gate is introduced for this reversible local stage. Identity fields not provided by the user stay blank. No repository or email is inferred. Existing tools remain in place. Plan and design are recorded without committing, per the user's workspace conventions.

## Verification record

- 30 Node tests passed, including a regression test observed failing before the default-off telemetry fix and passing afterward.
- Astro built 7,615 pages (the original donation route was removed; Vercel redirects it to credits).
- Real Chromium checks passed: dark by default, light preference survives reload, search returns image results for coffee, placeholder editing updates prompt text, the clipboard contains the edited text, and home/skills/connector pages have no viewport overflow at 390px.
- Browser request inspection observed no Supabase, Cloudflare analytics or donation requests in the tested flows. No JavaScript page errors were observed.
- Desktop, light, mobile and edited-prompt screenshots are under output/playwright/ (ignored).
- All root-relative links in generated HTML resolved during independent review; chip hover contrast and an inherited roadmap URL were corrected.
- Imported src/data files and LICENSE have no diff. No source collections were refreshed, no dependencies added, no commits made, no push and no deployment.
- Graphify AST refresh requires --force because donation/plugin files were intentionally removed/renamed. Astro parsing is partial in the installed parser, and SQL extraction lacks tree_sitter_sql; the application build and browser checks are the runtime evidence.

## Remaining stages

The MCP schema, imported listings, directory/detail pages and search coverage are now implemented; see 2026-11-15-mcp-directory.md. Individual server verification remains separate. Then practical guides/playbooks and optional newsletter signup. Personal saving/versioning remains a later product phase. Public email and private reporting channel remain unconfigured; the user supplied the repository URL only.
