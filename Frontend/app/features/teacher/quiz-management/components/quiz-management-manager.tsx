import { defaultQuizFilters, QUIZ_CANDIDATE_PAGE_SIZE } from "../constants/quiz-management.constants";
import { useQuizManagementController } from "../hooks/use-quiz-management-controller";
import { QuizEditorView } from "./quiz-editor-view";
import { QuizListView } from "./quiz-list-view";
import { QuizManagementHeader } from "./quiz-management-header";

export function QuizManagementManager() {
  const controller = useQuizManagementController();

  if (controller.view === "list") {
    return (
      <div className="mx-auto max-w-7xl space-y-md">
        <QuizManagementHeader
          draftCount={controller.summary.draftCount}
          onCreateQuiz={controller.openCreateQuiz}
          publishedCount={controller.summary.publishedCount}
          total={controller.summary.total}
        />
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
          summary={controller.summary}
          totalCount={controller.listQuery.data?.total ?? controller.listItems.length}
        />
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
