import { Link } from "react-router";
import { useState } from "react";

import type { Route } from "./+types/student-course";

type LearningTab = "lectures" | "flashcards" | "tests";

const student = {
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmgAhUdjynIgoYXjFQKl6-QVgquMDt6-XNmSn5I-pchog6m0f7d2qIeDCmq14SAIXIDE9hu4GL3BZca0xuDBQevwNkMR6a86kLQ_Fve6xOglFT_jXZWd0r1zPy3y8RFzJBLw27WqRBirNueH7xS_Qv1OTsJ5JzMftijJiyYUAUvIRtnK9vEcMPiQJHwlgArKajFsvIK5j-2f1mWtpLc48CsWtJV7_LqZoXrL69fLWjLWHWKNp85Voh2YOUJ6YpR-2EWlRnOv1wyIXB",
};

const course = {
  title: "Triết học Mác - Lênin",
  lecturer: "PGS.TS Nguyễn Văn A",
  progress: 45,
  slide: 12,
  totalSlides: 48,
  slideImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxBPVzl67z0sMbGwy9tBS846reWCygsE4qhPy7omCCCjXEjhddKS3OZcMJz4wuRDaAqRIrxLLAsUFzB6QNvX4WugVi9lGJhX0bwUhElGNuVtHgoTaW0pM17mG-U8bvu5mKK5NzRX-SldPtZIa8kFotnCcR0ydua6TzRrbVU7oUELGXvZwKGt2z1Tg3g_N5b3545IZ5NUld0otwX7pUNv-wo67CL7LjRPkX82rZt5VtCN_N_9oAfBtRbbPeIBr62C8xKE1urXrvfr5z",
};

const tabs: Array<{ id: LearningTab; label: string }> = [
  { id: "lectures", label: "Bài giảng" },
  { id: "flashcards", label: "Flashcard" },
  { id: "tests", label: "Kiểm tra" },
];

const chapters = [
  {
    number: "Chương 1",
    title: "Khái lược về Triết học và Triết học Mác - Lênin",
    state: "done",
  },
  {
    number: "Chương 2",
    title: "Chủ nghĩa duy vật biện chứng",
    state: "active",
  },
  {
    number: "Chương 3",
    title: "Phép biện chứng duy vật",
    state: "open",
  },
  {
    number: "Chương 4",
    title: "Học thuyết giá trị thặng dư",
    state: "locked",
  },
  {
    number: "Chương 5",
    title: "Chủ nghĩa duy vật lịch sử",
    state: "locked",
  },
];

