import { fetchPracticeQuestions } from "../api/practice.api";
import type { PracticeQuestion, PracticeScope } from "../types/practice.types";
import { mapPracticeQuestionDto } from "../utils/map-practice-question-dto";

export async function getPracticeQuestions(
  subjectId: number,
  scope: PracticeScope,
): Promise<PracticeQuestion[]> {
  const response = await fetchPracticeQuestions(subjectId, scope);
  return response
    .map(mapPracticeQuestionDto)
    .filter((question): question is PracticeQuestion => question != null);
}
