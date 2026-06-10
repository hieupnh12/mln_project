import { motion, useReducedMotion } from "framer-motion";

import { TIMELINE_EVENTS } from "../constants/landing-content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { TiltCard } from "./tilt-card";

export function TimelineSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="timeline-title"
      className="relative overflow-hidden bg-landing-white px-margin-mobile py-16 text-landing-text md:px-margin-desktop md:py-xl"
      id="timeline"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-landing-cream to-transparent" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="Những cột mốc lớn được đặt trong một dòng thời gian có chiều sâu, giúp người học thấy sự phát triển của tư tưởng trong bối cảnh lịch sử."
          eyebrow="Historical Timeline"
          title="Dòng lịch sử với chiều sâu trực quan"
        />

        <div className="landing-perspective relative mt-14">
          <motion.div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-landing-red via-landing-gold to-landing-red md:left-1/2"
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            whileInView={prefersReducedMotion ? undefined : { scaleY: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ transformOrigin: "top" }}
          />
          <ol className="space-y-8">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <li className="relative md:grid md:grid-cols-2 md:gap-12" key={event.title}>
                  <Reveal
                    className={`ml-12 md:ml-0 ${isEven ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}
                    delay={index * 0.08}
                  >
                    <TiltCard className="rounded-2xl border border-outline-variant/40 bg-landing-white/90 p-6 shadow-xl backdrop-blur-xl">
                      <p className="font-label-md text-label-md text-landing-red">{event.period}</p>
                      <h3 className="mt-3 font-serif text-2xl font-bold text-landing-text">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-body-md text-landing-text-soft">
                        {event.description}
                      </p>
                    </TiltCard>
                  </Reveal>
                  <span className="absolute left-4 top-6 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-landing-white bg-landing-red shadow-lg ring-8 ring-landing-red/10 md:left-1/2" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
