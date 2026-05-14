interface LoadingSkeletonProps {
  variant: "card" | "chart" | "table" | "row";
}

export default function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className="animate-pulse rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        <div className="h-3 w-24 rounded bg-slate-700" />
        <div className="mt-3 h-7 w-32 rounded bg-slate-700" />
        <div className="mt-2 h-3 w-16 rounded bg-slate-800" />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="animate-pulse rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        <div className="mb-4 h-3 w-36 rounded bg-slate-700" />
        <div className="flex items-end gap-2 h-48">
          {[60, 80, 50, 90, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-slate-700" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="animate-pulse rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
        <div className="mb-4 h-3 w-32 rounded bg-slate-700" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-3 w-1/4 rounded bg-slate-700" />
              <div className="h-3 w-1/3 rounded bg-slate-800" />
              <div className="h-3 w-1/5 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // row
  return (
    <div className="animate-pulse flex gap-4 py-2">
      <div className="h-3 w-1/4 rounded bg-slate-700" />
      <div className="h-3 w-1/3 rounded bg-slate-800" />
      <div className="h-3 flex-1 rounded bg-slate-700" />
    </div>
  );
}
