import type { BackendApiResponse } from "../../question-library/types/question-library-api.types";
import type { QuestionListItemDto } from "../../question-library/types/question-library-api.types";

export type { BackendApiResponse };

export type QuizListItemDto = {
  id: string;
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  questionCount: number;
  duration: number;
  passingScore: number;
  status: string;
  availableUntil?: string;
  updatedAt: string;
  createdAt: string;
  attemptCount: number;
};

export type QuizListDto = {
  items: QuizListItemDto[];
  total: number;
  page: number;
  size: number;
};

export type QuizDetailDto = {
  id: string;
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  randomCount: number;
  shuffleAnswers: boolean;
  randomQuestions: boolean;
  status: string;
  availableFrom?: string;
  availableUntil?: string;
  updatedAt: string;
  createdAt: string;
  attemptCount: number;
  questionCount: number;
  questionIds: string[];
  questions: import("../../question-library/types/question-library-api.types").QuestionDto[];
};

export type QuizStatsDto = {
  total: number;
  draftCount: number;
  publishedCount: number;
  totalQuestions: number;
  avgDuration: number;
};

export type SaveQuizPayload = {
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  randomCount: number;
  shuffleAnswers: boolean;
  randomQuestions: boolean;
  questionIds: string[];
  availableUntil?: string;
};

export type CandidateQuestionListDto = {
  items: QuestionListItemDto[];
  total: number;
  page: number;
  size: number;
};
