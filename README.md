# HanaLoop — PCF 전과정 탄소 배출 대시보드

탄소 배출량을 측정·관리·감축하는 SaaS 플랫폼 과제 구현물입니다.  

---

## 실행 방법

### Docker (권장 — 3단계)

```bash
git clone <이 저장소 URL>
cp .env.example .env.local
docker compose up --build
```

→ http://localhost:3000 (대시보드)  
→ http://localhost:3000/api-docs (Swagger UI)

PostgreSQL 초기화(시드 포함)와 Next.js 앱이 한 번에 실행됩니다.

### 로컬 개발 (5단계)

> Node.js 18 이상, PostgreSQL 16 필요

```bash
git clone <이 저장소 URL>          # 1. 클론
cp .env.example .env.local        # 2. 환경변수 설정
psql -f docker/init.sql           # 3. DB 초기화 (테이블 + 시드)
yarn install                      # 4. 패키지 설치 (npm install 도 동일)
yarn start                        # 5. 프로덕션 서버 실행
```

개발 서버로 실행하려면 5번을 `yarn dev`로 대체하세요.

---

## 배포 링크

**현재 미배포 상태입니다.** 기술적으로 불가능한 것이 아니라 아래 두 가지 환경 제약이 겹쳐서 배포를 진행하지 못했습니다.

- **AWS Free Tier 소진** — 평소 사이드 프로젝트 운용으로 프리 티어 크레딧을 이미 다 사용한 상태입니다.
- **자택 서버 사용 불가** — 집에 미니 PC가 있지만 현재 커뮤니티(Beatbox) 서비스 서버로 24시간 운영 중이라 포트와 리소스를 추가로 할당하기 어렵습니다.

Vercel 무료 플랜, Railway, Render 등 대안도 검토했으나 과제 제출 시점 기준으로 시간 내에 환경을 새로 세팅하는 것보다 로컬 실행 + 영상 캡처로 동작을 증명하는 방향을 선택했습니다. `npm run dev` 한 줄로 즉시 실행 가능하며, 외부 의존성이 전혀 없어 로컬에서 동일하게 재현됩니다.

---

## 화면 구성

### Overview (메인 대시보드 `/`)

| 영역 | 설명 |
|------|------|
| **KPI 카드 4개** | 총 배출량(tCO₂e) / 제품별 평균 PCF / 최대 배출 Scope / 최대 배출 LCA 단계 |
| **월별 배출량 추이 (Line Chart)** | Scope 1·2·3 별 월간 tCO₂e 변화. 감축 여부를 직관적으로 확인 |
| **Scope 비율 (Donut Chart)** | Scope 1·2·3 구성 비중. 중앙에 총 배출량 표시 |
| **전과정(LCA) 단계별 배출량 (Bar Chart)** | 원료 취득 → 제조 → 포장 → 운송 각 단계 배출량과 비중(%) |
| **배출 기록 테이블** | 전체 레코드를 10건씩 페이지네이션. 활동량·배출계수·산정값·데이터 출처 표시 |
| **탄소 메모** | 기업별 감축 활동·이슈 메모 작성·저장. 낙관적 업데이트(Optimistic UI) + 실패 시 자동 롤백 |

### Notes (`/notes`)

더미 페이지. 향후 메모 전체 목록·편집 화면으로 확장 예정입니다.

### 필터 바

기간(2025-01 ~ 2025-08) · 회사 · Scope를 조합 필터링하면 KPI·차트·테이블이 모두 실시간 갱신됩니다.

---

## 기술 스택

| 분류 | 선택 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| DB | PostgreSQL 16 (pg 드라이버 + Pool) |
| Container | Docker + docker-compose |

---

## 프로젝트 구조

