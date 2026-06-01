import { fetchGoogleLoginUrl } from "../api/auth.api";

export function getGoogleLoginUrl() {
  return fetchGoogleLoginUrl();
}
