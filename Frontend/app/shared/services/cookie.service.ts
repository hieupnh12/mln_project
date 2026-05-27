import Cookies from "js-cookie";

type CookieSameSite = "Strict" | "Lax" | "None";

type CookieOptions = {
  maxAgeSeconds?: number;
  path?: string;
  sameSite?: CookieSameSite;
  secure?: boolean;
};

const DEFAULT_COOKIE_PATH = "/";

function shouldUseSecureCookie() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

export function getCookie(name: string) {
  return Cookies.get(name) ?? null;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  Cookies.set(name, value, {
    expires:
      typeof options.maxAgeSeconds === "number"
        ? options.maxAgeSeconds / 86_400
        : undefined,
    path: options.path ?? DEFAULT_COOKIE_PATH,
    sameSite: options.sameSite ?? "Lax",
    secure: options.secure ?? shouldUseSecureCookie(),
  });
}

export function deleteCookie(name: string, path = DEFAULT_COOKIE_PATH) {
  Cookies.remove(name, { path });
}
