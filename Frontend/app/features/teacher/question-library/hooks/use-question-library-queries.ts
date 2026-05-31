import { useQuery } from "@tanstack/react-query";

import { QUESTION_LIBRARY_QUERY_KEYS } from "../constants/question-library.constants";
import {
  getQuestionMetadata,
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

export function useQuestionsQuery(filters: QuestionFilters) {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.questions(filters),
    queryFn: () => getQuestions(filters),
    enabled: isBrowser,
  });
}

export function useQuestionStatsQuery() {
  return useQuery({
    queryKey: QUESTION_LIBRARY_QUERY_KEYS.stats,
    queryFn: getQuestionStats,
    enabled: isBrowser,
  });
}
