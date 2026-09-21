import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const dashboardUrl=new URL(process.env.DEMO_URL||'http://localhost:5173');dashboardUrl.searchParams.set('view','dashboard');await page.goto(dashboardUrl.href);await page.evaluate(()=>document.fonts.ready);
await page.getByRole('button',{name:'실시간 시뮬레이션',exact:true}).click();
assert.equal(await page.locator('.metric').count(),6);assert.equal(await page.locator('.network-node').count(),10);assert.equal(await page.locator('[data-metric="0"]').innerText(),'426');
const before=await page.locator('[data-metric="2"]').innerText();await page.waitForTimeout(3300);assert.equal(await page.locator('[data-metric="2"]').innerText(),before);
await page.getByRole('button',{name:'시뮬레이션 일시정지',exact:true}).click();await page.waitForTimeout(3400);assert.notEqual(await page.locator('[data-metric="2"]').innerText(),before);
await page.getByRole('button',{name:'실시간 시뮬레이션',exact:true}).click();
await page.getByLabel('계열사 선택').selectOption('life');assert.equal(await page.locator('[data-metric="0"]').innerText(),'46');assert.equal(await page.locator('tbody tr').count(),1);
const monthly=await page.locator('[data-metric="2"]').innerText();await page.getByRole('button',{name:'오늘',exact:true}).click();assert.notEqual(await page.locator('[data-metric="2"]').innerText(),monthly);
await page.locator('.network-node[data-affiliate="bank"]').click();await page.getByRole('dialog').waitFor();assert.equal(await page.locator('#dialog-title').innerText(),'iM뱅크');await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
await page.getByLabel('계열사 선택').selectOption('all');await page.getByRole('button',{name:'AI 에이전트',exact:true}).click();await page.getByLabel('에이전트 검색').fill('BANK-001');assert.equal(await page.locator('.agent-card').count(),1);await page.locator('.agent-card').click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'닫기',exact:true}).click();
await page.getByLabel('에이전트 검색').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('.agent-card').count(),0);assert.equal(await page.locator('img').count(),0);
await page.getByLabel('에이전트 검색').fill('');await page.getByRole('button',{name:'검토 대기',exact:true}).click();assert.equal(await page.locator('.agent-card').count(),4);
await page.getByRole('button',{name:'하이브리드 LLM',exact:true}).click();assert.equal(await page.locator('.bar-column').count(),35);await page.getByRole('button',{name:'AX 성과',exact:true}).click();assert.equal(await page.locator('.scorecard>div').count(),3);
await page.getByRole('button',{name:'지표 안내',exact:true}).click();assert.ok((await page.getByRole('dialog').innerText()).includes('35,000'));await page.keyboard.press('Escape');
const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'현재 지표 CSV 다운로드'}).click();const download=await downloadPromise;const csv=await fs.readFile(await download.path(),'utf8');assert.ok(csv.includes('DEMO ONLY'));assert.ok(csv.includes('iM인베스트먼트아시아'));assert.equal(csv.split('\r\n').filter(l=>l.startsWith('iM')).length,10);
await page.getByRole('button',{name:'그룹 오버뷰',exact:true}).click();await page.getByRole('button',{name:'이번 달',exact:true}).click();
await fs.mkdir('artifacts',{recursive:true});
for(const [width,height,label] of [[1920,1080,'desktop'],[1440,900,'laptop'],[3840,2160,'4k'],[390,844,'mobile']]){
 await page.setViewportSize({width,height});await page.waitForTimeout(150);await page.screenshot({path:`artifacts/dashboard-${label}.png`,fullPage:true});
 const dims=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,clipped:[...document.querySelectorAll('.metric,.overview>.panel')].filter(e=>e.scrollHeight>e.clientHeight+2).map(e=>({class:e.className,client:e.clientHeight,scroll:e.scrollHeight}))}));
 assert.ok(dims.scrollWidth<=width,`${label} horizontal overflow: ${JSON.stringify(dims)}`);
 if(width>=1440){if(width>=1920)assert.ok(dims.scrollHeight<=height,`${label} vertical overflow`);assert.deepEqual(dims.clipped,[],`${label} clipped panels`);}
 console.log(`PASS ${label}: ${width}×${height}`);
}
await page.setViewportSize({width:1920,height:1080});await page.getByRole('button',{name:'발표 모드',exact:true}).click();assert.ok(await page.locator('body.presentation').count());assert.equal(await page.locator('.demo-label').innerText(),'DEMO DATA');await page.getByRole('button',{name:'발표 종료',exact:true}).click();assert.equal(await page.locator('body.presentation').count(),0);
assert.deepEqual(errors,[]);await browser.close();console.log('PASS filters, live/pause, dialogs, search, review queue, tabs, methodology, CSV, presentation; no runtime errors');
