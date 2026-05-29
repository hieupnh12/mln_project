import * as flashcardApi from "../api/flashcard.api";
import type {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
} from "../types/flashcard.types";

export function getFlashcardSets() {
  return flashcardApi.fetchFlashcardSets();
}

export function getFlashcards(lessonId: number) {
  return flashcardApi.fetchFlashcardsByLesson(lessonId);
}

export function addFlashcard(
  lessonId: number,
  request: CreateFlashcardRequest,
) {
  return flashcardApi.createFlashcard(lessonId, request);
}

export function editFlashcard(id: number, request: UpdateFlashcardRequest) {
  return flashcardApi.updateFlashcard(id, request);
}

export function removeFlashcard(id: number) {
  return flashcardApi.deleteFlashcard(id);
}

export function addFlashcardsBulk(
  lessonId: number,
  requests: CreateFlashcardRequest[],
) {
  return flashcardApi.createFlashcardsBulk(lessonId, requests);
}
