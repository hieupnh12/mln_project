type ExamStatusPillVariant = "ongoing" | "upcoming" | "completed" | "passed" | "failed";

type ExamStatusPillProps = {
  variant: ExamStatusPillVariant;
  label: string;
};

const variantClass: Record<ExamStatusPillVariant, string> = {
  ongoing: "bg-secondary-container/55 text-secondary",
  upcoming: "bg-landing-gold/15 text-landing-text-muted",
  completed: "bg-landing-gray text-landing-text-soft",
  passed: "bg-secondary-container/55 text-secondary",
  failed: "bg-error-container text-error",
};

export function ExamStatusPill({ variant, label }: ExamStatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-label-sm font-semibold ${variantClass[variant]}`}
    >
      {label}
    </span>
  );
}
