export type AppUserRole = "student" | "teacher" | "admin";

export type AuthSessionUser = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export type AuthSession = {
  accessToken: string;
  role: AppUserRole;
  user?: AuthSessionUser;
};
