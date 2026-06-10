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
    <section className="w-full min-w-0">
      <div className="mb-md flex min-w-0 flex-wrap items-center gap-3 border-b border-outline-variant/30 pb-3">
        <span
          className={
            muted
              ? "flex h-10 w-10 items-center justify-center rounded-xl bg-landing-gray text-landing-text-soft"
              : "flex h-10 w-10 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red"
          }
        >
          <MaterialIcon filled={iconFilled}>{icon}</MaterialIcon>
        </span>
        <h2 className="font-serif text-headline-md font-semibold text-landing-text">
          {title}
        </h2>
        {badge ? (
          <span className="rounded-full bg-landing-red/10 px-3 py-1 text-label-sm font-semibold text-landing-red">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
