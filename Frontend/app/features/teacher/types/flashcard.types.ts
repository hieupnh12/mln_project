export type Flashcard = {
  id: number;
  lessonId: number;
  term: string;
  definition: string;
};

export type FlashcardSet = {
  id: number;
  title: string;
  cards: number;
  status: string;
  accuracy: number;
};

export type CreateFlashcardRequest = {
  term: string;
  definition: string;
};

export type UpdateFlashcardRequest = {
  term: string;
  definition: string;
};
