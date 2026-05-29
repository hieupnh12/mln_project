import type { Route } from "./+types/teacher-dashboard";
import { TeacherOverviewPage } from "../features/teacher/overview/pages/teacher-overview-page";

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
  return <TeacherOverviewPage />;
}
