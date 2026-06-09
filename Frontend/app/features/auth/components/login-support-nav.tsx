import { Link } from "react-router";

import { LOGIN_SUPPORT_LINKS } from "../constants/login-content.constants";

export function LoginSupportNav() {
  return (
    <nav
      aria-label="Liên kết hỗ trợ đăng nhập"
      className="mx-auto mt-6 flex w-full max-w-[440px] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center text-label-md text-landing-text-soft sm:mt-8 sm:gap-x-8"
    >
      {LOGIN_SUPPORT_LINKS.map((link) => (
        <Link
          className="rounded-full px-2 py-1 transition-colors hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red/40"
          key={link.label}
          to={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
