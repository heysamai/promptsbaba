# Developing PromptsBaba

Setup, configuration, source imports and deployment notes for contributors.
For using the library, see the [project overview](../README.md).

## Development

Requires Node 22 or newer. The catalog is committed, so no import is required to start.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The Astro dev server serves the static website. The `/api/mcp` function is a Vercel endpoint; `npm test` exercises its real handler locally without sending usage telemetry. Astro dev/preview alone does not host the Vercel function.

## Current build

PromptsBaba includes a dark/light theme, shared site settings, the supplied logo kit, a source-attributed MCP directory, and no inherited operator integrations. The committed catalog snapshot has 2,643 image, 957 video and 3,707 text prompt records, plus 19 official skill entries and 48 community repository listings. Counts in the website are derived from data. These listings have not all been independently tested.

The MCP directory now contains 6,277 source-listed entries in 74 categories (4,611 self-hosted projects and 1,666 remote endpoints) from the snapshot below. Global browser search includes MCP projects and skill listings alongside prompts. Guides and personal saved prompts remain later milestones.

## Configuration

Edit `src/site.config.mjs` for the public name, domain, GitHub repository, maintainer and contact email. Keep `astro.config.mjs`, `public/robots.txt`, `vercel.json`, plugin metadata and `server.json` aligned when changing the domain. The supplied repository is https://github.com/heysamai/promptsbaba. The site is maintained by Sam, with public contact at hustlersanta@gmail.com. Content-removal requests can use that address or the linked GitHub issue form. Follow `SECURITY.md` for vulnerability reports.

The homepage includes a support CTA; its button remains disabled until a donation destination is supplied. No analytics or donation integration is enabled. Copy counters and aggregate MCP usage are opt-in. To use your own Supabase counters, set `PUBLIC_COUNTER_RPC_URL` (the `/rest/v1/rpc` base URL) and `PUBLIC_COUNTER_KEY` (a publishable key) at build time for the browser and in the Vercel function environment. Do not use a service-role key. The copy RPCs must implement `mt_copy_get` and `mt_copy_bump`; their provisioning SQL is not supplied by the upstream project. `supabase/mcp-usage.sql` provisions only MCP usage RPCs. `MCP_USAGE=off` disables MCP usage even when configured. `npm run stats:mcp` requires your own counter settings.

## Library connector

Browse the third-party directory at `/mcp-servers`, category pages at `/mcp-servers/category/{category}`, and individual listings at `/mcp-servers/{slug}`. The directory and the library connector are separate features.

The read-only MCP handler in `api/mcp.js` offers `search_prompts`, `get_prompt`, `list_filters`, and `random_prompt`. It currently searches prompt records only. After deployment, its URL is `https://promptsbaba.com/api/mcp`. This address and the plugin manifest are configuration, not evidence of a live deployment or official registry listing. `/mcp` documents the library connector. Its tools still search prompt records only; directory browsing does not install or execute the listed servers.

## Content pipeline

`npm run import` builds `src/data/*.json` from `sources/`, fetching missing sources. `npm run import:fresh` refreshes upstream files first. These commands overwrite generated data; add original editorial metadata separately rather than editing imported prompts by hand. Imports are manually triggered and read each collection directly from its own GitHub repository. Sample images and video remain externally hosted.

