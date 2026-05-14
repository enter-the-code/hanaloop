// 과제 원본 타입
export type Country = { // 지역 추가(과제 추가 정보)
  code: string;
  name: string;
  region: string;
};

export type Company = { // 기존
  id: string;
  name: string;
  country: string; // 지역 추가
  emissions: GhgEmission[];
};

export type GhgEmission = { // 기존
  yearMonth: string;
  source: string;
  emissions: number;
};

export type Post = { // 기존
  id: string;
  companyId: string;
  title: string;
  content: string;
  dateTime: string;
};

// 도메인 확장 타입
export type ScopeType = 1 | 2 | 3; // 스코프 추가

export type LifecycleStage = // 전과정 평가 단계 추가
  | "raw_material"
  | "manufacturing"
  | "packaging"
  | "transport";

export type DataSourceType = "primary" | "secondary";

export type EmissionRecord = { // 과제 확장 정보 1개의 상품에서 나오는 종합 정보 레코드
  id: string;
  companyId: string;
  productName: string;
  yearMonth: string;
  scope: ScopeType;
  stage: LifecycleStage;
  source: string;
  activityAmount: number;
  activityUnit: string;
  emissionFactor: number;
  factorUnit: string;
  emissionsKgCo2e: number;
  dataSourceType: DataSourceType;
};

// KPI/집계용 타입
export type ScopeBreakdown = { // 스코프별 배출량 총합
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
};

export type StageBreakdown = { // 단계별 배출량 퍼센트
  stage: LifecycleStage;
  label: string;
  co2e: number;
  percentage: number;
};

export type MonthlyTotal = { // 월별 총 배출량
  yearMonth: string;
  total: number;
  byScope: ScopeBreakdown;
};

export type KpiSummary = { // KPI 요약 정보
  totalEmissions: number;
  pcfPerProduct: number;
  topScope: ScopeType;
  topStage: LifecycleStage;
};

export type FilterState = { // 필터 상태
  period: string | null; // "2024-01" 형식
  companyId: string | null;
  scope: ScopeType | null;
};
