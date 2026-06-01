import type { AppUserRole } from "../types/auth-session.types";

export const ROUTE_ACCESS = {
  student: ["student"],
  teacher: ["teacher"],
} as const satisfies Record<string, readonly AppUserRole[]>;
