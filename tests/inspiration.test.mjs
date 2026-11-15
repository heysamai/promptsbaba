import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspirationPicks } from '../src/lib/inspiration.mjs';

test('inspiration balances groups, preserves ranked order, and handles small pools', () => {
  const items = [{ id: 1, group: 'a' }, { id: 2, group: 'a' }, { id: 3, group: 'b' }, { id: 4, group: 'c' }];
  const groupOf = item => item.group;
  assert.deepEqual(inspirationPicks(items, 3, groupOf).map(x => x.id), [1, 3, 4]);
  assert.equal(inspirationPicks(items, 10, groupOf).length, 4);
  assert.deepEqual(inspirationPicks([], 8, groupOf), []);
  assert.deepEqual(inspirationPicks(items, 0, groupOf), []);
  const shuffled = inspirationPicks(items, 4, groupOf, () => 0);
  assert.equal(new Set(shuffled).size, 4);
  assert.notDeepEqual(shuffled, inspirationPicks(items, 4, groupOf));
  assert.deepEqual(items.map(x => x.id), [1, 2, 3, 4]);
});
