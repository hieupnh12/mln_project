import type { AppUserRole } from "../types/auth-session.types";

export const ROUTE_ACCESS = {
  admin: ["admin"],
  student: ["student"],
  teacher: ["teacher"],
} as const satisfies Record<string, readonly AppUserRole[]>;
