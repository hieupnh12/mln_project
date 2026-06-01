import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizListItem, QuizSettings } from "../types/quiz-management.types";
import { formatQuizScope } from "../utils/quiz-ui.helpers";
import { Metric } from "./quiz-metric";

type QuizManagementHeaderProps = {
  draftCount: number;
  publishedCount: number;
  total: number;
  onCreateQuiz: () => void;
};

export function QuizManagementHeader({
  draftCount,
  publishedCount,
  total,
  onCreateQuiz,
}: QuizManagementHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">Quản lý Quiz</h3>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Tạo, chỉnh sửa và xuất bản quiz trong một luồng liền mạch — không popup, load nhẹ
          theo từng bước.
        </p>
      </div>
      <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
        <div className="grid grid-cols-3 gap-sm rounded-2xl border border-outline-variant/20 bg-white p-sm text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <Metric label="Tổng quiz" value={total} />
          <Metric label="Bản nháp" value={draftCount} />
          <Metric label="Đã xuất bản" value={publishedCount} />
        </div>
        <button
          className="flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 active:scale-95"
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
