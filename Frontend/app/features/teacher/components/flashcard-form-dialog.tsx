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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!term.trim() || !definition.trim()) {
      setError("Vui lòng nhập đầy đủ Mặt trước và Mặt sau.");
      return;
    }
    onSubmit({ term: term.trim(), definition: definition.trim() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-landing-text/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-outline-variant/25 bg-landing-white p-6 shadow-2xl sm:p-8">
        <header className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h4 className="text-headline-md font-semibold text-landing-text">
            {flashcard ? "Chỉnh sửa thẻ ghi nhớ" : "Thêm thẻ ghi nhớ mới"}
          </h4>
          <button
            aria-label="Đóng"
            className="rounded-full p-1 text-landing-text-soft transition hover:bg-landing-gray/70"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </header>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-lg bg-error-container p-3 text-label-md font-semibold text-error">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-sm">
              <div className="group relative">
                <textarea
                  className="min-h-[120px] w-full resize-none border-b-2 border-outline-variant/40 bg-transparent px-1 py-md text-body-lg font-medium text-landing-text placeholder:text-landing-text-soft/50 focus:border-primary focus:outline-none"
                  disabled={isSaving}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Nhập thuật ngữ / câu hỏi (Mặt trước)..."
                  rows={4}
                  value={term}
                />
              </div>
              <label className="block pl-1 text-label-sm font-bold uppercase tracking-wider text-landing-text-soft">
                Thuật ngữ (Mặt trước)
              </label>
            </div>

            <div className="space-y-sm">
              <div className="group relative">
                <textarea
                  className="min-h-[120px] w-full resize-none border-b-2 border-outline-variant/40 bg-transparent px-1 py-md text-body-lg font-medium text-landing-text placeholder:text-landing-text-soft/50 focus:border-primary focus:outline-none"
                  disabled={isSaving}
                  onChange={(event) => setDefinition(event.target.value)}
                  placeholder="Nhập định nghĩa / câu trả lời (Mặt sau)..."
                  rows={4}
                  value={definition}
                />
              </div>
              <label className="block pl-1 text-label-sm font-bold uppercase tracking-wider text-landing-text-soft">
                Định nghĩa (Mặt sau)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-outline-variant/20 pt-5">
            <button
              className="rounded-xl border border-outline-variant/40 bg-landing-white px-5 py-2.5 text-label-md font-semibold text-landing-text transition hover:bg-landing-gray/60"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="flex items-center gap-1 rounded-xl bg-landing-red px-6 py-2.5 text-label-md font-semibold text-on-primary transition hover:bg-landing-red-deep active:scale-95 disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
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
