import { Brain, HelpCircle, Star, Volume2 } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

import type { Flashcard } from "~/features/teacher/types/flashcard.types";

type FlashcardFlipCardProps = {
  card: Flashcard;
  isFlipped: boolean;
  isMastered: boolean;
  onSpeak: (event: MouseEvent, text: string) => void;
  onToggleFlip: () => void;
  onToggleMaster: (cardId: number) => void;
};

const flipStyles = `
  .flashcard-perspective {
    perspective: 1200px;
  }
  .flashcard-inner {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flashcard-inner.is-flipped {
    transform: rotateX(180deg);
  }
  .flashcard-face {
    backface-visibility: hidden;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .flashcard-back {
    transform: rotateX(180deg);
  }
`;

export function FlashcardFlipCard({
  card,
  isFlipped,
  isMastered,
  onSpeak,
  onToggleFlip,
  onToggleMaster,
}: FlashcardFlipCardProps) {
  return (
    <>
      <style>{flipStyles}</style>

      <div
        className="flashcard-perspective mx-auto w-full max-w-4xl cursor-pointer"
        onClick={onToggleFlip}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggleFlip();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className={`flashcard-inner relative h-[min(62vh,560px)] w-full ${isFlipped ? "is-flipped" : ""}`}
        >
          <FlashcardFace
            actions={
              <>
                <FlashcardActionButton
                  label="Đọc thuật ngữ"
                  onClick={(event) => onSpeak(event, card.term)}
                >
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                </FlashcardActionButton>
                <FlashcardActionButton
                  active={isMastered}
                  label={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleMaster(card.id);
                  }}
                >
                  <Star aria-hidden="true" className="h-4 w-4" />
                </FlashcardActionButton>
              </>
            }
            hint="Nhấn chuột hoặc phím Space để lật"
            label="Thuật ngữ"
            labelIcon={<HelpCircle aria-hidden="true" className="h-4 w-4" />}
          >
            <h2 className="px-6 font-serif text-headline-lg font-bold leading-snug text-landing-text sm:text-[2rem]">
              {card.term}
            </h2>
          </FlashcardFace>

          <FlashcardFace
            actions={
              <>
                <FlashcardActionButton
                  label="Đọc định nghĩa"
                  onClick={(event) => onSpeak(event, card.definition)}
                >
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                </FlashcardActionButton>
                <FlashcardActionButton
                  active={isMastered}
                  label={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleMaster(card.id);
                  }}
                >
                  <Star aria-hidden="true" className="h-4 w-4" />
                </FlashcardActionButton>
              </>
            }
            back
            hint="Nhấn chuột để ẩn định nghĩa"
            label="Định nghĩa"
            labelIcon={<Brain aria-hidden="true" className="h-4 w-4 text-secondary" />}
          >
            <p className="max-h-[70%] overflow-y-auto px-8 text-body-lg font-medium leading-relaxed text-landing-text custom-scrollbar sm:text-[1.35rem]">
              {card.definition}
            </p>
          </FlashcardFace>
        </div>
      </div>
    </>
  );
}

type FlashcardFaceProps = {
  actions: ReactNode;
  back?: boolean;
  children: ReactNode;
  hint: string;
  label: string;
  labelIcon: ReactNode;
};

function FlashcardFace({
  actions,
  back = false,
  children,
  hint,
  label,
  labelIcon,
}: FlashcardFaceProps) {
  return (
    <div
      className={`flashcard-face ${back ? "flashcard-back" : ""} flex flex-col items-center justify-between rounded-xl border border-outline-variant/35 bg-landing-white p-gutter text-center shadow-xl shadow-landing-text/5`}
    >
      <div className="absolute right-4 top-4 flex items-center gap-2">{actions}</div>

      <span className="mt-10 flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-widest text-landing-text-soft">
        {labelIcon}
        {label}
      </span>

      <div className="my-auto flex w-full items-center justify-center">{children}</div>

      <p className="mb-2 text-label-sm text-landing-text-soft/70">{hint}</p>
    </div>
  );
}

type FlashcardActionButtonProps = {
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

function FlashcardActionButton({
  active = false,
  children,
  label,
  onClick,
}: FlashcardActionButtonProps) {
  return (
    <button
      aria-label={label}
      className={
        active
          ? "flex h-9 w-9 items-center justify-center rounded-full text-landing-gold transition hover:bg-landing-gold/10"
          : "flex h-9 w-9 items-center justify-center rounded-full text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
      }
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
