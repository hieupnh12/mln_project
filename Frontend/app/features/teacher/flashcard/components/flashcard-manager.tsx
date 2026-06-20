import { useState } from "react";
import { useNavigate } from "react-router";

import { FlashcardFormDialog } from "../../components/flashcard-form-dialog";
import type { Flashcard, FlashcardSet } from "../../types/flashcard.types";
import {
  useCreateFlashcard,
  useDeleteFlashcard,
  useFlashcardsByChapter,
  useTeacherFlashcardSets,
  useUpdateFlashcard,
} from "../../hooks/use-flashcards";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";
import { FlashcardHeader } from "./flashcard-header";
import { FlashcardItemRow } from "./flashcard-item-row";
import { FlashcardSetCard } from "./flashcard-set-card";
import { FlashcardShell } from "./flashcard-shell";
import {
  FlashcardEmptyState,
  FlashcardErrorState,
  FlashcardLoadingState,
  FlashcardPanel,
} from "./flashcard-states";

export function FlashcardManager() {
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState(0);
  const [selectedChapterTitle, setSelectedChapterTitle] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const { data: flashcardSets, isLoading: isLoadingSets, isError: isErrorSets } =
    useTeacherFlashcardSets();
  const { data: flashcards, isLoading: isLoadingCards, isError: isErrorCards } =
    useFlashcardsByChapter(selectedChapterId, selectedChapterId > 0);

  const createMutation = useCreateFlashcard(selectedChapterId);
  const updateMutation = useUpdateFlashcard(selectedChapterId);
  const deleteMutation = useDeleteFlashcard(selectedChapterId);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openSet = (set: FlashcardSet) => {
    setSelectedChapterId(set.id);
    setSelectedChapterTitle(set.title);
  };

  const handleAddClick = () => {
    setSelectedCard(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (card: Flashcard) => {
    setSelectedCard(card);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: { term: string; definition: string }) => {
    try {
      if (selectedCard) {
        await updateMutation.mutateAsync({ id: selectedCard.id, request: formData });
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

  const handleDeleteCard = async (cardId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thẻ ghi nhớ này không?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(cardId);
      showSuccessToast("Đã xóa thẻ ghi nhớ thành công!");
    } catch {
      showErrorToast("Không thể xóa thẻ ghi nhớ. Vui lòng thử lại!");
    }
  };

  if (isLoadingSets) {
    return (
      <FlashcardShell>
        <FlashcardLoadingState label="Đang tải danh sách bộ thẻ..." />
      </FlashcardShell>
    );
  }

  if (isErrorSets) {
    return (
      <FlashcardShell>
        <FlashcardErrorState
          description="Đã xảy ra lỗi khi kết nối tới hệ thống. Vui lòng tải lại trang hoặc thử lại sau."
          title="Không thể tải dữ liệu"
        />
      </FlashcardShell>
    );
  }

  const hasNoSets = !flashcardSets || flashcardSets.length === 0;
  const isSetListView = selectedChapterId === 0;

  return (
    <FlashcardShell>
      <FlashcardHeader
        description={
          isSetListView
            ? "Tạo bộ thẻ ghi nhớ theo chương môn học và theo dõi nội dung ôn tập."
            : "Soạn thảo, cập nhật và thêm nhanh các thẻ ghi nhớ cho chương học."
        }
        onBack={() => setSelectedChapterId(0)}
        onPrimaryAction={
          isSetListView ? () => navigate("/teacher/flashcards/new") : handleAddClick
        }
        primaryActionIcon={isSetListView ? "add_circle" : "add"}
        primaryActionLabel={isSetListView ? "Tạo bộ thẻ" : "Thêm thẻ mới"}
        showBack={!isSetListView}
        title={isSetListView ? "Quản lý Flashcard" : `Bộ thẻ: ${selectedChapterTitle}`}
      />

      {isSetListView ? (
        hasNoSets ? (
          <FlashcardEmptyState
            actionLabel="Tạo bộ thẻ ngay"
            description="Hãy bắt đầu tạo những bộ thẻ đầu tiên để phục vụ cho học sinh ôn tập môn học."
            icon="style"
            onAction={() => navigate("/teacher/flashcards/new")}
            title="Chưa có chương nào được tạo bộ thẻ"
          />
        ) : (
          <section className="mt-6 grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
            {flashcardSets.map((set) => (
              <FlashcardSetCard key={set.id} onOpen={openSet} set={set} />
            ))}
          </section>
        )
      ) : (
        <FlashcardPanel title="Danh sách thẻ ghi nhớ hiện có">
          {isLoadingCards ? (
            <FlashcardLoadingState label="Đang tải danh sách thẻ..." />
          ) : isErrorCards ? (
            <FlashcardErrorState
              description="Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
              title="Không thể tải thẻ"
            />
          ) : !flashcards || flashcards.length === 0 ? (
            <FlashcardEmptyState
              actionLabel="Tạo thẻ đầu tiên"
              description="Hãy bắt đầu thêm những thẻ ghi nhớ đầu tiên cho bài học ôn tập."
              icon="style"
              onAction={handleAddClick}
              title="Bộ thẻ này trống"
            />
          ) : (
            <div className="space-y-3">
              {flashcards.map((card, index) => (
                <FlashcardItemRow
                  card={card}
                  index={index}
                  key={card.id}
                  onDelete={handleDeleteCard}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          )}
        </FlashcardPanel>
      )}

      <FlashcardFormDialog
        flashcard={selectedCard}
        isOpen={isFormOpen}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </FlashcardShell>
  );
}
