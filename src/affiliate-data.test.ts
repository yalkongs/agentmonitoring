import test from 'node:test';
import assert from 'node:assert/strict';
import {bankCatalog,bankDepartments,bankSource} from './bank-catalog.ts';
import {affiliateSnapshot,summarizeAgents,filterAffiliateAgents} from './affiliate-data.ts';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-10,`${a} != ${b}`);

test('source catalog preserves all 29 PDF department counts and 110 unique definitions',()=>{
  const counts=[10,8,7,7,5,5,5,5,5,5,4,4,4,4,3,3,3,3,3,2,2,2,2,2,2,2,1,1,1];
  assert.deepEqual(bankDepartments.map(d=>d.count),counts);
  assert.equal(bankCatalog.length,bankSource.catalogCount);assert.equal(bankDepartments.length,29);
  assert.equal(new Set(bankCatalog.map(a=>a.name)).size,110);
  assert.equal(new Set(bankCatalog.map(a=>a.id)).size,110);
  for(const d of bankDepartments){const rows=bankCatalog.filter(a=>a.departmentId===d.id);assert.equal(rows.length,d.count);assert.ok(rows.every(a=>a.sourcePage===d.sourcePage&&a.department===d.name&&a.description.length>20));}
  assert.equal(bankCatalog[0].name,'업무기록 자동 요약 일일·주간 회고 도구');
  assert.equal(bankCatalog[109].name,'언론·SNS 실시간 평판 모니터링 에이전트');
  assert.equal(bankCatalog[109].sourcePage,31);
});
test('agent and department telemetry reconcile to the affiliate for all periods and updates',()=>{
  for(const id of ['bank','sec','asia'])for(const period of ['day','month','year'] as const)for(const tick of [0,1,512]){
    const snapshot=affiliateSnapshot(id,period,tick),sum=summarizeAgents(snapshot.rows);
    for(const key of ['completed','saved','tokens','internalTokens','cost','value','agents','success'] as const)near(sum[key],snapshot.totals[key]);
    const departments=snapshot.departments.map(d=>summarizeAgents(snapshot.rows.filter(a=>a.departmentId===d.id)));
    for(const key of ['completed','saved','tokens','internalTokens','cost','value','agents'] as const)near(departments.reduce((s,d)=>s+d[key],0),sum[key]);
    assert.ok(snapshot.rows.every(a=>Number.isInteger(a.completed)&&a.completed>=0&&a.internalShare>=0&&a.internalShare<=100));
  }
});
test('search spans source definitions and departments; filters compose without discarding catalog entries',()=>{
  const {rows}=affiliateSnapshot('bank','month');const f={department:'all',query:'',route:'all',status:'all',sort:'source'};
  assert.equal(filterAffiliateAgents(rows,f).length,110);
  assert.equal(filterAffiliateAgents(rows,{...f,department:'dept-01'}).length,10);
  assert.equal(filterAffiliateAgents(rows,{...f,query:'홍보부'})[0].id,'BANK-110');
  assert.ok(filterAffiliateAgents(rows,{...f,query:'30~60초'}).some(a=>a.name.includes('숏폼')));
  assert.equal(filterAffiliateAgents(rows,{...f,department:'dept-01',query:'해외송금'}).length,0);
  assert.equal(summarizeAgents([]).success,0);
  const sorted=filterAffiliateAgents(rows,{...f,sort:'saved'});assert.ok(sorted.every((a,i)=>!i||sorted[i-1].saved>=a.saved));
});
