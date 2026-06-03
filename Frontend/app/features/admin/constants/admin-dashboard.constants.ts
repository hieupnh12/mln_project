import type { AdminNavItem } from "../types/admin-dashboard.types";

export const adminProfile = {
  name: "Quản trị viên",
  plan: "System Admin",
  avatarUrl:
    "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
};

export const ADMIN_ROUTES = {
  dashboard: "/admin",
} as const;

export const adminNavItems: AdminNavItem[] = [
  { label: "Quản lý người dùng", icon: "manage_accounts", to: ADMIN_ROUTES.dashboard },
];
