# HanaLoop — PCF 전과정 탄소 배출 대시보드

탄소 배출량을 측정·관리·감축하는 SaaS 플랫폼 과제 구현물입니다.  

---

## 실행 방법

```bash
npm install
npm run dev
# http://localhost:3000
```

Node.js 18 이상 필요. 외부 DB나 API Key 없이 바로 실행됩니다.

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

기간(2024-01 ~ 2024-06) · 회사 · Scope를 조합 필터링하면 KPI·차트·테이블이 모두 실시간 갱신됩니다.

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
| DB | 없음 (인메모리 Fake API) |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 전체 레이아웃 (NavBar + main)
│   ├── page.tsx            # 메인 대시보드 (데이터 로드·집계·렌더링)
│   └── notes/page.tsx      # Notes 더미 페이지
├── components/
│   ├── charts/
│   │   ├── EmissionTrendChart.tsx   # Scope별 월간 라인 차트
│   │   ├── ScopeDonutChart.tsx      # Scope 비율 도넛 차트
│   │   └── LifecycleBarChart.tsx    # LCA 단계별 수평 막대 차트
│   ├── dashboard/
│   │   ├── EmissionTable.tsx        # 배출 기록 테이블 (페이지네이션)
│   │   └── NotesPanel.tsx           # 탄소 메모 CRUD
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
    ├── data.ts             # 시드 데이터 + 배출계수 메타
    ├── api.ts              # Fake API (지연 200~800ms + 15% 실패율)
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

## 시드 데이터 (4개 기업 · 6개월 · 72개 레코드)

| 기업 | 국가 | 대표 제품 | 주요 배출원 |
|------|------|-----------|-------------|
| Atlas Steel Corp | 미국 | Steel Beam | Scope 1 천연가스, Scope 3 석탄 |
| Rhine Chemicals GmbH | 독일 | Ethylene | Scope 1 LPG, Scope 3 화학원료 |
| 한강 로지스틱스 | 한국 | Freight Service | Scope 1 디젤·휘발유, Scope 3 포장재 |
| Sakura Electronics | 일본 | Circuit Board | Scope 2 전력, Scope 3 희토류·물류 |

---

## 핵심 설계 결정

### 1. Fake API 레이어 (`src/lib/api.ts`)

실제 네트워크를 흉내내기 위해 200~800ms 무작위 지연과 15% 확률 실패를 적용했습니다. `fetchEmissionRecords`, `fetchCompanies`, `fetchPosts`를 `Promise.all`로 병렬 호출해 초기 로드를 최소화합니다.

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

## 작업 소요 시간

**총 작업 시간: 약 4시간 (15:54 ~ 20:00)**

| 시간 | 커밋 | 소요 |
|------|------|------|
| 15:54 | 프로젝트 초기화 (create-next-app) | — |
| 17:26 | 타입 생성 + 과제 API + 시드 데이터 | 약 90분 |
| 17:36 | 계산식 추가 | 약 10분 |
| 17:41 | 폴더 구조 정리 | 약 5분 |
| 18:14 | 레이아웃 프레임 (KPI·차트·테이블 위치 잡기) | 약 33분 |
| 18:32 | 아이콘 + 네비게이션·필터 바 고도화 | 약 18분 |
| 19:06 | 차트 3종 + 스켈레톤 구현 | 약 34분 |
| 19:14 | 레이아웃 완성 (테이블·NotesPanel·Toast) | 약 8분 |
| 19:24 | 툴팁 전 컴포넌트 적용 — KPI만 고려해 변수 미리 추가했으나 결국 전부 적용 | 약 10분 |
| 20:00 | 도넛 차트 커스텀 툴팁 마무리 — 최종 마무리 커밋 | 약 36분 |

---

### 시간이 많이 소요된 구간

**1. 도메인 학습 + 시드 데이터 설계 (약 90분)**

가장 긴 구간. GHG Protocol·LCA·ISO 14067 개념을 처음부터 익히고, 4개 업종에 맞는 배출원·배출계수·활동량을 현실적으로 설계하는 데 시간이 걸렸다. AI로 72개 레코드를 생성한 뒤 배출계수 불일치를 직접 찾아 수동 정합하는 과정도 포함된다.

**2. 도넛 차트 커스텀 툴팁 (약 36분)**

Recharts 기본 Tooltip이 PieChart 안에서 위치가 계속 깨지는 문제를 해결하는 데 예상보다 오래 걸렸다. 라이브러리 내부 동작을 파악하고, 테스트 프로젝트의 Portal 위치 계산 로직을 PieChart 이벤트 좌표에 맞게 응용하는 과정이었다.

**3. 차트 3종 구현 (약 34분)**

라인·도넛·수평 막대 차트를 Recharts로 구현하면서 다크 테마에 맞는 그리드·축·범례 스타일을 직접 조정했다. 각 차트마다 커스텀 Tooltip 레이아웃도 별도로 작성했다.

---

## 커밋 히스토리 요약

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
