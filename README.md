# PromptsBaba

**Stop guessing. Ask the Baba.**

A free library of AI prompts, agent skills and MCP server listings. Find a starting point, adapt it to your task, and copy it into the AI tool you use. No account is needed to browse.

## What you can find

| Collection | What it offers |
| --- | --- |
| Image prompts | Prompts with sample images for product shots, portraits, posters, illustrations and more |
| Video prompts | Prompts with sample clips and the model they were made for |
| Text prompts | Starting points for writing, research, coding and other tasks |
| Agent skills | Links to official and community instruction sets for AI agents |
| MCP servers | A searchable directory of self-hosted projects and remote endpoints, with source credits and provider documentation |

Search across the library, browse by category or model, and switch between light and dark themes. Prompt pages include collection credits and original-author links where known. When records share prompt text, comparison links help you inspect the other source examples.

## Use a prompt

1. Choose an image, video or text prompt that fits your task.
2. Open its page to read the prompt, inspect its example and check the intended model.
3. Fill in any available placeholders, or copy the prompt and edit it yourself.
4. Paste it into your AI tool and adjust the result as needed.

Examples show what the original creators produced. Your results will depend on the model, settings and inputs you use. The AI tools themselves may require an account or payment.

## Find skills and MCP servers

Skills link to their original repositories. Check the instructions, requirements and license before installing one.

The MCP directory includes both self-hosted projects and hosted endpoints. Filter the listings, open a project, and follow the provider's setup and authentication instructions. Listings are source-reported and have not all been independently tested. Browsing the directory does not install or run a server.

PromptsBaba also includes a read-only MCP connector for searching and fetching its prompt library from a compatible AI client. It provides `search_prompts`, `get_prompt`, `list_filters` and `random_prompt`. The connector searches prompts; skills and third-party MCP listings are available through the website.

The planned website address is **promptsbaba.com**, with the connector at `/api/mcp`. Public deployment is not yet verified. You can browse the library locally using the steps below.

## Preview locally

Install [Node.js](https://nodejs.org/) 22 or newer. To preview the latest development version, run:

```sh
git clone --branch development https://github.com/heysamai/promptsbaba.git
cd promptsbaba
npm ci
npm run dev
```

Open the local address printed in the terminal. The catalog is included, so you do not need to import content first. The local website preview does not host the Vercel MCP connector.

For configuration, testing, content refreshes and hosting, see the [developer guide](docs/DEVELOPMENT.md).

## Credits and reuse

PromptsBaba brings together work from open-source collections. Prompt text keeps its source wording; display titles and categories may be edited for clarity. Sample images and videos load from their original hosts and remain subject to their owners' terms.

The application code is [MIT-licensed](LICENSE). Imported prompts, linked skills, sample media and the PromptsBaba brand have their own terms. Check the credit and license on each entry before reusing it. See the [source collections](docs/DEVELOPMENT.md#content-sources), [third-party notices](THIRD_PARTY_NOTICES.md) and [brand license](BRAND_LICENSE.md).

## Help improve the library

[Report a bug](https://github.com/heysamai/promptsbaba/issues/new?template=bug.yml), suggest a licensed collection, or contribute a focused fix. Read the [contribution guide](CONTRIBUTING.md) before opening a pull request.

For a content correction or removal, contact **Sam** at [hustlersanta@gmail.com](mailto:hustlersanta@gmail.com) or [submit a removal request](https://github.com/heysamai/promptsbaba/issues/new?template=content-removal.yml). For security issues, follow the [security policy](SECURITY.md).
