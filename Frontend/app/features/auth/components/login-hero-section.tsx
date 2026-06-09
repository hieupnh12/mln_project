import { motion } from "framer-motion";
import { Landmark, Sparkles } from "lucide-react";
import { Link } from "react-router";

import {
  LOGIN_FEATURES,
  LOGIN_HERO_ASSET,
  LOGIN_HERO_BADGES,
  LOGIN_QUOTE,
} from "../constants/login-content.constants";

export function LoginHeroSection() {
  return (
    <section className="relative hidden min-w-0 overflow-hidden px-8 py-8 text-landing-text lg:flex lg:min-h-svh lg:flex-col xl:px-12 2xl:px-margin-desktop">
      <div className="landing-gradient-mesh absolute inset-0" />
      <div className="landing-soft-noise pointer-events-none absolute inset-0 opacity-30" />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
        className="absolute right-[12%] top-[16%] h-24 w-24 rounded-[28px] border border-landing-red/10 bg-landing-white/70 shadow-2xl shadow-landing-red/10 backdrop-blur-xl xl:h-28 xl:w-28"
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        className="absolute bottom-[16%] left-[8%] h-20 w-20 rounded-full border border-landing-gold/20 bg-landing-gold/10 blur-[1px]"
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <Link
          className="inline-flex min-w-0 items-center gap-3 rounded-full bg-landing-white/70 px-4 py-2 text-label-md font-semibold text-landing-text shadow-sm backdrop-blur-xl transition hover:text-landing-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-red/40"
          to="/"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-landing-red to-landing-red-dark text-on-primary">
            <Landmark aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0 truncate">Mác - Lê Nin</span>
        </Link>
      </div>

      <div className="relative z-10 grid flex-1 items-center gap-8 py-8 2xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
        <div className="max-w-2xl">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-landing-red/15 bg-landing-white/70 px-4 py-2 text-label-md font-semibold text-landing-red shadow-sm backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55 }}
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Futuristic education platform
          </motion.p>

          <motion.h2
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-[13ch] font-serif text-[54px] font-bold leading-[0.98] text-landing-text xl:text-[64px] 2xl:text-[72px]"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Tri thức dẫn lối học tập.
          </motion.h2>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 max-w-[54ch] text-body-md text-landing-text-muted xl:text-body-lg"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Không gian đăng nhập đồng bộ với landing page mới: sáng, gọn, hiện đại và
            tập trung vào trải nghiệm học tập sau khi xác thực.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            {LOGIN_HERO_BADGES.map((badge) => (
              <span
                className="rounded-full border border-landing-red/15 bg-landing-white/70 px-4 py-2 text-label-md font-semibold text-landing-text-muted shadow-sm backdrop-blur-xl"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          className="landing-perspective relative hidden 2xl:block"
          initial={{ opacity: 0, x: 34, rotateY: -8 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="landing-glass-panel landing-3d-card relative overflow-hidden rounded-[32px] p-4">
            <img
              alt={LOGIN_HERO_ASSET.alt}
              className="aspect-[4/3] w-full rounded-[24px] object-cover"
              decoding="async"
              loading="eager"
              src={LOGIN_HERO_ASSET.src}
            />
            <div className="absolute inset-x-7 bottom-7 rounded-3xl border border-landing-white/60 bg-landing-white/80 p-5 shadow-xl shadow-landing-red/10 backdrop-blur-xl">
              <p className="text-label-md font-semibold text-landing-red">{LOGIN_QUOTE.author}</p>
              <p className="mt-2 text-body-md font-medium text-landing-text">
                {LOGIN_QUOTE.text}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 grid gap-3 xl:grid-cols-3">
        {LOGIN_FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              className="landing-glass-panel rounded-3xl p-4 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-landing-red/10"
              key={feature.title}
            >
              <Icon aria-hidden="true" className="h-5 w-5 text-landing-red" />
              <h3 className="mt-3 text-base font-semibold text-landing-text">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-landing-text-soft">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
