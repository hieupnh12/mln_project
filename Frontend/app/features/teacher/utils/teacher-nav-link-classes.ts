type TeacherNavLinkState = {
  isActive: boolean;
  isPending: boolean;
};

type TeacherNavLinkVariant = "sidebar" | "sidebar-collapsed" | "mobile-bottom";

export function getTeacherNavLinkClassName(
  { isActive, isPending }: TeacherNavLinkState,
  variant: TeacherNavLinkVariant = "sidebar",
) {
  const highlighted = isActive || isPending;

  if (variant === "sidebar-collapsed") {
    return highlighted
      ? "flex w-full flex-col items-center gap-0.5 rounded-xl bg-landing-red/10 px-1 py-2 text-center font-semibold text-landing-red"
      : "flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text";
  }

  if (variant === "mobile-bottom") {
    return highlighted
      ? "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-landing-red/10 px-1 py-1.5 text-landing-red"
      : "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-landing-text-soft transition active:scale-95";
  }

  return highlighted
    ? "flex w-full items-center gap-md rounded-xl bg-landing-red/10 px-md py-sm text-left font-semibold text-landing-red"
    : "flex w-full items-center gap-md rounded-xl px-md py-sm text-left text-landing-text-soft transition hover:bg-landing-gray hover:text-landing-text";
}
