type CourseSlideStageProps = {
  alt: string;
  imageUrl: string;
  displayedImageUrl: string | null;
  isSlideLoading: boolean;
  onImageLoad: () => void;
  onImageError: () => void;
};

export function CourseSlideStage({
  alt,
  imageUrl,
  displayedImageUrl,
  isSlideLoading,
  onImageLoad,
  onImageError,
}: CourseSlideStageProps) {
  const isWaitingForNextSlide =
    isSlideLoading && displayedImageUrl != null && displayedImageUrl !== imageUrl;
  const isInitialLoad = isSlideLoading && displayedImageUrl == null;

  return (
    <>
      {displayedImageUrl ? (
        <img
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          src={displayedImageUrl}
        />
      ) : null}

      <img
        alt=""
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        onError={onImageError}
        onLoad={onImageLoad}
        src={imageUrl}
      />

      {isWaitingForNextSlide ? (
        <div
          aria-busy="true"
          aria-live="polite"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/10"
        >
          <div className="rounded-full bg-white/90 p-3 shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant/40 border-t-secondary" />
          </div>
        </div>
      ) : null}

      {isInitialLoad ? (
        <div
          aria-busy="true"
          aria-live="polite"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface-container-low"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant/40 border-t-secondary" />
          <p className="text-label-sm font-medium text-on-surface-variant">Đang tải slide...</p>
        </div>
      ) : null}
    </>
  );
}
