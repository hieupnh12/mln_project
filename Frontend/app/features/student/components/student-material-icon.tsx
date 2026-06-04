import type { ReactNode } from "react";

type StudentMaterialIconSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<StudentMaterialIconSize, string> = {
  sm: "h-5 w-5 text-[20px]",
  md: "h-6 w-6 text-[24px]",
  lg: "h-12 w-12 text-[48px]",
};

export function StudentMaterialIcon({
  children,
  className = "",
  filled = false,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  filled?: boolean;
  size?: StudentMaterialIconSize;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-flex shrink-0 items-center justify-center leading-none ${SIZE_CLASSES[size]} ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {children}
    </span>
  );
}
