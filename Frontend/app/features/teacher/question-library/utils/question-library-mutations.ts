import {
  chapterOptions,
  courseOptions,
  emptyQuestionDraft,
  lessonOptions,
} from "../constants/question-library.constants";
import type {
  Difficulty,
  QuestionDraft,
  QuestionItem,
  QuestionType,
} from "../types/question-library.types";

export function createQuestionFromDraft(
  draft: QuestionDraft,
  index: number,
  status: QuestionItem["status"] = "Bản nháp",
): QuestionItem {
  const title = draft.title.trim() || draft.question.trim();
  const correctAnswer =
    draft.type === "Trắc nghiệm"
      ? draft.options[draft.correctOptionIndex] ?? draft.answer
      : draft.answer;

  const { explanation: _explanation, bloomLevel: _bloom, correctOptionIndex: _idx, ...rest } =
    draft;

  return {
    ...rest,
    id: `Q-${String(1024 + index)}`,
    title,
    question: draft.question.trim() || title,
    answer: correctAnswer,
    status,
    tags: draft.tags.length > 0 ? draft.tags : ["manual"],
    updatedBy: "Giảng viên",
  };
}

export function parseBatchQuestion(block: string, index: number): QuestionItem | null {
  const get = (key: string) =>
    block.match(new RegExp(`^${key}:\\s*(.+)$`, "im"))?.[1]?.trim();
  const title = get("Q");

  if (!title) return null;

  return createQuestionFromDraft(
    {
      ...emptyQuestionDraft,
      title,
      question: title,
      answer: get("A") ?? "",
      course: get("Course") ?? courseOptions[0],
      chapter: get("Chapter") ?? chapterOptions[0],
      lesson: get("Lesson") ?? lessonOptions[0],
      difficulty: (get("Difficulty") as Difficulty | undefined) ?? "Cơ bản",
      type: (get("Type") as QuestionType | undefined) ?? "Trắc nghiệm",
    },
    index,
  );
}
