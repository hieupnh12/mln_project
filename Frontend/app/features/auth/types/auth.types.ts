export type UserRole = "student" | "teacher";

export type SignInResult = {
  role: UserRole;
  redirectTo: string;
};
