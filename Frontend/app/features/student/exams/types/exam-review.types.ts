export type ExamReviewOptionState = "correct" | "selected_wrong" | "default";

export type ExamReviewOption = {
  answerId: number;
  label: string;
  content: string;
  state: ExamReviewOptionState;
};

export type ExamReviewQuestion = {
  index: number;
  id: string;
  question: string;
  correct: boolean;
  explanation: string;
  options: ExamReviewOption[];
};

export type ExamReview = {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  courseTitle: string;
  scoreLabel: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  submittedAt: string;
  questions: ExamReviewQuestion[];
};
