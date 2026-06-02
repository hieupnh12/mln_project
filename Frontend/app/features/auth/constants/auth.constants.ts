import type { UserRole } from "../types/auth.types";

export const AUTH_ENDPOINTS = {
  googleLoginUrl: "/auth/google/url",
} as const;

export const AUTH_ROLE_REDIRECTS: Record<UserRole, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
};
