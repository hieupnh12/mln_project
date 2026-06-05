import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";

import { getStudentExamSummaryPath } from "../../constants/student-routes.constants";
import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { submitExamAttempt } from "../services/exams.service";
import type { ExamAnswerMap, ExamSession } from "../types/exam-session.types";
import { clearExamDraft } from "../utils/exam-draft-storage";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [autoSubmitMode, setAutoSubmitMode] = useState(false);

  const unansweredCount = Math.max(0, (session?.questions.length ?? 0) - Object.keys(answers).length);

  const performSubmit = useCallback(async () => {
    if (subjectId == null || !quizId || studentId == null) {
      showErrorToast("Vui lòng đăng nhập để nộp bài kiểm tra.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));
      const elapsedSeconds = Math.max(0, initialSeconds - remainingSeconds);
      const questionIds = (session?.questions ?? []).map((q) => q.id);
      const result = await submitExamAttempt(
        subjectId,
        quizId,
        studentId,
        questionIds,
        payload,
        elapsedSeconds,
      );
      clearExamDraft(draftKey);
      if (result.summary) {
        saveExamSummary(result.attemptId, result.summary);
      }
      void queryClient.invalidateQueries({ queryKey: EXAMS_QUERY_KEYS.catalogRoot });
      setConfirmOpen(false);
      showSuccessToast(`Đã nộp bài. Kết quả: ${result.scoreLabel}`);
      navigate(getStudentExamSummaryPath(String(subjectId), quizId, result.attemptId), {
        state: { summary: result.summary },
      });
    } catch {
      showErrorToast("Không nộp được bài. Vui lòng thử lại.");
      autoSubmittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
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
