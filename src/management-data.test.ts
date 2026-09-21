import test from 'node:test';
import assert from 'node:assert/strict';
import {affiliates, aggregate} from './data.ts';
import {efficiency, efficiencyRows, mcpMetrics, histogramPercentile, commonTools} from './management-data.ts';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-10,`${a} != ${b}`);

test('efficiency reconciles across affiliates and retains review, retry and failed-work costs',()=>{
  for(const period of ['day','month','year'] as const) for(const tick of [0,7,1000]) {
    const all=efficiency('all',period,tick), rows=efficiencyRows('all',period,tick);
    for(const key of ['saved','completed','judged','failed','reworked','operatingCost','humanMinutes','baselineHumanMinutes','baselineElapsedMinutes','assistedElapsedMinutes'] as const)
      near(all[key],rows.reduce((n,r)=>n+r[key],0));
    near(all.firstPassRate,rows.reduce((n,r)=>n+r.firstPass,0)/all.judged*100);
    near(all.costPerSuccess,rows.reduce((n,r)=>n+r.operatingCost,0)/all.completed);
    near(all.cycleReduction,(1-rows.reduce((n,r)=>n+r.assistedElapsedMinutes,0)/rows.reduce((n,r)=>n+r.baselineElapsedMinutes,0))*100);
    near((all.baselineHumanMinutes-all.humanMinutes)/60,aggregate('all',period,tick).saved);
    assert.equal(all.firstPassCount+all.reworked+all.failed,all.judged);
    assert.ok(all.inferenceCost>aggregate('all',period,tick).cost,'retries and failures consume inference too');
    near(all.operatingCost,all.inferenceCost+all.integrationCost+all.reviewCost);
    assert.ok(all.firstPassRate>0&&all.firstPassRate<100);
  }
});

test('MCP reconciles selected scopes and excludes pending approvals from terminal outcomes',()=>{
  for(const period of ['day','month','year'] as const) for(const tick of [0,11]) {
    const group=mcpMetrics('all',period,tick), rows=affiliates.map(a=>mcpMetrics(a.id,period,tick));
    for(const key of ['ready','target','readReady','readTarget','executeReady','executeTarget','judged','completed','failed','policyBlocked','pending','calls','errors','operatingAgents','activeAgents'] as const)
      assert.equal(group[key],rows.reduce((n,r)=>n+r[key],0),key);
    assert.equal(group.judged,group.completed+group.failed+group.policyBlocked);
    near(group.completionRate,group.completed/group.judged*100);
    near(group.activeRate,group.activeAgents/group.operatingAgents*100);
    assert.ok(group.pending>0&&group.callSuccess!==group.completionRate);
    assert.equal(new Set(group.systems.map(s=>s.id)).size,40);
    assert.ok(rows.every(r=>r.activeAgents<=r.operatingAgents&&r.ready<=r.target));
  }
});

test('MCP fixed inventory and 30-day usage are independent of flow period; reuse is distinct',()=>{
  const day=mcpMetrics('all','day'),year=mcpMetrics('all','year');
  for(const key of ['ready','target','coverage','operatingAgents','activeAgents','activeRate'] as const) assert.equal(day[key],year[key]);
  assert.ok(year.completed>day.completed);
  assert.equal(day.reusedTools.length,9);
  assert.equal(day.reuseAffiliates,10);
  assert.deepEqual(new Set(day.reusedTools.map(t=>t.id)),new Set(commonTools.filter(t=>t.affiliateIds.length>=2).map(t=>t.id)));
  const bank=mcpMetrics('bank','month');assert.equal(bank.systems.length,4);assert.ok(bank.toolRows.every(t=>t.affiliateIds.includes('bank')));
  assert.ok(affiliates.reduce((n,a)=>n+mcpMetrics(a.id,'month').reusedTools.length,0)>day.reusedTools.length);
});

test('latency percentile uses pooled observations rather than mean of group percentiles',()=>{
  const highVolume=[{ms:100,count:990}], lowVolume=[{ms:1000,count:10}];
  assert.equal(histogramPercentile([...highVolume,...lowVolume],.95),100);
  assert.equal(histogramPercentile([...highVolume,...lowVolume],.999),1000);
  assert.equal(histogramPercentile([],.95),null);
});
