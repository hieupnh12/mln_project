import type { QuestionItem } from "../types/question-library.types";

const LETTER_PATTERN = /^([A-Ea-e])$/;

export function parseCorrectAnswerIndices(rawAnswer: string, options: string[]): number[] {
  const trimmed = rawAnswer.trim();
  if (!trimmed || options.length === 0) {
    return [];
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts.length > 1) {
    const indices: number[] = [];
    for (const part of parts) {
      const letterMatch = part.match(LETTER_PATTERN);
      if (letterMatch) {
        const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
        if (index >= 0 && index < options.length) {
          indices.push(index);
        }
        continue;
      }
      if (/^\d+$/.test(part)) {
        const index = Number(part) - 1;
        if (index >= 0 && index < options.length) {
          indices.push(index);
        }
        continue;
      }
      const matchedIndex = options.findIndex(
        (option) => option.trim().localeCompare(part, "vi", { sensitivity: "accent" }) === 0,
      );
      if (matchedIndex >= 0) {
        indices.push(matchedIndex);
      }
    }
    return [...new Set(indices)].sort((a, b) => a - b);
  }

  const single = parts[0];
  const letterMatch = single.match(LETTER_PATTERN);
  if (letterMatch) {
    const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    return index >= 0 && index < options.length ? [index] : [];
  }

  if (/^\d+$/.test(single)) {
    const index = Number(single) - 1;
    return index >= 0 && index < options.length ? [index] : [];
  }

  const matchedIndex = options.findIndex(
    (option) => option.trim().localeCompare(single, "vi", { sensitivity: "accent" }) === 0,
  );
  return matchedIndex >= 0 ? [matchedIndex] : [];
}

export function resolveQuestionCorrectIndices(question: QuestionItem): number[] {
  if (question.correctOptionIndices && question.correctOptionIndices.length > 0) {
    return question.correctOptionIndices;
  }

  if (question.options.length === 0) {
    return [];
  }

  return parseCorrectAnswerIndices(question.answer, question.options);
}

export function formatCorrectAnswerFromIndices(
  options: string[],
  indices: number[],
): string {
  if (indices.length === 0) {
    return "";
  }
  return indices
    .map((index) => options[index]?.trim())
    .filter(Boolean)
    .join(", ");
}
