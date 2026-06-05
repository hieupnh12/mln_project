import type { ReactNode } from "react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type ExamCatalogSectionProps = {
  title: string;
  icon: string;
  iconFilled?: boolean;
  badge?: string;
  muted?: boolean;
  children: ReactNode;
};

export function ExamCatalogSection({
  title,
  icon,
  iconFilled = false,
  badge,
  muted = false,
  children,
}: ExamCatalogSectionProps) {
  return (
    <section className="min-w-0 w-full">
      <div className="mb-md flex min-w-0 flex-wrap items-center gap-2 border-b border-outline-variant pb-2">
        <MaterialIcon
          className={muted ? "text-outline" : "text-secondary"}
          filled={iconFilled}
        >
          {icon}
        </MaterialIcon>
        <h2
          className={
            muted
              ? "text-headline-md font-semibold text-on-surface-variant"
              : "text-headline-md font-semibold text-primary"
          }
        >
          {title}
        </h2>
        {badge ? (
          <span className="ml-2 rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-on-secondary-fixed-variant">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}