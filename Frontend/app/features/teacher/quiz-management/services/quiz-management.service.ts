import type { QuestionListItemDto, QuestionDto } from "../../question-library/types/question-library-api.types";
import type { QuestionItem, QuestionListItem } from "../../question-library/types/question-library.types";
import {
  closeQuizApi,
  createQuizApi,
  deleteQuizApi,
  duplicateQuizApi,
  fetchCandidateQuestions,
  fetchQuizDetail,
  fetchQuizList,
  fetchQuizStats,
  publishQuizApi,
  updateQuizApi,
} from "../api/quiz-management.api";
import type {
  QuizDetailDto,
  QuizListItemDto,
  QuizStatsDto,
  SaveQuizPayload,
} from "../types/quiz-management-api.types";
import type { QuizFilters, QuizListItem, QuizSettings } from "../types/quiz-management.types";
import type { QuizListSummary } from "../utils/quiz-ui.helpers";

function mapQuestionListItemDto(item: QuestionListItemDto): QuestionListItem {
  return {
    id: item.id,
    title: item.title,
    question: item.question,
    type: item.type as QuestionListItem["type"],
    difficulty: item.difficulty as QuestionListItem["difficulty"],
    status: item.status as QuestionListItem["status"],
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
    correctOptionIndices: item.correctOptionIndices ?? [],
    explanation: item.explanation ?? "",
    updatedBy: item.updatedBy,
  };
}

function mapQuizListItemDto(item: QuizListItemDto): QuizListItem {
  return {
    id: item.id,
    title: item.title,
    course: item.course,
    chapter: item.chapter,
    questionCount: item.questionCount,
    duration: item.duration,
    passingScore: item.passingScore,
    status: item.status as QuizListItem["status"],
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    attemptCount: item.attemptCount,
    availableUntil: item.availableUntil,
  };
}

function normalizeScopeValue(value: string | undefined): string {
  if (!value || value === "all" || value === "Tất cả" || value === "Tất cả bài") {
    return "all";
  }
  return value;
}

export function mapQuizDetailToSettings(detail: QuizDetailDto): QuizSettings {
  return {
    title: detail.title,
    course: detail.course,
    chapter: normalizeScopeValue(detail.chapter),
    lesson: normalizeScopeValue(detail.lesson),
    duration: detail.duration,
    passingScore: detail.passingScore,
    randomCount: detail.randomCount > 0 ? detail.randomCount : 10,
    shuffleAnswers: detail.shuffleAnswers,
    randomQuestions: detail.randomQuestions,
    availableUntil: detail.availableUntil ?? "",
  };
}

export function buildSaveQuizPayload(
  settings: QuizSettings,
  questionIds: string[],
): SaveQuizPayload {
  return {
    title: settings.title,
    course: settings.course,
    chapter: settings.chapter,
    lesson: settings.lesson,
    duration: settings.duration,
    passingScore: settings.passingScore,
    randomCount: settings.randomCount,
    shuffleAnswers: settings.shuffleAnswers,
    randomQuestions: settings.randomQuestions,
    questionIds,
    availableUntil: settings.availableUntil.trim() || undefined,
  };
}

export function mapQuizStatsDto(stats: QuizStatsDto): QuizListSummary {
  return {
    total: stats.total,
    draftCount: stats.draftCount,
    publishedCount: stats.publishedCount,
    totalQuestions: stats.totalQuestions,
    avgDuration: stats.avgDuration,
  };
}

export async function getQuizList(filters: QuizFilters) {
  const response = await fetchQuizList(filters);
  return {
    items: response.items.map(mapQuizListItemDto),
    total: response.total,
  };
}

export function getQuizStats() {
  return fetchQuizStats().then(mapQuizStatsDto);
}

export async function getQuizDetail(id: string) {
  const detail = await fetchQuizDetail(id);
  const listItem: QuizListItem = {
    id: detail.id,
    title: detail.title,
    course: detail.course,
    chapter: detail.chapter,
    questionCount: detail.questionCount,
    duration: detail.duration,
    passingScore: detail.passingScore,
    status: detail.status as QuizListItem["status"],
    updatedAt: detail.updatedAt,
    createdAt: detail.createdAt,
    attemptCount: detail.attemptCount,
  };

  return {
    settings: mapQuizDetailToSettings(detail),
    questionIds: detail.questionIds,
    questions: detail.questions.map(mapQuestionDto),
    listItem,
    isPublished: detail.status === "Đã xuất bản",
  };
}

export async function getCandidateQuestions(params: {
  course: string;
  chapter: string;
  lesson: string;
  search: string;
  difficulty: string;
  page: number;
  size: number;
}) {
  const response = await fetchCandidateQuestions(params);
  return {
    items: response.items.map(mapQuestionListItemDto),
    total: response.total,
    page: response.page,
    size: response.size,
  };
}

export function createQuiz(payload: SaveQuizPayload) {
  return createQuizApi(payload);
}

export function updateQuiz(id: string, payload: SaveQuizPayload) {
  return updateQuizApi(id, payload);
}

export function publishQuiz(id: string) {
  return publishQuizApi(id);
}

export function duplicateQuiz(id: string) {
  return duplicateQuizApi(id);
}

export function closeQuiz(id: string) {
  return closeQuizApi(id);
}

export function deleteQuiz(id: string) {
  return deleteQuizApi(id);
}
