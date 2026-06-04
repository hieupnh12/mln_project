type ExamStatusPillVariant = "ongoing" | "upcoming" | "completed" | "passed" | "failed";

type ExamStatusPillProps = {
  variant: ExamStatusPillVariant;
  label: string;
};

const variantClass: Record<ExamStatusPillVariant, string> = {
  ongoing: "bg-secondary-container text-on-secondary-fixed-variant",
  upcoming: "bg-surface-container text-on-surface-variant",
  completed: "bg-surface-container text-outline",
  passed: "bg-secondary-container text-on-secondary-fixed-variant",
  failed: "bg-error-container text-error",
};

export function ExamStatusPill({ variant, label }: ExamStatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-label-sm font-semibold uppercase tracking-wider ${variantClass[variant]}`}
    >
      {label}
    </span>
  );
}
