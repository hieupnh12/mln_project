export const EXAMS_API_ENDPOINTS = {
  catalog: (subjectId: number) => `/student/courses/${subjectId}/quiz-catalog`,
  session: (subjectId: number, quizId: string) =>
    `/student/courses/${subjectId}/quizzes/${quizId}/session`,
  submit: (subjectId: number, quizId: string) =>
    `/student/courses/${subjectId}/quizzes/${quizId}/submit`,
  review: (subjectId: number, attemptId: string) =>
    `/student/courses/${subjectId}/attempts/${attemptId}/review`,
  summary: (subjectId: number, attemptId: string) =>
    `/student/courses/${subjectId}/attempts/${attemptId}/summary`,
} as const;

export const EXAMS_CATALOG_STALE_MS = 90_000;

export const EXAMS_QUERY_KEYS = {
  catalog: (subjectId: number) => ["student", "exams", "catalog", subjectId] as const,
  catalogRoot: ["student", "exams", "catalog"] as const,
  session: (subjectId: number, quizId: string) =>
    ["student", "exams", "session", subjectId, quizId] as const,
  review: (subjectId: number, attemptId: string) =>
    ["student", "exams", "review", subjectId, attemptId] as const,
  summary: (subjectId: number, attemptId: string) =>
    ["student", "exams", "summary", subjectId, attemptId] as const,
} as const;

export const EXAM_AUTOSAVE_INTERVAL_MS = 30_000;
