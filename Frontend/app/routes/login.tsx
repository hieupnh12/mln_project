import { Link, redirect } from "react-router";
import { useState } from "react";

import { AuthenticatedRedirectFallback } from "~/features/auth/components/authenticated-redirect-fallback";
import { useRedirectAuthenticatedUser } from "~/features/auth/hooks/use-auth-redirect";
import { getAuthenticatedRedirectPath } from "~/features/auth/utils/auth-route-redirect";
import { showErrorToast } from "~/shared/utils/toast";

import { getGoogleLoginUrl } from "../features/auth/services/auth.service";
import type { Route } from "./+types/login";

const supportLinks = ["Trợ giúp", "Điều khoản dịch vụ", "Bảo mật"];

export function meta() {
  return [
    { title: "Đăng nhập | M-L Master" },
    {
      name: "description",
      content: "Đăng nhập M-L Master để tiếp tục hành trình học tập.",
    },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const redirectPath = getAuthenticatedRedirectPath(request);

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return null;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { isRedirecting, redirectPath } = useRedirectAuthenticatedUser();

  if (isRedirecting) {
    return <AuthenticatedRedirectFallback redirectPath={redirectPath ?? "/student"} />;
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await getGoogleLoginUrl();
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch {
      showErrorToast("Không thể bắt đầu đăng nhập Google. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface selection:bg-secondary-container">
      <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)]">
        <section className="login-hero relative flex min-w-0 flex-col overflow-hidden px-margin-mobile py-8 sm:px-10 sm:py-10 lg:min-h-svh lg:px-margin-desktop lg:py-14">
          <div className="login-hero-sheen pointer-events-none absolute inset-0" />
          <div className="login-hero-glow-left pointer-events-none absolute -left-20 top-14 h-72 w-72 rounded-full blur-3xl" />
          <div className="login-hero-glow-right pointer-events-none absolute -right-20 bottom-6 h-80 w-80 rounded-full blur-3xl" />
          <div className="login-hero-orb pointer-events-none absolute right-[18%] top-[18%] h-36 w-36 rounded-full" />
          <div className="login-hero-line pointer-events-none absolute left-[12%] top-[20%] h-[1px] w-[32%]" />
          <div className="login-hero-line-alt pointer-events-none absolute bottom-[22%] right-[10%] h-[1px] w-[28%]" />
          <div className="login-hero-vignette pointer-events-none absolute inset-0" />
          <div className="login-hero-accent-line pointer-events-none absolute inset-x-0 top-0 h-px" />

          <Link
            className="login-hero-brand relative z-10 w-fit font-serif text-[28px] font-bold leading-none outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/70 sm:text-[34px]"
            to="/"
          >
            M-L Master
          </Link>

          <div className="relative z-10 mx-auto mt-10 w-full max-w-2xl lg:mx-0 lg:mt-16">
            <p className="login-hero-kicker text-label-sm uppercase tracking-[0.28em] sm:text-label-md">
              Hệ thống học tập lý luận chính trị
            </p>
            <h1 className="login-hero-title mt-4 max-w-[13ch] font-serif text-[40px] font-bold leading-[0.98] sm:text-[54px] lg:text-[72px]">
              Triết học
              <br />
              <span className="login-hero-emphasis italic">Mác - Lênin</span>
            </h1>
            <p className="login-hero-copy mt-5 max-w-[48ch] text-base leading-8 sm:text-body-lg lg:text-[20px]">
              Không gian đăng nhập được thiết kế theo tinh thần trang trọng, rõ
              nhịp và có chiều sâu, để nội dung học tập trở nên tập trung hơn.
            </p>

            <div className="login-hero-tags mt-8 flex flex-wrap gap-3 text-label-md font-medium">
              <span className="login-hero-tag rounded-full border px-4 py-2 backdrop-blur-sm">
                Trang trọng
              </span>
              <span className="login-hero-tag rounded-full border px-4 py-2 backdrop-blur-sm">
                Tư duy hệ thống
              </span>
              <span className="login-hero-tag rounded-full border px-4 py-2 backdrop-blur-sm">
                Kỷ luật
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex w-full flex-1 items-end lg:mt-auto lg:pt-10">
            <div className="login-hero-panel w-full max-w-[720px] rounded-[28px] border p-5 shadow-[0_24px_60px_rgba(35,39,51,0.18)] backdrop-blur-md sm:p-6 lg:w-[min(640px,92%)]">
              <div className="flex items-center gap-4">
                <div className="login-hero-mark flex h-14 w-14 items-center justify-center rounded-2xl text-[26px] shadow-inner shadow-black/10">
                  ✦
                </div>
                <div>
                  <p className="login-hero-card-kicker text-label-sm uppercase tracking-[0.22em]">
                    Tinh thần học tập
                  </p>
                  <p className="login-hero-card-title mt-1 text-lg font-semibold sm:text-xl">
                    Nghiêm túc, tối giản, có trọng tâm
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  "Bố cục rõ ràng",
                  "Màu đỏ chủ đạo",
                  "Nhấn mạnh chiều sâu học thuật",
                ].map((item) => (
                  <div
                    className="login-hero-card rounded-2xl border px-4 py-4 text-sm leading-6 backdrop-blur-sm"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="login-hero-note mt-6 max-w-[52ch] text-sm italic leading-7 sm:text-base">
                “Học, học nữa, học mãi.”
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col bg-surface-container-low px-margin-mobile py-8 sm:px-10 sm:py-10 lg:min-h-svh lg:px-10 lg:py-14">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[440px] rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-8 shadow-[0_16px_40px_rgba(35,39,51,0.07)] sm:rounded-[24px] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <header className="mx-auto max-w-[320px] text-center">
                <h2 className="font-serif text-[28px] font-bold leading-tight text-primary sm:text-[36px]">
                  Chào mừng trở lại
                </h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant sm:text-base sm:leading-7">
                  Đăng nhập để bắt đầu bài học hôm nay.
                </p>
              </header>



              <button
                className="mt-8 grid min-h-12 w-full grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-primary shadow-[0_4px_14px_rgba(35,39,51,0.06)] transition hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-[0_12px_26px_rgba(35,39,51,0.08)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-10 sm:min-h-14 sm:grid-cols-[28px_minmax(0,1fr)_28px] sm:text-base"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 justify-self-start sm:h-7 sm:w-7"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.532 24.5528C47.532 22.8886 47.396 21.2819 47.1321 19.7451H24.48V28.829H37.4081C36.8561 31.8596 35.1521 34.4262 32.5841 36.1425V42.1305H40.3921C44.9601 37.9279 47.532 31.8197 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.48 48C30.9521 48 36.4119 45.8693 40.3921 42.1305L32.5841 36.1425C30.416 37.593 27.6881 38.4521 24.48 38.4521C18.2241 38.4521 12.9281 34.223 11.0361 28.5159H3.01196V34.7334C6.98396 42.6157 15.1119 48 24.48 48Z"
                    fill="#34A853"
                  />
                  <path
                    d="M11.0361 28.5159C10.5441 27.0518 10.2681 25.4883 10.2681 23.8681C10.2681 22.248 10.5441 20.6845 11.0361 19.2204V13.0029H3.01196C1.08811 16.8524 0 21.2339 0 23.8681C0 26.5023 1.08811 30.8838 3.01196 34.7334L11.0361 28.5159Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M24.48 9.28032C28.0081 9.28032 31.1641 10.4912 33.6561 12.8596L40.56 5.95568C36.3919 2.26958 30.9321 0 24.48 0C15.1119 0 6.98396 5.38433 3.01196 13.0029L11.0361 19.2204C12.9281 13.5132 18.2241 9.28032 24.48 9.28032Z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="min-w-0 truncate text-center">
                  {isLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
                </span>
                <span aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav className="mx-auto mt-6 flex w-full max-w-[440px] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center text-label-md text-on-surface-variant sm:mt-8 sm:gap-x-8">
            {supportLinks.map((link) => (
              <a
                className="rounded-md px-1 py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                href="#"
                key={link}
              >
                {link}
              </a>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
