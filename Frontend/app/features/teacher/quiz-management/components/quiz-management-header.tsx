import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizListItem, QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";

type QuizManagementHeaderProps = {
  onCreateQuiz: () => void;
};

export function QuizManagementHeader({ onCreateQuiz }: QuizManagementHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-sm">
      <div className="min-w-0">
        <h3 className="text-headline-md font-semibold text-primary">Quản lý Quiz</h3>
        <p className="hidden text-label-sm text-on-surface-variant sm:block">
          Tạo, chỉnh sửa và xuất bản quiz — load nhẹ theo từng bước.
        </p>
      </div>
      <button
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary shadow-sm transition hover:opacity-90"
        onClick={onCreateQuiz}
        type="button"
      >
        <MaterialIcon className="text-[18px]">add</MaterialIcon>
        Tạo quiz mới
      </button>
    </header>
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
    <header className="space-y-sm border-b border-outline-variant/15 pb-md">
      <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-sm">
          <button
            aria-label="Quay lại danh sách"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant/25 bg-white text-secondary transition hover:bg-surface-container-low hover:text-primary"
            onClick={onBack}
            type="button"
          >
            <MaterialIcon>arrow_back</MaterialIcon>
          </button>
          <div className="min-w-0">
            <p className="font-mono text-label-sm text-on-surface-variant">
              {isNew ? "Quiz mới · chưa lưu" : quiz?.id}
            </p>
            <h3 className="truncate text-headline-md font-semibold text-primary">
              {settings.title.trim() || quiz?.title || "Soạn quiz mới"}
            </h3>
            <p className="mt-1 text-label-md text-on-surface-variant">{scope}</p>
          </div>
        </div>
        {!isNew && quiz ? (
          <QuizStatusBadge status={quiz.status} />
        ) : (
          <span className="inline-flex w-fit rounded-full bg-surface-container-high px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
            Đang soạn
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pl-11">
        <MetaChip icon="checklist" label={`${questionCount} câu`} />
        <MetaChip icon="timer" label={`${settings.duration} phút`} />
        <MetaChip icon="grade" label={`Đạt ${settings.passingScore}%`} />
        {!isNew && quiz?.updatedAt ? (
          <MetaChip icon="update" label={`Sửa ${quiz.updatedAt}`} />
        ) : null}
      </div>
    </header>
  );
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-label-sm text-on-surface-variant shadow-sm">
      <MaterialIcon className="text-[16px] text-secondary">{icon}</MaterialIcon>
      {label}
    </span>
  );
}

export function QuizStatusBadge({ status }: { status: QuizListItem["status"] }) {
  const published = status === "Đã xuất bản";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-label-sm font-semibold ${
        published
          ? "bg-secondary-container text-primary"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {status}
    </span>
  );
}
