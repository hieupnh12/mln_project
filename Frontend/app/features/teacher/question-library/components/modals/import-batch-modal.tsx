import { useEffect, useState } from "react";

import { useRunningAsyncActivity } from "~/shared/hooks/use-running-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { useImportBatch } from "../../hooks/use-import-batch";
import type { LessonOptionDto } from "../../types/question-library-api.types";
import type { ImportPreviewRow } from "../../types/import-batch.types";
import { downloadImportTemplate } from "../../utils/download-import-template";
import { ImportBatchHeader } from "./import-batch/import-batch-header";
import { ImportInlineProgress } from "./import-batch/import-inline-progress";
import {
  ImportReviewPlaceholder,
  ImportReviewSection,
} from "./import-batch/import-review-section";
import { ImportUploadZone } from "./import-batch/import-upload-zone";
import { ModalOverlay } from "./modal-overlay";

type ImportBatchModalProps = {
  open: boolean;
  defaultLessonId?: number;
  lessonOptions: LessonOptionDto[];
  onClose: () => void;
  onImportComplete: (rows: ImportPreviewRow[], defaultLessonId: number) => Promise<void>;
};

export function ImportBatchModal({
  open,
  defaultLessonId,
  lessonOptions,
  onClose,
  onImportComplete,
}: ImportBatchModalProps) {
  const {
    step,
    fileName,
    fieldMappings,
    matchedColumnCount,
    isParsingFile,
    previewRows,
    rowCount,
    defaultLessonId: selectedDefaultLessonId,
    lessonIssueCount,
    handleFile,
    updateDefaultLessonId,
    reset,
  } = useImportBatch({
    lessonOptions,
    defaultLessonId: defaultLessonId ?? null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const parseActivity = useRunningAsyncActivity((id) => id.startsWith("import-parse-"));
  const isReview = step === "review";
  const busy = isParsingFile || isSubmitting;

  useEffect(() => {
    if (!open) {
      reset();
      setIsSubmitting(false);
    }
  }, [open, reset]);

  function handleClose() {
    if (busy) {
      return;
    }
    reset();
    onClose();
  }

  async function handleFinalize() {
    if (lessonIssueCount > 0) {
      showErrorToast("Còn dòng chưa gán được bài học. Kiểm tra Môn/Chương/Bài hoặc bài mặc định.");
      return;
    }

    const fallbackLessonId =
      selectedDefaultLessonId ?? previewRows.find((row) => row.lessonId)?.lessonId ?? null;

    if (!fallbackLessonId) {
      showErrorToast("Vui lòng chọn bài học mặc định hoặc điền Môn/Chương/Bài trong file.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onImportComplete(previewRows, fallbackLessonId);
      reset();
      onClose();
    } catch {
      // Toast + activity bar handled in manager
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      await downloadImportTemplate(lessonOptions);
      showSuccessToast("Đã tải file mẫu mau-import-cau-hoi.xlsx (có dropdown Môn/Chương/Bài)");
    } catch {
      showErrorToast("Không thể tải file mẫu. Vui lòng thử lại.");
    }
  }

  return (
    <ModalOverlay glass labelledBy="import-batch-title" onClose={handleClose} open={open}>
      <div className="custom-scrollbar mx-auto flex max-h-[calc(100vh-32px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-background shadow-2xl">
        <div className="custom-scrollbar flex-1 overflow-y-auto p-md lg:p-xl">
          <div className="mx-auto max-w-6xl space-y-gutter">
            <ImportBatchHeader
              lessonHints={lessonOptions.slice(0, 6).map((item) => ({
                subject: item.subjectTitle,
                chapter: item.chapterTitle,
                lesson: item.title,
              }))}
              onClose={handleClose}
              onDownloadTemplate={handleDownloadTemplate}
            />

            {parseActivity ? (
              <ImportInlineProgress
                detail={parseActivity.detail}
                label={parseActivity.label}
                progress={parseActivity.progress}
              />
            ) : null}

            <ImportUploadZone
              compact={isReview}
              disabled={busy}
              fileName={fileName}
              onFileSelect={handleFile}
            />

            {isReview ? (
              <ImportReviewSection
                defaultLessonId={selectedDefaultLessonId}
                fieldMappings={fieldMappings}
                isProcessing={busy}
                lessonIssueCount={lessonIssueCount}
                lessonOptions={lessonOptions}
                matchedColumnCount={matchedColumnCount}
                onCancel={handleClose}
                onDefaultLessonChange={updateDefaultLessonId}
                onFinalize={handleFinalize}
                previewRows={previewRows}
                rowCount={rowCount}
              />
            ) : (
              <ImportReviewPlaceholder />
            )}
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
