"use client";

import { useState } from "react";
import { EMISSION_FACTOR_META } from "@/lib/data";
import type { EmissionRecord } from "@/lib/types";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";

interface ActivityInputFormProps {
  onSave: (record: Omit<EmissionRecord, "id">) => Promise<void>;
}

const SOURCE_OPTIONS = [
  { value: "electricity", label: "전기 (한국전력)" },
  { value: "plastic_1",   label: "원소재 — 플라스틱 1" },
  { value: "plastic_2",   label: "원소재 — 플라스틱 2" },
  { value: "truck",       label: "운송 — 트럭" },
] as const;

const PERIODS = [
  "2025-01","2025-02","2025-03","2025-04",
  "2025-05","2025-06","2025-07","2025-08",
];

type FieldErrors = Partial<Record<"yearMonth" | "activityAmount" | "source", string>>;

const inputCls = (err?: string) =>
  `w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 ring-1 transition-colors focus:outline-none ${
    err ? "ring-red-500 focus:ring-red-500" : "ring-slate-700 focus:ring-emerald-500"
  }`;

export default function ActivityInputForm({ onSave }: ActivityInputFormProps) {
  const [yearMonth, setYearMonth]         = useState("");
  const [source, setSource]               = useState("");
  const [activityAmount, setActivityAmount] = useState("");
  const [saving, setSaving]               = useState(false);
  const [errors, setErrors]               = useState<FieldErrors>({});
  const [toast, setToast]                 = useState<{ type: "success" | "error"; message: string } | null>(null);

  const meta     = source ? EMISSION_FACTOR_META[source] : null;
  const amount   = parseFloat(activityAmount);
  const preview  = meta && !isNaN(amount) && amount > 0 ? amount * meta.factor : null;

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!yearMonth)                          e.yearMonth       = "기간을 선택해주세요.";
    if (!source)                             e.source          = "활동 유형을 선택해주세요.";
    if (!activityAmount.trim())              e.activityAmount  = "활동량을 입력해주세요.";
    else if (isNaN(amount) || amount <= 0)   e.activityAmount  = "0보다 큰 숫자를 입력해주세요.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!meta) return;
    setSaving(true);
    try {
      await onSave({
        companyId:       "ct045",
        productName:     "CT-045 제품",
        yearMonth,
        scope:           meta.scope,
        stage:           meta.stage,
        source,
        activityAmount:  amount,
        activityUnit:    meta.unit.split("/")[1] ?? meta.unit,
        emissionFactor:  meta.factor,
        factorUnit:      meta.unit,
        emissionsKgCo2e: amount * meta.factor,
        dataSourceType:  "primary",
      });
      setToast({ type: "success", message: "활동 데이터가 추가되었습니다." });
      setYearMonth(""); setSource(""); setActivityAmount(""); setErrors({});
    } catch {
      setToast({ type: "error", message: "저장 실패. 다시 시도해 주세요." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-300">활동 데이터 입력</p>
        <Tooltip content="활동량을 입력하면 배출계수를 곱해 kgCO₂e를 자동 산정합니다. 입력 즉시 대시보드에 반영됩니다." />
      </div>
      <p className="mb-4 text-xs text-slate-500">활동 유형 선택 시 배출계수가 자동으로 채워집니다.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-3 sm:grid-cols-3">

          {/* 기간 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">기간</label>
            <select
              value={yearMonth}
              onChange={(e) => { setYearMonth(e.target.value); setErrors((p) => ({ ...p, yearMonth: undefined })); }}
              className={inputCls(errors.yearMonth)}
            >
              <option value="">선택</option>
              {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.yearMonth && <p className="mt-1 text-xs text-red-400">{errors.yearMonth}</p>}
          </div>

          {/* 활동 유형 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">활동 유형</label>
            <select
              value={source}
              onChange={(e) => { setSource(e.target.value); setErrors((p) => ({ ...p, source: undefined })); }}
              className={inputCls(errors.source)}
            >
              <option value="">선택</option>
              {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.source && <p className="mt-1 text-xs text-red-400">{errors.source}</p>}
          </div>

          {/* 활동량 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              활동량 {meta && <span className="text-slate-500">({meta.unit.split("/")[1]})</span>}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="예: 110"
              value={activityAmount}
              onChange={(e) => { setActivityAmount(e.target.value); setErrors((p) => ({ ...p, activityAmount: undefined })); }}
              className={inputCls(errors.activityAmount)}
            />
            {errors.activityAmount && <p className="mt-1 text-xs text-red-400">{errors.activityAmount}</p>}
          </div>
        </div>

        {/* 배출계수 + 산정값 미리보기 */}
        {meta && (
          <div className="mt-3 flex flex-wrap gap-4 rounded-lg bg-slate-800/50 px-4 py-3 text-xs">
            <div>
              <span className="text-slate-500">배출계수</span>
              <span className="ml-2 font-mono text-sky-400">{meta.factor} {meta.unit}</span>
            </div>
            <div>
              <span className="text-slate-500">Scope</span>
              <span className="ml-2 font-semibold text-slate-300">Scope {meta.scope}</span>
            </div>
            <div>
              <span className="text-slate-500">산정 배출량</span>
              <span className="ml-2 font-bold text-emerald-400">
                {preview !== null ? `${preview.toFixed(2)} kgCO₂e` : "—"}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {saving ? "저장 중…" : "추가"}
        </button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
}
