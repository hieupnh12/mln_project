import { ArrowRight, BookOpen } from "lucide-react";

type CourseCoverPanelProps = {
  subjectTitle: string;
  coverImageUrl: string;
  description?: string;
};

export function CourseCoverPanel({
  subjectTitle,
  coverImageUrl,
  description,
}: CourseCoverPanelProps) {
  return (
    <section className="relative flex min-h-[360px] items-end overflow-hidden rounded-xl border border-outline-variant/30 bg-landing-white shadow-xl shadow-landing-text/5 sm:min-h-[430px]">
      <img
        alt={`Ảnh bìa môn ${subjectTitle}`}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        src={coverImageUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-landing-text via-landing-text/45 to-transparent" />
      <div className="relative z-10 w-full p-5 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-landing-white/15 px-3 py-1.5 text-label-sm font-semibold text-on-primary backdrop-blur-xl">
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          Môn học
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-[30px] font-bold leading-tight text-on-primary sm:text-[40px]">
          {subjectTitle}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-body-md text-on-primary/85">{description}</p>
        ) : null}
        <p className="mt-6 inline-flex items-center gap-2 text-label-md font-semibold text-on-primary">
          Chọn chương và tài liệu để bắt đầu
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </p>
      </div>
    </section>
  );
}
