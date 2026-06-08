import { defaultQuizFilters, QUIZ_CANDIDATE_PAGE_SIZE } from "../constants/quiz-management.constants";
import { useQuizManagementController } from "../hooks/use-quiz-management-controller";
import { QuizEditorView } from "./quiz-editor-view";
import { QuizListView } from "./quiz-list-view";
import { QuizListSummaryCards } from "./quiz-list-summary-cards";
import { QuizManagementHeader } from "./quiz-management-header";

export function QuizManagementManager() {
  const controller = useQuizManagementController();

  if (controller.view === "list") {
    return (
      <div className="space-y-gutter">
        <QuizManagementHeader onCreateQuiz={controller.openCreateQuiz} />

        <QuizListSummaryCards
          activeStatus={controller.filters.status}
          onStatusFilter={(status) =>
            controller.setFilters({ ...controller.filters, status })
          }
          summary={controller.summary}
        />

        <QuizListView
          courseOptions={controller.courseOptions}
          filters={controller.filters}
          isError={controller.listQuery.isError}
          isLoading={controller.listQuery.isLoading}
          items={controller.listItems}
          onClose={controller.closeQuizById}
          onCreateQuiz={controller.openCreateQuiz}
          onDelete={controller.deleteQuizById}
          onDuplicate={controller.duplicateQuizById}
          onEdit={controller.openEditQuiz}
          onReopen={controller.reopenQuizById}
          onFiltersChange={controller.setFilters}
          onFiltersReset={() => controller.setFilters(defaultQuizFilters)}
          onRetry={() => controller.listQuery.refetch()}
          onSearchChange={(search) =>
            controller.setFilters({ ...controller.filters, search })
          }
          totalCount={controller.listQuery.data?.total ?? controller.listItems.length}
        />
      </div>
    );
  }

  return (
    <div className="space-y-gutter">
      <QuizEditorView
        activeTab={controller.editorTab}
        candidateCount={controller.candidateCount}
        candidateLoading={controller.candidateQuery.isFetching}
        candidatePage={controller.candidatePage}
        candidateQuestions={controller.candidateQuery.data?.items ?? []}
        candidateTotal={controller.candidateQuery.data?.total ?? 0}
        chapterOptions={controller.chapterOptions}
        courseOptions={controller.courseOptions}
        difficultyFilter={controller.candidateDifficulty}
        hasActiveFilter={controller.hasCandidateFilter}
        isCandidateSearchPending={controller.isCandidateSearchPending}
        isGeneratingRandom={controller.isGeneratingRandom}
        isLoadingDetail={controller.isLoadingDetail}
        isNew={controller.editorQuizId == null}
        isPublished={controller.isPublished}
        isSaving={controller.isSaving}
        lessonOptions={controller.lessonOptions}
        onAddQuestion={controller.addQuestion}
        onBack={controller.backToList}
        onCandidatePageChange={controller.setCandidatePage}
        onClearQuestions={controller.clearQuestions}
        onClose={() => {
          if (controller.editorQuizId) {
            void controller.closeQuizById(controller.editorQuizId);
          }
        }}
        onDelete={() => {
          if (controller.editorQuizId) {
            void controller.deleteQuizById(controller.editorQuizId);
          }
        }}
        onDifficultyFilterChange={(value) => {
          controller.setCandidateDifficulty(value);
          controller.setCandidatePage(0);
        }}
        onGenerateRandom={controller.generateRandomQuiz}
        onMoveQuestion={controller.moveQuestion}
        onPublish={controller.handlePublish}
        onRemoveQuestion={controller.removeQuestion}
        onSaveDraft={controller.saveDraft}
        onSearchChange={(value) => {
          controller.setCandidateSearch(value);
          controller.setCandidatePage(0);
        }}
        onSettingsChange={controller.setSettings}
        onTabChange={controller.setEditorTab}
        pageSize={QUIZ_CANDIDATE_PAGE_SIZE}
        quiz={controller.activeQuiz}
        search={controller.candidateSearch}
        selectedIds={controller.selectedIds}
        selectedQuestions={controller.selectedQuestions}
        settings={controller.settings}
      />
    </div>
  );
}
