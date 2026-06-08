import { fetchQuestions, fetchQuestion } from "../api/question-library.api";
import {
  APPROVED_EXPORT_STATUS,
  EXPORT_DETAIL_BATCH_SIZE,
  EXPORT_PAGE_SIZE,
  PENDING_EXPORT_STATUS,
} from "../constants/wayground-export.constants";
import type { ExportQuestionStatusFilter } from "../types/export-exam.types";
import type { QuestionDto } from "../types/question-library-api.types";
import type { QuestionFilters, QuestionItem } from "../types/question-library.types";

type ExportQuestionSummary = Pick<
  QuestionItem,
  "id" | "difficulty" | "chapter" | "lesson" | "course" | "lessonId"
>;

function mapQuestionDto(item: QuestionDto): QuestionItem {
  return {
    id: item.id,
    title: item.title,
    question: item.question,
    type: item.type as QuestionItem["type"],
    difficulty: item.difficulty as QuestionItem["difficulty"],
    status: item.status as QuestionItem["status"],
    course: item.course,
    chapter: item.chapter,
    lesson: item.lesson,
    lessonId: item.lessonId ?? undefined,
    answer: item.answer,
    score: Number(item.score),
    estimatedTime: item.estimatedTime,
    tags: item.tags ?? [],
    options: item.options ?? [],
    correctOptionIndices: item.correctOptionIndices ?? [],
    explanation: item.explanation ?? "",
    updatedBy: item.updatedBy,
  };
}

async function fetchQuestionDetails(ids: string[]): Promise<QuestionItem[]> {
  const results: QuestionItem[] = [];

  for (let index = 0; index < ids.length; index += EXPORT_DETAIL_BATCH_SIZE) {
    const batch = ids.slice(index, index + EXPORT_DETAIL_BATCH_SIZE);
    const batchResults = await Promise.all(batch.map((id) => fetchQuestion(id)));
    results.push(...batchResults.map(mapQuestionDto));
  }

  return results;
}

export async function fetchApprovedQuestionsForExport(
  filters: QuestionFilters,
  onProgress?: (loaded: number, total: number) => void,
): Promise<QuestionItem[]> {
  const exportFilters: QuestionFilters = {
    ...filters,
    status: APPROVED_EXPORT_STATUS,
  };

  const firstPage = await fetchQuestions(exportFilters, 0, EXPORT_PAGE_SIZE);
  const ids = firstPage.items.map((item) => item.id);
  onProgress?.(Math.min(ids.length, firstPage.total), firstPage.total);

  for (let page = 1; page * EXPORT_PAGE_SIZE < firstPage.total; page += 1) {
    const response = await fetchQuestions(exportFilters, page, EXPORT_PAGE_SIZE);
    ids.push(...response.items.map((item) => item.id));
    onProgress?.(Math.min(ids.length, firstPage.total), firstPage.total);
  }

  if (ids.length === 0) {
    return [];
  }

  const details: QuestionItem[] = [];
  for (let index = 0; index < ids.length; index += EXPORT_DETAIL_BATCH_SIZE) {
    const batch = ids.slice(index, index + EXPORT_DETAIL_BATCH_SIZE);
    const batchResults = await Promise.all(batch.map((id) => fetchQuestion(id)));
    details.push(...batchResults.map(mapQuestionDto));
    onProgress?.(details.length, ids.length);
  }

  return details;
}

export async function fetchApprovedQuestionSummaries(
  filters: QuestionFilters,
): Promise<ExportQuestionSummary[]> {
  return fetchQuestionSummaries({
    ...filters,
    status: APPROVED_EXPORT_STATUS,
  });
}

export async function fetchQuestionSummariesForExport(
  filters: QuestionFilters,
  statusFilter: ExportQuestionStatusFilter,
): Promise<ExportQuestionSummary[]> {
  if (statusFilter === "all") {
    const [approved, pending] = await Promise.all([
      fetchQuestionSummaries({ ...filters, status: APPROVED_EXPORT_STATUS }),
      fetchQuestionSummaries({ ...filters, status: PENDING_EXPORT_STATUS }),
    ]);
    return [...approved, ...pending];
  }

  return fetchQuestionSummaries({ ...filters, status: statusFilter });
}

async function fetchQuestionSummaries(filters: QuestionFilters): Promise<ExportQuestionSummary[]> {
  const firstPage = await fetchQuestions(filters, 0, EXPORT_PAGE_SIZE);
  const summaries = firstPage.items.map((item) => ({
    id: item.id,
    difficulty: item.difficulty as QuestionItem["difficulty"],
    chapter: item.chapter,
    lesson: item.lesson,
    course: item.course,
    lessonId: undefined,
  }));

  for (let page = 1; page * EXPORT_PAGE_SIZE < firstPage.total; page += 1) {
    const response = await fetchQuestions(filters, page, EXPORT_PAGE_SIZE);
    summaries.push(
      ...response.items.map((item) => ({
        id: item.id,
        difficulty: item.difficulty as QuestionItem["difficulty"],
        chapter: item.chapter,
        lesson: item.lesson,
        course: item.course,
        lessonId: undefined,
      })),
    );
  }

  return summaries;
}

export async function fetchApprovedQuestionDetails(ids: string[]): Promise<QuestionItem[]> {
  return fetchQuestionDetails(ids);
}

export async function fetchExportQuestionDetails(ids: string[]): Promise<QuestionItem[]> {
  return fetchQuestionDetails(ids);
}
