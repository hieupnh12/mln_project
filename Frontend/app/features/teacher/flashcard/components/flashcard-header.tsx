import { MaterialIcon } from "../../components/teacher-icons";

type FlashcardHeaderProps = {
  description: string;
  onBack?: () => void;
  onPrimaryAction: () => void;
  primaryActionIcon: string;
  primaryActionLabel: string;
  showBack?: boolean;
  title: string;
};

export function FlashcardHeader({
  description,
  onBack,
  onPrimaryAction,
  primaryActionIcon,
  primaryActionLabel,
  showBack = false,
  title,
}: FlashcardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-gray/50 text-landing-text transition hover:bg-landing-gray"
              onClick={onBack}
              title="Quay lại danh sách chương"
              type="button"
            >
              <MaterialIcon>arrow_back</MaterialIcon>
            </button>
          ) : null}
          <h1 className="text-headline-lg font-bold text-landing-text">{title}</h1>
        </div>
        <p className="mt-1 max-w-2xl text-body-md text-landing-text-soft">{description}</p>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98] sm:w-auto"
        onClick={onPrimaryAction}
        type="button"
      >
        <MaterialIcon>{primaryActionIcon}</MaterialIcon>
        <span className="text-label-md font-medium">{primaryActionLabel}</span>
      </button>
    </header>
  );
}
