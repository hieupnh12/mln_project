import type { ReactNode } from "react";

export function StudentMaterialIcon({
  children,
  className = "",
  filled = false,
}: {
  children: ReactNode;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden leading-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {children}
    </span>
  );
}
