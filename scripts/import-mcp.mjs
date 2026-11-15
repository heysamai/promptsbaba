// Pinned, separately attributed source snapshots. Builds never fetch or contact listed servers.
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { parseMcpReadme, parseRemoteMcpReadme } from './lib/mcp-catalog.mjs';
const root=new URL('../',import.meta.url);
const output=new URL('src/data/mcp-servers.json',root);
const definitions=[{id:'awesome-mcp-servers',name:'Awesome MCP Servers',parse:parseMcpReadme},{id:'awesome-remote-mcp-servers',name:'Awesome Remote MCP Servers',parse:parseRemoteMcpReadme}];
async function request(url,api=false){
 const headers={'User-Agent':'PromptsBaba-catalog-import'};
 if(api&&process.env.GITHUB_TOKEN)headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
 const response=await fetch(url,{headers,signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Error(`Source request failed (${response.status}): ${url}`);
 return response.text();
}
const sources=[],servers=[],categoryMap=new Map();
const categoryKey=name=>name.toLowerCase().replace(/\band\b|&/g,'').replace(/[^a-z0-9]/g,'');
const categoryByName=new Map();
for(const definition of definitions){
 const cache=new URL(`sources/${definition.id}/`,root),file=new URL('snapshot.json',cache);
 let snapshot;
 try{snapshot=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(process.argv.includes('--fetch')||!snapshot){
  const commit=JSON.parse(await request(`https://api.github.com/repos/punkpeye/${definition.id}/commits/main`,true));
  if(!/^[a-f0-9]{40}$/.test(commit.sha))throw new Error('Source API did not return a valid commit.');
  const base=`https://raw.githubusercontent.com/punkpeye/${definition.id}/${commit.sha}`;
  const [markdown,license]=await Promise.all([request(base+'/README.md'),request(base+'/LICENSE')]);
  definition.parse(markdown);
  if(!/MIT License/.test(license)||!/Frank Fiegel/.test(license))throw new Error('Source license changed; review it before importing.');
  snapshot={revision:commit.sha,importedAt:new Date().toISOString(),markdown,license};
  await mkdir(cache,{recursive:true});await writeFile(file,JSON.stringify(snapshot));
 }
 const parsed=definition.parse(snapshot.markdown);
 const repository=`https://github.com/punkpeye/${definition.id}`;
 sources.push({id:definition.id,name:definition.name,author:'Frank Fiegel & contributors',repository,revision:snapshot.revision,importedAt:snapshot.importedAt,snapshotUrl:`${repository}/blob/${snapshot.revision}/README.md`,license:'MIT',licenseUrl:`${repository}/blob/${snapshot.revision}/LICENSE`,localLicenseUrl:`/licenses/${definition.id}-MIT.txt`});
 const aliases=new Map();
 for(const category of parsed.categories){
  const key=categoryKey(category.name);
  const canonical=categoryByName.get(key)||category.slug;
  aliases.set(category.slug,canonical);
  if(!categoryMap.has(canonical)){categoryMap.set(canonical,{...category,slug:canonical});categoryByName.set(key,canonical);}
 }
 servers.push(...parsed.servers.map(s=>({...s,sourceId:definition.id,categories:[...new Set(s.categories.map(c=>aliases.get(c)))]})));
 await mkdir(new URL('public/licenses/',root),{recursive:true});
 await writeFile(new URL(`public/licenses/${definition.id}-MIT.txt`,root),snapshot.license);
 console.log(`${definition.name}: ${parsed.servers.length} records, ${parsed.skipped.length} skipped lines, revision ${snapshot.revision.slice(0,12)}.`);
}
servers.sort((a,b)=>a.name.localeCompare(b.name,'en'));
const categories=[...categoryMap.values()].sort((a,b)=>a.name.localeCompare(b.name,'en'));
const temporary=new URL('mcp-servers.json.tmp',new URL('./',output));
await writeFile(temporary,JSON.stringify({source:sources[0],sources,categories,servers},null,2)+'\n');await rename(temporary,output);
console.log(`Imported ${servers.length} listings in ${categories.length} categories. No listed servers were contacted or tested.`);
