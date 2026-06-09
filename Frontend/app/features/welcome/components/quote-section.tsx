import { Quote } from "lucide-react";

import { QUOTE } from "../constants/landing-content";
import { Reveal } from "./reveal";

export function QuoteSection() {
  return (
    <section className="landing-gradient-mesh px-margin-mobile py-16 text-landing-text md:px-margin-desktop md:py-xl">
      <Reveal className="mx-auto max-w-5xl">
        <figure className="landing-glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-10 md:p-14">
          <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-landing-red/10 blur-3xl" />
          <Quote aria-hidden="true" className="mb-6 h-10 w-10 text-landing-red" />
          <blockquote className="landing-soviet-type font-serif text-3xl font-bold leading-tight text-landing-text sm:text-[44px]">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-7 border-t border-outline-variant/40 pt-5 text-label-md uppercase text-landing-text-soft">
            <span className="text-landing-red">{QUOTE.author}</span> - {QUOTE.source}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
