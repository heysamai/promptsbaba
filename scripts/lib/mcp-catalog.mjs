import { createHash } from 'node:crypto';

const languages = [['🐍','Python'],['📇','TypeScript / JavaScript'],['🏎','Go'],['🦀','Rust'],['#️⃣','C#'],['☕','Java'],['🌊','C / C++'],['💎','Ruby']];
const scopes = [['☁','cloud'],['🏠','local'],['📟','embedded']];
const systems = [['🍎','macOS'],['🪟','Windows'],['🐧','Linux']];
const tags = (text, mapping) => mapping.filter(([symbol]) => text.includes(symbol)).map(([,label]) => label);
const plain = (text) => text.replace(/<[^>]*>/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[`*]/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();

export function projectUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { return; }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port) return;
  const parts = url.pathname.replace(/\/+$/, '').replace(/\.git$/i, '').split('/').filter(Boolean);
  if (parts.length < 2 || ['topics','orgs','users','collections','marketplace','features','settings'].includes(parts[0].toLowerCase())) return;
  if (!parts.slice(0,2).every(p => /^[\w.-]+$/.test(p))) return;
  return 'https://github.com/' + [...parts.slice(0,2).map(p=>p.toLowerCase()),...parts.slice(2)].join('/');
}

/** Parse only the source's server implementation section. Descriptions remain untrusted plain text. */
export function parseMcpReadme(markdown) {
  const byUrl = new Map(); const categories = new Map();
  let inServers = false; let category;
  const skipped = [];
  const lines = markdown.replace(/\r\n/g,'\n').split('\n');
  for (const [index,line] of lines.entries()) {
    if (/^## Server Implementations\s*$/i.test(line)) { inServers = true; continue; }
    if (inServers && /^##\s/.test(line)) break;
    if (!inServers) continue;
    if (/^###\s/.test(line)) {
      const anchor = line.match(/<a\s+(?:name|id)="([^"]+)"[^>]*><\/a>(.*)$/);
      const name = plain(anchor?.[2] || line.replace(/^###\s+/,'').replace(/^[^\p{L}\p{N}]+/u,''));
      const slug = (anchor?.[1] || name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      category = name && slug ? { slug, name } : undefined;
      if (category) categories.set(slug,category);
      continue;
    }
    if (!category) continue;
    const entry = line.match(/^\s*[-*]\s+(?:\*\*)?\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)(?:\*\*)?\s*(.*)$/);
    if (!entry) { if (/^[-*]\s+\[/.test(line)) skipped.push(index+1); continue; }
    const repositoryUrl = projectUrl(entry[2]);
    if (!repositoryUrl) { skipped.push(index+1); continue; }
    const rest = entry[3].replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'');
    const split = rest.match(/^([\s\S]*?)\s+[-–—]\s+([\s\S]+)$/) || rest.match(/^()[-–—]\s+([\s\S]+)$/);
    const description = plain(split?.[2] || '');
    if (!description) { skipped.push(index+1); continue; }
    const flags = split[1];
    const owner = repositoryUrl.split('/')[3];
    const existing = byUrl.get(repositoryUrl);
    if (existing) {
      existing.categories = [...new Set([...existing.categories,category.slug])];
      existing.languages = [...new Set([...existing.languages,...tags(flags,languages)])];
      existing.integrations = [...new Set([...existing.integrations,...tags(flags,scopes)])];
      existing.operatingSystems = [...new Set([...existing.operatingSystems,...tags(flags,systems)])];
      existing.sourceReportedOfficial ||= flags.includes('🎖');
      continue;
    }
    const id = createHash('sha256').update(repositoryUrl).digest('hex').slice(0,10);
    const name = plain(entry[1]);
    const prefix = repositoryUrl.slice('https://github.com/'.length).toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,75).replace(/-$/,'');
    byUrl.set(repositoryUrl, { slug: prefix+'-'+id, name, owner, description, repositoryUrl, categories:[category.slug], languages:tags(flags,languages), integrations:tags(flags,scopes), operatingSystems:tags(flags,systems), sourceReportedOfficial:flags.includes('🎖'), sourceLine:index+1, deployment:'self-hosted' });
  }
  const servers = [...byUrl.values()].sort((a,b) => a.name.localeCompare(b.name,'en'));
  if (!servers.length) throw new Error('No server entries found: source layout may have changed. Existing catalog has not been overwritten.');
  return { servers, categories:[...categories.values()].filter(c=>servers.some(s=>s.categories.includes(c.slug))).sort((a,b)=>a.name.localeCompare(b.name,'en')), skipped };
}

export function safeHttps(raw) {
  try { const url=new URL(raw); if(url.protocol!=='https:'||url.username||url.password||url.port)return;return url.href; } catch { return; }
}
export function parseRemoteMcpReadme(markdown) {
  const byEndpoint=new Map(),categories=new Map(),skipped=[];
  const lines=markdown.replace(/\r\n/g,'\n').split('\n');
  let active=false,category;
  for(let i=0;i<lines.length;i++) {
    const line=lines[i];
    if(/^## Servers\s*$/.test(line)){active=true;continue;}
    if(active&&/^##\s/.test(line))break;
    if(!active)continue;
    if(/^###\s/.test(line)) {
      const anchor=line.match(/<a\s+(?:name|id)="([^"]+)"[^>]*><\/a>(.*)$/);
      const name=plain(anchor?.[2]||line.replace(/^###\s+/,'').replace(/^[^\p{L}\p{N}]+/u,''));
      const slug=(anchor?.[1]||name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      category={slug,name};categories.set(slug,category);continue;
    }
    if(!category||!/^[-*]\s+\[/.test(line))continue;
    const lineNumber=i+1;
    let block=line;
    while(i+1<lines.length&&!/^[-*]\s|^#{2,3}\s/.test(lines[i+1]))block+='\n'+lines[++i];
    const head=block.match(/^[-*]\s+\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s+`([^`]+)`/);
    const websiteUrl=head&&safeHttps(head[2]),endpointUrl=head&&safeHttps(head[3]);
    const desc=block.match(/[🔓🔑🔐][\s\S]*?\s[-–—]\s+([\s\S]+)/);
    if(!head||!websiteUrl||!endpointUrl){skipped.push(lineNumber);continue;}
    const authPrefix=block.slice(head[0].length,desc?desc.index+desc[0].length-desc[1].length:block.length);
    const authentication=[['🔓','none'],['🔑','api-key'],['🔐','oauth']].filter(([flag])=>authPrefix.includes(flag)).map(([,name])=>name);
    const existing=byEndpoint.get(endpointUrl);
    if(existing){existing.categories=[...new Set([...existing.categories,category.slug])];continue;}
    const name=plain(head[1]);const owner=new URL(websiteUrl).hostname;
    const id=createHash('sha256').update(endpointUrl).digest('hex').slice(0,10);
    const prefix=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'server';
    byEndpoint.set(endpointUrl,{slug:'remote-'+prefix+'-'+id,name,owner,description:desc?plain(desc[1]):'Remote MCP endpoint listed by the source. See the provider’s setup documentation for details.',websiteUrl,endpointUrl,deployment:'remote',authentication,categories:[category.slug],languages:[],integrations:[],operatingSystems:[],sourceReportedOfficial:false,sourceLine:lineNumber});
  }
  const servers=[...byEndpoint.values()].sort((a,b)=>a.name.localeCompare(b.name,'en'));
  if(!servers.length)throw new Error('No remote server entries found; source layout may have changed.');
  return{servers,categories:[...categories.values()].filter(c=>servers.some(s=>s.categories.includes(c.slug))),skipped};
}
