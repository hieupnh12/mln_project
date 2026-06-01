import { flashcardSets } from "../constants/teacher-dashboard.constants";
import { MaterialIcon } from "./teacher-icons";

export function FlashcardManager() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-primary">
            Quản lý Flashcard
          </h3>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Tạo bộ thẻ ghi nhớ, kiểm tra chất lượng nội dung và theo dõi độ
            chính xác của sinh viên.
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm sm:w-auto">
          <MaterialIcon>add_circle</MaterialIcon>
          <span className="text-label-md font-medium">Tạo bộ thẻ</span>
        </button>
      </div>

      <div className="grid gap-gutter lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {flashcardSets.map((set) => (
            <article
              className="rounded-2xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]"
              key={set.title}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                  <MaterialIcon>style</MaterialIcon>
                </div>
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                  {set.status}
                </span>
              </div>
              <h4 className="text-headline-md font-semibold text-primary">
                {set.title}
              </h4>
              <p className="mt-2 text-body-md text-on-surface-variant">
                {set.cards} thẻ đang quản lý
              </p>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-label-sm font-semibold text-on-surface-variant">
                  <span>Độ chính xác</span>
                  <span>{set.accuracy}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-variant">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${set.accuracy}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-white">
                  Soạn thẻ
                </button>
                <button className="rounded-lg border border-outline-variant px-3 py-2 text-primary">
                  <MaterialIcon>more_horiz</MaterialIcon>
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <h4 className="text-headline-md font-semibold text-primary">
            Trình soạn nhanh
          </h4>
          <label className="mt-md block">
            <span className="text-label-md font-medium text-on-surface-variant">
              Mặt trước
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-lg border-outline-variant bg-surface-container-low"
              defaultValue="Vấn đề cơ bản của triết học là gì?"
            />
          </label>
          <label className="mt-sm block">
            <span className="text-label-md font-medium text-on-surface-variant">
              Mặt sau
            </span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border-outline-variant bg-surface-container-low"
              defaultValue="Quan hệ giữa vật chất và ý thức, gồm mặt bản thể luận và nhận thức luận."
            />
          </label>
          <div className="mt-md grid grid-cols-2 gap-sm">
            <button className="rounded-lg border border-outline-variant px-4 py-2 text-label-md font-medium text-primary">
              Xem trước
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-white">
              Lưu thẻ
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
