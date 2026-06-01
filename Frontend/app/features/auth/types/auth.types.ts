import type { AppUserRole } from "~/shared/types/auth-session.types";

export type UserRole = AppUserRole;

export type GoogleLoginUrlResponse = {
  redirectUrl: string;
};
