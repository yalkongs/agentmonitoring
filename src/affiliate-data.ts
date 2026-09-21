import {affiliates, agents, aggregate, type Period} from './data.ts';
import {bankDepartments, bankSource} from './bank-catalog.ts';

/** Allocate synthetic telemetry without inventing source deployment facts.
 * Completed tasks are integers; every other additive measure reconciles to the group ledger.
 * Internal / external token weights model mixed traffic for each agent.
 */
export function affiliateSnapshot(id:string, period:Period, tick=0) {
  const affiliate=affiliates.find(a=>a.id===id);
  if(!affiliate) throw new Error(`Unknown affiliate: ${id}`);
  const totals=aggregate(id,period,tick);
  const catalog=agents.filter(a=>a.affiliate.id===id);
  const weights=catalog.map((_,i)=>2+(i*13)%19);
  const weightTotal=weights.reduce((a,b)=>a+b,0);
  const internalWeights=catalog.map((a,i)=>weights[i]*(a.route==='내부 LLM'?2.8:.25));
  const externalWeights=catalog.map((a,i)=>weights[i]*(a.route==='외부 LLM'?4.8:.55));
  const internalTotal=internalWeights.reduce((a,b)=>a+b,0);
  const externalTotal=externalWeights.reduce((a,b)=>a+b,0);
  let weightCursor=0, allocated=0;
  const rows=catalog.map((agent,i)=>{
    weightCursor+=weights[i];
    const cumulative=i===catalog.length-1?totals.completed:Math.floor(totals.completed*weightCursor/weightTotal);
    const completed=cumulative-allocated;allocated=cumulative;
    const saved=completed*affiliate.savedMinutes/60;
    const internalTokens=totals.internalTokens*internalWeights[i]/internalTotal;
    const externalTokens=(totals.tokens-totals.internalTokens)*externalWeights[i]/externalTotal;
    const tokens=internalTokens+externalTokens;
    return {...agent,completed,saved,internalTokens,externalTokens,tokens,
      internalShare:internalTokens/tokens*100,
      routeLabel:internalTokens>=externalTokens?'내부 중심':'외부 중심',
      cost:internalTokens/1e6*1800+externalTokens/1e6*8200,
      value:saved*35000,attempts:completed/(affiliate.success/100)};
  });
  const departments=id==='bank'?bankDepartments:[{id:'demo',name:'시연 업무',count:rows.length,sourcePage:null}];
  return {affiliate,rows,departments,source:id==='bank'?bankSource:null,totals};
}
export type AffiliateAgent=ReturnType<typeof affiliateSnapshot>['rows'][number];
export function summarizeAgents(rows:AffiliateAgent[]) {
  const totals=rows.reduce((s,a)=>({completed:s.completed+a.completed,saved:s.saved+a.saved,tokens:s.tokens+a.tokens,
    internalTokens:s.internalTokens+a.internalTokens,externalTokens:s.externalTokens+a.externalTokens,cost:s.cost+a.cost,
    value:s.value+a.value,attempts:s.attempts+a.attempts}),
    {completed:0,saved:0,tokens:0,internalTokens:0,externalTokens:0,cost:0,value:0,attempts:0});
  return {...totals,agents:rows.length,departments:new Set(rows.map(a=>a.departmentId)).size,
    success:totals.attempts?totals.completed/totals.attempts*100:0};
}
export type AffiliateFilters={department:string;query:string;route:string;status:string;sort:string};
export function filterAffiliateAgents(rows:AffiliateAgent[], filters:AffiliateFilters) {
  const query=filters.query.trim().normalize('NFC').toLocaleLowerCase();
  const result=rows.filter(a=>(filters.department==='all'||a.departmentId===filters.department)
    &&(filters.route==='all'||a.routeLabel===filters.route)
    &&(filters.status==='all'||a.state===filters.status)
    &&`${a.id} ${a.name} ${a.department} ${a.description}`.normalize('NFC').toLocaleLowerCase().includes(query));
  if(filters.sort==='saved')result.sort((a,b)=>b.saved-a.saved||a.id.localeCompare(b.id));
  return result;
}
