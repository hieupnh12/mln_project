import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Route, Sparkles } from "lucide-react";
import { Link } from "react-router";

type StudentWelcomePanelProps = {
  featuredCoursePath: string;
  hasResumePoint: boolean;
  userName: string;
};

export function StudentWelcomePanel({
  featuredCoursePath,
  hasResumePoint,
  userName,
}: StudentWelcomePanelProps) {
  return (
    <section
      className="relative grid gap-8 overflow-hidden border-b border-outline-variant/35 pb-10 pt-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.65fr)] lg:items-center lg:pb-12 lg:pt-8"
      id="dashboard"
    >
      <div className="landing-gradient-mesh pointer-events-none absolute inset-0 opacity-55" />
      <div className="landing-soft-noise pointer-events-none absolute inset-0 opacity-20" />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-w-0 py-6 lg:py-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.55 }}
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-landing-red/15 bg-landing-white/75 px-4 py-2 text-label-md font-semibold text-landing-red shadow-sm backdrop-blur-xl">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          Không gian học tập cá nhân
        </p>
        <h1 className="mt-6 max-w-[18ch] font-serif text-[38px] font-bold leading-[1.08] text-landing-text sm:text-[46px] lg:text-[52px]">
          Chào {userName}, sẵn sàng cho bài học mới?
        </h1>
        <p className="mt-5 max-w-[62ch] text-body-md text-landing-text-muted sm:text-body-lg">
          Tiếp tục lộ trình Mác - Lê Nin, theo dõi tiến độ và truy cập nhanh các
          học liệu dành cho bạn.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className="landing-glow-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-landing-red to-landing-red-dark px-6 py-3 text-label-md font-semibold text-on-primary transition hover:-translate-y-0.5 active:translate-y-0"
            to={featuredCoursePath}
          >
            <BookOpen aria-hidden="true" className="h-5 w-5" />
            {hasResumePoint ? "Học tiếp ngay" : "Bắt đầu học"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-landing-white/80 px-6 py-3 text-label-md font-semibold text-landing-text transition hover:border-landing-red/30 hover:text-landing-red"
            href="#curriculum"
          >
            <Route aria-hidden="true" className="h-5 w-5" />
            Xem lộ trình
          </a>
        </div>
      </motion.div>

      <motion.aside
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 rounded-xl border border-landing-red/15 bg-landing-white/80 p-6 shadow-xl shadow-landing-red/10 backdrop-blur-xl"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-label-md font-semibold text-landing-red">
            Tri thức mỗi ngày
          </span>
          <span className="rounded-full bg-landing-gold/15 px-3 py-1 text-label-sm font-semibold text-landing-text-muted">
            Hôm nay
          </span>
        </div>
        <blockquote className="mt-6 font-serif text-2xl font-semibold leading-relaxed text-landing-text">
          “Học, học nữa, học mãi.”
        </blockquote>
        <p className="mt-4 text-label-md font-medium text-landing-text-soft">
          V.I. Lê Nin
        </p>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-landing-gray">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-landing-red to-landing-gold" />
        </div>
        <p className="mt-3 text-label-sm text-landing-text-soft">
          Duy trì nhịp học đều đặn để hoàn thành mục tiêu.
        </p>
      </motion.aside>
    </section>
  );
}
