import type { MouseEvent } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";
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
    <section
      className={`overflow-hidden rounded-2xl border border-outline-variant/25 bg-landing-white ${TEACHER_PORTAL_ROW_SHADOW}`}
    >
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
          <thead className="border-b border-outline-variant/15 bg-landing-gray/35">
            <tr>
              <th className="px-3 py-4 text-center text-label-md font-medium text-landing-text-soft">
                ID
              </th>
              <th className="px-4 py-4 text-label-md font-medium text-landing-text-soft">
                Tên quiz
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-landing-text-soft md:table-cell">
                Môn học
              </th>
              <th className="px-3 py-4 text-center text-label-md font-medium text-landing-text-soft">
                Câu
              </th>
              <th className="hidden px-3 py-4 text-center text-label-md font-medium text-landing-text-soft sm:table-cell">
                Phút
              </th>
              <th className="hidden px-3 py-4 text-center text-label-md font-medium text-landing-text-soft lg:table-cell">
                Đạt
              </th>
              <th className="px-3 py-4 text-label-md font-medium text-landing-text-soft">
                Trạng thái
              </th>
              <th className="hidden px-3 py-4 text-label-md font-medium text-landing-text-soft lg:table-cell">
                Cập nhật
              </th>
              <th className="px-3 py-4 text-right text-label-md font-medium text-landing-text-soft">
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
                <td className="px-6 py-12 text-center text-landing-text-soft" colSpan={9}>
                  <MaterialIcon className="mx-auto mb-2 text-[32px] text-landing-text-soft/60">
                    quiz
                  </MaterialIcon>
                  <p>Không có quiz phù hợp với bộ lọc hiện tại.</p>
                  <button
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-landing-red px-4 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98]"
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
                  className="group cursor-pointer transition-colors hover:bg-landing-gray/40"
                  key={quiz.id}
                  onClick={() => onEdit(quiz.id)}
                >
                  <td className="px-3 py-4 text-center font-mono text-label-sm text-landing-text-soft">
                    {quiz.id}
                  </td>
                  <td className="px-4 py-4">
                    <p className="truncate font-medium text-landing-text group-hover:text-primary">
                      {quiz.title}
                    </p>
                    <p className="mt-1 truncate text-label-sm text-landing-text-soft md:hidden">
                      {quiz.course}
                    </p>
                    {quiz.attemptCount != null && quiz.attemptCount > 0 ? (
                      <p className="mt-1 text-label-sm text-catalog-cobalt">
                        {quiz.attemptCount} lượt làm
                      </p>
                    ) : null}
                  </td>
                  <td className="hidden px-3 py-4 md:table-cell">
                    <p className="truncate text-label-md text-landing-text" title={quiz.course}>
                      {quiz.course}
                    </p>
                    <p className="truncate text-label-sm text-landing-text-soft">
                      {quiz.chapter === "all" || !quiz.chapter ? "Tất cả chương" : quiz.chapter}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center font-semibold text-catalog-cobalt">
                    {quiz.questionCount}
                  </td>
                  <td className="hidden px-3 py-4 text-center text-landing-text-soft sm:table-cell">
                    {quiz.duration}
                  </td>
                  <td className="hidden px-3 py-4 text-center text-landing-text-soft lg:table-cell">
                    {quiz.passingScore}%
                  </td>
                  <td className="px-3 py-4">
                    <QuizStatusBadge status={quiz.status} />
                  </td>
                  <td className="hidden px-3 py-4 text-label-md text-landing-text-soft lg:table-cell">
                    {formatRelativeDate(quiz.updatedAt)}
                  </td>
                  <td className="px-3 py-4 text-right" onClick={stopRowClick}>
                    <div className="flex items-center justify-end gap-1">
                      <RowIconButton
                        ariaLabel="Chỉnh sửa"
                        icon="edit"
                        onClick={() => onEdit(quiz.id)}
                      />
                      <RowIconButton
                        ariaLabel="Nhân bản"
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
                          icon="pause_circle"
                          onClick={() => onClose(quiz.id)}
                        />
                      ) : null}
                      {quiz.status === "Đã tắt" ? (
                        <RowIconButton
                          ariaLabel="Bật lại"
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
        <div className="border-t border-outline-variant/15 bg-landing-gray/25 px-6 py-4">
          <p className="text-label-md text-landing-text-soft">
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
  className = "text-landing-text-soft hover:bg-landing-gray/70 hover:text-landing-text",
  icon,
  onClick,
}: {
  ariaLabel: string;
  className?: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`rounded-xl p-2 transition ${className}`}
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
            <div className="h-10 animate-pulse rounded-xl bg-landing-gray/60" />
          </td>
        </tr>
      ))}
    </>
  );
}
