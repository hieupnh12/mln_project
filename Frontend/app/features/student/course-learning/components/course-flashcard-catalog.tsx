import { Layers3 } from "lucide-react";

import type { FlashcardSet } from "~/features/teacher/types/flashcard.types";

import type { CourseChapterItem } from "../types/course-learning.types";
import { CourseFlashcardCatalogCard } from "./course-flashcard-catalog-card";
import { CourseFlashcardCatalogIntro } from "./course-flashcard-catalog-intro";
import { CourseFlashcardCatalogSkeleton } from "./course-flashcard-catalog-skeleton";

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
  if (isLoading) {
    return (
      <div>
        <div className="mb-md h-14 animate-pulse rounded-xl border border-outline-variant/25 bg-landing-white" />
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
          <CourseFlashcardCatalogSkeleton />
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-outline-variant/35 bg-gradient-to-br from-landing-white via-landing-cream to-secondary-container/25 p-md text-center shadow-lg shadow-landing-text/5">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-secondary/15 bg-secondary-container/55 text-secondary shadow-sm shadow-secondary/10">
          <Layers3 aria-hidden="true" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-headline-md font-semibold text-landing-text">
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
      <CourseFlashcardCatalogIntro />

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter, index) => {
          const matchedSet = flashcardSets?.find((set) => set.id === chapter.id);
          const cardsCount = matchedSet?.cards ?? 0;

          return (
            <CourseFlashcardCatalogCard
              cardsCount={cardsCount}
              chapter={chapter}
              index={index}
              key={chapter.id}
            />
          );
        })}
      </div>
    </section>
  );
}
