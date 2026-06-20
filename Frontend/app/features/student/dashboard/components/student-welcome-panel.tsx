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
      className="relative grid min-w-0 gap-8 border-b border-outline-variant/35 pb-10 pt-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.65fr)] lg:items-center lg:pb-12 lg:pt-8"
      id="dashboard"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-w-0 py-6 lg:py-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.55 }}
      >
        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-secondary/20 bg-secondary-container/35 px-4 py-2 text-label-md font-semibold text-secondary shadow-sm">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          <span className="min-w-0 break-words">Không gian học tập cá nhân</span>
        </p>
        <h1 className="mt-6 max-w-[18ch] break-words font-serif text-[34px] font-bold leading-[1.1] text-landing-text sm:text-[46px] lg:text-[52px]">
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
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-secondary-container/30 px-6 py-3 text-label-md font-semibold text-secondary transition hover:border-secondary/45 hover:bg-secondary-container/50"
            href="#curriculum"
          >
            <Route aria-hidden="true" className="h-5 w-5" />
            Xem lộ trình
          </a>
        </div>
      </motion.div>

      <motion.aside
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 overflow-hidden rounded-xl border border-landing-red-dark/30 bg-gradient-to-br from-landing-red via-landing-red-deep to-landing-red-dark p-6 text-on-primary shadow-xl shadow-landing-text/10"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-label-md font-semibold text-on-primary">
            Tri thức mỗi ngày
          </span>
          <span className="rounded-full border border-landing-gold/35 bg-landing-gold/20 px-3 py-1 text-label-sm font-semibold text-on-primary">
            Hôm nay
          </span>
        </div>
        <blockquote className="mt-6 font-serif text-2xl font-semibold leading-relaxed text-on-primary">
          “Học, học nữa, học mãi.”
        </blockquote>
        <div className="mt-4 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-landing-gold" />
          <p className="text-label-md font-medium text-landing-white/85">
            V.I. Lê Nin
          </p>
        </div>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-landing-white/20">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-landing-gold to-landing-white" />
        </div>
        <p className="mt-3 text-label-sm text-landing-white/80">
          Duy trì nhịp học đều đặn để hoàn thành mục tiêu.
        </p>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-landing-gold" />
      </motion.aside>
    </section>
  );
}
