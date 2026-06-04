import type { Route } from "./+types/admin-dashboard";
import { AdminUserManagementPage } from "~/features/admin/pages/admin-user-management-page";
import { ProtectedRoute } from "../shared/components/protected-route";
import { ROUTE_ACCESS } from "../shared/constants/route-access";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | M-L Master" },
    {
      name: "description",
      content: "M-L Master Admin Dashboard",
    },
  ];
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={ROUTE_ACCESS.admin}>
      <AdminUserManagementPage />
    </ProtectedRoute>
  );
}
