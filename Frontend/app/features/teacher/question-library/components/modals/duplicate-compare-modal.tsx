import { MaterialIcon } from "../../../components/teacher-icons";
import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
  TEACHER_MODAL_SHELL,
} from "../../../constants/teacher-ui.constants";
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
      <div
        className={`mx-auto flex max-h-[min(860px,calc(100vh-32px))] w-full max-w-5xl flex-col ${TEACHER_MODAL_SHELL}`}
      >
        <header className="border-b border-outline-variant/25 px-md py-4 lg:px-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-headline-md font-semibold text-landing-text"
                id="duplicate-compare-title"
              >
                {isExact ? "Câu hỏi trùng hoàn toàn" : "Phát hiện câu hỏi tương tự"}
              </h2>
              <p className="mt-1 text-body-md text-landing-text-soft">
                {warningMessage ??
                  (isExact
                    ? "Câu hỏi mới trùng với câu hỏi đã có trong ngân hàng."
                    : "So sánh nội dung trước khi quyết định thêm vào ngân hàng.")}
              </p>
            </div>
            <button
              aria-label="Đóng"
              className="rounded-xl p-2 text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
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
              badgeClassName="bg-landing-gray text-landing-text-soft"
              content={existingQuestion.question}
              difficulty={existingQuestion.difficulty}
              id={existingQuestion.id}
              options={existingQuestion.options}
              status={statusDisplayLabels[existingQuestion.status]}
              type={existingQuestion.type}
            />
            <ComparePanel
              badge="Câu hỏi mới"
              badgeClassName="bg-catalog-cyan/12 text-catalog-cobalt"
              content={pendingPayload.question}
              difficulty={pendingPayload.difficulty}
              id="Mới"
              options={newOptions}
              status={pendingPayload.status}
              type={pendingPayload.type}
            />
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-outline-variant/25 bg-landing-gray/25 px-md py-4 sm:flex-row sm:justify-end lg:px-lg">
          <button
            className="rounded-xl px-6 py-2.5 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
            onClick={onClose}
            type="button"
          >
            {isExact ? "Đóng" : "Hủy bỏ"}
          </button>
          {!isExact && (
            <button
              className={`${TEACHER_MODAL_BTN_PRIMARY} disabled:opacity-50`}
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
    <article className="flex flex-col rounded-2xl border border-outline-variant/25 bg-landing-white">
      <div className="border-b border-outline-variant/15 px-4 py-3">
        <span className={`inline-block rounded-full px-3 py-1 text-label-sm font-semibold ${badgeClassName}`}>
          {badge}
        </span>
        <p className="mt-2 font-mono text-label-sm text-landing-text-soft">{id}</p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="whitespace-pre-wrap text-body-md text-landing-text">{content}</p>
        <div className="grid grid-cols-2 gap-2 text-label-sm">
          <MetaChip label="Loại" value={type} />
          <MetaChip label="Độ khó" value={difficulty} />
          <MetaChip label="Trạng thái" value={status} />
        </div>
        {options.length > 0 && (
          <div>
            <p className="mb-2 text-label-sm font-medium text-landing-text-soft">Lựa chọn</p>
            <ul className="space-y-1.5">
              {options.map((option, index) => (
                <li
                  className="rounded-xl bg-landing-gray/35 px-3 py-1.5 text-label-md text-landing-text"
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
    <div className="rounded-xl bg-landing-gray/35 px-2 py-1.5">
      <span className="text-landing-text-soft">{label}: </span>
      <span className="font-medium text-landing-text">{value}</span>
    </div>
  );
}
