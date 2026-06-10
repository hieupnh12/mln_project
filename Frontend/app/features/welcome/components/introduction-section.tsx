import { CheckCircle2, Layers3 } from "lucide-react";

import { INTRO_POINTS } from "../constants/landing-content";
import { LANDING_VISUAL_ASSETS } from "../constants/landing-visual";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { TiltCard } from "./tilt-card";

export function IntroductionSection() {
  return (
    <section
      aria-labelledby="introduction-title"
      className="relative overflow-hidden bg-landing-white px-margin-mobile py-16 text-landing-text md:px-margin-desktop md:py-xl"
      id="introduction"
    >
      <div aria-hidden="true" className="absolute right-0 top-16 h-72 w-72 rounded-full bg-landing-red/5 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
        <SectionHeading
          align="left"
          description="Chủ nghĩa Mác - Lê Nin được trình bày như một hệ thống tri thức có cấu trúc: dễ tiếp cận, có bối cảnh lịch sử và được hỗ trợ bởi công cụ học tập hiện đại."
          eyebrow="Introduction"
          title="Một cổng vào hiện đại cho học tập lý luận"
        />

        <Reveal delay={0.12}>
          <TiltCard className="landing-glass-panel rounded-2xl p-4">
            <picture>
              <source srcSet={LANDING_VISUAL_ASSETS.modernHeroWebp} type="image/webp" />
              <img
                alt="Minh họa không gian học tập hiện đại của dự án Mác - Lê Nin"
                className="aspect-[4/3] w-full rounded-xl object-cover"
                decoding="async"
                loading="lazy"
                src={LANDING_VISUAL_ASSETS.modernHeroPng}
              />
            </picture>
          </TiltCard>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
        {INTRO_POINTS.map((point, index) => (
          <Reveal delay={index * 0.08} key={point}>
            <TiltCard className="h-full rounded-2xl border border-outline-variant/40 bg-landing-white/80 p-6 shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-landing-red/10 text-landing-red">
                {index === 0 ? (
                  <Layers3 aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                )}
              </div>
              <p className="text-body-md text-landing-text-muted">{point}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