```
hanaloop/
├── docker/
│   └── init.sql            # PostgreSQL 테이블 DDL + 시드 데이터
├── Dockerfile              # Next.js standalone 빌드 이미지
├── docker-compose.yml      # app(Next.js) + db(PostgreSQL) 구성
├── .env.example            # 환경 변수 템플릿
└── src/
    ├── app/
    │   ├── layout.tsx          # 전체 레이아웃 (NavBar + main)
    │   ├── page.tsx            # 메인 대시보드 (데이터 로드·집계·렌더링)
    │   ├── notes/page.tsx      # Notes 더미 페이지
    │   └── api/
    │       ├── companies/route.ts   # GET  /api/companies
    │       ├── records/route.ts     # GET  /api/records  POST /api/records
    │       ├── posts/route.ts       # GET  /api/posts    POST /api/posts
    │       └── import/route.ts      # POST /api/import (CSV/TSV 파일 업로드)
    ├── components/
    │   ├── charts/
    │   │   ├── EmissionTrendChart.tsx   # Scope별 월간 라인 차트
    │   │   ├── ScopeDonutChart.tsx      # Scope 비율 도넛 차트
    │   │   └── LifecycleBarChart.tsx    # LCA 단계별 수평 막대 차트
    │   ├── dashboard/
    │   │   ├── EmissionTable.tsx        # 배출 기록 테이블 (페이지네이션)
    │   │   ├── NotesPanel.tsx           # 탄소 메모 CRUD
    │   │   ├── ActivityInputForm.tsx    # 배출 데이터 직접 입력 폼 (유효성 검사)
    │   │   └── ImportPanel.tsx          # CSV/TSV 드래그·클릭 업로드 UI
    │   ├── framepiece/
    │   │   ├── NavBar.tsx               # 사이드바 내비게이션 (모바일 대응)
    │   │   └── Filter.tsx               # 기간·회사·Scope 필터 바
    │   └── ui/
    │       ├── KpiCard.tsx              # KPI 수치 카드
    │       ├── Badge.tsx                # Scope 배지 (색상 코딩)
    │       ├── Tooltip.tsx              # Portal 기반 호버 툴팁
    │       ├── Toast.tsx                # 저장 성공·실패 알림
    │       └── LoadingSkeleton.tsx      # 카드·차트·테이블 스켈레톤
    └── lib/
        ├── types.ts            # 전체 타입 정의
        ├── data.ts             # 배출계수 메타 (로컬 참조용)
        ├── db.ts               # PostgreSQL Pool (pg 드라이버)
        ├── api.ts              # HTTP fetch 클라이언트 함수
        └── calculations.ts     # 집계·필터·KPI 계산 순수 함수
```

---

## 도메인 지식 — GHG Protocol & LCA

### Scope 분류

| Scope | 의미 | 이 프로젝트에서 해당하는 배출원 |
|-------|------|-------------------------------|
| **Scope 1** | 직접 연소 | 천연가스(natural_gas), 디젤(diesel), 휘발유(gasoline), LPG |
| **Scope 2** | 구매 전력 | 전력(electricity) |
| **Scope 3** | 공급망 간접 | 석탄(coal), 화학원료(chemical_feedstock), 희토류(rare_earth), 포장재(packaging_material), 물류(logistics) |

### LCA 단계 (ISO 14067)

| 단계 | 코드 | 설명 |
|------|------|------|
| 원료 취득 | A1 | 석탄·화학원료·희토류 조달 |
| 제조 | A2-A3 | 공장 가동 (천연가스·LPG·전력) |
| 포장 | A4 | 포장재 사용 |
| 운송 | A5 | 디젤·휘발유·물류 |

### 배출계수 (IPCC AR6 / DEFRA 2023 근사값)

| 배출원 | 계수 | 단위 |
|--------|------|------|
| 천연가스 | 2.04 | kgCO₂e/m³ |
| 디젤 | 2.68 | kgCO₂e/L |
| 휘발유 | 2.31 | kgCO₂e/L |
| LPG | 1.51 | kgCO₂e/L |
| 전력 (한국 기준) | 0.46 | kgCO₂e/kWh |
| 석탄 | 2.42 | kgCO₂e/kg |
| 화학원료 | 1.80 | kgCO₂e/kg |
| 희토류 | 3.50 | kgCO₂e/kg |
| 포장재 | 0.94 | kgCO₂e/kg |
| 물류 | 0.15 | kgCO₂e/tonne·km |

