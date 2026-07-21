import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
  DEFAULT_PRACTICE_SETTINGS,
  PRACTICE_QUERY_KEYS,
  PRACTICE_QUERY_STALE_TIME_MS,
} from "../constants/practice.constants";
import { getPracticeQuestions } from "../services/practice.service";
import type { PracticeModeSettings, PracticeScope } from "../types/practice.types";
import { usePracticeScope } from "./use-practice-scope";
import { usePracticeSession } from "./use-practice-session";

type UseCoursePracticeOptions = {
  subjectId: number;
  active: boolean;
};

export function useCoursePractice({ subjectId, active }: UseCoursePracticeOptions) {
  const [scope, setScope] = useState<PracticeScope>({ chapterId: null, lessonId: null });
  const [settings, setSettings] = useState<PracticeModeSettings>(DEFAULT_PRACTICE_SETTINGS);
  const scopeKeyRef = useRef("");
  const sessionStartedRef = useRef(false);

  const { chaptersQuery, lessonsQuery } = usePracticeScope(subjectId, scope);

  const questionsQuery = useQuery({
    queryKey: PRACTICE_QUERY_KEYS.questions(
      subjectId,
      scope.chapterId,
      scope.lessonId,
      DEFAULT_PRACTICE_QUESTION_BATCH_SIZE,
    ),
    queryFn: () =>
      getPracticeQuestions(subjectId, scope, DEFAULT_PRACTICE_QUESTION_BATCH_SIZE),
    staleTime: PRACTICE_QUERY_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
  });

  const session = usePracticeSession({
    questions: questionsQuery.data ?? [],
    settings,
    sessionActive: active,
  });

  const scopeKey = `${scope.chapterId ?? ""}-${scope.lessonId ?? ""}`;

  useEffect(() => {
    if (!active) {
      sessionStartedRef.current = false;
      scopeKeyRef.current = "";
      return;
    }

    if (questionsQuery.isLoading || session.poolEmpty) {
      return;
    }

    const scopeChanged = scopeKeyRef.current !== scopeKey;
    scopeKeyRef.current = scopeKey;

    if (!sessionStartedRef.current || scopeChanged) {
      session.startSession();
      sessionStartedRef.current = true;
    }
  }, [
    active,
    questionsQuery.isLoading,
    scopeKey,
    session.poolEmpty,
    session.startSession,
  ]);

  return {
    scope,
    setScope,
    settings,
    setSettings,
    chaptersQuery,
    lessonsQuery,
    questionsQuery,
    session,
  };
}
