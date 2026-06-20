import { useState } from "react";

import { TeacherPageShell } from "../../components/teacher-page-shell";
import { useQuestionMetadataQuery } from "../../question-library/hooks/use-question-library-queries";
import { defaultQuizFilters, QUIZ_CANDIDATE_PAGE_SIZE } from "../constants/quiz-management.constants";
import { useQuizManagementController } from "../hooks/use-quiz-management-controller";
import { ImportExamQuizModal } from "./modals/import-exam-quiz/import-exam-quiz-modal";
import { QuizEditorView } from "./quiz-editor-view";
import { QuizListView } from "./quiz-list-view";
import { QuizListSummaryCards } from "./quiz-list-summary-cards";
import { QuizManagementHeader } from "./quiz-management-header";

export function QuizManagementManager() {
  const controller = useQuizManagementController();
  const metadataQuery = useQuestionMetadataQuery();
  const [importExamOpen, setImportExamOpen] = useState(false);

  const courseOptions = metadataQuery.data?.courses ?? [];
  const lessonOptions = metadataQuery.data?.lessonOptions ?? [];

  if (controller.view === "list") {
    return (
      <>
        <TeacherPageShell>
        <div className="space-y-md">
          <QuizManagementHeader
            onCreateQuiz={controller.openCreateQuiz}
            onImportExam={() => setImportExamOpen(true)}
          />

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
        </TeacherPageShell>

        <ImportExamQuizModal
          courseOptions={courseOptions}
          lessonOptions={lessonOptions}
          onClose={() => setImportExamOpen(false)}
          onOpenQuiz={(quizId) => {
            setImportExamOpen(false);
            controller.openEditQuiz(quizId);
          }}
          open={importExamOpen}
        />
      </>
    );
  }

  return (
    <TeacherPageShell>
    <div className="space-y-md">
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
        isDetailError={controller.isDetailError}
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
        onRetryDetail={() => {
          void controller.retryQuizDetail();
        }}
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
    </TeacherPageShell>
  );
}
