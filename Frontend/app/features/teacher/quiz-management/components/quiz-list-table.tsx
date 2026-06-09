import type { MouseEvent } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizListItem } from "../types/quiz-management.types";
import { formatRelativeDate } from "../utils/quiz-ui.helpers";
import { QuizStatusBadge } from "./quiz-management-header";

type QuizListTableProps = {
  items: QuizListItem[];
  isLoading?: boolean;
  onClose: (id: string) => void;
  onCreateQuiz: () => void;
  onDelete: (id: string) => void;
  onReopen: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  totalCount: number;
};

export function QuizListTable({
  items,
  isLoading = false,
  onClose,
  onCreateQuiz,
  onDelete,
  onEdit,
  onDuplicate,
  onReopen,
  totalCount,
}: QuizListTableProps) {
  const showEmpty = !isLoading && items.length === 0;

  return (
    <section className="overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <div className="relative overflow-x-auto">
        {isLoading ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        ) : null}
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[88px]" />
            <col />
            <col className="w-[140px] hidden md:table-column" />
            <col className="w-[72px]" />
            <col className="w-[72px] hidden sm:table-column" />
            <col className="w-[72px] hidden lg:table-column" />
            <col className="w-[120px]" />
            <col className="w-[108px] hidden lg:table-column" />
            <col className="w-[112px]" />
          </colgroup>
          <thead className="border-b border-outline-variant/10 bg-surface-container-lowest">
            <tr>
              <th className="px-3 py-4 text-center text-label-md font-medium text-on-surface-variant">
                ID
              </th>
              <th className="px-4 py-4 text-label-md font-medium text-on-surface-variant">
                Tên quiz
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-on-surface-variant md:table-cell">
                Môn học
              </th>
              <th className="px-3 py-4 text-center text-label-md font-medium text-on-surface-variant">
                Câu
              </th>
              <th className="hidden px-3 py-4 text-center text-label-md font-medium text-on-surface-variant sm:table-cell">
                Phút
              </th>
              <th className="hidden px-3 py-4 text-center text-label-md font-medium text-on-surface-variant lg:table-cell">
                Đạt
              </th>
              <th className="px-3 py-4 text-label-md font-medium text-on-surface-variant">
                Trạng thái
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-on-surface-variant lg:table-cell">
                Cập nhật
              </th>
              <th className="px-3 py-4 text-right text-label-md font-medium text-on-surface-variant">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody
            aria-busy={isLoading}
            className={`divide-y divide-outline-variant/10 text-body-md ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <QuizTableSkeleton />
            ) : showEmpty ? (
              <tr>
                <td className="px-6 py-12 text-center text-on-surface-variant" colSpan={9}>
                  <MaterialIcon className="mx-auto mb-2 text-[32px] text-on-surface-variant/60">
                    quiz
                  </MaterialIcon>
                  <p>Không có quiz phù hợp với bộ lọc hiện tại.</p>
                  <button
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-on-primary transition hover:opacity-90"
                    onClick={onCreateQuiz}
                    type="button"
                  >
                    <MaterialIcon>add</MaterialIcon>
                    Tạo quiz mới
                  </button>
                </td>
              </tr>
            ) : (
              items.map((quiz) => (
                <tr
                  className="group cursor-pointer transition-colors hover:bg-surface-container-low"
                  key={quiz.id}
                  onClick={() => onEdit(quiz.id)}
                >
                  <td className="px-3 py-4 text-center font-mono text-label-sm text-on-surface-variant/80">
                    {quiz.id}
                  </td>
                  <td className="px-4 py-4">
                    <p className="truncate font-medium text-on-surface group-hover:text-primary">
                      {quiz.title}
                    </p>
                    <p className="mt-1 truncate text-label-sm text-on-surface-variant/60 md:hidden">
                      {quiz.course}
                    </p>
                    {quiz.attemptCount != null && quiz.attemptCount > 0 ? (
                      <p className="mt-1 text-label-sm text-secondary">{quiz.attemptCount} lượt làm</p>
                    ) : null}
                  </td>
                  <td className="hidden px-3 py-4 md:table-cell">
                    <p className="truncate text-label-md text-on-surface" title={quiz.course}>
                      {quiz.course}
                    </p>
                    <p className="truncate text-label-sm text-on-surface-variant">
                      {quiz.chapter === "all" || !quiz.chapter ? "Tất cả chương" : quiz.chapter}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center font-semibold text-primary">
                    {quiz.questionCount}
                  </td>
                  <td className="hidden px-3 py-4 text-center text-on-surface-variant sm:table-cell">
                    {quiz.duration}
                  </td>
                  <td className="hidden px-3 py-4 text-center text-on-surface-variant lg:table-cell">
                    {quiz.passingScore}%
                  </td>
                  <td className="px-3 py-4">
                    <QuizStatusBadge status={quiz.status} />
                  </td>
                  <td className="hidden px-3 py-4 text-label-md text-on-surface-variant lg:table-cell">
                    {formatRelativeDate(quiz.updatedAt)}
                  </td>
                  <td className="px-3 py-4 text-right" onClick={stopRowClick}>
                    <div className="flex items-center justify-end gap-1">
                      <RowIconButton
                        ariaLabel="Chỉnh sửa"
                        className="text-secondary hover:bg-secondary-container/40"
                        icon="edit"
                        onClick={() => onEdit(quiz.id)}
                      />
                      <RowIconButton
                        ariaLabel="Nhân bản"
                        className="text-on-surface-variant hover:bg-surface-container-high"
                        icon="content_copy"
                        onClick={() => onDuplicate(quiz.id)}
                      />
                      {quiz.status === "Bản nháp" ? (
                        <RowIconButton
                          ariaLabel="Xóa"
                          className="text-error hover:bg-error-container/20"
                          icon="delete"
                          onClick={() => onDelete(quiz.id)}
                        />
                      ) : null}
                      {quiz.status === "Đã xuất bản" ? (
                        <RowIconButton
                          ariaLabel="Tắt quiz"
                          className="text-on-surface-variant hover:bg-surface-container-high"
                          icon="pause_circle"
                          onClick={() => onClose(quiz.id)}
                        />
                      ) : null}
                      {quiz.status === "Đã tắt" ? (
                        <RowIconButton
                          ariaLabel="Bật lại"
                          className="text-secondary hover:bg-secondary-container/40"
                          icon="play_circle"
                          onClick={() => onReopen(quiz.id)}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && items.length > 0 ? (
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-4">
          <p className="text-label-md text-on-surface-variant">
            Hiển thị {items.length.toLocaleString("vi-VN")} trong số{" "}
            {totalCount.toLocaleString("vi-VN")} quiz
          </p>
        </div>
      ) : null}
    </section>
  );
}

function stopRowClick(event: MouseEvent) {
  event.stopPropagation();
}

function RowIconButton({
  ariaLabel,
  className,
  icon,
  onClick,
}: {
  ariaLabel: string;
  className: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`rounded-lg p-2 transition ${className}`}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className="text-md">{icon}</MaterialIcon>
    </button>
  );
}

function QuizTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <tr key={index}>
          <td className="px-3 py-4" colSpan={9}>
            <div className="h-10 animate-pulse rounded-lg bg-surface-container-low" />
          </td>
        </tr>
      ))}
    </>
  );
}
