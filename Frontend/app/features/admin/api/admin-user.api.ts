import { apiClient } from "~/shared/services/api-client";

import { ADMIN_USER_ENDPOINTS } from "../constants/admin-user.constants";
import type {
  AdminUser,
  AdminUserUpsertPayload,
  BackendApiResponse,
} from "../types/admin-user.types";

function getResponseMessage<T>(response: BackendApiResponse<T>, fallback: string) {
  return response.message ?? fallback;
}

function assertSuccess<T>(response: BackendApiResponse<T>, fallback: string): T {
  if (response.code !== 0 || response.result === undefined) {
    throw new Error(getResponseMessage(response, fallback));
  }

  return response.result;
}

export async function fetchAdminUsers() {
  const response = await apiClient.get<BackendApiResponse<AdminUser[]>>(
    ADMIN_USER_ENDPOINTS.users,
  );

  return assertSuccess(response.data, "Không thể tải danh sách người dùng.");
}

export async function createAdminUser(payload: AdminUserUpsertPayload) {
  const response = await apiClient.post<BackendApiResponse<AdminUser>>(
    ADMIN_USER_ENDPOINTS.users,
    payload,
  );

  return assertSuccess(response.data, "Không thể tạo người dùng.");
}

export async function updateAdminUser(id: number, payload: AdminUserUpsertPayload) {
  const response = await apiClient.put<BackendApiResponse<AdminUser>>(
    `${ADMIN_USER_ENDPOINTS.users}/${id}`,
    payload,
  );

  return assertSuccess(response.data, "Không thể cập nhật người dùng.");
}

export async function deleteAdminUser(id: number) {
  const response = await apiClient.delete<BackendApiResponse<boolean>>(
    `${ADMIN_USER_ENDPOINTS.users}/${id}`,
  );

  if (response.data.code !== 0) {
    throw new Error(getResponseMessage(response.data, "Không thể xóa người dùng."));
  }

  return true;
}
