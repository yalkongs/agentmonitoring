import {affiliates, nf, periods, type Period} from './data';
import {efficiency, mcpMetrics} from './management-data';

const icon = (name:string) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
export const efficiencyKeys = ['saved','cycleReduction','firstPassRate','costPerSuccess'] as const;
export const efficiencyFormat = (key:string, value:number) => nf(value,key === 'cycleReduction' || key === 'firstPassRate' ? 1 : 0);

export function efficiencyCards(d:ReturnType<typeof efficiency>, tv=false) {
  const cards = [
    {key:'saved', label:'순 절감 업무시간', unit:'시간', icon:'timer', detail:'검토·재작업·실패 대응 차감', context:`${nf(d.fte,1)}인월 상당 · 월 160h 기준`},
    {key:'cycleReduction', label:'업무 처리시간 단축률', unit:'%', icon:'gauge', detail:`평균 ${nf(d.baselineCycle,1)}분 → ${nf(d.assistedCycle,1)}분`, context:'동일 업무량 · 요청부터 최종 완료'},
    {key:'firstPassRate', label:'재작업 없는 완료율', unit:'%', icon:'circle-check', detail:'추가 수정 없이 승인·완료', context:'필수 승인 포함 · 종결 업무 기준'},
    {key:'costPerSuccess', label:'성공 업무 1건당 비용', unit:'원/건', icon:'coins', detail:'추론·연계·도구·검토 비용', context:'실패·재시도 비용 포함'},
  ];
  return cards.map((c,i) => {
    const value = efficiencyFormat(c.key,d[c.key as typeof efficiencyKeys[number]]);
    return tv
      ? `<article class="${i === 0 ? 'tv-kpi-primary' : ''}" title="${c.context}"><div>${icon(c.icon)} ${c.label}</div><strong><span data-tv-count="${c.key}">${value}</span><small>${c.unit}</small></strong><p data-eff-note="${i}">${c.detail}</p></article>`
      : `<article class="metric ${i === 0 ? 'featured' : ''}"><div class="metric-label">${icon(c.icon)}${c.label}</div><div class="metric-number"><span data-metric="${i}">${value}</span><small>${c.unit}</small></div><div class="metric-bottom"><span data-eff-note="${i}">${c.detail}</span></div><span class="metric-note">${c.context}</span></article>`;
  }).join('');
}

export function mcpPanel(scope:string, period:Period, tick:number, tv=false) {
  const d=mcpMetrics(scope,period,tick);
  return `<section class="mcp-panel ${tv?'mcp-tv':'panel mcp-dashboard'}" aria-label="내부 MCP 연계 현황">
    <div class="mcp-heading"><div><span>AX ENABLEMENT</span><h2>업무 시스템 활용 기반 · MCP</h2></div><button class="mcp-detail-button" data-mcp-detail aria-label="MCP 시스템별 내역 및 산정 기준">${icon('arrow-up-right')}</button></div>
    <div class="mcp-content"><div class="mcp-flow" aria-label="에이전트에서 내부 MCP를 거쳐 업무 시스템으로 연결되는 가상 흐름"><span>${icon('bot')}<b>AI 에이전트</b></span><i class="mcp-flow-link"></i><span class="mcp-gateway">${icon('network')}<b>내부 MCP</b></span><i class="mcp-flow-link"></i><span>${icon('database')}<b>업무 시스템</b></span><small>조회 · 실행 · 승인 후 반영</small></div>
    <div class="mcp-metrics">
      <article><label>핵심 업무 기능 연계율</label><strong><b data-mcp="coverage">${nf(d.coverage,1)}</b><small>%</small></strong><div class="mcp-bar"><i style="width:${d.coverage}%"></i></div><p>조회 ${d.readReady}/${d.readTarget} · 실행 ${d.executeReady}/${d.executeTarget}</p></article>
      <article><label>시스템 연계 업무 완료율</label><strong><b data-mcp="completionRate">${nf(d.completionRate,1)}</b><small>%</small></strong><div class="mcp-bar"><i style="width:${d.completionRate}%"></i></div><p><span data-mcp="completed">${nf(d.completed)}</span>건 · 최종 반영 확인</p></article>
      <article><label>MCP 활용 에이전트 비중</label><strong><b data-mcp="activeRate">${nf(d.activeRate,1)}</b><small>%</small></strong><div class="mcp-bar"><i style="width:${d.activeRate}%"></i></div><p>${d.activeAgents}/${d.operatingAgents}개 · 최근 30일 가정</p></article>
      <article><label>공통 도구 재사용</label><strong><b data-mcp="reusedTools">${d.reusedTools.length}</b><small>개</small></strong><div class="mcp-bar"><i style="width:${d.toolRows.length?d.reusedTools.length/d.toolRows.length*100:0}%"></i></div><p>${scope==='all'?`${d.toolRows.length}개 도구 중 · ${d.reuseAffiliates}개사 활용`:'선택사 사용 · 그룹 내 2개사 이상'}</p></article>
    </div></div>
    <div class="mcp-health"><span>호출 성공 <b data-mcp="callSuccess">${nf(d.callSuccess,2)}%</b></span><span>p95 <b data-mcp="p95">${d.p95 === null?'—':nf(d.p95)+'ms'}</b></span><span class="mcp-pending">승인 대기 <b data-mcp="pending">${d.pending}건</b></span><span>정책 차단 <b data-mcp="policyBlocked">${nf(d.policyBlocked)}건</b></span><span>오류 종결 <b data-mcp="failed">${nf(d.failed)}건</b></span><small>${periods[period].label} 실행 · 연결·운영 수치 모두 가상</small></div>
  </section>`;
}

