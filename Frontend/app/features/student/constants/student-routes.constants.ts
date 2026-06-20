export const STUDENT_ROUTES = {
  dashboard: "/student",
  legacyDashboard: "/student/dashboard",
  courseDetail: "/student/courses",
} as const;

export function getStudentCoursePath(courseId: string) {
  return `${STUDENT_ROUTES.courseDetail}/${courseId}`;
}

/** Tab Flashcard trên trang khóa học. */
export function getStudentCourseFlashcardsTabPath(courseId: string) {
  return `${getStudentCoursePath(courseId)}?tab=flashcards`;
}

/** Tab Luyện tập trên trang khóa học. */
export function getStudentCoursePracticeTabPath(courseId: string) {
  return `${getStudentCoursePath(courseId)}?tab=practice`;
}

/** Tab Kiểm tra (danh sách quiz) trên trang khóa học. */
export function getStudentCourseExamsTabPath(courseId: string) {
  return `${getStudentCoursePath(courseId)}?tab=exams`;
}

type StudentCourseResumeOptions = {
  chapterId?: number;
  lessonId?: number;
  materialId?: number;
  tab?: "lectures" | "practice" | "exams" | "flashcards";
};

/** Deep link tới vị trí học dở (chapter / lesson / material). */
export function getStudentCourseResumePath(
  courseId: string,
  options: StudentCourseResumeOptions = {},
) {
  const params = new URLSearchParams();

  if (options.tab && options.tab !== "lectures") {
    params.set("tab", options.tab);
  }
  if (options.chapterId != null) {
    params.set("chapter", String(options.chapterId));
  }
  if (options.lessonId != null) {
    params.set("lesson", String(options.lessonId));
  }
  if (options.materialId != null) {
    params.set("material", String(options.materialId));
  }

  const query = params.toString();
  return query ? `${getStudentCoursePath(courseId)}?${query}` : getStudentCoursePath(courseId);
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
