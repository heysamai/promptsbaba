import {mcpCard,type McpRow} from './mcp-card';
// Browser filtering uses build-generated records; no project APIs or servers are contacted.
const form = document.querySelector<HTMLFormElement>('#mcp-filter');
if (form) {
  const query = document.querySelector<HTMLInputElement>('#mcp-q')!;
  const category = document.querySelector<HTMLSelectElement>('#mcp-category')!;
  const language = document.querySelector<HTMLSelectElement>('#mcp-language')!;
  const deployment = document.querySelector<HTMLSelectElement>('#mcp-deployment')!;
  const integration = document.querySelector<HTMLSelectElement>('#mcp-integration')!;
  const status = document.querySelector<HTMLElement>('#mcp-status')!;
  const results = document.querySelector<HTMLElement>('#mcp-results')!;
  const empty = document.querySelector<HTMLElement>('#mcp-empty')!;
  const more = document.querySelector<HTMLButtonElement>('#mcp-more')!;
  const staticList = document.querySelector<HTMLElement>('#mcp-static')!;
  type Row = McpRow;
  let rows: Row[] | undefined;
  let loading: Promise<Row[]> | undefined;
  let matching: Row[] = [];
  let visible = 36;
  let revision = 0;
  const render = () => { results.replaceChildren(...matching.slice(0,visible).map(mcpCard));empty.hidden=matching.length>0;more.hidden=matching.length<=visible;status.textContent=`${matching.length.toLocaleString('en-US')} matching projects${matching.length>visible ? ` · Showing ${visible}`:''}.`; };
  const load = () => loading ||= fetch('/search-index.json').then(r=>{if(!r.ok)throw new Error('Search unavailable');return r.json();}).then(data=>rows=data.m);
  const apply = async () => {
    const current=++revision;
    const params=new URLSearchParams();
    if(query.value.trim())params.set('q',query.value.trim());
    if(category.value!==form.dataset.category)params.set('category',category.value);
    if(language.value)params.set('language',language.value);
    if(integration.value)params.set('integration',integration.value);
    if(deployment.value)params.set('deployment',deployment.value);
    history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
    const active=query.value.trim() || category.value!==form.dataset.category || language.value || integration.value || deployment.value;
    results.hidden=!active;staticList.hidden=!!active;empty.hidden=true;more.hidden=true;
    if(!active) { status.textContent=originalStatus;return; }
    status.textContent='Searching the directory…';
    try {
      const all=rows || await load();
      if(current!==revision)return;
      const terms=query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      matching=all.filter(r=>(!deployment.value||r[9]===deployment.value)&&(!category.value||r[3].includes(category.value))&&(!language.value||r[4].includes(language.value))&&(!integration.value||r[5].includes(integration.value))&&terms.every(t=>`${r[0]} ${r[2]} ${r[6]} ${r[7].join(' ')}`.toLowerCase().includes(t)));
      visible=36;render();
    } catch {
      if(current!==revision)return;
      status.textContent='Search could not load. Clear filters to browse the catalog, or reload to try again.';
      loading=undefined;
    }
  };
  const originalStatus=status.textContent;
  const restore = () => {
    const p=new URLSearchParams(location.search);
    query.value=p.get('q')||'';category.value=p.has('category')?p.get('category')!:form.dataset.category||'';
    language.value=p.get('language')||'';integration.value=p.get('integration')||'';deployment.value=p.get('deployment')||'';
    void apply();
  };
  let timer:ReturnType<typeof setTimeout>;
  query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(apply,150);});
  for(const select of [category,language,integration,deployment])select.addEventListener('change',()=>{clearTimeout(timer);void apply();});
  form.addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);void apply();});
  form.addEventListener('reset',()=>{clearTimeout(timer);setTimeout(()=>{query.value='';category.value=form.dataset.category||'';language.value='';integration.value='';deployment.value='';void apply();},0);});
  document.querySelector('#mcp-empty-reset')!.addEventListener('click',()=>form.reset());
  more.addEventListener('click',()=>{visible+=36;render();});
  window.addEventListener('popstate',restore);
  restore();
}
