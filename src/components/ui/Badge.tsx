import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "red" | "yellow" | "purple" | "gray" | "orange" | "pink";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "blue",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    gray: "bg-slate-50 text-slate-600 border-slate-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    pink: "bg-pink-50 text-pink-700 border-pink-100",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
