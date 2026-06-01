import type { AppUserRole } from "../types/auth-session.types";

export const ROUTE_ACCESS = {
  student: ["student"],
  teacher: ["teacher"],
  admin: ["admin"],
} as const satisfies Record<string, readonly AppUserRole[]>;
