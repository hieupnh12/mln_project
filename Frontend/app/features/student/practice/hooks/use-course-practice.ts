import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  DEFAULT_PRACTICE_SETTINGS,
  PRACTICE_QUERY_KEYS,
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

  const { chaptersQuery, lessonsQuery } = usePracticeScope(subjectId, scope);

  const questionsQuery = useQuery({
    queryKey: PRACTICE_QUERY_KEYS.questions(subjectId, scope.chapterId, scope.lessonId),
    queryFn: () => getPracticeQuestions(subjectId, scope),
    enabled: active,
  });

  const session = usePracticeSession({
    questions: questionsQuery.data ?? [],
    settings,
    onAutoAdvance: () => undefined,
    sessionActive: active,
  });

  const scopeKey = `${scope.chapterId ?? ""}-${scope.lessonId ?? ""}`;
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (!active || questionsQuery.isLoading || questionsQuery.isFetching || session.poolEmpty) {
      if (!active) {
        wasActiveRef.current = false;
      }
      return;
    }

    const scopeChanged = scopeKeyRef.current !== scopeKey;
    const tabOpened = !wasActiveRef.current;
    scopeKeyRef.current = scopeKey;
    wasActiveRef.current = true;

    if (scopeChanged || tabOpened) {
      session.startSession();
    }
  }, [
    active,
    questionsQuery.isLoading,
    questionsQuery.isFetching,
    questionsQuery.data,
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
