import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ADMIN_USERS_QUERY_KEY } from "../constants/admin-user.constants";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getAdminUsers,
  updateUserByAdmin,
} from "../services/admin-user.service";
import type { AdminUserUpsertPayload } from "../types/admin-user.types";

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: getAdminUsers,
  });
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminUserUpsertPayload) => createUserByAdmin(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AdminUserUpsertPayload;
    }) => updateUserByAdmin(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUserByAdmin(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}
