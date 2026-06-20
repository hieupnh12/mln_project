import { MaterialIcon } from "../../components/teacher-icons";
import type { Flashcard } from "../../types/flashcard.types";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";

type FlashcardItemRowProps = {
  card: Flashcard;
  index: number;
  onDelete: (cardId: number) => void;
  onEdit: (card: Flashcard) => void;
};

export function FlashcardItemRow({ card, index, onDelete, onEdit }: FlashcardItemRowProps) {
  return (
    <article
      className={`group flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-md md:flex-row md:items-center ${TEACHER_PORTAL_ROW_SHADOW}`}
    >
      <div className="min-w-0 flex-1">
        <span className="text-label-sm font-semibold text-landing-text-muted">THẺ {index + 1}</span>

        <div className="mt-2 grid gap-sm md:grid-cols-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-landing-text-soft">
              Mặt trước (Thuật ngữ)
            </span>
            <p className="truncate pr-2 text-body-md font-semibold text-landing-text">{card.term}</p>
          </div>
          <div className="border-t border-outline-variant/15 pt-2 md:border-t-0 md:pt-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-landing-text-soft">
              Mặt sau (Định nghĩa)
            </span>
            <p className="pr-2 text-body-md text-landing-text-soft">{card.definition}</p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-outline-variant/15 pt-3 md:border-t-0 md:pt-0">
        <button
          className="flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-landing-white px-3 py-1.5 text-label-md font-medium text-landing-text transition hover:bg-landing-gray/60"
          onClick={() => onEdit(card)}
          type="button"
        >
          <MaterialIcon className="text-sm">edit</MaterialIcon>
          <span>Sửa</span>
        </button>
        <button
          className="flex items-center gap-1 rounded-xl border border-error/20 bg-landing-white px-3 py-1.5 text-label-md font-medium text-error transition hover:bg-error-container/30"
          onClick={() => onDelete(card.id)}
          type="button"
        >
          <MaterialIcon className="text-sm">delete_outline</MaterialIcon>
          <span>Xóa</span>
        </button>
      </div>
    </article>
  );
}
