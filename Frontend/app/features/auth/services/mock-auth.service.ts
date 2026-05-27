import type { SignInResult, UserRole } from "../types/auth.types";

const roleRedirects: Record<UserRole, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
};

export function signInWithGoogleAsRole(role: UserRole): SignInResult {
  return {
    role,
    redirectTo: roleRedirects[role],
  };
}
