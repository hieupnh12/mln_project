type CourseQuotePanelProps = {
  quote: string;
  author: string;
};

export function CourseQuotePanel({ quote, author }: CourseQuotePanelProps) {
  return (
    <aside className="rounded-lg border-l-4 border-secondary-container bg-primary-container p-md text-white shadow-lg">
      <p className="text-headline-md font-semibold italic">{quote}</p>
      <p className="mt-xs text-label-md text-secondary-container opacity-80">— {author}</p>
    </aside>
  );
}
