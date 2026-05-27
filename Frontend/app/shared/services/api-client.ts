import axios, { type AxiosError } from "axios";

import { frontendEnv } from "../config/env";
import type {
  ApiClientErrorParams,
  ApiErrorPayload,
} from "../types/api.types";
import { getAccessToken } from "./auth-token.service";

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

  return new ApiRequestError({
    message: payload?.message ?? error.message ?? DEFAULT_API_ERROR_MESSAGE,
    code: payload?.code,
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
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
