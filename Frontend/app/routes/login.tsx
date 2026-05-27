import { Link, useNavigate } from "react-router";
import { useState } from "react";

import type { Route } from "./+types/login";
import { signInWithGoogleAsRole } from "../features/auth/services/auth.service";
import type { UserRole } from "../features/auth/types/auth.types";

const illustrationImage =
  "https://lh3.googleusercontent.com/aida/ADBb0ugB0FACo-DQhvO9TlsJrBsMf2pPsHgaWKXPSFTnTcAu0vYx5W9D8Ls4d_hDmreTjrLaOq40w8aCyXmx0Jfd4eQw6Xtt2DL6-o58WrxPEUpngW_xVMJJmqK2_C--tblBkscXrI6HJBvbnanKYI_VrnjUdluRW-UBiGMIyP8wyM1BsfvNrSADEK3130Ra32PybJoKaX3YpZguitPNd1Ir0Bsnhj--KLYaHPEIyzDpLUMINL_RZeUeJ6xSDrI";

const supportLinks = ["Trợ giúp", "Điều khoản dịch vụ", "Bảo mật"];
const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Học sinh", value: "student" },
  { label: "Giáo viên", value: "teacher" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đăng nhập | M-L Master" },
    {
      name: "description",
      content: "Đăng nhập M-L Master để tiếp tục hành trình học tập.",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const handleGoogleLogin = () => {
    const result = signInWithGoogleAsRole(selectedRole);
    navigate(result.redirectTo);
  };

  return (
    <main className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface selection:bg-secondary-container">
      <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)]">
        <section className="fluid-bg relative flex min-w-0 flex-col px-margin-mobile py-8 sm:px-10 sm:py-10 lg:min-h-svh lg:px-margin-desktop lg:py-14">
          <Link
            className="relative z-10 w-fit font-serif text-[28px] font-bold leading-none text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-secondary sm:text-[34px]"
            to="/"
          >
            M-L Master
          </Link>

          <div className="relative z-10 mx-auto mt-10 w-full max-w-3xl lg:mx-0 lg:mt-20">
            <h1 className="font-serif text-[38px] font-bold leading-[1.02] text-primary sm:text-[52px] lg:text-[64px]">
              Đơn giản hoá Triết lý.
              <br />
              <span className="italic text-secondary">
                Tối ưu hoá Điểm số.
              </span>
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-8 text-on-surface-variant sm:text-body-lg lg:text-[20px]">
              Tiếp tục hành trình chinh phục trí tuệ của bạn với các phương
              pháp học tập hiện đại nhất.
            </p>
          </div>

          <figure className="relative z-10 mx-auto mt-10 w-full max-w-[720px] lg:mx-0 lg:mt-auto lg:pt-10">
            <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_18px_42px_rgba(35,39,51,0.08)]">
              <img
                alt="Minh họa Marx và Lenin"
                className="aspect-[4/3] w-full object-cover object-top mix-blend-multiply sm:aspect-[16/10] lg:aspect-[1.25/1]"
                src={illustrationImage}
              />
            </div>
            <figcaption className="mt-4 border-l-4 border-secondary bg-primary-container px-5 py-4 shadow-[0_14px_34px_rgba(35,39,51,0.16)] sm:px-6 sm:py-5 lg:-mt-20 lg:ml-0 lg:w-[min(520px,88%)]">
              <p className="text-sm italic leading-7 text-on-primary sm:text-base">
                "Cái quý nhất của con người ta là sự sống. Đời người chỉ sống
                có một lần. Phải sống sao cho khỏi xót xa, ân hận..."
              </p>
              <span className="mt-3 block text-label-sm font-semibold uppercase tracking-[0.18em] text-secondary-fixed sm:text-label-md">
                - Thép đã tôi thế đấy
              </span>
            </figcaption>
          </figure>
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

              <div className="mt-7 grid grid-cols-2 rounded-xl bg-surface-container-low p-1">
                {roleOptions.map((role) => (
                  <button
                    className={
                      selectedRole === role.value
                        ? "rounded-lg bg-surface-container-lowest px-3 py-2 text-label-md font-semibold text-primary shadow-sm"
                        : "rounded-lg px-3 py-2 text-label-md font-medium text-on-surface-variant transition hover:text-primary"
                    }
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    type="button"
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              <button
                className="mt-8 grid min-h-12 w-full grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-primary shadow-[0_4px_14px_rgba(35,39,51,0.06)] transition hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-[0_12px_26px_rgba(35,39,51,0.08)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-10 sm:min-h-14 sm:grid-cols-[28px_minmax(0,1fr)_28px] sm:text-base"
                onClick={handleGoogleLogin}
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
                  Tiếp tục với Google
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
