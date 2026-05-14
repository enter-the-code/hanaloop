"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EmissionRecord } from "@/lib/types";
import { formatCo2e } from "@/lib/calculations";
import { LIFECYCLE_STAGE_LABEL } from "@/lib/data";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
const PAGE_SIZE = 10;

export default function EmissionTable({ records, loading }: { records: EmissionRecord[]; loading?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = records.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="rounded-xl bg-slate-900 ring-1 ring-slate-800">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-300">배출 기록</p>
          <Tooltip content="활동량(Activity) × 배출계수(EF)로 산정한 원단위 배출량입니다. primary는 직접 측정, secondary는 공개 데이터베이스 기반입니다." />
        </div>
        <p className="text-xs text-slate-500 mt-0.5">총 {records.length}건</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              {["Month", "Product", "Scope", "Stage", "Source", "Activity", "EF", "Emissions", "Data"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-slate-500">
                  해당 조건의 데이터가 없습니다
                </td>
              </tr>
            ) : paged.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-400 tabular-nums whitespace-nowrap">{r.yearMonth}</td>
                <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">{r.productName}</td>
                <td className="px-4 py-3 whitespace-nowrap"><Badge scope={r.scope} /></td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{LIFECYCLE_STAGE_LABEL[r.stage]}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-400 font-mono text-xs">{r.source}</code>
                </td>
                <td className="px-4 py-3 text-slate-400 tabular-nums whitespace-nowrap">
                  {r.activityAmount.toLocaleString()} <span className="text-slate-600">{r.activityUnit}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 tabular-nums whitespace-nowrap">
                  {r.emissionFactor} <span className="text-slate-600">{r.factorUnit}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-200 tabular-nums whitespace-nowrap">
                  {formatCo2e(r.emissionsKgCo2e)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Tooltip content={r.dataSourceType === "primary" ? "직접 측정한 값입니다. 계량기·센서 등 1차 출처 기반으로 신뢰도가 높습니다." : "공개 DB(IPCC·DEFRA 등)에서 가져온 추정값입니다. 직접 측정이 어려울 때 사용하는 2차 출처입니다."}>
                    <span className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      r.dataSourceType === "primary"
                        ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 ring-slate-500/20",
                    ].join(" ")}>
                      {r.dataSourceType}
                    </span>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
        <span className="text-xs text-slate-500">
          {records.length}건 중 {Math.min((safePage - 1) * PAGE_SIZE + 1, records.length)}–{Math.min(safePage * PAGE_SIZE, records.length)}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={[
                "h-7 w-7 rounded-lg text-xs font-medium transition-colors",
                p === safePage
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
