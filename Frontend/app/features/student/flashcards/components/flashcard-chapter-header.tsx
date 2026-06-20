import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

type FlashcardChapterHeaderProps = {
  backHref: string;
};

export function FlashcardChapterHeader({ backHref }: FlashcardChapterHeaderProps) {
  return (
    <header className="mb-sm">
      <Link
        className="inline-flex items-center gap-2 text-label-md font-medium text-landing-text-soft transition hover:text-secondary"
        to={backHref}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Quay lại Flashcard
      </Link>
    </header>
  );
}