export function updateEfficiencyContext(root:HTMLElement, d:ReturnType<typeof efficiency>) {
  const note=root.querySelector('[data-eff-note="1"]');
  if(note)note.textContent=`평균 ${nf(d.baselineCycle,1)}분 → ${nf(d.assistedCycle,1)}분`;
  const context=`${nf(d.fte,1)}인월 상당 · 월 160h 기준`;
  const capacity=root.querySelector('.metric.featured .metric-note');
  if(capacity)capacity.textContent=context;
  const primary=root.querySelector('.tv-kpi-primary');
  if(primary)primary.setAttribute('title',context);
}

export function updateMcpPanel(root:HTMLElement, scope:string, period:Period, tick:number) {
  const d=mcpMetrics(scope,period,tick);
  const values:Record<string,string>={completionRate:nf(d.completionRate,1),completed:nf(d.completed),callSuccess:nf(d.callSuccess,2)+'%',pending:d.pending+'건',policyBlocked:nf(d.policyBlocked)+'건',failed:nf(d.failed)+'건',p95:d.p95 === null?'—':nf(d.p95)+'ms'};
  for(const [key,value] of Object.entries(values)) {
    const el=root.querySelector(`[data-mcp="${key}"]`);if(el && el.textContent!==value)el.textContent=value;
  }
  const bar=root.querySelector<HTMLElement>('.mcp-metrics article:nth-child(2) .mcp-bar i');if(bar)bar.style.width=d.completionRate+'%';
}

export const managementDefinitions = `<dt>① 순 절감 업무시간</dt><dd>동일 업무량의 수작업 기준시간 − AI 활용 후 사람의 입력·검토·재작업·실패 대응 시간. 기존 데모의 순 절감 가정(완료 건당 1.7~5.4분)을 유지합니다. 인월은 월 160시간 환산이며 현금 절감·인원 감축을 뜻하지 않습니다.</dd>
<dt>② 업무 처리시간 단축률</dt><dd>1 − AI 활용 후 총 경과시간 / 같은 업무 구성의 기존 총 경과시간. 요청부터 최종 완료까지의 시연 평균이며, 서로 다른 업무의 중앙값이나 p95를 평균하지 않습니다.</dd>
<dt>③ 재작업 없는 완료율</dt><dd>추가 수정 없이 최초 승인·완료된 업무 / 판정이 끝난 전체 업무. 종결 실패도 분모에 포함합니다. 필수 승인 자체는 재작업이 아니며 승인 대기는 별도 진행 상태입니다.</dd>
<dt>④ 성공 업무 1건당 비용</dt><dd>(내부·외부 추론 원가 + 업무 연계 인프라·도구 비용 + 검토·재작업·실패 대응 인건비) / 품질을 충족한 완료 건수. 추론 원가에는 실패·재시도와 내부 GPU 배분 원가가 포함됩니다. 인건비는 시간당 35,000원 가정이며 구축·개발비는 제외합니다. 별도 표시된 추론 비용과 범위가 다릅니다.</dd>`;

