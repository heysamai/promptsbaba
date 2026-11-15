# Homepage inspiration

The homepage uses the imported local JSON collections, rendered by `src/views/Home.astro`.
It does not generate new prompts or call an AI model.

Selection uses `src/lib/inspiration.mjs`: group candidates, then take one from each
group per round until the requested count is reached.

| Shelf | Eligible items | Ordering within groups | Pool / displayed |
| --- | --- | --- | --- |
| Images | Prompt text and a sample image URL | Source likes, highest first; grouped by primary category | 40 / 8 |
| Videos | Prompt text and a sample clip URL | Source likes, highest first; grouped by model | 32 / 4 |
| Text | Nonempty prompt text | Imported collection order; grouped by prompt type | 36 / 6 |

Source likes are imported snapshots, not PromptsBaba engagement. Media eligibility
checks for a URL; it does not guarantee the external host is reachable.

Initial picks are stable until a rebuild changes the imported data or selection
rules. There is no scheduled or daily rotation.

Each shelf's **Shuffle picks** button randomizes its pool, applies the same group
balancing rule, and excludes the current picks when enough alternatives exist.
Shuffling happens in the browser without fetching the full catalog. Choices reset
on reload. The initial shelves remain available without JavaScript.

To change selection, edit pool sizes, eligibility filters, or grouping functions
in `Home.astro`. To feature specific prompts, select their slugs there before
filling remaining slots with balanced picks. No featured-slug system is enabled.

Check the selection helper with `node --test tests/inspiration.test.mjs`.
