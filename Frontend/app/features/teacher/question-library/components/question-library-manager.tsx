import { useEffect, useMemo, useState } from "react";

import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { ApiRequestError } from "~/shared/services/api-client";

import { emptyQuestionDraft } from "../constants/question-library.constants";
import { useBatchImportMutation, useCreateQuestionMutation, useDeleteQuestionMutation, useDeleteQuestionsMutation } from "../hooks/use-question-library-mutations";
import {
  useQuestionMetadataQuery,
  useQuestionsQuery,
  useQuestionStatsQuery,
} from "../hooks/use-question-library-queries";
import { useQuestionPagination } from "../hooks/use-question-pagination";
import { useQuestionSelection } from "../hooks/use-question-selection";
import { checkQuestionDuplicate } from "../services/question-library.service";
import type { CreateQuestionPayload } from "../types/question-library-api.types";
import type { QuestionDraft, QuestionFilters, QuestionItem, QuestionModalId, QuestionStatus } from "../types/question-library.types";
import type { ImportPreviewRow } from "../types/import-batch.types";
import { mapImportPreviewRowToPayload } from "../utils/map-import-batch-payload";
import { mapDraftToCreatePayload } from "../utils/map-question-draft";
import { createQuestionDraftFromLesson } from "../utils/lesson-options";
import { AddQuestionModal } from "./modals/add-question-modal";
import { DuplicateCompareModal } from "./modals/duplicate-compare-modal";
import { ExportExamModal } from "./modals/export-exam-modal";
import { ImportBatchModal } from "./modals/import-batch-modal";
import { QuestionDetailModal } from "./modals/question-detail-modal";
import type { ExportConfig, RandomExamConfig } from "../types/export-exam.types";
import {
  createDefaultFilters,
  QuestionFiltersBar,
} from "./question-filters-bar";
import { QuestionLibraryHeader } from "./question-library-header";
import { QuestionStatsCards } from "./question-stats-cards";
import { QuestionTable } from "./question-table";
import { QuestionTablePagination } from "./question-table-pagination";

type DuplicateCompareState = {
  pendingPayload: CreateQuestionPayload;
  existingQuestion: QuestionItem;
  isExact: boolean;
  warningMessage?: string;
};

const DUPLICATE_ERROR_CODE = 3004;

