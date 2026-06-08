import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type CourseStructureModalOverlayProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  size?: "default" | "wide" | "compact";
  overlayClassName?: string;
  backdropBlur?: boolean;
  scrollable?: boolean;
};

export function CourseStructureModalOverlay({
  open,
  onClose,
  children,
  labelledBy,
  size = "default",
  overlayClassName = "bg-black/50",
  backdropBlur = true,
  scrollable = true,
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-md ${backdropBlur ? "backdrop-blur-sm" : ""} ${overlayClassName}`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`mx-auto w-full shrink-0 ${
          scrollable ? "max-h-[90vh] overflow-y-auto" : "overflow-hidden"
        } ${
          size === "wide"
            ? "max-w-[64rem]"
            : size === "compact"
              ? "max-w-[36rem]"
              : "max-w-[42rem]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
