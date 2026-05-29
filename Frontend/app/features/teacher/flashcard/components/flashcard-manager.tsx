import { useState } from "react";
import { useNavigate } from "react-router";
import { MaterialIcon } from "../../components/teacher-icons";
import {
  useTeacherFlashcardSets,
  useFlashcardsByLesson,
  useCreateFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
} from "../../hooks/use-flashcards";
import type { Flashcard } from "../../types/flashcard.types";

export function FlashcardManager() {
  const navigate = useNavigate();

  // Selected state
  const [selectedLessonId, setSelectedLessonId] = useState<number>(0);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>("");

  // Editor state
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [termInput, setTermInput] = useState<string>("");
  const [definitionInput, setDefinitionInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch flashcard sets (lessons)
  const { data: flashcardSets, isLoading: isLoadingSets, isError: isErrorSets } = useTeacherFlashcardSets();

  // Fetch cards inside selected lesson
  const { data: flashcards, isLoading: isLoadingCards, isError: isErrorCards } = useFlashcardsByLesson(
    selectedLessonId,
    selectedLessonId > 0
  );

  // Mutations
  const createMutation = useCreateFlashcard(selectedLessonId);
  const updateMutation = useUpdateFlashcard(selectedLessonId);
  const deleteMutation = useDeleteFlashcard(selectedLessonId);

  // Reset Quick Editor
  const handleResetEditor = () => {
    setEditingCard(null);
    setTermInput("");
    setDefinitionInput("");
    setErrorMessage(null);
  };

  // Populate card details into Quick Editor
  const handleSelectEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setTermInput(card.term);
    setDefinitionInput(card.definition);
    setErrorMessage(null);
  };

  // Handle Save in Quick Editor
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const term = termInput.trim();
    const definition = definitionInput.trim();

    if (!term || !definition) {
      setErrorMessage("Vui lòng điền đầy đủ Thuật ngữ và Định nghĩa!");
      return;
    }

    try {
      if (editingCard) {
        // Edit Mode
        await updateMutation.mutateAsync({
          id: editingCard.id,
          request: { term, definition },
        });
      } else {
        // Add Mode
        await createMutation.mutateAsync({
          term,
          definition,
        });
      }
      handleResetEditor();
    } catch (err) {
      setErrorMessage("Không thể lưu thẻ ghi nhớ. Vui lòng thử lại!");
    }
  };

  // Handle Delete Card
  const handleDeleteCard = async (cardId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa thẻ ghi nhớ này không?")) {
      try {
        await deleteMutation.mutateAsync(cardId);
        if (editingCard && editingCard.id === cardId) {
          handleResetEditor();
        }
      } catch (err) {
        alert("Không thể xóa thẻ ghi nhớ. Vui lòng thử lại!");
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
            {selectedLessonId > 0 && (
              <button
                onClick={() => {
                  setSelectedLessonId(0);
                  handleResetEditor();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-all"
                title="Quay lại danh sách bộ thẻ"
                type="button"
              >
                <MaterialIcon>arrow_back</MaterialIcon>
              </button>
            )}
            <h3 className="text-headline-lg font-semibold text-primary">
              {selectedLessonId > 0 ? `Bộ thẻ: ${selectedLessonTitle}` : "Quản lý Flashcard"}
            </h3>
          </div>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            {selectedLessonId > 0
              ? "Soạn thảo chi tiết, cập nhật và thêm nhanh các thẻ ghi nhớ trực quan."
              : "Tạo bộ thẻ ghi nhớ, kiểm tra chất lượng nội dung và theo dõi độ chính xác của sinh viên."}
          </p>
        </div>
        
        {selectedLessonId === 0 && (
          <button
            onClick={() => navigate("/teacher/flashcards/new")}
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm sm:w-auto hover:bg-secondary-container/90 transition-all duration-200"
          >
            <MaterialIcon>add_circle</MaterialIcon>
            <span className="text-label-md font-medium">Tạo bộ thẻ</span>
          </button>
        )}
      </div>

      <div className="grid gap-gutter lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT COLUMN: Sets Grid or Selected Set Details */}
        <div className="min-w-0">
          {selectedLessonId === 0 ? (
            // GRID OF ALL SETS
            hasNoSets ? (
              <section className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/40 bg-white p-gutter text-center shadow-[0_4px_20px_rgba(35,39,51,0.02)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/80 mb-sm">
                  <MaterialIcon>style</MaterialIcon>
                </div>
                <h4 className="text-headline-sm font-semibold text-primary">Chưa có bộ thẻ ghi nhớ nào</h4>
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
                      setSelectedLessonId(set.id);
                      setSelectedLessonTitle(set.title);
                      handleResetEditor();
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
                      <div className="mb-2 flex justify-between text-label-sm font-semibold text-on-surface-variant">
                        <span>Độ chính xác</span>
                        <span>{set.accuracy}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-variant mb-4">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${set.accuracy}%` }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLessonId(set.id);
                          setSelectedLessonTitle(set.title);
                          handleResetEditor();
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
            // LIST OF CARDS INSIDE SELECTED LESSON
            <section className="space-y-md">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-headline-sm font-semibold text-primary">
                  Danh sách thẻ ghi nhớ hiện có
                </h4>
                <button
                  onClick={() => {
                    setSelectedLessonId(0);
                    handleResetEditor();
                  }}
                  className="text-label-md font-medium text-secondary hover:underline flex items-center gap-xs"
                >
                  <MaterialIcon>arrow_back</MaterialIcon>
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
                  <p className="text-body-sm text-on-surface-variant max-w-sm mt-xs">
                    Hãy soạn thảo và thêm nhanh thẻ ghi nhớ mới bằng bảng bên phải!
                  </p>
                </div>
              ) : (
                <div className="space-y-sm">
                  {flashcards.map((card, index) => {
                    const isBeingEdited = editingCard?.id === card.id;
                    
                    return (
                      <article
                        key={card.id}
                        className={`rounded-2xl border bg-white p-md shadow-[0_2px_12px_rgba(35,39,51,0.02)] hover:shadow-[0_4px_20px_rgba(35,39,51,0.05)] hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isBeingEdited ? "border-secondary/40 bg-secondary/5 ring-1 ring-secondary/20" : "border-outline-variant/30"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-md mb-2">
                            <span className="text-label-sm font-bold text-secondary">
                              THẺ {index + 1}
                            </span>
                            {isBeingEdited && (
                              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                                Đang chỉnh sửa
                              </span>
                            )}
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

                        <div className="flex items-center gap-sm shrink-0 border-t border-outline-variant/10 pt-3 md:border-t-0 md:pt-0 justify-end">
                          <button
                            onClick={() => handleSelectEditCard(card)}
                            className="flex items-center gap-xs rounded-lg border border-outline-variant px-3 py-1.5 text-label-md font-medium text-primary hover:bg-surface-container-low transition-colors"
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
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Editor Sidebar */}
        <aside className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-sm mb-md">
            <h4 className="text-headline-md font-semibold text-primary">
              {selectedLessonId === 0
                ? "Trình soạn nhanh"
                : editingCard
                  ? "Chỉnh sửa thẻ"
                  : "Thêm nhanh thẻ mới"}
            </h4>
            {editingCard && (
              <button
                onClick={handleResetEditor}
                className="text-label-sm font-semibold text-secondary hover:underline"
                type="button"
              >
                Hủy sửa
              </button>
            )}
          </div>

          {selectedLessonId === 0 ? (
            // INACTIVE STATE (No set selected)
            <div className="py-8 text-center space-y-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/40 mx-auto">
                <MaterialIcon>style</MaterialIcon>
              </div>
              <p className="text-body-sm text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
                Vui lòng **chọn một bộ thẻ** bên trái để bắt đầu thêm nhanh hoặc chỉnh sửa các thẻ ghi nhớ!
              </p>
            </div>
          ) : (
            // ACTIVE STATE (Set selected)
            <form onSubmit={handleSaveCard} className="space-y-md">
              {errorMessage && (
                <div className="flex items-start gap-xs rounded-lg bg-error-container p-sm text-on-error-container text-label-sm font-medium border border-error/10">
                  <MaterialIcon className="text-error text-sm mt-0.5">error</MaterialIcon>
                  <span>{errorMessage}</span>
                </div>
              )}

              <label className="block">
                <span className="text-label-md font-medium text-on-surface-variant pl-0.5">
                  Mặt trước (Thuật ngữ)
                </span>
                <textarea
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  placeholder="Nhập thuật ngữ hoặc câu hỏi..."
                  className="mt-2 min-h-24 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-primary font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="text-label-md font-medium text-on-surface-variant pl-0.5">
                  Mặt sau (Định nghĩa)
                </span>
                <textarea
                  value={definitionInput}
                  onChange={(e) => setDefinitionInput(e.target.value)}
                  placeholder="Nhập định nghĩa hoặc câu trả lời..."
                  className="mt-2 min-h-28 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-primary font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  required
                />
              </label>

              <div className="mt-md grid grid-cols-2 gap-sm pt-2">
                <button
                  type="button"
                  onClick={handleResetEditor}
                  className="rounded-lg border border-outline-variant px-4 py-2 text-label-md font-medium text-primary hover:bg-surface-container-low transition-colors"
                >
                  Xóa trống
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-white hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-xs disabled:opacity-60"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <MaterialIcon className="text-sm">done</MaterialIcon>
                  )}
                  <span>{editingCard ? "Cập nhật" : "Lưu thẻ"}</span>
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
