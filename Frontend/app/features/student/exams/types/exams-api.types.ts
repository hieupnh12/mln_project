export type StudentQuizCardDto = {
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

export type StudentQuizCompletedDto = {
  attemptId: string;
  quizId: string;
  title: string;
  submittedAt: string;
  scoreLabel: string;
  passed: boolean;
};

export type StudentQuizCatalogDto = {
  subjectTitle: string;
  ongoing: StudentQuizCardDto[];
  upcoming: StudentQuizCardDto[];
  completed: StudentQuizCompletedDto[];
};
