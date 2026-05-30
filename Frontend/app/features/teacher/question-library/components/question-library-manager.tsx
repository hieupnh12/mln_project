import { useEffect, useMemo, useState } from "react";

import {
  emptyQuestionDraft,
  questionItems,
} from "../constants/question-library.constants";
import { useQuestionPagination } from "../hooks/use-question-pagination";
import { useQuestionSelection } from "../hooks/use-question-selection";
import type { QuestionDraft, QuestionFilters, QuestionModalId } from "../types/question-library.types";
import { filterQuestions } from "../utils/question-library-filters";
import { createQuestionsFromImportPreview } from "../utils/import-batch-mutations";
import { createQuestionFromDraft } from "../utils/question-library-mutations";
import type { QuestionStatus } from "../types/question-library.types";
import { computeQuestionStats } from "../utils/question-library-stats";
import { AddQuestionModal } from "./modals/add-question-modal";
import { ExportExamModal } from "./modals/export-exam-modal";
import { ImportBatchModal } from "./modals/import-batch-modal";
import type { ExportConfig, RandomExamConfig } from "../types/export-exam.types";
import {
  createDefaultFilters,
  QuestionFiltersBar,
} from "./question-filters-bar";
import { QuestionLibraryHeader } from "./question-library-header";
import { QuestionPromoSection } from "./question-promo-section";
import { QuestionStatsCards } from "./question-stats-cards";
import { QuestionTable } from "./question-table";
import { QuestionTablePagination } from "./question-table-pagination";

export function QuestionLibraryManager() {
  const [questions, setQuestions] = useState(questionItems);
  const [filters, setFilters] = useState<QuestionFilters>(createDefaultFilters);
  const [activeModal, setActiveModal] = useState<QuestionModalId | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQuestionDraft);

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, filters),
    [filters, questions],
  );

  const stats = useMemo(() => computeQuestionStats(questions), [questions]);

  const {
    pageItems,
    page,
    totalPages,
    rangeStart,
    rangeEnd,
    goToPage,
    resetPage,
  } = useQuestionPagination(filteredQuestions);

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
    pruneSelection(filteredQuestions.map((q) => q.id));
  }, [filteredQuestions, pruneSelection]);

  function closeModal() {
    setActiveModal(null);
  }

  function saveQuestion(status: QuestionStatus) {
    if (!draft.question.trim()) return;
    setQuestions((current) => [
      createQuestionFromDraft(draft, current.length, status),
      ...current,
    ]);
    setDraft(emptyQuestionDraft);
    closeModal();
  }

  function handleImportComplete(count: number) {
    const imported = createQuestionsFromImportPreview(questions.length, count);
    setQuestions((current) => [...imported, ...current]);
  }

  function handleDiscardDraft() {
    setDraft(emptyQuestionDraft);
    closeModal();
  }

  function deleteQuestion(id: string) {
    setQuestions((current) => current.filter((q) => q.id !== id));
  }

  function handleDeleteSelected() {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedCount} câu hỏi đã chọn? Thao tác này không thể hoàn tác.`,
    );
    if (!confirmed) return;
    setQuestions((current) => current.filter((q) => !isSelected(q.id)));
    clearSelection();
  }

  function handleExport(config: ExportConfig) {
    window.alert(
      `Đang xuất ${config.format.toUpperCase()} — trạng thái: ${config.statusFilter} (demo).`,
    );
    closeModal();
  }

  function handleRandomGenerate(config: RandomExamConfig) {
    const pool = filteredQuestions.filter((q) =>
      config.selectedChapterIds.includes(q.chapter),
    );
    const source = pool.length > 0 ? pool : filteredQuestions;
    const picked = [...source]
      .sort(() => Math.random() - 0.5)
      .slice(0, config.totalCount);
    window.alert(`Đã chọn ${picked.length} câu hỏi cho đề thi (demo).`);
  }

  return (
    <div className="space-y-gutter">
      <QuestionLibraryHeader onOpenModal={setActiveModal} />
      <QuestionStatsCards stats={stats} />
      <QuestionFiltersBar
        canDelete={selectedCount > 0}
        filters={filters}
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
            totalItems={filteredQuestions.length}
            totalPages={totalPages}
          />
        }
        isSelected={isSelected}
        onDelete={deleteQuestion}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        questions={pageItems}
      />
      <QuestionPromoSection />

      <AddQuestionModal
        draft={draft}
        onClose={closeModal}
        onDiscard={handleDiscardDraft}
        onDraftChange={setDraft}
        onPublish={() => saveQuestion("Đã xuất bản")}
        onSaveDraft={() => saveQuestion("Bản nháp")}
        open={activeModal === "add"}
      />
      <ImportBatchModal
        onClose={closeModal}
        onImportComplete={handleImportComplete}
        open={activeModal === "import"}
      />
      <ExportExamModal
        onClose={closeModal}
        onExport={handleExport}
        onGenerate={handleRandomGenerate}
        open={activeModal === "export"}
        poolSize={filteredQuestions.length}
      />
    </div>
  );
}
