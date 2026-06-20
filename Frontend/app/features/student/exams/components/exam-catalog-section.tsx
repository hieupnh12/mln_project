import type { ReactNode } from "react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type ExamCatalogSectionProps = {
  title: string;
  icon: string;
  iconFilled?: boolean;
  badge?: string;
  tone?: "active" | "upcoming" | "neutral";
  children: ReactNode;
};

const toneClasses = {
  active: {
    icon: "bg-secondary-container/55 text-secondary",
    badge: "bg-secondary-container/55 text-secondary",
  },
  upcoming: {
    icon: "bg-landing-gold/15 text-landing-text-muted",
    badge: "bg-landing-gold/15 text-landing-text-muted",
  },
  neutral: {
    icon: "bg-landing-gray text-landing-text-soft",
    badge: "bg-landing-gray text-landing-text-muted",
  },
} as const;

export function ExamCatalogSection({
  title,
  icon,
  iconFilled = false,
  badge,
  tone = "neutral",
  children,
}: ExamCatalogSectionProps) {
  const classes = toneClasses[tone];

  return (
    <section className="w-full min-w-0">
      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3 border-b border-outline-variant/30 pb-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${classes.icon}`}>
          <MaterialIcon filled={iconFilled}>{icon}</MaterialIcon>
        </span>
        <h2 className="text-headline-sm font-semibold text-landing-text">{title}</h2>
        {badge ? (
          <span className={`rounded-full px-3 py-1 text-label-sm font-semibold ${classes.badge}`}>
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
