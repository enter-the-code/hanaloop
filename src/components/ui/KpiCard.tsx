import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
// Key Performance Indicator 라는 뜻 변수 이름 ai 검색해서 사용
interface KpiCardProps {
  loading?: boolean;
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  description?: string;
  tooltip?: string;
}

export default function KpiCard({ title, value, unit, change, description, tooltip, loading }: KpiCardProps) {
  if (loading) return <LoadingSkeleton variant="card" />;

  const isUp   = change !== undefined && change > 0;
  const isDown = change !== undefined && change < 0;

  const TrendIcon  = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const trendColor = isUp ? "text-red-400" : isDown ? "text-emerald-400" : "text-slate-400";

  return (
    <div className="rounded-xl bg-slate-900 p-5 ring-1 ring-slate-800">
      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-2xl font-bold text-slate-100">
          {typeof value === "number" ? value.toLocaleString("ko-KR") : value}
        </span>
        {unit && <span className="mb-0.5 text-sm text-slate-400">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(change).toFixed(1)}% 전월 대비</span>
          </div>
        )}
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
    </div>
  );
}
