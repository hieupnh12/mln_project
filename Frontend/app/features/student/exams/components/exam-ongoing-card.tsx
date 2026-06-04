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
    <article className="group rounded-lg border border-outline-variant/10 border-l-4 border-l-secondary bg-white/80 p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ExamStatusPill label="Đang mở" variant="ongoing" />
            {isRetake ? <ExamStatusPill label="Làm lại" variant="failed" /> : null}
          </div>
          <h3 className="mt-3 text-headline-md font-semibold text-primary transition-colors group-hover:text-secondary">
            {exam.title}
          </h3>
          {exam.chapter || exam.lesson !== "Tất cả bài" ? (
            <p className="mt-2 text-body-sm text-on-surface-variant">
              {[exam.chapter, exam.lesson !== "Tất cả bài" ? exam.lesson : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 rounded-lg bg-surface-container-low p-3">
          <MaterialIcon className="text-secondary">{exam.icon}</MaterialIcon>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MaterialIcon className="text-body-md">schedule</MaterialIcon>
          <span className="text-label-md">{formatExamDuration(exam.durationMinutes)}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MaterialIcon className="text-body-md">description</MaterialIcon>
          <span className="text-label-md">{exam.questionCount} câu</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-on-surface-variant sm:col-span-1">
          <MaterialIcon className="text-body-md">verified</MaterialIcon>
          <span className="text-label-md">Đạt {exam.passingScore}%</span>
        </div>
      </div>

      {exam.scheduleLabel ? (
        <p className="mb-4 text-label-sm text-on-surface-variant">
          Hạn: {exam.scheduleLabel}
        </p>
      ) : null}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-label-md font-medium text-on-primary transition-all hover:bg-primary-container active:scale-[0.98]"
        onClick={() => onStart(exam.id)}
        type="button"
      >
        {isRetake ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}
        <MaterialIcon>arrow_forward</MaterialIcon>
      </button>
    </article>
  );
}
