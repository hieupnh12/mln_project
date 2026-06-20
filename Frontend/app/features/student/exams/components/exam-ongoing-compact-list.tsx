import type { ExamCard } from "../types/exams.types";
import { formatExamDuration } from "../utils/format-exam-duration";
import { ExamStatusPill } from "./exam-status-pill";

type ExamOngoingCompactRowProps = {
  exam: ExamCard;
  isRetake?: boolean;
  onStart: (examId: string) => void;
};

export function ExamOngoingCompactRow({ exam, isRetake = false, onStart }: ExamOngoingCompactRowProps) {
  const scopeLabel = [exam.chapter, exam.lesson !== "Tất cả bài" ? exam.lesson : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-outline-variant/25 bg-landing-white px-4 py-3 shadow-sm transition hover:border-secondary/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ExamStatusPill label="Đang mở" variant="ongoing" />
          {isRetake ? <ExamStatusPill label="Làm lại" variant="failed" /> : null}
        </div>
        <h3 className="mt-2 truncate text-body-md font-semibold text-landing-text md:text-headline-sm">
          {exam.title}
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm text-landing-text-soft">
          <span>{formatExamDuration(exam.durationMinutes)}</span>
          <span>{exam.questionCount} câu</span>
          <span>Đạt {exam.passingScore}%</span>
          {scopeLabel ? <span className="truncate">{scopeLabel}</span> : null}
          {exam.scheduleLabel ? <span>Hạn: {exam.scheduleLabel}</span> : null}
        </p>
      </div>

      <button
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-secondary px-4 py-2 text-label-md font-semibold text-on-secondary transition hover:bg-tertiary-container active:scale-[0.99]"
        onClick={() => onStart(exam.id)}
        type="button"
      >
        {isRetake ? "Làm lại" : "Làm bài"}
      </button>
    </article>
  );
}

type ExamOngoingCompactListProps = {
  exams: ExamCard[];
  retakeQuizIds: Set<string>;
  onStart: (examId: string) => void;
};

export function ExamOngoingCompactList({
  exams,
  retakeQuizIds,
  onStart,
}: ExamOngoingCompactListProps) {
  return (
    <div className="max-h-[min(420px,55vh)] space-y-2 overflow-y-auto pr-1">
      {exams.map((exam) => (
        <ExamOngoingCompactRow
          exam={exam}
          isRetake={retakeQuizIds.has(exam.id)}
          key={exam.id}
          onStart={onStart}
        />
      ))}
    </div>
  );
}
