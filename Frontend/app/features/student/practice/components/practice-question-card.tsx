type PracticeQuestionCardProps = {
  questionIndex: number;
  questionText: string;
  questionType?: string;
};

export function PracticeQuestionCard({
  questionIndex,
  questionText,
  questionType,
}: PracticeQuestionCardProps) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm md:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-secondary-container/30 px-3 py-1 text-label-sm font-semibold text-on-secondary-container">
            Câu hỏi {questionIndex}
          </span>
          {questionType ? (
            <span className="inline-block rounded-full bg-primary-fixed/15 px-3 py-1 text-label-sm font-medium text-primary">
              {questionType}
            </span>
          ) : null}
        </div>
        <h2 className="text-body-lg leading-snug font-semibold text-on-surface md:text-headline-sm">
          {questionText}
        </h2>
      </div>
    </section>
  );
}
