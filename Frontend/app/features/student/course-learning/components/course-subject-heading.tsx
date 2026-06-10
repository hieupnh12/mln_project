import { BookOpen, GraduationCap } from "lucide-react";

type CourseSubjectHeadingProps = {
  title: string;
  code: string;
};

export function CourseSubjectHeading({ title, code }: CourseSubjectHeadingProps) {
  return (
    <section className="landing-gradient-mesh relative overflow-hidden rounded-xl border border-landing-red/10 px-5 py-6 sm:px-7 sm:py-8">
      <div className="landing-soft-noise pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-label-md font-semibold text-landing-red">
            <GraduationCap aria-hidden="true" className="h-4 w-4" />
            Không gian khóa học
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-[30px] font-bold leading-tight text-landing-text sm:text-[38px]">
            {title}
          </h1>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-landing-red/15 bg-landing-white/80 px-4 py-3 text-label-md font-semibold text-landing-red shadow-sm backdrop-blur-xl">
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          {code}
        </span>
      </div>
    </section>
  );
}
