import catalog from '../data/mcp-servers.json';
export interface McpServer {
  slug:string; name:string; owner:string; description:string;
  repositoryUrl?:string;websiteUrl?:string;endpointUrl?:string;
  deployment:'self-hosted'|'remote';authentication?:string[];
  categories:string[];languages:string[];integrations:string[];operatingSystems:string[];
  sourceReportedOfficial:boolean;sourceLine:number;sourceId:string;
}
export const mcpSources=catalog.sources;
export const mcpSource=catalog.source;
export const mcpServers=catalog.servers as McpServer[];
export const sourceFor=(s:McpServer)=>mcpSources.find(source=>source.id===s.sourceId)!;
export const mcpRemoteCount=mcpServers.filter(s=>s.deployment==='remote').length;
export const mcpCategories=catalog.categories.map(c=>({...c,count:mcpServers.filter(s=>s.categories.includes(c.slug)).length}));
export const mcpCategoryNames=Object.fromEntries(mcpCategories.map(c=>[c.slug,c.name]));
export const mcpLanguages=[...new Set(mcpServers.flatMap(s=>s.languages))].sort();
export const MCP_PAGE_SIZE=36;
export const integrationNames:Record<string,string>={cloud:'Remote APIs',local:'Local software',embedded:'Embedded systems'};
export const authenticationNames:Record<string,string>={'none':'None (source-listed)','api-key':'API key / token','oauth':'OAuth'};
