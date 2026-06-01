const DEFAULT_API_BASE_URL = "/api";

function readEnvString(value: string | undefined, fallback: string) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : fallback;
}

function readEnvBoolean(value: string | undefined, fallback: boolean) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

export const frontendEnv = {
  apiBaseUrl: readEnvString(
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL,
    DEFAULT_API_BASE_URL,
  ),
  apiWithCredentials: readEnvBoolean(
    import.meta.env.VITE_API_WITH_CREDENTIALS,
    false,
  ),
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE,
} as const;
