import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
  PracticeSessionStats,
} from "../types/practice.types";
import { pickRandomQuestion } from "../utils/pick-random-question";

type UsePracticeSessionOptions = {
  questions: PracticeQuestion[];
  settings: PracticeModeSettings;
  onAutoAdvance: () => void;
  /** When false, session timer does not tick (e.g. tab hidden). */
  sessionActive?: boolean;
};

export function usePracticeSession({
  questions,
  settings,
  onAutoAdvance,
  sessionActive = true,
}: UsePracticeSessionOptions) {
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [answerState, setAnswerState] = useState<PracticeAnswerState>("idle");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [stats, setStats] = useState<PracticeSessionStats>({
    answeredCount: 0,
    correctCount: 0,
    sessionSeconds: 0,
  });
  const [countdownActive, setCountdownActive] = useState(false);

  const pool = useMemo(
    () => questions.filter((q) => q.options.length >= 2),
    [questions],
  );

  const loadNextQuestion = useCallback(() => {
    const next = pickRandomQuestion(pool, currentQuestion?.id ?? null);
    if (!next) {
      return;
    }
    setCurrentQuestion(next);
    setAnswerState("idle");
    setSelectedOptionIndex(null);
    setCountdownActive(false);
    setDisplayIndex((value) => value + 1);
  }, [currentQuestion?.id, pool]);

  const startSession = useCallback(() => {
    const first = pickRandomQuestion(pool, null);
    setCurrentQuestion(first);
    setAnswerState("idle");
    setSelectedOptionIndex(null);
    setDisplayIndex(1);
    setStats({ answeredCount: 0, correctCount: 0, sessionSeconds: 0 });
    setCountdownActive(false);
  }, [pool]);

  useEffect(() => {
    if (!sessionActive) {
      return undefined;
    }
    const timerId = window.setInterval(() => {
      setStats((prev) => ({ ...prev, sessionSeconds: prev.sessionSeconds + 1 }));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [sessionActive]);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (answerState === "answered" || currentQuestion == null) {
        return;
      }

      const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
      setSelectedOptionIndex(optionIndex);
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

  const handleContinue = useCallback(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false);
    onAutoAdvance();
    loadNextQuestion();
  }, [loadNextQuestion, onAutoAdvance]);

  const isCorrect =
    selectedOptionIndex != null &&
    currentQuestion != null &&
    selectedOptionIndex === currentQuestion.correctOptionIndex;

  return {
    currentQuestion,
    answerState,
    selectedOptionIndex,
    displayIndex,
    stats,
    countdownActive,
    isCorrect,
    poolEmpty: pool.length === 0,
    startSession,
    handleSelectOption,
    handleContinue,
    handleCountdownComplete,
    loadNextQuestion,
  };
}
