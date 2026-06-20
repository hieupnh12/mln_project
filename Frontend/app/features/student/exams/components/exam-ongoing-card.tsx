import { ArrowRight } from "lucide-react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { ExamCard } from "../types/exams.types";
import { formatExamDuration } from "../utils/format-exam-duration";
import { ExamStatusPill } from "./exam-status-pill";

type ExamOngoingCardProps = {
  exam: ExamCard;
  isRetake?: boolean;
  onStart: (examId: string) => void;
};

export function ExamOngoingCard({ exam, isRetake = false, onStart }: ExamOngoingCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-secondary/20 bg-landing-white p-md shadow-lg shadow-landing-text/5 transition hover:-translate-y-1 hover:border-secondary/35 hover:shadow-xl">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-secondary" />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ExamStatusPill label="Đang mở" variant="ongoing" />
            {isRetake ? <ExamStatusPill label="Làm lại" variant="failed" /> : null}
          </div>
          <h3 className="mt-4 text-headline-sm font-semibold leading-snug text-landing-text md:text-headline-md">
            {exam.title}
          </h3>
          {exam.chapter || exam.lesson !== "Tất cả bài" ? (
            <p className="mt-2 text-sm text-landing-text-soft">
              {[exam.chapter, exam.lesson !== "Tất cả bài" ? exam.lesson : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-landing-gold/15 text-landing-text-muted">
          <MaterialIcon>{exam.icon}</MaterialIcon>
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-outline-variant/25 sm:grid-cols-3">
        <p className="bg-landing-gray px-3 py-3 text-center text-label-md font-semibold text-landing-text-muted">
          {formatExamDuration(exam.durationMinutes)}
        </p>
        <p className="bg-landing-gray px-3 py-3 text-center text-label-md font-semibold text-landing-text-muted">
          {exam.questionCount} câu
        </p>
        <p className="col-span-2 bg-landing-gray px-3 py-3 text-center text-label-md font-semibold text-landing-text-muted sm:col-span-1">
          Đạt {exam.passingScore}%
        </p>
      </div>

      {exam.scheduleLabel ? (
        <p className="mb-4 border-t border-outline-variant/25 pt-4 text-label-sm text-landing-text-soft">
          Hạn: {exam.scheduleLabel}
        </p>
      ) : null}

      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-label-md font-semibold text-on-secondary shadow-sm shadow-secondary/15 transition hover:bg-tertiary-container active:scale-[0.99]"
        onClick={() => onStart(exam.id)}
        type="button"
      >
        {isRetake ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </article>
  );
}
