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
  });
}

export function useQuestionsQuery(filters: QuestionFilters, page: number, size: number) {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.questions(filters, page, size),
    queryFn: () => getQuestions(filters, page, size),
    enabled: isBrowser,
    placeholderData: (previousData) => previousData,
  });
}

export function useQuestionQuery(id: string | null) {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.question(id ?? ""),
    queryFn: () => getQuestion(id ?? ""),
    enabled: isBrowser && Boolean(id),
  });
}

export function useQuestionStatsQuery() {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.stats,
    queryFn: getQuestionStats,
    enabled: isBrowser,
  });
}
