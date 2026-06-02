import { AUTH_ROLE_REDIRECTS } from "../../features/auth/constants/auth.constants";
import type { AppUserRole } from "../types/auth-session.types";

export function getRoleHomePath(role: AppUserRole): string {
  return AUTH_ROLE_REDIRECTS[role];
}
