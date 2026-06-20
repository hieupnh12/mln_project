import { HelpCircle } from "lucide-react";
import { Link } from "react-router";

type FlashcardEmptyStateProps = {
  backHref: string;
};

export function FlashcardEmptyState({ backHref }: FlashcardEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white p-gutter text-center shadow-sm">
      <HelpCircle
        aria-hidden="true"
        className="mb-4 h-16 w-16 text-landing-text-soft opacity-70"
      />
      <h2 className="font-serif text-headline-md font-bold text-landing-text">Bộ thẻ trống</h2>
      <p className="mt-2 max-w-sm text-body-md text-landing-text-soft">
        Chương học này hiện chưa được cấu hình thẻ ghi nhớ nào. Vui lòng quay lại sau!
      </p>
      <Link
        className="mt-6 inline-flex rounded-lg bg-landing-red px-6 py-3 text-label-md font-semibold text-on-primary transition hover:opacity-90"
        to={backHref}
      >
        Quay lại Flashcard
      </Link>
    </div>
  );
}
