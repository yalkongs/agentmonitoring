import './briefing.css';
import { identity } from './identity';
import { affiliates, nf, type Period } from './data';
import { efficiency } from './management-data';

const root = document.querySelector<HTMLDivElement>('#briefing')!;
const params = new URLSearchParams(location.search);
let scope = affiliates.some(a => a.id === params.get('scope')) ? params.get('scope')! : 'all';
let period: Period = ['day', 'month', 'year'].includes(params.get('period') || '') ? params.get('period') as Period : 'month';
const dates = { day: '2026.09.21', month: '2026.09.01 — 09.21', year: '2026.01.01 — 09.21' };
const names = { day: '일간', month: '월간', year: '연간' };
const arrow = '<span aria-hidden="true">↗</span>';
let caseIndex = 0;
let motionPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
const contexts: Record<string, {work:string; efficiency:string; customer:string; measure:string; note:string}> = {
 bank: {work:'여신 문서검증', efficiency:'필수서류·기재 누락 확인 지원', customer:'서류를 다시 내는 수고 감소', measure:'신청 1건당 추가 서류 요청 횟수', note:'원문 BANK-018 · 4쪽의 업무 정의를 바탕으로 한 가치 연결 예시입니다. 도입·성과는 확인되지 않았습니다.'},
 sec: {work:'투자 상담 지원', efficiency:'상담 자료 탐색·정리 시간 확보', customer:'질문에 더 빠르고 충분한 답변', measure:'문의 접수부터 첫 유효 답변까지 시간', note:'증권 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 life: {work:'보험금 청구 서류 검토', efficiency:'접수 서류 확인 업무 지원', customer:'진행 상황을 더 빨리 안내받는 경험', measure:'청구 접수부터 첫 결과 안내까지 시간', note:'보험 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 cap: {work:'대출 서류 검증', efficiency:'서류 확인·누락 점검 지원', customer:'반복 제출과 불필요한 방문 감소', measure:'신청 1건당 추가 제출·재방문 횟수', note:'여신금융 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 asset: {work:'운용 보고서 작성 지원', efficiency:'정기 보고 자료 정리 시간 확보', customer:'운용 현황에 대한 적시 설명', measure:'고객 요청부터 보고 전달까지 시간', note:'자산운용 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 ds: {work:'IT 장애 원인 분석 지원', efficiency:'장애 분석과 대응 준비 시간 확보', customer:'서비스 중단으로 인한 불편 감소', measure:'영향 고객의 서비스 중단 지속시간', note:'IT 업무의 고객가치는 서비스를 이용하는 계열사와 최종 고객에 대한 간접 효과로 검증합니다. 설계 예시입니다.'},
 pay: {work:'결제 정산 검증', efficiency:'정산 확인·오류 점검 지원', customer:'정산 문의를 반복하는 수고 감소', measure:'정산 문의의 첫 접점 해결률', note:'전자금융 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 credit: {work:'신용 보고서 요약', efficiency:'자료 검토·요약 시간 확보', customer:'의뢰 결과를 적시에 확인', measure:'의뢰 접수부터 결과 전달까지 시간', note:'신용정보 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 invest: {work:'투자심의 자료 작성', efficiency:'검토 자료 준비 시간 확보', customer:'투자 검토 진행에 대한 적시 안내', measure:'검토 의뢰부터 첫 회신까지 시간', note:'벤처투자 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
 asia: {work:'해외 투자 리서치', efficiency:'다국어 자료 탐색·정리 지원', customer:'투자 정보 요청에 더 빠른 응답', measure:'정보 요청부터 유효 답변까지 시간', note:'글로벌 투자 업무 특성을 반영한 설계 예시입니다. 실제 운영 및 성과 자료는 없습니다.'},
};
function scopeName() { return affiliates.find(a => a.id === scope)?.name || '그룹 전체'; }
function syncUrl() {
 const url = new URL(location.href);
 if (scope === 'all') url.searchParams.delete('scope'); else url.searchParams.set('scope', scope);
 if (period === 'month') url.searchParams.delete('period'); else url.searchParams.set('period', period);
 history.replaceState(null, '', url);
}
function render() {
 const d = efficiency(scope, period, 0), label = scopeName();
 const caseIds = scope === 'all' ? affiliates.map(a=>a.id) : [scope];
 caseIndex %= caseIds.length;
 const id = caseIds[caseIndex], c = contexts[id], affiliate = affiliates.find(a=>a.id===id)!;
 const humanShare = d.humanMinutes/d.baselineHumanMinutes*100;
 root.innerHTML = `
 <a class="skip-link" href="#value-stage">본문으로 이동</a>
 <div class="display-shell ${motionPaused?'motion-paused':''}">
 <header class="display-header"><a class="display-brand" href="/1/" aria-label="AX 가치 현황 홈">${identity('VALUE & CUSTOMER IMPACT')}</a><div class="header-context">iM금융그룹 <span>CEO VIEW</span></div><div class="header-tools"><span class="demo">DEMO DATA</span><a href="/">기존 화면 ${arrow}</a><button id="motion-button" aria-label="${motionPaused?'흐름 효과 재개':'흐름 효과 일시정지'}" aria-pressed="${motionPaused}">${motionPaused?'▷':'Ⅱ'}</button><button id="fullscreen-button" aria-label="${document.fullscreenElement?'전체화면 종료':'전체화면'}">⛶</button></div></header>
 <section class="display-heading"><div><h1>AX 성과, <em>고객가치로 이어지는가</em></h1><p>${label} <span>·</span> ${dates[period]} <span>·</span> 고정 시연 데이터</p></div><div class="filters"><select id="brief-scope" aria-label="살펴볼 계열사"><option value="all">그룹 전체</option>${affiliates.map(a=>`<option value="${a.id}" ${scope===a.id?'selected':''}>${a.name}</option>`).join('')}</select><div class="periods" role="group" aria-label="집계 기간">${(['day','month','year'] as Period[]).map(p=>`<button data-period="${p}" aria-pressed="${p===period}">${names[p]}</button>`).join('')}</div></div></section>
 <main class="value-stage" id="value-stage">
 <section class="value-panel efficiency" aria-labelledby="efficiency-title"><div class="panel-top"><p class="eyebrow">01 <span>EFFICIENCY</span></p><span class="evidence-tag">가상 산정</span></div><h2 id="efficiency-title">업무에 돌려준 시간</h2><div class="hero-number"><strong data-saved>${nf(d.saved)}</strong><span>시간</span></div><p class="metric-caption">검토·재작업을 차감한 <b>순 절감 업무시간</b></p><div class="time-comparison"><div class="time-row"><span>기존 업무 투입</span><div class="bar-track"><i style="width:100%"></i></div><b>${nf(d.baselineHumanMinutes/60)}<small> h</small></b></div><div class="time-row assisted"><span>AI 활용 후 투입</span><div class="bar-track"><i style="width:${humanShare}%"></i></div><b>${nf(d.humanMinutes/60)}<small> h</small></b></div></div><div class="panel-bottom"><span class="status-dot"></span>확보한 여력 <b>상담·판단·사후관리 활용 확인</b></div></section>
 <div class="value-connector" aria-hidden="true"><span>→</span></div>
 <section class="value-panel customer" aria-labelledby="customer-title"><div class="panel-top"><p class="eyebrow">02 <span>CUSTOMER VALUE</span></p><span class="evidence-tag pending">고객 근거 필요</span></div><h2 id="customer-title">고객에게 돌아간 가치</h2><div class="customer-measures"><div><span class="measure-mark" aria-hidden="true">◷</span><div><h3>기다림의 감소</h3><p>요청에서 결과 안내까지</p></div><strong>미수집</strong></div><div><span class="measure-mark" aria-hidden="true">↺</span><div><h3>번거로움의 감소</h3><p>재문의 · 재제출 · 재방문</p></div><strong>미수집</strong></div></div><div class="panel-bottom"><span class="status-dot"></span>다음 검증 <b>실제 고객 여정의 변화 측정</b></div></section>
 </main>
 <section class="value-journey" aria-labelledby="journey-title"><div class="journey-heading"><div><p class="eyebrow">VALUE IN ACTION <span>업무 사례 · 설계 예시</span></p><h2 id="journey-title"><span>${affiliate.name}</span>${c.work}</h2></div><div class="journey-controls"><span>${String(caseIndex+1).padStart(2,'0')} / ${String(caseIds.length).padStart(2,'0')}</span><button id="case-prev" aria-label="이전 업무 사례" ${caseIds.length===1?'disabled':''}>←</button><button id="case-next" aria-label="다음 업무 사례" ${caseIds.length===1?'disabled':''}>→</button><button id="case-button">연결 근거 ${arrow}</button></div></div><div class="journey-track"><div><span class="journey-step">01</span><p><small>업무의 변화</small><b>${c.efficiency}</b></p></div><i class="journey-link" aria-hidden="true"></i><div><span class="journey-step">02</span><p><small>기대 고객가치 · 미검증</small><b>${c.customer}</b></p></div><i class="journey-link" aria-hidden="true"></i><div><span class="journey-step">03</span><p><small>검증할 지표</small><b>${c.measure}</b></p></div></div></section>
 <section class="decision-band" aria-labelledby="decision-title"><span class="decision-marker">CEO<br>FOCUS</span><div><h2 id="decision-title">고객 효과와 품질이 확인된 업무부터 확대</h2><p>확보 여력의 활용 → 고객 경험의 변화 → 비용·품질을 포함한 확대 판단</p></div><span class="decision-state">현재 고객 성과<br><b>검증 전</b></span></section>
 <footer class="display-footer"><span>효율: 합성 데이터 <b>·</b> 고객 성과: 미수집 <b>·</b> 현금 절감·인력 감축과 구분</span><button id="method-button">데이터·산정 기준 ${arrow}</button></footer>
 </div>
 <dialog aria-labelledby="method-title"><button class="dialog-close" aria-label="산정 기준 닫기">×</button><p class="eyebrow">ABOUT THIS BRIEFING</p><h2 id="method-title">데이터와 판단의 범위</h2><h3>효율성 · 가상 산정</h3><p>${label}, ${dates[period]} 기준입니다. 기존 대시보드와 동일한 합성 원장의 고정 시점(tick 0)을 사용합니다. 기존 업무시간에서 AI 활용 후 사람의 투입시간을 차감해 순 절감 시간을 산정합니다. 검토·재작업·실패 대응을 포함하며, 현금 절감이나 인력 감축을 뜻하지 않습니다.</p><h3>집계 · 비교하지 않는 항목</h3><p>동일 단위인 업무시간만 합산합니다. 그룹 전체는 10개 계열사의 업무 여력 합계이며 업종별 생산성의 우열을 뜻하지 않습니다. 서로 다른 업무의 개선율을 단순 평균하거나 계열사 순위를 매기지 않습니다. 연간은 192일 상당의 합성 업무량이며 실제 영업일 실적이 아닙니다.</p><h3>고객가치 · 직접 측정 필요</h3><p>고객 대기, 반복 요청, 민원, 만족도에 대한 관측 자료가 없습니다. 제안된 고객 지표와 업무 사례는 측정 설계이며, 효과가 검증된 성과나 도입 현황이 아닙니다. 미수집 값을 0이나 추정 성과로 대체하지 않습니다.</p><h3>업무 목록의 출처</h3><p>iM뱅크 BANK-018의 정의는 「주무부서별 업무 에이전트 목록 v0920」(AX추진부, 2026.09), 4쪽에서 가져왔습니다. 후보 목록은 실제 도입·운영을 의미하지 않습니다. 다른 계열사의 사례는 가상 설계 예시입니다.</p></dialog>
 <dialog id="case-dialog" aria-labelledby="case-title"><button class="dialog-close" aria-label="사례 닫기">×</button><p class="eyebrow">VALUE IN CONTEXT · 설계 예시</p><h2 id="case-title">${affiliate.name} · ${c.work}</h2><h3>업무 변화</h3><p>${c.efficiency}</p><h3>기대 고객가치 · 미검증</h3><p>${c.customer}</p><h3>검증할 지표</h3><p>${c.measure}</p><h3>출처와 해석</h3><p>${c.note}</p><a class="detail-link" href="/?view=affiliate&affiliate=${id}${id==='bank'?'&agent=BANK-018':''}&from=dashboard">기존 화면에서 업무 목록 보기 ${arrow}</a></dialog>`;
 root.querySelector<HTMLSelectElement>('#brief-scope')!.onchange=e=>{scope=(e.target as HTMLSelectElement).value;caseIndex=0;syncUrl();render();root.querySelector<HTMLSelectElement>('#brief-scope')!.focus();};
 root.querySelectorAll<HTMLButtonElement>('[data-period]').forEach(button=>button.onclick=()=>{period=button.dataset.period as Period;syncUrl();render();root.querySelector<HTMLButtonElement>(`[data-period="${period}"]`)!.focus();});
 const navigateCase=(delta:number)=>{caseIndex=(caseIndex+delta+caseIds.length)%caseIds.length;render();root.querySelector<HTMLButtonElement>(delta>0?'#case-next':'#case-prev')!.focus();};
 root.querySelector<HTMLButtonElement>('#case-prev')!.onclick=()=>navigateCase(-1);
 root.querySelector<HTMLButtonElement>('#case-next')!.onclick=()=>navigateCase(1);
 for(const [dialogSelector,buttonSelector] of [['dialog[aria-labelledby="method-title"]','#method-button'],['#case-dialog','#case-button']]){
  const dialog=root.querySelector<HTMLDialogElement>(dialogSelector)!,opener=root.querySelector<HTMLButtonElement>(buttonSelector)!;
  opener.onclick=()=>dialog.showModal();dialog.querySelector<HTMLButtonElement>('.dialog-close')!.onclick=()=>dialog.close();dialog.onclose=()=>opener.focus();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 }
 root.querySelector<HTMLButtonElement>('#motion-button')!.onclick=()=>{motionPaused=!motionPaused;const button=root.querySelector<HTMLButtonElement>('#motion-button')!;root.querySelector('.display-shell')!.classList.toggle('motion-paused',motionPaused);button.setAttribute('aria-pressed',String(motionPaused));button.setAttribute('aria-label',motionPaused?'흐름 효과 재개':'흐름 효과 일시정지');button.textContent=motionPaused?'▷':'Ⅱ';};
 root.querySelector<HTMLButtonElement>('#fullscreen-button')!.onclick=()=>void fullscreen();
}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{const button=root.querySelector<HTMLButtonElement>('#fullscreen-button')!;button.title='브라우저 메뉴의 전체화면 기능을 사용해 주세요.';}}
document.addEventListener('fullscreenchange',()=>root.querySelector('#fullscreen-button')?.setAttribute('aria-label',document.fullscreenElement?'전체화면 종료':'전체화면'));
document.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||document.querySelector('dialog[open]')||(event.target as HTMLElement)?.closest('input,select,textarea,button,a'))return;if(event.key.toLowerCase()==='f'){event.preventDefault();void fullscreen();}});
render();
