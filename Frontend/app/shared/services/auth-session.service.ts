import {
  AUTH_COOKIE_KEYS,
  AUTH_COOKIE_MAX_AGE_SECONDS,
} from "../constants/auth-session.constants";
import type { AppUserRole, AuthSession } from "../types/auth-session.types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token.service";
import { deleteCookie, getCookie, setCookie } from "./cookie.service";

const allowedRoles: readonly AppUserRole[] = ["student", "teacher"];

function isAppUserRole(value: string | null): value is AppUserRole {
  return allowedRoles.some((role) => role === value);
}

export function getAuthSession(): AuthSession | null {
  const accessToken = getAccessToken();
  const role = getCookie(AUTH_COOKIE_KEYS.userRole);

  if (!accessToken || !isAppUserRole(role)) {
    return null;
  }

  return {
    accessToken,
    role,
  };
}

export function setAuthSession(session: AuthSession) {
  setAccessToken(session.accessToken);
  setCookie(AUTH_COOKIE_KEYS.userRole, session.role, {
    maxAgeSeconds: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearAuthSession() {
  clearAccessToken();
  deleteCookie(AUTH_COOKIE_KEYS.userRole);
}
