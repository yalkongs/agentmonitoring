import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const origin=(process.env.DEMO_URL||'http://localhost:4173')+'/imbank/';
const page=await browser.newPage({viewport:{width:1920,height:1080}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await fs.mkdir('artifacts',{recursive:true});
const stray=/계열사|그룹 전체|그룹 AX|\/ 10\b|AFFILIATE/;

// TV (default at landscape ≥1280)
await page.goto(origin);await page.evaluate(()=>document.fonts.ready);
assert.match(await page.title(),/iM뱅크/);
assert.equal(await page.locator('.tv-shell').count(),1,'TV view is default on FHD');
assert.equal(await page.locator('.tv-network-node').count(),10);
assert.equal(await page.locator('.tv-affiliate-card').count(),29);
assert.match(await page.locator('.tv-network-node').last().innerText(),/그 외 20개 부서/);
assert.match(await page.locator('.tv-intro h1').innerText(),/iM뱅크 AX 추진 현황/);
for(const [width,height,label] of [[1920,1080,'fhd'],[3840,2160,'4k'],[1440,900,'laptop'],[1280,720,'hd'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});await page.goto(origin+'?view=tv');await page.waitForTimeout(250);
  const text=await page.locator('body').innerText();assert.ok(!stray.test(text),`tv ${label}: stray group copy "${text.match(stray)?.[0]}"`);
  const size=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth}));
  assert.ok(size.scrollWidth<=width,`tv ${label}: horizontal overflow ${size.scrollWidth}`);
  await page.screenshot({path:`artifacts/imbank-tv-${label}.png`});console.log(`PASS imbank tv ${label}: ${width}×${height}`);
}
// Fleet paging cycles through 6 pages of departments.
await page.setViewportSize({width:1920,height:1080});await page.goto(origin+'?view=tv');
for(let i=0;i<6;i++)await page.locator('[data-tv="page"]').click();
assert.equal(await page.locator('#tv-page-index').innerText(),'01');
// Node of a top department → bank detail filtered to that department.
await page.locator('.tv-network-node').first().click();
await page.waitForSelector('.affiliate-shell');
assert.match(await page.locator('.affiliate-scope-label').innerText(),/HR부/);
assert.equal(await page.locator('#aff-result-count').innerText(),'10');
assert.equal(await page.locator('.aff-company-picker').isVisible(),false);
assert.ok(new URL(page.url()).pathname.startsWith('/imbank/'),'stays under /imbank/');
await page.locator('.affiliate-breadcrumb [data-aff-action="back"]').click();
await page.waitForSelector('.tv-shell');
// Aggregate node → all departments.
await page.locator('.tv-network-node').last().click();await page.waitForSelector('.affiliate-shell');
assert.match(await page.locator('.affiliate-scope-label').innerText(),/전체 부서/);
await page.goBack();await page.waitForSelector('.tv-shell');

// Dashboard
for(const [width,height,label] of [[1920,1080,'fhd'],[3840,2160,'4k'],[1440,900,'laptop'],[1280,720,'hd'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});await page.goto(origin+'?view=dashboard');await page.waitForTimeout(250);
  const text=await page.locator('body').innerText();assert.ok(!stray.test(text),`dashboard ${label}: stray group copy "${text.match(stray)?.[0]}"`);
  const size=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth}));
  assert.ok(size.scrollWidth<=width,`dashboard ${label}: horizontal overflow ${size.scrollWidth}`);
  await page.screenshot({path:`artifacts/imbank-dashboard-${label}.png`});console.log(`PASS imbank dashboard ${label}: ${width}×${height}`);
}
await page.setViewportSize({width:1920,height:1080});await page.goto(origin+'?view=dashboard');
assert.equal(await page.locator('#scope option').count(),30);
assert.equal(await page.locator('.affiliates-panel tbody tr').count(),29);
assert.equal(await page.locator('.network-node').count(),10);
await page.selectOption('#scope','dept-04');assert.match(await page.locator('.network-stage .core small').innerText(),/외환사업부/);
for(const tab of ['agents','llm','impact']){await page.locator(`[data-tab="${tab}"]`).click();const text=await page.locator('body').innerText();assert.ok(!stray.test(text),`${tab}: stray group copy "${text.match(stray)?.[0]}"`);}
await page.locator('[data-tab="agents"]').click();await page.selectOption('#scope','all');
assert.match(await page.locator('.catalog .badge').first().innerText(),/110 AGENTS/);
await page.locator('[data-tab="overview"]').click();await page.locator('[data-action="method"]').first().click();
assert.match(await page.locator('#detail-dialog').innerText(),/29개 주무부서/);
await page.keyboard.press('Escape');
await page.locator('[data-mcp-detail]').first().click();
assert.ok(!stray.test(await page.locator('#detail-dialog').innerText()),'MCP dialog uses department copy');
await page.keyboard.press('Escape');

// Group view keeps its own scope.
await page.goto(origin.replace('/imbank/','/')+'?view=dashboard');
assert.equal(await page.locator('#scope option').count(),11);
assert.deepEqual(errors,[]);
console.log('PASS imbank TV/dashboard copy, 29 departments, 10-slot network, department drill-down, paging, tabs, dialogs; group view isolated; no runtime errors');
await browser.close();
