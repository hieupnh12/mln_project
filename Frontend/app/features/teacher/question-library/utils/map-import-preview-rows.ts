import type { ImportPreviewRow } from "../types/import-batch.types";
import type { LessonOptionDto } from "../types/question-library-api.types";
import { parseImportFile } from "./parse-import-file";
import type { ParsedImportFileRow } from "./resolve-import-lesson";
import { resolveImportLessonForRow } from "./resolve-import-lesson";

const TYPE_LABELS: Record<string, string> = {
  mcq: "Trắc nghiệm",
  essay: "Tự luận",
  truefalse: "Đúng/Sai",
  short: "Điền khuyết",
};

function normalizeTypeLabel(rawType: string) {
  const trimmed = rawType.trim();
  if (!trimmed) {
    return { type: "mcq", typeLabel: "Trắc nghiệm" };
  }
  const lower = trimmed.toLowerCase();
  if (TYPE_LABELS[lower]) {
    return { type: lower, typeLabel: TYPE_LABELS[lower] };
  }
  return { type: lower, typeLabel: trimmed };
}

export function mapParsedRowsToPreview(
  rows: ParsedImportFileRow[],
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number | null,
): ImportPreviewRow[] {
  return rows.map((row, index) => {
    const { type, typeLabel } = normalizeTypeLabel(row.type);
    const resolved = resolveImportLessonForRow(row, lessonOptions, defaultLessonId);

    return {
      id: `row-${index + 1}`,
      content: row.content,
      type,
      typeLabel,
      difficulty: row.difficulty.trim() || "Vận dụng",
      tags: row.tags,
      subject: row.subject,
      chapter: row.chapter,
      lesson: row.lesson,
      lessonId: resolved.lessonId ?? undefined,
      lessonLabel: resolved.lessonLabel,
      lessonError: resolved.lessonError,
      options: [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean),
      answer: row.correctAnswer,
      explanation: row.explanation,
    };
  });
}

export async function buildImportPreviewFromFile(
  file: File,
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number | null,
) {
  const parsed = await parseImportFile(file);
  return mapParsedRowsToPreview(parsed.rows, lessonOptions, defaultLessonId);
}

export async function buildImportPreviewFromFileWithHeaders(
  file: File,
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number | null,
) {
  const parsed = await parseImportFile(file);
  return {
    rows: mapParsedRowsToPreview(parsed.rows, lessonOptions, defaultLessonId),
    detectedHeaders: parsed.detectedHeaders,
  };
}
