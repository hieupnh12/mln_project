import { useEffect, useRef, useState } from "react";

import { useLogout } from "~/features/auth/hooks/use-logout";
import type { AuthUserViewModel } from "~/features/auth/hooks/use-auth-user";

import { MaterialIcon } from "./teacher-icons";

type TeacherAccountMenuProps = {
  collapsed?: boolean;
  user: AuthUserViewModel;
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "G";
}

export function TeacherAccountMenu({ collapsed = false, user }: TeacherAccountMenuProps) {
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

  const avatar = user.avatarUrl ? (
    <img
      alt="Ảnh đại diện giảng viên"
      className="h-10 w-10 rounded-full object-cover shadow-sm"
      referrerPolicy="no-referrer"
      src={user.avatarUrl}
    />
  ) : (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-landing-red/10 text-label-md font-bold text-landing-red shadow-sm">
      {getInitial(user.name)}
    </span>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Mở menu tài khoản"
        className={
          collapsed
            ? "mx-auto flex items-center justify-center rounded-xl p-1 transition hover:bg-landing-gray active:scale-[0.99]"
            : "flex w-full items-center gap-sm rounded-xl px-sm py-xs text-left transition hover:bg-landing-gray active:scale-[0.99]"
        }
        onClick={() => setIsOpen((current) => !current)}
        title={user.name}
        type="button"
      >
        {avatar}
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label-md font-bold text-landing-text">
                {user.name}
              </span>
              <span className="block truncate text-label-sm font-semibold text-landing-text-soft">
                Giảng viên
              </span>
            </span>
            <MaterialIcon className="text-landing-text-soft">more_vert</MaterialIcon>
          </>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className={
            collapsed
              ? "absolute bottom-0 left-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-xl shadow-landing-text/10"
              : "absolute bottom-14 left-0 z-50 w-full overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-xl shadow-landing-text/10"
          }
          role="menu"
        >
          <div className="border-b border-outline-variant/20 px-4 py-3">
            <p className="truncate text-label-md font-semibold text-landing-text">{user.name}</p>
            {user.email ? (
              <p className="mt-1 truncate text-label-sm text-landing-text-soft">
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
