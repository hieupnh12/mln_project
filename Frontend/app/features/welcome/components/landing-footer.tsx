import { ArrowUpRight, Landmark } from "lucide-react";
import { Link } from "react-router";

import { FOOTER_GROUPS } from "../constants/landing-content";

function FooterLinkItem({ href, label }: { href: string; label: string }) {
  const isInternalRoute = href.startsWith("/");
  const isSectionLink = href.startsWith("#");

  if (isInternalRoute) {
    return (
      <Link
        className="w-fit max-w-full text-landing-text-soft transition-colors hover:text-landing-red"
        to={href}
      >
        {label}
      </Link>
    );
  }

  return (
    <a
      className="inline-flex w-fit max-w-full items-center gap-1 text-landing-text-soft transition-colors hover:text-landing-red"
      href={href}
      rel={isSectionLink ? undefined : "noreferrer"}
      target={isSectionLink ? undefined : "_blank"}
    >
      {label}
      {!isSectionLink && <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
    </a>
  );
}

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-outline-variant/40 bg-landing-white px-margin-mobile py-12 text-landing-text md:px-margin-desktop md:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(260px,420px)_1fr]">
        <div className="w-full min-w-[min(100%,22rem)] max-w-md">
          <Link className="inline-flex max-w-full min-w-0 items-center gap-3" to="/">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-landing-red to-landing-red-dark text-on-primary shadow-md">
              <Landmark aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 truncate whitespace-nowrap font-serif text-xl font-bold text-landing-text sm:text-2xl">
              Mác - Lê Nin
            </span>
          </Link>
          <p className="mt-5 w-full whitespace-normal text-body-md text-landing-text-soft [overflow-wrap:normal] [word-break:normal]">
            Dự án giới thiệu và hỗ trợ học tập học phần Mác - Lê Nin với tinh thần
            học thuật, lịch sử và công nghệ giáo dục hiện đại.
          </p>
          <p className="mt-4 w-full whitespace-normal text-label-md text-landing-text-soft [overflow-wrap:normal] [word-break:normal]">
            Đại học / Khoa Lý luận chính trị
          </p>
        </div>

        <div className="grid w-full min-w-0 gap-8 sm:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <nav aria-label={group.title} className="flex min-w-0 flex-col gap-3" key={group.title}>
              <h2 className="font-label-md text-label-md font-semibold text-landing-text">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <FooterLinkItem href={link.href} key={link.href} label={link.label} />
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-3 border-t border-outline-variant/40 pt-6 text-label-sm text-landing-text-soft sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Mác - Lê Nin. All rights reserved.</p>
        <p>Built for historical learning, accessible knowledge and focused study.</p>
      </div>
    </footer>
  );
}
