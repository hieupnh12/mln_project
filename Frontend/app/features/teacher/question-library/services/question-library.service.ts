import {
  batchImportQuestionsApi,
  checkDuplicateApi,
  createQuestionApi,
  deleteQuestionApi,
  deleteQuestionsApi,
  fetchQuestionMetadata,
  fetchQuestions,
  fetchQuestionStats,
} from "../api/question-library.api";
import type {
  BatchImportPayload,
  CheckDuplicatePayload,
  CreateQuestionPayload,
} from "../types/question-library-api.types";
import type { QuestionFilters, QuestionItem } from "../types/question-library.types";

function mapQuestionDto(item: {
  id: string;
  lessonId: number | null;
  title: string;
  question: string;
  type: string;
  difficulty: string;
  status: string;
  course: string;
  chapter: string;
  lesson: string;
  answer: string;
  score: number;
  estimatedTime: number;
  tags: string[];
  options: string[];
  explanation?: string;
  updatedBy: string;
}): QuestionItem {
  return {
    id: item.id,
    lessonId: item.lessonId ?? undefined,
    title: item.title,
    question: item.question,
    type: item.type as QuestionItem["type"],
    difficulty: item.difficulty as QuestionItem["difficulty"],
    status: item.status as QuestionItem["status"],
    course: item.course,
    chapter: item.chapter,
    lesson: item.lesson,
    answer: item.answer,
    score: Number(item.score),
    estimatedTime: item.estimatedTime,
    tags: item.tags ?? [],
    options: item.options ?? [],
    explanation: item.explanation ?? "",
    updatedBy: item.updatedBy,
  };
}

export function getQuestionMetadata() {
  return fetchQuestionMetadata();
}

export async function getQuestions(filters: QuestionFilters) {
  const response = await fetchQuestions(filters);
  return {
    items: response.items.map(mapQuestionDto),
    total: response.total,
  };
}

export function getQuestionStats() {
  return fetchQuestionStats();
}

export function createQuestion(payload: CreateQuestionPayload) {
  return createQuestionApi(payload).then(mapQuestionDto);
}

export async function checkQuestionDuplicate(payload: CheckDuplicatePayload) {
  const result = await checkDuplicateApi(payload);
  return {
    exactDuplicate: result.exactDuplicate,
    similarDuplicate: result.similarDuplicate,
    warningMessage: result.warningMessage ?? undefined,
    matchedQuestion: result.matchedQuestion ? mapQuestionDto(result.matchedQuestion) : null,
  };
}

export function batchImportQuestions(payload: BatchImportPayload) {
  return batchImportQuestionsApi(payload);
}

export function deleteQuestion(id: string) {
  return deleteQuestionApi(id);
}

export function deleteQuestions(ids: string[]) {
  return deleteQuestionsApi(ids);
}
