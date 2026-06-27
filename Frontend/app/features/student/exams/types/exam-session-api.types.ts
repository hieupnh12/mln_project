import type { ExamSummary } from "./exam-summary.types";

/** Raw question shape from GET exam session API (`multipleChoice` from backend). */
export type StudentExamQuestionDto = {
  id: string;
  question: string;
  type: string;
  multipleChoice?: boolean | null;
  options: {
    answerId: number;
    label: string;
    content: string;
  }[];
};

export type StudentExamSessionDto = {
  quizId: string;
  title: string;
  courseTitle: string;
  durationMinutes: number;
  passingScore: number;
  questionCount: number;
  questions: StudentExamQuestionDto[];
};

export type SubmitExamAnswerDto = {
  questionId: string;
  answerId: number;
};

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
