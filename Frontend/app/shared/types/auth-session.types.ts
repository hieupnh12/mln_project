export type AppUserRole = "student" | "teacher" | "admin";

export type AuthSession = {
  accessToken: string;
  role: AppUserRole;
};
