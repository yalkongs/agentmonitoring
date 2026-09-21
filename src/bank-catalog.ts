// Transcribed from the user-provided PDF, v0920 (31 pages).
// Names, departments and definitions are source data; deployment and telemetry are not supplied.
export type BankCatalogAgent = {id:string; name:string; description:string; departmentId:string; department:string; sourcePage:number};
export type BankDepartment = {id:string; name:string; count:number; sourcePage:number};
export const bankSource = {
  "title": "주무부서별 업무 에이전트 목록",
  "version": "v0920",
  "author": "AX추진부",
  "date": "2026.09",
  "pages": 31,
  "catalogCount": 110,
  "departmentCount": 29,
  "scope": "업무 에이전트 Long List · 중복 제거",
  "priority": "미기재",
  "deploymentDate": "미기재"
} as const;
export const bankDepartments: BankDepartment[] = [
  {
    "id": "dept-01",
    "name": "HR부",
    "count": 10,
    "sourcePage": 3
  },
  {
    "id": "dept-02",
    "name": "프로세스혁신부",
    "count": 8,
    "sourcePage": 4
  },
  {
    "id": "dept-03",
    "name": "여신정책부",
    "count": 7,
    "sourcePage": 5
  },
  {
    "id": "dept-04",
    "name": "외환사업부",
    "count": 7,
    "sourcePage": 6
  },
  {
    "id": "dept-05",
    "name": "ICT기획부",
    "count": 5,
    "sourcePage": 7
  },
  {
    "id": "dept-06",
    "name": "금융소비자보호부",
    "count": 5,
    "sourcePage": 8
  },
  {
    "id": "dept-07",
    "name": "디지털상담부",
    "count": 5,
    "sourcePage": 9
  },
  {
    "id": "dept-08",
    "name": "수신기획부",
    "count": 5,
    "sourcePage": 10
  },
  {
    "id": "dept-09",
    "name": "여신심사부",
    "count": 5,
    "sourcePage": 11
  },
  {
    "id": "dept-10",
    "name": "자금세탁방지부",
    "count": 5,
    "sourcePage": 12
  },
  {
    "id": "dept-11",
    "name": "WM사업부",
    "count": 4,
    "sourcePage": 13
  },
  {
    "id": "dept-12",
    "name": "금융지원부",
    "count": 4,
    "sourcePage": 14
  },
  {
    "id": "dept-13",
    "name": "디지털기획부",
    "count": 4,
    "sourcePage": 15
  },
  {
    "id": "dept-14",
    "name": "채널전략부",
    "count": 4,
    "sourcePage": 16
  },
  {
    "id": "dept-15",
    "name": "ICT개발부",
    "count": 3,
    "sourcePage": 17
  },
  {
    "id": "dept-16",
    "name": "여신관리부",
    "count": 3,
    "sourcePage": 18
  },
  {
    "id": "dept-17",
    "name": "전략기획부",
    "count": 3,
    "sourcePage": 19
  },
  {
    "id": "dept-18",
    "name": "준법감시부",
    "count": 3,
    "sourcePage": 20
  },
  {
    "id": "dept-19",
    "name": "페이먼트사업부",
    "count": 3,
    "sourcePage": 21
  },
  {
    "id": "dept-20",
    "name": "ICT금융부",
    "count": 2,
    "sourcePage": 22
  },
  {
    "id": "dept-21",
    "name": "디지털개발부",
    "count": 2,
    "sourcePage": 23
  },
  {
    "id": "dept-22",
    "name": "리스크관리부",
    "count": 2,
    "sourcePage": 24
  },
  {
    "id": "dept-23",
    "name": "신탁사업부",
    "count": 2,
    "sourcePage": 25
  },
  {
    "id": "dept-24",
    "name": "재무기획부",
    "count": 2,
    "sourcePage": 26
  },
  {
    "id": "dept-25",
    "name": "정보보호부",
    "count": 2,
    "sourcePage": 27
  },
  {
    "id": "dept-26",
    "name": "차세대인프라부",
    "count": 2,
    "sourcePage": 28
  },
  {
    "id": "dept-27",
    "name": "사회공헌부",
    "count": 1,
    "sourcePage": 29
  },
  {
    "id": "dept-28",
    "name": "총무부",
    "count": 1,
    "sourcePage": 30
  },
  {
    "id": "dept-29",
    "name": "홍보부",
    "count": 1,
    "sourcePage": 31
  }
];
export const bankCatalog: BankCatalogAgent[] = [
  {
    "id": "BANK-001",
    "name": "업무기록 자동 요약 일일·주간 회고 도구",
    "description": "메신저·통화·시스템 기록을 온디바이스 AI로 요약해 어제 한 일·오늘 할 일과 주간 회고를 만드는 도구",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-002",
    "name": "신입행원 실무 시뮬레이션 AI 교육 프로그램",
    "description": "단말 조작·고객 응대 가상 시나리오를 AI가 자동 채점·피드백하는 신입행원 실무 시뮬레이션 교육 프로그램",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-003",
    "name": "인수인계 문서 질의응답 어시스턴트",
    "description": "흩어진 인수인계 문서를 학습해 자연어 질문에 처리 절차·주의사항·담당 부서를 답하는 질의응답 어시스턴트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-004",
    "name": "사내 업무 질의응답 통합 지식 공유 에이전트",
    "description": "지점·본부·ICT 간 업무 질의응답을 공유·평가해 사내 지식으로 축적하는 Q&A 에이전트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-005",
    "name": "업무분장 기반 담당부서·담당자 안내 서비스",
    "description": "질의 업무를 입력하면 업무분장 기반으로 담당 부서·담당자·연락처를 찾아주는 사내 안내 도구",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-006",
    "name": "사내 공문·교육자료 자동 요약·숏폼 생성 서비스",
    "description": "긴 공문·교육 영상을 STT·AI로 핵심 요약본과 30~60초 숏폼으로 자동 생성하는 서비스",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-007",
    "name": "AI 경력개발 경로 추천 에이전트",
    "description": "직원별 경력·역량·희망 직무를 분석해 성장 경로와 필요 교육·직무 경험을 추천하는 경력개발 에이전트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-008",
    "name": "연수자동시스템 에이전트",
    "description": "직무경력과 수강 이력을 분석해 다음 단계 연수를 자동 추천하는 연수 추천 시스템 에이전트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-009",
    "name": "사내 위키 기반 질의응답 에이전트",
    "description": "업로드 문서를 구분해 업무 매뉴얼 조회·질의응답을 제공하는 사내 위키(iM 위키) 에이전트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-010",
    "name": "HR 통합 에이전트",
    "description": "사내 규정·복지·연수 정보를 RAG로 연결해 단일 창구에서 답하는 HR 통합 질의응답 에이전트",
    "departmentId": "dept-01",
    "department": "HR부",
    "sourcePage": 3
  },
  {
    "id": "BANK-011",
    "name": "상속 서류 자동 분석 원스톱 처리 서비스",
    "description": "AI OCR·지식 그래프로 상속 서류를 분석해 법정 지분 계산과 통합 서식 처리를 하는 원스톱 상속 서비스",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-012",
    "name": "담보 공적장부 자동 분류·등록 에이전트",
    "description": "원탑 발급 공적장부 6종을 AI가 지번·종류별로 분류해 BPR에 바로 등록하는 담보 서류 등록 에이전트",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-013",
    "name": "넥스피아 입력정보 기반 AI 사전점검·업무가이드 서비스",
    "description": "넥스피아 입력 중 내규·예외 조건을 실시간 확인해 누락 서류·제한 가능성을 미리 알려주는 사전점검 기능",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-014",
    "name": "창구 연속업무 화면 자동 연계 기능",
    "description": "넥스피아의 독립 화면을 한 흐름으로 묶어 다음 화면 전환과 정보 연계를 자동화하는 연속업무 기능",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-015",
    "name": "대량 입·지급 이체 자동 입력 도우미",
    "description": "대량 거래 고객 서류·엑셀을 AI-OCR로 인식해 내부 전산 양식으로 자동 변환·입력하는 이체 도우미",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-016",
    "name": "어음·수표 스캔 이미지 사전 검수 에이전트",
    "description": "어음·수표 스캔 이미지를 본부 전송 전 AI 비전으로 검증해 오류를 차단하는 사전 검수 시스템",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-017",
    "name": "스캔 문서 자동 분류 에이전트",
    "description": "여신 스캔스테이션 문서 자동 분류(iM GPT)를 AX 플랫폼으로 이관·고도화한 문서 분류 에이전트",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-018",
    "name": "여신 문서검증(IDP) 에이전트",
    "description": "여신 제출 문서를 IDP로 파싱해 필수서류와 필수 기재 누락을 자동 검증·알림하는 문서검증 에이전트",
    "departmentId": "dept-02",
    "department": "프로세스혁신부",
    "sourcePage": 4
  },
  {
    "id": "BANK-019",
    "name": "기금대출 자격·적용금리 자동 판정 어시스턴트",
    "description": "디딤돌·버팀목 등 기금대출의 자격조건과 적용 금리·한도·서류를 약관 RAG로 즉시 판정하는 어시스턴트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-020",
    "name": "가계 신용대출 연장 자동승인 프로세스",
    "description": "감액 필요 건만 영업점이 처리하고 나머지는 URL로 비대면 승인하는 가계 신용대출 연장 자동화 프로세스",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-021",
    "name": "기업여신 생애주기 통합관리 에이전트",
    "description": "기업여신 심사·모니터링·회수를 한 흐름으로 묶고 금리와 AI 조기경보를 제공하는 통합 플랫폼 에이전트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-022",
    "name": "우량기업 여신 섭외대상 자동 선별 에이전트",
    "description": "공개 재무정보로 우량기업을 선별하고 섭외 스크립트를 생성하는 섭외대상 선별 에이전트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-023",
    "name": "보증서 지침·현장사례 통합 아카이브 에이전트",
    "description": "보증기관 지침과 영업점 현장 노하우를 한곳에서 갱신·검색하는 보증서 통합 아카이브 에이전트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-024",
    "name": "여신신청메인(전결권 보조) 어시스턴트",
    "description": "여신신청 화면에서 직무전결규정 RAG·위반사례 검색으로 전결권 판단을 보조하는 대화형 어시스턴트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-025",
    "name": "여신 의견서 작성 에이전트",
    "description": "TCRMS 데이터와 정해진 작성 룰로 여신 의견서 초안을 자동 작성하는 에이전트",
    "departmentId": "dept-03",
    "department": "여신정책부",
    "sourcePage": 5
  },
  {
    "id": "BANK-026",
    "name": "QR 기반 원클릭 환전예약 서비스",
    "description": "로그인 없이 QR 스캔으로 지점별 외화 보유 현황을 확인하고 환전을 신청하는 모바일 웹 서비스",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-027",
    "name": "수출입 서류 자동 검증 무역금융 에이전트",
    "description": "수출입 신용장 서류 검증을 자동화하고 해외조달·기업금융 연계를 지원하는 무역금융 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-028",
    "name": "징구서류 데이터 입력 자동화 에이전트",
    "description": "스캔한 외환 징구서류·송장 내용을 읽어 계정계 단말에 자동 입력하는 입력 자동화 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-029",
    "name": "환거래 종류 판별 에이전트",
    "description": "환거래 서류 입력 시 외환 거래 종류를 자동 분류·판별하는 환거래 종류 판별 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-030",
    "name": "수입신용장 개설 심사 에이전트",
    "description": "선적서류 PDF를 분류·추출해 신용장 조건과 대조하고 신용장 통일규칙 기준 하자 후보를 표시하는 심사 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-031",
    "name": "해외송금 증빙심사 에이전트",
    "description": "해외송금 증빙서류를 자동 판독해 송금 신청정보와 일치 여부·누락 사항을 제시하는 증빙심사 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-032",
    "name": "수출환어음 매입서류 하자점검 에이전트",
    "description": "수출 선적서류를 자동 분류·추출해 신용장 조건·서류 간 교차 비교로 하자 항목을 제시하는 점검 에이전트",
    "departmentId": "dept-04",
    "department": "외환사업부",
    "sourcePage": 6
  },
  {
    "id": "BANK-033",
    "name": "사내 메신저 질의응답 정형화 솔루션",
    "description": "AI가 질문을 정형화하고 표준 답변을 추천하며 상태 버튼을 제공하는 초경량 업무용 메신저",
    "departmentId": "dept-05",
    "department": "ICT기획부",
    "sourcePage": 7
  },
  {
    "id": "BANK-034",
    "name": "MS Office 연동 내부망 문서작성 AI 어시스턴트",
    "description": "MS Office 안에서 폐쇄망 iM GPT로 요약·교정·초안 작성을 지원하는 문서작성 확장 프로그램",
    "departmentId": "dept-05",
    "department": "ICT기획부",
    "sourcePage": 7
  },
  {
    "id": "BANK-035",
    "name": "IT 미사용 자원 자동 진단 보고서 도구",
    "description": "프로젝트 소스와 운영 로그를 분석해 미사용 자원을 선별하고 진단 보고서를 만드는 IT 자원 진단 도구",
    "departmentId": "dept-05",
    "department": "ICT기획부",
    "sourcePage": 7
  },
  {
    "id": "BANK-036",
    "name": "업무시스템 소스 분석·프로세스 자동 시각화 도구 에이전트",
    "description": "업무시스템 소스코드를 분석해 업무 처리 순서와 기능을 웹 흐름도로 자동 시각화하는 도구",
    "departmentId": "dept-05",
    "department": "ICT기획부",
    "sourcePage": 7
  },
  {
    "id": "BANK-037",
    "name": "RPA 연동 OCR 에이전트",
    "description": "RPA 처리 과정의 OCR 결과를 AI로 교차 검증하는 RPA 연동 OCR 에이전트",
    "departmentId": "dept-05",
    "department": "ICT기획부",
    "sourcePage": 7
  },
  {
    "id": "BANK-038",
    "name": "창구 상담 실시간 불완전판매 예방 어시스턴트",
    "description": "창구 상담을 실시간 분석해 필수 고지 누락·금지어를 감지하고 가이드를 띄우는 불완전판매 예방 어시스턴트",
    "departmentId": "dept-06",
    "department": "금융소비자보호부",
    "sourcePage": 8
  },
  {
    "id": "BANK-039",
    "name": "민원 요약 에이전트",
    "description": "금융소비자보호시스템 민원 요약(iM GPT)을 AX 플랫폼으로 이관·고도화한 민원 요약 에이전트",
    "departmentId": "dept-06",
    "department": "금융소비자보호부",
    "sourcePage": 8
  },
  {
    "id": "BANK-040",
    "name": "금융소비자보호부 사전협의 에이전트",
    "description": "금소통 사전협의 건의 체크리스트 검증과 제출자료 쟁점·미흡사항 근거를 제시하는 채팅형 사전협의 에이전트",
    "departmentId": "dept-06",
    "department": "금융소비자보호부",
    "sourcePage": 8
  },
  {
    "id": "BANK-041",
    "name": "AI 민원 답변 에이전트",
    "description": "금융소비자보호통합시스템(금소통)에서 민원 답변 초안을 자동 작성하는 민원 답변 에이전트",
    "departmentId": "dept-06",
    "department": "금융소비자보호부",
    "sourcePage": 8
  },
  {
    "id": "BANK-042",
    "name": "민원 접수·배정·브리핑 에이전트",
    "description": "접수 민원의 핵심·유형을 요약해 담당부서를 배정하고 쟁점·관련 규정을 브리핑하는 민원 에이전트",
    "departmentId": "dept-06",
    "department": "금융소비자보호부",
    "sourcePage": 8
  },
  {
    "id": "BANK-043",
    "name": "민원 유형별 응대 스크립트 제시 에이전트",
    "description": "민원 사례를 분석해 고객 유형별 공감 표현·관련 법 조항·해결 스크립트를 즉시 제시하는 응대 지원 시스템",
    "departmentId": "dept-07",
    "department": "디지털상담부",
    "sourcePage": 9
  },
  {
    "id": "BANK-044",
    "name": "금융상품설명서 상담사용 자동 요약 서비스",
    "description": "방대한 상품설명서를 상담사 관점 핵심 요약과 예상 FAQ로 자동 생성해 제공하는 서비스",
    "departmentId": "dept-07",
    "department": "디지털상담부",
    "sourcePage": 9
  },
  {
    "id": "BANK-045",
    "name": "인바운드 콜량 예측·상담인력 배치 에이전트",
    "description": "과거 데이터와 내외부 이슈로 시간대별 콜량과 적정 상담사 수를 예측하는 콜센터 인력 배치 에이전트",
    "departmentId": "dept-07",
    "department": "디지털상담부",
    "sourcePage": 9
  },
  {
    "id": "BANK-046",
    "name": "상담 답변 초안 작성 에이전트",
    "description": "eBiz 이메일 상담 답변 초안 작성(iM GPT)을 AX 플랫폼으로 이관·고도화한 답변 초안 에이전트",
    "departmentId": "dept-07",
    "department": "디지털상담부",
    "sourcePage": 9
  },
  {
    "id": "BANK-047",
    "name": "콜센터 상담 후처리 에이전트",
    "description": "음성 인식으로 단순 업무를 처리하고 만기 안내 콜·통화 요약·후속 분류를 수행하는 콜센터 에이전트",
    "departmentId": "dept-07",
    "department": "디지털상담부",
    "sourcePage": 9
  },
  {
    "id": "BANK-048",
    "name": "고객 눈높이 금융용어 자동 설명 서비스",
    "description": "고객 연령·이해도에 맞춰 금융상품·용어를 쉬운 설명과 시각 자료로 풀어주는 맞춤형 설명 서비스",
    "departmentId": "dept-08",
    "department": "수신기획부",
    "sourcePage": 10
  },
  {
    "id": "BANK-049",
    "name": "고령 고객 비과세 가입자격 자동 판별 서비스",
    "description": "공공마이데이터로 고령 고객의 비과세 가입 자격을 즉시 판별하고 대체 상품을 추천하는 서비스",
    "departmentId": "dept-08",
    "department": "수신기획부",
    "sourcePage": 10
  },
  {
    "id": "BANK-050",
    "name": "자동이체 분석 기반 파킹통장 자금이동 알림 서비스",
    "description": "입금 감지 시 이달 지출을 예측해 안전 금액을 파킹통장으로 옮기도록 알리는 자금이동 알림 서비스",
    "departmentId": "dept-08",
    "department": "수신기획부",
    "sourcePage": 10
  },
  {
    "id": "BANK-051",
    "name": "사업자 실제영위 비대면 검증 서비스",
    "description": "사업자번호로 국세청·상권·인허가·카드매출을 교차 검증해 한도제한계좌를 비대면 해제하는 실영위 검증 서비스",
    "departmentId": "dept-08",
    "department": "수신기획부",
    "sourcePage": 10
  },
  {
    "id": "BANK-052",
    "name": "법인 서류 자동 대조·지분관계 도식화 도구",
    "description": "법인 제출 서류의 회사명·대표자·주소를 추출·대조하고 지분관계를 도식화하는 법인 서류 검증 도구",
    "departmentId": "dept-08",
    "department": "수신기획부",
    "sourcePage": 10
  },
  {
    "id": "BANK-053",
    "name": "주택담보대출 심사·실행 자동화 에이전트",
    "description": "비대면 제출 서류를 AI OCR로 인식해 DSR 심사부터 실행까지 자동 처리하는 주택담보대출 자동화 에이전트",
    "departmentId": "dept-09",
    "department": "여신심사부",
    "sourcePage": 11
  },
  {
    "id": "BANK-054",
    "name": "BPR 여신심사 입력항목·규정 안내 어시스턴트",
    "description": "BPR에서 상품 코드 선택 시 필수 입력 사항·관련 규정·유의사항을 팝업으로 안내하는 여신심사 보조 도구",
    "departmentId": "dept-09",
    "department": "여신심사부",
    "sourcePage": 11
  },
  {
    "id": "BANK-055",
    "name": "여신 재무데이터 자동 분석·레이팅 에이전트",
    "description": "코파인드 엑셀 데이터를 자동 변환해 수신 당일 레이팅과 시각화 대시보드를 만드는 신용분석 에이전트",
    "departmentId": "dept-09",
    "department": "여신심사부",
    "sourcePage": 11
  },
  {
    "id": "BANK-056",
    "name": "위성영상 기반 담보 현장확인 자동분석 에이전트",
    "description": "주소·기준일 입력 시 위성영상 비교로 건축물 변동과 현장확인 필요성을 분석하는 담보 현장확인 에이전트",
    "departmentId": "dept-09",
    "department": "여신심사부",
    "sourcePage": 11
  },
  {
    "id": "BANK-057",
    "name": "담보 기후위험 분석·기상특보 알림 도구",
    "description": "담보 주소로 침수심·취약도·기대손실을 산출하고 기상특보 시 해당 담보를 재계산·알림하는 기후위험 도구",
    "departmentId": "dept-09",
    "department": "여신심사부",
    "sourcePage": 11
  },
  {
    "id": "BANK-058",
    "name": "고액 출금 보이스피싱 응대 지원 에이전트",
    "description": "고액 출금 시 고객 태블릿 안내와 AI 사기 위험 판정·대응 요령·경찰 연계를 제공하는 창구 지원 에이전트",
    "departmentId": "dept-10",
    "department": "자금세탁방지부",
    "sourcePage": 12
  },
  {
    "id": "BANK-059",
    "name": "금융사기 수법 매칭·고객 설명 지원 도구",
    "description": "고객 상황 입력 시 행내 사례·공문·뉴스에서 유사 사기 수법을 찾아 징후와 설명 멘트를 제시하는 도구",
    "departmentId": "dept-10",
    "department": "자금세탁방지부",
    "sourcePage": 12
  },
  {
    "id": "BANK-060",
    "name": "고액 입금 거래목적 확인 알림 서비스",
    "description": "고액 입금 시 수취인 앱에 팝업으로 거래 목적을 확인·기록해 환치기·보이스피싱 연루를 막는 알림 서비스",
    "departmentId": "dept-10",
    "department": "자금세탁방지부",
    "sourcePage": 12
  },
  {
    "id": "BANK-061",
    "name": "이상거래탐지시스템 내 현황보고서 작성 에이전트",
    "description": "이상금융거래탐지시스템의 탐지 내용으로 현황보고서를 자동 작성하는 보고서 작성 에이전트",
    "departmentId": "dept-10",
    "department": "자금세탁방지부",
    "sourcePage": 12
  },
  {
    "id": "BANK-062",
    "name": "STR 보고서 자동작성 에이전트",
    "description": "거래내역·고객정보 기반으로 STR 보고서 초안을 작성하고 요건 충족 여부를 점검하는 에이전트",
    "departmentId": "dept-10",
    "department": "자금세탁방지부",
    "sourcePage": 12
  },
  {
    "id": "BANK-063",
    "name": "창구 자산관리 상담 지원 어시스턴트",
    "description": "상품 지식·유불리 계산기·상담 시뮬레이터·시황을 한 화면에 모은 창구 자산관리 상담 보조 에이전트",
    "departmentId": "dept-11",
    "department": "WM사업부",
    "sourcePage": 13
  },
  {
    "id": "BANK-064",
    "name": "모의투자 기반 예수금 유치 서비스",
    "description": "가상 자금 모의투자에 AI 코칭을 제공하고 성과를 예금 쿠폰으로 보상하는 예수금 유치 서비스",
    "departmentId": "dept-11",
    "department": "WM사업부",
    "sourcePage": 13
  },
  {
    "id": "BANK-065",
    "name": "카드 뉴스 제작 에이전트",
    "description": "최신 경제 뉴스를 자동 수집해 카드뉴스를 제작하고 이메일로 발송하는 카드뉴스 제작 에이전트",
    "departmentId": "dept-11",
    "department": "WM사업부",
    "sourcePage": 13
  },
  {
    "id": "BANK-066",
    "name": "최신 경제 뉴스 요약 에이전트",
    "description": "경제 유튜브 영상 자막을 자동 수집·요약해 매일 보고 메일로 발송하는 경제 뉴스 요약 에이전트",
    "departmentId": "dept-11",
    "department": "WM사업부",
    "sourcePage": 13
  },
  {
    "id": "BANK-067",
    "name": "타행 우량기업 금리 분석·섭외 가이드 에이전트",
    "description": "CRETOP 데이터와 가신용평가 로직으로 타행 우량기업의 예상 금리·대환 수수료를 산출하는 섭외 가이드 에이전트",
    "departmentId": "dept-12",
    "department": "금융지원부",
    "sourcePage": 14
  },
  {
    "id": "BANK-068",
    "name": "사업자 고객 거래현황 통합조회·교차판매 지원 도구",
    "description": "사업자 고객 거래현황을 한 화면에 통합 조회하고 교차판매 우선순위를 산출하는 아웃바운드 영업 지원 도구",
    "departmentId": "dept-12",
    "department": "금융지원부",
    "sourcePage": 14
  },
  {
    "id": "BANK-069",
    "name": "소상공인 경영위기 진단·컨설팅 서비스",
    "description": "매출·비용 등 사업 데이터로 소상공인 경영위기를 조기 진단하고 개선안·정책자금을 제시하는 컨설팅 서비스",
    "departmentId": "dept-12",
    "department": "금융지원부",
    "sourcePage": 14
  },
  {
    "id": "BANK-070",
    "name": "외부 제도·공제 상담자료 통합 조회 서비스",
    "description": "노란우산공제 등 외부 제도의 자격·한도·서류·안내 문구를 한 화면에 모아 제시하는 상담 보조 도구",
    "departmentId": "dept-12",
    "department": "금융지원부",
    "sourcePage": 14
  },
  {
    "id": "BANK-071",
    "name": "청약 추천 및 자금계획 연계 AI 서비스",
    "description": "비대면 채널에 청약 자격·자산을 분석해 맞춤 청약을 푸시 추천하고 자금계획·대출 상품을 연계하는 AI 금융코치 서비스",
    "departmentId": "dept-13",
    "department": "디지털기획부",
    "sourcePage": 15
  },
  {
    "id": "BANK-072",
    "name": "음성 인증 기반 시니어 전용 뱅킹 서비스",
    "description": "음성 명령과 성문 인증만으로 조회·송금이 가능한 고령층 전용 대화형 뱅킹 서비스",
    "departmentId": "dept-13",
    "department": "디지털기획부",
    "sourcePage": 15
  },
  {
    "id": "BANK-073",
    "name": "개인 맞춤 영양·수분 건강관리 서비스",
    "description": "비대면 채널에 음식·물·영양제 섭취 기록을 영양소로 분석해 부족분을 채울 음식을 추천하는 건강관리 서비스",
    "departmentId": "dept-13",
    "department": "디지털기획부",
    "sourcePage": 15
  },
  {
    "id": "BANK-074",
    "name": "대화형 AI 행동데이터 기반 맞춤혜택 서비스",
    "description": "비대면 채널에 미래의 나 페르소나 AI와의 대화로 행동 스코어를 산출해 맞춤 혜택·대안신용평가에 활용하는 서비스",
    "departmentId": "dept-13",
    "department": "디지털기획부",
    "sourcePage": 15
  },
  {
    "id": "BANK-075",
    "name": "대기고객 자동화기기 이용 안내 서비스",
    "description": "대기 고객이 업무를 선택하면 ATM·공과금수납기 등 더 빠른 처리 방법을 알려주는 대기시간 안내 서비스",
    "departmentId": "dept-14",
    "department": "채널전략부",
    "sourcePage": 16
  },
  {
    "id": "BANK-076",
    "name": "내점 고객 수요 분석 기반 근무·영업 계획 도구",
    "description": "순번기·단말 데이터로 시간대별 내점량을 분석해 연차·아웃바운드 적기를 추천하는 근무·영업 계획 도구",
    "departmentId": "dept-14",
    "department": "채널전략부",
    "sourcePage": 16
  },
  {
    "id": "BANK-077",
    "name": "적정 점포 산정 에이전트",
    "description": "공공데이터를 매월 자동 수집·분석해 지역별 적정 점포수와 후보지를 도출하는 점포 산정 에이전트",
    "departmentId": "dept-14",
    "department": "채널전략부",
    "sourcePage": 16
  },
  {
    "id": "BANK-078",
    "name": "점외 자동화코너 비용 현황 자동집계 에이전트",
    "description": "AMS·DAMOA에서 점외 자동화코너 임차료·관리비·전기세를 월별 자동 집계하는 비용 집계 에이전트",
    "departmentId": "dept-14",
    "department": "채널전략부",
    "sourcePage": 16
  },
  {
    "id": "BANK-079",
    "name": "대화형 자연어 데이터 추출 AI 에이전트",
    "description": "자연어 조건 입력으로 SQL을 생성하고 IT 승인 후 엑셀을 내려받는 대화형 데이터 추출 에이전트",
    "departmentId": "dept-15",
    "department": "ICT개발부",
    "sourcePage": 17
  },
  {
    "id": "BANK-080",
    "name": "노코드 블록 조립형 데이터 추출 에이전트",
    "description": "블록 조립으로 쿼리를 만들고 IT 검증 쿼리를 전사 공유 허브로 자산화하는 노코드 데이터 추출 에이전트",
    "departmentId": "dept-15",
    "department": "ICT개발부",
    "sourcePage": 17
  },
  {
    "id": "BANK-081",
    "name": "여신종합관리 대시보드 내용 요약 에이전트",
    "description": "여신종합관리 통계 그래프 주석 작성(iM GPT)을 AX 플랫폼으로 이관·고도화한 대시보드 요약 에이전트",
    "departmentId": "dept-15",
    "department": "ICT개발부",
    "sourcePage": 17
  },
  {
    "id": "BANK-082",
    "name": "여신 연체·채무조정 통합 관리 에이전트",
    "description": "연체·기한이익상실·채무조정 제도를 한 화면에서 확인하고 처리 일정을 안내하는 여신 사후관리 통합 에이전트",
    "departmentId": "dept-16",
    "department": "여신관리부",
    "sourcePage": 18
  },
  {
    "id": "BANK-083",
    "name": "여신 거래처 공시·뉴스 주간 모니터링 에이전트",
    "description": "여신 거래처의 DART 공시·뉴스를 자동 수집·분류해 주간 보고서로 공유하는 거래처 모니터링 시스템",
    "departmentId": "dept-16",
    "department": "여신관리부",
    "sourcePage": 18
  },
  {
    "id": "BANK-084",
    "name": "비재무 지표 기반 부실 조기경보 대시보드",
    "description": "전기료·카드매출·세금 납부 등 12개 비재무 지표를 자동 수집해 부실 징후를 포착하는 조기경보 대시보드",
    "departmentId": "dept-16",
    "department": "여신관리부",
    "sourcePage": 18
  },
  {
    "id": "BANK-085",
    "name": "실시간 실적관리·보고서 자동생성 웹 서비스",
    "description": "부서별 실적을 웹 대시보드에 실시간 입력하고 보고서를 버튼 하나로 생성하는 성과관리 웹 서비스",
    "departmentId": "dept-17",
    "department": "전략기획부",
    "sourcePage": 19
  },
  {
    "id": "BANK-086",
    "name": "영업점 KPI 분석·전략 코칭 AI 에이전트",
    "description": "KPI 규정을 분석해 영업점별 효율적 득점 경로와 우회 전략을 매주 코칭하는 다중 AI 에이전트",
    "departmentId": "dept-17",
    "department": "전략기획부",
    "sourcePage": 19
  },
  {
    "id": "BANK-087",
    "name": "타행 금리·마케팅 동향 비교 분석 에이전트",
    "description": "금감원 공시와 타행 게시 자료를 AI로 분석해 타행 금리·마케팅·트렌드를 비교하는 동향 분석 에이전트",
    "departmentId": "dept-17",
    "department": "전략기획부",
    "sourcePage": 19
  },
  {
    "id": "BANK-088",
    "name": "금융규제 변경사항 자동 요약·알림 에이전트",
    "description": "공개 금융규제 자료를 수집해 변경사항·관련 업무를 쉬운 말로 요약하고 규제 캘린더를 만드는 알림 시스템",
    "departmentId": "dept-18",
    "department": "준법감시부",
    "sourcePage": 20
  },
  {
    "id": "BANK-089",
    "name": "상품규정·정책 에이전트",
    "description": "상품 규정·정책 공문을 RAG로 누적 관리하고 챗봇 질의와 변경 알림을 제공하는 상품규정·정책 에이전트",
    "departmentId": "dept-18",
    "department": "준법감시부",
    "sourcePage": 20
  },
  {
    "id": "BANK-090",
    "name": "규정 개정 영향 점검 에이전트",
    "description": "개정 전후 규정을 비교해 변경사항과 영향받는 내규·업무·상품을 제시하는 규정 영향 점검 에이전트",
    "departmentId": "dept-18",
    "department": "준법감시부",
    "sourcePage": 20
  },
  {
    "id": "BANK-091",
    "name": "카드 결제데이터 기반 맛집 추천 서비스",
    "description": "BC카드 결제·재방문 데이터를 분석해 광고 없는 맛집을 추천하는 iM뱅크 앱 부가 서비스",
    "departmentId": "dept-19",
    "department": "페이먼트사업부",
    "sourcePage": 21
  },
  {
    "id": "BANK-092",
    "name": "위치 기반 최적 카드혜택 추천 서비스",
    "description": "지도 앱과 연동해 현재 위치 매장에서 혜택이 가장 큰 보유 iM뱅크 카드를 추천하는 서비스",
    "departmentId": "dept-19",
    "department": "페이먼트사업부",
    "sourcePage": 21
  },
  {
    "id": "BANK-093",
    "name": "기업카드 회원정보 일괄 조회·조치 요약 도구",
    "description": "기업카드 회원의 유효기간·미사용 실적·사고코드·신용평가 기일을 일괄 조회·요약하는 사후관리 도구",
    "departmentId": "dept-19",
    "department": "페이먼트사업부",
    "sourcePage": 21
  },
  {
    "id": "BANK-094",
    "name": "공문 담당자 자동 매칭·기한 알림 도구",
    "description": "업무분장과 공문을 대조해 담당자에게 공문을 상단 고정하고 마감일을 캘린더에 등록하는 공문 관리 도구",
    "departmentId": "dept-20",
    "department": "ICT금융부",
    "sourcePage": 22
  },
  {
    "id": "BANK-095",
    "name": "품의문 절차 판별 에이전트",
    "description": "품의 상신 시 첨부파일로 사전감시·일상감사 대상과 협의 부서·절차를 자동 판별하는 품의 절차 에이전트",
    "departmentId": "dept-20",
    "department": "ICT금융부",
    "sourcePage": 22
  },
  {
    "id": "BANK-096",
    "name": "대고객 안내문구 생성 에이전트",
    "description": "대고객 푸시 메시지 생성(iM GPT AI총무)을 AX 플랫폼으로 이관·고도화한 안내문구 생성 에이전트",
    "departmentId": "dept-21",
    "department": "디지털개발부",
    "sourcePage": 23
  },
  {
    "id": "BANK-097",
    "name": "거래내역 분석 에이전트",
    "description": "iM GPT 통한 모임통장 거래내역 분석·요약(AI총무)을 AX 플랫폼으로 이관·고도화한 거래내역 분석 에이전트",
    "departmentId": "dept-21",
    "department": "디지털개발부",
    "sourcePage": 23
  },
  {
    "id": "BANK-098",
    "name": "신용원가 매뉴얼 기반 질의응답 에이전트",
    "description": "차주 신용원가 매뉴얼을 기반으로 채팅에서 즉시 답하는 신용원가 질의응답 에이전트",
    "departmentId": "dept-22",
    "department": "리스크관리부",
    "sourcePage": 24
  },
  {
    "id": "BANK-099",
    "name": "산업한도 관련 매뉴얼 에이전트",
    "description": "산업한도 데이터·매뉴얼을 기반으로 채팅에서 즉시 답하는 산업한도 질의응답 에이전트",
    "departmentId": "dept-22",
    "department": "리스크관리부",
    "sourcePage": 24
  },
  {
    "id": "BANK-100",
    "name": "신탁 외부보고서 자동작성 에이전트",
    "description": "신탁부 결산 데이터를 보고서 형식에 맞춰 주기별로 자동 작성·보고하는 신탁 외부보고서 에이전트",
    "departmentId": "dept-23",
    "department": "신탁사업부",
    "sourcePage": 25
  },
  {
    "id": "BANK-101",
    "name": "ETF 신탁 상품설명서 제작 에이전트",
    "description": "ETF 내용 변경을 매일 감지해 은행용 신탁 상품설명서를 작성하고 결재 상신하는 설명서 제작 에이전트",
    "departmentId": "dept-23",
    "department": "신탁사업부",
    "sourcePage": 25
  },
  {
    "id": "BANK-102",
    "name": "은행별 경영실적 자동 수집·비교 대시보드",
    "description": "타행 IR 자료와 금융통계를 자동 수집·파싱해 은행별 경영실적을 비교하는 대시보드",
    "departmentId": "dept-24",
    "department": "재무기획부",
    "sourcePage": 26
  },
  {
    "id": "BANK-103",
    "name": "정보의 서랍 에이전트",
    "description": "부서별 재무 데이터를 직접 등록·취합하고 부문별로 분석·관리하는 재무정보 취합 에이전트",
    "departmentId": "dept-24",
    "department": "재무기획부",
    "sourcePage": 26
  },
  {
    "id": "BANK-104",
    "name": "사내 업무앱(HTML) 검토·배포 관리 에이전트",
    "description": "현업이 만든 HTML 업무화면을 보안 검토·승인해 배포·관리하는 사내 업무앱 배포 에이전트",
    "departmentId": "dept-25",
    "department": "정보보호부",
    "sourcePage": 27
  },
  {
    "id": "BANK-105",
    "name": "보안 취약점 자동 매핑·조치 우선순위 에이전트",
    "description": "취약점 점검 결과를 자산별로 자동 매핑하고 AI가 조치 우선순위와 가이드를 제시하는 취약점 관리 시스템",
    "departmentId": "dept-25",
    "department": "정보보호부",
    "sourcePage": 27
  },
  {
    "id": "BANK-106",
    "name": "하이브리드 앱단말 규정 검색 에이전트",
    "description": "앱단말 규정 기반 대화(iM GPT)를 규정 RAG 공통기반으로 이관·고도화한 규정 검색 에이전트",
    "departmentId": "dept-26",
    "department": "차세대인프라부",
    "sourcePage": 28
  },
  {
    "id": "BANK-107",
    "name": "하이브리드 앱단말 번역 에이전트",
    "description": "하이브리드 앱단말에서 서비스 제공 언어를 번역하는 번역 에이전트",
    "departmentId": "dept-26",
    "department": "차세대인프라부",
    "sourcePage": 28
  },
  {
    "id": "BANK-108",
    "name": "사내 무료 나눔·기부 에이전트",
    "description": "물품 사진만 올리면 AI가 분류·설명을 자동 등록하는 사내 무료 나눔·기부 에이전트",
    "departmentId": "dept-27",
    "department": "사회공헌부",
    "sourcePage": 29
  },
  {
    "id": "BANK-109",
    "name": "임직원 식대 데이터 기반 맛집 추천·지역 상생 에이전트",
    "description": "임직원 식대 결제 데이터를 비식별 분석해 식당을 추천하고 단골 매장을 홍보하는 지역 상생 에이전트",
    "departmentId": "dept-28",
    "department": "총무부",
    "sourcePage": 30
  },
  {
    "id": "BANK-110",
    "name": "언론·SNS 실시간 평판 모니터링 에이전트",
    "description": "언론 기사·SNS 게시물을 실시간 수집·감성 분류하고 부정 이슈를 즉시 알리는 당행 평판 모니터링 시스템",
    "departmentId": "dept-29",
    "department": "홍보부",
    "sourcePage": 31
  }
];
