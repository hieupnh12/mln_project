import { frontendEnv } from "../config/env";

/** Base URL cho endpoint không nằm dưới `/api` (chapters, lessons, materials). */
export function getBackendRootUrl() {
  const base = frontendEnv.apiBaseUrl.replace(/\/$/, "");

  if (base.endsWith("/api")) {
    return base.slice(0, -4);
  }

  return base;
}
