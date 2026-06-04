import { useEffect, useRef, useState } from "react";

import { useLogout } from "~/features/auth/hooks/use-logout";
import type { AuthSessionUser } from "~/shared/types/auth-session.types";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type StudentAccountMenuProps = {
  user: Required<Pick<AuthSessionUser, "name">> &
    Pick<AuthSessionUser, "email" | "avatarUrl">;
};

function getInitial(name: string | undefined) {
  return name?.trim().charAt(0).toUpperCase() || "H";
}

export function StudentAccountMenu({ user }: StudentAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Mở menu tài khoản"
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-surface-variant/50 active:scale-95 sm:pr-3"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {user.avatarUrl ? (
          <img
            alt="Ảnh đại diện học sinh"
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
            src={user.avatarUrl}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-label-md font-bold text-primary">
            {getInitial(user.name)}
          </span>
        )}
        <MaterialIcon className="hidden text-on-surface-variant sm:inline-flex">
          account_circle
        </MaterialIcon>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_18px_40px_rgba(35,39,51,0.12)]"
          role="menu"
        >
          <div className="border-b border-outline-variant/20 px-4 py-3">
            <p className="truncate text-label-md font-semibold text-primary">
              {user.name}
            </p>
            {user.email ? (
              <p className="mt-1 truncate text-label-sm text-on-surface-variant">
                {user.email}
              </p>
            ) : null}
          </div>
          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-label-md font-medium text-error transition hover:bg-error-container/50"
            onClick={logout}
            role="menuitem"
            type="button"
          >
            <MaterialIcon>logout</MaterialIcon>
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}
