import type { ExamSummary } from "../../types/exam-summary.types";

type ExamSummaryMetaProps = {
  summary: ExamSummary;
};

export function ExamSummaryMeta({ summary }: ExamSummaryMetaProps) {
  return (
    <div className="mb-lg flex flex-col gap-2 text-center md:text-left">
      <p className="text-headline-md font-semibold text-primary">{summary.quizTitle}</p>
      <p className="text-body-md text-on-surface-variant">{summary.courseTitle}</p>
      {summary.submittedAt ? (
        <p className="text-label-sm text-on-surface-variant">Nộp lúc: {summary.submittedAt}</p>
      ) : null}
    </div>
  );
}
