import type { ScopeType } from "@/lib/types";

const CONFIG: Record<ScopeType, { label: string; cls: string }> = {
  1: { label: "Scope 1", cls: "bg-red-500/20 text-red-400 ring-red-500/30" },
  2: { label: "Scope 2", cls: "bg-blue-500/20 text-blue-400 ring-blue-500/30" },
  3: { label: "Scope 3", cls: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30" },
};

export default function Badge({ scope }: { scope: ScopeType }) {
  const { label, cls } = CONFIG[scope];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
}
