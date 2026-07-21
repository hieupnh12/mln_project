import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";

import { BrandLogo } from "~/shared/components/brand-logo";
import { WorkspaceSwitcher } from "~/shared/components/workspace-switcher";
import { useLogout } from "../../auth/hooks/use-logout";
import {
  ADMIN_ROUTES,
  adminNavItems,
  adminProfile,
} from "../constants/admin-dashboard.constants";
import { MaterialIcon } from "./admin-icons";

export function AdminTopbar() {
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-background/95 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-3.5">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link className="min-w-0 shrink-0" to={ADMIN_ROUTES.dashboard}>
            <BrandLogo />
            <p className="text-label-sm font-semibold text-on-surface-variant/70">
              Admin Portal
            </p>
          </Link>

          <nav
            aria-label="Điều hướng quản trị"
            className="flex min-w-0 items-center gap-1 overflow-x-auto scroll-hide"
          >
            {adminNavItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "shrink-0 rounded-lg bg-secondary-container px-3 py-2 text-label-md font-semibold text-on-secondary-container"
                    : "shrink-0 rounded-lg px-3 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
                }
                end={item.end}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <WorkspaceSwitcher className="hidden sm:inline-flex" />
          <WorkspaceSwitcher className="sm:hidden" variant="compact" />

          <div className="relative" ref={menuRef}>
            <button
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label="Mở menu tài khoản quản trị"
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-surface-container-low"
              onClick={() => setIsMenuOpen((open) => !open)}
              type="button"
            >
              <img
                alt="Ảnh đại diện quản trị viên"
                className="h-9 w-9 rounded-full object-cover shadow-sm"
                src={adminProfile.avatarUrl}
              />
              <span className="hidden text-left md:block">
                <span className="block text-label-md font-semibold text-primary">
                  {adminProfile.name}
                </span>
                <span className="block text-label-sm text-on-surface-variant">
                  {adminProfile.plan}
                </span>
              </span>
              <MaterialIcon className="text-on-surface-variant">arrow_drop_down</MaterialIcon>
            </button>

            {isMenuOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg"
                role="menu"
              >
                <div className="border-b border-outline-variant/20 px-4 py-3 md:hidden">
                  <p className="truncate text-label-md font-semibold text-primary">
                    {adminProfile.name}
                  </p>
                  <p className="mt-0.5 truncate text-label-sm text-on-surface-variant">
                    {adminProfile.plan}
                  </p>
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
        </div>
      </div>
    </header>
  );
}
