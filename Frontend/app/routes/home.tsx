import { Link, redirect } from "react-router";
import { useEffect } from "react";

import { AuthenticatedRedirectFallback } from "~/features/auth/components/authenticated-redirect-fallback";
import { useRedirectAuthenticatedUser } from "~/features/auth/hooks/use-auth-redirect";
import { getAuthenticatedRedirectPath } from "~/features/auth/utils/auth-route-redirect";

import type { Route } from "./+types/home";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDKAvYcH2oPbMM7eWMGf8zBnjAtOCwcHz-48N4v0oz2TXB1-Azt_jS-Ibn4rvp5rxvKV6iSd0i1ZfEgrNBR5L6h2ADDhzeSPuUfQjCXbbsYQ3y_RuX9oLNvkpRdKUcFqdj-H6er7ngo9jqV_TZHAubhKO4Y2yQX0pSPqJds3LW5ta3SW_XHiebyBuN9KnCr36iPillb9sHwaPVh5YlUl9F52BxQGB88Xz-bpMG-dFZ-guV22V3R-7WVZUTzW1YJ-hgItcxlnzeHfyqM";

const features = [
  {
    title: "Flashcards",
    icon: "style",
    delay: undefined,
    description:
      "Hệ thống thẻ nhớ thông minh sử dụng thuật toán lặp lại ngắt quãng (SRS) giúp bạn ghi nhớ các khái niệm triết học khó nhằn chỉ trong vài phút mỗi ngày.",
  },
  {
    title: "Visual Lessons",
    icon: "menu_book",
    delay: "150ms",
    description:
      "Bài giảng trực quan với sơ đồ tư duy và infographics sinh động. Biến các trang lý thuyết khô khan thành hình ảnh dễ hiểu, dễ nắm bắt cấu trúc logic.",
  },
  {
    title: "Realistic Tests",
    icon: "quiz",
    delay: "300ms",
    description:
      "Kho đề thi thử sát với thực tế, cập nhật liên tục từ các trường đại học hàng đầu. Phân tích kết quả chi tiết để bạn biết mình cần cải thiện ở đâu.",
  },
];

const schools = ["NEU", "FTU", "BA", "UET", "VNU"];

