import test from 'node:test';
import assert from 'node:assert/strict';
import {affiliates,agents,aggregate,periods} from './data.ts';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-10,`${a} != ${b}`);
test('group totals reconcile with all 10 affiliates for every period and live snapshot',()=>{
 assert.equal(affiliates.length,10);assert.equal(agents.length,388);assert.equal(new Set(agents.map(a=>a.id)).size,388);
 for(const p of ['day','month','year'] as const)for(const tick of [0,1,1500]){
  const group=aggregate('all',p,tick);
  for(const key of ['completed','saved','tokens','internalTokens','value','cost','fte','agents'] as const){near(group[key],affiliates.reduce((s,a)=>s+aggregate(a.id,p,tick)[key],0));}
  const attempts=affiliates.reduce((s,a)=>s+aggregate(a.id,p,tick).completed/(a.success/100),0);near(group.success,group.completed/attempts*100);
 }
});
test('periods change flow totals while deployed agent inventory stays fixed',()=>{
 for(const a of affiliates){const d=aggregate(a.id,'day');for(const p of ['month','year'] as const){const m=aggregate(a.id,p);near(m.completed,d.completed*periods[p].factor);near(m.saved,d.saved*periods[p].factor);assert.equal(m.agents,a.agents);near(m.internal,a.internal);}}
});
test('time, value, capacity and illustrative inference cost follow explicit assumptions',()=>{
 const d=aggregate('bank','month',4);near(d.saved,d.completed*2.8/60);near(d.value,d.saved*35000);near(d.fte,d.saved/160);near(d.cost,d.internalTokens/1e6*1800+(d.tokens-d.internalTokens)/1e6*8200);
});
test('every catalog agent has a known affiliate and valid route',()=>{
 for(const a of affiliates)assert.equal(agents.filter(x=>x.affiliate.id===a.id).length,a.agents);
 assert.equal(agents.filter(a=>a.state==='검토 대기').length,4);assert.ok(agents.every(a=>a.route==='내부 LLM'||a.route==='외부 LLM'));
});
