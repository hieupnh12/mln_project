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
    <section className="relative flex aspect-video items-end overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <img
        alt={`Ảnh bìa môn ${subjectTitle}`}
        className="absolute inset-0 h-full w-full object-cover"
        src={coverImageUrl}
      />
      <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-transparent" />
      <div className="relative z-10 w-full p-md sm:p-lg">
        <p className="text-label-sm font-semibold uppercase tracking-wider text-secondary-container">
          Môn học
        </p>
        <h3 className="mt-1 text-headline-lg font-semibold text-white">{subjectTitle}</h3>
        {description ? (
          <p className="mt-2 max-w-2xl text-body-md text-white/85">{description}</p>
        ) : null}
        <p className="mt-4 text-label-md text-secondary-container/90">
          Chọn chương và tài liệu ở cột bên phải để bắt đầu học.
        </p>
      </div>
    </section>
  );
}
