import { LANDING_STATISTICS } from "../constants/landing-content";
import { AnimatedCounter } from "./animated-counter";
import { Reveal } from "./reveal";
import { TiltCard } from "./tilt-card";

export function StatisticsSection() {
  return (
    <section className="bg-landing-gray px-margin-mobile py-14 md:px-margin-desktop md:py-16">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {LANDING_STATISTICS.map((statistic, index) => (
          <Reveal delay={index * 0.08} key={statistic.label}>
            <TiltCard className="rounded-2xl border border-outline-variant/40 bg-landing-white p-7 text-center shadow-lg">
              <p className="font-serif text-5xl font-bold text-landing-red">
                <AnimatedCounter suffix={statistic.suffix} value={statistic.value} />
              </p>
              <h2 className="mt-3 text-body-md font-semibold text-landing-text-muted">
                {statistic.label}
              </h2>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
