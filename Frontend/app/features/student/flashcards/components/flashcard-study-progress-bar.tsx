type FlashcardStudyProgressBarProps = {
  currentIndex: number;
  totalCards: number;
};

export function FlashcardStudyProgressBar({
  currentIndex,
  totalCards,
}: FlashcardStudyProgressBarProps) {
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  return (
    <div className="mx-auto mb-md h-1.5 w-full max-w-4xl overflow-hidden rounded-full bg-outline-variant/25">
      <div
        className="h-full rounded-full bg-secondary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
