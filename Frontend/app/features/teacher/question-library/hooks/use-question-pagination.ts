import { useMemo, useState } from "react";

import { QUESTION_PAGE_SIZE } from "../constants/question-library.constants";

export function useQuestionPagination<T>(items: T[]) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / QUESTION_PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * QUESTION_PAGE_SIZE;
    return items.slice(start, start + QUESTION_PAGE_SIZE);
  }, [items, safePage]);

  const rangeStart = items.length === 0 ? 0 : (safePage - 1) * QUESTION_PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * QUESTION_PAGE_SIZE, items.length);

  function goToPage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  function resetPage() {
    setPage(1);
  }

  return {
    page: safePage,
    totalPages,
    pageItems,
    rangeStart,
    rangeEnd,
    goToPage,
    resetPage,
  };
}
