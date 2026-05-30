import { Link } from "react-router";

import { useSubjects } from "~/features/subject/hooks/use-subjects";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { getStudentCoursePath, STUDENT_ROUTES } from "../../constants/student-routes.constants";
import { StudentCurriculumSection } from "../components/student-curriculum-section";
import {
  studentDashboardBottomNavItems,
  studentDashboardNavItems,
  studentDashboardProfile,
} from "../constants/student-dashboard.constants";

export function StudentDashboardPage() {
  const { data: subjects } = useSubjects();
  const featuredCoursePath = subjects?.[0]
    ? getStudentCoursePath(String(subjects[0].id))
    : "#curriculum";
  return (
    <div className="min-h-svh bg-background pb-24 font-body-md text-on-surface md:pb-0">
      <header className="sticky top-0 z-50 border-b border-outline-variant/50 bg-surface/95 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              className="min-w-0 truncate text-headline-md font-bold text-primary"
              to={STUDENT_ROUTES.dashboard}
            >
              ML Learning
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {studentDashboardNavItems.map((item, index) => (
                <a
                  className={
                    index === 0
                      ? "border-b-2 border-secondary pb-1 text-label-md font-medium text-primary"
                      : "text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
                  }
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <button
              aria-label="Thông báo"
              className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50 active:scale-95"
            >
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <button className="flex items-center gap-2 rounded-full p-1 transition hover:bg-surface-variant/50 sm:pr-3">
              <img
                alt="Ảnh đại diện học sinh"
                className="h-8 w-8 rounded-full object-cover"
                src={studentDashboardProfile.avatarUrl}
              />
              <MaterialIcon className="hidden text-on-surface-variant sm:inline-flex">
                account_circle
              </MaterialIcon>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-xl px-margin-mobile py-lg md:px-margin-desktop">
        <section
          className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12 lg:items-center"
          id="dashboard"
        >
          <div className="min-w-0 space-y-md lg:col-span-7">
            <div className="min-w-0 space-y-xs">
              <span className="block text-label-md font-medium uppercase tracking-wider text-secondary">
                Chào mừng trở lại
              </span>
              <h1 className="max-w-[12ch] wrap-break-word text-[32px] font-bold leading-[1.12] text-primary sm:max-w-none sm:text-[42px] lg:text-display-lg">
                Xin chào, {studentDashboardProfile.name}
              </h1>
            </div>
            <p className="max-w-[62ch] text-base leading-7 text-on-surface-variant sm:text-body-lg">
              Tiếp tục hành trình chinh phục tri thức cùng hệ thống học tập trực
              tuyến ML Learning. Các bài giảng mới nhất đã sẵn sàng dành cho
              bạn.
            </p>
            <div className="grid gap-3 pt-2 sm:flex sm:flex-wrap sm:gap-4">
              <Link
                className="w-full rounded-lg bg-primary-container px-6 py-3 text-center text-label-md font-medium text-white transition hover:opacity-90 active:scale-95 sm:w-auto sm:px-8"
                to={featuredCoursePath}
              >
                Học tiếp ngay
              </Link>
              <a
                className="w-full rounded-lg border border-outline px-6 py-3 text-center text-label-md font-medium text-primary transition hover:bg-surface-variant/30 active:scale-95 sm:w-auto sm:px-8"
                href="#curriculum"
              >
                Xem lộ trình
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border-l-4 border-secondary-container bg-primary-container p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
              <div className="relative z-10">
                <MaterialIcon className="mb-4 h-12 w-12 text-[48px] text-secondary-container/50">
                  format_quote
                </MaterialIcon>
                <blockquote className="text-headline-md italic leading-relaxed text-white">
                  "Học, học nữa, học mãi."
                </blockquote>
                <cite className="mt-4 block text-label-md not-italic text-secondary-container">
                  - V.I. Lênin
                </cite>
              </div>
              <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            </div>
          </div>
        </section>





        <StudentCurriculumSection />




{/* 


        <section className="space-y-md" id="resources">
          <div className="space-y-xs">
            <h2 className="text-headline-lg font-semibold text-primary">
              Tài nguyên học tập
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Tài liệu, sơ đồ và bài luyện tập giúp bạn ôn nhanh từng chương.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {studentDashboardResources.map((resource) => (
              <article
                className="rounded-xl border border-outline-variant bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(35,39,51,0.08)]"
                key={resource.title}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                  <MaterialIcon>{resource.icon}</MaterialIcon>
                </div>
                <h3 className="text-headline-md font-semibold text-primary">
                  {resource.title}
                </h3>
                <p className="mt-2 text-label-md font-medium text-on-surface-variant">
                  {resource.type}
                </p>
                <button className="mt-6 rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary transition hover:bg-surface-variant/30">
                  Mở tài liệu
                </button>
              </article>
            ))}
          </div>
        </section> */}

        <section className="grid grid-cols-1 gap-gutter md:grid-cols-4" id="analytics">
          <article className="flex items-center gap-6 rounded-xl border border-outline-variant bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] md:col-span-2">
            <div className="rounded-xl bg-secondary-container p-4">
              <MaterialIcon className="scale-150 text-primary">
                query_stats
              </MaterialIcon>
            </div>
            <div>
              <h4 className="text-headline-md font-semibold text-primary">
                8.5 / 10
              </h4>
              <p className="text-label-md font-medium text-on-surface-variant">
                Điểm trung bình học tập
              </p>
            </div>
          </article>

          <article className="space-y-2 rounded-xl border border-outline-variant bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
            <span className="block text-display-lg font-bold text-secondary">
              12
            </span>
            <p className="text-label-sm font-semibold text-on-surface-variant">
              Bài kiểm tra đã xong
            </p>
          </article>

          <article className="space-y-2 rounded-xl border border-outline-variant bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
            <span className="block text-display-lg font-bold text-primary">
              48
            </span>
            <p className="text-label-sm font-semibold text-on-surface-variant">
              Giờ học tích lũy
            </p>
          </article>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_20px_rgba(35,39,51,0.04)] md:hidden">
        {studentDashboardBottomNavItems.map((item) => (
          <Link
            className={
              item.active
                ? "flex flex-col items-center justify-center rounded-full bg-secondary-container px-4 py-1 text-on-secondary-container transition active:scale-95"
                : "flex flex-col items-center justify-center rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50 active:scale-95"
            }
            key={item.label}
            to={item.href}
          >
            <MaterialIcon filled={item.active}>{item.icon}</MaterialIcon>
            <span className="text-label-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
