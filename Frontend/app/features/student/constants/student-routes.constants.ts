export const STUDENT_ROUTES = {
  dashboard: "/student",
  legacyDashboard: "/student/dashboard",
  courseDetail: "/student/courses",
} as const;

export function getStudentCoursePath(courseId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}`;
}

export function getStudentPracticePath(courseId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}/practice`;
}
