import { MaterialIcon } from "../../../components/teacher-icons";
import { statusDisplayLabels } from "../../constants/question-library.constants";
import type { CreateQuestionPayload } from "../../types/question-library-api.types";
import type { QuestionItem } from "../../types/question-library.types";
import { ModalOverlay } from "./modal-overlay";

type DuplicateCompareModalProps = {
  open: boolean;
  existingQuestion: QuestionItem | null;
  pendingPayload: CreateQuestionPayload | null;
  isExact: boolean;
  warningMessage?: string;
  saving?: boolean;
  onClose: () => void;
  onConfirmSave: () => void;
};

export function DuplicateCompareModal({
  open,
  existingQuestion,
  pendingPayload,
  isExact,
  warningMessage,
  saving = false,
  onClose,
  onConfirmSave,
}: DuplicateCompareModalProps) {
  if (!existingQuestion || !pendingPayload) {
    return null;
  }

  const newOptions = pendingPayload.options?.map((option) => option.content) ?? [];

  return (
    <ModalOverlay labelledBy="duplicate-compare-title" onClose={onClose} open={open}>
      <div className="mx-auto flex max-h-[min(860px,calc(100vh-32px))] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <header className="border-b border-outline-variant/10 px-md py-4 lg:px-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface" id="duplicate-compare-title">
                {isExact ? "Câu hỏi trùng hoàn toàn" : "Phát hiện câu hỏi tương tự"}
              </h2>
              <p className="mt-1 text-body-md text-on-surface-variant">
                {warningMessage ??
                  (isExact
                    ? "Câu hỏi mới trùng với câu hỏi đã có trong ngân hàng."
                    : "So sánh nội dung trước khi quyết định thêm vào ngân hàng.")}
              </p>
            </div>
            <button
              aria-label="Đóng"
              className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high"
              onClick={onClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>
        </header>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-md lg:p-lg">
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
            <ComparePanel
              badge="Câu hỏi hiện có"
              badgeClassName="bg-surface-container-high text-on-surface-variant"
              content={existingQuestion.question}
              difficulty={existingQuestion.difficulty}
              id={existingQuestion.id}
              options={existingQuestion.options}
              status={statusDisplayLabels[existingQuestion.status]}
              type={existingQuestion.type}
            />
            <ComparePanel
              badge="Câu hỏi mới"
              badgeClassName="bg-secondary-container text-on-secondary-fixed-variant"
              content={pendingPayload.question}
              difficulty={pendingPayload.difficulty}
              id="Mới"
              options={newOptions}
              status={pendingPayload.status}
              type={pendingPayload.type}
            />
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 bg-surface-container-low px-md py-4 sm:flex-row sm:justify-end lg:px-lg">
          <button
            className="rounded-lg px-6 py-2.5 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            {isExact ? "Đóng" : "Hủy bỏ"}
          </button>
          {!isExact && (
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-label-md font-medium text-on-primary transition hover:opacity-90 disabled:opacity-50"
              disabled={saving}
              onClick={onConfirmSave}
              type="button"
            >
              <MaterialIcon>add</MaterialIcon>
              Vẫn thêm câu hỏi
            </button>
          )}
        </footer>
      </div>
    </ModalOverlay>
  );
}

function ComparePanel({
  badge,
  badgeClassName,
  id,
  content,
  type,
  difficulty,
  status,
  options,
}: {
  badge: string;
  badgeClassName: string;
  id: string;
  content: string;
  type: string;
  difficulty: string;
  status: string;
  options: string[];
}) {
  return (
    <article className="flex flex-col rounded-lg border border-outline-variant/20 bg-white">
      <div className="border-b border-outline-variant/10 px-4 py-3">
        <span className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${badgeClassName}`}>
          {badge}
        </span>
        <p className="mt-2 font-mono text-label-sm text-on-surface-variant">{id}</p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="whitespace-pre-wrap text-body-md text-on-surface">{content}</p>
        <div className="grid grid-cols-2 gap-2 text-label-sm">
          <MetaChip label="Loại" value={type} />
          <MetaChip label="Độ khó" value={difficulty} />
          <MetaChip label="Trạng thái" value={status} />
        </div>
        {options.length > 0 && (
          <div>
            <p className="mb-2 text-label-sm font-medium text-on-surface-variant">Lựa chọn</p>
            <ul className="space-y-1.5">
              {options.map((option, index) => (
                <li
                  className="rounded-md bg-surface-container-low px-3 py-1.5 text-label-md text-on-surface"
                  key={`${id}-compare-${index}`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-container-low px-2 py-1.5">
      <span className="text-on-surface-variant/70">{label}: </span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  );
}
