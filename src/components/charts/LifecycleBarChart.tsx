"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { StageBreakdown } from "@/lib/types";
import { formatCo2e } from "@/lib/calculations";
import {LIFECYCLE_STAGE_LABEL} from "@/lib/data";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

interface LifecycleBarChartProps {
  data: StageBreakdown[];
  loading?: boolean;
}

// 1세대 스타일: 인디고-보라 계열
const STAGE_COLORS: Record<string, string> = {
  raw_material:  "#6366f1",
  manufacturing: "#8b5cf6",
  packaging:     "#a78bfa",
  transport:     "#c4b5fd",
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: StageBreakdown & { label: string } }[] }) {
  if (!active || !payload?.length) return null;
  const { label, co2e, percentage } = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-800 px-3 py-2 text-xs shadow-xl ring-1 ring-slate-700">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      <p className="font-bold text-emerald-400">{formatCo2e(co2e)}</p>
      <p className="text-slate-400 mt-0.5">전체의 {percentage.toFixed(1)}%</p>
    </div>
  );
}

export default function LifecycleBarChart({ data, loading }: LifecycleBarChartProps) {
  if (loading) return <LoadingSkeleton variant="chart" />;

  const chartData = [...data]
    .sort((a, b) => b.co2e - a.co2e)
    .map((d) => ({
      ...d,
      label: LIFECYCLE_STAGE_LABEL[d.stage],
      tonne: parseFloat((d.co2e / 1000).toFixed(1)),
    }));

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-300">전과정(LCA) 단계별 배출량</p>
      </div>
      <p className="mb-4 text-xs text-slate-500">오른쪽 숫자는 전체 배출량 대비 비율(%)입니다.</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}t`} />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ zIndex: 9999, outline: "none" }}
            offset={12}
          />
          <Bar dataKey="tonne" radius={[0, 4, 4, 0]}>
            {chartData.map((d) => (
              <Cell key={d.stage} fill={STAGE_COLORS[d.stage] ?? "#6366f1"} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => `${Number(v).toFixed(0)}%`}
              style={{ fill: "#64748b", fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
