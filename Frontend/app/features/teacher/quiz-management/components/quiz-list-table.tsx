import type { MouseEvent } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizListItem } from "../types/quiz-management.types";
import { formatRelativeDate } from "../utils/quiz-ui.helpers";
import { QuizStatusBadge } from "./quiz-management-header";

type QuizListTableProps = {
  items: QuizListItem[];
  onCreateQuiz: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
};

export function QuizListTable({
  items,
  onCreateQuiz,
  onEdit,
  onDuplicate,
}: QuizListTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-white p-xl text-center shadow-sm">
        <MaterialIcon className="mx-auto mb-3 text-[40px] text-on-surface-variant">
          quiz
        </MaterialIcon>
        <p className="text-headline-md font-semibold text-primary">Chưa có quiz phù hợp</p>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Thử đổi bộ lọc hoặc tạo quiz mới.
        </p>
        <button
          className="mt-md inline-flex items-center gap-2 rounded-lg bg-primary px-md py-sm font-semibold text-on-primary"
          onClick={onCreateQuiz}
          type="button"
        >
          <MaterialIcon>add</MaterialIcon>
          Tạo quiz mới
        </button>
      </div>
    );
  }

  return (
    <section className="flex min-h-[50vh] flex-col overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <header className="flex shrink-0 items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest px-sm py-2">
        <p className="text-label-sm font-medium text-on-surface-variant">
          Click hàng để mở editor
        </p>
        <span className="hidden text-label-sm text-on-surface-variant sm:inline">
          Cập nhật gần nhất
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[88px]" />
            <col />
            <col className="w-[140px] hidden md:table-column" />
            <col className="w-[56px]" />
            <col className="w-[56px] hidden sm:table-column" />
            <col className="w-[56px] hidden lg:table-column" />
            <col className="w-[120px]" />
            <col className="w-[100px] hidden lg:table-column" />
            <col className="w-[96px]" />
          </colgroup>
          <thead className="border-b border-outline-variant/10 bg-surface-container-lowest">
            <tr>
              <th className="px-3 py-3 text-label-md font-medium text-on-surface-variant">ID</th>
              <th className="px-4 py-3 text-label-md font-medium text-on-surface-variant">
                Tên quiz
              </th>
              <th className="hidden px-3 py-3 text-label-md font-medium text-on-surface-variant md:table-cell">
                Môn / Chương
              </th>
              <th className="px-3 py-3 text-center text-label-md font-medium text-on-surface-variant">
                Câu
              </th>
              <th className="hidden px-3 py-3 text-center text-label-md font-medium text-on-surface-variant sm:table-cell">
                Phút
              </th>
              <th className="hidden px-3 py-3 text-center text-label-md font-medium text-on-surface-variant lg:table-cell">
                Đạt
              </th>
              <th className="px-3 py-3 text-label-md font-medium text-on-surface-variant">
                Trạng thái
              </th>
              <th className="hidden px-3 py-3 text-label-md font-medium text-on-surface-variant lg:table-cell">
                Cập nhật
              </th>
              <th className="px-3 py-3 text-right text-label-md font-medium text-on-surface-variant">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-body-md">
            {items.map((quiz) => (
              <tr
                className="group cursor-pointer transition hover:bg-surface-container-low/80"
                key={quiz.id}
                onClick={() => onEdit(quiz.id)}
              >
                <td className="px-3 py-3 font-mono text-label-sm text-on-surface-variant">
                  {quiz.id}
                </td>
                <td className="px-4 py-3">
                  <p className="truncate font-medium text-primary group-hover:underline">
                    {quiz.title}
                  </p>
                  <p className="truncate text-label-md text-on-surface-variant md:hidden">
                    {quiz.course} · {quiz.chapter}
                  </p>
                  {quiz.attemptCount != null && quiz.attemptCount > 0 ? (
                    <p className="mt-0.5 text-label-sm text-secondary">
                      {quiz.attemptCount} lượt làm
                    </p>
                  ) : null}
                </td>
                <td className="hidden px-3 py-3 text-on-surface-variant md:table-cell">
                  <p className="truncate">{quiz.course}</p>
                  <p className="truncate text-label-md">{quiz.chapter}</p>
                </td>
                <td className="px-3 py-3 text-center font-semibold text-primary">
                  {quiz.questionCount}
                </td>
                <td className="hidden px-3 py-3 text-center text-on-surface-variant sm:table-cell">
                  {quiz.duration}
                </td>
                <td className="hidden px-3 py-3 text-center text-on-surface-variant lg:table-cell">
                  {quiz.passingScore}%
                </td>
                <td className="px-3 py-3">
                  <QuizStatusBadge status={quiz.status} />
                </td>
                <td className="hidden px-3 py-3 lg:table-cell">
                  <p className="text-label-md text-on-surface-variant">
                    {formatRelativeDate(quiz.updatedAt)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant/80">{quiz.updatedAt}</p>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-80 transition group-hover:opacity-100">
                    <IconButton
                      ariaLabel="Chỉnh sửa quiz"
                      icon="edit"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(quiz.id);
                      }}
                    />
                    <IconButton
                      ariaLabel="Nhân bản quiz"
                      icon="content_copy"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDuplicate(quiz.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function IconButton({
  ariaLabel,
  icon,
  onClick,
}: {
  ariaLabel: string;
  icon: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
      onClick={onClick}
      type="button"
    >
      <MaterialIcon>{icon}</MaterialIcon>
    </button>
  );
}
