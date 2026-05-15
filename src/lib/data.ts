import type { Country, Company, EmissionRecord, Post, ScopeType,LifecycleStage } from "./types";

export const SCOPE_LABEL: Record<number, string> = { 1: "Scope 1", 2: "Scope 2", 3: "Scope 3" };
export const STAGE_SHORT: Record<string, string> = {
  raw_material: "원료 취득", manufacturing: "제조", packaging: "포장", transport: "운송",
};

export const LIFECYCLE_STAGE_LABEL: Record<LifecycleStage, string> = {
  raw_material:  "원료 취득 (A1)",
  manufacturing: "제조 (A2-A3)",
  packaging:     "포장 (A4)",
  transport:     "운송 (A5)",
};


// 과제 제공 배출계수 (CT-045 기준)
export const EMISSION_FACTOR_META: Record<
  string,
  {
    scope: ScopeType;
    stage: LifecycleStage;
    factor: number;
    unit: string;
    label: string;
  }
> = {
  electricity:  { scope: 2, stage: "manufacturing", factor: 0.456, unit: "kgCO2e/kWh",    label: "전기 (한국전력)" },
  plastic_1:    { scope: 3, stage: "raw_material",  factor: 2.3,   unit: "kgCO2e/kg",     label: "원소재 (플라스틱 1)" },
  plastic_2:    { scope: 3, stage: "raw_material",  factor: 3.2,   unit: "kgCO2e/kg",     label: "원소재 (플라스틱 2)" },
  truck:        { scope: 3, stage: "transport",     factor: 3.5,   unit: "kgCO2e/ton-km", label: "운송 (트럭)" },
};


export const countries: Country[] = [
  { code: "KR", name: "South Korea", region: "Asia" },
];

export const companies: Company[] = [
  {
    id: "ct045",
    name: "CT-045",
    country: "KR",
    emissions: [
      { yearMonth: "2025-01", source: "electricity", emissions: 110 * 0.456 },
      { yearMonth: "2025-02", source: "electricity", emissions: 112 * 0.456 },
      { yearMonth: "2025-03", source: "electricity", emissions: 115 * 0.456 },
      { yearMonth: "2025-04", source: "electricity", emissions: 130 * 0.456 },
      { yearMonth: "2025-05", source: "electricity", emissions: 120 * 0.456 },
      { yearMonth: "2025-06", source: "electricity", emissions: 110 * 0.456 },
      { yearMonth: "2025-07", source: "electricity", emissions: 120 * 0.456 },
      { yearMonth: "2025-08", source: "electricity", emissions: 111 * 0.456 },
    ],
  },
];

