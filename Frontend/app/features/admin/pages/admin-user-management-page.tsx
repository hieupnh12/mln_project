import { useMemo, useState } from "react";

import { clearAuthSession } from "~/shared/services/auth-session.service";

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogout = () => {
    clearAuthSession();
    window.location.href = "/login";
  };

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

  const openCreateModal = () => {
    setEditingUser(null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setSubmitError(null);
  };

  const handleSubmitForm = async (value: AdminUserFormValue) => {
    try {
      setSubmitError(null);

      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, payload: value });
      } else {
        await createUserMutation.mutateAsync(value);
      }

      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể lưu người dùng.";
      setSubmitError(errorMessage);
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
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể xóa người dùng.");
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
    <main className="min-h-svh bg-background font-body-md text-on-surface">
      <div className="flex flex-col">
        <header className="border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-5 shadow-sm sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">M-L Master</h1>
              <p className="text-sm text-on-surface-variant">
                Admin Dashboard - Quản lý người dùng
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-on-error transition hover:opacity-90"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-primary">CRUD người dùng</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Quản trị viên có thể tạo, xem, chỉnh sửa và xóa tài khoản trong hệ
                thống.
              </p>
            </section>

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
                users={filteredUsers}
                deletingUserId={deleteUserMutation.variables ?? null}
                onEdit={openEditModal}
                onDelete={handleDeleteUser}
              />
            ) : null}
          </div>
        </div>
      </div>

      {isFormOpen ? (
        <AdminUserFormModal
          open={isFormOpen}
          mode={editingUser ? "edit" : "create"}
          initialValue={formInitialValue}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
        />
      ) : null}
    </main>
  );
}
