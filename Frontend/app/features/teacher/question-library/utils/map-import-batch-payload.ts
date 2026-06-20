import type { BatchImportRowPayload } from "../types/question-library-api.types";
import type { ImportPreviewRow } from "../types/import-batch.types";
import {
  formatCorrectAnswerFromIndices,
  parseCorrectAnswerIndices,
} from "./resolve-correct-option-indices";

function buildImportOptions(row: ImportPreviewRow) {
  const rawOptions = (row.options ?? []).map((option) => option.trim()).filter(Boolean);
  const correctIndices = parseCorrectAnswerIndices(row.answer ?? "", rawOptions);
  const resolvedAnswer = formatCorrectAnswerFromIndices(rawOptions, correctIndices);

  if (rawOptions.length === 0) {
    return { options: undefined, answer: resolvedAnswer || row.answer?.trim() };
  }

  return {
    options: rawOptions.map((content, index) => ({
      content,
      isCorrect: correctIndices.includes(index),
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
