/** Mix groups in rounds so one category, model, or prompt type cannot fill the shelf. */
export function inspirationPicks(items, count, groupOf, random) {
  const pool = [...items];
  if (random) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }
  const groups = new Map();
  for (const item of pool) {
    const key = groupOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const picks = [];
  while (picks.length < count && groups.size) {
    for (const [key, group] of groups) {
      picks.push(group.shift());
      if (!group.length) groups.delete(key);
      if (picks.length === count) break;
    }
  }
  return picks;
}
