import { practiceQuestionBank } from "../constants/practice.constants";
import type { PracticeQuestion, PracticeScope } from "../types/practice.types";
import { filterPracticeQuestions } from "../utils/filter-practice-questions";

export async function getPracticeQuestions(scope: PracticeScope): Promise<PracticeQuestion[]> {
  const filtered = filterPracticeQuestions(scope);
  return filtered.length > 0 ? filtered : practiceQuestionBank;
}
