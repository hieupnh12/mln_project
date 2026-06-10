import { LEARNING_FEATURES } from "../constants/landing-content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { TiltCard } from "./tilt-card";

export function FeaturesPreviewSection() {
  return (
    <section
      aria-labelledby="learning-title"
      className="relative overflow-hidden bg-landing-cream px-margin-mobile py-16 text-landing-text md:px-margin-desktop md:py-xl"
      id="learning"
    >
      <div aria-hidden="true" className="absolute left-10 top-10 h-72 w-72 rounded-full bg-landing-gold/20 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="Landing page chỉ preview các module chính. Sau khi đăng nhập, người dùng được điều hướng vào hệ thống học tập theo vai trò."
          eyebrow="Learning Features"
          title="Preview hệ sinh thái học tập thông minh"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal delay={index * 0.06} key={feature.title}>
                <TiltCard className="h-full rounded-2xl border border-outline-variant/40 bg-landing-white/80 p-6 shadow-lg backdrop-blur-xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-landing-red to-landing-red-deep text-on-primary shadow-md">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="font-headline-md text-xl font-semibold text-landing-text">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-body-md text-landing-text-soft">
                    {feature.description}
                  </p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
