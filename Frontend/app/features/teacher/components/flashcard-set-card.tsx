import type { FlashcardSet } from "../types/flashcard.types";
import { MaterialIcon } from "./teacher-icons";

type FlashcardSetCardProps = {
  set: FlashcardSet;
  onManage: (setId: number) => void;
};

export function FlashcardSetCard({ set, onManage }: FlashcardSetCardProps) {
  const isDraft = set.status === "Bản nháp";

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
            <MaterialIcon>style</MaterialIcon>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-label-sm font-semibold ${
              isDraft
                ? "bg-surface-container-low text-on-surface-variant"
                : "bg-secondary-container text-on-secondary-container"
            }`}
          >
            {set.status}
          </span>
        </div>
        <h4 className="text-headline-md font-semibold text-primary">
          {set.title}
        </h4>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {set.cards} thẻ đang quản lý
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-label-sm font-semibold text-on-surface-variant">
            <span>Độ chính xác trung bình</span>
            <span>{set.accuracy}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-variant">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${set.accuracy}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 rounded-lg bg-primary py-2.5 text-label-md font-medium text-white transition hover:opacity-90 active:scale-95"
            onClick={() => onManage(set.id)}
            type="button"
          >
            Soạn thẻ
          </button>
        </div>
      </div>
    </article>
  );
}
