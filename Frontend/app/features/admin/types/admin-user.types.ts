import type { AppUserRole } from "~/shared/types/auth-session.types";

export type AdminUserRole = AppUserRole;

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: AdminUserRole;
  isActive: boolean;
  googleId: string | null;
};

export type AdminUserUpsertPayload = {
  email: string;
  fullName: string;
  role: AdminUserRole;
  isActive: boolean;
};

export type AdminUserFormValue = AdminUserUpsertPayload;

export type BackendApiResponse<T> = {
  code: number;
  message?: string;
  result?: T;
};
