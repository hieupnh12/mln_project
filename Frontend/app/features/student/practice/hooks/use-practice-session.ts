import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
  PracticeSessionStats,
} from "../types/practice.types";
import { arePracticeSelectionsEqual } from "../utils/compare-practice-answers";
import { pickRandomQuestion } from "../utils/pick-random-question";

type UsePracticeSessionOptions = {
  questions: PracticeQuestion[];
  settings: PracticeModeSettings;
  onAutoAdvance?: () => void;
  /** When false, session timer does not tick (e.g. tab hidden). */
  sessionActive?: boolean;
};

function toggleSelection(indices: number[], optionIndex: number): number[] {
  return indices.includes(optionIndex)
    ? indices.filter((value) => value !== optionIndex)
    : [...indices, optionIndex].sort((a, b) => a - b);
}

export function usePracticeSession({
  questions,
  settings,
  onAutoAdvance,
  sessionActive = true,
}: UsePracticeSessionOptions) {
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [answerState, setAnswerState] = useState<PracticeAnswerState>("idle");
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<number[]>([]);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [stats, setStats] = useState<PracticeSessionStats>({
    answeredCount: 0,
    correctCount: 0,
    sessionSeconds: 0,
  });
  const [countdownActive, setCountdownActive] = useState(false);

  const currentQuestionIdRef = useRef<string | null>(null);
  const isAdvancingRef = useRef(false);
  const onAutoAdvanceRef = useRef(onAutoAdvance);

  useEffect(() => {
    onAutoAdvanceRef.current = onAutoAdvance;
  }, [onAutoAdvance]);

  useEffect(() => {
    currentQuestionIdRef.current = currentQuestion?.id ?? null;
  }, [currentQuestion?.id]);

  const pool = useMemo(
    () => questions.filter((q) => q.options.length >= 2),
    [questions],
  );

  const resetAnswerState = useCallback(() => {
    setAnswerState("idle");
    setSelectedOptionIndices([]);
    setCountdownActive(false);
    isAdvancingRef.current = false;
  }, []);

  const loadNextQuestion = useCallback(() => {
    const next = pickRandomQuestion(pool, currentQuestionIdRef.current);
    if (!next) {
      isAdvancingRef.current = false;
      setCountdownActive(false);
      return;
    }

    currentQuestionIdRef.current = next.id;
    setCurrentQuestion(next);
    resetAnswerState();
    setDisplayIndex((value) => value + 1);
  }, [pool, resetAnswerState]);

  const startSession = useCallback(() => {
    const first = pickRandomQuestion(pool, null);
    currentQuestionIdRef.current = first?.id ?? null;
    isAdvancingRef.current = false;
    setCurrentQuestion(first);
    resetAnswerState();
    setDisplayIndex(1);
    setStats({ answeredCount: 0, correctCount: 0, sessionSeconds: 0 });
  }, [pool, resetAnswerState]);

  useEffect(() => {
    if (!sessionActive) {
      return undefined;
    }
    const timerId = window.setInterval(() => {
      setStats((prev) => ({ ...prev, sessionSeconds: prev.sessionSeconds + 1 }));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [sessionActive]);

  const submitAnswer = useCallback(
    (nextSelectedIndices: number[]) => {
      if (answerState === "answered" || currentQuestion == null || nextSelectedIndices.length === 0) {
        return;
      }

      const isCorrect = arePracticeSelectionsEqual(
        nextSelectedIndices,
        currentQuestion.correctOptionIndices,
      );

      setSelectedOptionIndices(nextSelectedIndices);
      setAnswerState("answered");
      setStats((prev) => ({
        ...prev,
        answeredCount: prev.answeredCount + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      }));

      if (settings.autoAdvance) {
        setCountdownActive(true);
      }
    },
    [answerState, currentQuestion, settings.autoAdvance],
  );

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (answerState === "answered" || currentQuestion == null) {
        return;
      }

      if (currentQuestion.isMultipleChoice) {
        setSelectedOptionIndices((current) => toggleSelection(current, optionIndex));
        return;
      }

      submitAnswer([optionIndex]);
    },
    [answerState, currentQuestion, submitAnswer],
  );

  const handleSubmitAnswer = useCallback(() => {
    submitAnswer(selectedOptionIndices);
  }, [selectedOptionIndices, submitAnswer]);

  const advanceToNext = useCallback(() => {
    if (isAdvancingRef.current) {
      return;
    }
    isAdvancingRef.current = true;
    setCountdownActive(false);
    loadNextQuestion();
  }, [loadNextQuestion]);

  const handleContinue = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleCountdownComplete = useCallback(() => {
    if (isAdvancingRef.current) {
      return;
    }
    isAdvancingRef.current = true;
    setCountdownActive(false);
    onAutoAdvanceRef.current?.();
    loadNextQuestion();
  }, [loadNextQuestion]);

  const isCorrect =
    currentQuestion != null
    && answerState === "answered"
    && arePracticeSelectionsEqual(
      selectedOptionIndices,
      currentQuestion.correctOptionIndices,
    );

  return {
    currentQuestion,
    answerState,
    selectedOptionIndices,
    displayIndex,
    stats,
    countdownActive,
    isCorrect,
    poolEmpty: pool.length === 0,
    startSession,
    handleSelectOption,
    handleSubmitAnswer,
    handleContinue,
    handleCountdownComplete,
    loadNextQuestion,
  };
}
