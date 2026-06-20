import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";

type FlashcardEmptyStateProps = {
  actionIcon?: string;
  actionLabel?: string;
  description: string;
  icon: string;
  onAction?: () => void;
  title: string;
};

export function FlashcardEmptyState({
  actionIcon = "add",
  actionLabel,
  description,
  icon,
  onAction,
  title,
}: FlashcardEmptyStateProps) {
  return (
    <section className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/20 p-gutter text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/15 text-primary">
        <MaterialIcon>{icon}</MaterialIcon>
      </div>
      <h4 className="text-headline-sm font-semibold text-landing-text">{title}</h4>
      <p className="mt-1 max-w-sm text-body-sm text-landing-text-soft">{description}</p>
      {onAction && actionLabel ? (
        <button
          className="mt-md flex items-center gap-2 rounded-xl bg-landing-red px-md py-sm text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/15 transition hover:bg-landing-red-deep"
          onClick={onAction}
          type="button"
        >
          <MaterialIcon>{actionIcon}</MaterialIcon>
          <span>{actionLabel}</span>
        </button>
      ) : null}
    </section>
  );
}

type FlashcardLoadingStateProps = {
  label: string;
};

export function FlashcardLoadingState({ label }: FlashcardLoadingStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl bg-landing-gray/25">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant/30 border-t-primary" />
      <p className="text-body-md font-medium text-landing-text-soft">{label}</p>
    </div>
  );
}

type FlashcardErrorStateProps = {
  description: string;
  title: string;
};

export function FlashcardErrorState({ description, title }: FlashcardErrorStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border border-error/25 bg-error-container/20 p-gutter text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
        <MaterialIcon>error_outline</MaterialIcon>
      </div>
      <div className="space-y-1">
        <h4 className="text-headline-sm font-semibold text-landing-text">{title}</h4>
        <p className="max-w-sm text-body-sm text-landing-text-soft">{description}</p>
      </div>
    </div>
  );
}

type FlashcardPanelProps = {
  children: ReactNode;
  title: string;
};

export function FlashcardPanel({ children, title }: FlashcardPanelProps) {
  return (
    <section className="space-y-md">
      <h2 className="px-1 text-headline-sm font-semibold text-landing-text">{title}</h2>
      {children}
    </section>
  );
}
