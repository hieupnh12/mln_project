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
      <div className="mx-auto flex max-w-7xl min-h-[calc(100svh-5.5rem)] flex-col">
        <div className="sticky top-0 z-20 shrink-0 space-y-2 border-b border-outline-variant/15 bg-background/95 pb-sm backdrop-blur-sm">
          <QuizManagementHeader onCreateQuiz={controller.openCreateQuiz} />
          <QuizListSummaryCards
            activeStatus={controller.filters.status}
            onStatusFilter={(status) =>
              controller.setFilters({ ...controller.filters, status })
            }
            summary={controller.summary}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col pt-sm">
          <QuizListView
            courseOptions={controller.courseOptions}
            filters={controller.filters}
            isError={controller.listQuery.isError}
            isLoading={controller.listQuery.isLoading}
            items={controller.listItems}
            onCreateQuiz={controller.openCreateQuiz}
            onDuplicate={controller.duplicateQuizById}
            onEdit={controller.openEditQuiz}
            onFiltersChange={controller.setFilters}
            onFiltersReset={() => controller.setFilters(defaultQuizFilters)}
            onRetry={() => controller.listQuery.refetch()}
            totalCount={controller.listQuery.data?.total ?? controller.listItems.length}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-md">
      <QuizEditorView
        activeTab={controller.editorTab}
        candidateCount={controller.candidateQuery.data?.total ?? 0}
        candidateLoading={controller.candidateQuery.isLoading}
        candidatePage={controller.candidatePage}
        candidateQuestions={controller.candidateQuery.data?.items ?? []}
        candidateTotal={controller.candidateQuery.data?.total ?? 0}
        chapterOptions={controller.chapterOptions}
        courseOptions={controller.courseOptions}
        difficultyFilter={controller.candidateDifficulty}
        isLoadingDetail={controller.isLoadingDetail}
        isNew={controller.editorQuizId == null}
        isPublished={controller.isPublished}
        isSaving={controller.isSaving}
        lessonOptions={controller.lessonOptions}
        onAddQuestion={controller.addQuestion}
        onBack={controller.backToList}
        onCandidatePageChange={controller.setCandidatePage}
        onClearQuestions={controller.clearQuestions}
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
