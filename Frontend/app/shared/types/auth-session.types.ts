export type AppUserRole = "student" | "teacher";

export type AuthSession = {
  accessToken: string;
  role: AppUserRole;
};
