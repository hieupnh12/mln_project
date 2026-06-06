import type { MouseEvent, ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import { statusDisplayLabels } from "../constants/question-library.constants";
import type { Difficulty, QuestionListItem, QuestionStatus } from "../types/question-library.types";
import { truncateText } from "../utils/truncate-text";
import { QuestionTableSkeleton } from "./question-table-skeleton";

type QuestionTableProps = {
  questions: QuestionListItem[];
  allSelected: boolean;
  isInitialLoading?: boolean;
  isPageLoading?: boolean;
  deletingQuestionId?: string | null;
  isSelected: (id: string) => boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewDetail: (id: string) => void;
  footer?: ReactNode;
};

export function QuestionTable({
  questions,
  allSelected,
  isInitialLoading = false,
  isPageLoading = false,
  deletingQuestionId = null,
  isSelected,
  onToggleAll,
  onToggleOne,
  onDelete,
  onEdit,
  onViewDetail,
  footer,
}: QuestionTableProps) {
  const showSkeleton = isInitialLoading || isPageLoading;
  const showEmpty = !showSkeleton && questions.length === 0;

  return (
    <section className="overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <div className="relative overflow-x-auto">
        {isPageLoading && !isInitialLoading ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        ) : null}
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-12" />
            <col className="w-[72px]" />
            <col />
            <col className="w-[120px] hidden md:table-column" />
            <col className="w-[96px]" />
            <col className="w-[108px] hidden sm:table-column" />
            <col className="w-[108px]" />
            <col className="w-[112px]" />
          </colgroup>
          <thead className="border-b border-outline-variant/10 bg-surface-container-lowest">
            <tr>
              <th className="px-4 py-4 text-center">
                <input
                  checked={allSelected && questions.length > 0 && !showSkeleton}
                  className="rounded border-outline-variant/50 text-primary focus:ring-primary/20"
                  disabled={showSkeleton || questions.length === 0}
                  onChange={onToggleAll}
                  type="checkbox"
                />
              </th>
              <th className="px-3 py-4 text-center text-label-md font-medium text-on-surface-variant">
                ID
              </th>
              <th className="px-4 py-4 text-label-md font-medium text-on-surface-variant">
                Nội dung
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-on-surface-variant md:table-cell">
                Môn học
              </th>
              <th className="px-3 py-4 text-center text-label-md font-medium text-on-surface-variant">
                Độ khó
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-on-surface-variant sm:table-cell">
                Loại
              </th>
              <th className="px-3 py-4 text-label-md font-medium text-on-surface-variant">
                Trạng thái
              </th>
              <th className="px-3 py-4 text-right text-label-md font-medium text-on-surface-variant">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody
            aria-busy={showSkeleton}
            className={`divide-y divide-outline-variant/10 text-body-md ${showSkeleton ? "opacity-70" : ""}`}
          >
            {showSkeleton ? (
              <QuestionTableSkeleton />
            ) : showEmpty ? (
              <tr>
                <td className="px-6 py-12 text-center text-on-surface-variant" colSpan={8}>
                  Không có câu hỏi phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <QuestionRow
                  isSelected={isSelected(question.id)}
                  isDeleting={deletingQuestionId === question.id}
                  key={question.id}
                  onDelete={() => onDelete(question.id)}
                  onEdit={() => onEdit(question.id)}
                  onToggle={() => onToggleOne(question.id)}
                  onViewDetail={() => onViewDetail(question.id)}
                  question={question}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </section>
  );
}

function QuestionRow({
  question,
  isSelected,
  isDeleting,
  onToggle,
  onDelete,
  onEdit,
  onViewDetail,
}: {
  question: QuestionListItem;
  isSelected: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onViewDetail: () => void;
}) {
  const canEdit = question.status !== "Đã xuất bản";

  function handleRowClick() {
    onViewDetail();
  }

  function stopRowClick(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <tr
      className="group cursor-pointer transition-colors hover:bg-surface-container-low"
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onViewDetail();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <td className="px-4 py-4 text-center" onClick={stopRowClick}>
        <input
          checked={isSelected}
          className="rounded border-outline-variant/50 text-primary focus:ring-primary/20"
          onChange={onToggle}
          type="checkbox"
        />
      </td>
      <td className="px-3 py-4 text-center font-mono text-label-sm text-on-surface-variant/80">
        {question.id.replace("Q-", "")}
      </td>
      <td className="px-4 py-4">
        <p className="line-clamp-2 text-body-md font-medium text-on-surface" title={question.question}>
          {truncateText(question.question, 120)}
        </p>
        <p className="mt-1 line-clamp-1 text-label-sm text-on-surface-variant/60 md:hidden">
          {truncateText(question.course, 28)}
        </p>
      </td>
      <td className="hidden px-3 py-4 md:table-cell">
        <p className="truncate text-label-md text-on-surface" title={question.course}>
          {truncateText(question.course, 24)}
        </p>
      </td>
      <td className="px-3 py-4 text-center">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="hidden px-3 py-4 sm:table-cell">
        <p className="truncate text-label-md text-on-surface-variant" title={question.type}>
          {question.type}
        </p>
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={question.status} />
      </td>
      <td className="px-3 py-4 text-right" onClick={stopRowClick}>
        <div className="flex justify-end gap-1">
          <RowIconButton
            ariaLabel="Xem chi tiết"
            className="text-primary hover:bg-primary-fixed"
            icon="visibility"
            onClick={onViewDetail}
          />
          {canEdit ? (
            <RowIconButton
              ariaLabel="Chỉnh sửa"
              className="text-secondary hover:bg-secondary-container/40"
              icon="edit"
              onClick={onEdit}
            />
          ) : (
            <RowIconButton
              ariaLabel="Câu hỏi đã duyệt, không thể chỉnh sửa"
              className="cursor-not-allowed text-on-surface-variant/30"
              disabled
              icon="edit_off"
            />
          )}
          <RowIconButton
            ariaLabel={isDeleting ? "Đang xóa" : "Xóa"}
            className="text-error hover:bg-error-container"
            disabled={isDeleting}
            icon={isDeleting ? "sync" : "delete"}
            onClick={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    "Cơ bản": "bg-secondary-container text-on-secondary-fixed-variant",
    "Vận dụng": "bg-secondary-fixed text-on-secondary-container",
    "Nâng cao": "bg-surface-container-high text-on-secondary-fixed-variant",
  };

  return (
    <span
      className={`inline-block max-w-full truncate rounded-full px-2.5 py-1 text-label-sm font-semibold ${styles[difficulty]}`}
      title={difficulty}
    >
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: QuestionStatus }) {
  const isPublished = status === "Đã xuất bản";

  return (
    <span
      className={
        isPublished
          ? "inline-flex max-w-full items-center gap-1 truncate text-label-sm font-medium text-secondary"
          : "inline-flex max-w-full items-center gap-1 truncate text-label-sm font-medium text-on-surface-variant opacity-70"
      }
      title={statusDisplayLabels[status]}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${isPublished ? "bg-secondary" : "bg-on-surface-variant"}`}
      />
      <span className="truncate">{statusDisplayLabels[status]}</span>
    </span>
  );
}

function RowIconButton({
  ariaLabel,
  className,
  disabled = false,
  icon,
  onClick,
}: {
  ariaLabel: string;
  className: string;
  disabled?: boolean;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`rounded-lg p-1.5 transition-colors ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className="text-[20px]">{icon}</MaterialIcon>
    </button>
  );
}
