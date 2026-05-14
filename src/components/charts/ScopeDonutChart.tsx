"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";
import type { ScopeBreakdown } from "@/lib/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Tooltip from "@/components/ui/Tooltip";
interface ScopeDonutChartProps {
  breakdown: ScopeBreakdown;
  loading?: boolean;

}

const SLICES = [
  { key: "scope1" as const, label: "Scope 1", color: "#f87171" },
  { key: "scope2" as const, label: "Scope 2", color: "#60a5fa" },
  { key: "scope3" as const, label: "Scope 3", color: "#34d399" },
];

type TooltipState = { name: string; value: number; color: string; x: number; y: number } | null;

export default function ScopeDonutChart({ breakdown, loading }: ScopeDonutChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  if (loading) return <LoadingSkeleton variant="chart" />;


  const data = SLICES.filter((s) => breakdown[s.key] > 0).map((s) => ({
    name: s.label,
    value: breakdown[s.key],
    color: s.color,
  }));

  const total = breakdown.total;

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-300">Scope 비율</p>
        <Tooltip content="Scope 1은 직접 연소(가스·경유), Scope 2는 구매 전력, Scope 3은 공급망·물류 등 간접 배출입니다. GHG Protocol 기준입니다." />
      </div>
      <p className="mb-4 text-xs text-slate-500">각 영역에 마우스를 올리면 배출량을 확인할 수 있어요.</p>

      <div className="relative" onMouseLeave={() => setTooltip(null)}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={65} outerRadius={95}
              dataKey="value"
              strokeWidth={0}
              activeShape={(props) => <Sector {...props} />}
              onMouseMove={(entry, _index, e: React.MouseEvent) => {
                const rect = (e.currentTarget as Element).closest("svg")?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({
                  name: entry.name as string,
                  value: entry.value as number,
                  color: (entry as { color?: string }).color ?? "#fff",
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 중앙 텍스트 */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-400">총 배출량</span>
          <span className="text-lg font-bold text-slate-100">{(total / 1000).toFixed(0)}</span>
          <span className="text-xs text-slate-400">tCO₂e</span>
        </div>

        {/* 커스텀 툴팁 */}
        {tooltip && (
          <div
            className="pointer-events-none absolute rounded-lg bg-slate-800 px-3 py-2 text-xs shadow-xl ring-1 ring-slate-700"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12, zIndex: 9999 }}
          >
            <p className="mb-1 font-semibold text-slate-200">{tooltip.name}</p>
            <p className="font-bold" style={{ color: tooltip.color }}>
              {(tooltip.value / 1000).toFixed(1)} tCO₂e
            </p>
            <p className="text-slate-400">{((tooltip.value / total) * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="mt-2 flex justify-center gap-4">
        {SLICES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
