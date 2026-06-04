import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCoursePath,
  STUDENT_ROUTES,
} from "../../constants/student-routes.constants";
import { useCourseSubjectQuery } from "../../course-learning/hooks/use-course-learning-queries";
import { PracticeSessionView } from "../components/practice-session-view";
import { PracticeSetupPanel } from "../components/practice-setup-panel";
import { PracticeTestsSidebar } from "../components/practice-tests-sidebar";
import {
  DEFAULT_PRACTICE_SETTINGS,
  PRACTICE_QUERY_KEYS,
} from "../constants/practice.constants";
import { usePracticeScope } from "../hooks/use-practice-scope";
import { usePracticeSession } from "../hooks/use-practice-session";
import { getPracticeQuestions } from "../services/practice.service";
import type { PracticeModeSettings, PracticeScope } from "../types/practice.types";
import { showInfoToast } from "../../../../shared/utils/toast";

function parseSubjectId(courseId: string | undefined) {
  if (!courseId) {
    return null;
  }
  const parsed = Number(courseId);
  return Number.isNaN(parsed) ? null : parsed;
}

type PracticePhase = "setup" | "session";

export function StudentPracticePage() {
  const { courseId } = useParams();
  const subjectId = useMemo(() => parseSubjectId(courseId), [courseId]);

  const [phase, setPhase] = useState<PracticePhase>("setup");
  const [scope, setScope] = useState<PracticeScope>({ chapterId: null, lessonId: null });
  const [settings, setSettings] = useState<PracticeModeSettings>(DEFAULT_PRACTICE_SETTINGS);

  const subjectQuery = useCourseSubjectQuery(subjectId);
  const { chaptersQuery, lessonsQuery } = usePracticeScope(subjectId, scope);

  const questionsQuery = useQuery({
    queryKey:
      subjectId == null
        ? PRACTICE_QUERY_KEYS.root
        : PRACTICE_QUERY_KEYS.questions(subjectId, scope.chapterId, scope.lessonId),
    queryFn: () => getPracticeQuestions(subjectId as number, scope),
    enabled: subjectId != null,
  });

  const questions = questionsQuery.data ?? [];

  const session = usePracticeSession({
    questions,
    settings,
    onAutoAdvance: () => undefined,
  });

  const courseTitle = subjectQuery.data?.title ?? "Môn học";
  const exitHref = subjectId == null ? STUDENT_ROUTES.dashboard : getStudentCoursePath(String(subjectId));

  const handleStart = useCallback(() => {
    if (questions.length === 0) {
      showInfoToast("Chưa có câu hỏi trong phạm vi đã chọn.");
      return;
    }
    setPhase("session");
  }, [questions.length]);

  useEffect(() => {
    if (
      phase !== "session" ||
      questionsQuery.isLoading ||
      questionsQuery.isFetching ||
      questions.length === 0
    ) {
      return;
    }

    session.startSession();
  }, [
    phase,
    questions.length,
    questionsQuery.isFetching,
    questionsQuery.isLoading,
    session.startSession,
  ]);

  const handleEnd = useCallback(() => {
    setPhase("setup");
    showInfoToast("Đã kết thúc phiên luyện tập.");
  }, []);

  if (subjectId == null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-gutter">
        <div className="rounded-xl border border-error/30 bg-error-container/30 p-gutter text-center">
          <p className="text-error">Khóa học không hợp lệ.</p>
          <Link className="mt-4 inline-flex text-primary underline" to={STUDENT_ROUTES.dashboard}>
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background font-body-md text-on-background">
      {phase === "setup" ? (
        <header className="sticky top-0 z-50 border-b border-outline-variant/10 bg-background">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-margin-mobile py-4 md:px-margin-desktop">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container"
              to={exitHref}
            >
              <MaterialIcon>arrow_back</MaterialIcon>
            </Link>
            <div>
              <h1 className="text-headline-md font-semibold text-primary">Luyện tập kiểm tra</h1>
              <p className="text-label-md text-on-surface-variant">{courseTitle}</p>
            </div>
          </div>
        </header>
      ) : null}

      <div
        className={
          phase === "session"
            ? "flex w-full flex-col lg:flex-row"
            : "mx-auto flex w-full max-w-7xl gap-gutter px-margin-mobile py-gutter md:px-margin-desktop"
        }
      >
        <div className={phase === "session" ? "min-w-0 flex-1" : "min-w-0 flex-1"}>
          {phase === "setup" ? (
            <div className="space-y-4">
              {questionsQuery.isLoading ? (
                <div className="space-y-4 rounded-xl border border-outline-variant/20 bg-white p-gutter">
                  <div className="h-8 w-56 animate-pulse rounded-lg bg-surface-container" />
                  <div className="h-40 animate-pulse rounded-xl bg-surface-container-low" />
                </div>
              ) : null}

              {questionsQuery.isError ? (
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
              ) : null}

              {!questionsQuery.isLoading && !questionsQuery.isError && questions.length === 0 ? (
                <p className="rounded-xl border border-outline-variant/20 bg-white p-gutter text-center text-on-surface-variant">
                  Chưa có câu hỏi trắc nghiệm trong phạm vi đã chọn.
                </p>
              ) : null}

              {!questionsQuery.isLoading && !questionsQuery.isError ? (
                <PracticeSetupPanel
                  canStart={!questionsQuery.isFetching && questions.length > 0}
                  chapters={chaptersQuery.data}
                  chaptersLoading={chaptersQuery.isLoading}
                  lessons={lessonsQuery.data}
                  lessonsLoading={lessonsQuery.isLoading}
                  onScopeChange={setScope}
                  onSettingsChange={setSettings}
                  onStart={handleStart}
                  scope={scope}
                  settings={settings}
                />
              ) : null}
            </div>
          ) : null}

          {phase === "session" && session.currentQuestion ? (
            <PracticeSessionView
              answerState={session.answerState}
              countdownActive={session.countdownActive}
              courseTitle={courseTitle}
              currentQuestion={session.currentQuestion}
              displayIndex={session.displayIndex}
              exitHref={exitHref}
              onContinue={session.handleContinue}
              onCountdownComplete={session.handleCountdownComplete}
              onEnd={handleEnd}
              onSelectOption={session.handleSelectOption}
              selectedOptionIndex={session.selectedOptionIndex}
              settings={settings}
              stats={session.stats}
            />
          ) : null}

          {phase === "session" && session.poolEmpty ? (
            <p className="py-12 text-center text-on-surface-variant">
              Không có câu hỏi trắc nghiệm.
            </p>
          ) : null}
        </div>

        {phase === "session" ? (
          <div className="hidden shrink-0 px-margin-mobile py-gutter lg:block lg:px-gutter">
            <PracticeTestsSidebar
              activeTestId=""
              onSelectTest={() => undefined}
              tests={[]}
            />
          </div>
        ) : (
          <PracticeTestsSidebar
            activeTestId=""
            onSelectTest={() => undefined}
            tests={[]}
          />
        )}
      </div>

      {phase === "setup" ? (
        <section className="mx-auto mt-8 max-w-7xl px-margin-mobile pb-12 md:px-margin-desktop lg:hidden">
          <PracticeTestsSidebar
            activeTestId=""
            embedded
            onSelectTest={() => undefined}
            tests={[]}
          />
        </section>
      ) : null}
    </div>
  );
}
