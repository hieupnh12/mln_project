import { useState } from "react";

import {
  useCreateFlashcard,
  useDeleteFlashcard,
  useFlashcardsByLesson,
  useUpdateFlashcard,
} from "../hooks/use-flashcards";
import type { Flashcard, FlashcardSet } from "../types/flashcard.types";
import { FlashcardFormDialog } from "./flashcard-form-dialog";
import { MaterialIcon } from "./teacher-icons";

type FlashcardListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  set: FlashcardSet | null;
};

export function FlashcardListDialog({
  isOpen,
  onClose,
  set,
}: FlashcardListDialogProps) {
  const lessonId = set?.id ?? 0;

  // React Query hooks for API integrations
  const {
    data: flashcards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFlashcardsByLesson(lessonId, isOpen);

  const createMutation = useCreateFlashcard(lessonId);
  const updateMutation = useUpdateFlashcard(lessonId);
  const deleteMutation = useDeleteFlashcard(lessonId);

  // States for nested Form Dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  if (!isOpen || !set) {
    return null;
  }

  const handleAddClick = () => {
    setSelectedCard(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (card: Flashcard) => {
    setSelectedCard(card);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (cardId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ ghi nhớ này không?")) {
      try {
        await deleteMutation.mutateAsync(cardId);
      } catch (err) {
        console.error("Xóa thẻ thất bại:", err);
      }
    }
  };

  const handleFormSubmit = async (formData: {
    term: string;
    definition: string;
  }) => {
    try {
      if (selectedCard) {
        // Edit flow
        await updateMutation.mutateAsync({
          id: selectedCard.id,
          request: formData,
        });
      } else {
        // Create flow
        await createMutation.mutateAsync(formData);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Lưu thẻ thất bại:", err);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-outline-variant/30 bg-white shadow-2xl transition-all">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-outline-variant/20 p-6">
          <div className="min-w-0">
            <h4 className="truncate text-headline-md font-semibold text-primary">
              Soạn thẻ: {set.title}
            </h4>
            <p className="mt-1 text-sm text-on-surface-variant">
              Bài học liên kết: {set.title} • {flashcards.length} thẻ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-white transition hover:opacity-90 active:scale-95"
              onClick={handleAddClick}
              type="button"
            >
              <MaterialIcon>add</MaterialIcon>
              Thêm thẻ mới
            </button>
            <button
              aria-label="Đóng"
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-variant/50"
              onClick={onClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
              <p className="text-body-md text-on-surface-variant">
                Đang tải danh sách thẻ...
              </p>
            </div>
          ) : isError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <MaterialIcon className="text-4xl text-error">error</MaterialIcon>
              <div className="space-y-1">
                <p className="font-semibold text-primary">Lỗi tải dữ liệu</p>
                <p className="text-sm text-on-surface-variant max-w-sm">
                  {error instanceof Error ? error.message : "Có lỗi xảy ra khi tải thẻ."}
                </p>
              </div>
              <button
                className="rounded-lg bg-secondary-container px-4 py-2 text-label-md font-medium text-primary shadow-sm hover:shadow active:scale-95"
                onClick={() => refetch()}
                type="button"
              >
                Thử lại
              </button>
            </div>
          ) : flashcards.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container/50 text-secondary">
                <MaterialIcon className="text-4xl">style</MaterialIcon>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-primary">Không có thẻ nào</p>
                <p className="text-sm text-on-surface-variant">
                  Chưa có thẻ ghi nhớ nào được tạo cho bài học này.
                </p>
              </div>
              <button
                className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-white transition hover:opacity-90 active:scale-95"
                onClick={handleAddClick}
                type="button"
              >
                <MaterialIcon>add</MaterialIcon>
                Tạo thẻ đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {flashcards.map((card, index) => (
                <article
                  className="group relative flex flex-col justify-between rounded-xl border border-outline-variant/30 bg-white p-5 shadow-[0_4px_20px_rgba(35,39,51,0.02)] transition-all hover:border-outline"
                  key={card.id}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-label-sm font-semibold text-secondary bg-secondary-container/30 px-2.5 py-0.5 rounded-full">
                        Thẻ {index + 1}
                      </span>
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          aria-label="Chỉnh sửa"
                          className="rounded p-1 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
                          onClick={() => handleEditClick(card)}
                          type="button"
                        >
                          <MaterialIcon className="text-lg">edit</MaterialIcon>
                        </button>
                        <button
                          aria-label="Xóa"
                          className="rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-error"
                          onClick={() => handleDeleteClick(card.id)}
                          type="button"
                        >
                          <MaterialIcon className="text-lg">delete</MaterialIcon>
                        </button>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                        Mặt trước (Thuật ngữ)
                      </h5>
                      <p className="mt-1 font-semibold text-primary text-body-md line-clamp-2">
                        {card.term}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/10">
                      <h5 className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                        Mặt sau (Định nghĩa)
                      </h5>
                      <p className="mt-1 text-body-md text-on-surface line-clamp-3">
                        {card.definition}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-end border-t border-outline-variant/20 p-6">
          <button
            className="rounded-lg border border-outline px-6 py-2.5 text-label-md font-semibold text-primary transition hover:bg-surface-variant/30"
            onClick={onClose}
            type="button"
          >
            Đóng
          </button>
        </footer>

        {/* Nested Form Dialog */}
        <FlashcardFormDialog
          flashcard={selectedCard}
          isOpen={isFormOpen}
          isSaving={isSaving}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}
