import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { ApiRequestError } from "~/shared/services/api-client";
import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";

import { getStudentExamSummaryPath } from "../../constants/student-routes.constants";
import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { submitExamAttempt } from "../services/exams.service";
import type { ExamAnswerMap, ExamSession } from "../types/exam-session.types";
import type { SubmitExamResultDto } from "../types/exam-session-api.types";
import { clearExamDraft } from "../utils/exam-draft-storage";
import { countAnsweredQuestions, flattenExamAnswers } from "../utils/exam-answer.helpers";
import { saveExamSummary } from "../utils/exam-summary-storage";

type UseExamSubmitFlowOptions = {
  subjectId: number | null;
  quizId: string | undefined;
  studentId: number | null;
  session: ExamSession | undefined;
  answers: ExamAnswerMap;
  draftKey: string;
  initialSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
};

export function useExamSubmitFlow({
  subjectId,
  quizId,
  studentId,
  session,
  answers,
  draftKey,
  initialSeconds,
  remainingSeconds,
  isExpired,
}: UseExamSubmitFlowOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const autoSubmittedRef = useRef(false);
  const submitInFlightRef = useRef(false);
  const submitCompletedRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [autoSubmitMode, setAutoSubmitMode] = useState(false);

  const unansweredCount = Math.max(
    0,
    (session?.questions.length ?? 0)
      - countAnsweredQuestions((session?.questions ?? []).map((question) => question.id), answers),
  );

  const performSubmit = useCallback(async () => {
    if (subjectId == null || !quizId || studentId == null) {
      showErrorToast("Vui lòng đăng nhập để nộp bài kiểm tra.");
      return;
    }
    if (submitInFlightRef.current || submitCompletedRef.current) {
      return;
    }

    submitInFlightRef.current = true;
    setIsSubmitting(true);

    const payload = flattenExamAnswers(answers);
    const elapsedSeconds = Math.max(0, initialSeconds - remainingSeconds);
    const questionIds = (session?.questions ?? []).map((q) => q.id);

    let result: SubmitExamResultDto;
    try {
      result = await runWithAsyncActivity({
        label: "Đang nộp bài kiểm tra",
        detail: `${payload.length}/${questionIds.length} câu đã trả lời`,
        simulateProgress: true,
        task: async (updateProgress) => {
          updateProgress(20, "Đang gửi câu trả lời...");
          const submitResult = await submitExamAttempt(
            subjectId,
            quizId,
            studentId,
            questionIds,
            payload,
            elapsedSeconds,
          );
          updateProgress(100, "Đã chấm điểm");
          return submitResult;
        },
      });
    } catch (error) {
      showErrorToast(
        error instanceof ApiRequestError
          ? error.message
          : "Không nộp được bài. Vui lòng thử lại.",
      );
      autoSubmittedRef.current = false;
      setIsSubmitting(false);
      submitInFlightRef.current = false;
      return;
    }

    submitCompletedRef.current = true;
    setHasSubmitted(true);
    setConfirmOpen(false);
    clearExamDraft(draftKey);
    saveExamSummary(result.attemptId, result.summary);
    void queryClient.invalidateQueries({ queryKey: EXAMS_QUERY_KEYS.catalogRoot });
    showSuccessToast(`Đã nộp bài. Kết quả: ${result.scoreLabel}`);
    setIsSubmitting(false);
    submitInFlightRef.current = false;
    navigate(getStudentExamSummaryPath(String(subjectId), quizId, result.attemptId), {
      state: { summary: result.summary },
    });
  }, [
    answers,
    draftKey,
    initialSeconds,
    navigate,
    queryClient,
    quizId,
    remainingSeconds,
    session?.questions,
    studentId,
    subjectId,
  ]);

  const requestSubmit = useCallback(() => {
    if (studentId == null) {
      showErrorToast("Vui lòng đăng nhập để nộp bài kiểm tra.");
      return;
    }
    if (submitInFlightRef.current || submitCompletedRef.current) {
      return;
    }
    setAutoSubmitMode(false);
    setConfirmOpen(true);
  }, [studentId]);

  useEffect(() => {
    if (!session || isSubmitting || autoSubmittedRef.current || !isExpired) {
      return;
    }
    autoSubmittedRef.current = true;
    setAutoSubmitMode(true);
    setConfirmOpen(true);
    showInfoToast("Hết thời gian làm bài. Vui lòng xác nhận nộp bài.");
  }, [isExpired, isSubmitting, session]);

  return {
    isSubmitting,
    hasSubmitted,
    submitDisabled: isSubmitting || hasSubmitted,
    confirmOpen,
    autoSubmitMode,
    unansweredCount,
    requestSubmit,
    confirmSubmit: performSubmit,
    cancelSubmit: () => {
      if (autoSubmitMode) {
        return;
      }
      setConfirmOpen(false);
    },
  };
}
