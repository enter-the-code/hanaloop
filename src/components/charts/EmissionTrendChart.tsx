"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { MonthlyTotal } from "@/lib/types";
import { formatCo2e } from "@/lib/calculations";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Tooltip from "@/components/ui/Tooltip";
interface EmissionTrendChartProps {
    data: MonthlyTotal[];
    loading?: boolean;
}

const SCOPE_COLORS = { "Scope 1": "#f87171", "Scope 2": "#60a5fa", "Scope 3": "#34d399" } as const;

type TooltipPayload = { name: string; value: number; color: string };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg bg-slate-800 px-3 py-2 text-xs shadow-xl ring-1 ring-slate-700 min-w-[180px]">
            <p className="mb-2 font-semibold text-slate-200">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-slate-400">{p.name}</span>
                    </div>
                    <span className="font-bold text-slate-200">{formatCo2e(p.value * 1000)}</span>
                </div>
            ))}
        </div>
    );
}

export default function EmissionTrendChart({ data, loading }: EmissionTrendChartProps) {
    if (loading) return <LoadingSkeleton variant="chart" />;

    const chartData = data.map((d) => ({
        yearMonth: d.yearMonth,
        "Scope 1": parseFloat((d.byScope.scope1 / 1000).toFixed(1)),
        "Scope 2": parseFloat((d.byScope.scope2 / 1000).toFixed(1)),
        "Scope 3": parseFloat((d.byScope.scope3 / 1000).toFixed(1)),
    }));

    return (
        <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
            <div className="mb-1 flex items-center gap-1.5">
                <p className="text-sm font-medium text-slate-300">월별 배출량 추이</p>
                <Tooltip content="Scope 1·2·3별로 매달 얼마나 탄소를 배출했는지 보여줍니다. 선이 내려갈수록 감축 효과가 있다는 의미입니다." />
            </div>
            <p className="mb-4 text-xs text-slate-500">Scope별 월간 tCO₂e 추이입니다.</p>
            <ResponsiveContainer width="100%" height={243}>
                <LineChart data={chartData} margin={{ top: 15, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="yearMonth" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}t`} />
                    <RechartsTooltip
                        content={<CustomTooltip />}
                        allowEscapeViewBox={{ x: true, y: true }}
                        wrapperStyle={{ zIndex: 9999, outline: "none" }}
                        offset={12}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                    {(Object.keys(SCOPE_COLORS) as (keyof typeof SCOPE_COLORS)[]).map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={SCOPE_COLORS[key]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
