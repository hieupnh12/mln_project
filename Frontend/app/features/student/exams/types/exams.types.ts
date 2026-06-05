export type ExamCard = {
  id: string;
  title: string;
  chapter: string;
  lesson: string;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
  scheduleLabel: string;
  icon: string;
};

export type ExamCompletedRow = {
  attemptId: string;
  quizId: string;
  title: string;
  submittedAt: string;
  scoreLabel: string;
  passed: boolean;
};

export type ExamCatalog = {
  subjectTitle: string;
  ongoing: ExamCard[];
  upcoming: ExamCard[];
  completed: ExamCompletedRow[];
};