산정식: `emissionsKgCo2e = activityAmount × emissionFactor`

---

## 시드 데이터 (CT-045 · 2025년 1–8월 · 29개 레코드)

과제에서 제공된 원본 데이터를 그대로 사용합니다.

| 회사 | 국가 | 제품 |
|------|------|------|
| CT-045 | 한국 | CT-045 제품 |

| 활동 유형 | 설명 | Scope | LCA 단계 | 배출계수 | 단위 |
|-----------|------|-------|----------|----------|------|
| 전기 | 한국전력 | 2 | manufacturing | 0.456 | kgCO₂e/kWh |
| 원소재 | 플라스틱 1 | 3 | raw_material | 2.3 | kgCO₂e/kg |
| 원소재 | 플라스틱 2 | 3 | raw_material | 3.2 | kgCO₂e/kg |
| 운송 | 트럭 | 3 | transport | 3.5 | kgCO₂e/ton·km |

---

## ERD / DB 스키마 *(Claude Code 작성)*

```
┌─────────────────────────────────┐
│ emission_factors                │
│─────────────────────────────────│
│ id            SERIAL  PK        │
│ source        TEXT    NOT NULL  │  예: electricity, plastic_1
│ scope         INT     NOT NULL  │  1 / 2 / 3
│ stage         TEXT    NOT NULL  │  raw_material / manufacturing / transport
│ factor        NUMERIC NOT NULL  │  kgCO₂e 단위 계수
│ unit          TEXT    NOT NULL  │  kgCO₂e/kWh 등
│ version       TEXT    NOT NULL  │  예: 2025-KR
│ valid_from    DATE               │
│ valid_to      DATE               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ companies                       │
│─────────────────────────────────│
│ id            TEXT    PK        │  예: ct045
│ name          TEXT    NOT NULL  │
│ country       TEXT    NOT NULL  │
└─────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ emission_records                                │
│─────────────────────────────────────────────────│
│ id                  TEXT(UUID) PK               │
│ company_id          TEXT     FK → companies.id  │
│ product_name        TEXT                        │
│ year_month          TEXT     NOT NULL           │  예: 2025-03
│ scope               INT      NOT NULL           │
│ stage               TEXT     NOT NULL           │
│ source              TEXT     NOT NULL           │  FK 참조 대신 비정규화
│ activity_amount     NUMERIC  NOT NULL           │
│ activity_unit       TEXT     NOT NULL           │
│ emission_factor     NUMERIC  NOT NULL           │
│ factor_unit         TEXT                        │
│ emissions_kg_co2e   NUMERIC  NOT NULL           │
│ data_source_type    TEXT     NOT NULL           │  primary / secondary
│ created_at          TIMESTAMPTZ  DEFAULT now()  │
└─────────────────────────────────────────────────┘

┌────────────────────────────────┐
│ posts                          │
│────────────────────────────────│
│ id            TEXT(UUID) PK    │
│ company_id    TEXT    NOT NULL  │
│ title         TEXT    NOT NULL  │
│ content       TEXT    NOT NULL  │
│ date_time     TEXT    NOT NULL  │
└────────────────────────────────┘
```

**설계 선택:** `emission_records.source`를 `emission_factors.source`에 외래 키로 연결하지 않기로 설정했습니다. 배출계수가 바뀔수 있기 때문입니다.

---

## 트레이드오프 (Trade-off)

### 1. 인메모리 Fake API → PostgreSQL 실제 DB

| 항목 | Fake API (이전) | PostgreSQL (현재) |
|------|-----------------|-------------------|
| 실행 조건 | `npm install` 만으로 즉시 실행 | Docker 또는 로컬 PostgreSQL 필요 |
| 신뢰도 | 15% 실패율·지연 시뮬레이션 | 실제 네트워크·트랜잭션 동작 |
| 영속성 | 프로세스 종료 시 초기화 | 볼륨에 영구 저장 |
| 채점 반영 | 인메모리 전용 | DB 연동 항목 충족 |

