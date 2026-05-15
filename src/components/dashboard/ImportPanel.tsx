"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { importFile } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";

interface ImportPanelProps {
  onImported: () => void;
}

export default function ImportPanel({ onImported }: ImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; errors: string[] } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handle(file: File) {
    if (!file.name.match(/\.(csv|tsv|txt|xlsx?)$/i)) {
      setToast({ type: "error", message: "CSV / TSV / Excel 파일만 지원합니다." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await importFile(file);
      setResult(res);
      if (res.inserted > 0) {
        setToast({ type: "success", message: `${res.inserted}건 가져오기 완료.` });
        onImported();
      } else {
        setToast({ type: "error", message: "가져온 데이터가 없습니다. 형식을 확인해주세요." });
      }
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "가져오기 실패" });
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  }

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-300">데이터 가져오기</p>
        <Tooltip content="과제 제공 Excel/CSV 파일을 탭 구분자(TSV) 형식으로 내보낸 후 드래그하거나 클릭해 업로드하세요. 헤더: 일자(원본) / 활동 유형 / 설명 / 량 / 단위" />
      </div>
      <p className="mb-4 text-xs text-slate-500">CSV / TSV 파일을 드래그하거나 클릭해 업로드하세요.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-10 transition-colors",
          dragging ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 hover:border-slate-500",
        ].join(" ")}
      >
        <Upload className={`h-8 w-8 ${dragging ? "text-emerald-400" : "text-slate-500"}`} />
        <p className="text-sm text-slate-400">
          {loading ? "처리 중…" : "파일을 드래그하거나 클릭해 선택"}
        </p>
        <p className="text-xs text-slate-600">CSV · TSV · Excel</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.tsv,.txt,.xls,.xlsx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
        />
      </div>

      {result && result.errors.length > 0 && (
        <div className="mt-3 rounded-lg bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
          <p className="mb-1 text-xs font-semibold text-red-400">오류 {result.errors.length}건</p>
          <ul className="space-y-0.5">
            {result.errors.map((e, i) => (
              <li key={i} className="text-xs text-red-400">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
}
