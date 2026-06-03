import { AdminLayout } from "../layouts/admin-layout";
import { ProtectedRoute } from "../shared/components/protected-route";
import { ROUTE_ACCESS } from "../shared/constants/route-access";

export function meta() {
  return [
    { title: "Quản trị viên | M-L Master" },
    {
      name: "description",
      content: "Bảng điều khiển dành cho quản trị viên.",
    },
  ];
}

export default function AdminRoute() {
  return (
    <ProtectedRoute allowedRoles={ROUTE_ACCESS.admin}>
      <AdminLayout />
    </ProtectedRoute>
  );
}