// ─── CT-045 — 과제 원본 데이터 그대로 입력 ───────────────────────────────────
// 전기: Scope 2, EF 0.456 kgCO2e/kWh (한국전력)
// 플라스틱1: Scope 3, EF 2.3 kgCO2e/kg
// 플라스틱2: Scope 3, EF 3.2 kgCO2e/kg
// 트럭: Scope 3, EF 3.5 kgCO2e/ton-km
export const emissionRecords: EmissionRecord[] = [
  // ── 전기 (한국전력) ──────────────────────────────────────────────────────────
  { id: "r-e-01", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-01", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 110, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  50.16, dataSourceType: "primary" },
  { id: "r-e-02", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-02", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 112, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  51.07, dataSourceType: "primary" },
  { id: "r-e-03", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-03", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 115, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  52.44, dataSourceType: "primary" },
  { id: "r-e-04", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-04", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 130, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  59.28, dataSourceType: "primary" },
  { id: "r-e-05a", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 120, activityUnit: "kWh",   emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  54.72, dataSourceType: "primary" },
  { id: "r-e-05b", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 101, activityUnit: "kWh",   emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  46.06, dataSourceType: "primary" },
  { id: "r-e-06", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-06", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 110, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  50.16, dataSourceType: "primary" },
  { id: "r-e-07", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-07", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 120, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  54.72, dataSourceType: "primary" },
  { id: "r-e-08", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-08", scope: 2, stage: "manufacturing", source: "electricity", activityAmount: 111, activityUnit: "kWh",    emissionFactor: 0.456, factorUnit: "kgCO2e/kWh",    emissionsKgCo2e:  50.62, dataSourceType: "primary" },

  // ── 원소재 (플라스틱 1, EF 2.3) ─────────────────────────────────────────────
  { id: "r-p1-01",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-01", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 230, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  529.0, dataSourceType: "secondary" },
  { id: "r-p1-02",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-02", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 340, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  782.0, dataSourceType: "secondary" },
  { id: "r-p1-03",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-03", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 430, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  989.0, dataSourceType: "secondary" },
  { id: "r-p1-04",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-04", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 510, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e: 1173.0, dataSourceType: "secondary" },
  { id: "r-p1-05a", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 424, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  975.2, dataSourceType: "secondary" },
  { id: "r-p1-05b", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 232, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  533.6, dataSourceType: "secondary" },
  { id: "r-p1-06",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-06", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 450, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e: 1035.0, dataSourceType: "secondary" },
  { id: "r-p1-07",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-07", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 340, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  782.0, dataSourceType: "secondary" },
  { id: "r-p1-08",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-08", scope: 3, stage: "raw_material", source: "plastic_1", activityAmount: 230, activityUnit: "kg", emissionFactor: 2.3, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  529.0, dataSourceType: "secondary" },

  // ── 원소재 (플라스틱 2, EF 3.2) ─────────────────────────────────────────────
  { id: "r-p2-03",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-03", scope: 3, stage: "raw_material", source: "plastic_2", activityAmount:  23, activityUnit: "kg", emissionFactor: 3.2, factorUnit: "kgCO2e/kg", emissionsKgCo2e:   73.6, dataSourceType: "secondary" },
  { id: "r-p2-05",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 3, stage: "raw_material", source: "plastic_2", activityAmount:  40, activityUnit: "kg", emissionFactor: 3.2, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  128.0, dataSourceType: "secondary" },
  { id: "r-p2-07",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-07", scope: 3, stage: "raw_material", source: "plastic_2", activityAmount:  43, activityUnit: "kg", emissionFactor: 3.2, factorUnit: "kgCO2e/kg", emissionsKgCo2e:  137.6, dataSourceType: "secondary" },

  // ── 운송 (트럭, EF 3.5) ──────────────────────────────────────────────────────
  { id: "r-t-01",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-01", scope: 3, stage: "transport", source: "truck", activityAmount:  41, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  143.5, dataSourceType: "secondary" },
  { id: "r-t-02",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-02", scope: 3, stage: "transport", source: "truck", activityAmount: 211, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  738.5, dataSourceType: "secondary" },
  { id: "r-t-03",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-03", scope: 3, stage: "transport", source: "truck", activityAmount: 123, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  430.5, dataSourceType: "secondary" },
  { id: "r-t-04",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-04", scope: 3, stage: "transport", source: "truck", activityAmount:  42, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  147.0, dataSourceType: "secondary" },
  { id: "r-t-05a", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 3, stage: "transport", source: "truck", activityAmount: 123, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  430.5, dataSourceType: "secondary" },
  { id: "r-t-05b", companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-05", scope: 3, stage: "transport", source: "truck", activityAmount:  12, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:   42.0, dataSourceType: "secondary" },
  { id: "r-t-06",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-06", scope: 3, stage: "transport", source: "truck", activityAmount: 123, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  430.5, dataSourceType: "secondary" },
  { id: "r-t-07",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-07", scope: 3, stage: "transport", source: "truck", activityAmount:  41, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  143.5, dataSourceType: "secondary" },
  { id: "r-t-08",  companyId: "ct045", productName: "CT-045 제품", yearMonth: "2025-08", scope: 3, stage: "transport", source: "truck", activityAmount: 123, activityUnit: "ton-km", emissionFactor: 3.5, factorUnit: "kgCO2e/ton-km", emissionsKgCo2e:  430.5, dataSourceType: "secondary" },
];

export const posts: Post[] = [
  {
    id: "p1",
    companyId: "ct045",
    title: "4월 전력 사용량 급증",
    content: "4월 전력 소비가 130kWh로 전월 대비 13% 증가했습니다. Scope 2 배출량 상승 원인 파악 및 절전 조치가 필요합니다.",
    dateTime: "2025-05-02T09:00:00Z",
  },
  {
    id: "p2",
    companyId: "ct045",
    title: "원소재 단계가 전체 배출의 약 75%",
    content: "1~8월 LCA 분석 결과 플라스틱 원소재 조달(Scope 3) 단계가 전체 PCF의 약 75%를 차지했습니다. 저탄소 원료 대체 검토를 권장합니다.",
    dateTime: "2025-09-01T10:00:00Z",
  },
  {
    id: "p3",
    companyId: "ct045",
    title: "2월 운송 배출량 최대치",
    content: "2월 트럭 운송량이 211 ton-km로 전 기간 최고치를 기록했습니다. 물류 경로 최적화 또는 적재율 개선을 통한 감축이 가능합니다.",
    dateTime: "2025-03-05T08:30:00Z",
  },
  {
    id: "p4",
    companyId: "ct045",
    title: "플라스틱 2 배출계수 검증 완료",
    content: "플라스틱 2(EF 3.2 kgCO2e/kg)에 대한 외부 검증을 완료했습니다. 재생 원료 비율 확대 시 연간 약 120 kgCO2e 절감 가능성이 있습니다.",
    dateTime: "2025-06-15T14:00:00Z",
  },
  {
    id: "p5",
    companyId: "ct045",
    title: "하반기 감축 목표 수립",
    content: "9월부터 전력 계약 전환(재생에너지 PPA) 및 트럭 운송 최적화를 통해 연간 총 배출량 10% 감축을 목표로 설정했습니다.",
    dateTime: "2025-08-20T16:00:00Z",
  },
];
