import { MaterialIcon } from "../../components/teacher-icons";
import type { FlashcardSet } from "../../types/flashcard.types";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";

type FlashcardSetCardProps = {
  onOpen: (set: FlashcardSet) => void;
  set: FlashcardSet;
};

export function FlashcardSetCard({ onOpen, set }: FlashcardSetCardProps) {
  const isPublished = set.status === "Đã xuất bản";

  return (
    <article
      className={`flex cursor-pointer flex-col justify-between rounded-2xl border border-outline-variant/25 bg-landing-white p-gutter transition duration-300 hover:-translate-y-0.5 hover:border-outline-variant/45 ${TEACHER_PORTAL_ROW_SHADOW}`}
      onClick={() => onOpen(set)}
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
            <MaterialIcon>style</MaterialIcon>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-label-sm font-semibold ${
              isPublished
                ? "bg-catalog-cobalt/10 text-catalog-cobalt"
                : "bg-landing-gray text-landing-text-soft"
            }`}
          >
            {set.status}
          </span>
        </div>
        <h3 className="line-clamp-2 text-headline-md font-semibold text-landing-text">{set.title}</h3>
        <p className="mt-2 text-body-md text-landing-text-soft">{set.cards} thẻ đang quản lý</p>
      </div>

      <div className="mt-5 border-t border-outline-variant/15 pt-3">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red py-2 text-label-md font-medium text-on-primary transition hover:bg-landing-red-deep"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(set);
          }}
          type="button"
        >
          <MaterialIcon>edit</MaterialIcon>
          <span>Soạn thẻ chi tiết</span>
        </button>
      </div>
    </article>
  );
}
