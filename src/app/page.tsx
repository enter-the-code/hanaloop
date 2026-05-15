"use client";
import Filter from "@/components/framepiece/Filter";
import KpiCard from "@/components/ui/KpiCard";
import { useState, useMemo ,useEffect} from "react";
import { filterRecords, buildKpis, aggregateByMonth, aggregateByScope, aggregateByStage, formatCo2e } from "@/lib/calculations";
import type { Company, EmissionRecord, FilterState, Post } from "@/lib/types";
import { fetchEmissionRecords, fetchCompanies, fetchPosts, createOrUpdatePost, createEmissionRecord, deleteEmissionRecord } from "@/lib/api";
import EmissionTrendChart from "@/components/charts/EmissionTrendChart";
import ScopeDonutChart from "@/components/charts/ScopeDonutChart";
import LifecycleBarChart from "@/components/charts/LifecycleBarChart";
import EmissionTable from "@/components/dashboard/EmissionTable";
import NotesPanel from "@/components/dashboard/NotesPanel";
import ActivityInputForm from "@/components/dashboard/ActivityInputForm";
import ImportPanel from "@/components/dashboard/ImportPanel";
import { SCOPE_LABEL, STAGE_SHORT } from "@/lib/data";
export default function Dashboard() {
  // state 선언
  const [records, setRecords] = useState<EmissionRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ period: null, companyId: null, scope: null });

  // 필터 및 집계값 및 kpi 계산 - useMemo로 최적화
  const filtered = useMemo(() => filterRecords(records, filters), [records, filters]);
  const kpis = useMemo(() => buildKpis(filtered), [filtered]);
  const monthly = useMemo(() => aggregateByMonth(filtered), [filtered]);
  const scopeBd = useMemo(() => aggregateByScope(filtered), [filtered]);
  const stageBd = useMemo(() => aggregateByStage(filtered), [filtered]);
  const topScopeKg = scopeBd[`scope${kpis.topScope}` as keyof typeof scopeBd];
  const topStagePct = stageBd.find((s) => s.stage === kpis.topStage)?.percentage.toFixed(1) ?? "0";

  // 데어터 로드
  async function loadData() {
    setLoading(true); setError(null);
    try {
      const [r, c, p] = await Promise.all([fetchEmissionRecords(), fetchCompanies(), fetchPosts()]);
      setRecords(r); setCompanies(c); setPosts(p);
    } catch {
      setError("데이터를 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteEmissionRecord(id);
    } catch (err) {
      await loadData();
      throw err;
    }
  }

  async function handleAddRecord(record: Omit<EmissionRecord, "id">) {
    const opt: EmissionRecord = { ...record, id: `opt-${Date.now()}` };
    setRecords((prev) => [...prev, opt]);
    try {
      const saved = await createEmissionRecord(record);
      setRecords((prev) => prev.map((r) => r.id === opt.id ? saved : r));
    } catch (err) {
      setRecords((prev) => prev.filter((r) => r.id !== opt.id));
      throw err;
    }
  }

  // 포스트 수정 추가용으로 하나 추가
  async function handleSave(post: Omit<Post, "id"> & { id?: string }) {
    const oid = post.id ?? `opt-${Date.now()}`;
    const opt: Post = { ...post, id: oid };
    setPosts((prev) => post.id ? prev.map((p) => p.id === post.id ? opt : p) : [opt, ...prev]);
    try {
      const saved = await createOrUpdatePost(post);
      setPosts((prev) => prev.map((p) => p.id === oid ? saved : p));
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p.id !== oid));
      throw err;
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises, react-hooks/set-state-in-effect
    loadData();
  }, []);

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">탄소 배출 대시보드</h1>
          <p className="mt-1 text-sm text-slate-400">2025년 1–8월 · CT-045 · GHG Protocol 기준</p>
        </div>
        <Filter companies={companies} filters={filters} onChange={setFilters} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="총 배출량" value={kpis.totalEmissions.toFixed(1)} unit="tCO₂e" tooltip="필터 조건 내 모든 배출원의 합산 배출량입니다. kg CO₂e → tCO₂e 변환값." loading={loading} />
        <KpiCard title="제품별 평균 PCF" value={kpis.pcfPerProduct.toFixed(1)} unit="tCO₂e" description="제품군 평균" tooltip="PCF(Product Carbon Footprint): 제품 1단위 생산에 발생하는 탄소량. 제품군별 총량의 평균입니다." loading={loading} />
        <KpiCard title="최대 배출 Scope" value={SCOPE_LABEL[kpis.topScope] ?? "-"} description={formatCo2e(topScopeKg)} tooltip="Scope 1·2·3 중 현재 필터 기간에서 가장 많은 배출량을 차지한 Scope입니다." loading={loading} />
        <KpiCard title="최대 배출 단계" value={STAGE_SHORT[kpis.topStage] ?? kpis.topStage} description={`${topStagePct}%`} tooltip="원료 취득·제조·포장·운송 중 배출량 비중이 가장 높은 라이프사이클 단계입니다." loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3"><EmissionTrendChart data={monthly} loading={loading} /></div>
        <div className="lg:col-span-2"><ScopeDonutChart breakdown={scopeBd} loading={loading} /></div>
      </div>

      <LifecycleBarChart data={stageBd} loading={loading} />

      <ActivityInputForm onSave={handleAddRecord} />

      <ImportPanel onImported={loadData} />

      <EmissionTable records={filtered} loading={loading} onDelete={handleDeleteRecord} />

      <NotesPanel posts={posts} companies={companies} onSave={handleSave} />
    </div>
  );
}
