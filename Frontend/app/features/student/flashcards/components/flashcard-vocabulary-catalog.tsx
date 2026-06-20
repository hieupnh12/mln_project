import { Star, Volume2 } from "lucide-react";
import type { MouseEvent } from "react";

import type { Flashcard } from "~/features/teacher/types/flashcard.types";

type FlashcardVocabularyCatalogProps = {
  cards: Flashcard[];
  masteredCardIds: Set<number>;
  masteredCount: number;
  onSpeak: (event: MouseEvent, text: string) => void;
  onToggleMaster: (cardId: number) => void;
};

export function FlashcardVocabularyCatalog({
  cards,
  masteredCardIds,
  masteredCount,
  onSpeak,
  onToggleMaster,
}: FlashcardVocabularyCatalogProps) {
  return (
    <section
      className="mt-xl w-full space-y-gutter rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-sm"
      id="catalog"
    >
      <div className="flex flex-col justify-between gap-2 border-b border-outline-variant/25 pb-md md:flex-row md:items-end">
        <div>
          <h3 className="font-serif text-headline-md font-bold text-landing-text">
            Từ vựng &amp; Khái niệm trong chương ({cards.length})
          </h3>
          <p className="mt-1 text-body-md text-landing-text-soft">
            Tra cứu nhanh toàn bộ danh sách câu hỏi học tập và định nghĩa.
          </p>
        </div>
        <span className="w-fit rounded-full bg-secondary-container/45 px-4 py-1.5 text-label-sm font-semibold text-secondary">
          Đã thuộc {masteredCount} thẻ
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {cards.map((card, index) => {
          const isMastered = masteredCardIds.has(card.id);

          return (
            <article
              className="grid grid-cols-1 items-center gap-4 rounded-xl border border-outline-variant/35 bg-landing-white p-4 transition hover:border-outline-variant/60 hover:shadow-md md:grid-cols-[60px_1.2fr_2fr_90px] md:p-6"
              key={card.id}
            >
              <span className="text-label-sm font-bold tracking-widest text-landing-text-soft/60">
                #{String(index + 1).padStart(2, "0")}
              </span>

              <div className="font-serif text-body-lg font-bold leading-snug tracking-wide text-landing-text md:pr-4">
                {card.term}
              </div>

              <div className="py-2 text-body-md leading-relaxed text-landing-text-soft md:border-l md:border-outline-variant/30 md:py-1 md:pl-6">
                {card.definition}
              </div>

              <div className="flex items-center justify-end gap-3 pr-1">
                <button
                  aria-label="Đọc thẻ"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text"
                  onClick={(event) => onSpeak(event, `${card.term}. ${card.definition}`)}
                  type="button"
                >
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  aria-label={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                  className={
                    isMastered
                      ? "flex h-9 w-9 items-center justify-center rounded-full text-landing-gold transition hover:bg-landing-gold/10"
                      : "flex h-9 w-9 items-center justify-center rounded-full text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-gold"
                  }
                  onClick={() => onToggleMaster(card.id)}
                  type="button"
                >
                  <Star aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
