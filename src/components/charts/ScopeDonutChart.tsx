"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";
import type { ScopeBreakdown } from "@/lib/types";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

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
      </div>
      <p className="mb-4 text-xs text-slate-500">각 영역에 마우스를 올리면 배출량을 확인할 수 있어요.</p>

      <div className="relative">
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
              }}
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
