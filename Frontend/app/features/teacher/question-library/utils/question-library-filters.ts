import type { QuestionFilters, QuestionItem } from "../types/question-library.types";

export function filterQuestions(
  questions: QuestionItem[],
  filters: QuestionFilters,
): QuestionItem[] {
  const keyword = filters.search.trim().toLowerCase();

  return questions.filter((question) => {
    const text =
      `${question.title} ${question.question} ${question.tags.join(" ")}`.toLowerCase();

    return (
      (!keyword || text.includes(keyword)) &&
      matches(filters.course, question.course) &&
      matches(filters.chapter, question.chapter) &&
      matches(filters.lesson, question.lesson) &&
      matches(filters.difficulty, question.difficulty) &&
      matches(filters.type, question.type) &&
      matches(filters.status, question.status)
    );
  });
}

function matches<T extends string>(filterValue: T | "all", value: T) {
  return filterValue === "all" || filterValue === value;
}
