import { useQuery } from "@tanstack/react-query";

import {
  QUIZ_CANDIDATE_PAGE_SIZE,
  QUIZ_MANAGEMENT_QUERY_KEYS,
} from "../constants/quiz-management.constants";
import {
  getCandidateQuestions,
  getQuizDetail,
  getQuizList,
  getQuizStats,
} from "../services/quiz-management.service";
import type { QuizFilters, QuizSettings } from "../types/quiz-management.types";

const isBrowser = typeof window !== "undefined";

export function useQuizListQuery(filters: QuizFilters) {
  return useQuery({
    queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.list(filters),
    queryFn: () => getQuizList(filters),
    enabled: isBrowser,
    placeholderData: (previous) => previous,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useQuizStatsQuery() {
  return useQuery({
    queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.stats,
    queryFn: getQuizStats,
    enabled: isBrowser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useQuizDetailQuery(quizId: string | null) {
  return useQuery({
    queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.detail(quizId ?? ""),
    queryFn: () => getQuizDetail(quizId ?? ""),
    enabled: isBrowser && Boolean(quizId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

type CandidateScope = Pick<QuizSettings, "course" | "chapter" | "lesson"> & {
  search: string;
  difficulty: string;
  page: number;
};

export function useQuizCandidateQuestionsQuery(scope: CandidateScope, enabled: boolean) {
  return useQuery({
    queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.candidates(
      {
        course: scope.course,
        chapter: scope.chapter,
        lesson: scope.lesson,
        search: scope.search,
        difficulty: scope.difficulty,
      },
      scope.page,
      QUIZ_CANDIDATE_PAGE_SIZE,
    ),
    queryFn: () =>
      getCandidateQuestions({
        course: scope.course,
        chapter: scope.chapter,
        lesson: scope.lesson,
        search: scope.search,
        difficulty: scope.difficulty,
        page: scope.page,
        size: QUIZ_CANDIDATE_PAGE_SIZE,
      }),
    enabled: isBrowser && enabled && Boolean(scope.course) && Boolean(scope.chapter),
    placeholderData: (previous) => previous,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
