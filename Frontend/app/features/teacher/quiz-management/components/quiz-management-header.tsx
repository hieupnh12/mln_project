import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_QUIZ_STATUS_BADGE } from "../../constants/teacher-ui.constants";
import type { QuizListItem, QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizManagementHeaderProps = {
  onCreateQuiz: () => void;
  onImportExam: () => void;
};

export function QuizManagementHeader({ onCreateQuiz, onImportExam }: QuizManagementHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-landing-text">Quản lý Quiz</h1>
        <p className="mt-1 text-body-md text-landing-text-soft">
          Tạo thủ công, import đề từ Excel, hoặc xuất bản bài kiểm tra.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-5 py-2.5 text-label-md font-semibold text-landing-text transition hover:bg-landing-gray/60 active:scale-[0.98]"
          onClick={onImportExam}
          type="button"
        >
          <MaterialIcon>upload_file</MaterialIcon>
          Import đề từ Excel
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98]"
          onClick={onCreateQuiz}
          type="button"
        >
          <MaterialIcon>add</MaterialIcon>
          Tạo quiz mới
        </button>
      </div>
    </header>
  );
}

export function QuizEditorHeader({
  isNew,
  onBack,
  questionCount,
  quiz,
  settings,
}: {
  isNew: boolean;
  onBack: () => void;
  questionCount: number;
  quiz: Pick<QuizListItem, "id" | "status" | "title" | "updatedAt"> | null;
  settings: QuizSettings;
}) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);

  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          aria-label="Quay lại danh sách quiz"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-gray/50 text-landing-text transition hover:bg-landing-gray"
          onClick={onBack}
          type="button"
        >
          <MaterialIcon>arrow_back</MaterialIcon>
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-headline-md font-semibold text-landing-text">
              {settings.title.trim() || quiz?.title || "Quiz mới"}
            </h2>
            {!isNew && quiz ? (
              <QuizStatusBadge status={quiz.status} />
            ) : (
              <span className="rounded-full bg-landing-gray px-2.5 py-0.5 text-label-sm font-medium text-landing-text-soft">
                Bản nháp
              </span>
            )}
          </div>
          <p className="mt-1 text-body-md text-landing-text-soft">
            {!isNew && quiz ? `${quiz.id} · ` : null}
            {scope} · {questionCount} câu · {settings.duration} phút · Đạt ≥{settings.passingScore}%
          </p>
        </div>
      </div>
    </header>
  );
}

export function QuizStatusBadge({ status }: { status: QuizListItem["status"] }) {
  const label =
    status === "Đã xuất bản" ? "Đã xuất bản" : status === "Đã tắt" ? "Đã tắt" : "Bản nháp";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-label-sm font-semibold ${TEACHER_QUIZ_STATUS_BADGE[status]}`}
    >
      {label}
    </span>
  );
}
