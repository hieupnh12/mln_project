import {
  approveQuestionApi,
  batchImportQuestionsApi,
  checkDuplicateApi,
  createQuestionApi,
  deleteQuestionApi,
  deleteQuestionsApi,
  fetchQuestion,
  fetchQuestionMetadata,
  fetchQuestions,
  fetchQuestionStats,
} from "../api/question-library.api";
import type {
  BatchImportPayload,
  CheckDuplicatePayload,
  CreateQuestionPayload,
  QuestionDto,
  QuestionListItemDto,
} from "../types/question-library-api.types";
import type {
  QuestionFilters,
  QuestionItem,
  QuestionListItem,
} from "../types/question-library.types";

function mapQuestionListItemDto(item: QuestionListItemDto): QuestionListItem {
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
  };
}

function mapQuestionDto(item: QuestionDto): QuestionItem {
  return {
    ...mapQuestionListItemDto(item),
    lessonId: item.lessonId ?? undefined,
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

export async function getQuestions(filters: QuestionFilters, page: number, size: number) {
  const response = await fetchQuestions(filters, page, size);
  return {
    items: response.items.map(mapQuestionListItemDto),
    total: response.total,
    page: response.page,
    size: response.size,
  };
}

export function getQuestion(id: string) {
  return fetchQuestion(id).then(mapQuestionDto);
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

export function approveQuestion(id: string) {
  return approveQuestionApi(id).then(mapQuestionDto);
}

export function deleteQuestion(id: string) {
  return deleteQuestionApi(id);
}

export function deleteQuestions(ids: string[]) {
  return deleteQuestionsApi(ids);
}
