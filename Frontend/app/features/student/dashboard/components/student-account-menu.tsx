import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLogout } from "~/features/auth/hooks/use-logout";
import type { AuthSessionUser } from "~/shared/types/auth-session.types";

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
        className="flex min-h-10 items-center gap-2 rounded-xl border border-outline-variant/35 bg-landing-white p-1.5 transition hover:border-landing-red/25 hover:bg-landing-red/5 active:scale-95 sm:pr-3"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {user.avatarUrl ? (
          <img
            alt="Ảnh đại diện học viên"
            className="h-8 w-8 rounded-lg object-cover"
            decoding="async"
            referrerPolicy="no-referrer"
            src={user.avatarUrl}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-landing-red/10 text-label-md font-bold text-landing-red">
            {getInitial(user.name)}
          </span>
        )}
        <span className="hidden max-w-32 truncate text-label-md font-semibold text-landing-text sm:block">
          {user.name}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`hidden h-4 w-4 text-landing-text-soft transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white shadow-2xl shadow-landing-text/10"
          role="menu"
        >
          <div className="flex items-start gap-3 border-b border-outline-variant/25 px-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red">
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-label-md font-semibold text-landing-text">
                {user.name}
              </p>
              {user.email ? (
                <p className="mt-1 truncate text-label-sm text-landing-text-soft">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>
          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-label-md font-medium text-error transition hover:bg-error-container/50"
            onClick={logout}
            role="menuitem"
            type="button"
          >
            <LogOut aria-hidden="true" className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}
