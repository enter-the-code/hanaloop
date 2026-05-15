"use client";

import type { Company, FilterState, ScopeType } from "@/lib/types";

interface FilterBarProps {
    companies: Company[];
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

const PERIODS = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08"];
const SCOPE_OPTIONS: { label: string; value: ScopeType | null }[] = [
    { label: "전체", value: null },
    { label: "Scope 1", value: 1 },
    { label: "Scope 2", value: 2 },
    { label: "Scope 3", value: 3 },
];

const selectCls = "rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 ring-1 ring-slate-700 focus:outline-none focus:ring-emerald-500 transition-colors";

export default function Filter({ companies, filters, onChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <select
                className={selectCls}
                value={filters.period ?? ""}
                onChange={(e) => onChange({ ...filters, period: e.target.value || null })}
            >
                <option value="">전체 기간</option>
                {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
                className={selectCls}
                value={filters.companyId ?? ""}
                onChange={(e) => onChange({ ...filters, companyId: e.target.value || null })}
            >
                <option value="">전체 회사</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <div className="flex rounded-lg ring-1 ring-slate-700 overflow-hidden">
                {SCOPE_OPTIONS.map(({ label, value }) => {
                    const active = filters.scope === value;
                    return (
                        <button
                            key={String(value)}
                            onClick={() => onChange({ ...filters, scope: value })}
                            className={[
                                "px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-100",
                            ].join(" ")}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
