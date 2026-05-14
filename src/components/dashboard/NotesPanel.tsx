"use client";

import { useState, useRef } from "react";
import type { Post, Company } from "@/lib/types";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";

interface NotesPanelProps {
  posts: Post[];
  companies: Company[];
  onSave: (post: Omit<Post, "id"> & { id?: string }) => Promise<void>;
}

const now = () => new Date().toISOString().slice(0, 16);
const EMPTY = { companyId: "", title: "", content: "", dateTime: now() };

const inputCls = "w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 ring-1 ring-slate-700 focus:outline-none focus:ring-emerald-500 transition-colors";

export default function NotesPanel({ posts, companies, onSave }: NotesPanelProps) {
  const [form, setForm] = useState({ ...EMPTY, companyId: companies[0]?.id ?? "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const prevForm = useRef(form);

  const recent = [...posts].sort((a, b) => b.dateTime.localeCompare(a.dateTime)).slice(0, 3);
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    prevForm.current = form;
    setSaving(true);
    try {
      await onSave({ ...form });
      setToast({ type: "success", message: "메모가 저장되었습니다." });
      setForm({ ...EMPTY, companyId: companies[0]?.id ?? "" });
    } catch {
      setToast({ type: "error", message: "저장 실패. 다시 시도해 주세요." });
      setForm(prevForm.current);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-300">탄소 메모</p>
        <Tooltip content="기업별 탄소 감축 활동, 목표, 이슈를 자유롭게 기록합니다. 저장 실패 시 자동으로 롤백됩니다." />
      </div>
      <p className="mb-4 text-xs text-slate-500">기업의 탄소 감축 활동, 목표, 보고 내용을 자유롭게 기록하세요.</p>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 sm:grid-cols-2">
        <input
          placeholder="제목"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={`${inputCls} sm:col-span-2`}
          required
        />
        <select
          value={form.companyId}
          onChange={(e) => setForm((f) => ({ ...f, companyId: e.target.value }))}
          className={inputCls}
          required
        >
          <option value="">기업 선택</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
          className={inputCls}
          required
        />
        <textarea
          placeholder="내용"
          rows={2}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className={`${inputCls} sm:col-span-2 resize-none`}
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "저장 중…" : "게시"}
        </button>
      </form>

      {/* 포스트 목록 */}
      <ul className="space-y-3">
        {recent.length === 0 ? (
          <li className="py-6 text-center text-sm text-slate-500">아직 메모가 없습니다</li>
        ) : recent.map((p) => (
          <li key={p.id} className="rounded-lg bg-slate-800 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-200">{p.title}</p>
              <span className="shrink-0 text-xs text-slate-500">{p.dateTime.slice(0, 10)}</span>
            </div>
            <p className="mt-1 text-xs text-emerald-400">{companyName(p.companyId)}</p>
            {p.content && (
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{p.content}</p>
            )}
          </li>
        ))}
      </ul>

      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
}
