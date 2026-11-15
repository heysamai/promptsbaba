// Display labels improve source captions without rewriting the imported prompt text or URLs.
const videoTitles = {
  'made-with-seedance-2-5-814024': 'Rainy Evening Walk Through a Seoul Neighborhood',
  'made-with-seedance-2-5-431102': 'Sleepy Morning Bathroom Routine and Outfit Choice',
  'made-with-seedance-2-5-537295': 'Indonesian Morning Market Vlog for Coconut Dessert',
  'made-with-seedance-2-0-gpt-image-2-196529': 'Comic-Style Downhill Skateboard and BMX Race',
  'made-with-seedance-2-0-gpt-image-2-243253': 'The Little Thief: Raccoon Cookie Heist in a Bakery',
  'i-made-this-30-second-clip-using-higgsfield-ai-854854': 'Nova’s Rainy Suspension-Bridge Convoy Ambush',
  'i-made-this-30-second-clip-using-higgsfield-ai-827895': 'A Father Protects His Daughter During a Home Invasion',
};

export const promptTitle = item => videoTitles[item.slug] || item.title;

export const describePrompt = (item, n = 155) => {
  const title = promptTitle(item);
  const body = (item.desc || item.prompt).replace(/\s+/g, ' ').trim();
  const text = `${title}. ${body}`;
  return text.length > n ? text.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : text;
};

const normalizedPrompt = text => text.toLowerCase().replace(/\s+/g, ' ').trim();
const mediaKey = item => JSON.stringify(item.images || (item.video ? [item.video] : []));

/** A per-record comparison, retaining all source records, including exact repeats. */
export function promptGroups(items) {
  const groups = new Map();
  for (const item of items) {
    const key = normalizedPrompt(item.prompt);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const matches = new Map();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const item of group) matches.set(item.slug, group.map(other => ({...other, sameMedia: mediaKey(item) === mediaKey(other)})));
  }
  return matches;
}
