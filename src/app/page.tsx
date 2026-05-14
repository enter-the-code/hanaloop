import Image from "next/image";
import Filter from "@/components/framepiece/Filter";
export default function Dashboard() {
  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">탄소 배출 대시보드</h1>
          <p className="mt-1 text-sm text-slate-400">2024년 1–6월 · 4개 기업 · GHG Protocol 기준</p>
        </div>
        <Filter />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        </div>
        <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        </div>
        <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        </div>
        <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      </div>
    </div>
  );
}
