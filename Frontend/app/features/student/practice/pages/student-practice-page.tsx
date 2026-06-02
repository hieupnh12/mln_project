import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import {
  getStudentCoursePath,
  getStudentPracticePath,
  STUDENT_ROUTES,
} from "../../constants/student-routes.constants";
import { useCourseSubjectQuery } from "../../course-learning/hooks/use-course-learning-queries";
import { PracticeSessionView } from "../components/practice-session-view";
import { PracticeSetupPanel } from "../components/practice-setup-panel";
import { PracticeTestsSidebar } from "../components/practice-tests-sidebar";
import {
  DEFAULT_PRACTICE_SETTINGS,
  PRACTICE_QUERY_KEYS,
  practiceTestCards,
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
  const navigate = useNavigate();
  const subjectId = useMemo(() => parseSubjectId(courseId), [courseId]);

  const [phase, setPhase] = useState<PracticePhase>("setup");
  const [scope, setScope] = useState<PracticeScope>({ chapterId: null, lessonId: null });
  const [settings, setSettings] = useState<PracticeModeSettings>(DEFAULT_PRACTICE_SETTINGS);
  const [activeTestId, setActiveTestId] = useState(practiceTestCards[0]?.id ?? "quick-ch1");

  const subjectQuery = useCourseSubjectQuery(subjectId);
  const { chaptersQuery, lessonsQuery } = usePracticeScope(subjectId, scope);

  const questionsQuery = useQuery({
    queryKey:
      subjectId == null
        ? PRACTICE_QUERY_KEYS.root
        : PRACTICE_QUERY_KEYS.questions(subjectId, scope.chapterId, scope.lessonId),
    queryFn: () => getPracticeQuestions(scope),
    enabled: subjectId != null,
  });

  const session = usePracticeSession({
    questions: questionsQuery.data ?? [],
    settings,
    onAutoAdvance: () => undefined,
  });

  const courseTitle = subjectQuery.data?.title ?? "Môn học";
  const exitHref = subjectId == null ? STUDENT_ROUTES.dashboard : getStudentCoursePath(String(subjectId));

  const handleStart = useCallback(() => {
    if ((questionsQuery.data?.length ?? 0) === 0) {
      showInfoToast("Chưa có câu hỏi trong phạm vi đã chọn.");
      return;
    }
    session.startSession();
    setPhase("session");
  }, [questionsQuery.data?.length, session]);

  const handleEnd = useCallback(() => {
    setPhase("setup");
    showInfoToast("Đã kết thúc phiên luyện tập.");
  }, []);

  if (subjectId == null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-gutter">
        <p className="text-error">Khóa học không hợp lệ.</p>
        <Link className="mt-4 text-primary underline" to={STUDENT_ROUTES.dashboard}>
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background font-body-md text-on-background">
      <div className="pointer-events-none fixed top-[-10%] right-[-5%] z-[-1] h-[400px] w-[400px] rounded-full bg-secondary-container/10 blur-[100px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-5%] z-[-1] h-[500px] w-[500px] rounded-full bg-[#f6e6de]/10 blur-[120px]" />

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
            <PracticeSetupPanel
              canStart={!questionsQuery.isLoading && (questionsQuery.data?.length ?? 0) > 0}
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
            <p className="py-12 text-center text-on-surface-variant">Không có câu hỏi trắc nghiệm.</p>
          ) : null}
        </div>

        {phase === "session" ? (
          <div className="hidden shrink-0 px-margin-mobile py-gutter lg:block lg:px-gutter">
            <PracticeTestsSidebar
              activeTestId={activeTestId}
              onSelectTest={(testId) => {
                setActiveTestId(testId);
                session.loadNextQuestion();
              }}
              tests={practiceTestCards.map((test) => ({
                ...test,
                isActive: test.id === activeTestId,
              }))}
            />
          </div>
        ) : (
          <PracticeTestsSidebar
            activeTestId={activeTestId}
            onSelectTest={setActiveTestId}
            tests={practiceTestCards.map((test) => ({
              ...test,
              isActive: test.id === activeTestId,
            }))}
          />
        )}
      </div>

      {phase === "setup" ? (
        <section className="mx-auto mt-8 max-w-7xl px-margin-mobile pb-12 md:px-margin-desktop">
          <h3 className="mb-4 text-label-md font-bold text-primary lg:hidden">Các bài kiểm tra</h3>
          <div className="grid gap-3 lg:hidden">
            {practiceTestCards.map((test) => (
              <button
                className="rounded-xl border border-outline-variant/20 bg-white p-4 text-left"
                key={test.id}
                onClick={() => navigate(getStudentPracticePath(String(subjectId)))}
                type="button"
              >
                <p className="font-semibold text-primary">{test.title}</p>
                <p className="text-label-sm text-on-surface-variant">{test.description}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
