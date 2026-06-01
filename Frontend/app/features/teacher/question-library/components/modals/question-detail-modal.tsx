import type { ReactNode } from "react";

import { MaterialIcon } from "../../../components/teacher-icons";
import { statusDisplayLabels } from "../../constants/question-library.constants";
import type { QuestionItem } from "../../types/question-library.types";
import { ModalOverlay } from "./modal-overlay";

type QuestionDetailModalProps = {
  open: boolean;
  questionId: string | null;
  question: QuestionItem | null;
  isLoading: boolean;
  isError: boolean;
  approving: boolean;
  onApprove: (id: string) => void;
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
  onRetry,
  onClose,
}: QuestionDetailModalProps) {
  if (!open) {
    return null;
  }

  if (isLoading) {
    return (
      <QuestionDetailStateModal
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

  return (
    <ModalOverlay labelledBy="question-detail-title" onClose={onClose} open={open}>
      <div className="mx-auto flex max-h-[min(800px,calc(100vh-32px))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-outline-variant/10 px-md py-4 lg:px-lg">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-label-sm text-on-surface-variant">{question.id}</p>
            <h2 className="mt-1 text-headline-md font-semibold text-on-surface" id="question-detail-title">
              Chi tiết câu hỏi
            </h2>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>

        <div className="custom-scrollbar flex-1 space-y-md overflow-y-auto p-md lg:p-lg">
          <DetailSection label="Nội dung câu hỏi">
            <p className="whitespace-pre-wrap text-body-md text-on-surface">{question.question}</p>
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
              <p className="whitespace-pre-wrap text-body-md text-on-surface">{question.explanation}</p>
            </DetailSection>
          ) : null}

          {question.options.length > 0 && (
            <DetailSection label="Các lựa chọn">
              <ul className="space-y-2">
                {question.options.map((option, index) => (
                  <li
                    className={`rounded-lg border px-3 py-2 text-body-md ${
                      option === question.answer
                        ? "border-secondary bg-secondary-container/30 text-on-secondary-fixed-variant"
                        : "border-outline-variant/20 text-on-surface"
                    }`}
                    key={`${question.id}-opt-${index}`}
                  >
                    {option}
                    {option === question.answer && (
                      <span className="ml-2 text-label-sm font-medium text-secondary">(Đáp án đúng)</span>
                    )}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {question.tags.length > 0 && (
            <DetailSection label="Thẻ">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm text-on-surface-variant"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}
        </div>
        {question.status === "Cần duyệt" ? (
          <footer className="flex flex-col gap-3 border-t border-outline-variant/10 bg-surface-container-lowest px-md py-4 sm:flex-row sm:items-center sm:justify-between lg:px-lg">
            <p className="text-label-md text-on-surface-variant">
              Câu hỏi đang chờ duyệt. Hãy kiểm tra nội dung và đáp án trước khi xuất bản.
            </p>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-medium text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              disabled={approving}
              onClick={() => onApprove(question.id)}
              type="button"
            >
              <MaterialIcon className="text-[20px]">check_circle</MaterialIcon>
              {approving ? "Đang duyệt..." : "Duyệt và xuất bản"}
            </button>
          </footer>
        ) : null}
      </div>
    </ModalOverlay>
  );
}

function QuestionDetailStateModal({
  questionId,
  message,
  actionLabel,
  onAction,
  onClose,
}: {
  questionId: string | null;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay labelledBy="question-detail-title" onClose={onClose} open>
      <div className="mx-auto flex max-h-[min(800px,calc(100vh-32px))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-outline-variant/10 px-md py-4 lg:px-lg">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-label-sm text-on-surface-variant">{questionId}</p>
            <h2 className="mt-1 text-headline-md font-semibold text-on-surface" id="question-detail-title">
              Chi tiết câu hỏi
            </h2>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-md text-center lg:p-lg">
          <p className="text-body-md text-on-surface-variant">{message}</p>
          {actionLabel && onAction ? (
            <button
              className="rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-on-primary"
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </ModalOverlay>
  );
}

function DetailSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-label-md font-semibold text-on-surface-variant">{label}</h3>
      {children}
    </section>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-container-low px-3 py-2">
      <p className="text-label-sm text-on-surface-variant/70">{label}</p>
      <p className="mt-0.5 text-body-md text-on-surface">{value}</p>
    </div>
  );
}