**선택 이유:** 과제 체크리스트에 DB 연동이 명시되어 있고, 실제 CRUD가 영속되어야 CSV 임포트·직접 입력 기능의 의미가 생긴다. 실행 복잡도는 `docker compose up` 한 줄로 흡수했다.

---

### 2. emission_records.source 비정규화

배출계수를 `emission_factors` 테이블에서 조인하지 않고 레코드에 함께 저장했습니다.

**장점:** 배출계수가 미래에 바뀌어도 과거 레코드의 산정값이 변하지 않아 감사 추적(audit trail)이 유지됩니다.  
**단점:** 배출계수 메타를 일괄 변경할 때 레코드를 재계산해야 합니다.  
**결론:** 탄소 회계에서 과거 데이터 불변성이 규정 준수(GHG Protocol)의 핵심 요건이므로 비정규화를 선택했습니다.

---

### 3. Recharts vs. D3 직접 사용

Recharts는 React 컴포넌트 형태로 선언적으로 차트를 구성할 수 있어 개발 속도가 빠릅니다. 대신 PieChart 내부 툴팁 좌표 계산 같은 저수준 제어가 필요한 경우 라이브러리 내부를 우회해야 했습니다(도넛 커스텀 툴팁). D3를 직접 쓰면 완전한 제어가 가능하지만 선언적 React 패러다임과 충돌하고 코드량이 3~4배 늘어납니다. 이 프로젝트 규모에서는 Recharts가 더 합리적인 선택이었습니다.

---

### 4. Next.js API Routes vs. 별도 Express 서버

별도 백엔드 서버를 두지 않고 Next.js API Routes(`route.ts`)로 DB 접근 로직을 통합했습니다.

**장점:** 단일 레포·단일 Docker 이미지(app)로 배포가 단순해지고, 프론트·백 타입을 공유할 수 있습니다.  
**단점:** API가 복잡해질수록 Next.js 서버와 혼재해 분리가 어렵습니다.  
**결론:** 과제 규모에서는 API Routes가 충분하며, 실제 서비스 확장 시 별도 서버로 분리하는 것이 바람직합니다.

---

## 유사 시스템과의 비교

| 항목 | HanaLoop (이 프로젝트) | Salesforce Net Zero Cloud | Greenly |
|------|----------------------|--------------------------|---------|
| **목적** | PCF 전과정 배출 대시보드 (과제) | 전사 탄소 경영 플랫폼 | SME 대상 탄소 발자국 측정 SaaS |
| **데이터 입력** | CSV/TSV 임포트 + 직접 입력 폼 | ERP·SCM 연동 커넥터 | 영수증·인보이스 AI 자동 파싱 |
| **Scope 지원** | Scope 1·2·3 | Scope 1·2·3 + 금융 배출량 | Scope 1·2·3 |
| **배출계수** | 고정값 (IPCC AR6 근사) | 국가·업종별 실시간 DB | 자체 검증 DB (업종·국가·공급업체) |
| **LCA 단계** | A1(원료)·A2-A3(제조)·A5(운송) | 전과정 (A1–C4) | 제품 카테고리별 자동 분류 |
| **리포팅** | 대시보드 KPI (tCO₂e) | GHG Protocol·TCFD·SEC 보고서 자동 생성 | GHG Protocol 기반 PDF 보고서 |
| **감사 추적** | 레코드 비정규화로 과거값 보존 | 변경 이력 버전 관리 | 데이터 출처 URL 연결 |
| **가격** | 오픈소스 (과제용) | 엔터프라이즈 라이선스 | 월 구독 (SME 플랜) |

**HanaLoop의 차별점:** 과제 스펙에 충실하게 GHG Protocol Scope 분류·LCA 단계·PCF 산정식을 직접 구현하고, 데이터 입력 방식을 다양화(CSV 임포트·직접 입력)했습니다. 상용 솔루션 대비 배출계수 자동 갱신·ERP 연동·보고서 자동화 기능이 없지만, 핵심 측정·시각화 파이프라인을 처음부터 직접 구현했다는 점에서 학습 가치가 있습니다.

