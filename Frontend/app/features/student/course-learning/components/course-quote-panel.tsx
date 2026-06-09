import { Quote } from "lucide-react";

type CourseQuotePanelProps = {
  quote: string;
  author: string;
};

export function CourseQuotePanel({ quote, author }: CourseQuotePanelProps) {
  return (
    <aside className="relative overflow-hidden rounded-xl border border-landing-red/15 bg-landing-white p-md shadow-lg shadow-landing-red/5">
      <Quote aria-hidden="true" className="h-7 w-7 text-landing-gold" />
      <p className="mt-4 max-w-3xl font-serif text-xl font-semibold italic leading-relaxed text-landing-text sm:text-2xl">
        {quote}
      </p>
      <p className="mt-4 text-label-md font-semibold text-landing-red">— {author}</p>
    </aside>
  );
}
