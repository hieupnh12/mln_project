import { ArrowRight, Layers3 } from "lucide-react";
import { useNavigate } from "react-router";

import type { FlashcardSet } from "~/features/teacher/types/flashcard.types";

import type { CourseChapterItem } from "../types/course-learning.types";

type CourseFlashcardCatalogProps = {
  chapters: CourseChapterItem[];
  flashcardSets: FlashcardSet[] | undefined;
  isLoading: boolean;
};

export function CourseFlashcardCatalog({
  chapters,
  flashcardSets,
  isLoading,
}: CourseFlashcardCatalogProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="h-56 animate-pulse rounded-xl border border-outline-variant/35 bg-landing-white"
            key={index}
          />
        ))}
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-white p-md text-center shadow-lg shadow-landing-text/5">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-container/55 text-secondary">
          <Layers3 aria-hidden="true" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-headline-md font-semibold text-landing-text">
          Chưa có thẻ ghi nhớ
        </h3>
        <p className="mt-2 max-w-md text-body-md text-landing-text-soft">
          Môn học này hiện chưa có chương học để hiển thị flashcard.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-md border-b border-outline-variant/30 pb-5">
        <p className="text-label-md font-semibold text-secondary">Ôn tập chủ động</p>
        <h2 className="mt-2 font-serif text-headline-lg font-semibold text-landing-text">
          Flashcard theo chương
        </h2>
        <p className="mt-2 text-body-md text-landing-text-soft">
          Ghi nhớ khái niệm trọng tâm bằng các bộ thẻ được sắp xếp theo lộ trình.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter) => {
          const matchedSet = flashcardSets?.find((set) => set.id === chapter.id);
          const cardsCount = matchedSet?.cards ?? 0;
          const isReady = cardsCount > 0;

          return (
            <article
              className="group relative flex min-h-60 flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5 transition duration-300 hover:-translate-y-1 hover:border-landing-gold/35 hover:shadow-xl"
              key={chapter.id}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-landing-gold to-secondary"
              />
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-landing-gold/30 bg-landing-gold/10 px-3 py-1 text-label-sm font-semibold text-landing-text-muted">
                    Chương {chapter.orderIndex}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-container/45 px-2.5 py-1 text-label-md font-semibold text-secondary">
                    <Layers3 aria-hidden="true" className="h-4 w-4" />
                    {cardsCount} thẻ
                  </span>
                </div>
                <h3 className="mt-5 line-clamp-2 min-h-14 text-headline-md font-semibold text-landing-text">
                  {chapter.title}
                </h3>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-outline-variant/25 pt-4">
                <span
                  className={
                    isReady
                      ? "inline-flex items-center gap-2 text-label-sm font-medium text-secondary"
                      : "inline-flex items-center gap-2 text-label-sm text-landing-text-soft"
                  }
                >
                  <span
                    className={
                      isReady
                        ? "h-2 w-2 rounded-full bg-secondary"
                        : "h-2 w-2 rounded-full bg-outline-variant"
                    }
                  />
                  {isReady ? "Đã sẵn sàng" : "Chưa có dữ liệu"}
                </span>

                <button
                  className={
                    isReady
                      ? "inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-label-md font-semibold text-on-secondary shadow-sm shadow-secondary/15 transition hover:bg-tertiary-container active:scale-95"
                      : "inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-landing-gray px-4 py-2 text-label-md font-semibold text-landing-text-soft"
                  }
                  disabled={!isReady}
                  onClick={() => navigate(`/student/chapters/${chapter.id}/flashcards`)}
                  type="button"
                >
                  Học ngay
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
