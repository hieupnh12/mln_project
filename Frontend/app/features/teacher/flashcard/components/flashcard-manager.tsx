import { useState } from "react";
import { useNavigate } from "react-router";

import { FlashcardFormDialog } from "../../components/flashcard-form-dialog";
import { MaterialIcon } from "../../components/teacher-icons";
import {
  useTeacherFlashcardSets,
  useFlashcardsByChapter,
  useCreateFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
} from "../../hooks/use-flashcards";
import type { Flashcard } from "../../types/flashcard.types";
import { showSuccessToast, showErrorToast } from "~/shared/utils/toast";

export function FlashcardManager() {
  const navigate = useNavigate();

  // Selected state
  const [selectedChapterId, setSelectedChapterId] = useState<number>(0);
  const [selectedChapterTitle, setSelectedChapterTitle] = useState<string>("");

  // Form dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  // Fetch flashcard sets (chapters)
  const { data: flashcardSets, isLoading: isLoadingSets, isError: isErrorSets } = useTeacherFlashcardSets();

  // Fetch cards inside selected chapter
  const { data: flashcards, isLoading: isLoadingCards, isError: isErrorCards } = useFlashcardsByChapter(
    selectedChapterId,
    selectedChapterId > 0
  );

  // Mutations
  const createMutation = useCreateFlashcard(selectedChapterId);
  const updateMutation = useUpdateFlashcard(selectedChapterId);
  const deleteMutation = useDeleteFlashcard(selectedChapterId);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Handle Add Card
  const handleAddClick = () => {
    setSelectedCard(null);
    setIsFormOpen(true);
  };

  // Handle Edit Card
  const handleEditClick = (card: Flashcard) => {
    setSelectedCard(card);
    setIsFormOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (formData: { term: string; definition: string }) => {
    try {
      if (selectedCard) {
        await updateMutation.mutateAsync({
          id: selectedCard.id,
          request: formData,
        });
        showSuccessToast("Đã cập nhật thẻ ghi nhớ thành công!");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccessToast("Đã thêm thẻ ghi nhớ mới thành công!");
      }
      setIsFormOpen(false);
    } catch {
      showErrorToast("Lưu thẻ ghi nhớ thất bại. Vui lòng thử lại!");
    }
  };

  // Handle Delete Card
  const handleDeleteCard = async (cardId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ ghi nhớ này không?")) {
      try {
        await deleteMutation.mutateAsync(cardId);
        showSuccessToast("Đã xóa thẻ ghi nhớ thành công!");
      } catch {
        showErrorToast("Không thể xóa thẻ ghi nhớ. Vui lòng thử lại!");
      }
    }
  };

  // Render Set list loading
  if (isLoadingSets) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-body-md font-medium text-on-surface-variant">
          Đang tải danh sách bộ thẻ...
        </p>
      </div>
    );
  }

  // Render Set list error
  if (isErrorSets) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
          <MaterialIcon>error_outline</MaterialIcon>
        </div>
        <div className="space-y-xs">
          <h4 className="text-headline-sm font-semibold text-primary">Không thể tải dữ liệu</h4>
          <p className="text-body-sm text-on-surface-variant max-w-sm">
            Đã xảy ra lỗi khi kết nối tới hệ thống. Vui lòng tải lại trang hoặc thử lại sau!
          </p>
        </div>
      </div>
    );
  }

  const hasNoSets = !flashcardSets || flashcardSets.length === 0;

  return (
    <div className="mx-auto max-w-6xl pb-12">
      {/* Top dashboard action bar */}
      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-outline-variant/20 pb-md">
        <div className="space-y-xs">
          <div className="flex items-center gap-2">
            {selectedChapterId > 0 && (
              <button
                onClick={() => setSelectedChapterId(0)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-all"
                title="Quay lại danh sách chương"
                type="button"
              >
                <MaterialIcon>arrow_back</MaterialIcon>
              </button>
            )}
            <h3 className="text-headline-lg font-semibold text-primary">
              {selectedChapterId > 0 ? `Bộ thẻ: ${selectedChapterTitle}` : "Quản lý Flashcard"}
            </h3>
          </div>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            {selectedChapterId > 0
              ? "Soạn thảo chi tiết, cập nhật và thêm nhanh các thẻ ghi nhớ trực quan cho chương học."
              : "Tạo bộ thẻ ghi nhớ theo chương môn học, kiểm tra chất lượng nội dung và theo dõi độ chính xác của sinh viên."}
          </p>
        </div>
        
        {selectedChapterId === 0 ? (
          <button
            onClick={() => navigate("/teacher/flashcards/new")}
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm sm:w-auto hover:bg-secondary-container/90 transition-all duration-200"
          >
            <MaterialIcon>add_circle</MaterialIcon>
            <span className="text-label-md font-medium">Tạo bộ thẻ</span>
          </button>
        ) : (
          <button
            onClick={handleAddClick}
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-white shadow-sm sm:w-auto hover:bg-primary/90 active:scale-95 transition-all duration-200"
            type="button"
          >
            <MaterialIcon>add</MaterialIcon>
            <span className="text-label-md font-medium">Thêm thẻ mới</span>
          </button>
        )}
      </div>

      <div>
        {/* LEFT COLUMN: Sets Grid or Selected Set Details */}
        <div>
          {selectedChapterId === 0 ? (
            // GRID OF ALL SETS
            hasNoSets ? (
              <section className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/40 bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.02)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/80 mb-sm">
                  <MaterialIcon>style</MaterialIcon>
                </div>
                <h4 className="text-headline-sm font-semibold text-primary">Chưa có chương nào được tạo bộ thẻ</h4>
                <p className="text-body-sm text-on-surface-variant max-w-sm mt-xs mb-md">
                  Hãy bắt đầu tạo những bộ thẻ đầu tiên để phục vụ cho học sinh ôn tập môn học!
                </p>
                <button
                  onClick={() => navigate("/teacher/flashcards/new")}
                  className="flex items-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-white shadow-sm hover:bg-primary/95 transition-all text-label-md animate-bounce"
                >
                  <MaterialIcon>add</MaterialIcon>
                  <span>Tạo bộ thẻ ngay</span>
                </button>
              </section>
            ) : (
              <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
                {flashcardSets.map((set) => (
                  <article
                    className="rounded-2xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)] hover:shadow-[0_8px_30px_rgba(35,39,51,0.06)] hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    key={set.id}
                    onClick={() => {
                      setSelectedChapterId(set.id);
                      setSelectedChapterTitle(set.title);
                    }}
                  >
                    <div>
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                          <MaterialIcon>style</MaterialIcon>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-label-sm font-semibold ${
                          set.status === "Đã xuất bản" 
                            ? "bg-secondary-container/30 text-secondary" 
                            : "bg-surface-container-low text-on-surface-variant"
                        }`}>
                          {set.status}
                        </span>
                      </div>
                      <h4 className="text-headline-md font-semibold text-primary line-clamp-2">
                        {set.title}
                      </h4>
                      <p className="mt-2 text-body-md text-on-surface-variant">
                        {set.cards} thẻ đang quản lý
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-outline-variant/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChapterId(set.id);
                          setSelectedChapterTitle(set.title);
                        }}
                        className="w-full flex items-center justify-center gap-sm rounded-lg bg-primary py-2 text-label-md font-medium text-white hover:bg-primary/95 transition-all"
                      >
                        <MaterialIcon>edit</MaterialIcon>
                        <span>Soạn thẻ chi tiết</span>
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            )
          ) : (
            // LIST OF CARDS INSIDE SELECTED CHAPTER
            <section className="space-y-md">
              <div className="flex items-center justify-between gap-4 px-1 flex-wrap">
                <h4 className="text-headline-sm font-semibold text-primary">
                  Danh sách thẻ ghi nhớ hiện có
                </h4>
                <button
                  onClick={() => setSelectedChapterId(0)}
                  className="flex items-center gap-xs rounded-lg border border-outline-variant px-3 py-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <MaterialIcon className="text-sm">arrow_back</MaterialIcon>
                  <span>Quay lại</span>
                </button>
              </div>

              {isLoadingCards ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-outline-variant/20 shadow-sm">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <p className="text-body-md font-medium text-on-surface-variant">
                    Đang tải danh sách thẻ...
                  </p>
                </div>
              ) : isErrorCards ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 text-center bg-white rounded-2xl border border-outline-variant/20 shadow-sm">
                  <MaterialIcon className="text-error text-4xl">error_outline</MaterialIcon>
                  <p className="text-body-md font-medium text-primary">Không thể kết nối đến máy chủ</p>
                </div>
              ) : !flashcards || flashcards.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/40 bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.02)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/80 mb-sm">
                    <MaterialIcon>style</MaterialIcon>
                  </div>
                  <h4 className="text-headline-sm font-semibold text-primary">Bộ thẻ này trống</h4>
                  <p className="text-body-sm text-on-surface-variant max-w-sm mt-xs mb-md">
                    Hãy bắt đầu thêm những thẻ ghi nhớ đầu tiên cho bài học ôn tập!
                  </p>
                  <button
                    onClick={handleAddClick}
                    className="flex items-center gap-sm rounded-lg bg-primary px-md py-sm font-semibold text-white shadow-sm hover:bg-primary/95 active:scale-95 transition-all text-label-md"
                    type="button"
                  >
                    <MaterialIcon>add</MaterialIcon>
                    <span>Tạo thẻ đầu tiên</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-sm">
                  {flashcards.map((card, index) => (
                    <article
                      key={card.id}
                      className="group rounded-2xl border border-outline-variant/30 bg-white p-md shadow-[0_2px_12px_rgba(35,39,51,0.02)] hover:shadow-[0_4px_20px_rgba(35,39,51,0.05)] hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className="text-label-sm font-bold text-secondary">
                            THẺ {index + 1}
                          </span>
                        </div>
                        
                        <div className="grid gap-sm md:grid-cols-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-wider">Mặt trước (Thuật ngữ)</span>
                            <p className="text-body-md font-semibold text-primary truncate pr-2">{card.term}</p>
                          </div>
                          <div className="border-t border-outline-variant/10 pt-2 md:border-t-0 md:pt-0">
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-wider">Mặt sau (Định nghĩa)</span>
                            <p className="text-body-md text-on-surface-variant pr-2">{card.definition}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 border-t border-outline-variant/10 pt-3 md:border-t-0 md:pt-0 justify-end">
                        <button
                          onClick={() => handleEditClick(card)}
                          className="flex items-center gap-xs rounded-lg border border-primary/20 px-3 py-1.5 text-label-md font-medium text-primary hover:bg-primary/5 transition-colors"
                          type="button"
                        >
                          <MaterialIcon className="text-sm">edit</MaterialIcon>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="flex items-center gap-xs rounded-lg border border-error/20 px-3 py-1.5 text-label-md font-medium text-error hover:bg-error-container/30 transition-colors"
                          type="button"
                        >
                          <MaterialIcon className="text-sm">delete_outline</MaterialIcon>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Form Dialog for Add/Edit Card */}
      <FlashcardFormDialog
        flashcard={selectedCard}
        isOpen={isFormOpen}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
