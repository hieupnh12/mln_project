import { Compass, Landmark, LogIn } from "lucide-react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";

import { LANDING_NAV_ITEMS } from "../constants/landing-content";

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-margin-mobile pt-4 md:px-margin-desktop">
      <nav
        aria-label="Điều hướng landing page"
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-300 sm:px-6 ${
          isScrolled
            ? "border border-outline-variant/50 bg-landing-white/90 text-landing-text shadow-lg backdrop-blur-xl"
            : "border border-landing-white/70 bg-landing-white/50 text-landing-text backdrop-blur-xl"
        }`}
      >
        <Link
          aria-label="Mác - Lê Nin"
          className="flex min-w-0 items-center gap-3 rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-landing-red"
          to="/"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-landing-red to-landing-red-dark text-on-primary shadow-md">
            <Landmark aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="truncate font-serif text-lg font-bold sm:text-xl">
            Mác - Lê Nin
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {LANDING_NAV_ITEMS.map((item) => (
            <a
              className="font-label-md text-label-md text-landing-text-soft transition-colors hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            className="hidden items-center gap-2 rounded-full border border-outline-variant/50 bg-landing-white/60 px-4 py-2 font-label-md text-label-md text-landing-text-muted transition-colors hover:border-landing-red/30 hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red sm:flex"
            href="#introduction"
          >
            <Compass aria-hidden="true" className="h-4 w-4" />
            Khám phá
          </a>
          <Link
            className="landing-glow-button flex items-center gap-2 rounded-full bg-gradient-to-r from-landing-red to-landing-red-deep px-4 py-2 font-label-md text-label-md font-semibold text-on-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red sm:px-5"
            to="/login"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Đăng nhập
          </Link>
        </div>
      </nav>
    </header>
  );
}
