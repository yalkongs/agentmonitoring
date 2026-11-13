import {affiliates as groupAffiliates, agents as groupAgents, aggregate as groupAggregate, workflows as groupWorkflows, type Affiliate, type Period} from './data.ts';
import {affiliateSnapshot} from './affiliate-data.ts';
import {bankDepartments} from './bank-catalog.ts';

/**
 * Dashboard scope. `/` shows the group (10 affiliates); `/imbank/` shows iM뱅크 with its
 * 29 source departments as units. The bank ledger is the existing iM뱅크 detail ledger
 * (affiliateSnapshot) regrouped by department, so bank totals equal the group's iM뱅크 row.
 */
export type ScopeKind = 'group' | 'bank';
export type Unit = Affiliate & {ledgerIndex:number; share:number};

export const scopeKind: ScopeKind =
  typeof document !== 'undefined' && document.documentElement?.dataset.scope === 'bank' ? 'bank' : 'group';

const bank = groupAffiliates.find(a => a.id === 'bank')!;

const iconFor = (name:string) =>
  /HR|총무/.test(name) ? 'users' : /여신|금융지원/.test(name) ? 'landmark' : /ICT|인프라/.test(name) ? 'cpu'
  : /디지털상담/.test(name) ? 'headset' : /디지털|채널/.test(name) ? 'smartphone' : /외환/.test(name) ? 'globe'
  : /정보보호/.test(name) ? 'lock' : /준법|자금세탁|리스크/.test(name) ? 'shield-check' : /소비자/.test(name) ? 'heart-handshake'
  : /WM|신탁/.test(name) ? 'chart-pie' : /수신/.test(name) ? 'wallet' : /페이먼트/.test(name) ? 'credit-card'
  : /재무/.test(name) ? 'calculator' : /홍보/.test(name) ? 'megaphone' : /사회공헌/.test(name) ? 'hand-coins'
  : /프로세스/.test(name) ? 'workflow' : /기획/.test(name) ? 'target' : 'building-2';

/** Synthetic department adoption; the agent-weighted mean is exactly the bank's group-level value. */
export function bankAdoption(): number[] {
  const counts = bankDepartments.map(d => d.count);
  const offsets = counts.map((_, i) => ((i * 7 + 3) % 17) - 8);
  let residual = offsets.reduce((n, o, i) => n + o * counts[i], 0);
  const order = counts.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).map(([, i]) => i);
  for (const i of order) {
    const step = Math.max(-3, Math.min(3, Math.trunc(-residual / counts[i])));
    offsets[i] += step; residual += step * counts[i];
  }
  while (residual !== 0) for (const i of [...order].reverse()) {
    if (residual === 0) break;
    if (counts[i] > Math.abs(residual)) continue;
    const step = residual > 0 ? -1 : 1; offsets[i] += step; residual += step * counts[i];
  }
  return offsets.map(o => bank.adoption + o);
}

export function buildBankUnits(): Unit[] {
  const adoption = bankAdoption();
  const rows = affiliateSnapshot('bank', 'month', 0).rows;
  return bankDepartments.map((d, i) => {
    const own = rows.filter(r => r.departmentId === d.id);
    const tokens = own.reduce((n, r) => n + r.tokens, 0), internalTokens = own.reduce((n, r) => n + r.internalTokens, 0);
    return {id:d.id, name:d.name, short:d.name, sector:'주무부서', agents:d.count, daily:bank.daily * d.count / bank.agents,
      savedMinutes:bank.savedMinutes, internal:Math.round(internalTokens / tokens * 100), adoption:adoption[i],
      success:bank.success, icon:iconFor(d.name), ledgerIndex:0, share:d.count / bank.agents};
  });
}

let cache: {key:string; snapshot:ReturnType<typeof affiliateSnapshot>} | undefined;
const bankSnapshot = (period:Period, tick:number) => {
  const key = `${period}:${tick}`;
  if (cache?.key !== key) cache = {key, snapshot:affiliateSnapshot('bank', period, tick)};
  return cache.snapshot;
};

