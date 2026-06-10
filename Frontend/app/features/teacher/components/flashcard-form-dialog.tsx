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
      <div className="w-full max-w-4xl rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-2xl transition-all sm:p-8">
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

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-error-container p-3 text-label-md font-semibold text-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Side: Term */}
            <div className="space-y-sm">
              <div className="relative group">
                <textarea
                  className="w-full border-b-2 border-outline-variant py-md px-1 bg-transparent text-body-lg text-primary font-medium placeholder:text-on-surface-variant/30 focus:border-primary focus:outline-none transition-colors resize-none min-h-[120px]"
                  disabled={isSaving}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Nhập thuật ngữ / câu hỏi (Mặt trước)..."
                  rows={4}
                  value={term}
                />
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300" />
              </div>
              <label className="block text-label-sm font-bold text-on-surface-variant/70 uppercase tracking-wider pl-1">
                Thuật ngữ (Mặt trước)
              </label>
            </div>

            {/* Right Side: Definition */}
            <div className="space-y-sm">
              <div className="relative group">
                <textarea
                  className="w-full border-b-2 border-outline-variant py-md px-1 bg-transparent text-body-lg text-primary font-medium placeholder:text-on-surface-variant/30 focus:border-primary focus:outline-none transition-colors resize-none min-h-[120px]"
                  disabled={isSaving}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="Nhập định nghĩa / câu trả lời (Mặt sau)..."
                  rows={4}
                  value={definition}
                />
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300" />
              </div>
              <label className="block text-label-sm font-bold text-on-surface-variant/70 uppercase tracking-wider pl-1">
                Định nghĩa (Mặt sau)
              </label>
            </div>
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
