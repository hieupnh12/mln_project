export const COURSE_STRUCTURE_ENDPOINTS = {
  createSubject: "/subjects/create",
  updateSubject: (subjectId: number) => `/subjects/${subjectId}`,
  deleteSubject: (subjectId: number) => `/subjects/${subjectId}`,
  chaptersBySubject: (subjectId: number) => `/chapters/${subjectId}`,
  createChapter: (subjectId: number) => `/chapters/create/${subjectId}`,
  updateChapter: (chapterId: number) => `/chapters/${chapterId}`,
  deleteChapter: (chapterId: number) => `/chapters/${chapterId}`,
  lessonsByChapter: (chapterId: number) => `/lessons/chapter/${chapterId}`,
  createLesson: (chapterId: number, teacherId: number) =>
    `/lessons/chapter/${chapterId}/teacher/${teacherId}`,
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

/** Khớp backend LibreOffice (120s) + buffer render PDF / upload file. */
export const MATERIAL_UPLOAD_TIMEOUT_MS = 180_000;
