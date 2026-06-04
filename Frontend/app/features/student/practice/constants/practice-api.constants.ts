export const PRACTICE_ENDPOINTS = {
  practiceQuestionCount: (subjectId: number) =>
    `/student/courses/${subjectId}/practice-question-count`,
  practiceQuestions: (subjectId: number) =>
    `/student/courses/${subjectId}/practice-questions`,
} as const;
