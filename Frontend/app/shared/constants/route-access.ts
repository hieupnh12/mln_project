import type { AppUserRole } from "../types/auth-session.types";

export const ROUTE_ACCESS = {
  admin: ["admin"],
  student: ["student"],
  teacher: ["teacher", "admin"],
} as const satisfies Record<string, readonly AppUserRole[]>;

const ROLE_PATH_PREFIX: Record<AppUserRole, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export function isPathAllowedForRole(path: string, role: AppUserRole): boolean {
  if (role === "admin") {
    return path.startsWith("/admin") || path.startsWith("/teacher");
  }
  const prefix = ROLE_PATH_PREFIX[role];
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function isTeacherPath(path: string): boolean {
  return path === "/teacher" || path.startsWith("/teacher/");
}
