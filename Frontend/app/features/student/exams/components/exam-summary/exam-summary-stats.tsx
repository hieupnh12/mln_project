import type { ExamSummary } from "../../types/exam-summary.types";
import { formatElapsedWithLimit } from "../../utils/format-elapsed-time";

type ExamSummaryStatsProps = {
  summary: ExamSummary;
};

export function ExamSummaryStats({ summary }: ExamSummaryStatsProps) {
  const wrongCount = Math.max(0, summary.totalQuestions - summary.correctCount);
  const { elapsedLabel, limitLabel, usedUp } = formatElapsedWithLimit(
    summary.elapsedSeconds,
    summary.durationMinutes,
  );

  return (
    <div className="mb-lg grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm">
        <span className="text-label-md text-on-surface-variant">Tổng số câu</span>
        <div className="mt-md">
          <span className="text-headline-lg font-semibold text-primary">{summary.totalQuestions}</span>
          <span className="ml-1 text-label-sm text-on-surface-variant">câu hỏi</span>
        </div>
      </div>

      <div className="flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-outline-variant/10 bg-secondary-container/30 p-md shadow-sm">
        <span className="text-label-md text-on-surface-variant">Số câu đúng</span>
        <div className="mt-md">
          <span className="text-headline-lg font-semibold text-secondary">{summary.correctCount}</span>
          <span className="ml-1 text-label-sm text-on-surface-variant">câu</span>
        </div>
      </div>

      <div className="flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-outline-variant/10 bg-error-container/40 p-md shadow-sm">
        <span className="text-label-md text-on-surface-variant">Số câu sai</span>
        <div className="mt-md">
          <span className="text-headline-lg font-semibold text-error">{wrongCount}</span>
          <span className="ml-1 text-label-sm text-on-surface-variant">câu</span>
        </div>
      </div>

      <div className="flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-outline-variant/10 bg-surface-container-high/40 p-md shadow-sm">
        <span className="text-label-md text-on-surface-variant">Thời gian đã làm</span>
        <div className="mt-md flex flex-col gap-1">
          <span className="text-headline-lg font-semibold tabular-nums text-primary">
            {elapsedLabel}
          </span>
          {limitLabel ? (
            <span className="text-label-sm text-on-surface-variant">
              Giới hạn {limitLabel}
              {usedUp ? " · đã hết giờ" : ""}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
