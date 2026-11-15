import { createHash } from 'node:crypto';

export const contentHash = content => createHash('sha256').update(content).digest('hex');

export function rawSource(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== 'raw.githubusercontent.com') throw new Error('Expected a GitHub raw source.');
  const [owner, repo, ref, ...parts] = parsed.pathname.slice(1).split('/');
  if (!owner || !repo || !ref || !parts.length) throw new Error('Invalid raw source URL.');
  return { repository: `${owner}/${repo}`, ref, path: parts.join('/') };
}

export async function githubJson(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'PromptsBaba-source-sync' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`GitHub source check failed (${response.status}): ${path}`);
  return response.json();
}

const revisions = new Map();
export async function githubRevision(repository, ref) {
  const key = `${repository}@${ref}`;
  if (!revisions.has(key)) {
    revisions.set(key, githubJson(`repos/${repository}/commits/${encodeURIComponent(ref)}`).then(commit => {
      if (!/^[a-f0-9]{40}$/.test(commit.sha)) throw new Error(`Invalid source revision: ${repository}`);
      return commit.sha;
    }));
  }
  return revisions.get(key);
}
