import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type CourseStructureModalOverlayProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  size?: "default" | "wide";
};

export function CourseStructureModalOverlay({
  open,
  onClose,
  children,
  labelledBy,
  size = "default",
}: CourseStructureModalOverlayProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`mx-auto w-full max-h-[90vh] overflow-y-auto ${
          size === "wide" ? "max-w-5xl" : "max-w-2xl"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
