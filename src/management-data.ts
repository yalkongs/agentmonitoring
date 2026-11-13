import {periods, type Period} from './data.ts';
import {units as affiliates, aggregate, scopeKind} from './scope.ts';

// Synthetic management ledger. The uploaded catalogue supplies names only, never telemetry.
export const hourlyValue = 35000;
export function efficiencyRows(scope: string, period: Period, tick = 0) {
  return affiliates.filter(a => scope === 'all' || a.id === scope).map(a => {
    const index = a.ledgerIndex;
    const base = aggregate(a.id, period, tick);
    const judged = Math.ceil(base.completed / (a.success / 100));
    const failed = judged - base.completed;
    const firstPass = Math.round(judged * (.957 - index * .004));
    const reworked = base.completed - firstPass;
    const humanMinutes = base.completed * (.52 + index * .045)
      + reworked * (1.2 + index * .1) + failed * (5 + index * .4);
    // Preserve the existing net-time scenario, including the review/rework/fallback budget.
    const baselineHumanMinutes = humanMinutes + base.saved * 60;
    const baselineElapsedMinutes = judged * (18 + a.savedMinutes + index * 1.7);
    const assistedElapsedMinutes = baselineElapsedMinutes * (.35 + index * .012);
    const extraInferenceCost = base.cost * (reworked + failed) / base.completed;
    const inferenceCost = base.cost + extraInferenceCost;
    const integrationCost = judged * (18 + index * 2);
    const reviewCost = humanMinutes / 60 * hourlyValue;
    return {id:a.id, name:a.name, ...base, judged, failed, firstPass, reworked,
      humanMinutes, baselineHumanMinutes, baselineElapsedMinutes, assistedElapsedMinutes,
      inferenceCost, integrationCost, reviewCost,
      operatingCost:inferenceCost + integrationCost + reviewCost};
  });
}

export function efficiency(scope: string, period: Period, tick = 0) {
  const rows = efficiencyRows(scope, period, tick);
  const sum = (key: 'judged'|'firstPass'|'reworked'|'failed'|'humanMinutes'|'baselineHumanMinutes'|'baselineElapsedMinutes'|'assistedElapsedMinutes'|'inferenceCost'|'integrationCost'|'reviewCost'|'operatingCost') => rows.reduce((n,r) => n + r[key],0);
  const base = aggregate(scope, period, tick);
  const judged = sum('judged'), baselineElapsedMinutes = sum('baselineElapsedMinutes');
  const assistedElapsedMinutes = sum('assistedElapsedMinutes');
  const operatingCost = sum('operatingCost');
  return {...base, judged, firstPassCount:sum('firstPass'), reworked:sum('reworked'), failed:sum('failed'),
    firstPassRate:judged ? sum('firstPass') / judged * 100 : 0,
    cycleReduction:baselineElapsedMinutes ? (1 - assistedElapsedMinutes / baselineElapsedMinutes) * 100 : 0,
    baselineCycle:judged ? baselineElapsedMinutes / judged : 0,
    assistedCycle:judged ? assistedElapsedMinutes / judged : 0,
    baselineElapsedMinutes, assistedElapsedMinutes,
    humanMinutes:sum('humanMinutes'), baselineHumanMinutes:sum('baselineHumanMinutes'),
    operatingCost, inferenceCost:sum('inferenceCost'), integrationCost:sum('integrationCost'), reviewCost:sum('reviewCost'),
    costPerSuccess:base.completed ? operatingCost / base.completed : 0};
}

const systemNames = ['주력 업무', '고객관계 CRM', '전자결재', '문서·지식'];
const primarySystems = ['여신 업무','투자·리서치','보험금 심사','리스·대출','운용 업무','IT 서비스','결제·정산','신용 조사','투자 심의','해외 투자'];
// Bank scope: one primary business system per department, named from the department's function.
const bankSystem = (name:string) => /여신|금융지원/.test(name) ? '여신 업무' : /외환/.test(name) ? '외환 업무' : /수신|WM|신탁/.test(name) ? '수신·자산관리'
  : /HR/.test(name) ? '인사 관리' : /ICT|인프라|디지털개발/.test(name) ? 'IT 서비스' : /디지털|채널|상담/.test(name) ? '디지털 채널'
  : /준법|자금세탁|소비자|리스크|정보보호/.test(name) ? '내부통제' : /페이먼트/.test(name) ? '결제·정산' : '경영 지원';
