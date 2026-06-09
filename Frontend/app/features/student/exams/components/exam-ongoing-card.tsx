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
    <article className="group rounded-xl border border-landing-red/15 bg-landing-white p-md shadow-lg shadow-landing-red/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ExamStatusPill label="Đang mở" variant="ongoing" />
            {isRetake ? <ExamStatusPill label="Làm lại" variant="failed" /> : null}
          </div>
          <h3 className="mt-4 text-headline-md font-semibold text-landing-text">
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
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red">
          <MaterialIcon>{exam.icon}</MaterialIcon>
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <p className="text-label-md text-landing-text-soft">
          {formatExamDuration(exam.durationMinutes)}
        </p>
        <p className="text-label-md text-landing-text-soft">{exam.questionCount} câu</p>
        <p className="col-span-2 text-label-md text-landing-text-soft sm:col-span-1">
          Đạt {exam.passingScore}%
        </p>
      </div>

      {exam.scheduleLabel ? (
        <p className="mb-4 text-label-sm text-landing-text-soft">
          Hạn: {exam.scheduleLabel}
        </p>
      ) : null}

      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-landing-red to-landing-red-dark px-4 py-3 text-label-md font-semibold text-on-primary transition hover:-translate-y-0.5 active:translate-y-0"
        onClick={() => onStart(exam.id)}
        type="button"
      >
        {isRetake ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </article>
  );
}
