import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("student", "routes/student.tsx", [
    index("routes/student-dashboard.tsx"),
    route("dashboard", "routes/student-dashboard-redirect.tsx"),
    route("courses/:courseId", "routes/student-course.tsx"),
  ]),
  route("teacher", "routes/teacher.tsx", [
    index("routes/teacher-dashboard.tsx"),
    route("dashboard", "routes/teacher-dashboard-redirect.tsx"),
    route("courses", "routes/teacher-courses.tsx"),
    route("courses/:subjectId", "routes/teacher-course-detail.tsx"),
    route("pdfs", "routes/teacher-pdfs.tsx"),
    route("mindmaps", "routes/teacher-mindmaps.tsx"),
    route("flashcards", "routes/teacher-flashcards.tsx"),
    route("questions", "routes/teacher-questions.tsx"),
    route("quizzes", "routes/teacher-quizzes.tsx"),
  ]),
] satisfies RouteConfig;
