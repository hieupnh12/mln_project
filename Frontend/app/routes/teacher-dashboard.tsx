import type { Route } from "./+types/teacher-dashboard";
import { TeacherDashboardPage } from "../features/teacher/pages/teacher-dashboard-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giáo viên | M-L Master" },
    {
      name: "description",
      content: "Bảng điều khiển quản lý khóa học dành cho giáo viên.",
    },
  ];
}

export default function TeacherDashboardRoute() {
  return <TeacherDashboardPage />;
}
