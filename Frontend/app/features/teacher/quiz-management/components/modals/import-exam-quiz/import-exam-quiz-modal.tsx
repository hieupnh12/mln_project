import { useEffect, useMemo, useState } from "react";

import { useRunningAsyncActivity } from "~/shared/hooks/use-running-async-activity";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { ImportBatchHeader } from "../../../../question-library/components/modals/import-batch/import-batch-header";
import { ImportColumnMappingPanel } from "../../../../question-library/components/modals/import-batch/import-column-mapping-panel";
import { ImportDataPreview } from "../../../../question-library/components/modals/import-batch/import-data-preview";
import { ImportInlineProgress } from "../../../../question-library/components/modals/import-batch/import-inline-progress";
import {
  ImportReviewPlaceholder,
} from "../../../../question-library/components/modals/import-batch/import-review-section";
import { ImportLessonSelector } from "../../../../question-library/components/modals/import-batch/import-lesson-selector";
import { ImportUploadZone } from "../../../../question-library/components/modals/import-batch/import-upload-zone";
import { useImportBatch } from "../../../../question-library/hooks/use-import-batch";
import { downloadImportTemplate } from "../../../../question-library/utils/download-import-template";
import type { LessonOptionDto } from "../../../../question-library/types/question-library-api.types";
import type { ImportTargetStatus } from "../../../../question-library/types/import-batch.types";
import { ApiRequestError } from "~/shared/services/api-client";

import { ModalOverlay } from "../../../../question-library/components/modals/modal-overlay";
import { TEACHER_MODAL_SHELL } from "../../../../constants/teacher-ui.constants";
import { useImportExamQuizMutation } from "../../../hooks/use-import-exam-quiz-mutation";
import { useQuizScopeOptions } from "../../../hooks/use-quiz-scope-options";
import type { ImportExamAsQuizResultDto, ImportExamQuizConfig } from "../../../types/quiz-import.types";
import {
  buildImportExamAsQuizPayload,
  createDefaultImportExamQuizConfig,
} from "../../../utils/build-import-exam-quiz-payload";
import { ImportExamQuizActionsBar } from "./import-exam-quiz-actions-bar";
import { ImportExamQuizConfigSection } from "./import-exam-quiz-config-section";
import { ImportExamQuizResultModal } from "./import-exam-quiz-result-modal";

type ImportExamQuizModalProps = {
  open: boolean;
  courseOptions: string[];
  lessonOptions: LessonOptionDto[];
  onClose: () => void;
  onOpenQuiz: (quizId: string) => void;
};

