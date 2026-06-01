export const FLASHCARD_ENDPOINTS = {
  lessons: "/teacher/lessons",
  lessonFlashcards: (lessonId: number) => `/teacher/lessons/${lessonId}/flashcards`,
  lessonFlashcardsBulk: (lessonId: number) => `/teacher/lessons/${lessonId}/flashcards/bulk`,
  flashcardDetail: (id: number) => `/teacher/flashcards/${id}`,
} as const;
