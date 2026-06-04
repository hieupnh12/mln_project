import {
  fetchPracticeQuestionCount,
  fetchPracticeQuestions,
} from "../api/practice.api";
import type { PracticeQuestion, PracticeScope } from "../types/practice.types";
import { mapPracticeQuestionDto } from "../utils/map-practice-question-dto";

export async function getPracticeQuestions(
  subjectId: number,
  scope: PracticeScope,
  size: number,
): Promise<PracticeQuestion[]> {
  const response = await fetchPracticeQuestions(subjectId, scope, size);
  return response
    .map(mapPracticeQuestionDto)
    .filter((question): question is PracticeQuestion => question != null);
}

export function getPracticeQuestionCount(subjectId: number, scope: PracticeScope) {
  return fetchPracticeQuestionCount(subjectId, scope);
}
