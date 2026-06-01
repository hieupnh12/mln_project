import { useEffect, useState } from "react";

import type { Flashcard } from "../types/flashcard.types";
import { MaterialIcon } from "./teacher-icons";

type FlashcardFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { term: string; definition: string }) => void;
  flashcard?: Flashcard | null;
  isSaving: boolean;
};

export function FlashcardFormDialog({
  isOpen,
  onClose,
  onSubmit,
  flashcard,
  isSaving,
}: FlashcardFormDialogProps) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (flashcard) {
      setTerm(flashcard.term);
      setDefinition(flashcard.definition);
    } else {
      setTerm("");
      setDefinition("");
    }
    setError("");
  }, [flashcard, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !definition.trim()) {
      setError("Vui lòng nhập đầy đủ Mặt trước và Mặt sau.");
      return;
    }
    onSubmit({ term: term.trim(), definition: definition.trim() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-2xl transition-all sm:p-8">
        <header className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h4 className="text-headline-md font-semibold text-primary">
            {flashcard ? "Chỉnh sửa thẻ ghi nhớ" : "Thêm thẻ ghi nhớ mới"}
          </h4>
          <button
            aria-label="Đóng"
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-variant/50"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-error-container p-3 text-label-md font-semibold text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-label-md font-semibold text-primary">
              Mặt trước (Thuật ngữ / Câu hỏi)
            </label>
            <textarea
              className="mt-2 min-h-20 w-full rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary focus:outline-none"
              disabled={isSaving}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Ví dụ: Triết học là gì?"
              rows={2}
              value={term}
            />
          </div>

          <div>
            <label className="block text-label-md font-semibold text-primary">
              Mặt sau (Định nghĩa / Câu trả lời)
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary focus:outline-none"
              disabled={isSaving}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Ví dụ: Hệ thống tri thức lý luận chung nhất..."
              rows={3}
              value={definition}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-outline-variant/20 pt-5">
            <button
              className="rounded-lg border border-outline-variant px-5 py-2.5 text-label-md font-semibold text-primary transition hover:bg-surface-variant/30"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="flex items-center gap-1 rounded-lg bg-primary px-6 py-2.5 text-label-md font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thẻ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