export function QuestionLibraryManager() {
  const [filters, setFilters] = useState<QuestionFilters>(createDefaultFilters);
  const [activeModal, setActiveModal] = useState<QuestionModalId | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQuestionDraft);
  const [detailQuestion, setDetailQuestion] = useState<QuestionItem | null>(null);
  const [duplicateCompare, setDuplicateCompare] = useState<DuplicateCompareState | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const metadataQuery = useQuestionMetadataQuery();
  const questionsQuery = useQuestionsQuery(filters);
  const statsQuery = useQuestionStatsQuery();
  const createMutation = useCreateQuestionMutation();
  const batchImportMutation = useBatchImportMutation();
  const deleteMutation = useDeleteQuestionMutation();
  const deleteManyMutation = useDeleteQuestionsMutation();

  const questions = questionsQuery.data?.items ?? [];
  const lessonOptions = metadataQuery.data?.lessonOptions ?? [];

  const stats = useMemo(() => {
    if (!statsQuery.data) {
      return null;
    }
    return {
      totalQuestions: statsQuery.data.totalQuestions,
      totalCourses: statsQuery.data.totalCourses,
      byDifficulty: {
        "Cơ bản": statsQuery.data.byDifficulty["Cơ bản"] ?? 0,
        "Vận dụng": statsQuery.data.byDifficulty["Vận dụng"] ?? 0,
        "Nâng cao": statsQuery.data.byDifficulty["Nâng cao"] ?? 0,
      },
      byStatus: {
        "Bản nháp": statsQuery.data.byStatus["Bản nháp"] ?? 0,
        "Cần duyệt": statsQuery.data.byStatus["Cần duyệt"] ?? 0,
        "Đã xuất bản": statsQuery.data.byStatus["Đã xuất bản"] ?? 0,
      },
    };
  }, [statsQuery.data]);

  const {
    pageItems,
    page,
    totalPages,
    rangeStart,
    rangeEnd,
    goToPage,
    resetPage,
  } = useQuestionPagination(questions);

  const pageIds = useMemo(() => pageItems.map((q) => q.id), [pageItems]);

  const {
    allSelected,
    selectedCount,
    toggleAll,
    toggleOne,
    clearSelection,
    isSelected,
    pruneSelection,
  } = useQuestionSelection(pageIds);

  useEffect(() => {
    resetPage();
  }, [filters, resetPage]);

  useEffect(() => {
    pruneSelection(questions.map((q) => q.id));
  }, [questions, pruneSelection]);

  useEffect(() => {
    if (activeModal !== "add" || lessonOptions.length === 0) {
      return;
    }
    setDraft((current) =>
      current.lessonId ? current : createQuestionDraftFromLesson(lessonOptions[0]),
    );
  }, [activeModal, lessonOptions]);

  function handleOpenModal(modal: QuestionModalId) {
    if (modal === "add") {
      setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    }
    setActiveModal(modal);
  }

  function closeModal() {
    setActiveModal(null);
  }

  function getSuccessMessage(status: QuestionStatus) {
    if (status === "Đã xuất bản") {
      return "Đã xuất bản câu hỏi thành công.";
    }
    if (status === "Cần duyệt") {
      return "Đã gửi câu hỏi để duyệt.";
    }
    return "Đã lưu bản nháp câu hỏi.";
  }

  function submitQuestion(payload: CreateQuestionPayload, status: QuestionStatus) {
    runWithAsyncActivity({
      id: "question-library-create",
      label: status === "Đã xuất bản" ? "Đang xuất bản câu hỏi" : "Đang lưu câu hỏi",
      simulateProgress: true,
      task: async () => {
        await createMutation.mutateAsync(payload);
        setDraft(emptyQuestionDraft);
        setDuplicateCompare(null);
        closeModal();
        showSuccessToast(getSuccessMessage(status));
      },
    }).catch((error) => {
      if (
        error instanceof ApiRequestError &&
        Number(error.code) === DUPLICATE_ERROR_CODE
      ) {
        showInfoToast("Câu hỏi trùng với câu hỏi đã có trong ngân hàng.");
        return;
      }
      showErrorToast(error instanceof Error ? error.message : "Không thể lưu câu hỏi.");
    });
  }

  async function saveQuestion(status: QuestionStatus, allowSimilarSave = false) {
    if (!draft.question.trim()) {
      showErrorToast("Nội dung câu hỏi không được để trống.");
      return;
    }

    const payload = mapDraftToCreatePayload(draft, status, allowSimilarSave);
    if (!payload) {
      showErrorToast("Vui lòng chọn bài học trước khi lưu.");
      return;
    }

    if (!allowSimilarSave) {
      setCheckingDuplicate(true);
      try {
        const duplicateResult = await checkQuestionDuplicate({
          lessonId: payload.lessonId,
          type: payload.type,
          content: payload.question,
        });

        if (
          (duplicateResult.exactDuplicate || duplicateResult.similarDuplicate) &&
          duplicateResult.matchedQuestion
        ) {
          setDuplicateCompare({
            pendingPayload: payload,
            existingQuestion: duplicateResult.matchedQuestion,
            isExact: duplicateResult.exactDuplicate,
            warningMessage: duplicateResult.warningMessage,
          });
          return;
        }
      } catch (error) {
        showErrorToast(
          error instanceof Error ? error.message : "Không thể kiểm tra trùng lặp.",
        );
        return;
      } finally {
        setCheckingDuplicate(false);
      }
    }

    submitQuestion(payload, status);
  }

  function handleConfirmDuplicateSave() {
    if (!duplicateCompare) {
      return;
    }
    submitQuestion(
      { ...duplicateCompare.pendingPayload, allowSimilarSave: true },
      duplicateCompare.pendingPayload.status as QuestionStatus,
    );
  }

  async function handleImportComplete(rows: ImportPreviewRow[], defaultLessonId: number) {
    const report = await runWithAsyncActivity({
      id: "question-library-batch-import",
      label: "Import câu hỏi hàng loạt",
      detail: `${rows.length} dòng`,
      simulateProgress: true,
      task: async (updateProgress) => {
        updateProgress(25, "Đang gửi dữ liệu lên server...");
        const result = await batchImportMutation.mutateAsync({
          lessonId: defaultLessonId,
          defaultStatus: "Cần duyệt",
          rows: rows.map(mapImportPreviewRowToPayload),
        });
        updateProgress(95, `Đã xử lý ${result.savedCount}/${rows.length} dòng`);
        return result;
      },
    });

    showSuccessToast(
      `Import xong: ${report.savedCount} đã lưu, ${report.skippedExactDuplicate} trùng, ${report.markedSimilar} tương tự.`,
    );
  }

  function handleDiscardDraft() {
    setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    closeModal();
  }

  function deleteQuestion(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => showSuccessToast("Đã xóa câu hỏi."),
      onError: (error) => {
        showErrorToast(error instanceof Error ? error.message : "Không thể xóa câu hỏi.");
      },
    });
  }

  function handleDeleteSelected() {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedCount} câu hỏi đã chọn? Thao tác này không thể hoàn tác.`,
    );
    if (!confirmed) return;
    const ids = questions.filter((q) => isSelected(q.id)).map((q) => q.id);
    deleteManyMutation.mutate(ids, {
      onSuccess: () => {
        clearSelection();
        showSuccessToast(`Đã xóa ${ids.length} câu hỏi.`);
      },
      onError: (error) => {
        showErrorToast(error instanceof Error ? error.message : "Không thể xóa câu hỏi.");
      },
    });
  }

  function handleExport(config: ExportConfig) {
    showInfoToast(
      `Đang xuất ${config.format.toUpperCase()} — trạng thái: ${config.statusFilter} (demo).`,
    );
    closeModal();
  }

  function handleRandomGenerate(config: RandomExamConfig) {
    const pool = questions.filter((q) =>
      config.selectedChapterIds.includes(q.chapter),
    );
    const source = pool.length > 0 ? pool : questions;
    const picked = [...source]
      .sort(() => Math.random() - 0.5)
      .slice(0, config.totalCount);
    showInfoToast(`Đã chọn ${picked.length} câu hỏi cho đề thi (demo).`);
  }

  const filterOptions = {
    courses: metadataQuery.data?.courses ?? [],
    chapters: metadataQuery.data?.chapters ?? [],
    lessons: metadataQuery.data?.lessons ?? [],
  };

  const isSaving = createMutation.isPending || checkingDuplicate;

  return (
    <div className="space-y-gutter">
      <QuestionLibraryHeader onOpenModal={handleOpenModal} />

      {(metadataQuery.isError || questionsQuery.isError) && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container">
          Không kết nối API (
          {metadataQuery.isError ? "metadata" : null}
          {metadataQuery.isError && questionsQuery.isError ? ", " : null}
          {questionsQuery.isError ? "danh sách câu hỏi" : null}). Backend:{" "}
          <code className="font-mono text-label-sm">http://localhost:8080/mlnStudy</code>
        </p>
      )}

      {stats && (
        <QuestionStatsCards
          activeStatus={filters.status}
          onStatusFilter={(status) => setFilters({ ...filters, status })}
          stats={stats}
        />
      )}
      <QuestionFiltersBar
        canDelete={selectedCount > 0}
        chapterOptions={filterOptions.chapters}
        courseOptions={filterOptions.courses}
        filters={filters}
        lessonOptions={filterOptions.lessons}
        onChange={setFilters}
        onDeleteSelected={handleDeleteSelected}
        onOpenExport={() => setActiveModal("export")}
        onOpenRandom={() => setActiveModal("export")}
        onReset={() => {
          setFilters(createDefaultFilters());
          clearSelection();
        }}
        selectedCount={selectedCount}
      />
      <QuestionTable
        allSelected={allSelected}
        footer={
          <QuestionTablePagination
            onPageChange={goToPage}
            page={page}
            rangeEnd={rangeEnd}
            rangeStart={rangeStart}
            totalItems={questions.length}
            totalPages={totalPages}
          />
        }
        isLoading={questionsQuery.isLoading}
        isSelected={isSelected}
        onDelete={deleteQuestion}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewDetail={setDetailQuestion}
        questions={pageItems}
      />

      <AddQuestionModal
        draft={draft}
        lessonOptions={lessonOptions}
        lessonsError={metadataQuery.isError}
        lessonsLoading={metadataQuery.isLoading}
        onRetryLessons={() => metadataQuery.refetch()}
        onClose={closeModal}
        onDiscard={handleDiscardDraft}
        onDraftChange={setDraft}
        onPublish={() => saveQuestion("Đã xuất bản")}
        onSaveDraft={() => saveQuestion("Bản nháp")}
        open={activeModal === "add"}
        saving={isSaving}
      />
      <ImportBatchModal
        defaultLessonId={lessonOptions[0]?.id}
        lessonOptions={lessonOptions}
        onClose={closeModal}
        onImportComplete={handleImportComplete}
        open={activeModal === "import"}
      />
      <ExportExamModal
        onClose={closeModal}
        onExport={handleExport}
        onGenerate={handleRandomGenerate}
        open={activeModal === "export"}
        poolSize={questions.length}
      />
      <QuestionDetailModal
        onClose={() => setDetailQuestion(null)}
        open={detailQuestion !== null}
        question={detailQuestion}
      />
      <DuplicateCompareModal
        existingQuestion={duplicateCompare?.existingQuestion ?? null}
        isExact={duplicateCompare?.isExact ?? false}
        onClose={() => setDuplicateCompare(null)}
        onConfirmSave={handleConfirmDuplicateSave}
        open={duplicateCompare !== null}
        pendingPayload={duplicateCompare?.pendingPayload ?? null}
        saving={createMutation.isPending}
        warningMessage={duplicateCompare?.warningMessage}
      />
    </div>
  );
}
