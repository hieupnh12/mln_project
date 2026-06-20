export type PracticeScope = {
  chapterId: number | null;
  lessonId: number | null;
};

export type PracticeModeSettings = {
  autoAdvance: boolean;
  autoAdvanceSeconds: number;
  requireContinue: boolean;
};

export type PracticeQuestion = {
  id: string;
  questionNumber: number;
  question: string;
  type: string;
  chapterId: number | null;
  lessonId: number | null;
  chapter: string;
  lesson: string;
  options: string[];
  correctOptionIndex: number;
  correctOptionIndices: number[];
  isMultipleChoice: boolean;
  explanation: string;
};

export type PracticeAnswerState = "idle" | "answered";

export type PracticeOptionVisualState =
  | "default"
  | "selected"
  | "correct"
  | "incorrect"
  | "disabled";

export type PracticeTestCard = {
  id: string;
  title: string;
  description: string;
  questionCountLabel: string;
  durationLabel: string;
  isActive?: boolean;
};

export type PracticeSessionStats = {
  answeredCount: number;
  correctCount: number;
  sessionSeconds: number;
};
