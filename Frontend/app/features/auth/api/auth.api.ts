import { apiClient } from "~/shared/services/api-client";

import { AUTH_ENDPOINTS } from "../constants/auth.constants";
import type {
  GoogleLoginUrlRequest,
  GoogleLoginUrlResponse,
} from "../types/auth.types";

export async function fetchGoogleLoginUrl(request: GoogleLoginUrlRequest) {
  const response = await apiClient.get<GoogleLoginUrlResponse>(
    AUTH_ENDPOINTS.googleLoginUrl,
    {
      params: request,
    },
  );

  return response.data;
}
