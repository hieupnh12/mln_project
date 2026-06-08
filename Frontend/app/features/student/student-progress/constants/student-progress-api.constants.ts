export const STUDENT_PROGRESS_ENDPOINTS = {
  subjectLessonProgress: (subjectId: number) =>
    `/student/courses/${subjectId}/lesson-progress`,
  chapterLessonProgress: (chapterId: number) =>
    `/student/chapters/${chapterId}/lesson-progress`,
  lessonProgress: (lessonId: number) => `/student/lessons/${lessonId}/progress`,
  resume: "/student/progress/resume",
} as const;

export const STUDENT_PROGRESS_QUERY_KEYS = {
  root: ["student", "progress"] as const,
  subject: (subjectId: number) => ["student", "progress", "subject", subjectId] as const,
  chapter: (chapterId: number) => ["student", "progress", "chapter", chapterId] as const,
  resume: ["student", "progress", "resume"] as const,
} as const;
