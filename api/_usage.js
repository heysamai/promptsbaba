// Counts MCP tool calls per day, tool and prompt type in Supabase (see supabase/mcp-usage.sql).
// Nothing about the caller or the query is sent. Counting never delays or breaks a tool call:
// it runs after the response through waitUntil, and every failure is ignored.
import { waitUntil } from '@vercel/functions';

// Optional operator-owned counters. Never send requests without explicit configuration.

/** Record one call of `tool`; `kind` is the prompt type asked for, `zero` marks a search with no results. */
export function recordUsage(tool, kind = '', zero = false) {
  const endpoint = process.env.PUBLIC_COUNTER_RPC_URL;
  const KEY = process.env.PUBLIC_COUNTER_KEY;
  if (process.env.MCP_USAGE === 'off' || !endpoint || !KEY) return;
  const RPC = endpoint.replace(/\/$/, '') + '/mt_mcp_bump';
  const sent = fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: KEY, authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ t: tool, k: kind || '', zero }),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
  try {
    waitUntil(sent);
  } catch {
    // Outside Vercel there is no request context; the fetch still runs on its own.
  }
}
