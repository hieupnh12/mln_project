import { useState } from "react";
import { useNavigate } from "react-router";
import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherFlashcardSets, useCreateFlashcardsBulk } from "../../hooks/use-flashcards";

type CardItem = {
  id: string; // client-side temp unique ID
  term: string;
  definition: string;
};

export function CreateFlashcardForm() {
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<number>(0);
  const [cards, setCards] = useState<CardItem[]>([
    { id: "1", term: "", definition: "" },
    { id: "2", term: "", definition: "" },
    { id: "3", term: "", definition: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch dynamic chapters for the dropdown
  const { data: chapters, isLoading: isLoadingChapters } = useTeacherFlashcardSets();

  // Mutation for bulk creation
  const createBulkMutation = useCreateFlashcardsBulk(selectedChapterId);

  // Generate unique ID for new local cards
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add new blank card to list
  const handleAddCard = () => {
    setCards((prev) => [...prev, { id: generateId(), term: "", definition: "" }]);
    // Scroll to bottom smoothly after state update
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  // Delete card from list
  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Handle input changes
  const handleInputChange = (id: string, field: "term" | "definition", value: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  // Validate and submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedChapterId === 0) {
      setErrorMessage("Vui lòng chọn chương liên kết cho bộ thẻ này!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Filter cards: at least one card must be filled, and empty ones will be skipped
    const validCards = cards
      .map((c) => ({ term: c.term.trim(), definition: c.definition.trim() }))
      .filter((c) => c.term !== "" || c.definition !== "");

    if (validCards.length === 0) {
      setErrorMessage("Vui lòng nhập ít nhất 1 thẻ ghi nhớ có đầy đủ thuật ngữ hoặc định nghĩa!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Check if any partially filled cards exist
    const hasIncompleteCard = validCards.some((c) => c.term === "" || c.definition === "");
    if (hasIncompleteCard) {
      setErrorMessage("Tất cả các thẻ đã nhập phải có đầy đủ cả Thuật ngữ và Định nghĩa!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createBulkMutation.mutateAsync(validCards, {
        onSuccess: () => {
          navigate("/teacher/flashcards");
        },
      });
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi tạo bộ thẻ. Vui lòng thử lại!");
    }
  };

  return (
    <div className="mx-auto max-w-4xl pb-16">
      {/* Loading Overlay */}
      {createBulkMutation.isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="mt-md text-headline-sm font-semibold text-white">
            Đang tạo bộ thẻ ghi nhớ...
          </p>
          <p className="mt-xs text-body-md text-white/70">
            Vui lòng không đóng trình duyệt hoặc tải lại trang
          </p>
        </div>
      )}

      {/* Top action bar */}
      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-md">
        <div className="space-y-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/teacher/flashcards")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-colors"
              title="Quay lại"
              type="button"
            >
              <MaterialIcon>arrow_back</MaterialIcon>
            </button>
            <h3 className="text-headline-lg font-semibold text-primary">
              Tạo bộ thẻ ghi nhớ mới
            </h3>
          </div>
          <p className="text-body-md text-on-surface-variant pl-11">
            Thiết kế danh sách thẻ ghi nhớ tương tác cho sinh viên học tập hiệu quả.
          </p>
        </div>
        
        <div className="flex items-center gap-sm pl-11 sm:pl-0">
          <button
            onClick={() => navigate("/teacher/flashcards")}
            className="rounded-lg border border-outline-variant px-md py-sm font-semibold text-primary hover:bg-surface-container-low transition-all text-label-md"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-sm rounded-lg bg-primary px-lg py-sm font-semibold text-white shadow-md hover:bg-primary/95 transition-all text-label-md"
            type="button"
          >
            <MaterialIcon>done</MaterialIcon>
            <span>Tạo bộ thẻ</span>
          </button>
        </div>
      </div>

      {/* Validation Message */}
      {errorMessage && (
        <div className="mb-lg flex items-start gap-md rounded-xl bg-error-container p-md text-on-error-container border border-error/20 animate-pulse">
          <MaterialIcon className="text-error mt-0.5">error</MaterialIcon>
          <div className="text-body-md font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Chapter selection card */}
        <section className="rounded-2xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.02)]">
          <div className="space-y-sm">
            <label className="block text-headline-sm font-semibold text-primary">
              1. Chọn chương liên kết
            </label>
            <p className="text-body-sm text-on-surface-variant">
              Bộ thẻ ghi nhớ sẽ được phân phối trực tiếp vào chương này để sinh viên ôn luyện.
            </p>
            <div className="mt-sm" style={{ maxWidth: "28rem" }}>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                disabled={isLoadingChapters}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0e121e",
                  backgroundColor: "#ffffff",
                  border: "1px solid #c6c6cc",
                  borderRadius: "12px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value={0}>-- Chọn Chương --</option>
                {isLoadingChapters ? (
                  <option disabled>Đang tải danh sách chương...</option>
                ) : (
                  chapters?.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </section>

        {/* Flashcard rows */}
        <div className="space-y-md">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-headline-sm font-semibold text-primary">
              2. Danh sách các thẻ ghi nhớ
            </h4>
            <span className="text-label-sm font-medium text-on-surface-variant">
              Tổng số: {cards.length} thẻ
            </span>
          </div>

          {cards.map((card, index) => (
            <article
              key={card.id}
              className="group rounded-2xl border border-outline-variant/30 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.02)] hover:shadow-[0_8px_30px_rgba(35,39,51,0.06)] hover:border-primary/20 transition-all duration-300 relative"
            >
              {/* Card Row Header */}
              <div className="mb-md flex items-center justify-between border-b border-outline-variant/10 pb-sm">
                <span className="text-label-lg font-bold text-secondary tracking-wider">
                  THẺ SỐ {index + 1}
                </span>
                
                {cards.length > 1 && (
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-all opacity-80 hover:opacity-100"
                    title="Xóa thẻ này"
                    type="button"
                  >
                    <MaterialIcon>delete_outline</MaterialIcon>
                  </button>
                )}
              </div>

              {/* Responsive Inputs (Term & Definition) */}
              <div className="grid gap-gutter md:grid-cols-2">
                {/* Term / Front side */}
                <div className="space-y-xs">
                  <div className="relative">
                    <textarea
                      value={card.term}
                      onChange={(e) => handleInputChange(card.id, "term", e.target.value)}
                      placeholder="Nhập thuật ngữ / câu hỏi (Mặt trước)..."
                      className="w-full border-b border-outline-variant py-md px-1 bg-transparent text-body-md text-primary font-medium placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors resize-none min-h-[80px]"
                      required
                      rows={2}
                    />
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300" />
                  </div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant/70 uppercase tracking-wider pl-1">
                    Thuật ngữ (Mặt trước)
                  </label>
                </div>

                {/* Definition / Back side */}
                <div className="space-y-xs">
                  <div className="relative">
                    <textarea
                      value={card.definition}
                      onChange={(e) => handleInputChange(card.id, "definition", e.target.value)}
                      placeholder="Nhập định nghĩa / câu trả lời (Mặt sau)..."
                      className="w-full border-b border-outline-variant py-md px-1 bg-transparent text-body-md text-primary font-medium placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors resize-none min-h-[80px]"
                      required
                      rows={2}
                    />
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300" />
                  </div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant/70 uppercase tracking-wider pl-1">
                    Định nghĩa (Mặt sau)
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Add Card Button */}
        <button
          type="button"
          onClick={handleAddCard}
          className="flex w-full items-center justify-center gap-sm rounded-2xl border-2 border-dashed border-outline-variant py-lg font-semibold text-primary hover:border-primary hover:bg-primary/[0.02] active:bg-primary/[0.04] transition-all group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-primary group-hover:scale-110 transition-transform">
            <MaterialIcon>add</MaterialIcon>
          </div>
          <span className="text-label-lg font-bold">Thêm thẻ mới</span>
        </button>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-sm border-t border-outline-variant/30 pt-lg">
          <button
            onClick={() => navigate("/teacher/flashcards")}
            className="rounded-lg border border-outline-variant px-md py-sm font-semibold text-primary hover:bg-surface-container-low transition-all text-label-md"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-sm rounded-lg bg-primary px-lg py-sm font-semibold text-white shadow-md hover:bg-primary/95 transition-all text-label-md"
            type="button"
          >
            <MaterialIcon>done</MaterialIcon>
            <span>Tạo bộ thẻ</span>
          </button>
        </div>
      </form>
    </div>
  );
}
