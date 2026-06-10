import { StudentDashboardPage } from "../features/student/dashboard/pages/student-dashboard-page";

export function meta() {
  return [
    { title: "Học viên | Mác - Lê Nin" },
    {
      name: "description",
      content: "Không gian học tập và theo dõi tiến độ dành cho học viên Mác - Lê Nin.",
    },
  ];
}

export default function StudentDashboardRoute() {
  return <StudentDashboardPage />;
}
