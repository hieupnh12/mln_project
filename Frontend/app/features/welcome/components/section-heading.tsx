import { SECTION_EYEBROW_ICON } from "../constants/landing-content";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const Icon = SECTION_EYEBROW_ICON;
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <Reveal className={`max-w-3xl ${alignment}`}>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-landing-red/10 bg-landing-red/5 px-4 py-2 text-landing-red">
        <Icon aria-hidden="true" className="h-4 w-4" />
        <span className="font-label-sm text-label-sm uppercase">{eyebrow}</span>
      </div>
      <h2 className="font-serif text-3xl font-bold leading-tight text-landing-text sm:text-headline-lg md:text-[44px]">
        {title}
      </h2>
      <p className="mt-4 text-body-md text-landing-text-soft sm:text-body-lg">
        {description}
      </p>
    </Reveal>
  );
}
