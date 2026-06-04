export const PRACTICE_ENDPOINTS = {
  practiceQuestions: (subjectId: number) =>
    `/student/courses/${subjectId}/practice-questions`,
} as const;
