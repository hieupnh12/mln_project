import { Link } from "react-router";

import { BrandLogo } from "~/shared/components/brand-logo";
import { LoginCard } from "../components/login-card";
import { LoginHeroSection } from "../components/login-hero-section";
import { LoginSupportNav } from "../components/login-support-nav";
import { LOGIN_META } from "../constants/login-content.constants";
import { useLoginPageActions } from "../hooks/use-login-page-actions";

export function meta() {
  return [
    { title: LOGIN_META.title },
    {
      name: "description",
      content: LOGIN_META.description,
    },
  ];
}

export function LoginPage() {
  const { isGoogleLoginLoading, loginWithGoogle } = useLoginPageActions();

  return (
    <main className="min-h-svh overflow-x-hidden bg-landing-white font-body-md text-landing-text selection:bg-landing-red/15">
      <div className="grid min-h-svh lg:grid-cols-[minmax(0,0.92fr)_minmax(390px,0.68fr)] xl:grid-cols-[minmax(0,0.98fr)_minmax(430px,0.62fr)]">
        <LoginHeroSection />

        <section className="landing-gradient-mesh relative flex min-w-0 flex-col px-margin-mobile py-6 sm:px-10 sm:py-8 lg:min-h-svh lg:bg-landing-cream lg:px-8 lg:py-8 xl:px-10">
          <div className="pointer-events-none absolute inset-0 lg:hidden">
            <div className="landing-soft-noise h-full opacity-30" />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-3 lg:justify-end">
            <Link
              className="inline-flex min-w-0 items-center gap-3 rounded-full bg-landing-white/75 px-3 py-2 text-label-md font-semibold text-landing-text shadow-sm backdrop-blur-xl transition hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red/40 lg:hidden"
              to="/"
            >
              <BrandLogo size="compact" />
            </Link>

            <Link
              className="shrink-0 rounded-full border border-outline-variant/40 bg-landing-white/70 px-4 py-2 text-label-md font-medium text-landing-text-muted backdrop-blur-xl transition hover:border-landing-red/30 hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red/40"
              to="/"
            >
              Về trang giới thiệu
            </Link>
          </div>

          <div className="relative z-10 flex flex-1 items-center justify-center py-10 sm:py-14 lg:py-6">
            <LoginCard isLoading={isGoogleLoginLoading} onGoogleLogin={loginWithGoogle} />
          </div>

          <LoginSupportNav />
        </section>
      </div>
    </main>
  );
}
