import { useCallback, useEffect, useMemo, useState } from "react";

import { QUESTION_PAGE_SIZE } from "../constants/question-library.constants";
import type { QuestionFilters } from "../types/question-library.types";
import { useQuestionsQuery } from "./use-question-library-queries";

export function useQuestionPagination(filters: QuestionFilters) {
  const [page, setPage] = useState(1);
  const questionsQuery = useQuestionsQuery(filters, page - 1, QUESTION_PAGE_SIZE);
  const pageItems = useMemo(() => questionsQuery.data?.items ?? [], [questionsQuery.data?.items]);
  const totalItems = questionsQuery.data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalItems / QUESTION_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * QUESTION_PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * QUESTION_PAGE_SIZE, totalItems);

  const goToPage = useCallback((next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    questionsQuery,
    page: safePage,
    totalPages,
    totalItems,
    pageItems,
    rangeStart,
    rangeEnd,
    goToPage,
    resetPage,
  };
}
