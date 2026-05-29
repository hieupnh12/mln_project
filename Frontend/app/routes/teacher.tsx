import { TeacherLayout } from "../layouts/teacher-layout";
import { ProtectedRoute } from "../shared/components/protected-route";
import { ROUTE_ACCESS } from "../shared/constants/route-access";

export function meta() {
  return [
    { title: "Giáo viên | M-L Master" },
    {
      name: "description",
      content: "Bảng điều khiển quản lý khóa học dành cho giáo viên.",
    },
  ];
}

export default function TeacherRoute() {
  return (
    <ProtectedRoute allowedRoles={ROUTE_ACCESS.teacher}>
      <TeacherLayout />
    </ProtectedRoute>
  );
}