---

## 핵심 설계 결정

### 1. PostgreSQL 기반 API 레이어 (`src/lib/api.ts` + `src/app/api/`)

클라이언트는 `src/lib/api.ts`의 HTTP fetch 함수를 호출하고, Next.js API Routes(`/api/companies`, `/api/records`, `/api/posts`, `/api/import`)가 PostgreSQL Pool로 쿼리합니다. `fetchEmissionRecords`, `fetchCompanies`, `fetchPosts`를 `Promise.all`로 병렬 호출해 초기 로드를 최소화합니다.

### 2. 낙관적 UI (NotesPanel) -> AI 추천

메모 저장 시 서버 응답을 기다리지 않고 UI를 즉시 업데이트합니다. API 실패 시 이전 상태로 자동 롤백하고 Toast로 에러를 알립니다.

### 3. useMemo 최적화

필터 변경 시 `filterRecords → buildKpis → aggregateByMonth → aggregateByScope → aggregateByStage` 다섯 단계 집계를 `useMemo`로 캐싱해 불필요한 재계산을 방지합니다.

### 4. Portal 툴팁

`Tooltip` 컴포넌트는 `ReactDOM.createPortal`로 `document.body`에 직접 렌더링합니다. `overflow: hidden` 부모 컨테이너에서도 잘림 없이 표시되며, 버튼 위치를 `getBoundingClientRect`로 계산해 정밀하게 배치합니다.

### 5. 스켈레톤 로딩

카드·차트·테이블 각각 맞춤 스켈레톤(`LoadingSkeleton`)을 제공해 데이터 로드 중에도 레이아웃 shift 없이 안정적인 UX를 유지합니다.

---

## UI 스타일 원칙

- **배경**: `slate-950` (거의 검정에 가까운 짙은 네이비)
- **카드**: `bg-slate-900 ring-1 ring-slate-800` — border와 ring으로 구분감
- **포인트 컬러**: `emerald` 계열 단일 사용 (버튼·활성 탭·Scope 3 색상)
- **차트 색상**: Scope 1 `#f87171` (red) · Scope 2 `#60a5fa` (blue) · Scope 3 `#34d399` (emerald)
- **LCA 단계 색상**: 인디고-보라 계열 그라데이션 (`#6366f1` → `#c4b5fd`)
- **테이블**: `divide-y divide-slate-800/60` + `hover:bg-slate-800/40 transition-colors`

---

## 개발 전제 조건

이 프로젝트는 **별도 테스트 프로젝트에서 먼저 시작**했습니다.

1. 색감·레이아웃·컴포넌트 동작을 테스트 프로젝트에서 검증해 UI 설계(뼈대)를 확정
2. 툴팁·스켈레톤·Badge 등 공통 UI 컴포넌트의 로직과 스타일을 테스트 프로젝트에서 완성
3. 검증된 설계를 그대로 이 프로젝트에 적용 — 개발 순서(타입 → 계산 → 데이터 → 레이아웃 → 차트 → 툴팁)도 사전에 결정

### 도넛 차트 툴팁 커스터마이징

Recharts 기본 `<Tooltip>`을 `ScopeDonutChart`에 적용했을 때 위치가 자주 깨지는 문제가 발생했습니다. Recharts의 `PieChart` 내부에서 마우스 이벤트 좌표를 정확히 추적하지 못하는 것이 원인이었고, 테스트 프로젝트에서 완성한 Portal 기반 `Tooltip` 컴포넌트의 위치 계산 로직(`getBoundingClientRect`)을 응용해 커스텀 툴팁으로 해결했습니다.

---

## AI 사용 내역

### 1. 도메인 조사 — ChatGPT

**프롬프트:** "GHG Protocol Scope 1/2/3, LCA, PCF, ISO 14067, 배출계수 정리해줘"

