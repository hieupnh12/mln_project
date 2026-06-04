import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "~/shared/hooks/use-debounced-value";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";

import { useApproveQuestionMutation } from "../hooks/use-question-library-mutations";
import { useBulkApproveSelected } from "../hooks/use-bulk-approve-selected";
import { useQuestionDeleteController } from "../hooks/use-question-delete-controller";
import { useQuestionEditorController } from "../hooks/use-question-editor-controller";
import {
  normalizeQuestionHierarchyFilters,
  useQuestionHierarchyFilterOptions,
} from "../hooks/use-question-hierarchy-filter-options";
import {
  useQuestionMetadataQuery,
  useQuestionQuery,
  useQuestionStatsQuery,
} from "../hooks/use-question-library-queries";
import { useQuestionPagination } from "../hooks/use-question-pagination";
import { useQuestionSelection } from "../hooks/use-question-selection";
import type { QuestionFilters } from "../types/question-library.types";
import { AddQuestionModal } from "./modals/add-question-modal";
import { ConfirmQuestionDeleteModal } from "./modals/confirm-question-delete-modal";
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

export function QuestionLibraryManager() {
  const [filters, setFilters] = useState<QuestionFilters>(createDefaultFilters);
  const [detailQuestionId, setDetailQuestionId] = useState<string | null>(null);

  const metadataQuery = useQuestionMetadataQuery();
  const statsQuery = useQuestionStatsQuery();
  const approveMutation = useApproveQuestionMutation();

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
  const {
    activeModal,
    closeModal,
    createMutation,
    draft,
    duplicateCompare,
    editingQuestionId,
    editingQuestionStatus,
    handleConfirmDuplicateSave,
    handleDiscardDraft,
    handleEditQuestion,
    handleImportComplete,
    isSaving,
    openEditQuestion,
    openModal,
    resolveSaveStatus,
    saveQuestion,
    setDraft,
    setDuplicateCompare,
  } = useQuestionEditorController({
    lessonOptions,
    pageItems,
    onCloseDetail: () => setDetailQuestionId(null),
  });
  const {
    closeDeleteDialog,
    confirmDelete,
    deleteDialog,
    deletingQuestionId,
    isDeleting,
    isDeletingSelected,
    requestDeleteQuestion,
    requestDeleteSelected,
  } = useQuestionDeleteController({
    selectedCount,
    selectedIds,
    clearSelection,
    onDeletedQuestion: (id) => {
      setDetailQuestionId((currentId) => (currentId === id ? null : currentId));
    },
  });

  useEffect(() => {
    pruneSelection(pageItems.map((q) => q.id));
  }, [pageItems, pruneSelection]);

  function handleFiltersChange(nextFilters: QuestionFilters) {
    const normalizedFilters = normalizeQuestionHierarchyFilters(filters, nextFilters);

    resetPage();
    setFilters(normalizedFilters);
  }

  function handleSearchChange(search: string) {
    setFilters((current) => ({ ...current, search }));
  }

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, resetPage]);

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

  const filterOptions = useQuestionHierarchyFilterOptions({
    filters,
    metadataCourses: metadataQuery.data?.courses ?? [],
    lessonOptions,
  });

  const tableLoading = isPageLoading || isSearchPending;

  return (
    <div className="space-y-gutter">
      <QuestionLibraryHeader onOpenModal={openModal} />

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
        canDelete={selectedCount > 0 && !isDeleting}
        canSelectChapter={filterOptions.canSelectChapter}
        canSelectLesson={filterOptions.canSelectLesson}
        chapterOptions={filterOptions.chapterOptions}
        courseOptions={filterOptions.courseOptions}
        deletingSelected={isDeletingSelected}
        filters={filters}
        lessonOptions={filterOptions.lessonOptions}
        onChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onApproveSelected={approveSelected}
        onDeleteSelected={requestDeleteSelected}
        onOpenExport={() => openModal("export")}
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
        deletingQuestionId={deletingQuestionId}
        isSelected={isSelected}
        onDelete={requestDeleteQuestion}
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
      <ConfirmQuestionDeleteModal
        confirmLabel={deleteDialog?.confirmLabel ?? ""}
        description={deleteDialog?.description ?? ""}
        isPending={isDeleting}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        open={deleteDialog !== null}
        title={deleteDialog?.title ?? ""}
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
