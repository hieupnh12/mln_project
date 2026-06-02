import { practiceQuestionBank } from "../constants/practice.constants";
import type { PracticeQuestion, PracticeScope } from "../types/practice.types";

export function filterPracticeQuestions(scope: PracticeScope): PracticeQuestion[] {
  return practiceQuestionBank.filter((question) => {
    if (scope.chapterId != null && question.chapterId != null) {
      if (question.chapterId !== scope.chapterId) {
        return false;
      }
    } else if (scope.chapterId != null && question.chapterId == null) {
      return true;
    }

    if (scope.lessonId != null && question.lessonId != null) {
      if (question.lessonId !== scope.lessonId) {
        return false;
      }
    }

    return true;
  });
}
