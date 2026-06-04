import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { getStudentCourseExamsTabPath, getStudentCoursePath } from "../../constants/student-routes.constants";
import { ExamQuestionNav } from "../components/exam-session/exam-question-nav";
import { ExamQuestionPanel } from "../components/exam-session/exam-question-panel";
import { ExamSessionHeader } from "../components/exam-session/exam-session-header";
import { ExamSessionSkeleton } from "../components/exam-session/exam-session-skeleton";
import { ExamSubmitConfirmDialog } from "../components/exam-submit-confirm-dialog";
import { EXAM_AUTOSAVE_INTERVAL_MS } from "../constants/exams-api.constants";
import {
  EXAM_TIMER_CRITICAL_SECONDS,
  EXAM_TIMER_WARNING_SECONDS,
} from "../constants/exam-ux.constants";
import { useExamSessionQuery } from "../hooks/use-exam-session-query";
import { useExamSubmitFlow } from "../hooks/use-exam-submit-flow";
import { useExamTimer } from "../hooks/use-exam-timer";
import type { ExamAnswerMap } from "../types/exam-session.types";
import {
  getExamDraftKey,
  loadExamDraft,
  saveExamDraft,
} from "../utils/exam-draft-storage";

function parseCourseId(value: string | undefined) {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function StudentExamSessionPage() {
  const { courseId, quizId } = useParams();
  const subjectId = useMemo(() => parseCourseId(courseId), [courseId]);

  const sessionQuery = useExamSessionQuery({ subjectId, quizId });
  const session = sessionQuery.data;

  const studentIdRaw = getAuthSession()?.user?.id;
  const studentId =
    studentIdRaw != null && studentIdRaw !== "" ? Number(studentIdRaw) : null;

  const draftKey =
    courseId && quizId ? getExamDraftKey(courseId, quizId, studentIdRaw) : "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswerMap>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const initialSeconds = (session?.durationMinutes ?? 45) * 60;

  const { timerLabel, remainingSeconds, setRemainingSeconds, isExpired } = useExamTimer({
    initialSeconds,
    active: Boolean(session),
  });

  const submitFlow = useExamSubmitFlow({
    subjectId,
    quizId,
    studentId,
    session,
    answers,
    draftKey,
    initialSeconds,
    remainingSeconds,
    isExpired,
  });

  useEffect(() => {
    if (!session || !draftKey) {
      return;
    }
    const draft = loadExamDraft(draftKey);
    if (!draft) {
      setRemainingSeconds(initialSeconds);
      return;
    }
    setCurrentIndex(draft.currentIndex);
    setAnswers(draft.answers);
    setFlagged(new Set(draft.flagged));
    if (draft.remainingSeconds > 0) {
      setRemainingSeconds(draft.remainingSeconds);
    }
  }, [draftKey, initialSeconds, session, setRemainingSeconds]);

  useEffect(() => {
    if (!session || !draftKey || submitFlow.isSubmitting) {
      return;
    }
    const interval = window.setInterval(() => {
      saveExamDraft(draftKey, {
        currentIndex,
        answers,
        flagged: Array.from(flagged),
        remainingSeconds,
      });
    }, EXAM_AUTOSAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [
    answers,
    currentIndex,
    draftKey,
    flagged,
    remainingSeconds,
    session,
    submitFlow.isSubmitting,
  ]);

  useEffect(() => {
    if (Object.keys(answers).length === 0 || submitFlow.isSubmitting) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, submitFlow.isSubmitting]);

  const questions = session?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => answers[q.id] != null).length;

  const isAnswered = useCallback(
    (index: number) => {
      const question = questions[index];
      return question != null && answers[question.id] != null;
    },
    [answers, questions],
  );

  function handleSelectAnswer(answerId: number) {
    if (!currentQuestion || submitFlow.isSubmitting) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  }

  function handleToggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  }

  if (subjectId == null || !quizId) {
    return (
      <div className="flex min-h-svh items-center justify-center p-gutter">
        <p className="text-error">Liên kết bài kiểm tra không hợp lệ.</p>
      </div>
    );
  }

  if (studentId == null) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="text-body-md font-medium text-primary">Vui lòng đăng nhập để làm bài kiểm tra.</p>
        <Link className="text-label-md font-medium text-secondary underline" to="/login">
          Đăng nhập
        </Link>
        <Link
          className="text-label-md text-on-surface-variant underline"
          to={getStudentCourseExamsTabPath(String(subjectId))}
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return <ExamSessionSkeleton />;
  }

  if (sessionQuery.isError || !session || !currentQuestion) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-gutter">
        <p className="text-error">Không tải được bài kiểm tra.</p>
        <Link
          className="text-label-md font-medium text-secondary underline"
          to={getStudentCourseExamsTabPath(String(subjectId))}
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const timerUrgent = remainingSeconds <= EXAM_TIMER_WARNING_SECONDS && remainingSeconds > 0;
  const timerCritical = remainingSeconds <= EXAM_TIMER_CRITICAL_SECONDS && remainingSeconds > 0;

  return (
    <div className="relative min-h-svh bg-background text-on-surface">
      <div className="pointer-events-none fixed -left-[10%] -top-[10%] -z-10 h-[40%] w-[40%] rounded-full bg-secondary-container/20 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-[10%] -right-[10%] -z-10 h-[30%] w-[30%] rounded-full bg-surface-container-high/30 blur-[100px]" />

      <ExamSessionHeader
        courseTitle={session.courseTitle}
        examTitle={session.title}
        isSubmitting={submitFlow.isSubmitting}
        onSubmit={submitFlow.requestSubmit}
        submitDisabled={submitFlow.isSubmitting}
        timerCritical={timerCritical}
        timerLabel={timerLabel}
        timerUrgent={timerUrgent}
      />

      <ExamSubmitConfirmDialog
        autoSubmit={submitFlow.autoSubmitMode}
        isSubmitting={submitFlow.isSubmitting}
        onCancel={submitFlow.cancelSubmit}
        onConfirm={() => void submitFlow.confirmSubmit()}
        open={submitFlow.confirmOpen}
        unansweredCount={submitFlow.unansweredCount}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-gutter px-margin-mobile pb-12 pt-24 md:flex-row md:px-margin-desktop">
        <ExamQuestionNav
          answeredCount={answeredCount}
          currentIndex={currentIndex}
          flaggedIndices={flagged}
          isAnswered={isAnswered}
          onSelect={setCurrentIndex}
          questions={questions}
        />

        <ExamQuestionPanel
          hasNext={currentIndex < questions.length - 1}
          hasPrevious={currentIndex > 0}
          isFlagged={flagged.has(currentIndex)}
          onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
          onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          onSelectAnswer={handleSelectAnswer}
          onToggleFlag={handleToggleFlag}
          question={currentQuestion}
          questionIndex={currentIndex}
          selectedAnswerId={answers[currentQuestion.id]}
          totalQuestions={questions.length}
        />
      </main>

      <Link
        className="fixed bottom-4 left-4 flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-sm text-on-surface-variant shadow-sm md:hidden"
        to={getStudentCoursePath(String(subjectId))}
      >
        <MaterialIcon>arrow_back</MaterialIcon>
        Thoát
      </Link>
    </div>
  );
}
