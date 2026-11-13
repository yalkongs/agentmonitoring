import test from 'node:test';
import assert from 'node:assert/strict';
import {affiliates, aggregate} from './data.ts';
import {bankDepartments} from './bank-catalog.ts';
import {bankAdoption, bankAggregate, buildBankUnits} from './scope.ts';

const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-9,`${a} != ${b}`);
const bank=affiliates.find(a=>a.id==='bank')!;

test('bank view units are the 29 source departments covering all 110 agents',()=>{
  const units=buildBankUnits();
  assert.equal(units.length,bankDepartments.length);
  assert.equal(units.reduce((n,u)=>n+u.agents,0),bank.agents);
  assert.deepEqual(units.map(u=>u.name),bankDepartments.map(d=>d.name));
});

test('synthetic department adoption averages exactly to the bank adoption',()=>{
  const adoption=bankAdoption(),counts=bankDepartments.map(d=>d.count);
  assert.equal(adoption.reduce((n,v,i)=>n+v*counts[i],0),bank.adoption*bank.agents);
  for(const v of adoption)assert.ok(v>=70&&v<=99,`adoption ${v}`);
});

test('bank view totals reconcile to the group ledger iM뱅크 row',()=>{
  const units=buildBankUnits();
  for(const period of ['day','month','year'] as const)for(const tick of [0,7,1000]){
    const all=bankAggregate(units,'all',period,tick),group=aggregate('bank',period,tick);
    for(const key of ['completed','saved','tokens','internalTokens','cost','value','success','agents','adoption'] as const)near(all[key],group[key]);
    const parts=units.map(u=>bankAggregate(units,u.id,period,tick));
    for(const key of ['completed','saved','tokens','cost'] as const)near(parts.reduce((n,p)=>n+p[key],0),all[key]);
  }
});
