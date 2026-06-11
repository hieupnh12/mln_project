import { BookOpen } from "lucide-react";

type CourseSubjectHeadingProps = {
  title: string;
  code: string;
};

export function CourseSubjectHeading({ title, code }: CourseSubjectHeadingProps) {
  return (
    <section className="border-b border-outline-variant/35">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 font-serif text-headline-md font-bold leading-tight text-landing-text sm:text-[28px]">
          {/* {title} */}
        </h1>
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-landing-gold/30 bg-landing-gold/10 px-3 py-2 text-label-md font-semibold text-landing-text-muted">
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          {code}
        </span>
      </div>
    </section>
  );
}
