import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMcpReadme } from '../scripts/lib/mcp-catalog.mjs';
const source = (body) => `# Example\n## Server Implementations\n${body}\n## Frameworks\n- [ignore/framework](https://github.com/ignore/framework) - Not a server`;

test('imports server metadata and treats cloud as integration scope, not transport', () => {
 const { servers, categories } = parseMcpReadme(source('### 🗄️ <a name="databases"></a>Databases\n- [acme/db](https://github.com/acme/db) [![score](https://example.com/score.svg)](https://example.com/score) 🎖️ 🐍 ☁️ 🏠 🍎 - Read **records** with [SQL](https://example.com).'));
 assert.equal(servers.length,1);assert.equal(categories[0].name,'Databases');
 assert.deepEqual(servers[0].languages,['Python']);assert.deepEqual(servers[0].integrations,['cloud','local']);assert.deepEqual(servers[0].operatingSystems,['macOS']);
 assert.equal(servers[0].description,'Read records with SQL.');assert.equal(servers[0].owner,'acme');
 assert.equal(servers[0].sourceReportedOfficial,true);assert.equal(servers[0].transport,undefined);assert.equal(servers[0].license,undefined);
});
test('deduplicates canonical URLs while retaining categories and stable slugs', () => {
 const a='### <a name="a"></a>A\n- [Acme/DB](https://github.com/Acme/DB/) 🐍 - First description';
 const b='### <a name="b"></a>B\n- [acme/db](https://github.com/acme/db.git) 📇 - Second description';
 const first=parseMcpReadme(source(a+'\n'+b)).servers[0];
 assert.deepEqual(first.categories,['a','b']);assert.deepEqual(first.languages,['Python','TypeScript / JavaScript']);
 assert.equal(first.slug,parseMcpReadme(source(b+'\n'+a)).servers[0].slug);
});
test('ignores ads, unsafe links, non-repository links and content outside server section', () => {
 const {servers}=parseMcpReadme(source('### <a name="tools"></a>Tools\n- [bad](javascript:alert(1)) - No\n- [external](https://example.com/x) - No\n- [spoof](https://github.com@evil.test/acme/tool) - No\n- [notrepo](https://github.com/topics/mcp) - No\n- [acme/tool](https://github.com/acme/tool) - <img src=x onerror=alert(1)>Good &amp; useful'));
 assert.equal(servers.length,1);assert.equal(servers[0].description,'Good & useful');
});
test('rejects a changed or empty source layout rather than producing an empty catalog', () => {
 assert.throws(()=>parseMcpReadme('# Empty'),/server/i);
 assert.throws(()=>parseMcpReadme(source('### Empty')),/server/i);
});
test('preserves case-sensitive repository subpaths and underscores in project names', () => {
 const {servers}=parseMcpReadme(source('### Tools\n- [Acme/my_tool](https://github.com/Acme/Repo/tree/main/Tools/MyServer) - A useful server'));
 assert.equal(servers[0].repositoryUrl,'https://github.com/acme/repo/tree/main/Tools/MyServer');
 assert.equal(servers[0].name,'Acme/my_tool');
});
