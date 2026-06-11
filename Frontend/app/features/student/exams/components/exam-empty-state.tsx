import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type ExamEmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  compact?: boolean;
  tone?: "active" | "upcoming" | "neutral";
};

const toneClasses = {
  active: "bg-secondary-container/55 text-secondary",
  upcoming: "bg-landing-gold/15 text-landing-text-muted",
  neutral: "bg-landing-gray text-landing-text-soft",
} as const;

export function ExamEmptyState({
  icon,
  title,
  description,
  compact = false,
  tone = "neutral",
}: ExamEmptyStateProps) {
  return (
    <div
      className={`box-border w-full min-w-0 rounded-xl border border-outline-variant/35 bg-landing-white shadow-sm shadow-landing-text/5 ${
        compact ? "p-4" : "p-gutter"
      }`}
    >
      <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
        <div
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClasses[tone]}`}
        >
          <MaterialIcon size="md">{icon}</MaterialIcon>
        </div>
        <div className="text-left">
          <p className="text-base font-semibold leading-snug text-landing-text">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-landing-text-soft">{description}</p>
        </div>
      </div>
    </div>
  );
}
