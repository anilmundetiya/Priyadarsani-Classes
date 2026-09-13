import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
  light?: boolean;
}

export default function Logo({
  size = "md",
  variant = "full",
  className,
  light = false,
}: LogoProps) {
  const iconSizes = { sm: 32, md: 44, lg: 56, xl: 72 };
  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };
  const subSizes = {
    sm: "text-[9px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  };

  const iconSize = iconSizes[size];

  if (variant === "icon") {
    return (
      <div className={cn("flex-shrink-0", className)}>
        <Image
          src="/images/logo.png"
          alt="Priyadarshani Classes"
          width={iconSize}
          height={iconSize}
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("flex flex-col", className)}>
        <span
          className={cn(
            "font-extrabold tracking-tight",
            textSizes[size],
            light ? "text-white" : "text-slate-900"
          )}
        >
          Priyadarshani{" "}
          <span className="text-blue-500">CLASSES</span>
        </span>
        <span
          className={cn(
            "font-medium",
            subSizes[size],
            light ? "text-slate-300" : "text-slate-500"
          )}
        >
          Mumbai, Maharashtra
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/images/classes-logo.jpeg"
        alt="Priyadarshani Classes"
        width={iconSize}
        height={iconSize}
        className="rounded-full object-cover flex-shrink-0"
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none",
            textSizes[size],
            light ? "text-white" : "text-slate-900"
          )}
        >
          Priyadarshani{" "}
          <span className="text-blue-500">CLASSES</span>
        </span>
        <span
          className={cn(
            "font-medium leading-none mt-0.5",
            subSizes[size],
            light ? "text-slate-300" : "text-slate-500"
          )}
        >
          Mumbai, Maharashtra
        </span>
      </div>
    </div>
  );
}
