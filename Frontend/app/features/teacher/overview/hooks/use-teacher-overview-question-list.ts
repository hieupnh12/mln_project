import { useMemo, useState } from "react";

import { useQuestionsQuery } from "../../question-library/hooks/use-question-library-queries";
import type { QuestionFilters } from "../../question-library/types/question-library.types";
import type { Difficulty, QuestionStatus } from "../../question-library/types/question-library.types";
import { TEACHER_OVERVIEW_PAGE_SIZE } from "../constants/teacher-overview.constants";

const BASE_FILTERS: QuestionFilters = {
  search: "",
  course: "all",
  chapter: "all",
  lesson: "all",
  difficulty: "all",
  type: "all",
  status: "all",
};

export function useTeacherOverviewQuestionList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<QuestionStatus | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [page, setPage] = useState(1);

  const filters = useMemo<QuestionFilters>(
    () => ({
      ...BASE_FILTERS,
      search: search.trim(),
      status,
      difficulty,
    }),
    [difficulty, search, status],
  );

  const questionsQuery = useQuestionsQuery(filters, page, TEACHER_OVERVIEW_PAGE_SIZE);

  const totalPages = Math.max(
    1,
    Math.ceil((questionsQuery.data?.total ?? 0) / TEACHER_OVERVIEW_PAGE_SIZE),
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateStatus = (value: QuestionStatus | "all") => {
    setStatus(value);
    setPage(1);
  };

  const updateDifficulty = (value: Difficulty | "all") => {
    setDifficulty(value);
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return {
    difficulty,
    filters,
    goToPage,
    items: questionsQuery.data?.items ?? [],
    page,
    questionsQuery,
    search,
    setDifficulty: updateDifficulty,
    setSearch: updateSearch,
    setStatus: updateStatus,
    status,
    totalPages,
  };
}