**결정 이유:** 탄소 회계는 처음 접하는 도메인이었고, GHG Protocol·LCA·ISO 14067 모두 공식 문서가 수백 페이지 분량이다. 구글 서칭으로 접근하면 정보가 너무 산발적으로 흩어져 있어서 핵심 개념을 잡는 데만 시간을 다 쓸 위험이 있었다. AI를 써서 Scope 1/2/3 분류 체계, LCA 4단계, PCF 산정식 등 뼈대 개념을 빠르게 압축해 파악한 뒤, 배출계수 수치는 IPCC AR6·DEFRA 원본 기준으로 직접 검증하고 수정했다. 도메인을 빠르게 익히고 실제 구현에 더 많은 시간을 쓰기 위한 선택이었다.

---

### 2. 시드 데이터 & Fake API — ChatGPT

**프롬프트:** 업종별 배출원·EF·활동량 단위·산정식 조건을 직접 설계해서 지시 후 72개 레코드 생성 요청

**결정 이유:** 4개 업종 × 6개월 × 3~4개 배출원이면 레코드가 70개를 넘는다. 이걸 손으로 채우면 `activityAmount × emissionFactor = emissionsKgCo2e` 계산 실수가 반드시 나고, 단위 불일치도 생긴다. 어떤 배출원을 쓸지, 어떤 EF를 적용할지, primary/secondary 구분을 어떻게 할지는 내가 직접 설계해서 조건으로 넘기고, 반복 계산 작업만 AI에게 맡겼다. 생성 후 lpg 배출계수 불일치(메타 1.51 vs 레코드 1.61)를 직접 발견해 수동 정합했다.

---

### 3. UI 스타일 (CSS) — Claude Code

**프롬프트:** "카드 간격이랑 padding 좀 여유있게 하고, hover할 때 살짝 떠오르는 느낌으로 shadow 변화 줘. 숫자 값은 크고 bold하게, 제목은 작고 흐리게. 배경은 거의 검정에 가까운 짙은 네이비 계열로. 포인트 컬러는 초록 계열 하나만 써줘."

**결정 이유:** 더 좋은 색감·더 자연스러운 hover 액션·완성도 높은 UI를 참고하고 빠르게 적용하기 위해 사용했다. 어떤 색감과 어떤 인터랙션을 원하는지는 내가 결정해서 지시했고, AI는 Tailwind 클래스 조합을 제안하는 역할이었다. 제안된 클래스는 직접 브라우저에서 확인하고 불필요하거나 맞지 않는 부분은 제거했다.

---

### 4. 타입 설계 — Claude Code

**프롬프트:** 과제 스펙 + 도메인 학습 결과를 토대로 타입 확장 구조 지시

**결정 이유:** 타입 구조는 내가 도메인을 이해한 뒤 직접 설계했다. `EmissionRecord`에 scope·stage·dataSourceType을 넣을지, `KpiSummary`를 별도 타입으로 분리할지, 과제 원본 타입(`Company`·`Post`)을 건드리지 않고 확장만 할지 — 이 판단은 전부 내가 했다. AI는 설계한 구조를 TypeScript 코드로 옮기는 역할이었고, 생성된 코드는 직접 검토하고 검증했다.

---

### 5. 툴팁 Portal 로직 — 테스트 프로젝트 → Claude Code 응용

**프롬프트:** `createPortal` + `getBoundingClientRect` 기반 위치 계산 방식 요청

**결정 이유:** 테스트 프로젝트에서 먼저 Portal 기반 툴팁을 완성하고 검증했다. 본 프로젝트에 이식할 때 Claude로 속도를 높였고, Recharts `PieChart` 내부에서 기본 Tooltip 위치가 깨지는 문제는 같은 원리로 커스텀 툴팁을 만들어 해결했다. 어떤 방식으로 접근할지는 내가 판단했고 Claude는 구현을 도왔다.

---

### 6. 낙관적 UI — Claude Code

**프롬프트:** "저장 실패 시 이전 상태로 자동 롤백하는 패턴 구현해줘"

**결정 이유:** 메모 저장에 15% 실패율이 있는 Fake API 특성상, 저장 버튼을 누를 때마다 응답을 기다리면 UX가 나빠진다. 낙관적 업데이트를 쓰기로 결정한 건 내가 했고, `prevForm.current` ref로 이전 상태를 보관했다가 실패 시 롤백하는 구체적인 구현 패턴은 Claude가 제안한 것을 이해한 뒤 채택했다.

