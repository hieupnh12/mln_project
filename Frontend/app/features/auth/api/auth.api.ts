import { apiClient } from "~/shared/services/api-client";

import { AUTH_ENDPOINTS } from "../constants/auth.constants";
import type {
  GoogleLoginUrlResponse,
} from "../types/auth.types";

export async function fetchGoogleLoginUrl() {
  const response = await apiClient.get<{ result: GoogleLoginUrlResponse }>(
    AUTH_ENDPOINTS.googleLoginUrl,
  );

  return response.data.result;
}
