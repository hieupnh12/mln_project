import type { LessonOptionDto } from "../types/question-library-api.types";
import type { RandomExamConfig, RandomExamValidation } from "../types/export-exam.types";
import type { Difficulty } from "../types/question-library.types";
import {
  countByDifficulty,
  filterQuestionsByScope,
  type QuestionScopeSummary,
} from "./random-exam";

function buildRequiredByDifficulty(config: RandomExamConfig): Record<Difficulty, number> {
  const easy = Math.round((config.totalCount * config.easyPercent) / 100);
  const medium = Math.round((config.totalCount * config.mediumPercent) / 100);
  const hard = Math.max(0, config.totalCount - easy - medium);
  return { "Cơ bản": easy, "Vận dụng": medium, "Nâng cao": hard };
}

export function validateRandomExamConfig(
  config: RandomExamConfig,
  candidates: QuestionScopeSummary[],
  lessonOptions: LessonOptionDto[],
): RandomExamValidation {
  const errors: string[] = [];
  const scoped = filterQuestionsByScope(candidates, config.scope, lessonOptions);
  const byDifficulty = countByDifficulty(scoped);
  const requiredByDifficulty = buildRequiredByDifficulty(config);
  const poolSize = scoped.length;

  if (!config.scope.subjectTitle) {
    errors.push("Vui lòng chọn môn học cho phạm vi đề thi.");
  }

  if (config.totalCount < 1) {
    errors.push("Tổng số câu phải lớn hơn 0.");
  }

  if (config.easyPercent + config.mediumPercent + config.hardPercent !== 100) {
    errors.push("Tổng phần trăm độ khó phải bằng 100%.");
  }

  if (poolSize === 0) {
    errors.push("Không có câu hỏi trong phạm vi chương/bài và trạng thái đã chọn.");
  }

  if (config.totalCount > poolSize) {
    errors.push(
      `Không đủ câu hỏi: yêu cầu ${config.totalCount} câu nhưng chỉ có ${poolSize} câu khả dụng.`,
    );
  }

  (Object.keys(requiredByDifficulty) as Difficulty[]).forEach((difficulty) => {
    const required = requiredByDifficulty[difficulty];
    const available = byDifficulty[difficulty];
    if (required > available) {
      errors.push(
        `Thiếu câu ${difficulty.toLowerCase()}: cần ${required}, chỉ có ${available} câu trong phạm vi.`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    poolSize,
    byDifficulty,
    requiredByDifficulty,
    errors,
  };
}
