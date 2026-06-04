import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import type { ExamDifficultySlice, ExamSummary } from "../../types/exam-summary.types";

const SLICE_STROKE_CLASSES = [
  "stroke-secondary-container",
  "stroke-secondary",
  "stroke-primary",
  "stroke-outline",
] as const;

const SLICE_DOT_CLASSES = [
  "bg-secondary-container",
  "bg-secondary",
  "bg-primary",
  "bg-outline",
] as const;

type ExamSummaryDifficultyPanelProps = {
  summary: ExamSummary;
};

function buildDoughnutSegments(slices: ExamDifficultySlice[]) {
  let offset = 0;
  return slices.map((slice, index) => {
    const segment = {
      sharePercent: slice.sharePercent,
      offset,
      strokeClass: SLICE_STROKE_CLASSES[index % SLICE_STROKE_CLASSES.length],
    };
    offset -= slice.sharePercent;
    return segment;
  });
}

function ResultFallback({ summary }: { summary: ExamSummary }) {
  const wrong = summary.totalQuestions - summary.correctCount;
  const correctPercent = summary.accuracyPercent;
  const wrongPercent = 100 - correctPercent;

  return (
    <div className="flex flex-col items-center gap-lg py-md md:flex-row">
      <div className="relative flex h-48 w-48 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle
            className="stroke-surface-container"
            cx="18"
            cy="18"
            fill="transparent"
            r="15.915"
            strokeWidth="3"
          />
          <circle
            className="stroke-secondary"
            cx="18"
            cy="18"
            fill="transparent"
            r="15.915"
            strokeDasharray={`${correctPercent} ${100 - correctPercent}`}
            strokeDashoffset="0"
            strokeWidth="3"
          />
          <circle
            className="stroke-error"
            cx="18"
            cy="18"
            fill="transparent"
            r="15.915"
            strokeDasharray={`${wrongPercent} ${100 - wrongPercent}`}
            strokeDashoffset={`-${correctPercent}`}
            strokeWidth="3"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-headline-md font-semibold text-primary">
            {summary.accuracyPercent}%
          </span>
          <span className="text-label-sm text-on-surface-variant">Đúng / Sai</span>
        </div>
      </div>
      <div className="w-full flex-1 space-y-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="h-3 w-3 rounded-full bg-secondary" />
            <span className="text-body-md">Đúng ({correctPercent}%)</span>
          </div>
          <span className="font-bold">{summary.correctCount} câu</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="h-3 w-3 rounded-full bg-error" />
            <span className="text-body-md">Sai ({wrongPercent}%)</span>
          </div>
          <span className="font-bold">{wrong} câu</span>
        </div>
        <p className="text-label-sm text-on-surface-variant">
          Câu hỏi chưa gắn độ khó trong ngân hàng đề — hiển thị tỷ lệ đúng/sai thay cho biểu đồ độ
          khó.
        </p>
      </div>
    </div>
  );
}

export function ExamSummaryDifficultyPanel({ summary }: ExamSummaryDifficultyPanelProps) {
  const slices = summary.difficultyBreakdown;
  const showChart = summary.hasDifficultyChart && slices.length > 0;
  const segments = showChart ? buildDoughnutSegments(slices) : [];

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-md shadow-sm lg:col-span-2">
      <div className="mb-lg flex items-center justify-between">
        <h2 className="text-headline-md font-semibold text-primary">
          {showChart ? "Kết quả theo độ khó" : "Kết quả làm bài"}
        </h2>
        <MaterialIcon className="text-on-surface-variant">analytics</MaterialIcon>
      </div>

      {showChart ? (
        <div className="flex flex-col items-center gap-lg py-md md:flex-row">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle
                className="stroke-surface-container"
                cx="18"
                cy="18"
                fill="transparent"
                r="15.915"
                strokeWidth="3"
              />
              {segments.map((segment) => (
                <circle
                  className={segment.strokeClass}
                  cx="18"
                  cy="18"
                  fill="transparent"
                  key={`${segment.strokeClass}-${segment.offset}`}
                  r="15.915"
                  strokeDasharray={`${segment.sharePercent} ${100 - segment.sharePercent}`}
                  strokeDashoffset={segment.offset}
                  strokeWidth="3"
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-headline-md font-semibold text-primary">
                {summary.difficultySummaryLabel}
              </span>
              <span className="text-label-sm text-on-surface-variant">Tổng thể</span>
            </div>
          </div>
          <div className="w-full flex-1 space-y-md">
            {slices.map((slice, index) => (
              <div className="flex items-center justify-between" key={slice.key}>
                <div className="flex items-center gap-sm">
                  <div
                    className={`h-3 w-3 rounded-full ${SLICE_DOT_CLASSES[index % SLICE_DOT_CLASSES.length]}`}
                  />
                  <span className="text-body-md">
                    {slice.label}: {slice.correctCount}/{slice.count} đúng ({slice.percent}%)
                  </span>
                </div>
                <span className="font-bold text-label-sm text-on-surface-variant">
                  {slice.sharePercent}% đề
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResultFallback summary={summary} />
      )}
    </div>
  );
}