const flashcards = [
  {
    front: "Vấn đề cơ bản của triết học là gì?",
    back: "Quan hệ giữa vật chất và ý thức, gồm mặt bản thể luận và nhận thức luận.",
  },
  {
    front: "Chủ nghĩa duy vật biện chứng nhấn mạnh điều gì?",
    back: "Thế giới vật chất tồn tại khách quan và vận động theo các quy luật phổ biến.",
  },
  {
    front: "Vai trò của thực tiễn trong nhận thức?",
    back: "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
];

const tests = [
  { title: "Kiểm tra nhanh Chương 1", questions: 10, duration: "12 phút" },
  { title: "Luyện tập Chương 2", questions: 15, duration: "18 phút" },
  { title: "Đề tổng hợp giữa kỳ", questions: 30, duration: "45 phút" },
];

const bottomNavItems = [
  { label: "Home", icon: "home", href: "/student/dashboard" },
  { label: "Library", icon: "menu_book", active: true, href: "#" },
  { label: "Progress", icon: "query_stats", href: "/student/dashboard#analytics" },
  { label: "Profile", icon: "person", href: "#" },
];

function MaterialIcon({
  children,
  className = "",
  filled = false,
}: {
  children: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden leading-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {children}
    </span>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triết học Mác - Lênin | ML Learning" },
    {
      name: "description",
      content: "Không gian học tập môn Triết học Mác - Lênin.",
    },
  ];
}

export default function StudentCourse() {
  const [activeTab, setActiveTab] = useState<LearningTab>("lectures");

  return (
    <div className="min-h-svh bg-background pb-24 font-body-md text-on-surface md:pb-0">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 shadow-[0_4px_20px_rgba(35,39,51,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop">
          <Link
            className="flex min-w-0 items-center gap-2 text-primary-container transition hover:opacity-70"
            to="/student/dashboard"
          >
            <MaterialIcon>arrow_back</MaterialIcon>
            <span className="truncate text-label-md font-medium">
              Trở về Trang chủ
            </span>
          </Link>

          <h1 className="hidden text-headline-md font-bold text-primary md:block">
            ML Learning
          </h1>

          <div className="flex shrink-0 items-center gap-3">
            <button
              aria-label="Thông báo"
              className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-variant/50"
            >
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <img
              alt="Ảnh đại diện học sinh"
              className="h-8 w-8 rounded-full bg-secondary-container object-cover"
              src={student.avatarUrl}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-margin-mobile py-md md:px-margin-desktop">
        <section className="mb-lg">
          <div className="flex flex-col justify-between gap-md md:flex-row md:items-end">
            <div className="min-w-0">
              <h2 className="mb-xs text-headline-lg font-semibold text-primary">
                {course.title}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Giảng viên: {course.lecturer}
              </p>
            </div>

            <div className="w-full rounded-full border border-outline-variant bg-surface-container-high p-1 md:w-72">
              <div className="mb-1 flex justify-between px-4">
                <span className="text-label-sm font-semibold text-on-surface-variant">
                  Tiến độ
                </span>
                <span className="text-label-sm font-semibold text-primary">
                  {course.progress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-1000"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <nav className="mb-md border-b border-outline-variant">
          <div className="flex gap-gutter overflow-x-auto">
            {tabs.map((tab) => (
              <button
                className={
                  activeTab === tab.id
                    ? "whitespace-nowrap border-b-2 border-secondary px-1 pb-3 text-label-md font-medium text-primary"
                    : "whitespace-nowrap px-1 pb-3 text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
                }
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="min-w-0 space-y-md lg:col-span-9">
            {activeTab === "lectures" && (
              <>
                <section className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
                  <img
                    alt="Slide bài giảng triết học tối giản"
                    className="h-full w-full object-cover"
                    src={course.slideImage}
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 bg-gradient-to-t from-primary/25 to-transparent p-md opacity-100 transition-opacity sm:flex-row sm:items-center sm:justify-between lg:opacity-0 lg:group-hover:opacity-100">
                    <div className="flex gap-2">
                      {["fullscreen", "settings"].map((icon) => (
                        <button
                          aria-label={icon}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-secondary-container"
                          key={icon}
                          type="button"
                        >
                          <MaterialIcon className="text-primary">
                            {icon}
                          </MaterialIcon>
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm">
                      <button className="flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary">
                        <MaterialIcon>chevron_left</MaterialIcon>
                        Trước
                      </button>
                      <span className="border-x border-outline-variant px-4 text-label-sm font-semibold">
                        {course.slide} / {course.totalSlides}
                      </span>
                      <button className="flex items-center gap-1 text-label-md font-medium text-primary transition hover:text-secondary">
                        Tiếp
                        <MaterialIcon>chevron_right</MaterialIcon>
                      </button>
                    </div>
                  </div>
                </section>

                <aside className="rounded-lg border-l-4 border-secondary-container bg-primary-container p-md text-white shadow-lg">
                  <p className="mb-xs text-headline-md italic">
                    "Triết học không treo lơ lửng ngoài thế giới, cũng như bộ
                    óc không treo lơ lửng ngoài cơ thể con người..."
                  </p>
                  <p className="text-label-md text-secondary-container/80">
                    — Các Mác
                  </p>
                </aside>
              </>
            )}

            {activeTab === "flashcards" && (
              <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                {flashcards.map((card, index) => (
                  <article
                    className="flex min-h-56 flex-col justify-between rounded-xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]"
                    key={card.front}
                  >
                    <span className="w-fit rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
                      Thẻ {index + 1}
                    </span>
                    <h3 className="mt-6 text-headline-md font-semibold text-primary">
                      {card.front}
                    </h3>
                    <p className="mt-4 text-body-md text-on-surface-variant">
                      {card.back}
                    </p>
                  </article>
                ))}
              </section>
            )}

            {activeTab === "tests" && (
              <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                {tests.map((test) => (
                  <article
                    className="rounded-xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]"
                    key={test.title}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                      <MaterialIcon>quiz</MaterialIcon>
                    </div>
                    <h3 className="text-headline-md font-semibold text-primary">
                      {test.title}
                    </h3>
                    <p className="mt-3 text-body-md text-on-surface-variant">
                      {test.questions} câu hỏi • {test.duration}
                    </p>
                    <button className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-label-md font-medium text-white transition hover:bg-primary-container">
                      Bắt đầu
                    </button>
                  </article>
                ))}
              </section>
            )}
          </div>

          <aside className="min-w-0 lg:col-span-3">
            <div className="flex h-full max-h-[600px] flex-col rounded-xl border border-outline-variant/30 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
              <h3 className="mb-md flex items-center gap-2 text-label-md font-medium uppercase tracking-wider text-primary-container">
                <MaterialIcon className="text-secondary">list_alt</MaterialIcon>
                Nội dung chương trình
              </h3>

              <div className="flex-1 space-y-xs overflow-y-auto pr-1">
                {chapters.map((chapter) => (
                  <button
                    className={
                      chapter.state === "done"
                        ? "w-full rounded-lg border border-secondary-container bg-secondary-container/30 p-3 text-left"
                        : chapter.state === "active"
                          ? "w-full rounded-lg border border-outline-variant/50 bg-surface-container-low p-3 text-left transition hover:bg-secondary-container/10"
                          : "w-full rounded-lg border border-transparent p-3 text-left transition hover:border-outline-variant"
                    }
                    key={chapter.number}
                    type="button"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={
                          chapter.state === "open" ||
                          chapter.state === "locked"
                            ? "text-label-md font-medium text-on-surface-variant"
                            : "text-label-md font-medium text-primary"
                        }
                      >
                        {chapter.number}
                      </span>
                      {chapter.state === "done" && (
                        <MaterialIcon
                          className="h-4 w-4 text-sm text-secondary"
                          filled
                        >
                          check_circle
                        </MaterialIcon>
                      )}
                      {chapter.state === "active" && (
                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                          Đang học
                        </span>
                      )}
                      {chapter.state === "locked" && (
                        <MaterialIcon className="h-4 w-4 text-sm text-outline">
                          lock
                        </MaterialIcon>
                      )}
                    </div>
                    <p
                      className={
                        chapter.state === "locked" || chapter.state === "open"
                          ? "text-sm leading-tight text-outline"
                          : "text-sm leading-tight text-on-surface-variant"
                      }
                    >
                      {chapter.title}
                    </p>
                  </button>
                ))}
              </div>

              <button className="mt-md flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-label-md font-medium text-white transition hover:bg-primary-container active:scale-95">
                <MaterialIcon>download</MaterialIcon>
                Tải tài liệu (PDF)
              </button>
            </div>
          </aside>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant/10 bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_20px_rgba(35,39,51,0.04)] md:hidden">
        {bottomNavItems.map((item) => (
          <Link
            className={
              item.active
                ? "flex flex-col items-center justify-center rounded-full bg-secondary-container px-4 py-1 text-on-secondary-container"
                : "flex flex-col items-center justify-center text-on-surface-variant"
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
