import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin=process.env.DEMO_URL||'http://127.0.0.1:4177';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 assert.equal((await page.goto(origin+'/1/')).status(),200);
 await page.evaluate(()=>document.fonts.ready);
 assert.match(await page.locator('h1').innerText(),/AX 성과, 고객가치로 이어지는가/);
 assert.equal(await page.locator('canvas').count(),0);
 await page.getByRole('button',{name:'흐름 효과 일시정지',exact:true}).click();
 // CSS pause takes effect on the next rendering frame. Wait for the browser to commit it.
 await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState==='paused'&&!a.pending));
 const paused=await page.evaluate(()=>document.getAnimations().map(a=>a.currentTime));await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>document.getAnimations().map(a=>a.currentTime)),paused);
 await page.getByRole('button',{name:'흐름 효과 재개',exact:true}).click();
 assert.equal(await page.locator('.customer-measures strong').allTextContents().then(v=>v.join(',')),'미수집,미수집');
 const readSaved=async()=>Number((await page.locator('[data-saved]').innerText()).replaceAll(',',''));
 const total=await readSaved();await page.waitForTimeout(3300);assert.equal(await readSaved(),total,'briefing stays fixed while reading');
 let sum=0;
 for(const id of ['bank','sec','life','cap','asset','ds','pay','credit','invest','asia']){
  await page.getByLabel('살펴볼 계열사').selectOption(id);sum+=await readSaved();
  assert.ok(page.url().includes('scope='+id));assert.ok(await page.getByRole('button',{name:'다음 업무 사례',exact:true}).isDisabled());
  await page.getByRole('button',{name:/연결 근거/}).click();assert.ok(await page.locator('#case-dialog').isVisible());assert.ok((await page.locator('#case-dialog').innerText()).includes('검증할 지표'));await page.keyboard.press('Escape');
 }
 assert.ok(Math.abs(total-sum)<=5,'group hours reconcile to affiliate hours within display rounding');
 await page.getByLabel('살펴볼 계열사').selectOption('bank');
 const monthly=await readSaved();await page.getByRole('button',{name:'일간',exact:true}).click();
 assert.ok(Math.abs(monthly-(await readSaved())*21)<=11,'period changes use the same snapshot basis');
 await page.reload();assert.equal(await page.getByLabel('살펴볼 계열사').inputValue(),'bank');
 assert.equal(await page.getByRole('button',{name:'일간',exact:true}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:/데이터·산정 기준/}).click();assert.ok(await page.getByRole('dialog').isVisible());
 assert.ok((await page.getByRole('dialog').innerText()).includes('고객 대기, 반복 요청, 민원, 만족도에 대한 관측 자료가 없습니다'));
 await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.ok(await page.locator('#method-button').evaluate(e=>document.activeElement===e));
 await page.goto(origin+'/1/?scope=invalid&period=invalid');assert.equal(await page.getByLabel('살펴볼 계열사').inputValue(),'all');assert.equal(await readSaved(),total);
 await fs.mkdir('artifacts',{recursive:true});
 await page.getByRole('button',{name:'다음 업무 사례',exact:true}).click();assert.match(await page.locator('#journey-title').innerText(),/iM증권/);await page.getByRole('button',{name:'이전 업무 사례',exact:true}).click();assert.match(await page.locator('#journey-title').innerText(),/iM뱅크/);
 await page.getByRole('button',{name:'전체화면',exact:true}).click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.getByRole('button',{name:'전체화면 종료',exact:true}).click();await page.waitForFunction(()=>!document.fullscreenElement);
 for(const [width,height,label] of [[1920,1080,'fhd'],[2560,1440,'qhd'],[3840,2160,'4k'],[1440,900,'laptop'],[1280,720,'hd'],[768,1024,'tablet'],[390,844,'mobile'],[360,800,'small-mobile']]){
  await page.setViewportSize({width,height});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' horizontal overflow');
  if(width>=1280){
   const sizes=await page.evaluate(()=>({height:innerHeight,scroll:document.documentElement.scrollHeight,clipped:[...document.querySelectorAll('.display-shell>*,.value-panel,.journey-track>div')].filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).map(e=>e.className)}));
   assert.ok(sizes.scroll<=height,`${label}: no vertical scrolling ${JSON.stringify(sizes)}`);assert.deepEqual(sizes.clipped,[],label+' no clipped panels');
  }
  await page.screenshot({path:`artifacts/briefing-${label}.png`,fullPage:true});
  console.log('PASS briefing '+label);
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>document.getAnimations().length),0);await page.emulateMedia({reducedMotion:'no-preference'});
 // A separate HTML entry must not load briefing CSS into the original views.
 await page.setViewportSize({width:1920,height:1080});await page.goto(origin+'/');await page.locator('.tv-shell').waitFor();
 assert.equal(await page.locator('#briefing').count(),0);assert.equal(await page.locator('.tv-network-node').count(),10);
 assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(13, 17, 23)');
 assert.equal(await page.locator('link[rel="stylesheet"]').evaluateAll(links=>links.some(l=>l.href.includes('briefing-'))),false);
 await page.getByRole('button',{name:'분석 화면',exact:true}).click();await page.locator('.dashboard').waitFor();assert.equal(await page.locator('.metric').count(),4);
 assert.deepEqual(errors,[]);console.log('PASS single-screen display, fixed snapshot, customer evidence labels, 10 scopes, period, URL/refresh, dialogs, manual cases, fullscreen, pause/reduced motion, original TV/dashboard isolation; no runtime errors');
} finally {await browser.close();}
