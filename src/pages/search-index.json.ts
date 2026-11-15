import { mcpServers, mcpCategoryNames, integrationNames } from '../lib/mcp';
import { images, texts, videos, skills, communitySkills, excerpt } from '../lib/data';

// Compact search index consumed by the search page in both languages.
// Image rows: [title, slug, category slug, image url, prompt excerpt]
export function GET() {
  const body = {
    // MCP rows: name, slug, description, category IDs, languages, integration targets, owner, category labels, readable targets.
    m: mcpServers.map(s=>[s.name,s.slug,s.description,s.categories,s.languages,s.integrations,s.owner,s.categories.map(c=>mcpCategoryNames[c]),s.integrations.map(i=>integrationNames[i]).join(' · ') || 'Integration target not listed',s.deployment]),
    // Skills point to their original repositories; this index makes no installation or license claims.
    s: [...skills.map(s=>[s.name,s.url,s.description,'Anthropic']),...communitySkills.map(s=>[s.name,s.url,s.description,s.by])],
    i: images.map((p) => [p.title, p.slug, p.cats[0], p.images[0], excerpt(p.prompt, 160)]),
    // Text rows: [title, slug, model]
    t: texts.map((t) => [t.title, t.slug, t.model]),
    // Video rows: [title, slug, model, poster url, prompt excerpt, clip url when there is no poster]
    v: videos.map((v) => [v.title, v.slug, v.model, v.poster, excerpt(v.prompt, 160), v.poster ? '' : v.video]),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
}