export function ImportExamQuizModal({
  open,
  courseOptions,
  lessonOptions,
  onClose,
  onOpenQuiz,
}: ImportExamQuizModalProps) {
  const importExamMutation = useImportExamQuizMutation();
  const {
    step,
    fileName,
    fieldMappings,
    matchedColumnCount,
    isParsingFile,
    previewRows,
    rowCount,
    defaultLessonId,
    lessonIssueCount,
    handleFile,
    updateDefaultLessonId,
    reset,
  } = useImportBatch({
    lessonOptions,
    defaultLessonId: lessonOptions[0]?.id ?? null,
  });

  const [quizConfig, setQuizConfig] = useState<ImportExamQuizConfig>(() =>
    createDefaultImportExamQuizConfig(null, [], lessonOptions, lessonOptions[0]?.id ?? 0),
  );
  const [submittingStatus, setSubmittingStatus] = useState<ImportTargetStatus | null>(null);
  const [importResult, setImportResult] = useState<ImportExamAsQuizResultDto | null>(null);

  const parseActivity = useRunningAsyncActivity((id) => id.startsWith("import-parse-"));
  const importActivity = useRunningAsyncActivity((id) => id === "quiz-import-exam");
  const isReview = step === "review";
  const busy = isParsingFile || submittingStatus !== null || importExamMutation.isPending;

  const { chapterOptions, lessonTitles } = useQuizScopeOptions(
    lessonOptions,
    quizConfig.course,
    quizConfig.chapter,
  );

  useEffect(() => {
    if (!open) {
      reset();
      setSubmittingStatus(null);
      setImportResult(null);
      setQuizConfig(
        createDefaultImportExamQuizConfig(null, [], lessonOptions, lessonOptions[0]?.id ?? 0),
      );
      return;
    }
  }, [lessonOptions, open, reset]);

  useEffect(() => {
    if (!isReview || previewRows.length === 0) {
      return;
    }
    const fallbackLessonId = defaultLessonId ?? lessonOptions[0]?.id ?? 0;
    setQuizConfig((current) => ({
      ...createDefaultImportExamQuizConfig(fileName, previewRows, lessonOptions, fallbackLessonId),
      title: current.title.trim() ? current.title : createDefaultImportExamQuizConfig(
        fileName,
        previewRows,
        lessonOptions,
        fallbackLessonId,
      ).title,
      passingScore: current.passingScore,
      shuffleAnswers: current.shuffleAnswers,
    }));
  }, [defaultLessonId, fileName, isReview, lessonOptions, previewRows]);

  const courseChoices = useMemo(
    () => (courseOptions.length > 0 ? courseOptions : [...new Set(lessonOptions.map((item) => item.subjectTitle))]),
    [courseOptions, lessonOptions],
  );

  function handleClose() {
    if (busy) {
      return;
    }
    reset();
    onClose();
  }

  async function handleDownloadTemplate() {
    try {
      await downloadImportTemplate(lessonOptions);
      showSuccessToast("Đã tải file mẫu mau-import-cau-hoi.xlsx");
    } catch {
      showErrorToast("Không thể tải file mẫu. Vui lòng thử lại.");
    }
  }

  async function handleFinalize(targetStatus: ImportTargetStatus) {
    if (lessonIssueCount > 0) {
      showErrorToast("Còn dòng chưa gán được bài học. Kiểm tra Môn/Chương/Bài hoặc bài mặc định.");
      return;
    }

    const fallbackLessonId =
      defaultLessonId ?? previewRows.find((row) => row.lessonId)?.lessonId ?? null;

    if (!fallbackLessonId) {
      showErrorToast("Vui lòng chọn bài học mặc định hoặc điền Môn/Chương/Bài trong file.");
      return;
    }

    if (!quizConfig.course.trim()) {
      showErrorToast("Vui lòng chọn môn học cho quiz.");
      return;
    }

    setSubmittingStatus(targetStatus);
    try {
      const payload = buildImportExamAsQuizPayload(
        previewRows,
        fallbackLessonId,
        targetStatus,
        quizConfig,
      );

      const result = await runWithAsyncActivity({
        id: "quiz-import-exam",
        label: "Import đề và tạo quiz",
        detail: `${previewRows.length} dòng · chờ server xử lý`,
        indeterminate: true,
        task: async (updateProgress) => {
          updateProgress(8, "Đang gửi file lên server...");
          const response = await importExamMutation.mutateAsync(payload);
          updateProgress(100, `Đã tạo quiz ${response.quiz.questionCount} câu`);
          return response;
        },
      });

      setImportResult(result);
      showSuccessToast(
        `Đã tạo quiz "${result.quiz.title}" với ${result.importReport.quizQuestionCount ?? result.quiz.questionCount} câu.`,
      );
    } catch (error) {
      if (error instanceof ApiRequestError) {
        showErrorToast(error.message);
      } else if (error instanceof Error && /timeout/i.test(error.message)) {
        showErrorToast("Import vẫn đang xử lý trên server hoặc mất kết nối. Kiểm tra lại danh sách quiz sau vài phút.");
      } else {
        showErrorToast("Không thể import đề. Vui lòng thử lại.");
      }
    } finally {
      setSubmittingStatus(null);
    }
  }

  function handleResultClose() {
    setImportResult(null);
    reset();
    onClose();
  }

  function handleOpenQuiz(quizId: string) {
    setImportResult(null);
    reset();
    onClose();
    onOpenQuiz(quizId);
  }

  return (
    <>
      <ModalOverlay labelledBy="import-exam-quiz-title" onClose={handleClose} open={open}>
        <div
          className={`custom-scrollbar mx-auto flex max-h-[calc(100vh-32px)] w-full max-w-6xl flex-col ${TEACHER_MODAL_SHELL}`}
        >
          <div className="custom-scrollbar flex-1 overflow-y-auto p-md lg:p-xl">
            <div className="mx-auto max-w-6xl space-y-gutter">
              <ImportBatchHeader
                breadcrumb="Quản lý Quiz"
                onClose={handleClose}
                onDownloadTemplate={handleDownloadTemplate}
                subtitle="Upload file Excel, gắn câu trùng tự động và tạo quiz bản nháp."
                title="Import đề từ Excel"
                titleId="import-exam-quiz-title"
              />

              {parseActivity || importActivity ? (
                <ImportInlineProgress
                  detail={importActivity?.detail ?? parseActivity?.detail}
                  label={importActivity?.label ?? parseActivity?.label ?? "Đang xử lý"}
                  progress={importActivity?.progress ?? parseActivity?.progress}
                />
              ) : null}

              <ImportUploadZone
                compact={isReview}
                disabled={busy}
                fileName={fileName}
                onFileSelect={handleFile}
              />

              {isReview ? (
                <div className="import-review-enter space-y-gutter">
                  <ImportLessonSelector
                    lessonOptions={lessonOptions}
                    onChange={updateDefaultLessonId}
                    value={defaultLessonId}
                  />

                  {lessonIssueCount > 0 ? (
                    <p className="rounded-lg bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
                      {lessonIssueCount} dòng chưa gán được bài học. Kiểm tra cột Môn/Chương/Bài hoặc
                      chọn bài học mặc định.
                    </p>
                  ) : null}

                  <ImportExamQuizConfigSection
                    chapterOptions={chapterOptions}
                    config={quizConfig}
                    courseOptions={courseChoices}
                    lessonOptions={lessonTitles}
                    onChange={setQuizConfig}
                    rowCount={rowCount}
                  />

                  <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
                    <ImportDataPreview rowCount={rowCount} rows={previewRows} />
                    <ImportColumnMappingPanel
                      matchedCount={matchedColumnCount}
                      mappings={fieldMappings}
                    />
                  </div>

                  <ImportExamQuizActionsBar
                    isProcessing={busy}
                    onCancel={handleClose}
                    onImportPending={() => handleFinalize("PENDING")}
                    onImportPublished={() => handleFinalize("PUBLISHED")}
                    submittingStatus={submittingStatus}
                  />
                </div>
              ) : (
                <ImportReviewPlaceholder />
              )}
            </div>
          </div>
        </div>
      </ModalOverlay>

      <ImportExamQuizResultModal
        onClose={handleResultClose}
        onOpenQuiz={handleOpenQuiz}
        open={importResult !== null}
        result={importResult}
      />
    </>
  );
}
