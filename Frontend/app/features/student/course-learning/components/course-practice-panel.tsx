import { PracticeInlineToolbar } from "../../practice/components/practice-inline-toolbar";
import { PracticeSessionContent } from "../../practice/components/practice-session-content";
import { PracticeSettingsSidebar } from "../../practice/components/practice-settings-sidebar";
import { useCoursePractice } from "../../practice/hooks/use-course-practice";
import { formatSessionTime } from "../../practice/utils/format-session-time";

type CoursePracticePanelProps = {
  subjectId: number;
  active: boolean;
};

export function CoursePracticePanel({ subjectId, active }: CoursePracticePanelProps) {
  const practice = useCoursePractice({ subjectId, active });
  const { session, questionsQuery } = practice;

  if (questionsQuery.isLoading) {
    return (
      <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-white p-gutter">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-container" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-container-low" />
        <div className="h-14 animate-pulse rounded-xl bg-surface-container-low" />
      </div>
    );
  }

  if (questionsQuery.isError) {
    return (
      <div className="rounded-xl border border-error/30 bg-error-container/20 p-gutter text-center">
        <p className="text-body-md text-error">Không tải được câu hỏi luyện tập.</p>
        <button
          className="mt-3 text-label-md font-medium text-primary underline"
          onClick={() => questionsQuery.refetch()}
          type="button"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (session.poolEmpty || !session.currentQuestion) {
    return (
      <p className="rounded-xl border border-outline-variant/20 bg-white p-gutter text-center text-on-surface-variant">
        Chưa có câu hỏi trắc nghiệm trong phạm vi đã chọn.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <article className="rounded-xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] md:p-lg">
          <PracticeInlineToolbar
            questionLabel={`Câu hỏi ${session.displayIndex}`}
            sessionTimeLabel={formatSessionTime(session.stats.sessionSeconds)}
          />
          <PracticeSessionContent
            answerState={session.answerState}
            countdownActive={session.countdownActive}
            currentQuestion={session.currentQuestion}
            displayIndex={session.displayIndex}
            onContinue={session.handleContinue}
            onCountdownComplete={session.handleCountdownComplete}
            onSelectOption={session.handleSelectOption}
            selectedOptionIndex={session.selectedOptionIndex}
            settings={practice.settings}
          />
        </article>
      </div>

      <div className="min-w-0 lg:col-span-4">
        <PracticeSettingsSidebar
          activeTestId={practice.activeTestId}
          chapters={practice.chaptersQuery.data}
          chaptersLoading={practice.chaptersQuery.isLoading}
          lessons={practice.lessonsQuery.data}
          lessonsLoading={practice.lessonsQuery.isLoading}
          onScopeChange={practice.setScope}
          onSelectTest={(testId) => {
            practice.setActiveTestId(testId);
            session.loadNextQuestion();
          }}
          onSettingsChange={practice.setSettings}
          scope={practice.scope}
          settings={practice.settings}
          tests={practice.practiceTestCards.map((test) => ({
            ...test,
            isActive: test.id === practice.activeTestId,
          }))}
        />
      </div>
    </div>
  );
}
