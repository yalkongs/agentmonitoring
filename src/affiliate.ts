import './affiliate.css';
import {createIcons,icons} from 'lucide';
import {affiliates,periods,nf,compact,won,type Period} from './data';
import {bankSource} from './bank-catalog';
import {affiliateSnapshot,filterAffiliateAgents,summarizeAgents,type AffiliateAgent,type AffiliateFilters} from './affiliate-data';
import {identity} from './identity';

type Options={id:string;tick:number;period:Period;selectedId?:string;onExit:(tick:number)=>void;onNavigate:(id:string,tick:number)=>void};
const icon=(name:string)=>`<i data-lucide="${name}" aria-hidden="true"></i>`;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const PAGE_SIZE=6;

export function mountAffiliate(root:HTMLElement,options:Options) {
  let tick=options.tick,period=options.period,live=true,page=0,selectedId=options.selectedId??'',destroyed=false;
  let snapshot=affiliateSnapshot(options.id,period,tick);
  const filters:AffiliateFilters={department:'all',query:'',route:'all',status:'all',sort:'source'};
  const company=snapshot.affiliate,isBank=company.id==='bank';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.body.classList.remove('tv-mode','presentation','simulation-paused');
  document.body.classList.add('affiliate-mode');
  const find=<T extends Element=HTMLElement>(s:string)=>root.querySelector<T>(s)!;
  const visible=()=>filterAffiliateAgents(snapshot.rows,filters);
  root.innerHTML=`<div class="affiliate-shell">
    <header class="affiliate-header"><a class="affiliate-brand" href="?view=tv" data-aff-action="back" aria-label="그룹 AX 현황으로 돌아가기">${identity()}</a>
      <nav class="affiliate-breadcrumb" aria-label="현재 위치"><button data-aff-action="back">그룹 AX 추진 현황</button>${icon('chevron-right')}<span>${esc(company.name)}</span><b>계열사 상세</b></nav>
      <div class="affiliate-header-end"><span class="demo-label">DEMO DATA</span><time id="affiliate-clock"></time><small>KST</small></div></header>
    <section class="affiliate-heading"><div class="affiliate-heading-main"><span class="affiliate-company-symbol">${icon(company.icon)}</span><div><span class="affiliate-eyebrow">AFFILIATE AX OVERVIEW / ${company.id.toUpperCase()}</span><h1>${esc(company.name)} <span>AI 에이전트 현황</span></h1><p>${isBank?'29개 주무부서 · 실제 업무 에이전트 Long List 110건':'가상 에이전트 목록 · 실제 목록 수신 전 시연 구성'}</p></div></div>
      <div class="affiliate-heading-actions"><button class="aff-outline" data-aff-action="back">${icon('arrow-left')} 그룹 AX 현황</button><label class="aff-company-picker">${icon('building-2')}<select aria-label="상세 화면 계열사 선택">${affiliates.map(a=>`<option value="${a.id}" ${a.id===company.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label><button class="aff-square" data-aff-action="fullscreen" aria-label="계열사 상세 전체화면">${icon('maximize')}</button></div>
    </section>
    <div class="affiliate-provenance"><div>${icon(isBank?'file-check-2':'flask-conical')}<strong>${isBank?'실제 목록 반영':'가상 목록'}</strong><span>${isBank?'명칭·담당 부서·정의는 첨부 원문 기준':'에이전트 이름과 업무 정의는 데모 구성'}</span><i></i><span>실행 상태·LLM 경로·성과 수치는 시뮬레이션</span></div><button data-aff-action="source">${isBank?'출처 및 산정 기준':'데모 산정 기준'}${icon('arrow-up-right')}</button></div>
    <section class="affiliate-kpis" aria-label="선택 범위 지표"></section>
    <div class="affiliate-controlbar"><div><span class="affiliate-scope-label">전체 부서</span><small id="affiliate-scope-count"></small><button class="aff-reset" data-aff-action="reset" hidden>필터 초기화 ${icon('rotate-ccw')}</button></div><div class="affiliate-period-tools"><div class="aff-periods">${(Object.keys(periods) as Period[]).map(p=>`<button data-aff-period="${p}" aria-pressed="${p===period}">${periods[p].label}</button>`).join('')}</div><span id="affiliate-period-note"></span><button class="aff-live" data-aff-action="live" aria-label="상세 실시간 갱신 일시정지"><i></i><span>데모 자동 갱신</span>${icon('pause')}</button></div></div>
    <div class="affiliate-workspace">
      <aside class="affiliate-departments"><div class="aff-panel-title"><div><span>DEPARTMENT INDEX</span><h2>주무부서</h2></div><b>${snapshot.departments.length}</b></div><button class="aff-dept-all" data-aff-dept="all" aria-pressed="true">${icon('layout-grid')} 전체 부서 <strong>${snapshot.rows.length}</strong></button><div class="aff-dept-list" aria-label="주무부서 필터">${snapshot.departments.map((d,i)=>`<button data-aff-dept="${d.id}" aria-pressed="false"><span class="aff-dept-index">${String(i+1).padStart(2,'0')}</span><span>${esc(d.name)}<i><b style="width:${d.count/Math.max(...snapshot.departments.map(v=>v.count))*100}%"></b></i></span><strong>${d.count}</strong></button>`).join('')}</div><div class="aff-dept-footer">${isBank?'원문 순서 · 부서별 중복 제거 목록':'타 계열사는 현재 데모 목록입니다.'}</div></aside>
      <section class="affiliate-directory"><div class="aff-panel-title"><div><span>AGENT DIRECTORY</span><h2>업무 에이전트 <b id="aff-result-count"></b></h2></div><span class="aff-source-tag">${isBank?'SOURCE · v0920':'DEMO CATALOG'}</span></div>
        <div class="aff-directory-tools"><label class="aff-search">${icon('search')}<input id="affiliate-search" type="search" autocomplete="off" placeholder="에이전트, 담당 부서, 업무 내용 검색" aria-label="계열사 에이전트 검색"></label><select id="affiliate-sort" aria-label="에이전트 정렬"><option value="source">원문 순서</option><option value="saved">절감 시간순</option></select></div>
        <div class="aff-directory-filters"><label>추론 경로 <select id="affiliate-route" aria-label="에이전트 추론 경로"><option value="all">전체</option><option>내부 중심</option><option>외부 중심</option></select></label><label>시연 상태 <select id="affiliate-status" aria-label="에이전트 시연 상태"><option value="all">전체</option><option>실행 중</option><option>대기</option><option>검토 대기</option></select></label><span>운영 지표 · DEMO</span></div>
        <div class="aff-table-scroll"><table class="aff-agent-table"><thead><tr><th>에이전트 / 담당 부서</th><th>시연 상태</th><th>완료 업무</th><th>절감 시간</th><th>토큰</th><th><span class="aff-sr-only">상세</span></th></tr></thead><tbody id="aff-agent-rows"></tbody></table><div class="aff-empty" hidden>${icon('search-x')}<strong>검색 결과가 없습니다.</strong><span>검색어나 부서·경로·상태 필터를 변경해 주세요.</span><button data-aff-action="reset">전체 목록 보기</button></div></div>
        <footer class="aff-pagination"><span id="aff-page-range" role="status"></span><div><button data-aff-action="prev" aria-label="에이전트 목록 이전 페이지">${icon('chevron-left')}</button><span id="aff-page-number"></span><button data-aff-action="next" aria-label="에이전트 목록 다음 페이지">${icon('chevron-right')}</button></div></footer>
      </section>
      <aside class="affiliate-agent-profile" aria-label="선택한 에이전트 상세"></aside>
    </div>
    <footer class="affiliate-footer"><span>${isBank?'SOURCE: AX추진부 · 2026.09 · v0920':'SYNTHETIC AGENT CATALOG'} <b>·</b> ${isBank?'우선순위·도입 시점은 원문 미기재':'실제 목록 및 도입 상태 미확인'}</span><span>가상 운영 지표이며 실제 실적·도입 현황이 아닙니다.</span></footer>
    <dialog class="affiliate-source-dialog" aria-labelledby="aff-source-title"></dialog>
  </div>`;

  function ensureSelection(rows:AffiliateAgent[]) {
    if(!rows.some(a=>a.id===selectedId))selectedId=rows[0]?.id??'';
  }
  function kpis(rows:AffiliateAgent[]) {
    const d=summarizeAgents(rows);
    find('.affiliate-kpis').innerHTML=[
      ['layers','조회 에이전트',nf(d.agents),'개',isBank?'원문 Long List 기준':'가상 에이전트 목록'],
      ['building-2','담당 부서',nf(d.departments),'개',isBank?'첨부 주무부서 기준':'시연 업무 묶음'],
      ['workflow','완료 업무',compact(d.completed),'건','성공적으로 완료한 업무 · 데모'],
      ['timer','순 절감 업무 시간',nf(d.saved),'h','Man-hour · 검토 시간 차감'],
      ['binary','LLM 토큰 사용량',compact(d.tokens),'tokens','내부 + 외부 · 데모'],
      ['circle-check','업무 처리 성공률',d.agents?nf(d.success,2):'—','%','완료 / 전체 시도 · 데모'],
    ].map(([glyph,label,value,unit,note],i)=>`<article class="${i===3?'aff-kpi-primary':''}"><label>${icon(glyph)}${label}</label><strong data-aff-metric="${i}" aria-label="${label} ${i===2?nf(d.completed):i===4?nf(d.tokens):value} ${unit}">${value}<small>${unit}</small></strong><p>${note}</p></article>`).join('');
  }
  function rowMarkup(a:AffiliateAgent) {
    return `<tr data-aff-row="${a.id}" class="${selectedId===a.id?'is-selected':''}"><td><button data-aff-agent="${a.id}" aria-pressed="${selectedId===a.id}"><span class="aff-agent-id">${a.id} <i>·</i> ${esc(a.department)}</span><strong>${esc(a.name)}</strong><small class="${a.routeLabel==='외부 중심'?'external':''}"><i></i>${a.routeLabel}</small></button></td><td><span class="aff-state ${a.state==='검토 대기'?'review':a.state==='대기'?'idle':'running'}">${a.state==='실행 중'?'<i></i>':''}${a.state}</span></td><td data-row-completed="${a.id}">${compact(a.completed)}</td><td data-row-saved="${a.id}">${nf(a.saved)}<small>h</small></td><td data-row-tokens="${a.id}">${compact(a.tokens)}</td><td><button class="aff-row-open" data-aff-agent="${a.id}" aria-label="${esc(a.name)} 상세 보기">${icon('chevron-right')}</button></td></tr>`;
  }
  function profile() {
    const a=snapshot.rows.find(a=>a.id===selectedId),panel=find('.affiliate-agent-profile');
    if(!a){panel.innerHTML='<div class="aff-profile-empty">에이전트를 선택하면<br>업무 정의와 실행 현황이 표시됩니다.</div>';return;}
    panel.innerHTML=`<div class="aff-profile-top"><span>AGENT PROFILE</span><b>${isBank?`원문 ${a.sourcePage}쪽`:'가상 정의'}</b></div><div class="aff-profile-content"><div class="aff-profile-identity"><span>${icon('bot')}</span><div><small>${esc(a.department)}</small><b>${a.id}</b></div><span class="aff-state ${a.state==='검토 대기'?'review':a.state==='대기'?'idle':'running'}">${a.state}</span></div><h2>${esc(a.name)}</h2><div class="aff-definition"><h3>업무 정의 <span>${isBank?'원문':'DEMO'}</span></h3><p>${esc(a.description)}</p></div>
      <div class="aff-source-fields"><div><span>우선순위</span><strong>미기재</strong></div><div><span>도입 시점</span><strong>미기재</strong></div><div><span>목록 구분</span><strong>${isBank?'Long List':'가상 목록'}</strong></div></div>
      <div class="aff-profile-section-head"><h3>실행 지표</h3><span>SIMULATED</span></div><div class="aff-profile-metrics"><div><span>완료 업무</span><strong data-profile="completed">${nf(a.completed)}<small>건</small></strong></div><div><span>확보 시간</span><strong data-profile="saved">${nf(a.saved)}<small>h</small></strong></div><div><span>토큰 사용량</span><strong data-profile="tokens">${compact(a.tokens)}</strong></div><div><span>추정 추론 비용</span><strong data-profile="cost">${won(a.cost)}<small>원</small></strong></div></div>
      <div class="aff-profile-route"><div><span><i></i>내부 <b>${nf(a.internalShare,1)}%</b></span><span class="external"><i></i>외부 <b>${nf(100-a.internalShare,1)}%</b></span></div><div class="aff-route-meter"><i style="width:${a.internalShare}%"></i></div></div>
      <div class="aff-profile-section-head"><h3>업무 실행 흐름</h3><span>DEMO FLOW</span></div><ol class="aff-execution">${['요청 수신','보안 검사','AI 추론','검토·완료'].map((s,i)=>`<li data-aff-step="${i}" class="${i===tick%4?'active':''}"><b>${String(i+1).padStart(2,'0')}</b><span>${s}</span><i></i></li>`).join('')}</ol><div class="aff-value-note">확보 시간의 업무 가치 <strong data-profile="value">${won(a.value)}원</strong><small>시간당 35,000원 가정 · 현금 절감액과 구분</small></div></div>`;
  }
  function renderResults() {
    const rows=visible();ensureSelection(rows);page=Math.min(page,Math.max(0,Math.ceil(rows.length/PAGE_SIZE)-1));
    kpis(rows);find('#aff-result-count').textContent=nf(rows.length);find('#affiliate-scope-count').textContent=`${rows.length}개 에이전트의 ${periods[period].label} 지표`;
    find('.affiliate-scope-label').textContent=snapshot.departments.find(d=>d.id===filters.department)?.name??'전체 부서';
    find<HTMLElement>('.aff-reset').hidden=filters.department==='all'&&!filters.query&&filters.route==='all'&&filters.status==='all';
    find('#aff-agent-rows').innerHTML=rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).map(rowMarkup).join('');
    find<HTMLElement>('.aff-empty').hidden=rows.length>0;
    find('#aff-page-range').textContent=rows.length?`${page*PAGE_SIZE+1}–${Math.min((page+1)*PAGE_SIZE,rows.length)} / ${rows.length}개`:'0개';
    find('#aff-page-number').textContent=`${page+1} / ${Math.max(1,Math.ceil(rows.length/PAGE_SIZE))}`;
    find<HTMLButtonElement>('[data-aff-action="prev"]').disabled=page===0;
    find<HTMLButtonElement>('[data-aff-action="next"]').disabled=(page+1)*PAGE_SIZE>=rows.length;
    find('#affiliate-period-note').textContent=period==='day'?'2026.09.21':period==='month'?'2026.09.01 — 09.21':'2026.01.01 — 09.21';
    root.querySelectorAll<HTMLButtonElement>('[data-aff-dept]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.affDept===filters.department)));
    root.querySelectorAll<HTMLButtonElement>('[data-aff-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.affPeriod===period)));
    profile();createIcons({icons});
  }
  function refreshMetrics() {
    snapshot=affiliateSnapshot(company.id,period,tick);kpis(visible());
    snapshot.rows.forEach(a=>{
      for(const [key,value] of [['completed',compact(a.completed)],['saved',`${nf(a.saved)}<small>h</small>`],['tokens',compact(a.tokens)]]){
        const e=root.querySelector(`[data-row-${key}="${a.id}"]`);if(e)e.innerHTML=value;
      }
    });
    const a=snapshot.rows.find(a=>a.id===selectedId);
    if(a){const values={completed:`${nf(a.completed)}<small>건</small>`,saved:`${nf(a.saved)}<small>h</small>`,tokens:compact(a.tokens),cost:`${won(a.cost)}<small>원</small>`,value:`${won(a.value)}원`};
      Object.entries(values).forEach(([key,value])=>{const e=root.querySelector(`[data-profile="${key}"]`);if(e)e.innerHTML=value;});}
    if(!reduced.matches)root.querySelectorAll('[data-aff-step]').forEach((e,i)=>e.classList.toggle('active',i===tick%4));
    createIcons({icons});
  }
  function sourceDialog() {
    const dialog=find<HTMLDialogElement>('.affiliate-source-dialog'),restore=document.activeElement as HTMLElement;
    dialog.innerHTML=`<button class="dialog-close icon-button" data-aff-action="close-source" aria-label="출처 안내 닫기">${icon('x')}</button><span class="affiliate-eyebrow">SOURCE & METHODOLOGY</span><h2 id="aff-source-title">${isBank?'실제 목록과 가상 운영 지표':'가상 목록과 운영 지표'}</h2>${isBank?`<p><strong>${bankSource.title} ${bankSource.version}</strong><br>${bankSource.author} · ${bankSource.date} · ${bankSource.pages}쪽</p><dl><dt>원문에서 반영한 정보</dt><dd>29개 주무부서, 중복 제거한 110개 에이전트의 제목·정의. 각 상세 화면에 원문 쪽수를 표시합니다.</dd><dt>원문에 없는 정보</dt><dd>우선순위와 도입 시점은 공란입니다. Long List는 실제 구축·운영 중임을 의미하지 않습니다. BANK 식별자는 화면 탐색을 위해 부여한 ID입니다.</dd></dl>`:'<p>이 계열사의 명칭과 부문을 제외한 에이전트 목록·업무 정의는 가상 시나리오입니다. 실제 목록이 제공되면 교체할 수 있습니다.</p>'}<dl><dt>실행 상태·추론 경로·성과</dt><dd>모두 데모입니다. 원문으로 확인된 실제 운영 현황이 아닙니다. 합성 실행량과 토큰을 에이전트별 가중치로 배분하며 부서·계열사 합계는 그룹 지표와 일치합니다.</dd><dt>시간·비용 산정</dt><dd>확보 시간 = 완료 업무 × ${company.savedMinutes}분 ÷ 60. 업무 가치는 시간당 35,000원 가정이며 현금 절감과 구분합니다. 내부/외부 추론 원가는 100만 토큰당 각각 1,800원/8,200원의 가정값입니다.</dd><dt>기간</dt><dd>2026.09.21을 기준으로 오늘 1일, 이번 달 21일, 올해 192일 상당의 합성 업무량을 사용합니다.</dd></dl>`;
    createIcons({icons});dialog.showModal();dialog.onclose=()=>restore?.focus();
  }
  function updateMotion() {
    const shell=find('.affiliate-shell');shell.classList.toggle('aff-paused',!live||document.hidden);shell.classList.toggle('aff-reduced',reduced.matches);
    const b=find<HTMLButtonElement>('.aff-live');b.innerHTML=`<i></i><span>${live?'데모 자동 갱신':'시뮬레이션 일시정지'}</span>${icon(live?'pause':'play')}`;b.setAttribute('aria-label',live?'상세 실시간 갱신 일시정지':'상세 실시간 갱신 재개');createIcons({icons});
  }
  const changed=()=>{page=0;renderResults();find('.aff-table-scroll').scrollTop=0;};
  const click=(event:Event)=>{
    const button=(event.target as Element).closest<HTMLElement>('[data-aff-action],[data-aff-dept],[data-aff-agent],[data-aff-period]');if(!button)return;
    if(button.dataset.affDept){filters.department=button.dataset.affDept;changed();return;}
    if(button.dataset.affAgent){selectedId=button.dataset.affAgent;const url=new URL(location.href);url.searchParams.set('agent',selectedId);history.replaceState(history.state,'',url);renderResults();if(matchMedia('(max-width:1199px)').matches)find('.affiliate-agent-profile').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});return;}
    if(button.dataset.affPeriod){period=button.dataset.affPeriod as Period;snapshot=affiliateSnapshot(company.id,period,tick);renderResults();return;}
    switch(button.dataset.affAction){
      case'back':event.preventDefault();options.onExit(tick);break;
      case'live':live=!live;updateMotion();break;
      case'prev':page=Math.max(0,page-1);renderResults();find('.aff-table-scroll').scrollTop=0;break;
      case'next':page++;renderResults();find('.aff-table-scroll').scrollTop=0;break;
      case'reset':Object.assign(filters,{department:'all',query:'',route:'all',status:'all',sort:'source'});find<HTMLInputElement>('#affiliate-search').value='';find<HTMLSelectElement>('#affiliate-route').value='all';find<HTMLSelectElement>('#affiliate-status').value='all';find<HTMLSelectElement>('#affiliate-sort').value='source';changed();break;
      case'source':sourceDialog();break;
      case'close-source':find<HTMLDialogElement>('.affiliate-source-dialog').close();break;
      case'fullscreen':void (document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{});break;
    }
  };
  const input=(event:Event)=>{if((event.target as HTMLElement).id==='affiliate-search'){filters.query=(event.target as HTMLInputElement).value;changed();}};
  const change=(event:Event)=>{const e=event.target as HTMLSelectElement;if(e.matches('.aff-company-picker select')){options.onNavigate(e.value,tick);return;}if(e.id==='affiliate-route')filters.route=e.value;if(e.id==='affiliate-status')filters.status=e.value;if(e.id==='affiliate-sort')filters.sort=e.value;changed();};
  const full=()=>{if(destroyed)return;const b=find('[data-aff-action="fullscreen"]');b.innerHTML=icon(document.fullscreenElement?'minimize':'maximize');b.setAttribute('aria-label',document.fullscreenElement?'계열사 상세 전체화면 종료':'계열사 상세 전체화면');createIcons({icons});};
  root.addEventListener('click',click);root.addEventListener('input',input);root.addEventListener('change',change);document.addEventListener('visibilitychange',updateMotion);document.addEventListener('fullscreenchange',full);reduced.addEventListener('change',updateMotion);
  function clock(){find('#affiliate-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());}
  let elapsed=0,last=performance.now();
  const timer=window.setInterval(()=>{const now=performance.now(),dt=Math.min(1000,now-last);last=now;clock();if(!live||document.hidden||find<HTMLDialogElement>('.affiliate-source-dialog').open)return;elapsed+=dt;if(elapsed>=3000){elapsed-=3000;tick++;refreshMetrics();}},500);
  const initial=visible().findIndex(a=>a.id===selectedId);if(initial>=0)page=Math.floor(initial/PAGE_SIZE);
  renderResults();clock();updateMotion();full();window.scrollTo(0,0);
  return {getTick:()=>tick,destroy(){destroyed=true;clearInterval(timer);root.removeEventListener('click',click);root.removeEventListener('input',input);root.removeEventListener('change',change);document.removeEventListener('visibilitychange',updateMotion);document.removeEventListener('fullscreenchange',full);reduced.removeEventListener('change',updateMotion);document.body.classList.remove('affiliate-mode');}};
}
