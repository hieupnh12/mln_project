export const COURSE_STRUCTURE_ENDPOINTS = {
  chaptersBySubject: (subjectId: number) => `/chapters/${subjectId}`,
  createChapter: (subjectId: number) => `/chapters/create/${subjectId}`,
  updateChapter: (chapterId: number) => `/chapters/${chapterId}`,
  deleteChapter: (chapterId: number) => `/chapters/${chapterId}`,
  lessonsByChapter: (chapterId: number) => `/lessons/chapter/${chapterId}`,
  createLesson: (chapterId: number) =>
    `/lessons/chapter/${chapterId}`,
  updateLesson: (lessonId: number) => `/lessons/${lessonId}`,
  deleteLesson: (lessonId: number) => `/lessons/${lessonId}`,
  lessonDetail: (lessonId: number) => `/lessons/${lessonId}`,
  createMaterial: (lessonId: number) => `/materials/lesson/${lessonId}`,
  materialDetail: (materialId: number) => `/materials/${materialId}`,
  deleteMaterial: (materialId: number) => `/materials/${materialId}`,
} as const;

export const COURSE_STRUCTURE_QUERY_KEYS = {
  root: ["teacher", "course-structure"] as const,
  subjects: ["teacher", "course-structure", "subjects"] as const,
  subject: (subjectId: number) => ["teacher", "course-structure", "subject", subjectId] as const,
  chapters: (subjectId: number) =>
    ["teacher", "course-structure", "chapters", subjectId] as const,
  lessons: (chapterId: number) =>
    ["teacher", "course-structure", "lessons", chapterId] as const,
  material: (materialId: number) =>
    ["teacher", "course-structure", "material", materialId] as const,
} as const;

/** Dev: backend chưa có JWT — dùng teacher mặc định giống question-library. */
export const DEFAULT_TEACHER_ID = 1;
