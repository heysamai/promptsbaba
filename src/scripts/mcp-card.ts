// The first nine fields preserve the original search-index contract.
export type McpRow=[string,string,string,string[],string[],string[],string,string[],string,'self-hosted'|'remote'];
const element=(tag:string,className:string,text?:string)=>{const node=document.createElement(tag);node.className=className;if(text)node.textContent=text;return node;};
export function mcpCard(r:McpRow){
 const card=element('article','mcp-card');
 const main=document.createElement('a');main.className='mcp-card-main';main.href='/mcp-servers/'+r[1];
 const identity=element('div','mcp-card-identity'),names=element('span','');
 names.append(element('span','mcp-card-name',r[0]),element('span','mcp-card-owner',(r[9]==='remote'?'Website: ':'Repository owner: ')+r[6]));
 identity.append(element('span','mcp-monogram',r[6].slice(0,2).toUpperCase()),names,element('span','mcp-card-arrow','↗'));
 const tags=element('div','mcp-card-tags');tags.append(element('span','deployment-tag'+(r[9]==='remote'?' deployment-remote':''),r[9]==='remote'?'Remote':'Self-hosted'));
 for(const value of [...r[7].slice(0,1),...r[4].slice(0,1)])tags.append(element('span','',value));
 main.append(identity,element('p','mcp-card-description',r[2]),tags);
 card.append(main);return card;
}
