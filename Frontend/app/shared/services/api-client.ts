import axios, { type AxiosError } from "axios";

import { frontendEnv } from "../config/env";
import type {
  ApiClientErrorParams,
  ApiErrorPayload,
} from "../types/api.types";
import { getAccessToken } from "./auth-token.service";
import { clearAuthSession } from "./auth-session.service";

const DEFAULT_API_ERROR_MESSAGE = "Khong the ket noi API. Vui long thu lai.";

export const apiClient = axios.create({
  baseURL: frontendEnv.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: frontendEnv.apiWithCredentials,
  timeout: 15000,
});

export class ApiRequestError extends Error {
  code?: string;
  status?: number;
  details?: ApiClientErrorParams["details"];

  constructor(params: ApiClientErrorParams) {
    super(params.message);
    this.name = "ApiRequestError";
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }
}

function toApiRequestError(error: AxiosError<ApiErrorPayload>) {
  const payload = error.response?.data;
  const code = payload?.code != null ? String(payload.code) : undefined;

  return new ApiRequestError({
    message: payload?.message ?? error.message ?? DEFAULT_API_ERROR_MESSAGE,
    code,
    status: error.response?.status,
    details: payload?.errors,
  });
}

export function normalizeApiError(error: unknown) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return toApiRequestError(error);
  }

  if (error instanceof Error) {
    return new ApiRequestError({ message: error.message });
  }

  return new ApiRequestError({ message: DEFAULT_API_ERROR_MESSAGE });
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = normalizeApiError(error);
    
    // Xử lý lỗi bảo mật: 401 (Hết hạn token) hoặc 403 (Không đủ quyền)
    if (apiError.status === 401 || apiError.status === 403) {
      clearAuthSession();
      // Chuyển hướng người dùng về trang đăng nhập
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login?error=session_expired";
      }
    }
    
    return Promise.reject(apiError);
  },
);
