import {
  AUTH_COOKIE_KEYS,
  AUTH_COOKIE_MAX_AGE_SECONDS,
} from "../constants/auth-session.constants";
import { deleteCookie, getCookie, setCookie } from "./cookie.service";

export function getAccessToken() {
  return getCookie(AUTH_COOKIE_KEYS.accessToken);
}

export function setAccessToken(token: string) {
  setCookie(AUTH_COOKIE_KEYS.accessToken, token, {
    maxAgeSeconds: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearAccessToken() {
  deleteCookie(AUTH_COOKIE_KEYS.accessToken);
}
