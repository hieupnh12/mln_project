import { importExamAsQuizApi } from "../api/quiz-import.api";
import type { ImportExamAsQuizPayload } from "../types/quiz-import.types";

export function importExamAsQuiz(payload: ImportExamAsQuizPayload) {
  return importExamAsQuizApi(payload);
}
