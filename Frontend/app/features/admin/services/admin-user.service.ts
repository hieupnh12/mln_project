import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from "../api/admin-user.api";
import type { AdminUserUpsertPayload } from "../types/admin-user.types";

export function getAdminUsers() {
  return fetchAdminUsers();
}

export function createUserByAdmin(payload: AdminUserUpsertPayload) {
  return createAdminUser(payload);
}

export function updateUserByAdmin(id: number, payload: AdminUserUpsertPayload) {
  return updateAdminUser(id, payload);
}

export function deleteUserByAdmin(id: number) {
  return deleteAdminUser(id);
}
