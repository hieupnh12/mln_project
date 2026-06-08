import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";

type QuizFormSectionProps = {
  children: ReactNode;
  description?: string;
  highlight?: boolean;
  icon: string;
  title: string;
};

export function QuizFormSection({
  children,
  description,
  highlight = false,
  icon,
  title,
}: QuizFormSectionProps) {
  return (
    <section
      className={`rounded-lg p-sm ${
        highlight
          ? "border border-secondary-container/60 bg-secondary-container/15"
          : "border border-outline-variant/10 bg-surface-container-low/40"
      }`}
    >
      <header className="mb-sm flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
            highlight ? "bg-secondary-container text-primary" : "bg-white text-secondary"
          }`}
        >
          <MaterialIcon className="text-[18px]">{icon}</MaterialIcon>
        </span>
        <div className="min-w-0">
          <h5 className="text-label-md font-semibold text-primary">{title}</h5>
          {description ? (
            <p className="text-label-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
      </header>
      <div className="space-y-sm">{children}</div>
    </section>
  );
}
