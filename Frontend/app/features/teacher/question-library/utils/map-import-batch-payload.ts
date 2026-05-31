import type { BatchImportRowPayload } from "../types/question-library-api.types";
import type { ImportPreviewRow } from "../types/import-batch.types";

const ANSWER_LETTER_PATTERN = /^([A-Da-d])$/;

function resolveCorrectAnswer(rawAnswer: string, options: string[]): string {
  const trimmed = rawAnswer.trim();
  if (!trimmed) {
    return "";
  }

  const letterMatch = trimmed.match(ANSWER_LETTER_PATTERN);
  if (letterMatch) {
    const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    return options[index]?.trim() ?? trimmed;
  }

  const matchedOption = options.find((option) => option.trim() === trimmed);
  return matchedOption?.trim() ?? trimmed;
}

function buildImportOptions(row: ImportPreviewRow) {
  const rawOptions = (row.options ?? []).map((option) => option.trim()).filter(Boolean);
  const resolvedAnswer = resolveCorrectAnswer(row.answer ?? "", rawOptions);

  if (rawOptions.length === 0) {
    return { options: undefined, answer: resolvedAnswer || row.answer?.trim() };
  }

  return {
    options: rawOptions.map((content) => ({
      content,
      isCorrect: resolvedAnswer ? content === resolvedAnswer : false,
    })),
    answer: resolvedAnswer,
  };
}

export function mapImportPreviewRowToPayload(row: ImportPreviewRow): BatchImportRowPayload {
  const { options, answer } = buildImportOptions(row);

  return {
    rowId: row.id,
    content: row.content,
    type: row.typeLabel || row.type,
    difficulty: row.difficulty,
    tags: row.tags,
    lessonId: row.lessonId,
    subjectTitle: row.subject,
    chapterTitle: row.chapter,
    lessonTitle: row.lesson,
    options,
    answer,
    explanation: row.explanation,
  };
}
