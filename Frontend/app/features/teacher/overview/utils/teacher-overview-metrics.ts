import type { QuestionStatsDto } from "../../question-library/types/question-library-api.types";
import type { QuizStatsDto } from "../../quiz-management/types/quiz-management-api.types";

export type ModuleMetricsInput = {
  courseCount: number;
  flashcardCount: number;
  flashcardSetCount: number;
  questionStats?: QuestionStatsDto;
  quizStats?: QuizStatsDto;
};

export type TeacherModuleMetrics = {
  progress: number;
  statusText: string;
  value: number;
};

type ModuleKey = "courses" | "flashcards" | "questions" | "quizzes";

function computePercent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export function getTeacherModuleMetrics(
  moduleKey: ModuleKey,
  input: ModuleMetricsInput,
): TeacherModuleMetrics {
  switch (moduleKey) {
    case "courses": {
      const value = input.courseCount;

      return {
        value,
        progress: value > 0 ? 100 : 0,
        statusText: value > 0 ? `${value} khóa đang quản lý` : "Chưa có khóa học",
      };
    }
    case "questions": {
      const value = input.questionStats?.totalQuestions ?? 0;
      const approved = input.questionStats?.byStatus["Đã xuất bản"] ?? 0;
      const pending = input.questionStats?.byStatus["Cần duyệt"] ?? 0;

      return {
        value,
        progress: computePercent(approved, value),
        statusText:
          pending > 0 ? `${pending} câu cần duyệt` : value > 0 ? "Ngân hàng đã cập nhật" : "Chưa có câu hỏi",
      };
    }
    case "flashcards": {
      const value = input.flashcardCount;
      const setCount = input.flashcardSetCount;

      return {
        value,
        progress: setCount > 0 ? Math.min(100, computePercent(value, setCount * 12) || 35) : 0,
        statusText: setCount > 0 ? `${setCount} bộ flashcard` : "Chưa có flashcard",
      };
    }
    case "quizzes": {
      const value = input.quizStats?.total ?? 0;
      const published = input.quizStats?.publishedCount ?? 0;

      return {
        value,
        progress: computePercent(published, value),
        statusText:
          published > 0 ? `${published} quiz đã xuất bản` : value > 0 ? "Quiz đang soạn" : "Chưa có quiz",
      };
    }
  }
}
