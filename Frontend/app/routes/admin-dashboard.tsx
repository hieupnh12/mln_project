import type { Route } from "./+types/admin-dashboard";
import { AdminUserManagementPage } from "~/features/admin/pages/admin-user-management-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quản lý người dùng | Admin | Học LLCT" },
    {
      name: "description",
      content: "Quản lý tài khoản người dùng hệ thống.",
    },
  ];
}

export default function AdminDashboard() {
  return <AdminUserManagementPage />;
}
