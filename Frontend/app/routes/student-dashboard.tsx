import { StudentDashboardPage } from "../features/student/dashboard/pages/student-dashboard-page";

export function meta() {
  return [
    { title: "Học viên | Học LLCT" },
    {
      name: "description",
      content: "Không gian học tập và theo dõi tiến độ dành cho học viên Lý luận chính trị trên Học LLCT.",
    },
  ];
}

export default function StudentDashboardRoute() {
  return <StudentDashboardPage />;
}
