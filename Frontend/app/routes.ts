import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("student/dashboard", "routes/student-dashboard.tsx"),
  route("student/courses/:courseId", "routes/student-course.tsx"),
  route("teacher", "routes/teacher.tsx"),
  route("teacher/dashboard", "routes/teacher-dashboard.tsx"),
] satisfies RouteConfig;
