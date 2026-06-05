export const FLASHCARD_ENDPOINTS = {
  chapters: "/teacher/chapters",
  chapterFlashcards: (chapterId: number) => `/teacher/chapters/${chapterId}/flashcards`,
  chapterFlashcardsBulk: (chapterId: number) => `/teacher/chapters/${chapterId}/flashcards/bulk`,
  flashcardDetail: (id: number) => `/teacher/flashcards/${id}`,
} as const;
