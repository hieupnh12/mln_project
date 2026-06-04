import { AUTH_COOKIE_KEYS } from "~/shared/constants/auth-session.constants";
import type { AppUserRole } from "~/shared/types/auth-session.types";

import { AUTH_ROLE_REDIRECTS } from "../constants/auth.constants";

const allowedRoles: readonly AppUserRole[] = ["student", "teacher", "admin"];

function isAppUserRole(value: string | null): value is AppUserRole {
  return allowedRoles.some((role) => role === value);
}

function safeDecodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getCookieValue(cookieHeader: string | null, key: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookiePair = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${key}=`));

  if (!cookiePair) {
    return null;
  }

  return safeDecodeCookieValue(cookiePair.slice(key.length + 1));
}

export function getAuthenticatedRedirectPath(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = getCookieValue(cookieHeader, AUTH_COOKIE_KEYS.accessToken);

  if (!accessToken) {
    return null;
  }

  const role = getCookieValue(cookieHeader, AUTH_COOKIE_KEYS.userRole);
  const redirectRole = isAppUserRole(role) ? role : "student";

  return AUTH_ROLE_REDIRECTS[redirectRole];
}
