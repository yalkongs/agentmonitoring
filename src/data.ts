export type Period = 'day' | 'month' | 'year';
export type Affiliate = { id: string; name: string; short: string; sector: string; agents: number; daily: number; savedMinutes: number; internal: number; adoption: number; success: number; icon: string; };
export const affiliates: Affiliate[] = [
  { id:'bank', name:'iM뱅크', short:'iM뱅크', sector:'은행', agents:148, daily:82460, savedMinutes:2.8, internal:78, adoption:86, success:99.4, icon:'landmark' },
  { id:'sec', name:'iM증권', short:'iM증권', sector:'증권', agents:72, daily:34200, savedMinutes:3.5, internal:58, adoption:78, success:99.1, icon:'chart-no-axes-combined' },
  { id:'life', name:'iM라이프', short:'iM라이프', sector:'보험', agents:46, daily:21350, savedMinutes:4.2, internal:82, adoption:72, success:99.6, icon:'heart-pulse' },
  { id:'cap', name:'iM캐피탈', short:'iM캐피탈', sector:'여신금융', agents:35, daily:15200, savedMinutes:3.1, internal:75, adoption:69, success:99.2, icon:'layers' },
  { id:'asset', name:'iM에셋자산운용', short:'iM에셋', sector:'자산운용', agents:24, daily:7600, savedMinutes:4.8, internal:55, adoption:65, success:98.9, icon:'chart-pie' },
  { id:'ds', name:'iM데이터시스템', short:'iM데이터시스템', sector:'디지털·IT', agents:38, daily:19600, savedMinutes:2.2, internal:68, adoption:94, success:99.7, icon:'cpu' },
  { id:'pay', name:'iM유페이', short:'iM유페이', sector:'전자금융', agents:18, daily:10200, savedMinutes:1.7, internal:92, adoption:63, success:99.8, icon:'credit-card' },
  { id:'credit', name:'iM신용정보', short:'iM신용정보', sector:'신용정보', agents:21, daily:11300, savedMinutes:2.6, internal:95, adoption:71, success:99.5, icon:'shield-check' },
  { id:'invest', name:'iM투자파트너스', short:'iM투자파트너스', sector:'벤처투자', agents:14, daily:3200, savedMinutes:5.4, internal:48, adoption:58, success:98.8, icon:'sprout' },
  { id:'asia', name:'iM인베스트먼트아시아', short:'iM아시아', sector:'글로벌 투자', agents:10, daily:2100, savedMinutes:4.6, internal:42, adoption:54, success:99.1, icon:'globe' },
];
export const periods: Record<Period,{label:string; factor:number; compare:string; axis:string[]}> = {
  day:{label:'오늘',factor:1,compare:'전일 대비',axis:['00:00','04:00','08:00','12:00','16:00','20:00','24:00']},
  month:{label:'이번 달',factor:21,compare:'전월 동기 대비',axis:['09.01','09.04','09.07','09.10','09.13','09.16','09.21']},
  year:{label:'올해',factor:192,compare:'전년 동기 대비',axis:['1월','2월','3월','5월','6월','8월','9월']},
};
export function aggregate(scope: string, period: Period, tick = 0) {
 const rows = affiliates.filter(a=>scope==='all'||a.id===scope);
 const factor=periods[period].factor;
 const completed=rows.reduce((s,a)=>s+a.daily*factor+tick*(affiliates.indexOf(a)+2),0);
 const saved=rows.reduce((s,a)=>s+(a.daily*factor+tick*(affiliates.indexOf(a)+2))*a.savedMinutes/60,0);
 const tokens=rows.reduce((s,a)=>s+(a.daily*factor+tick*(affiliates.indexOf(a)+2))*(980+affiliates.indexOf(a)*120),0);
 const internalTokens=rows.reduce((s,a)=>s+(a.daily*factor+tick*(affiliates.indexOf(a)+2))*(980+affiliates.indexOf(a)*120)*a.internal/100,0);
 const attempts=rows.reduce((s,a)=>s+(a.daily*factor+tick*(affiliates.indexOf(a)+2))/(a.success/100),0);
 const success=completed/attempts*100;
 const value=saved*35000;
 // Illustrative fully allocated internal inference cost and external API cost; not vendor prices.
 const cost=internalTokens/1e6*1800+(tokens-internalTokens)/1e6*8200;
 return {rows,completed,saved,tokens,internalTokens,internal:internalTokens/tokens*100,success,value,cost,fte:saved/160,agents:rows.reduce((s,a)=>s+a.agents,0),adoption:rows.reduce((s,a)=>s+a.adoption*a.agents,0)/rows.reduce((s,a)=>s+a.agents,0)};
}
export const workflows: Record<string,string[]> = {
 bank:['기업여신 심사 지원','고객 상담 요약','금융상품 지식 검색','외환 서류 검토'],sec:['시장 리서치 브리핑','투자 보고서 초안','공시 정보 분석'],life:['보험금 청구 서류 검토','보험 상담 지원','약관 비교 분석'],cap:['리스 심사 지원','대출 서류 검증'],asset:['포트폴리오 리포트','운용 보고서 초안'],ds:['코드 품질 검토','IT 장애 원인 분석','사내 지식 검색'],pay:['결제 정산 검증','이상 거래 탐지 지원'],credit:['신용 보고서 요약','채권 관리 지원'],invest:['투자기업 리서치','투자심의 자료 작성'],asia:['글로벌 시장 브리핑','해외 투자 리서치']
};
export const agents = affiliates.flatMap((a,ai)=>Array.from({length:a.agents},(_,i)=>({
 id:`${a.id.toUpperCase()}-${String(i+1).padStart(3,'0')}`, affiliate:a, name:workflows[a.id][i%workflows[a.id].length],
 route:((i*37+ai*11)%100)<a.internal?'내부 LLM':'외부 LLM', state:i===a.agents-1&&ai%3===0?'검토 대기':i%17===0?'대기':'실행 중',
 latency:Math.round((0.7+(i%7)*0.23)*100)/100,
})));
export const nf = (n:number, digits=0)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:digits,minimumFractionDigits:digits}).format(n);
export const compact = (n:number)=>n>=1e9?`${nf(n/1e9,2)}B`:n>=1e6?`${nf(n/1e6,1)}M`:n>=1e3?`${nf(n/1e3,1)}K`:nf(n);
export const won = (n:number)=>n>=1e8?`${nf(n/1e8,2)}억`:n>=1e4?`${nf(n/1e4,0)}만`:nf(n);
