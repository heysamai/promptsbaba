# MCP server directory

The user approved proceeding with the static library roadmap and supplied punkpeye/awesome-mcp-servers as the directory source. Build directly on the current Astro site and approved PromptsBaba identity.

## Approach

Use a repeatable importer to normalize the source README into committed JSON. This keeps builds offline and reproducible. Preserve the source commit, line references and MIT notice. Do not scrape Glama's richer commercial directory or infer facts missing from the source. Source collection licensing does not establish server licensing.

Alternatives: hand-curating a small selection offers richer tested setup but does not represent the supplied catalog; requesting thousands of project APIs adds rate limits and still does not establish compatibility. Import the supplied structured list now; add independently reviewed editorial records later.

## Behavior

- `/mcp-servers`: browse/search the imported catalog with category, language and integration-target filters; paginate static listing pages.
- `/mcp-servers/{slug}`: description, categories, source-reported tags, repository owner, links to project installation documentation and exact source snapshot.
- Category pages have persistent URLs and static listings.
- Homepage count and navigation use actual directory records. Keep `/mcp` explicitly the PromptsBaba connector.
- Global browser search covers server descriptions and categories as well as existing prompts; include the already-present skills in that index.
- A Cloud tag means the project integrates with remote APIs, not that the server is remotely hosted. Unknown transport, per-project license, pricing and setup compatibility remain unknown. No guessed install commands, testing badges, ratings or star counts.
- Preserve source category memberships and deduplicate exact project URLs; stable slugs survive source reorderings.
- Exclude advertisements, tutorials, frameworks and non-GitHub entries outside the server implementations section. Display source descriptions as plain text, never executable HTML.

## Validation

Parser tests cover badge links, tag semantics, multiple categories, unsafe URLs, markup stripping, stable IDs and end-of-section handling. Validate generated record counts, uniqueness, provenance and local URLs. Run existing tests and production build, then browser-check category/language filters, search, reset/empty state, detail links, global server/skill results and mobile layout. No servers are installed, executed or tested by this import. No push or deployment.
