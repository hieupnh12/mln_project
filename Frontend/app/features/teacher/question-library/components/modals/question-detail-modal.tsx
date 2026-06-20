import type { ReactNode } from "react";

import { MaterialIcon } from "../../../components/teacher-icons";
import { statusDisplayLabels } from "../../constants/question-library.constants";
import type { QuestionItem } from "../../types/question-library.types";
import { resolveQuestionCorrectIndices } from "../../utils/resolve-correct-option-indices";
import { TEACHER_MODAL_BTN_PRIMARY, TEACHER_MODAL_BTN_SECONDARY, TEACHER_MODAL_SHELL } from "../../../constants/teacher-ui.constants";
import { QuestionLibraryLoadingState } from "../question-library-loading-state";
import { ModalOverlay } from "./modal-overlay";

type QuestionDetailModalProps = {
  open: boolean;
  questionId: string | null;
  question: QuestionItem | null;
  isLoading: boolean;
  isError: boolean;
  approving: boolean;
  onApprove: (id: string) => void;
  onEdit: (question: QuestionItem) => void;
  onRetry: () => void;
  onClose: () => void;
};

export function QuestionDetailModal({
  open,
  questionId,
  question,
  isLoading,
  isError,
  approving,
  onApprove,
  onEdit,
  onRetry,
  onClose,
}: QuestionDetailModalProps) {
  if (!open) {
    return null;
  }

  if (isLoading) {
    return (
      <QuestionDetailStateModal
        loading
        message="Đang tải chi tiết câu hỏi..."
        onClose={onClose}
        questionId={questionId}
      />
    );
  }

  if (isError) {
    return (
      <QuestionDetailStateModal
        actionLabel="Thử lại"
        message="Không thể tải chi tiết câu hỏi."
        onAction={onRetry}
        onClose={onClose}
        questionId={questionId}
      />
    );
  }

  if (!question) {
    return (
      <QuestionDetailStateModal
        message="Không tìm thấy chi tiết câu hỏi."
        onClose={onClose}
        questionId={questionId}
      />
    );
  }

  const correctIndices = resolveQuestionCorrectIndices(question);
  const isPublished = question.status === "Đã xuất bản";

  return (
    <ModalOverlay labelledBy="question-detail-title" onClose={onClose} open={open}>
      <div className={`mx-auto flex max-h-[min(800px,calc(100vh-32px))] w-full max-w-3xl flex-col ${TEACHER_MODAL_SHELL}`}>
        <header className="flex items-start justify-between gap-4 border-b border-outline-variant/25 px-md py-4 lg:px-lg">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-label-sm text-landing-text-soft">{question.id}</p>
            <h2 className="mt-1 text-headline-md font-semibold text-landing-text" id="question-detail-title">
              Chi tiết câu hỏi
            </h2>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-xl p-2 text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>

        <div className="custom-scrollbar flex-1 space-y-md overflow-y-auto p-md lg:p-lg">
          <DetailSection label="Nội dung câu hỏi">
            <p className="whitespace-pre-wrap text-body-md text-landing-text">{question.question}</p>
          </DetailSection>

          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <DetailMeta label="Môn học" value={question.course} />
            <DetailMeta label="Chương / Bài" value={`${question.chapter} · ${question.lesson}`} />
            <DetailMeta label="Loại" value={question.type} />
            <DetailMeta label="Độ khó" value={question.difficulty} />
            <DetailMeta label="Trạng thái" value={statusDisplayLabels[question.status]} />
            <DetailMeta label="Điểm" value={String(question.score)} />
            <DetailMeta label="Thời gian ước tính" value={`${question.estimatedTime}s`} />
            <DetailMeta label="Cập nhật bởi" value={question.updatedBy} />
          </div>

          {question.explanation ? (
            <DetailSection label="Giải thích">
              <p className="whitespace-pre-wrap text-body-md text-landing-text">{question.explanation}</p>
            </DetailSection>
          ) : null}

          {question.options.length > 0 && (
            <DetailSection label="Các lựa chọn">
              <ul className="space-y-2">
                {question.options.map((option, index) => {
                  const isCorrect = correctIndices.includes(index);
                  return (
                  <li
                    className={`rounded-xl border px-3 py-2 text-body-md ${
                      isCorrect
                        ? "border-catalog-cobalt/25 bg-catalog-cyan/10 text-landing-text"
                        : "border-outline-variant/20 text-landing-text"
                    }`}
                    key={`${question.id}-opt-${index}`}
                  >
                    {option}
                    {isCorrect && (
                      <span className="ml-2 text-label-sm font-medium text-catalog-cobalt">(Đáp án đúng)</span>
                    )}
                  </li>
                  );
                })}
              </ul>
            </DetailSection>
          )}

          {question.tags.length > 0 && (
            <DetailSection label="Thẻ">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    className="rounded-full bg-landing-gray px-3 py-1 text-label-sm text-landing-text-soft"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}
        </div>
        {isPublished ? (
          <footer className="flex flex-col gap-3 border-t border-outline-variant/25 bg-landing-gray/25 px-md py-4 sm:flex-row sm:items-center sm:justify-between lg:px-lg">
            <p className="text-label-md text-landing-text-soft">
              Câu hỏi đã duyệt. Chỉnh sửa sẽ chuyển câu hỏi về trạng thái chờ duyệt lại.
            </p>
            <button
              className={TEACHER_MODAL_BTN_SECONDARY}
              onClick={() => onEdit(question)}
              type="button"
            >
              <MaterialIcon className="text-[20px]">edit</MaterialIcon>
              Chỉnh sửa
            </button>
          </footer>
        ) : (
          <footer className="flex flex-col gap-3 border-t border-outline-variant/25 bg-landing-gray/25 px-md py-4 sm:flex-row sm:items-center sm:justify-between lg:px-lg">
            {question.status === "Cần duyệt" ? (
              <p className="text-label-md text-landing-text-soft">
                Câu hỏi đang chờ duyệt. Bạn có thể chỉnh sửa trước khi duyệt.
              </p>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                className={TEACHER_MODAL_BTN_SECONDARY}
                onClick={() => onEdit(question)}
                type="button"
              >
                <MaterialIcon className="text-[20px]">edit</MaterialIcon>
                Chỉnh sửa
              </button>
              {question.status === "Cần duyệt" ? (
                <button
                  className={`${TEACHER_MODAL_BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
                  disabled={approving}
                  onClick={() => onApprove(question.id)}
                  type="button"
                >
                  <MaterialIcon className="text-[20px]">check_circle</MaterialIcon>
                  {approving ? "Đang duyệt..." : "Duyệt và xuất bản"}
                </button>
              ) : null}
            </div>
          </footer>
        )}
      </div>
    </ModalOverlay>
  );
}

function QuestionDetailStateModal({
  questionId,
  message,
  loading = false,
  actionLabel,
  onAction,
  onClose,
}: {
  questionId: string | null;
  message: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay labelledBy="question-detail-title" onClose={onClose} open>
      <div className={`mx-auto flex max-h-[min(800px,calc(100vh-32px))] w-full max-w-3xl flex-col ${TEACHER_MODAL_SHELL}`}>
        <header className="flex items-start justify-between gap-4 border-b border-outline-variant/25 px-md py-4 lg:px-lg">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-label-sm text-landing-text-soft">{questionId}</p>
            <h2 className="mt-1 text-headline-md font-semibold text-landing-text" id="question-detail-title">
              Chi tiết câu hỏi
            </h2>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-xl p-2 text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>
        {loading ? (
          <QuestionLibraryLoadingState label={message} variant="detail" />
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-md text-center lg:p-lg">
            <p className="text-body-md text-landing-text-soft">{message}</p>
            {actionLabel && onAction ? (
              <button className={TEACHER_MODAL_BTN_PRIMARY} onClick={onAction} type="button">
                {actionLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

function DetailSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-label-md font-semibold text-landing-text-soft">{label}</h3>
      {children}
    </section>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-landing-gray/35 px-3 py-2">
      <p className="text-label-sm text-landing-text-soft">{label}</p>
      <p className="mt-0.5 text-body-md text-landing-text">{value}</p>
    </div>
  );
}
