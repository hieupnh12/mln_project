import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import {
  LOGIN_FORM_FEATURES,
  LOGIN_PREVIEW_STATS,
} from "../constants/login-content.constants";
import { GoogleLoginButton } from "./google-login-button";

type LoginCardProps = {
  isLoading: boolean;
  onGoogleLogin: () => void;
};

export function LoginCard({ isLoading, onGoogleLogin }: LoginCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      className="landing-glass-panel landing-3d-card relative w-full max-w-[460px] overflow-hidden rounded-[28px] px-5 py-7 text-landing-text shadow-2xl shadow-landing-red/10 sm:px-8 sm:py-9 lg:px-10 lg:py-11"
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-landing-red/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-landing-gold/15 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-landing-red/10 text-landing-red">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <span className="rounded-full border border-landing-red/15 bg-landing-white/80 px-3 py-1 text-label-sm font-semibold text-landing-red shadow-sm">
            Secure access
          </span>
        </div>

        <header className="mt-7">
          <p className="text-label-md font-semibold text-landing-red">Mác - Lê Nin</p>
          <h1 className="mt-3 font-serif text-[32px] font-bold leading-tight text-landing-text sm:text-[42px]">
            Chào mừng trở lại
          </h1>
          <p className="mt-4 text-body-md text-landing-text-muted">
            Đăng nhập để tiếp tục bài học, luyện quiz và truy cập hệ thống học tập chính.
          </p>
        </header>

        <div className="mt-8">
          <GoogleLoginButton isLoading={isLoading} onClick={onGoogleLogin} />
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {LOGIN_FORM_FEATURES.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="flex items-center gap-3 rounded-2xl border border-outline-variant/35 bg-landing-white/70 px-4 py-3 text-label-md font-medium text-landing-text-muted"
                key={item.label}
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-landing-red" />
                <span className="min-w-0 truncate">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3 rounded-3xl border border-outline-variant/35 bg-landing-gray/60 p-3">
          {LOGIN_PREVIEW_STATS.map((stat) => (
            <div className="min-w-0 text-center" key={stat.label}>
              <p className="text-lg font-bold text-landing-red sm:text-xl">{stat.value}</p>
              <p className="mt-1 truncate text-label-sm text-landing-text-soft">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-7 flex items-center justify-center gap-2 text-center text-label-md text-landing-text-soft">
          <span>Vào hệ thống chính sau khi xác thực</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </p>
      </div>
    </motion.div>
  );
}
