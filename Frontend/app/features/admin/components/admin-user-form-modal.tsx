import { useEffect, useState } from "react";

import { ADMIN_USER_ROLE_OPTIONS } from "../constants/admin-user.constants";
import type { AdminUserFormValue } from "../types/admin-user.types";

type AdminUserFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValue: AdminUserFormValue;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (value: AdminUserFormValue) => void;
};

type FormErrors = Partial<Record<keyof AdminUserFormValue, string>>;

export function AdminUserFormModal({
  open,
  mode,
  initialValue,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: AdminUserFormModalProps) {
  const [formValue, setFormValue] = useState<AdminUserFormValue>(initialValue);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFormValue(initialValue);
    setFormErrors({});
  }, [
    open,
    initialValue.email,
    initialValue.fullName,
    initialValue.role,
    initialValue.isActive,
  ]);

  if (!open) {
    return null;
  }

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!formValue.fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ tên.";
    }

    if (!formValue.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email.trim())) {
      nextErrors.email = "Email không đúng định dạng.";
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formValue,
      fullName: formValue.fullName.trim(),
      email: formValue.email.trim(),
    });
  };

  const modalTitle = mode === "create" ? "Tạo người dùng" : "Cập nhật người dùng";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/35 p-4">
      <div
        className="rounded-xl border border-outline-variant/35 bg-surface-container-lowest p-6 shadow-xl"
        style={{ width: "min(92vw, 42rem)" }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">{modalTitle}</h3>
            <p className="text-sm text-on-surface-variant">
              Điền thông tin bên dưới để lưu người dùng.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-sm text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đóng
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
              Họ và tên
              <input
                value={formValue.fullName}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    fullName: event.target.value,
                  }))
                }
                className="rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-on-surface outline-none transition focus:border-primary"
              />
              {formErrors.fullName ? (
                <span className="text-xs text-error">{formErrors.fullName}</span>
              ) : null}
            </label>

          </div>

          <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
            Email
            <input
              type="email"
              value={formValue.email}
              onChange={(event) =>
                setFormValue((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              className="rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-on-surface outline-none transition focus:border-primary"
            />
            {formErrors.email ? (
              <span className="text-xs text-error">{formErrors.email}</span>
            ) : null}
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
              Vai trò
              <select
                value={formValue.role}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    role: event.target.value as AdminUserFormValue["role"],
                  }))
                }
                className="rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-on-surface outline-none transition focus:border-primary"
              >
                {ADMIN_USER_ROLE_OPTIONS.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={formValue.isActive}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    isActive: event.target.checked,
                  }))
                }
              />
              Kích hoạt tài khoản
            </label>
          </div>

          {submitError ? (
            <div className="rounded-lg border border-error/20 bg-error-container px-3 py-2 text-sm text-on-error-container">
              {submitError}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-outline-variant/40 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
