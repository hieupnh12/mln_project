import type { CreateQuestionPayload } from "../types/question-library-api.types";
import type { QuestionDraft } from "../types/question-library.types";
import { resolveLessonIdFromDraft } from "./lesson-options";
import { formatCorrectAnswerFromIndices } from "./resolve-correct-option-indices";

function isOptionBasedType(type: QuestionDraft["type"]) {
  return type === "Trắc nghiệm" || type === "Nhiều đáp án";
}

function buildOptionPayload(draft: QuestionDraft, correctIndices: number[]) {
  return draft.options
    .map((content, index) => ({
      content: content.trim(),
      sourceIndex: index,
    }))
    .filter((entry) => entry.content.length > 0)
    .map(({ content, sourceIndex }) => ({
      content,
      isCorrect: correctIndices.includes(sourceIndex),
    }));
}

export function mapDraftToCreatePayload(
  draft: QuestionDraft,
  status: string,
  allowSimilarSave = false,
): CreateQuestionPayload | null {
  const lessonId = resolveLessonIdFromDraft(draft);
  if (!lessonId) {
    return null;
  }

  const title = draft.title.trim() || draft.question.trim();
  const correctIndices = isOptionBasedType(draft.type) ? (draft.correctOptionIndices ?? []) : [];
  const options = buildOptionPayload(draft, correctIndices);
  const trimmedOptions = draft.options.map((option) => option.trim());
  const answer = isOptionBasedType(draft.type)
    ? formatCorrectAnswerFromIndices(trimmedOptions, correctIndices) || draft.answer.trim()
    : draft.answer.trim();

  return {
    lessonId,
    title,
    question: draft.question.trim() || title,
    type: draft.type,
    difficulty: draft.difficulty,
    status,
    bloomLevel: draft.bloomLevel,
    explanation: draft.explanation,
    answer,
    score: draft.score,
    estimatedTime: draft.estimatedTime,
    tags: draft.tags,
    options: options.length > 0 ? options : undefined,
    correctOptionIndex: correctIndices[0],
    allowSimilarSave,
  };
}
