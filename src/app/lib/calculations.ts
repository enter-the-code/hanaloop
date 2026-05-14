import type {
  EmissionRecord,
  ScopeType,
  LifecycleStage,
  ScopeBreakdown,
  StageBreakdown,
  MonthlyTotal,
  KpiSummary,
  FilterState,
} from "./types";

import { EMISSION_FACTOR_META, LIFECYCLE_STAGE_LABEL } from "./data";


export function calculateEmission(
  activityAmount: number,
  emissionFactor: number
): number {
  return activityAmount * emissionFactor;
}

//일단 data 메소드로 계산 하지 않고 간단하게 == 호로 맞추는 방향 채택(더미데이터라서)
export function filterRecords(
  records: EmissionRecord[],
  filters: FilterState
): EmissionRecord[] {
  return records.filter((r) => {
    if (filters.period !== null && r.yearMonth !== filters.period) return false;
    if (filters.companyId !== null && r.companyId !== filters.companyId) return false;
    if (filters.scope !== null && r.scope !== filters.scope) return false;
    return true;
  });
}

export function aggregateByMonth(records: EmissionRecord[]): MonthlyTotal[] {
  const map = new Map<string, MonthlyTotal>();

  for (const r of records) {
    let entry = map.get(r.yearMonth);
    if (!entry) {
      entry = {
        yearMonth: r.yearMonth,
        total: 0,
        byScope: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
      };
      map.set(r.yearMonth, entry);
    }
    entry.total += r.emissionsKgCo2e;
    entry.byScope.total += r.emissionsKgCo2e;
    if (r.scope === 1) entry.byScope.scope1 += r.emissionsKgCo2e;
    else if (r.scope === 2) entry.byScope.scope2 += r.emissionsKgCo2e;
    else entry.byScope.scope3 += r.emissionsKgCo2e;
  }

  return Array.from(map.values()).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth)
  );
}

export function aggregateByScope(records: EmissionRecord[]): ScopeBreakdown {
  const breakdown: ScopeBreakdown = { scope1: 0, scope2: 0, scope3: 0, total: 0 };
  for (const r of records) {
    breakdown.total += r.emissionsKgCo2e;
    if (r.scope === 1) breakdown.scope1 += r.emissionsKgCo2e;
    else if (r.scope === 2) breakdown.scope2 += r.emissionsKgCo2e;
    else breakdown.scope3 += r.emissionsKgCo2e;
  }
  return breakdown;
}

export function aggregateByStage(records: EmissionRecord[]): StageBreakdown[] {
  const map = new Map<LifecycleStage, number>();

  for (const r of records) {
    map.set(r.stage, (map.get(r.stage) ?? 0) + r.emissionsKgCo2e);
  }

  const total = Array.from(map.values()).reduce((s, v) => s + v, 0);

  return Array.from(map.entries()).map(([stage, co2e]) => ({
    stage,
    label: LIFECYCLE_STAGE_LABEL[stage],
    co2e,
    percentage: total > 0 ? (co2e / total) * 100 : 0,
  }));
}

export function buildKpis(records: EmissionRecord[]): KpiSummary {
  const totalKg = records.reduce((s, r) => s + r.emissionsKgCo2e, 0);
  const totalEmissions = totalKg / 1000;

  // productName별 총 배출량 평균 → PCF
  const byProduct = new Map<string, number>();
  for (const r of records) {
    byProduct.set(r.productName, (byProduct.get(r.productName) ?? 0) + r.emissionsKgCo2e);
  }
  const productTotals = Array.from(byProduct.values());
  const pcfPerProduct =
    productTotals.length > 0
      ? productTotals.reduce((s, v) => s + v, 0) / productTotals.length / 1000
      : 0;

  // topScope: 가장 배출량이 큰 scope
  const byScope = aggregateByScope(records);
  const scopeEntries: [ScopeType, number][] = [
    [1, byScope.scope1],
    [2, byScope.scope2],
    [3, byScope.scope3],
  ];
  const topScope = scopeEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // topStage: 가장 배출량이 큰 stage
  const stageBreakdowns = aggregateByStage(records);
  const topStage =
    stageBreakdowns.length > 0
      ? stageBreakdowns.reduce((a, b) => (b.co2e > a.co2e ? b : a)).stage
      : "manufacturing";

  return { totalEmissions, pcfPerProduct, topScope, topStage };
}

export function mapSourceToScopeStage(
  source: string
): { scope: ScopeType; stage: LifecycleStage } | null {
  const meta = EMISSION_FACTOR_META[source];
  if (!meta) return null;
  return { scope: meta.scope, stage: meta.stage };
}

export function formatCo2e(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} tCO2e`;
  }
  return `${value.toFixed(1)} kgCO2e`;
}
