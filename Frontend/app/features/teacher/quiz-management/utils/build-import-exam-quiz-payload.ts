import type { LessonOptionDto } from "../../question-library/types/question-library-api.types";
import type { ImportPreviewRow } from "../../question-library/types/import-batch.types";
import type { ImportExamAsQuizPayload, ImportExamQuizConfig } from "../types/quiz-import.types";
import { mapImportPreviewRowToPayload } from "../../question-library/utils/map-import-batch-payload";

function resolveQuizChapter(rows: ImportPreviewRow[]): string {
  const chapterTitles = [...new Set(rows.map((row) => row.chapter).filter(Boolean))];
  return chapterTitles.length === 1 ? chapterTitles[0]! : "all";
}

function resolveQuizLesson(rows: ImportPreviewRow[], chapter: string): string {
  if (chapter === "all") {
    return "all";
  }
  const lessonTitles = [...new Set(rows.map((row) => row.lesson).filter(Boolean))];
  return lessonTitles.length === 1 ? lessonTitles[0]! : "all";
}

function resolveQuizCourse(
  rows: ImportPreviewRow[],
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number,
): string {
  const subjectTitles = [...new Set(rows.map((row) => row.subject).filter(Boolean))];
  if (subjectTitles.length === 1) {
    return subjectTitles[0]!;
  }

  const fallbackLesson = lessonOptions.find((option) => option.id === defaultLessonId);
  return fallbackLesson?.subjectTitle ?? lessonOptions[0]?.subjectTitle ?? "";
}

export function createDefaultImportExamQuizConfig(
  fileName: string | null,
  rows: ImportPreviewRow[],
  lessonOptions: LessonOptionDto[],
  defaultLessonId: number,
  timePerQuestionSeconds = 60,
): ImportExamQuizConfig {
  const chapter = resolveQuizChapter(rows);
  const course = resolveQuizCourse(rows, lessonOptions, defaultLessonId);
  const baseTitle = fileName?.replace(/\.[^.]+$/, "").trim() || "Đề import";
  const duration = Math.max(5, Math.ceil((rows.length * timePerQuestionSeconds) / 60));

  return {
    title: baseTitle,
    course,
    chapter,
    lesson: resolveQuizLesson(rows, chapter),
    duration,
    passingScore: 70,
    shuffleAnswers: true,
    timePerQuestionSeconds,
  };
}

export function buildImportExamAsQuizPayload(
  rows: ImportPreviewRow[],
  defaultLessonId: number,
  targetStatus: "PENDING" | "PUBLISHED",
  config: ImportExamQuizConfig,
): ImportExamAsQuizPayload {
  return {
    lessonId: defaultLessonId,
    targetStatus,
    rows: rows.map(mapImportPreviewRowToPayload),
    title: config.title.trim() || "Đề import",
    course: config.course,
    chapter: config.chapter || "all",
    lesson: config.lesson || "all",
    duration: config.duration,
    passingScore: config.passingScore,
    shuffleAnswers: config.shuffleAnswers,
  };
}
