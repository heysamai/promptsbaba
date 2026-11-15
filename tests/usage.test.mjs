import { test } from 'node:test';
import assert from 'node:assert/strict';

test('MCP telemetry sends no requests without operator configuration', async () => {
  const previous = globalThis.fetch;
  const previousUsage = process.env.MCP_USAGE;
  const previousUrl = process.env.PUBLIC_COUNTER_RPC_URL;
  const previousKey = process.env.PUBLIC_COUNTER_KEY;
  const requests = [];
  globalThis.fetch = async (...args) => { requests.push(args); return new Response('{}'); };
  delete process.env.MCP_USAGE;
  delete process.env.PUBLIC_COUNTER_RPC_URL;
  delete process.env.PUBLIC_COUNTER_KEY;
  try {
    const { recordUsage } = await import('../api/_usage.js');
    recordUsage('search_prompts', 'image');
    assert.equal(requests.length, 0);
  } finally {
    globalThis.fetch = previous;
    for (const [key, value] of [['MCP_USAGE', previousUsage], ['PUBLIC_COUNTER_RPC_URL', previousUrl], ['PUBLIC_COUNTER_KEY', previousKey]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
