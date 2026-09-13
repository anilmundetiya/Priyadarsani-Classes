import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-blue-100",
  trend,
  trendValue,
  color = "text-blue-600",
  className,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-slate-100 p-5",
        "hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{title}</p>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("p-3 rounded-xl", iconBg)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
