export type ExamDifficultySlice = {
  key: string;
  label: string;
  count: number;
  correctCount: number;
  /** Tỷ lệ đúng trong nhóm độ khó (0–100). */
  percent: number;
  /** Tỷ trọng câu trong bài — dùng cho biểu đồ donut. */
  sharePercent: number;
};

export type ExamImproveTopic = {
  title: string;
  description: string;
  wrongCount: number;
  totalCount: number;
  variant: "error" | "progress" | "ok";
};

export type ExamSummary = {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  courseTitle: string;
  scoreLabel: string;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  accuracyPercent: number;
  passingScore: number;
  elapsedSeconds: number;
  durationMinutes: number;
  submittedAt: string;
  hasDifficultyChart: boolean;
  difficultySummaryLabel: string;
  difficultyBreakdown: ExamDifficultySlice[];
  improveTopics: ExamImproveTopic[];
};
