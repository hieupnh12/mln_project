import type { ExamAnswerMap, ExamDraft } from "../types/exam-session.types";

export function normalizeExamAnswerMap(raw: Record<string, unknown> | undefined): ExamAnswerMap {
  if (!raw) {
    return {};
  }

  const normalized: ExamAnswerMap = {};
  for (const [questionId, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      const ids = value.filter((item): item is number => typeof item === "number");
      if (ids.length > 0) {
        normalized[questionId] = ids;
      }
      continue;
    }
    if (typeof value === "number") {
      normalized[questionId] = [value];
    }
  }
  return normalized;
}

export function normalizeExamDraft(draft: ExamDraft): ExamDraft {
  return {
    ...draft,
    answers: normalizeExamAnswerMap(draft.answers as Record<string, unknown>),
  };
}

export function isQuestionAnswered(answers: ExamAnswerMap, questionId: string): boolean {
  const selected = answers[questionId];
  return Array.isArray(selected) && selected.length > 0;
}

export function countAnsweredQuestions(questionIds: string[], answers: ExamAnswerMap): number {
  return questionIds.filter((questionId) => isQuestionAnswered(answers, questionId)).length;
}

export function flattenExamAnswers(answers: ExamAnswerMap) {
  return Object.entries(answers).flatMap(([questionId, answerIds]) =>
    answerIds.map((answerId) => ({ questionId, answerId })),
  );
}

export function toggleExamAnswerSelection(
  current: number[],
  answerId: number,
  isMultipleChoice: boolean,
): number[] {
  if (!isMultipleChoice) {
    return [answerId];
  }
  return current.includes(answerId)
    ? current.filter((id) => id !== answerId)
    : [...current, answerId];
}
