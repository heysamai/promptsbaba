import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promptGroups, describePrompt, promptTitle } from '../src/lib/prompt-presentation.mjs';

test('matching prompts retain every record and distinguish sample media from repeated samples', () => {
  const items = [
    { slug: 'a', title: 'City', prompt: 'A CITY\n at night', images: ['https://example.com/one.jpg'] },
    { slug: 'b', title: 'City #2', prompt: 'a city at night', images: ['https://example.com/two.jpg'] },
    { slug: 'c', title: 'City source', prompt: 'A city at night', images: ['https://example.com/one.jpg'] },
    { slug: 'd', title: 'Different', prompt: 'A forest', images: ['https://example.com/one.jpg'] },
  ];
  const groups = promptGroups(items);
  assert.equal(groups.get('a').length, 3);
  assert.equal(groups.get('a').find(x => x.slug === 'c').sameMedia, true);
  assert.equal(groups.get('a').find(x => x.slug === 'b').sameMedia, false);
  assert.equal(groups.has('d'), false);
  assert.equal(items.length, 4);
});

test('metadata preserves distinguishing title endings and prefixes otherwise identical descriptions', () => {
  const a = {slug:'a',title:'Claude Code Skill (Slash Command): review-and-commit.md',prompt:'Same text',desc:'Same description'};
  const b = {...a,slug:'b',title:'Claude Code Skill (Slash Command): push-and-pull-request.md'};
  assert.notEqual(promptTitle(a),promptTitle(b));
  assert.match(promptTitle(a), /review-and-commit/);
  assert.notEqual(describePrompt(a),describePrompt(b));
  assert.ok(describePrompt(a).length <= 155);
  assert.equal(a.desc, 'Same description');
});

test('current prompt catalog has distinct page titles and descriptions without changing source records', async () => {
  const { readFileSync } = await import('node:fs');
  for (const kind of ['image', 'video', 'text']) {
    const items = JSON.parse(readFileSync(`src/data/${kind}-prompts.json`, 'utf8'));
    const titles = new Set();
    const descriptions = new Set();
    for (const item of items) {
      const before = JSON.stringify(item);
      const title = `${promptTitle(item)} · ${item.model}`;
      const description = describePrompt(item);
      assert.ok(!titles.has(title), `${kind}: duplicate title for ${item.slug}`);
      assert.ok(!descriptions.has(description), `${kind}: duplicate description for ${item.slug}`);
      titles.add(title);
      descriptions.add(description);
      assert.equal(JSON.stringify(item), before, `${kind}: source record mutated`);
    }
  }
});
