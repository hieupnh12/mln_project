import { clearAuthSession } from "~/shared/services/auth-session.service";

import { fetchGoogleLoginUrl } from "../api/auth.api";

export function getGoogleLoginUrl() {
  return fetchGoogleLoginUrl();
}

export function logoutUser() {
  clearAuthSession();
}
