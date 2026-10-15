import React from "react";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ showWordmark = true, className = "", size = "md" }: LogoProps) {
  const emblemSizes = {
    sm: "w-7 h-7 text-[11px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div className={`group flex select-none items-center gap-3 ${className}`}>
      <div
        className={`${emblemSizes[size]} flex items-center justify-center rounded-md bg-fg font-semibold tracking-tight text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]`}
      >
        AS
      </div>
      {showWordmark && (
        <span className="text-sm font-medium tracking-tight text-fg">Ansh Sharma</span>
      )}
    </div>
  );
}
