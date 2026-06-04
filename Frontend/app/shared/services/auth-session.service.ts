import {
  AUTH_COOKIE_KEYS,
  AUTH_COOKIE_MAX_AGE_SECONDS,
} from "../constants/auth-session.constants";
import type {
  AppUserRole,
  AuthSession,
  AuthSessionUser,
} from "../types/auth-session.types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token.service";
import { deleteCookie, getCookie, setCookie } from "./cookie.service";

const allowedRoles: readonly AppUserRole[] = ["student", "teacher", "admin"];

function isAppUserRole(value: string | null): value is AppUserRole {
  return allowedRoles.some((role) => role === value);
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

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

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

function resolveSessionRole(token: string, storedRole: string | null): AppUserRole {
  if (isAppUserRole(storedRole)) {
    return storedRole;
  }

  return getRoleFromJwt(token) ?? "student";
}

function getStoredUser(token: string): AuthSessionUser | undefined {
  const jwtPayload = decodeJwtPayload(token);
  const user: AuthSessionUser = {
    id: getCookie(AUTH_COOKIE_KEYS.userId) ?? toOptionalString(jwtPayload?.sub),
    name: getCookie(AUTH_COOKIE_KEYS.userName) ?? undefined,
    email: getCookie(AUTH_COOKIE_KEYS.userEmail) ?? toOptionalString(jwtPayload?.email),
    avatarUrl: getCookie(AUTH_COOKIE_KEYS.userAvatarUrl) ?? undefined,
  };

  return Object.values(user).some(Boolean) ? user : undefined;
}

function setOptionalCookie(name: string, value: string | undefined) {
  if (!value) {
    deleteCookie(name);
    return;
  }

  setCookie(name, value, {
    maxAgeSeconds: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

export function getAuthSession(): AuthSession | null {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  const role = resolveSessionRole(accessToken, getCookie(AUTH_COOKIE_KEYS.userRole));

  return {
    accessToken,
    role,
    user: getStoredUser(accessToken),
  };
}

export function setAuthSession(session: AuthSession) {
  setAccessToken(session.accessToken);
  setCookie(AUTH_COOKIE_KEYS.userRole, session.role, {
    maxAgeSeconds: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
  setOptionalCookie(AUTH_COOKIE_KEYS.userId, session.user?.id);
  setOptionalCookie(AUTH_COOKIE_KEYS.userName, session.user?.name);
  setOptionalCookie(AUTH_COOKIE_KEYS.userEmail, session.user?.email);
  setOptionalCookie(AUTH_COOKIE_KEYS.userAvatarUrl, session.user?.avatarUrl);
}

export function clearAuthSession() {
  clearAccessToken();
  deleteCookie(AUTH_COOKIE_KEYS.userRole);
  deleteCookie(AUTH_COOKIE_KEYS.userId);
  deleteCookie(AUTH_COOKIE_KEYS.userName);
  deleteCookie(AUTH_COOKIE_KEYS.userEmail);
  deleteCookie(AUTH_COOKIE_KEYS.userAvatarUrl);
}