---

### 7. README 작성 — Claude Code

**프롬프트:**

```
지금 니가 스스로 이 프로젝트를 시작해서 ui를 분석해 그리고 리드미를 나한테 만들어서 줘

[커밋 히스토리 / GHG Protocol·LCA 도메인 정리 / 데이터 설계 프롬프트 /
 스타일 요청 내용 / 채점 기준 전체 붙여넣기]

이걸 토대로 리드미 적어줘봐
```

**결정 이유:** 내가 직접 작업한 내용을 빠르게 한눈에 보기 좋은 형태로 정리하기 위해 사용했다. 어떤 섹션을 넣을지, 대제목·소제목 구조는 내가 직접 설계해서 지시했고, Claude가 각 섹션 내용을 채웠다. 도메인 수치·AI 사용 내역·개발 전제 조건 등 사실 관계는 내가 직접 검토하고 틀린 부분은 수정 지시했다.

이후 "개발 전제 조건(테스트 프로젝트 선행)", "도넛 툴팁 커스터마이징", "README 작성도 AI 도움" 항목은 내가 추가 지시해 보완했다.

---

### 8. DB 환경 설정 (.env.example · init.sql) — Claude Code

**프롬프트:** "PostgreSQL 연결을 위한 .env.example 파일 만들어줘. init.sql은 emission_factors, companies, emission_records, posts 테이블 DDL이랑 CT-045 시드 데이터까지 포함해줘."

**결정 이유:** DB 연동 자체(pg Pool 설정, API route 작성, 쿼리 로직)는 직접 구현했다. `.env.example`의 변수 이름 규칙과 `init.sql`의 DDL·시드 INSERT 문은 반복적이고 오타가 나기 쉬운 작업이라 AI에게 맡겼다. 테이블 구조(비정규화 여부, UUID PK 선택, CHECK constraint 범위)는 내가 직접 설계해서 지시했고, 생성된 SQL은 실제 실행해 검증했다.

---

### 9. Docker healthcheck 설정 — Claude Code

**프롬프트:** "PostgreSQL 컨테이너가 완전히 준비된 후에 Next.js 앱이 뜨도록 healthcheck 기반 depends_on 조건 넣어줘."

**결정 이유:** Dockerfile과 docker-compose.yml 전체 구조는 내가 직접 작성했다. `pg_isready` 커맨드를 healthcheck에 사용하는 방법과 `depends_on: condition: service_healthy` 문법은 써본 적이 없어서 해당 부분만 Claude에게 물어보고 적용했다. interval·timeout·retries 값은 Claude 제안을 이해한 뒤 그대로 채택했다.

---

### 10. OpenAPI / Swagger UI — Claude Code

**프롬프트:** "next-swagger-doc 또는 swagger-ui-react로 `/api-docs` 페이지 만들어줘. OpenAPI 3.0 스펙은 `/api/openapi` route에서 JSON으로 반환하고, Swagger UI는 클라이언트 컴포넌트로 분리해줘."

**결정 이유:** API 명세를 텍스트로만 README에 적는 것보다 실제 동작하는 UI가 있어야 보너스 항목을 완전히 충족한다고 판단했다. `swagger-ui-react`가 SSR에서 동작하지 않아 `"use client"` 분리가 필요한 구조적 이유를 Claude가 설명해줬고, 각 엔드포인트의 request/response 스키마와 예시값은 내가 직접 검토해서 실제 API 동작과 일치하는지 확인했다.

---

## 작업 소요 시간

**총 작업 시간: 약 4시간 (15:54 ~ 20:00) + 다음날 DB·Docker·기능 보완**

### 5월 14일 — UI 구현

