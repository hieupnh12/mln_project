type CourseSubjectHeadingProps = {
  title: string;
  code: string;
};

export function CourseSubjectHeading({ title, code }: CourseSubjectHeadingProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="min-w-0 text-headline-md font-semibold tracking-tight text-primary md:text-headline-lg">
        {title}
      </h2>
      <span className="shrink-0 rounded-md bg-secondary-container/50 px-2.5 py-1 text-label-sm font-semibold text-secondary">
        {code}
      </span>
    </div>
  );
}
