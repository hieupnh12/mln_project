type PracticeQuestionCardProps = {
  questionIndex: number;
  questionText: string;
};

export function PracticeQuestionCard({ questionIndex, questionText }: PracticeQuestionCardProps) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm md:p-10">
        <span className="mb-4 inline-block rounded-full bg-secondary-container/30 px-3 py-1 text-label-sm font-semibold text-on-secondary-container">
          Câu hỏi {questionIndex}
        </span>
        <h2 className="text-headline-md leading-snug font-semibold text-on-surface">
          {questionText}
        </h2>
      </div>
    </section>
  );
}
