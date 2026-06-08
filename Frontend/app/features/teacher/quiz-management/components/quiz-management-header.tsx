import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizListItem, QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizManagementHeaderProps = {
  onCreateQuiz: () => void;
};

export function QuizManagementHeader({ onCreateQuiz }: QuizManagementHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-headline-lg font-semibold text-primary-container">
          Quản lý Quiz
        </h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Tạo, cấu hình và xuất bản bài kiểm tra từ ngân hàng câu hỏi
        </p>
      </div>
      <button
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-label-md font-medium text-on-primary shadow-sm transition hover:opacity-90 active:scale-95"
        onClick={onCreateQuiz}
        type="button"
      >
        <MaterialIcon>add</MaterialIcon>
        Tạo quiz mới
      </button>
    </div>
  );
}

export function QuizEditorHeader({
  quiz,
  isNew,
  onBack,
  questionCount,
  settings,
}: {
  quiz: Pick<QuizListItem, "id" | "title" | "status" | "updatedAt"> | null;
  isNew: boolean;
  onBack: () => void;
  questionCount: number;
  settings: QuizSettings;
}) {
  const scope = formatQuizScope(settings.course, settings.chapter, settings.lesson);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          aria-label="Quay lại danh sách quiz"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant/30 bg-white text-secondary transition hover:bg-surface-container-low hover:text-primary"
          onClick={onBack}
          type="button"
        >
          <MaterialIcon>arrow_back</MaterialIcon>
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-headline-md font-semibold text-primary-container">
              {settings.title.trim() || quiz?.title || "Quiz mới"}
            </h2>
            {!isNew && quiz ? (
              <QuizStatusBadge status={quiz.status} />
            ) : (
              <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-sm font-medium text-on-surface-variant">
                Bản nháp
              </span>
            )}
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {!isNew && quiz ? `${quiz.id} · ` : null}
            {scope} · {questionCount} câu · {settings.duration} phút · Đạt ≥{settings.passingScore}%
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuizStatusBadge({ status }: { status: QuizListItem["status"] }) {
  const tone =
    status === "Đã xuất bản"
      ? "bg-secondary-container text-primary"
      : status === "Đã tắt"
        ? "bg-surface-container-high text-on-surface-variant"
        : "bg-primary-fixed/20 text-primary";

  const label =
    status === "Đã xuất bản"
      ? "Đã xuất bản"
      : status === "Đã tắt"
        ? "Đã tắt"
        : "Bản nháp";

  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-label-sm font-semibold ${tone}`}>
      {label}
    </span>
  );
}
