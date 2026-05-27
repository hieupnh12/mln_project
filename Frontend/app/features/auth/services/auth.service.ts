import { fetchGoogleLoginUrl } from "../api/auth.api";
import { AUTH_ROLE_REDIRECTS } from "../constants/auth.constants";
import type { SignInResult, UserRole } from "../types/auth.types";
import { setAuthSession } from "~/shared/services/auth-session.service";

function createFrontendSessionToken(role: UserRole) {
  return `frontend-${role}-${Date.now()}`;
}

export function signInWithGoogleAsRole(role: UserRole): SignInResult {
  setAuthSession({
    accessToken: createFrontendSessionToken(role),
    role,
  });

  return {
    role,
    redirectTo: AUTH_ROLE_REDIRECTS[role],
  };
}

export function getGoogleLoginUrl(role: UserRole) {
  return fetchGoogleLoginUrl({ role });
}
