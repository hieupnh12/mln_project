export const COURSE_LEARNING_ENDPOINTS = {
  chaptersBySubject: (subjectId: number) => `/chapters/${subjectId}`,
  lessonsByChapter: (chapterId: number) => `/lessons/chapter/${chapterId}`,
  materialDetail: (materialId: number) => `/materials/${materialId}`,
} as const;

export const COURSE_LEARNING_QUERY_KEYS = {
  root: ["student", "course-learning"] as const,
  chapters: (subjectId: number) =>
    ["student", "course-learning", "chapters", subjectId] as const,
  lessons: (chapterId: number) =>
    ["student", "course-learning", "lessons", chapterId] as const,
  material: (materialId: number) =>
    ["student", "course-learning", "material", materialId] as const,
} as const;
