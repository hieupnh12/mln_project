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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  if (typeof atob !== "function") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const payload = parts[1];

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = JSON.parse(atob(paddedPayload)) as unknown;

    return isRecord(decodedPayload) ? decodedPayload : null;
  } catch {
    return null;
  }
}

function getRoleFromJwt(token: string): AppUserRole | null {
  const role = toOptionalString(decodeJwtPayload(token)?.role) ?? null;

  return isAppUserRole(role) ? role : null;
}

export function getAuthenticatedRedirectPath(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = getCookieValue(cookieHeader, AUTH_COOKIE_KEYS.accessToken);

  if (!accessToken) {
    return null;
  }

  const jwtRole = getRoleFromJwt(accessToken);
  const cookieRole = getCookieValue(cookieHeader, AUTH_COOKIE_KEYS.userRole);
  
  const redirectRole = jwtRole ?? (isAppUserRole(cookieRole) ? cookieRole : "student");

  return AUTH_ROLE_REDIRECTS[redirectRole];
}
