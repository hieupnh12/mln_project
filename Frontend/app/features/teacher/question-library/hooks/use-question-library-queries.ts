import { useQuery } from "@tanstack/react-query";

import { QUESTION_LIBRARY_QUERY_KEYS } from "../constants/question-library.constants";
import {
  getQuestionMetadata,
  getQuestion,
  getQuestions,
  getQuestionStats,
} from "../services/question-library.service";
import type { QuestionFilters } from "../types/question-library.types";

const isBrowser = typeof window !== "undefined";

export function useQuestionMetadataQuery() {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.metadata,
    queryFn: getQuestionMetadata,
    enabled: isBrowser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useQuestionsQuery(filters: QuestionFilters, page: number, size: number) {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.questions(filters, page, size),
    queryFn: () => getQuestions(filters, page, size),
    enabled: isBrowser,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useQuestionQuery(id: string | null) {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.question(id ?? ""),
    queryFn: () => getQuestion(id ?? ""),
    enabled: isBrowser && Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useQuestionStatsQuery() {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.stats,
    queryFn: getQuestionStats,
    enabled: isBrowser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
