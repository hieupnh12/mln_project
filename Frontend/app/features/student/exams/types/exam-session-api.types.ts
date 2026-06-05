import type { ExamQuestion, ExamSession } from "./exam-session.types";

export type StudentExamSessionDto = ExamSession & {
  questions: ExamQuestion[];
};

export type SubmitExamAnswerDto = {
  questionId: string;
  answerId: number;
};

import type { ExamSummary } from "./exam-summary.types";

export type SubmitExamRequestDto = {
  studentId: number;
  elapsedSeconds?: number;
  questionIds: string[];
  answers: SubmitExamAnswerDto[];
};

export type SubmitExamResultDto = {
  attemptId: string;
  quizId: string;
  scoreLabel: string;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  summary: ExamSummary;
};
