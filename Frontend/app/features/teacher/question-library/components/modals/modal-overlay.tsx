import { useEffect, type ReactNode } from "react";

type ModalOverlayProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  glass?: boolean;
};

export function ModalOverlay({
  open,
  onClose,
  children,
  labelledBy,
  glass = false,
}: ModalOverlayProps) {
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

  return (
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className={
        glass
          ? "glass-overlay fixed inset-0 z-50 flex items-center justify-center bg-primary-container/40 p-4"
          : "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-margin-mobile backdrop-blur-sm md:p-gutter"
      }
      onClick={onClose}
      role="dialog"
    >
      <div className="max-h-[calc(100vh-48px)] w-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
