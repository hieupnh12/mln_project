import { useEffect, type ReactNode } from "react";

type ModalOverlayProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  /** @deprecated Neutral backdrop is always used; kept for call-site compatibility. */
  glass?: boolean;
};

export function ModalOverlay({
  open,
  onClose,
  children,
  labelledBy,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div className="w-full max-w-[100vw]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
