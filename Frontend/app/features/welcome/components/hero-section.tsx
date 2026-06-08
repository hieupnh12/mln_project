import { ArrowDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useTransform } from "framer-motion";

import { HERO_FLOATING_OBJECTS, LANDING_VISUAL_ASSETS } from "../constants/landing-visual";
import { useHeroParallax } from "../hooks/use-hero-parallax";
import { MagneticButton } from "./magnetic-button";

const PARTICLES = Array.from({ length: 16 }, (_, index) => ({
  id: `particle-${index}`,
  left: `${6 + ((index * 19) % 88)}%`,
  top: `${12 + ((index * 29) % 68)}%`,
  delay: index * 0.15,
}));

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { handlePointerLeave, handlePointerMove, x, y } = useHeroParallax();
  const visualX = useTransform(x, (value) => value * -0.45);
  const visualY = useTransform(y, (value) => value * -0.45);
  const shapeX = useTransform(x, (value) => value * 0.55);
  const shapeY = useTransform(y, (value) => value * 0.55);

  return (
    <section
      aria-labelledby="hero-title"
      className="landing-gradient-mesh relative min-h-[92svh] overflow-hidden px-margin-mobile pb-16 pt-28 text-landing-text md:px-margin-desktop md:pb-20 md:pt-32"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div aria-hidden="true" className="landing-soft-noise absolute inset-0 opacity-25" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-landing-red/10 blur-3xl"
        style={{ x: shapeX, y: shapeY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-10 h-80 w-80 rounded-full bg-landing-gold/20 blur-3xl"
        style={{ x: visualX, y: visualY }}
      />
      {!prefersReducedMotion && (
        <div aria-hidden="true" className="absolute inset-0">
          {PARTICLES.map((particle) => (
            <motion.span
              animate={{ opacity: [0.15, 0.55, 0.15], y: [-8, 12, -8] }}
              className="absolute h-1.5 w-1.5 rounded-full bg-landing-red/30"
              key={particle.id}
              style={{ left: particle.left, top: particle.top }}
              transition={{ delay: particle.delay, duration: 5, repeat: Infinity }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[calc(92svh-8rem)] lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,1.06fr)] lg:items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-red/10 bg-landing-white/70 px-4 py-2 text-landing-red shadow-sm backdrop-blur-xl">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            <span className="font-label-sm text-label-sm uppercase">Modern education platform</span>
          </div>
          <h1
            id="hero-title"
            className="landing-soviet-type font-serif text-[48px] font-bold leading-[0.98] text-landing-text sm:text-[72px] md:text-[88px]"
          >
            Mác - Lê Nin
          </h1>
          <p className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-landing-red sm:text-[36px]">
            Tri thức - Lịch sử - Cách mạng
          </p>
          <p className="mt-6 max-w-2xl text-body-lg text-landing-text-muted">
            Nền tảng học tập lý luận chính trị với trải nghiệm trực quan, hiện đại,
            kết hợp timeline, quiz và tài liệu học tập có cấu trúc.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              className="landing-glow-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-landing-red to-landing-red-deep px-6 py-3 font-label-md text-label-md font-semibold text-on-primary"
              href="#introduction"
            >
              Khám phá
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant/60 bg-landing-white/80 px-6 py-3 font-label-md text-label-md font-semibold text-landing-text shadow-sm backdrop-blur-xl"
              to="/login"
            >
              Đăng nhập hệ thống
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </MagneticButton>
          </div>
        </motion.div>

        <div className="landing-perspective relative min-h-[420px] lg:min-h-[560px]">
          <motion.div
            className="landing-glass-panel absolute inset-x-0 top-8 overflow-hidden rounded-[2rem] p-4 sm:p-5"
            initial={prefersReducedMotion ? false : { opacity: 0, rotateX: 8, y: 36 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            style={{ x: visualX, y: visualY, transformStyle: "preserve-3d" }}
          >
            <picture>
              <source srcSet={LANDING_VISUAL_ASSETS.modernHeroWebp} type="image/webp" />
              <img
                alt="Minh họa 3D hiện đại cho nền tảng học tập Mác - Lê Nin"
                className="aspect-[16/10] w-full rounded-[1.5rem] object-cover"
                decoding="async"
                fetchPriority="high"
                src={LANDING_VISUAL_ASSETS.modernHeroPng}
              />
            </picture>
          </motion.div>

          {HERO_FLOATING_OBJECTS.map((item) => (
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [-8, 8, -8] }}
              className={`landing-glass-panel absolute ${item.position} rounded-2xl px-4 py-3 text-sm font-semibold text-landing-text shadow-xl`}
              key={item.label}
              style={{ x: shapeX }}
              transition={{ delay: item.delay, duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <BookOpen aria-hidden="true" className="h-4 w-4 text-landing-red" />
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.a
        aria-label="Cuộn xuống phần giới thiệu"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-landing-text-soft md:block"
        href="#introduction"
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <ArrowDown aria-hidden="true" className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
