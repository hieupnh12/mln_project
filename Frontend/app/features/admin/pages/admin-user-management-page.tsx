import { useEffect, useMemo, useState } from "react";

import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { AdminUserFormModal } from "../components/admin-user-form-modal";
import { AdminUsersTable } from "../components/admin-users-table";
import { AdminUsersToolbar } from "../components/admin-users-toolbar";
import {
  useAdminUsersQuery,
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useUpdateAdminUserMutation,
} from "../hooks/use-admin-users";
import type {
  AdminUser,
  AdminUserFormValue,
  AdminUserRole,
} from "../types/admin-user.types";

const DEFAULT_FORM_VALUE: AdminUserFormValue = {
  email: "",
  fullName: "",
  role: "student",
  isActive: true,
};

export function AdminUserManagementPage() {
  const usersQuery = useAdminUsersQuery();
  const createUserMutation = useCreateAdminUserMutation();
  const updateUserMutation = useUpdateAdminUserMutation();
  const deleteUserMutation = useDeleteAdminUserMutation();

  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [keyword, roleFilter]);

  const filteredUsers = useMemo(() => {
    const users = usersQuery.data ?? [];
    const normalizedKeyword = keyword.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      if (!matchesRole) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      const searchableContent = [user.fullName, user.email, user.username]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedKeyword);
    });
  }, [keyword, roleFilter, usersQuery.data]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const openCreateModal = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleSubmitForm = async (value: AdminUserFormValue) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, payload: value });
        showSuccessToast("Cập nhật người dùng thành công");
      } else {
        await createUserMutation.mutateAsync(value);
        showSuccessToast("Tạo người dùng thành công");
      }

      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể lưu người dùng.";
      showErrorToast(errorMessage);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa tài khoản ${user.fullName}?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(user.id);
      showSuccessToast("Xóa người dùng thành công");
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Không thể xóa người dùng.");
    }
  };

  const formInitialValue: AdminUserFormValue = editingUser
    ? {
        email: editingUser.email,
        fullName: editingUser.fullName,
        role: editingUser.role,
        isActive: editingUser.isActive,
      }
    : DEFAULT_FORM_VALUE;

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <AdminUsersToolbar
              keyword={keyword}
              roleFilter={roleFilter}
              onKeywordChange={setKeyword}
              onRoleFilterChange={setRoleFilter}
              onCreateClick={openCreateModal}
            />

            {usersQuery.isLoading ? (
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
                Đang tải danh sách người dùng...
              </div>
            ) : null}

            {usersQuery.isError ? (
              <div className="rounded-xl border border-error/25 bg-error-container p-6 text-sm text-on-error-container">
                {usersQuery.error instanceof Error
                  ? usersQuery.error.message
                  : "Không thể tải danh sách người dùng."}
              </div>
            ) : null}

            {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 ? (
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
                Chưa có người dùng phù hợp với bộ lọc hiện tại.
              </div>
            ) : null}

            {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length > 0 ? (
              <AdminUsersTable
                users={paginatedUsers}
                deletingUserId={deleteUserMutation.variables ?? null}
                onEdit={openEditModal}
                onDelete={handleDeleteUser}
                totalItems={totalItems}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : null}
          </div>

      {isFormOpen ? (
        <AdminUserFormModal
          open={isFormOpen}
          mode={editingUser ? "edit" : "create"}
          initialValue={formInitialValue}
          isSubmitting={isSubmitting}
          submitError={null}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
        />
      ) : null}
    </>
  );
}
