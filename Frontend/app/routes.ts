import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("auth/callback", "routes/auth-callback.tsx"),
  route("admin", "routes/admin.tsx", [
    index("routes/admin-dashboard.tsx"),
    route("dashboard", "routes/admin-dashboard-redirect.tsx"),
  ]),
  route("student", "routes/student.tsx", [
    index("routes/student-dashboard.tsx"),
    route("dashboard", "routes/student-dashboard-redirect.tsx"),
    route("courses/:courseId", "routes/student-course.tsx"),
    route("courses/:courseId/practice", "routes/student-practice.tsx"),
    route("courses/:courseId/exams/:quizId", "routes/student-exam-session.tsx"),
    route(
      "courses/:courseId/exams/:quizId/summary/:attemptId",
      "routes/student-exam-summary.tsx",
    ),
    route(
      "courses/:courseId/exams/:quizId/review/:attemptId",
      "routes/student-exam-review.tsx",
    ),
    route("mindmap-preview", "routes/student-mindmap.tsx"),
    route("lessons/:lessonId/mindmap", "routes/student-lesson-mindmap.tsx"),
    route("chapters/:chapterId/flashcards", "routes/student-chapter-flashcards.tsx"),
  ]),
  route("teacher", "routes/teacher.tsx", [
    index("routes/teacher-dashboard.tsx"),
    route("dashboard", "routes/teacher-dashboard-redirect.tsx"),
    route("courses", "routes/teacher-courses.tsx"),
    route("courses/:subjectId", "routes/teacher-course-detail.tsx"),
    route("pdfs", "routes/teacher-pdfs.tsx"),
    route("mindmaps", "routes/teacher-mindmaps.tsx"),
    route("mindmap-preview", "routes/teacher-mindmap.tsx"),
    route("lessons/:lessonId/mindmap", "routes/teacher-lesson-mindmap.tsx"),
    route("flashcards", "routes/teacher-flashcards.tsx"),
    route("flashcards/new", "routes/teacher-create-flashcard.tsx"),
    route("questions", "routes/teacher-questions.tsx"),
    route("quizzes", "routes/teacher-quizzes.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
