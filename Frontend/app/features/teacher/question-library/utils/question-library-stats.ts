import { courseOptions } from "../constants/question-library.constants";
import type { Difficulty, QuestionItem, QuestionStatus } from "../types/question-library.types";

export type QuestionLibraryStats = {
  totalQuestions: number;
  totalCourses: number;
  byDifficulty: Record<Difficulty, number>;
  byStatus: Record<QuestionStatus, number>;
};

export function computeQuestionStats(questions: QuestionItem[]): QuestionLibraryStats {
  const byDifficulty: Record<Difficulty, number> = {
    "Cơ bản": 0,
    "Vận dụng": 0,
    "Nâng cao": 0,
  };
  const byStatus: Record<QuestionStatus, number> = {
    "Bản nháp": 0,
    "Cần duyệt": 0,
    "Đã xuất bản": 0,
  };

  for (const question of questions) {
    byDifficulty[question.difficulty] += 1;
    byStatus[question.status] += 1;
  }

  const coursesInUse = new Set(questions.map((q) => q.course));

  return {
    totalQuestions: questions.length,
    totalCourses: coursesInUse.size || courseOptions.length,
    byDifficulty,
    byStatus,
  };
}
