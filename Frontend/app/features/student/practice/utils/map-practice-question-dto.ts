import type { PracticeQuestionDto } from "../types/practice-api.types";
import type { PracticeQuestion } from "../types/practice.types";
import { isPracticeMultiChoice } from "./is-practice-multi-choice";

function resolveCorrectOptionIndices(dto: PracticeQuestionDto, options: string[]): number[] {
  const fromApi = dto.correctOptionIndices?.filter(
    (index) => typeof index === "number" && index >= 0 && index < options.length,
  );

  if (fromApi && fromApi.length > 0) {
    return [...new Set(fromApi)].sort((a, b) => a - b);
  }

  const fallbackIndex = options.findIndex((option) => option === dto.answer);
  return fallbackIndex >= 0 ? [fallbackIndex] : [];
}

export function mapPracticeQuestionDto(
  dto: PracticeQuestionDto,
  index: number,
): PracticeQuestion | null {
  const options = dto.options?.filter((option) => option.trim().length > 0) ?? [];
  const correctOptionIndices = resolveCorrectOptionIndices(dto, options);

  if (options.length < 2 || correctOptionIndices.length === 0) {
    return null;
  }

  const isMultipleChoice = isPracticeMultiChoice(dto.type, correctOptionIndices);

  return {
    id: dto.id,
    questionNumber: index + 1,
    question: dto.question || dto.title || "Câu hỏi chưa có nội dung",
    type: dto.type,
    chapterId: dto.chapterId,
    lessonId: dto.lessonId,
    chapter: dto.chapter || "Chương",
    lesson: dto.lesson || "Bài học",
    options,
    correctOptionIndex: correctOptionIndices[0],
    correctOptionIndices,
    isMultipleChoice,
    explanation: dto.explanation ?? "",
  };
}