export function efficiencyDetail(scope:string, period:Period, tick:number) {
  const d=efficiency(scope,period,tick);
  return `<span class="eyebrow">EFFICIENCY METHODOLOGY · DEMO</span><h2 id="management-dialog-title">에이전트 효율 지표 산정 기준</h2><p class="quiet">${scope==='all'?'그룹 전체':affiliates.find(a=>a.id===scope)!.name} · ${periods[period].label} · 모든 실행·성과 수치는 가상입니다.</p><div class="management-summary"><span>품질 충족 완료 <b>${nf(d.completed)}건</b></span><span>종결 업무 <b>${nf(d.judged)}건</b></span><span>총 운영 비용 <b>${nf(d.operatingCost)}원</b></span></div><dl class="method-list">${managementDefinitions}</dl>`;
}

export function mcpDetail(scope:string, period:Period, tick:number) {
  const d=mcpMetrics(scope,period,tick);
  return `<span class="eyebrow">MCP INTEGRATION · DEMO</span><h2 id="management-dialog-title">내부 MCP 연계 현황과 산정 기준</h2><p class="quiet">${scope==='all'?'그룹 전체':affiliates.find(a=>a.id===scope)!.name} · ${periods[period].label}. 실제 연결 없이 동작하는 시연 데이터입니다.</p>
    <div class="management-summary"><span>검증 기능 <b>${d.ready}/${d.target}개</b></span><span>업무 완료 <b>${nf(d.completed)}건</b></span><span>전체 호출 <b>${nf(d.calls)}회</b></span></div>
    <div class="mcp-detail-table"><table><caption>시스템별 연계 기능 · 2026.09.21 시연 스냅샷</caption><thead><tr><th>계열사</th><th>업무 시스템</th><th>조회 검증/대상</th><th>실행 검증/대상</th></tr></thead><tbody>${d.systems.map(s=>`<tr><td>${s.affiliate}</td><td>${s.name}</td><td>${s.readReady}/${s.readTarget}</td><td>${s.executeReady}/${s.executeTarget}</td></tr>`).join('')}</tbody></table></div>
    <dl class="method-list"><dt>핵심 업무 기능 연계율</dt><dd>운영 검증을 마친 조회·실행 기능 ${d.ready}개 / 연계 대상 ${d.target}개. 서버 수나 시스템 수와 구분하며 9월 21일 시점의 고정 시연 목록입니다.</dd><dt>시스템 연계 업무 완료율</dt><dd>업무 시스템에서 최종 결과를 확인한 ${nf(d.completed)}건 / 종결 ${nf(d.judged)}건. 종결은 완료 + 오류 종결 ${nf(d.failed)}건 + 정책 차단 ${nf(d.policyBlocked)}건입니다. 승인 대기 ${d.pending}건은 현재 진행 중이므로 분모에서 제외합니다. 필수 승인을 거쳐 완료한 업무도 성공으로 집계합니다.</dd><dt>MCP 활용 에이전트 비중</dt><dd>최근 30일간 업무에 MCP를 활용한 에이전트 ${d.activeAgents}개 / 시연 운영 에이전트 ${d.operatingAgents}개. 이 값은 오늘·이번 달·올해 필터와 별도의 고정 30일 스냅샷입니다. 등록 후보 388개나 원문 Long List 110개를 실제 운영 개수로 해석하지 않습니다.</dd><dt>공통 도구 재사용</dt><dd>선택 범위에서 사용하며 그룹 내 두 개 이상 계열사에서 활용하는 고유 도구 ${d.reusedTools.length}개. 회사별 사용 건수를 더하지 않고 도구 ID를 중복 제거합니다. 최근 30일 시연 스냅샷입니다.</dd><dt>호출 성공과 업무 완료</dt><dd>호출 성공률은 (${nf(d.calls)}회 − 기술 오류 ${nf(d.errors)}회) / ${nf(d.calls)}회입니다. 호출 성공은 업무 최종 완료와 다릅니다. p95는 전체 호출 지연 분포를 합산해 계산하며 계열사별 p95를 평균하지 않습니다. 호출 지연·승인·차단은 모두 가상입니다.</dd></dl>
    <h3>재사용 중인 공통 도구</h3><div class="mcp-tools">${d.reusedTools.map(t=>`<span>${t.name}<b>${t.affiliateIds.length}개 계열사</b></span>`).join('')}</div>`;
}
