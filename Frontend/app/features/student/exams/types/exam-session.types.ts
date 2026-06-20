export type ExamOption = {
  answerId: number;
  label: string;
  content: string;
};

export type ExamQuestion = {
  id: string;
  question: string;
  type: string;
  isMultipleChoice: boolean;
  options: ExamOption[];
};

export type ExamSession = {
  quizId: string;
  title: string;
  courseTitle: string;
  durationMinutes: number;
  passingScore: number;
  questionCount: number;
  questions: ExamQuestion[];
};

/** questionId -> selected answer ids (one for single-choice, many for multi-choice) */
export type ExamAnswerMap = Record<string, number[]>;

export type ExamDraft = {
  currentIndex: number;
  answers: ExamAnswerMap;
  flagged: number[];
  remainingSeconds: number;
};

export type QuestionNavState = "answered" | "current" | "flagged" | "unanswered";