export const mcpSystems = affiliates.flatMap((affiliate, unitIndex) => systemNames.map((label, si) => {
  const ai = unitIndex % 10;
  const readTarget = 8 + si * 3 + ai % 3;
  const executeTarget = 5 + si + ai % 2;
  return {id:`${affiliate.id}-system-${si}`, affiliateId:affiliate.id, affiliate:affiliate.name,
    name:si === 0 ? (scopeKind === 'bank' ? bankSystem(affiliate.name) : primarySystems[ai]) : label,
    readTarget, executeTarget,
    readReady:Math.floor(readTarget * (.78 + (ai + si) % 3 * .06)),
    executeReady:Math.floor(executeTarget * (.56 + (ai + si) % 4 * .09))};
}));

const groupTools = [
  {id:'document-search', name:'문서 검색', affiliateIds:affiliates.map(a => a.id)},
  {id:'approval-draft', name:'결재 초안 등록', affiliateIds:['bank','sec','life','cap','ds','pay','credit']},
  {id:'approval-status', name:'결재 상태 조회', affiliateIds:['bank','sec','life','cap','asset','ds','pay','credit','invest']},
  {id:'document-register', name:'문서 등록', affiliateIds:['bank','sec','life','cap','asset','ds','invest','asia']},
  {id:'crm-lookup', name:'고객 업무 조회', affiliateIds:['bank','sec','life','cap','pay','credit']},
  {id:'audit-record', name:'실행 이력 기록', affiliateIds:affiliates.map(a => a.id)},
  {id:'task-register', name:'업무 요청 등록', affiliateIds:['bank','sec','life','ds','pay']},
  {id:'report-export', name:'보고서 내보내기', affiliateIds:['bank','sec','asset','invest','asia']},
  {id:'knowledge-retrieve', name:'규정 지식 조회', affiliateIds:['bank','sec','life','cap','credit']},
  {id:'settlement-check', name:'정산 검증', affiliateIds:['pay']},
  {id:'credit-intake', name:'여신 접수', affiliateIds:['bank']},
  {id:'insurance-register', name:'보험금 접수', affiliateIds:['life']},
];
const bankIds = (pattern:RegExp) => affiliates.filter(u => pattern.test(u.name)).map(u => u.id);
const bankTools = [
  {id:'document-search', name:'문서 검색', affiliateIds:affiliates.map(a => a.id)},
  {id:'approval-draft', name:'결재 초안 등록', affiliateIds:affiliates.filter((_, i) => i % 5 !== 4).map(a => a.id)},
  {id:'approval-status', name:'결재 상태 조회', affiliateIds:affiliates.filter((_, i) => i % 7 !== 6).map(a => a.id)},
  {id:'document-register', name:'문서 등록', affiliateIds:affiliates.filter((_, i) => i % 3 !== 2).map(a => a.id)},
  {id:'crm-lookup', name:'고객 업무 조회', affiliateIds:bankIds(/여신|수신|WM|신탁|외환|디지털상담|채널|소비자|금융지원/)},
  {id:'audit-record', name:'실행 이력 기록', affiliateIds:affiliates.map(a => a.id)},
  {id:'task-register', name:'업무 요청 등록', affiliateIds:bankIds(/ICT|디지털|프로세스|인프라|총무/)},
  {id:'report-export', name:'보고서 내보내기', affiliateIds:bankIds(/기획|리스크|준법|재무|홍보/)},
  {id:'knowledge-retrieve', name:'규정 지식 조회', affiliateIds:bankIds(/여신|준법|자금세탁|소비자|HR|외환|수신/)},
  {id:'settlement-check', name:'정산 검증', affiliateIds:bankIds(/페이먼트/)},
  {id:'credit-intake', name:'여신 접수', affiliateIds:bankIds(/여신정책|여신심사|금융지원/)},
];
export const commonTools = scopeKind === 'bank' ? bankTools : groupTools;

