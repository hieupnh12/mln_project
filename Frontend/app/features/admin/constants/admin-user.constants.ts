import type { AdminUserRole } from "../types/admin-user.types";

export const ADMIN_USER_ENDPOINTS = {
  users: "/admin/users",
} as const;

export const ADMIN_USER_ROLE_OPTIONS: ReadonlyArray<{
  value: AdminUserRole;
  label: string;
}> = [
  { value: "student", label: "Học sinh" },
  { value: "teacher", label: "Giáo viên" },
  { value: "admin", label: "Quản trị viên" },
];

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;