For an authenticated refresh (recommended to avoid GitHub's anonymous rate limit):

```sh
GITHUB_TOKEN="$(gh auth token --hostname github.com)" npm run import:fresh
GITHUB_TOKEN="$(gh auth token --hostname github.com)" npm run import:mcp:fresh
npm test
npm run build
```

`src/data/source-sync.json` records the exact upstream commits and SHA-256 hashes of downloaded prompt files, official skill source revisions, and metadata-check revisions for all configured community repositories. `src/data/mcp-servers.json` separately retains pinned MCP collection commits. No application-fork release is used to decide freshness. Normal cached imports verify downloaded file hashes; missing provenance requires a fresh import. A failed upstream repository request stops the refresh rather than silently dropping that source. Community skills remain links and metadata; syncing does not install or execute their code or the listed MCP servers.

## Structure

- `src/pages/`: static routes and generated endpoints.
- `src/views/`, `src/components/`, `src/layouts/`: presentation and browser interactions.
- `src/lib/`: catalog models, routes, SEO, sitemaps and optional counters.
- `src/site.config.mjs`: shared public identity.
- `api/`: Vercel MCP handler, catalog search and optional aggregate usage.
- `scripts/import.mjs`: external collection adapters.
- `plugins/promptsbaba/`: local Claude Code plugin and skill.
- `scripts/og.mjs`: install the approved `brand/logo-kit/` exports and regenerate the social image with `npm run brand`. The kit guide specifies white symbols on dark backgrounds, espresso symbols on light backgrounds, and square browser/app icons.

## Content sources

Defined in `scripts/import.mjs` (`SOURCES`) and listed on the site's Credits page.

| Collection | License | Used for |
|---|---|---|
| [jau123/nanobanana-trending-prompts](https://github.com/jau123/nanobanana-trending-prompts) | CC BY 4.0 | image prompts |
| [YouMind-OpenLab/awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) | CC BY 4.0 | image prompts |
| [ZeroLu/awesome-nanobanana-pro](https://github.com/ZeroLu/awesome-nanobanana-pro) | MIT | image prompts |
| [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) | MIT | image prompts |
| [Evolink-AI/awesome-gpt-image-2-API-Prompts](https://github.com/Evolink-AI/awesome-gpt-image-2-API-Prompts) | CC0 1.0 | image prompts |
| [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) | CC BY 4.0 | image prompts |
| [YouMind-OpenLab/awesome-gpt-image-1.5](https://github.com/YouMind-OpenLab/awesome-gpt-image-1.5) | CC BY 4.0 | image prompts |
| [YouMind-OpenLab/awesome-seedream-4.5](https://github.com/YouMind-OpenLab/awesome-seedream-4.5) | CC BY 4.0 | image prompts (Seedream) |
| [devanshug2307/Awesome-AI-Image-Prompts](https://github.com/devanshug2307/Awesome-AI-Image-Prompts) | MIT | image prompts |
| [LearnPrompt/awesome-seedance](https://github.com/LearnPrompt/awesome-seedance) | MIT | video prompts |
| [opensource-works/awesome-seedance-prompts](https://github.com/opensource-works/awesome-seedance-prompts) | MIT | video prompts |
| [YouMind-OpenLab/awesome-seedance-2-prompts](https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts) | CC BY 4.0 | video prompts |
| [YouMind-OpenLab/awesome-grok-imagine-prompts](https://github.com/YouMind-OpenLab/awesome-grok-imagine-prompts) | CC BY 4.0 | video prompts |
| [Evolink-AI/awesome-minimax-H3-prompts](https://github.com/Evolink-AI/awesome-minimax-H3-prompts) | CC BY 4.0 | video prompts (text to video only) |
| [AtlasCloudAI/awesome-gemini-omni-prompts](https://github.com/AtlasCloudAI/awesome-gemini-omni-prompts) | CC0 1.0 | video prompts (its own text-to-video examples only) |
| [f/prompts.chat](https://github.com/f/prompts.chat) | CC0 1.0 (prompts) | text prompts (ChatGPT) |
| [mustvlad/ChatGPT-System-Prompts](https://github.com/mustvlad/ChatGPT-System-Prompts) | MIT | text prompts (ChatGPT) |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | MIT | agent prompts (Claude) |
| [wshobson/agents](https://github.com/wshobson/agents) | MIT | agent and command prompts (Claude) |
| [JosephHampton/awesome-gemini-cli-subagents](https://github.com/JosephHampton/awesome-gemini-cli-subagents) | CC0 1.0 | agent prompts (Gemini) |
| [YouMind-OpenLab/awesome-gemini-3-prompts](https://github.com/YouMind-OpenLab/awesome-gemini-3-prompts) | CC BY 4.0 | text prompts (Gemini) |
| [danielmiessler/Fabric](https://github.com/danielmiessler/Fabric) | MIT | text prompts (any model) |
| [abilzerian/LLM-Prompt-Library](https://github.com/abilzerian/LLM-Prompt-Library) | MIT | text prompts (any model) |
| [anthropics/skills](https://github.com/anthropics/skills) | per skill | links only |

The Skills page also links to community skill repositories; only their names, descriptions and licenses are shown.

### How content is handled

- Sample images and video clips are loaded from the original collections' servers. This repository and the site store no copies of them.
- Prompt text is unchanged. Some titles are shortened and categories regrouped.
- A video prompt is listed only when it has both a playable clip and its prompt.
- The import applies a keyword filter (`BLOCK` in `scripts/import.mjs`) to keep the site family-friendly. It is deliberately strict and reads prompt text only, not images.
- Titles for the jau123 collection are derived from the first line of each prompt.


## Credit and license

PromptsBaba source code is MIT-licensed under `LICENSE`. Original code notices are preserved in `public/licenses/upstream-code-MIT.txt`; see `THIRD_PARTY_NOTICES.md`. Imported data retains each collection's license; collection credit and individual authors are displayed where known. Sample media rights are separate from the code license. The supplied PromptsBaba logo kit has separate terms in `BRAND_LICENSE.md`; public forks should use their own identity.

See `CONTRIBUTING.md`, `SECURITY.md`, and the content-removal issue template for the current contribution and reporting channels.

## MCP directory source and refresh

The directory adapts [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers) by Frank Fiegel and contributors. Its MIT copyright/license notice is retained at `public/licenses/awesome-mcp-servers-MIT.txt` and linked from the directory, detail pages and Credits. Each generated catalog includes the pinned source commit, import time and original entry line. Descriptions are normalized to plain text; repeated exact project URLs are merged across categories. Individual server licenses, pricing, hosting transports and client compatibility are not inferred.

```sh
npm run import:mcp        # Rebuild from sources/awesome-mcp-servers/snapshot.json; fetch if absent
npm run import:mcp:fresh  # Resolve main, fetch README+LICENSE at one commit, regenerate catalog
npm test
npm run build
```

Builds use committed `src/data/mcp-servers.json` and make no source fetches. Refresh is manual. A changed/empty source layout or changed license fails before replacing the catalog. `GITHUB_TOKEN` is optional for the GitHub commit lookup rate limit; it is never sent to raw content hosts or the browser.

Source language/OS/integration tags are source-reported. “Remote APIs” is an integration target, not evidence of a remotely hosted MCP endpoint. Project instructions stay in their original repositories; this importer does not manufacture installation commands or test results.

## Remote endpoints

The catalog also imports [Awesome Remote MCP Servers](https://github.com/punkpeye/awesome-remote-mcp-servers). Each collection has its own pinned snapshot, source-entry line and MIT notice. Identical category names are combined across collections. Self-hosted projects and hosted endpoints remain separate listings. Remote URLs and authentication requirements are source-listed; imports do not contact endpoints. Filter by deployment to show either type, then open a remote listing to copy its endpoint and follow the provider’s setup instructions.


## Branches and first release

`main` contains the published version. `development` is for ongoing work;
open a pull request into `main` after `npm test` and `npm run build` pass.
Both branches are public: never commit credentials, customer data, or private
operating documents. The initial release is tagged `v0.1.0`.

Local environment files, downloaded sources, build output, generated graphs,
agent installations, prototypes, and browser artifacts are ignored. The
public history starts with the PromptsBaba release; upstream provenance and
required license notices are preserved in `THIRD_PARTY_NOTICES.md`.
