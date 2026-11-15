# MCP Directory Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish a source-attributed MCP catalog from the user-selected repository in the local PromptsBaba site.

**Architecture:** Pure Markdown normalizer plus a network importer generate committed JSON. Astro renders directory, category and detail pages; browser keyword filtering reuses the compact shared search index.

**Tech Stack:** Existing Astro, Tailwind, Node standard library; no new dependencies.

**Spec:** docs/superpowers/specs/2026-11-15-mcp-directory-design.md

## Global Constraints

- Preserve current branding, prompt catalog, source licenses and unrelated local edits.
- Fetch only the supplied public repository and pin each import to one commit.
- No implied server license, safety, free use, transport or tested compatibility.
- No upstream operator integrations, external writes, installs, commits or deployment.

## Review Focus

- Changed README formatting must fail clearly rather than overwrite a usable catalog with an empty import.
- Duplicate projects retain all category memberships and stable URLs.
- Source prose is untrusted; no HTML execution or unsafe destination links.
- Directory filter reset/empty states and browser history remain usable.
- Existing prompt search, skills and the library connector retain working links.

## Task 1: Source importer

- [x] Write parser tests first and observe failures.
- [x] Implement scripts/lib/mcp-catalog.mjs and scripts/import-mcp.mjs.
- [x] Fetch a pinned README and license, retain MIT notice, generate src/data/mcp-servers.json, add import:mcp scripts.

## Task 2: Directory

- [x] Add typed data access, shared MCP cards and list/detail views with static routes and category pagination.
- [x] Add client filtering through generated search index and persistent query parameters.
- [x] Link navigation/homepage/credits and sitemap/llms metadata to the real directory count.

## Task 3: Search and verification

- [x] Include MCP records and skills in the existing global search, preserving prompt result formats.
- [x] Run unit tests, full build, provenance/link assertions and desktop/mobile browser flows.
- [x] Request read-only code review, resolve material findings, update graphify and record results.

## Verification record

- Source revision: f431a5cd95cebf038e587715635b9d1a0a4d0c02; 4,611 unique project records in 59 categories. The snapshot carries README and MIT license together. Cached re-import succeeds without network access.
- 37 Node tests pass, including parser, source-provenance and catalog-integrity tests. Existing prompt data and LICENSE remain unchanged.
- Production build passes with 12,519 static pages.
- Real Chromium checks pass for 36 static initial results, keyword and Python filters, filter persistence after reload, empty state, reset, incremental results, category/detail routes, global server and skill search, existing image prompt search, and mobile overflow. No page JavaScript errors observed.
- Independent read-only code review found no material issues. Descriptions render as escaped text, destination links require HTTPS GitHub URLs without credentials, and project subpaths retain case.
- All generated MCP pages' root-relative links and sitemap coverage were checked. Screenshots are in ignored output/playwright/.
- Graphify updated after code changes. Its Astro extraction remains partial and SQL parsing dependency is absent; runtime claims use the build and browser checks.
- No server code was installed or executed. No per-server license, transport, pricing, maintenance or client compatibility was independently verified. No automatic refresh schedule, commits, pushes or deployment.
