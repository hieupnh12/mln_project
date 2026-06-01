import { apiClient } from "~/shared/services/api-client";

import { FLASHCARD_ENDPOINTS } from "../constants/flashcard.constants";
import type {
  CreateFlashcardRequest,
  Flashcard,
  FlashcardSet,
  UpdateFlashcardRequest,
} from "../types/flashcard.types";

export type SpringBootResponse<T> = {
  code: number;
  message?: string;
  result: T;
};

export async function fetchFlashcardSets(): Promise<FlashcardSet[]> {
  const response = await apiClient.get<SpringBootResponse<FlashcardSet[]>>(
    FLASHCARD_ENDPOINTS.lessons,
  );
  return response.data.result;
}

export async function fetchFlashcardsByLesson(
  lessonId: number,
): Promise<Flashcard[]> {
  const response = await apiClient.get<SpringBootResponse<Flashcard[]>>(
    FLASHCARD_ENDPOINTS.lessonFlashcards(lessonId),
  );
  return response.data.result;
}

export async function createFlashcard(
  lessonId: number,
  request: CreateFlashcardRequest,
): Promise<Flashcard> {
  const response = await apiClient.post<SpringBootResponse<Flashcard>>(
    FLASHCARD_ENDPOINTS.lessonFlashcards(lessonId),
    request,
  );
  return response.data.result;
}

export async function updateFlashcard(
  id: number,
  request: UpdateFlashcardRequest,
): Promise<Flashcard> {
  const response = await apiClient.put<SpringBootResponse<Flashcard>>(
    FLASHCARD_ENDPOINTS.flashcardDetail(id),
    request,
  );
  return response.data.result;
}

export async function deleteFlashcard(id: number): Promise<void> {
  await apiClient.delete<SpringBootResponse<void>>(
    FLASHCARD_ENDPOINTS.flashcardDetail(id),
  );
}

export async function createFlashcardsBulk(
  lessonId: number,
  request: CreateFlashcardRequest[],
): Promise<Flashcard[]> {
  const response = await apiClient.post<SpringBootResponse<Flashcard[]>>(
    FLASHCARD_ENDPOINTS.lessonFlashcardsBulk(lessonId),
    request,
  );
  return response.data.result;
}
