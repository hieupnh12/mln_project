import * as flashcardApi from "../api/flashcard.api";
import type {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
} from "../types/flashcard.types";

export function getFlashcardSets() {
  return flashcardApi.fetchFlashcardSets();
}

export function getFlashcards(chapterId: number) {
  return flashcardApi.fetchFlashcardsByChapter(chapterId);
}

export function addFlashcard(
  chapterId: number,
  request: CreateFlashcardRequest,
) {
  return flashcardApi.createFlashcard(chapterId, request);
}

export function editFlashcard(id: number, request: UpdateFlashcardRequest) {
  return flashcardApi.updateFlashcard(id, request);
}

export function removeFlashcard(id: number) {
  return flashcardApi.deleteFlashcard(id);
}

export function addFlashcardsBulk(
  chapterId: number,
  requests: CreateFlashcardRequest[],
) {
  return flashcardApi.createFlashcardsBulk(chapterId, requests);
}
