import type { QuestionItem, QuestionListItem } from "../../question-library/types/question-library.types";
import type { QuizEditorTab, QuizListItem, QuizSettings } from "../types/quiz-management.types";
import {
  getQuizReadinessChecks,
  isQuizReadyForPublish,
} from "../utils/quiz-ui.helpers";
import { QuizEditorFooter } from "./quiz-editor-footer";
import { QuizEditorNav } from "./quiz-editor-nav";
import { QuizEditorHeader } from "./quiz-management-header";
import { QuizPublishPanel } from "./quiz-publish-panel";
import { QuizQuestionWorkspace } from "./quiz-question-workspace";
import { QuizSettingsSectionHint, QuizSettingsTab } from "./quiz-settings-tab";

type QuizEditorViewProps = {
  activeTab: QuizEditorTab;
  candidateCount: number;
  candidateLoading: boolean;
  candidatePage: number;
  candidateQuestions: QuestionListItem[];
  candidateTotal: number;
  chapterOptions: string[];
  courseOptions: string[];
  difficultyFilter: string;
  isLoadingDetail?: boolean;
  isNew: boolean;
  isPublished: boolean;
  isSaving?: boolean;
  lessonOptions: string[];
  onAddQuestion: (question: QuestionListItem) => void;
  onBack: () => void;
  onCandidatePageChange: (page: number) => void;
  onClearQuestions: () => void;
  onDifficultyFilterChange: (value: string) => void;
  onGenerateRandom: () => void;
  onMoveQuestion: (fromIndex: number, toIndex: number) => void;
  onPublish: () => void;
  onRemoveQuestion: (id: string) => void;
  onSaveDraft: () => void;
  onSearchChange: (value: string) => void;
  onSettingsChange: (settings: QuizSettings) => void;
  onTabChange: (tab: QuizEditorTab) => void;
  pageSize: number;
  quiz: QuizListItem | null;
  search: string;
  selectedIds: string[];
  selectedQuestions: QuestionItem[];
  settings: QuizSettings;
};

export function QuizEditorView({
  activeTab,
  candidateCount,
  candidateLoading,
  candidatePage,
  candidateQuestions,
  candidateTotal,
  chapterOptions,
  courseOptions,
  difficultyFilter,
  isLoadingDetail = false,
  isNew,
  isPublished,
  isSaving = false,
  lessonOptions,
  onAddQuestion,
  onBack,
  onCandidatePageChange,
  onClearQuestions,
  onDifficultyFilterChange,
  onGenerateRandom,
  onMoveQuestion,
  onPublish,
  onRemoveQuestion,
  onSaveDraft,
  onSearchChange,
  onSettingsChange,
  onTabChange,
  pageSize,
  quiz,
  search,
  selectedIds,
  selectedQuestions,
  settings,
}: QuizEditorViewProps) {
  const stepComplete = {
    settings: settings.title.trim().length >= 3,
    questions: selectedIds.length >= 1,
    publish: isQuizReadyForPublish(
      getQuizReadinessChecks(
        settings.title,
        selectedIds.length,
        settings.duration,
        settings.passingScore,
      ),
    ),
  };

  return (
    <section className="space-y-sm rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-md shadow-sm">
      <QuizEditorHeader
        isNew={isNew}
        onBack={onBack}
        questionCount={selectedIds.length}
        quiz={quiz}
        settings={settings}
      />
      <QuizEditorNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        questionCount={selectedIds.length}
        stepComplete={stepComplete}
      />

      {isLoadingDetail ? <EditorSkeleton activeTab={activeTab} /> : null}

      {!isLoadingDetail && activeTab === "settings" ? (
        <>
          <QuizSettingsSectionHint />
          <QuizSettingsTab
            candidateCount={candidateCount}
            chapterOptions={chapterOptions}
            courseOptions={courseOptions}
            lessonOptions={lessonOptions}
            onGenerateRandom={onGenerateRandom}
            onSettingsChange={onSettingsChange}
            selectedCount={selectedIds.length}
            settings={settings}
          />
        </>
      ) : null}

      {!isLoadingDetail && activeTab === "questions" ? (
        <QuizQuestionWorkspace
          candidateCount={candidateCount}
          candidateLoading={candidateLoading}
          candidatePage={candidatePage}
          candidateQuestions={candidateQuestions}
          candidateTotal={candidateTotal}
          difficultyFilter={difficultyFilter}
          onAdd={onAddQuestion}
          onCandidatePageChange={onCandidatePageChange}
          onClearAll={onClearQuestions}
          onDifficultyFilterChange={onDifficultyFilterChange}
          onGenerateRandom={onGenerateRandom}
          onMove={onMoveQuestion}
          onRemove={onRemoveQuestion}
          onSearchChange={onSearchChange}
          pageSize={pageSize}
          randomCount={settings.randomCount}
          scopeLabel={settings}
          search={search}
          selectedIds={selectedIds}
          selectedQuestions={selectedQuestions}
        />
      ) : null}

      {!isLoadingDetail && activeTab === "publish" ? (
        <QuizPublishPanel
          isPublished={isPublished}
          onPublish={onPublish}
          onRemove={onRemoveQuestion}
          questions={selectedQuestions}
          settings={settings}
        />
      ) : null}

      {!isLoadingDetail ? (
        <QuizEditorFooter
          activeTab={activeTab}
          canPublish={stepComplete.publish}
          isPublished={isPublished || isSaving}
          onGoToTab={onTabChange}
          onPublish={onPublish}
          onSaveDraft={onSaveDraft}
        />
      ) : null}
    </section>
  );
}

function EditorSkeleton({ activeTab }: { activeTab: QuizEditorTab }) {
  return (
    <div aria-busy="true" aria-label={`Đang tải tab ${activeTab}`} className="space-y-sm">
      <div className="h-12 animate-pulse rounded-xl bg-surface-container-low" />
      <div className="h-48 animate-pulse rounded-xl bg-surface-container-low" />
      <div className="h-64 animate-pulse rounded-xl bg-surface-container-low" />
    </div>
  );
}
