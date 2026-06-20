import { useState } from "react";
import { useNavigate } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { TeacherPageShell } from "../../components/teacher-page-shell";
import { useCreateFlashcardsBulk, useTeacherFlashcardSets } from "../../hooks/use-flashcards";

type CardItem = {
  definition: string;
  id: string;
  term: string;
};

export function CreateFlashcardForm() {
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([
    { id: "1", term: "", definition: "" },
    { id: "2", term: "", definition: "" },
    { id: "3", term: "", definition: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: chapters, isLoading: isLoadingChapters } = useTeacherFlashcardSets();
  const createBulkMutation = useCreateFlashcardsBulk(selectedChapterId);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddCard = () => {
    setCards((previous) => [...previous, { id: generateId(), term: "", definition: "" }]);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) {
      return;
    }
    setCards((previous) => previous.filter((card) => card.id !== id));
  };

  const handleInputChange = (id: string, field: "term" | "definition", value: string) => {
    setCards((previous) =>
      previous.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (selectedChapterId === 0) {
      setErrorMessage("Vui lòng chọn chương liên kết cho bộ thẻ này!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const validCards = cards
      .map((card) => ({ term: card.term.trim(), definition: card.definition.trim() }))
      .filter((card) => card.term !== "" || card.definition !== "");

    if (validCards.length === 0) {
      setErrorMessage("Vui lòng nhập ít nhất 1 thẻ có đầy đủ thuật ngữ hoặc định nghĩa!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const hasIncompleteCard = validCards.some((card) => card.term === "" || card.definition === "");
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
    } catch {
      setErrorMessage("Đã xảy ra lỗi khi tạo bộ thẻ. Vui lòng thử lại!");
    }
  };

  return (
    <TeacherPageShell>
      {createBulkMutation.isPending ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-landing-text/40 backdrop-blur-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-landing-white/20 border-t-landing-white" />
          <p className="mt-md text-headline-sm font-semibold text-landing-white">
            Đang tạo bộ thẻ ghi nhớ...
          </p>
          <p className="mt-xs text-body-md text-landing-white/75">
            Vui lòng không đóng trình duyệt hoặc tải lại trang
          </p>
        </div>
      ) : null}

      <header className="mb-6 flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/35 bg-landing-gray/50 text-landing-text transition hover:bg-landing-gray"
              onClick={() => navigate("/teacher/flashcards")}
              title="Quay lại"
              type="button"
            >
              <MaterialIcon>arrow_back</MaterialIcon>
            </button>
            <h1 className="text-headline-lg font-bold text-landing-text">Tạo bộ thẻ ghi nhớ mới</h1>
          </div>
          <p className="pl-11 text-body-md text-landing-text-soft">
            Thiết kế danh sách thẻ ghi nhớ cho sinh viên ôn tập.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-11 sm:pl-0">
          <button
            className="rounded-xl border border-outline-variant/40 bg-landing-white px-md py-sm text-label-md font-semibold text-landing-text-soft transition hover:bg-landing-gray/60"
            onClick={() => navigate("/teacher/flashcards")}
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-landing-red px-lg py-sm text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep"
            onClick={handleSubmit}
            type="button"
          >
            <MaterialIcon>done</MaterialIcon>
            <span>Tạo bộ thẻ</span>
          </button>
        </div>
      </header>

      {errorMessage ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error/20 bg-error-container/40 p-md text-error">
          <MaterialIcon className="mt-0.5">error</MaterialIcon>
          <p className="text-body-md font-medium">{errorMessage}</p>
        </div>
      ) : null}

      <form className="space-y-lg" onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-outline-variant/25 bg-landing-gray/20 p-gutter">
          <label className="block text-headline-sm font-semibold text-landing-text">
            1. Chọn chương liên kết
          </label>
          <p className="mt-1 text-body-sm text-landing-text-soft">
            Bộ thẻ sẽ được phân phối vào chương này để sinh viên ôn luyện.
          </p>
          <div className="relative mt-3 max-w-md">
            <select
              className="w-full appearance-none rounded-xl border-0 bg-landing-white py-3 pl-4 pr-10 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/20 transition focus:ring-primary/25 disabled:opacity-60"
              disabled={isLoadingChapters}
              onChange={(event) => setSelectedChapterId(Number(event.target.value))}
              value={selectedChapterId}
            >
              <option value={0}>-- Chọn chương --</option>
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
            <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-landing-text-soft">
              expand_more
            </MaterialIcon>
          </div>
        </section>

        <div className="space-y-md">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-headline-sm font-semibold text-landing-text">
              2. Danh sách các thẻ ghi nhớ
            </h2>
            <span className="text-label-sm font-medium text-landing-text-soft">
              Tổng số: {cards.length} thẻ
            </span>
          </div>

          {cards.map((card, index) => (
            <article
              className="relative rounded-2xl border border-outline-variant/25 bg-landing-white p-gutter shadow-[0_4px_20px_rgb(17,24,39,0.04)]"
              key={card.id}
            >
              <div className="mb-md flex items-center justify-between border-b border-outline-variant/15 pb-sm">
                <span className="text-label-md font-bold tracking-wider text-landing-text-muted">
                  THẺ SỐ {index + 1}
                </span>
                {cards.length > 1 ? (
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-landing-text-soft transition hover:bg-error-container/40 hover:text-error"
                    onClick={() => handleDeleteCard(card.id)}
                    title="Xóa thẻ này"
                    type="button"
                  >
                    <MaterialIcon>delete_outline</MaterialIcon>
                  </button>
                ) : null}
              </div>

              <div className="grid gap-gutter md:grid-cols-2">
                <div className="space-y-1">
                  <textarea
                    className="min-h-[80px] w-full resize-none border-b border-outline-variant/40 bg-transparent px-1 py-md text-body-md font-medium text-landing-text placeholder:text-landing-text-soft/50 focus:border-primary focus:outline-none"
                    onChange={(event) => handleInputChange(card.id, "term", event.target.value)}
                    placeholder="Nhập thuật ngữ / câu hỏi (Mặt trước)..."
                    rows={2}
                    value={card.term}
                  />
                  <label className="block pl-1 text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
                    Thuật ngữ (Mặt trước)
                  </label>
                </div>

                <div className="space-y-1">
                  <textarea
                    className="min-h-[80px] w-full resize-none border-b border-outline-variant/40 bg-transparent px-1 py-md text-body-md font-medium text-landing-text placeholder:text-landing-text-soft/50 focus:border-primary focus:outline-none"
                    onChange={(event) =>
                      handleInputChange(card.id, "definition", event.target.value)
                    }
                    placeholder="Nhập định nghĩa / câu trả lời (Mặt sau)..."
                    rows={2}
                    value={card.definition}
                  />
                  <label className="block pl-1 text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
                    Định nghĩa (Mặt sau)
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant/45 py-lg font-semibold text-landing-text transition hover:border-outline-variant/70 hover:bg-landing-gray/30"
          onClick={handleAddCard}
          type="button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
            <MaterialIcon>add</MaterialIcon>
          </div>
          <span className="text-label-lg font-bold">Thêm thẻ mới</span>
        </button>

        <div className="flex items-center justify-end gap-2 border-t border-outline-variant/25 pt-lg">
          <button
            className="rounded-xl border border-outline-variant/40 bg-landing-white px-md py-sm text-label-md font-semibold text-landing-text-soft transition hover:bg-landing-gray/60"
            onClick={() => navigate("/teacher/flashcards")}
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-landing-red px-lg py-sm text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep"
            onClick={handleSubmit}
            type="button"
          >
            <MaterialIcon>done</MaterialIcon>
            <span>Tạo bộ thẻ</span>
          </button>
        </div>
      </form>
    </TeacherPageShell>
  );
}
