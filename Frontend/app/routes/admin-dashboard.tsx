import type { Route } from "./+types/admin-dashboard";
import { AdminUserManagementPage } from "~/features/admin/pages/admin-user-management-page";

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
  return <AdminUserManagementPage />;
}
