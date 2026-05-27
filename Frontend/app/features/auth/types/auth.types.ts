import type { AppUserRole } from "~/shared/types/auth-session.types";

export type UserRole = AppUserRole;

export type SignInResult = {
  role: UserRole;
  redirectTo: string;
};

export type GoogleLoginUrlRequest = {
  role: UserRole;
};

export type GoogleLoginUrlResponse = {
  redirectUrl: string;
};
