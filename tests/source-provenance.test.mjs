import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentHash, rawSource, githubRevision, githubJson } from '../scripts/lib/source-provenance.mjs';

test('source URLs resolve to their own repository and content hashes detect cache changes', () => {
  assert.deepEqual(rawSource('https://raw.githubusercontent.com/owner/repo/main/data/prompts.json'), {
    repository: 'owner/repo', ref: 'main', path: 'data/prompts.json',
  });
  assert.throws(() => rawSource('https://example.com/owner/repo/main/prompts.json'));
  assert.equal(contentHash('prompt'), contentHash(Buffer.from('prompt')));
  assert.notEqual(contentHash('prompt'), contentHash('changed prompt'));
});

test('source revisions are pinned once per repository; request failures stop the sync', async () => {
  const previous = globalThis.fetch;
  const requests = [];
  const sha = 'a'.repeat(40);
  globalThis.fetch = async (url) => {
    requests.push(url);
    return new Response(JSON.stringify({ sha }));
  };
  try {
    assert.equal(await githubRevision('test/source', 'main'), sha);
    assert.equal(await githubRevision('test/source', 'main'), sha);
    assert.equal(requests.length, 1);
    globalThis.fetch = async () => new Response('{}', { status: 404 });
    await assert.rejects(githubJson('repos/missing/source'), /404/);
    globalThis.fetch = async () => new Response(JSON.stringify({ sha: 'invalid' }));
    await assert.rejects(githubRevision('test/invalid', 'main'), /Invalid source revision/);
  } finally { globalThis.fetch = previous; }
});
