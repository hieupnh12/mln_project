import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";

type FlashcardStudyControlsProps = {
  currentIndex: number;
  isShuffled: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onToggleShuffle: () => void;
  totalCards: number;
};

export function FlashcardStudyControls({
  currentIndex,
  isShuffled,
  onNext,
  onPrev,
  onReset,
  onToggleShuffle,
  totalCards,
}: FlashcardStudyControlsProps) {
  return (
    <div className="mx-auto mt-md flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant/35 bg-landing-white p-3 shadow-sm sm:p-4">
      <button
        className={
          isShuffled
            ? "inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary-container/40 px-4 py-2 text-label-md font-semibold text-secondary"
            : "inline-flex items-center gap-2 rounded-lg border border-outline-variant/35 px-4 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
        }
        onClick={onToggleShuffle}
        type="button"
      >
        <Shuffle aria-hidden="true" className="h-4 w-4" />
        {isShuffled ? "Đang trộn" : "Xáo trộn"}
      </button>

      <div className="flex items-center gap-3 rounded-full border border-outline-variant/30 bg-landing-gray/60 px-2 py-1.5">
        <button
          aria-label="Thẻ trước"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-landing-white text-landing-text-soft transition hover:text-landing-text"
          onClick={onPrev}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <span className="min-w-14 text-center text-label-md font-semibold tabular-nums text-landing-text">
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          aria-label="Thẻ sau"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-landing-white text-landing-text-soft transition hover:text-landing-text"
          onClick={onNext}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/35 px-4 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
        onClick={onReset}
        type="button"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Làm mới
      </button>
    </div>
  );
}