export function bankAggregate(units:Unit[], scope:string, period:Period, tick = 0) {
  const rows = units.filter(u => scope === 'all' || u.id === scope);
  const ids = new Set(rows.map(u => u.id));
  const ledger = bankSnapshot(period, tick).rows.filter(r => ids.has(r.departmentId));
  const sum = (key:'completed'|'saved'|'tokens'|'internalTokens'|'cost'|'value'|'attempts') => ledger.reduce((n, r) => n + r[key], 0);
  const completed = sum('completed'), saved = sum('saved'), tokens = sum('tokens'), internalTokens = sum('internalTokens'), attempts = sum('attempts');
  const agents = rows.reduce((n, u) => n + u.agents, 0);
  return {rows, completed, saved, tokens, internalTokens, internal:tokens ? internalTokens / tokens * 100 : 0,
    success:attempts ? completed / attempts * 100 : 0, value:sum('value'), cost:sum('cost'), fte:saved / 160, agents,
    adoption:rows.reduce((n, u) => n + u.adoption * u.agents, 0) / agents};
}

const isBank = scopeKind === 'bank';
const groupUnits: Unit[] = groupAffiliates.map((a, i) => ({...a, ledgerIndex:i, share:1}));
export const units: Unit[] = isBank ? buildBankUnits() : groupUnits;
const unitById = new Map(units.map(u => [u.id, u]));

export function aggregate(scope:string, period:Period, tick = 0) {
  if (!isBank) {const d = groupAggregate(scope, period, tick); return {...d, rows:d.rows.map(a => unitById.get(a.id)!)};}
  return bankAggregate(units, scope, period, tick);
}

export const agents = isBank
  ? groupAgents.filter(a => a.affiliate.id === 'bank').map(a => ({...a, affiliate:unitById.get(a.departmentId)! as Affiliate}))
  : groupAgents;

export const workflows: Record<string, string[]> = isBank
  ? Object.fromEntries(units.map(u => [u.id, agents.filter(a => a.departmentId === u.id).map(a => a.name)]))
  : groupWorkflows;

/** The canvas networks have 10 slots; the bank shows its 9 largest departments plus one aggregate node. */
export const OTHERS = 'others';
const topUnits = isBank ? [...units].sort((a, b) => b.agents - a.agents || units.indexOf(a) - units.indexOf(b)).slice(0, 9) : units;
const rest = units.filter(u => !topUnits.includes(u));
export const networkNodes: Unit[] = isBank
  ? [...topUnits, {...units[0], id:OTHERS, name:`그 외 ${rest.length}개 부서`, short:`그 외 ${rest.length}개 부서`, icon:'layout-grid',
      agents:rest.reduce((n, u) => n + u.agents, 0),
      adoption:Math.round(rest.reduce((n, u) => n + u.adoption * u.agents, 0) / rest.reduce((n, u) => n + u.agents, 0))}]
  : units;
/** Network slot that represents a unit (departments outside the top 9 map to the aggregate node). */
export const nodeIndexOf = (id:string) => {const i = networkNodes.findIndex(n => n.id === id); return i >= 0 ? i : networkNodes.length - 1;};
export const nodeCovers = (nodeId:string, unitId:string) => nodeId === unitId || (nodeId === OTHERS && rest.some(u => u.id === unitId));

/** Scope-dependent copy. Group strings are exactly the original wording. */
export const L = isBank ? {
  org:'은행', orgName:'iM뱅크', unit:'부서', ORG:'BANK', UNIT:'DEPARTMENT', coreLabel:'iM BANK AX',
  title:'iM뱅크 AX 추진 현황', home:'은행 AX 현황', all:'은행 전체', overview:'iM BANK AX OVERVIEW', footer:'iM Bank AX Overview',
  impactTitle:'iM뱅크 AX 성과 분석', unitCount:(n:number) => `${n}개 부서`, unitsActive:(n:number) => `${n}개 부서 활용`,
  reuseScope:'선택 부서 사용 · 은행 내 2개 부서 이상', reuseRule:'은행 내 두 개 이상 부서',
} : {
  org:'그룹', orgName:'iM금융그룹', unit:'계열사', ORG:'GROUP', UNIT:'AFFILIATE', coreLabel:'GROUP AX',
  title:'그룹 AX 추진 현황', home:'그룹 AX 현황', all:'그룹 전체', overview:'GROUP AX OVERVIEW', footer:'Group AX Overview',
  impactTitle:'그룹 AX 성과 분석', unitCount:(n:number) => `${n}개 계열사`, unitsActive:(n:number) => `${n}개사 활용`,
  reuseScope:'선택사 사용 · 그룹 내 2개사 이상', reuseRule:'그룹 내 두 개 이상 계열사',
};
