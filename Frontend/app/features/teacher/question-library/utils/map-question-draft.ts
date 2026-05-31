import type { CreateQuestionPayload } from "../types/question-library-api.types";
import type { QuestionDraft } from "../types/question-library.types";
import { resolveLessonIdFromDraft } from "./lesson-options";

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
  const options = draft.options
    .filter((option) => option.trim().length > 0)
    .map((content, index) => ({
      content: content.trim(),
      isCorrect: draft.type === "Trắc nghiệm" ? index === draft.correctOptionIndex : false,
    }));

  return {
    lessonId,
    title,
    question: draft.question.trim() || title,
    type: draft.type,
    difficulty: draft.difficulty,
    status,
    bloomLevel: draft.bloomLevel,
    explanation: draft.explanation,
    answer: draft.answer,
    score: draft.score,
    estimatedTime: draft.estimatedTime,
    tags: draft.tags,
    options,
    correctOptionIndex: draft.correctOptionIndex,
    allowSimilarSave,
  };
}