const footerGroups = [
  {
    title: "Học tập",
    links: ["Lộ trình học", "Tài liệu miễn phí", "Blog triết học"],
  },
  {
    title: "Hỗ trợ",
    links: ["Trung tâm trợ giúp", "Cộng đồng sinh viên", "Liên hệ"],
  },
  {
    title: "Pháp lý",
    links: ["Điều khoản dịch vụ", "Chính sách bảo mật"],
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MarxistAcademy" },
    {
      name: "description",
      content:
        "Nền tảng học tập Marxism-Leninism trực quan dành cho sinh viên Việt Nam.",
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

export default function Home() {
  const { isRedirecting, redirectPath } = useRedirectAuthenticatedUser();

  if (isRedirecting) {
    return <AuthenticatedRedirectFallback redirectPath={redirectPath ?? "/student"} />;
  }

  return <HomeContent />;
}

function HomeContent() {
  useEffect(() => {
    const blobs = document.querySelectorAll<HTMLElement>(".blob");

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.15,
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background text-on-surface selection:bg-secondary-container">
      <div className="blob -left-32 -top-48 h-[360px] w-[360px] rounded-full bg-secondary-fixed sm:h-[500px] sm:w-[500px]" />
      <div className="blob -right-48 top-1/2 h-[420px] w-[420px] rounded-full bg-tertiary-fixed sm:h-[600px] sm:w-[600px]" />

      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-7xl -translate-x-1/2 sm:w-[calc(100%-32px)] md:top-6 md:w-[calc(100%-128px)]">
        <nav className="glass-nav flex h-16 items-center justify-between gap-3 rounded-full px-4 shadow-[0_4px_20px_rgba(35,39,51,0.04)] sm:px-6 md:px-10">
          <a className="flex min-w-0 items-center gap-3" href="#">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary sm:h-10 sm:w-10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7.25 12 3l9 4.25-9 4.25L3 7.25Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <path
                  d="M6.5 10.25v5.1c0 1.45 2.45 3 5.5 3s5.5-1.55 5.5-3v-5.1"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <span className="truncate font-headline-md text-lg font-bold text-primary sm:text-headline-md">
              Marxist
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              className="font-label-md text-label-md border-b-2 border-secondary font-semibold text-primary transition-all"
              href="#"
            >
              Trang chủ
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
              href="#"
            >
              Chương trình
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
              href="#"
            >
              Tài liệu
            </a>
          </div>

          <Link
            className="font-label-md text-label-md shrink-0 rounded-full bg-primary px-4 py-2 text-on-primary transition-all hover:opacity-90 active:scale-95 sm:px-6 sm:py-2.5"
            to="/login"
          >
            Đăng nhập
          </Link>
        </nav>
      </header>

      <main className="relative z-10 overflow-hidden pb-16 pt-28 sm:pb-xl md:pt-32">
        <section className="mx-auto flex max-w-7xl flex-col items-center px-margin-mobile py-lg text-center md:px-margin-desktop md:py-xl">
          <div
            className="fade-up-stagger mb-8 inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-1.5"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="material-symbols-outlined text-[18px] text-on-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm text-on-secondary-container uppercase tracking-wider">
              Học tập thông minh hơn
            </span>
          </div>

          <h1
            className="fade-up-stagger mb-6 max-w-4xl font-display-lg text-[40px] leading-tight text-primary sm:text-display-lg md:text-[64px]"
            style={{ animationDelay: "0.3s" }}
          >
            Đơn giản hoá Triết lý.
            <br />
            <span className="text-secondary">Tối ưu hoá Điểm số.</span>
          </h1>

          <p
            className="fade-up-stagger mb-10 max-w-2xl font-body-lg text-base text-on-surface-variant sm:mb-12 sm:text-body-lg"
            style={{ animationDelay: "0.5s" }}
          >
            Nền tảng học tập chuyên sâu dành cho sinh viên Việt Nam. Biến những
            khái niệm trừu tượng của Marxism-Leninism thành kiến thức dễ hiểu,
            dễ nhớ và đạt điểm cao trong mọi kỳ thi.
          </p>

          <div
            className="fade-up-stagger flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
            style={{ animationDelay: "0.7s" }}
          >
            <button className="w-full rounded-lg bg-primary px-8 py-4 font-headline-md text-base font-semibold text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-95 sm:w-auto sm:px-10 sm:text-headline-md">
              Bắt đầu học ngay
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-container px-8 py-4 font-headline-md text-base font-semibold text-primary transition-all hover:bg-secondary-fixed active:scale-95 sm:w-auto sm:px-10 sm:text-headline-md">
              <span className="material-symbols-outlined">play_circle</span>
              Xem giới thiệu
            </button>
          </div>

          <div
            className="fade-up-stagger hero-float mt-12 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-outline-variant/10 shadow-2xl sm:mt-xl sm:aspect-[16/9] md:aspect-[21/9]"
            style={{ animationDelay: "1s" }}
          >
            <img
              alt="Sinh viên học tập với công cụ trực quan của MarxistAcademy"
              className="h-full w-full object-cover"
              src={heroImage}
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-margin-mobile py-16 md:px-margin-desktop md:py-xl">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {features.map((feature) => (
              <article
                className="reveal group rounded-xl border border-outline-variant/5 bg-white p-6 shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(35,39,51,0.08)] md:p-10 md:hover:-translate-y-4"
                key={feature.title}
                style={
                  feature.delay ? { transitionDelay: feature.delay } : undefined
                }
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container transition-transform duration-500 group-hover:scale-110 md:mb-8 md:h-16 md:w-16">
                  <span className="material-symbols-outlined text-[32px] text-on-secondary-container">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="mb-4 font-headline-md text-headline-md text-primary">
                  {feature.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-16 md:px-margin-desktop md:py-xl">
          <div className="reveal group relative overflow-hidden rounded-xl border-l-[6px] border-secondary-container bg-primary-container p-6 sm:p-12 md:p-16">
            <div className="relative z-10">
              <span
                className="material-symbols-outlined mb-6 block text-4xl text-secondary-container transition-transform duration-700 group-hover:scale-125"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                format_quote
              </span>
              <h2 className="mb-6 font-headline-lg text-2xl leading-snug text-white sm:text-headline-lg">
                "Các nhà triết học đã chỉ giải thích thế giới bằng nhiều cách
                khác nhau, song vấn đề là cải tạo thế giới."
              </h2>
              <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-widest">
                - Karl Marx, Luận cương về Feuerbach
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5">
              <span className="material-symbols-outlined text-[180px] text-white sm:text-[300px]">
                history_edu
              </span>
            </div>
          </div>
        </section>

        <section className="reveal mx-auto max-w-7xl px-margin-mobile py-lg text-center md:px-margin-desktop">
          <p className="font-label-sm text-label-sm mb-10 uppercase tracking-[0.2em] text-on-surface-variant">
            Hàng ngàn sinh viên từ các trường tin dùng
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0 sm:gap-12">
            {schools.map((school) => (
              <span
                className="font-headline-md text-headline-md font-bold text-primary"
                key={school}
              >
                {school}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-outline-variant/10 bg-surface-container-low px-margin-mobile py-12 sm:py-16 md:px-margin-desktop">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:gap-20">
          <div className="min-w-0 max-w-[360px]">
            <Link
              aria-label="Về trang chủ MarxistAcademy"
              className="mb-4 inline-flex max-w-full min-w-0 items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-secondary"
              to="/"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7.25 12 3l9 4.25-9 4.25L3 7.25Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M6.5 10.25v5.1c0 1.45 2.45 3 5.5 3s5.5-1.55 5.5-3v-5.1"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              <span className="min-w-0 truncate font-headline-md text-xl font-bold leading-tight text-primary sm:text-headline-md">
                Marxist
              </span>
            </Link>
            <p className="max-w-[34ch] font-body-md text-body-md text-on-surface-variant">
              Nâng tầm kiến thức lý luận, đồng hành cùng thế hệ sinh viên Việt
              Nam vươn xa.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-10">
            {footerGroups.map((group) => (
              <nav className="min-w-0" key={group.title}>
                <h4 className="font-label-md text-label-md font-bold text-primary">
                  {group.title}
                </h4>
                <div className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <a
                      className="font-label-md text-label-md w-fit max-w-full break-words text-on-surface-variant transition-colors hover:text-primary"
                      href="#"
                      key={link}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-6 border-t border-outline-variant/10 pt-8 text-on-surface-variant sm:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="font-label-sm text-label-sm break-words">
            © 2024 MarxistAcademy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {["Bảng tin", "Cộng đồng", "Email"].map((label) => (
              <a
                className="rounded-lg border border-outline-variant/30 px-3 py-2 font-label-sm text-label-sm transition-colors hover:border-secondary/40 hover:text-primary"
                href="#"
                key={label}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
