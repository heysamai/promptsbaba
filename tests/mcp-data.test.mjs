import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const{source,sources,categories,servers}=JSON.parse(readFileSync('src/data/mcp-servers.json','utf8'));
test('MCP catalog retains separate pinned provenance and notices for both collections',()=>{
 assert.equal(source.repository,'https://github.com/punkpeye/awesome-mcp-servers');assert.equal(sources.length,2);
 for(const s of sources){assert.match(s.revision,/^[a-f0-9]{40}$/);assert.ok(s.snapshotUrl.includes(s.revision));assert.match(readFileSync('public'+s.localLicenseUrl,'utf8'),/Copyright.*Frank Fiegel/);}
 assert.ok(servers.some(s=>s.deployment==='remote'));assert.ok(servers.some(s=>s.deployment==='self-hosted'));
});
test('MCP records have unique stable routes, known categories, safe links and correct source attribution',()=>{
 const ids=new Set(),urls=new Set(),cats=new Set(categories.map(c=>c.slug)),sourceIds=new Set(sources.map(s=>s.id));
 for(const s of servers){
  assert.match(s.slug,/^[a-z0-9]+(?:-+[a-z0-9]+)*$/);assert.ok(!ids.has(s.slug));ids.add(s.slug);
  const raw=s.deployment==='remote'?s.endpointUrl:s.repositoryUrl;assert.ok(!urls.has(raw));urls.add(raw);
  const url=new URL(raw);assert.equal(url.protocol,'https:');assert.equal(url.username,'');assert.equal(url.password,'');
  if(s.deployment==='self-hosted')assert.equal(url.hostname,'github.com');
  assert.ok(s.name&&s.description&&s.owner);assert.ok(sourceIds.has(s.sourceId));assert.ok(s.categories.length);assert.ok(s.categories.every(c=>cats.has(c)));
  assert.ok(s.sourceLine>0);assert.equal(s.license,undefined);assert.equal(s.transport,undefined);assert.equal(s.testedAt,undefined);
 }
});

test('directory records contain no assessment or scoring fields',()=>{
 for(const server of servers) for(const key of ['glamaUrl','quality','qualityScore','trustPercent']) assert.ok(!(key in server), `${server.slug}: unexpected ${key}`);
});
