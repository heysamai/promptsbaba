import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseRemoteMcpReadme} from '../scripts/lib/mcp-catalog.mjs';
const source=body=>`# Remote\n## Servers\n${body}\n## Community\n- [ignore](https://example.org) \`https://example.org/mcp\`\n 🔓 - Ignore`;
test('remote entries retain endpoint, website, authentication while ignoring decorative source badges',()=>{
 const {servers}=parseRemoteMcpReadme(source('### 🔗 <a name="tools"></a>Tools\n- [Example](https://example.org/docs) `https://mcp.example.org/mcp`\n [![Score](https://glama.ai/mcp/connectors/org.example/service/badges/score.svg)](https://glama.ai/mcp/connectors/org.example/service)\n 🔐 - Search **documents**.'));
 assert.equal(servers.length,1);const s=servers[0];assert.equal(s.deployment,'remote');assert.equal(s.endpointUrl,'https://mcp.example.org/mcp');assert.equal(s.websiteUrl,'https://example.org/docs');assert.deepEqual(s.authentication,['oauth']);assert.equal(s.description,'Search documents.');assert.equal(s.repositoryUrl,undefined);
});
test('remote duplicates merge categories without conflating different endpoint paths',()=>{
 const body='### A\n- [One](https://example.org) `https://example.org/mcp`\n 🔓 - A server\n### B\n- [One](https://example.org) `https://example.org/mcp`\n 🔓 - A server\n- [Two](https://example.org) `https://example.org/Other`\n 🔑 - Another server';
 const {servers}=parseRemoteMcpReadme(source(body));assert.equal(servers.length,2);assert.deepEqual(servers.find(s=>s.name==='One').categories,['a','b']);assert.equal(servers.find(s=>s.name==='Two').endpointUrl,'https://example.org/Other');
});
test('rejects unsafe endpoints and ignores unrelated badge destinations',()=>{
 const {servers}=parseRemoteMcpReadme(source('### Tools\n- [Bad](https://example.org) `http://example.org/mcp`\n 🔓 - Bad\n- [Good](https://example.org) `https://example.org/mcp`\n [![Score](https://glama.ai@evil.test/x/badges/score.svg)](https://glama.ai@evil.test/x)\n 🔓 - Good'));
 assert.equal(servers.length,1);assert.ok(!('glamaUrl' in servers[0]));
});
test('keeps an endpoint whose source omits auth and description, without inventing them',()=>{
 const {servers}=parseRemoteMcpReadme(source('### Tools\n- [Docs](https://example.org) `https://example.org/mcp`'));
 assert.equal(servers.length,1);assert.deepEqual(servers[0].authentication,[]);assert.match(servers[0].description,/listed by the source/);
});
