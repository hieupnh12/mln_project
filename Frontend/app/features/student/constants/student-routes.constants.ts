export const STUDENT_ROUTES = {
  dashboard: "/student",
  legacyDashboard: "/student/dashboard",
  courseDetail: "/student/courses",
} as const;

export function getStudentCoursePath(courseId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}`;
}

/** Tab Luyện tập trên trang khóa học. */
export function getStudentCoursePracticeTabPath(courseId: string) {
  return `${getStudentCoursePath(courseId)}?tab=practice`;
}

/** Tab Kiểm tra (danh sách quiz) trên trang khóa học. */
export function getStudentCourseExamsTabPath(courseId: string) {
  return `${getStudentCoursePath(courseId)}?tab=exams`;
}

/** Màn làm bài kiểm tra (quiz đã xuất bản). */
export function getStudentExamSessionPath(courseId: string, quizId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}/exams/${quizId}`;
}

/** Tổng kết sau khi nộp bài kiểm tra. */
export function getStudentExamSummaryPath(
  courseId: string,
  quizId: string,
  attemptId: string,
) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}/exams/${quizId}/summary/${attemptId}`;
}

/** Xem chi tiết bài làm sau khi nộp. */
export function getStudentExamReviewPath(
  courseId: string,
  quizId: string,
  attemptId: string,
) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}/exams/${quizId}/review/${attemptId}`;
}

/** @deprecated Dùng getStudentCoursePracticeTabPath */
export function getStudentCourseTestsTabPath(courseId: string) {
  return getStudentCoursePracticeTabPath(courseId);
}

/** URL cũ — route redirect sang tab Luyện tập. */
export function getStudentPracticePath(courseId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}/practice`;
}
