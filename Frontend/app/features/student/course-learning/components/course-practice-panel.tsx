import { CircleHelp, RefreshCw } from "lucide-react";

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
      <article className="space-y-3 rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5">
        <div className="h-10 w-full animate-pulse rounded-lg bg-landing-gray" />
        <div className="h-28 animate-pulse rounded-xl bg-landing-gray" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-12 animate-pulse rounded-xl bg-landing-gray" key={index} />
        ))}
      </article>
    );
  }

  if (isError) {
    return (
      <article className="rounded-xl border border-error/30 bg-error-container/20 p-gutter text-center">
        <p className="text-body-md text-error">Không tải được câu hỏi luyện tập.</p>
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-4 py-2 text-label-md font-semibold text-on-primary"
          onClick={onRetry}
          type="button"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Thử lại
        </button>
      </article>
    );
  }

  if (isEmpty || !session.currentQuestion) {
    return (
      <article className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white p-gutter text-center shadow-lg shadow-landing-text/5">
        <CircleHelp aria-hidden="true" className="h-10 w-10 text-landing-red" />
        <p className="mt-4 text-headline-md font-semibold text-landing-text">
          Chưa có câu hỏi trong phạm vi này
        </p>
        <p className="mt-2 text-label-md text-landing-text-soft">
          Chọn chương hoặc bài học khác trong phần thiết lập.
        </p>
      </article>
    );
  }

  return (
    <article className="relative rounded-xl border border-outline-variant/35 bg-landing-white p-4 shadow-xl shadow-landing-text/5 md:p-6">
      {isFetching ? (
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-xl bg-landing-gray">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-landing-red" />
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
    <section>
      <div className="mb-md">
        <p className="text-label-md font-semibold text-landing-red">Luyện tập thích ứng</p>
        <h2 className="mt-2 font-serif text-headline-lg font-semibold text-landing-text">
          Củng cố kiến thức
        </h2>
        <p className="mt-2 text-body-md text-landing-text-soft">
          Chọn phạm vi và luyện từng câu với phản hồi ngay lập tức.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
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

        <div className="min-w-0">
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
    </section>
  );
}