// Count histogram observations; never average affiliate p95 values.
export function histogramPercentile(buckets: {ms:number; count:number}[], percentile: number) {
  const sorted = [...buckets].sort((a,b) => a.ms - b.ms);
  const total = sorted.reduce((sum,b) => sum + b.count,0);
  if (!total) return null;
  let cumulative = 0;
  for (const bucket of sorted) {cumulative += bucket.count; if (cumulative >= total * percentile) return bucket.ms;}
  return sorted.at(-1)!.ms;
}

export function mcpMetrics(scope: string, period: Period, tick = 0) {
  const rows = efficiencyRows(scope, period, tick);
  const systems = mcpSystems.filter(s => scope === 'all' || s.affiliateId === scope);
  const toolRows = commonTools.filter(t => scope === 'all' || t.affiliateIds.includes(scope));
  const telemetry = rows.map(r => {
    const a = affiliates.find(a => a.id === r.id)!, ai = a.ledgerIndex, share = a.share;
    const operatingAgents = Math.floor(a.agents * (.83 - ai * .007));
    const activeAgents = Math.floor(operatingAgents * (.86 - ai * .015));
    const judged = Math.floor(r.judged * (.62 + ai * .018));
    const unsuccessful = Math.floor(r.failed * .7);
    const policyBlocked = Math.min(unsuccessful, Math.round(periods[period].factor * (ai + 1) * share));
    const completed = judged - unsuccessful;
    const calls = judged * (3 + ai % 3) + Math.round(tick * (ai + 1) * share);
    const errors = Math.floor(calls * (.002 + ai * .00015));
    const weights = [.48,.31,.16,.04];
    const buckets = weights.map((weight,i) => ({ms:[120,240,480,900][i], count:Math.floor(calls * weight)}));
    buckets.push({ms:1800, count:calls - buckets.reduce((n,b) => n + b.count,0)});
    return {id:a.id, operatingAgents, activeAgents, judged, completed, policyBlocked,
      failed:unsuccessful - policyBlocked, // Departments hold 0–2 pending approvals each so the bank total stays in the same range as the group row.
      pending:share < 1 ? Number((tick + affiliates.indexOf(a) * 3) % 4 === 0) + Number(a.agents >= 7) : 5 + ai % 4 + (tick + ai) % 5, calls, errors, buckets};
  });
  const sum = (key:'operatingAgents'|'activeAgents'|'judged'|'completed'|'failed'|'policyBlocked'|'pending'|'calls'|'errors') => telemetry.reduce((n,r) => n + r[key],0);
  const readTarget = systems.reduce((n,s) => n + s.readTarget,0), executeTarget = systems.reduce((n,s) => n + s.executeTarget,0);
  const readReady = systems.reduce((n,s) => n + s.readReady,0), executeReady = systems.reduce((n,s) => n + s.executeReady,0);
  const target = readTarget + executeTarget, ready = readReady + executeReady;
  const judged = sum('judged'), completed = sum('completed'), operatingAgents = sum('operatingAgents'), activeAgents = sum('activeAgents');
  const calls = sum('calls'), errors = sum('errors');
  const reusedTools = toolRows.filter(t => t.affiliateIds.length >= 2);
  const reuseAffiliates = new Set(reusedTools.flatMap(t => t.affiliateIds));
  return {systems, toolRows, reusedTools, reuseAffiliates:reuseAffiliates.size,
    ready, target, readReady, readTarget, executeReady, executeTarget, coverage:target ? ready / target * 100 : 0,
    judged, completed, failed:sum('failed'), policyBlocked:sum('policyBlocked'), pending:sum('pending'),
    completionRate:judged ? completed / judged * 100 : 0, operatingAgents, activeAgents,
    activeRate:operatingAgents ? activeAgents / operatingAgents * 100 : 0,
    calls, errors, callSuccess:calls ? (calls - errors) / calls * 100 : 0,
    p95:histogramPercentile(telemetry.flatMap(r => r.buckets),.95)};
}
