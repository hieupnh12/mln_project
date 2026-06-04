import type { PracticeQuestionDto } from "../types/practice-api.types";
import type { PracticeQuestion } from "../types/practice.types";

function resolveCorrectOptionIndex(dto: PracticeQuestionDto, options: string[]) {
  const index = dto.correctOptionIndices?.[0];
  if (typeof index === "number" && index >= 0 && index < options.length) {
    return index;
  }

  return options.findIndex((option) => option === dto.answer);
}

export function mapPracticeQuestionDto(
  dto: PracticeQuestionDto,
  index: number,
): PracticeQuestion | null {
  const options = dto.options?.filter((option) => option.trim().length > 0) ?? [];
  const correctOptionIndex = resolveCorrectOptionIndex(dto, options);

  if (options.length < 2 || correctOptionIndex < 0) {
    return null;
  }

  return {
    id: dto.id,
    questionNumber: index + 1,
    question: dto.question || dto.title || "Câu hỏi chưa có nội dung",
    chapterId: dto.chapterId,
    lessonId: dto.lessonId,
    chapter: dto.chapter || "Chương",
    lesson: dto.lesson || "Bài học",
    options,
    correctOptionIndex,
    explanation: dto.explanation ?? "",
  };
}
