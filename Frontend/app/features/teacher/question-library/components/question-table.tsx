import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import { statusDisplayLabels } from "../constants/question-library.constants";
import type { Difficulty, QuestionItem, QuestionStatus } from "../types/question-library.types";

type QuestionTableProps = {
  questions: QuestionItem[];
  allSelected: boolean;
  isSelected: (id: string) => boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onDelete: (id: string) => void;
  footer?: ReactNode;
};

export function QuestionTable({
  questions,
  allSelected,
  isSelected,
  onToggleAll,
  onToggleOne,
  onDelete,
  footer,
}: QuestionTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="border-b border-outline-variant/10 bg-surface-container-lowest">
            <tr>
              <th className="w-12 px-6 py-4 text-center">
                <input
                  checked={allSelected && questions.length > 0}
                  className="rounded border-outline-variant/50 text-primary focus:ring-primary/20"
                  onChange={onToggleAll}
                  type="checkbox"
                />
              </th>
              <th className="w-16 px-6 py-4 text-center text-label-md font-medium text-on-surface-variant">
                ID
              </th>
              <th className="px-6 py-4 text-label-md font-medium text-on-surface-variant">
                Câu hỏi
              </th>
              <th className="px-6 py-4 text-label-md font-medium text-on-surface-variant">
                Môn / Chương
              </th>
              <th className="px-6 py-4 text-center text-label-md font-medium text-on-surface-variant">
                Độ khó
              </th>
              <th className="px-6 py-4 text-label-md font-medium text-on-surface-variant">
                Loại
              </th>
              <th className="px-6 py-4 text-label-md font-medium text-on-surface-variant">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-label-md font-medium text-on-surface-variant">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-body-md">
            {questions.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-12 text-center text-on-surface-variant"
                  colSpan={8}
                >
                  Không có câu hỏi phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <QuestionRow
                  isSelected={isSelected(question.id)}
                  key={question.id}
                  onDelete={() => onDelete(question.id)}
                  onToggle={() => onToggleOne(question.id)}
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
  onToggle,
  onDelete,
}: {
  question: QuestionItem;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="group transition-colors hover:bg-surface-container-low">
      <td className="px-6 py-5 text-center">
        <input
          checked={isSelected}
          className="rounded border-outline-variant/50 text-primary focus:ring-primary/20"
          onChange={onToggle}
          type="checkbox"
        />
      </td>
      <td className="px-6 py-5 text-center font-mono text-on-surface-variant/70">
        {question.id}
      </td>
      <td className="max-w-xs px-6 py-5 lg:max-w-md">
        <p className="line-clamp-1 font-medium text-primary-container">
          {question.title}
        </p>
        <p className="mt-1 text-label-sm text-on-surface-variant/60">
          Cập nhật bởi: {question.updatedBy}
        </p>
      </td>
      <td className="px-6 py-5">
        <p className="text-on-surface">{question.course}</p>
        <p className="text-label-sm text-on-surface-variant/70">
          {question.chapter}: {question.lesson}
        </p>
      </td>
      <td className="px-6 py-5 text-center">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="px-6 py-5 text-on-surface-variant">{question.type}</td>
      <td className="px-6 py-5">
        <StatusBadge status={question.status} />
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <RowIconButton ariaLabel="Xem" className="text-primary hover:bg-primary-fixed" icon="visibility" />
          <RowIconButton
            ariaLabel="Sửa"
            className="text-on-surface-variant hover:bg-surface-variant"
            icon="edit"
          />
          <RowIconButton
            ariaLabel="Xóa"
            className="text-error hover:bg-error-container"
            icon="delete"
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
      className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${styles[difficulty]}`}
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
          ? "inline-flex items-center gap-1 text-label-md font-medium text-secondary"
          : "inline-flex items-center gap-1 text-label-md font-medium text-on-surface-variant opacity-60"
      }
    >
      <span
        className={`h-2 w-2 rounded-full ${isPublished ? "bg-secondary" : "bg-on-surface-variant"}`}
      />
      {statusDisplayLabels[status]}
    </span>
  );
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
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`rounded-lg p-2 transition-colors ${className}`}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon>{icon}</MaterialIcon>
    </button>
  );
}