| 시각 | 커밋 | 소요 |
|------|------|------|
| 15:54 | 프로젝트 초기화 (create-next-app) | — |
| 17:26 | 타입 생성 + 과제 API + 시드 데이터 | 약 90분 |
| 17:36 | 계산식 추가 | 약 10분 |
| 17:41 | 폴더 구조 정리 | 약 5분 |
| 18:14 | 레이아웃 프레임 (KPI·차트·테이블 위치 잡기) | 약 33분 |
| 18:32 | 아이콘 + 네비게이션·필터 바 고도화 | 약 18분 |
| 19:06 | 차트 3종 + 스켈레톤 구현 | 약 34분 |
| 19:14 | 레이아웃 완성 (테이블·NotesPanel·Toast) | 약 8분 |
| 19:24 | 툴팁 전 컴포넌트 적용 | 약 10분 |
| 20:00 | 도넛 차트 커스텀 툴팁 마무리 — 최종 마무리 커밋 | 약 36분 |

### 5월 15일 — DB·Docker·기능 보완

| 커밋 | 소요 |
|------|------|
| 데이터베이스 연동 (PostgreSQL + API Routes 전환, 과제 원본 데이터 적용) | 약 30분 |
| 필터·테이블 수정 + Swagger UI 추가 | — |
| 엑셀 드래그 앤 드롭 임포트 추가 | — |

---

### 시간이 많이 소요된 구간

**1. 도메인 학습 + 시드 데이터 설계 (약 90분)**

가장 긴 구간. GHG Protocol·LCA·ISO 14067 개념을 처음부터 익히고, 배출원·배출계수·활동량을 현실적으로 설계하는 데 시간이 걸렸다. AI로 레코드를 생성한 뒤 배출계수 불일치를 직접 찾아 수동 정합하는 과정도 포함된다.

**2. 도넛 차트 커스텀 툴팁 (약 36분)**

Recharts 기본 Tooltip이 PieChart 안에서 위치가 계속 깨지는 문제를 해결하는 데 예상보다 오래 걸렸다. 라이브러리 내부 동작을 파악하고, 테스트 프로젝트의 Portal 위치 계산 로직을 PieChart 이벤트 좌표에 맞게 응용하는 과정이었다.

**3. 차트 3종 구현 (약 34분)**

라인·도넛·수평 막대 차트를 Recharts로 구현하면서 다크 테마에 맞는 그리드·축·범례 스타일을 직접 조정했다. 각 차트마다 커스텀 Tooltip 레이아웃도 별도로 작성했다.

**4. 데이터베이스 설계 및 연동 (약 30분)**

인메모리 Fake API에서 PostgreSQL 실제 DB로 전환하면서 테이블 구조(비정규화 여부, UUID PK, CHECK constraint) 설계와 API Routes 쿼리 로직을 직접 작성했다. `docker/init.sql` 시드 데이터와 `.env` 설정은 AI 보조로 작성하고 실제 실행해 검증했다.

---

## 커밋 히스토리 요약

### 5월 14일

| 시각 | 커밋 내용 |
|------|-----------|
| 17:26 | 타입 생성 + 과제 API + 시드 데이터 (AI 활용) |
| 17:36 | 계산식 추가 — 집계·KPI·포맷 순수 함수 |
| 17:41 | 폴더 구조 정리 |
| 18:14 | KPI 카드·대시보드·그래프·LCA 막대 레이아웃 프레임 |
| 18:32 | Lucide React 아이콘 추가 + 네비게이션·필터 바 고도화 |
| 19:06 | Recharts 차트 3종 + 스켈레톤 구현 |
| 19:14 | 레이아웃 완성 (테이블·NotesPanel·Toast) |
| 19:24 | 툴팁 전 컴포넌트 적용 — KPI만 고려해 변수를 미리 추가했으나, 결국 전 컴포넌트에 적용 완료 |
| 20:00 | 도넛 차트 커스텀 툴팁 마무리 — 최종 마무리 커밋 |

### 5월 15일

| 커밋 내용 |
|-----------|
| 데이터베이스 조회 방식으로 수정 및 제공 테스트 데이터를 사용하도록 수정 |
| 필터와 테이블 수정 및 Swagger 추가 |
| 엑셀 드래그 앤 드롭 추가 |
