import { PracticeSessionContent } from "../../practice/components/practice-session-content";
import { PracticeSettingsSidebar } from "../../practice/components/practice-settings-sidebar";
import { useCoursePractice } from "../../practice/hooks/use-course-practice";
import type { PracticeModeSettings } from "../../practice/types/practice.types";

type CoursePracticePanelProps = {
  subjectId: number;
  active: boolean;
};

type CoursePracticeSession = ReturnType<typeof useCoursePractice>["session"];

type QuestionPaneProps = {
  isEmpty: boolean;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  onRetry: () => void;
  session: CoursePracticeSession;
  settings: PracticeModeSettings;
};

function QuestionPane({
  isEmpty,
  isError,
  isFetching,
  isLoading,
  onRetry,
  session,
  settings,
}: QuestionPaneProps) {
  if (isLoading) {
    return (
      <article className="space-y-3 rounded-xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <div className="h-10 w-full animate-pulse rounded-lg bg-surface-container-low" />
        <div className="h-28 animate-pulse rounded-xl bg-surface-container-low" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-12 animate-pulse rounded-xl bg-surface-container-low" key={index} />
        ))}
      </article>
    );
  }

  if (isError) {
    return (
      <article className="rounded-xl border border-error/30 bg-error-container/20 p-gutter text-center">
        <p className="text-body-md text-error">Không tải được câu hỏi luyện tập.</p>
        <button
          className="mt-3 text-label-md font-medium text-primary underline"
          onClick={onRetry}
          type="button"
        >
          Thử lại
        </button>
      </article>
    );
  }

  if (isEmpty || !session.currentQuestion) {
    return (
      <article className="rounded-xl border border-outline-variant/20 bg-white p-gutter text-center text-on-surface-variant shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <p>Chưa có câu hỏi trắc nghiệm trong phạm vi đã chọn.</p>
        <p className="mt-2 text-label-sm">Hãy chọn chương hoặc bài học khác ở khung bên cạnh.</p>
      </article>
    );
  }

  return (
    <article className="relative rounded-xl border border-outline-variant/20 bg-white p-4 shadow-[0_4px_20px_rgba(35,39,51,0.04)] md:p-5">
      {isFetching ? (
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-xl bg-surface-container-low">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-secondary" />
        </div>
      ) : null}
      <PracticeSessionContent
        answerState={session.answerState}
        countdownActive={session.countdownActive}
        currentQuestion={session.currentQuestion}
        displayIndex={session.displayIndex}
        onContinue={session.handleContinue}
        onCountdownComplete={session.handleCountdownComplete}
        onSelectOption={session.handleSelectOption}
        selectedOptionIndex={session.selectedOptionIndex}
        settings={settings}
      />
    </article>
  );
}

export function CoursePracticePanel({ subjectId, active }: CoursePracticePanelProps) {
  const practice = useCoursePractice({ subjectId, active });
  const { session, questionsQuery } = practice;

  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <QuestionPane
          isEmpty={session.poolEmpty || !session.currentQuestion}
          isError={questionsQuery.isError}
          isFetching={questionsQuery.isFetching}
          isLoading={questionsQuery.isLoading}
          onRetry={() => questionsQuery.refetch()}
          session={session}
          settings={practice.settings}
        />
      </div>

      <div className="min-w-0 lg:col-span-4">
        <PracticeSettingsSidebar
          chapters={practice.chaptersQuery.data}
          chaptersLoading={practice.chaptersQuery.isLoading}
          lessons={practice.lessonsQuery.data}
          lessonsLoading={practice.lessonsQuery.isLoading}
          onScopeChange={practice.setScope}
          onSettingsChange={practice.setSettings}
          scope={practice.scope}
          settings={practice.settings}
        />
      </div>
    </div>
  );
}
