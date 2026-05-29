import { StudentDashboardPage } from "../features/student/dashboard/pages/student-dashboard-page";

export function meta() {
  return [
    { title: "Học sinh | ML Learning" },
    {
      name: "description",
      content: "Dashboard học tập dành cho học sinh ML Learning.",
    },
  ];
}

export default function StudentDashboardRoute() {
  return <StudentDashboardPage />;
}
