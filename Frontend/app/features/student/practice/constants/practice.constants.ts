import type { PracticeModeSettings } from "../types/practice.types";

export const PRACTICE_QUERY_KEYS = {
  root: ["student", "practice"] as const,
  questions: (subjectId: number, chapterId: number | null, lessonId: number | null) =>
    ["student", "practice", "questions", subjectId, chapterId, lessonId] as const,
};

export const DEFAULT_PRACTICE_SETTINGS: PracticeModeSettings = {
  autoAdvance: false,
  requireContinue: true,
  autoAdvanceSeconds: 8,
};

export const PRACTICE_AUTO_SECONDS_OPTIONS = [5, 8, 12, 15] as const;
