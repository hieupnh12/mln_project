import type { ReactNode } from "react";

type CourseStructureModalPanelProps = {
  children: ReactNode;
  className?: string;
};

/** Panel modal thống nhất — width cố định, không gây scroll ngang. */
export function CourseStructureModalPanel({
  children,
  className = "",
}: CourseStructureModalPanelProps) {
  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}
