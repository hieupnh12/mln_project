import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "~/shared/hooks/use-debounced-value";
import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { ApiRequestError } from "~/shared/services/api-client";

import { emptyQuestionDraft } from "../constants/question-library.constants";
import { useApproveQuestionMutation, useBatchImportMutation, useCreateQuestionMutation, useDeleteQuestionMutation, useDeleteQuestionsMutation, useUpdateQuestionMutation } from "../hooks/use-question-library-mutations";
import { useBulkApproveSelected } from "../hooks/use-bulk-approve-selected";
import {
  useQuestionMetadataQuery,
  useQuestionQuery,
  useQuestionStatsQuery,
} from "../hooks/use-question-library-queries";
import { useQuestionPagination } from "../hooks/use-question-pagination";
import { useQuestionSelection } from "../hooks/use-question-selection";
import { checkQuestionDuplicate, getQuestion } from "../services/question-library.service";
import type { CreateQuestionPayload } from "../types/question-library-api.types";
import type { QuestionDraft, QuestionFilters, QuestionItem, QuestionModalId, QuestionStatus } from "../types/question-library.types";
import type { ImportPreviewRow } from "../types/import-batch.types";
import { mapImportPreviewRowToPayload } from "../utils/map-import-batch-payload";
import { mapDraftToCreatePayload } from "../utils/map-question-draft";
import { mapQuestionToDraft } from "../utils/map-question-to-draft";
import { createQuestionDraftFromLesson } from "../utils/lesson-options";
import { AddQuestionModal } from "./modals/add-question-modal";
import { DuplicateCompareModal } from "./modals/duplicate-compare-modal";
import { ExportExamModal } from "./modals/export-exam-modal";
import { ImportBatchModal } from "./modals/import-batch-modal";
import { QuestionDetailModal } from "./modals/question-detail-modal";
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
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionStatus, setEditingQuestionStatus] = useState<QuestionStatus | null>(null);
  const [detailQuestionId, setDetailQuestionId] = useState<string | null>(null);
  const [duplicateCompare, setDuplicateCompare] = useState<DuplicateCompareState | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const metadataQuery = useQuestionMetadataQuery();
  const statsQuery = useQuestionStatsQuery();
  const createMutation = useCreateQuestionMutation();
  const updateMutation = useUpdateQuestionMutation();
  const batchImportMutation = useBatchImportMutation();
  const approveMutation = useApproveQuestionMutation();
  const deleteMutation = useDeleteQuestionMutation();
  const deleteManyMutation = useDeleteQuestionsMutation();

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

  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const listFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );
  const isSearchPending = filters.search !== debouncedSearch;

  const {
    questionsQuery,
    pageItems,
    page,
    totalPages,
    totalItems,
    rangeStart,
    rangeEnd,
    goToPage,
    resetPage,
    isInitialLoading,
    isPageLoading,
  } = useQuestionPagination(listFilters);
  const detailQuestionQuery = useQuestionQuery(detailQuestionId);

  const pageIds = useMemo(() => pageItems.map((q) => q.id), [pageItems]);

  const {
    allSelected,
    selectedIds,
    selectedCount,
    toggleAll,
    toggleOne,
    clearSelection,
    isSelected,
    pruneSelection,
  } = useQuestionSelection(pageIds);
  const { approveSelected, isApprovingSelected } = useBulkApproveSelected({
    selectedIds,
    clearSelection,
  });

  useEffect(() => {
    pruneSelection(pageItems.map((q) => q.id));
  }, [pageItems, pruneSelection]);

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
      setEditingQuestionId(null);
      setEditingQuestionStatus(null);
      setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    }
    setActiveModal(modal);
  }

  function closeModal() {
    setActiveModal(null);
    setEditingQuestionId(null);
    setEditingQuestionStatus(null);
  }

  function openEditQuestion(question: QuestionItem) {
    if (question.status === "Đã xuất bản") {
      showInfoToast("Câu hỏi đã duyệt không thể chỉnh sửa.");
      return;
    }

    setDetailQuestionId(null);
    setEditingQuestionId(question.id);
    setEditingQuestionStatus(question.status);
    setDraft(mapQuestionToDraft(question));
    setActiveModal("add");
  }

  async function handleEditQuestion(id: string) {
    const listItem = pageItems.find((item) => item.id === id);
    if (listItem?.status === "Đã xuất bản") {
      showInfoToast("Câu hỏi đã duyệt không thể chỉnh sửa.");
      return;
    }

    try {
      const question = await getQuestion(id);
      openEditQuestion(question);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể mở chỉnh sửa câu hỏi.");
    }
  }

  function handleFiltersChange(nextFilters: QuestionFilters) {
    resetPage();
    setFilters(nextFilters);
  }

  function handleSearchChange(search: string) {
    setFilters((current) => ({ ...current, search }));
  }

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, resetPage]);

  function getSuccessMessage(status: QuestionStatus, isEditing: boolean) {
    if (isEditing) {
      return "Đã cập nhật câu hỏi.";
    }
    if (status === "Đã xuất bản") {
      return "Đã tạo câu hỏi thành công.";
    }
    if (status === "Cần duyệt") {
      return "Đã gửi câu hỏi để duyệt.";
    }
    return "Đã lưu bản nháp câu hỏi.";
  }

  function submitQuestion(payload: CreateQuestionPayload, status: QuestionStatus) {
    const isEditing = editingQuestionId !== null;
    runWithAsyncActivity({
      id: isEditing ? "question-library-update" : "question-library-create",
      label: isEditing
        ? "Đang cập nhật câu hỏi"
        : status === "Đã xuất bản"
          ? "Đang tạo câu hỏi"
          : "Đang lưu câu hỏi",
      simulateProgress: true,
      task: async () => {
        if (isEditing && editingQuestionId) {
          await updateMutation.mutateAsync({ id: editingQuestionId, payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        setDraft(emptyQuestionDraft);
        setEditingQuestionId(null);
        setEditingQuestionStatus(null);
        setDuplicateCompare(null);
        closeModal();
        showSuccessToast(getSuccessMessage(status, isEditing));
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
          excludeQuestionId: editingQuestionId
            ? Number(editingQuestionId.replace(/^Q-/i, ""))
            : undefined,
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
    closeModal();

    const report = await runWithAsyncActivity({
      id: "question-library-batch-import",
      label: "Import câu hỏi hàng loạt",
      detail: `${rows.length} dòng`,
      simulateProgress: true,
      task: async (updateProgress) => {
        updateProgress(25, "Đang gửi dữ liệu lên server...");
        const result = await batchImportMutation.mutateAsync({
          lessonId: defaultLessonId,
          rows: rows.map(mapImportPreviewRowToPayload),
        });
        updateProgress(95, `Đã xử lý ${result.savedCount}/${rows.length} dòng`);
        return result;
      },
    });

    showSuccessToast(
      `Import xong: ${report.savedCount} câu đang chờ duyệt, ${report.skippedExactDuplicate} trùng, ${report.markedSimilar} tương tự.`,
    );
  }

  function handleDiscardDraft() {
    setDraft(createQuestionDraftFromLesson(lessonOptions[0]));
    setEditingQuestionId(null);
    setEditingQuestionStatus(null);
    closeModal();
  }

  function resolveSaveStatus(publish: boolean): QuestionStatus {
    if (editingQuestionId && editingQuestionStatus) {
      if (publish) {
        return editingQuestionStatus === "Bản nháp" ? "Đã xuất bản" : editingQuestionStatus;
      }
      return "Bản nháp";
    }
    return publish ? "Đã xuất bản" : "Bản nháp";
  }

  function deleteQuestion(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => showSuccessToast("Đã xóa câu hỏi."),
      onError: (error) => {
        showErrorToast(error instanceof Error ? error.message : "Không thể xóa câu hỏi.");
      },
    });
  }

  function approveQuestion(id: string) {
    runWithAsyncActivity({
      id: "question-library-approve",
      label: "Đang duyệt câu hỏi",
      simulateProgress: true,
      task: async () => {
        await approveMutation.mutateAsync(id);
        setDetailQuestionId(null);
        showSuccessToast("Đã duyệt và xuất bản câu hỏi.");
      },
    }).catch((error) => {
      showErrorToast(error instanceof Error ? error.message : "Không thể duyệt câu hỏi.");
    });
  }

  function handleDeleteSelected() {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedCount} câu hỏi đã chọn? Thao tác này không thể hoàn tác.`,
    );
    if (!confirmed) return;
    const ids = [...selectedIds];
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

  const filterOptions = {
    courses: metadataQuery.data?.courses ?? [],
    chapters: metadataQuery.data?.chapters ?? [],
    lessons: metadataQuery.data?.lessons ?? [],
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending || checkingDuplicate;
  const tableLoading = isPageLoading || isSearchPending;

  return (
    <div className="space-y-gutter">
      <QuestionLibraryHeader onOpenModal={handleOpenModal} />

      {(metadataQuery.isError || questionsQuery.isError) && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container">
          Không kết nối API (
          {metadataQuery.isError ? "metadata" : null}
          {metadataQuery.isError && questionsQuery.isError ? ", " : null}
          {questionsQuery.isError ? "danh sách câu hỏi" : null}). Backend:{" "}
          <code className="font-mono text-label-sm">VITE_API_BASE_URL</code>
        </p>
      )}

      {stats && (
        <QuestionStatsCards
          activeStatus={filters.status}
          onStatusFilter={(status) => handleFiltersChange({ ...filters, status })}
          stats={stats}
        />
      )}
      <QuestionFiltersBar
        approvingSelected={isApprovingSelected}
        canApprove={selectedCount > 0}
        canDelete={selectedCount > 0}
        chapterOptions={filterOptions.chapters}
        courseOptions={filterOptions.courses}
        filters={filters}
        lessonOptions={filterOptions.lessons}
        onChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onApproveSelected={approveSelected}
        onDeleteSelected={handleDeleteSelected}
        onOpenExport={() => setActiveModal("export")}
        onReset={() => {
          handleFiltersChange(createDefaultFilters());
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
            totalItems={totalItems}
            totalPages={totalPages}
          />
        }
        isInitialLoading={isInitialLoading}
        isPageLoading={tableLoading}
        isSelected={isSelected}
        onDelete={deleteQuestion}
        onEdit={handleEditQuestion}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewDetail={setDetailQuestionId}
        questions={pageItems}
      />

      <AddQuestionModal
        draft={draft}
        editingStatus={editingQuestionStatus ?? undefined}
        lessonOptions={lessonOptions}
        lessonsError={metadataQuery.isError}
        lessonsLoading={metadataQuery.isLoading}
        mode={editingQuestionId ? "edit" : "create"}
        onRetryLessons={() => metadataQuery.refetch()}
        onClose={closeModal}
        onDiscard={handleDiscardDraft}
        onDraftChange={setDraft}
        onPublish={() => saveQuestion(resolveSaveStatus(true))}
        onSaveDraft={() => saveQuestion(resolveSaveStatus(false))}
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
        lessonOptions={lessonOptions}
        onClose={closeModal}
        open={activeModal === "export"}
      />
      <QuestionDetailModal
        approving={approveMutation.isPending}
        isError={detailQuestionQuery.isError}
        isLoading={detailQuestionQuery.isLoading}
        onApprove={approveQuestion}
        onClose={() => setDetailQuestionId(null)}
        onEdit={openEditQuestion}
        onRetry={() => detailQuestionQuery.refetch()}
        open={detailQuestionId !== null}
        question={detailQuestionQuery.data ?? null}
        questionId={detailQuestionId}
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
