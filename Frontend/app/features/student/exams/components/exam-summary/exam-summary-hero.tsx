import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import type { ExamSummary } from "../../types/exam-summary.types";

type ExamSummaryHeroProps = {
  summary: ExamSummary;
};

function ScoreChip({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "default" | "muted" | "accent";
}) {
  const valueClass =
    variant === "accent"
      ? "text-secondary"
      : variant === "muted"
        ? "text-on-surface-variant"
        : "text-primary";

  return (
    <div className="inline-flex min-w-0 flex-col rounded-lg border border-outline-variant/15 bg-surface-container-lowest px-3 py-2">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <span className={`text-label-md font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

export function ExamSummaryHero({ summary }: ExamSummaryHeroProps) {
  const headline = summary.passed ? "Tổng kết bài kiểm tra" : "Hoàn thành bài kiểm tra";
  const gapPercent = Math.max(0, summary.passingScore - summary.accuracyPercent);

  const hint = summary.passed
    ? "Tiếp tục duy trì phong độ nhé!"
    : "Hãy xem lại phần cần cải thiện bên dưới.";

  return (
    <section className="mb-xl rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
      <div className="flex items-start gap-md sm:items-center">
        <div
          aria-hidden="true"
          className="hero-float flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary-container/30 sm:h-16 sm:w-16"
        >
          <MaterialIcon className="text-secondary" filled size="lg">
            {summary.passed ? "emoji_events" : "task_alt"}
          </MaterialIcon>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-headline-md font-semibold leading-snug text-primary sm:text-headline-lg">
            {headline}
          </h1>

          <div className="mt-sm flex flex-wrap gap-2">
            <ScoreChip label="Điểm của bạn" value={`${summary.accuracyPercent}%`} variant="accent" />
            <ScoreChip
              label="Ngưỡng đạt"
              value={`${summary.passingScore}%`}
              variant="muted"
            />
            {!summary.passed ? (
              <ScoreChip label="Còn thiếu" value={`${gapPercent}%`} variant="default" />
            ) : null}
          </div>

          <p className="mt-sm text-label-md text-on-surface-variant">{hint}</p>
        </div>
      </div>
    </section>
  );
}
