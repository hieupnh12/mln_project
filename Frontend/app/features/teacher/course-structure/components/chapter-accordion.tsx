import { useState } from "react";

import type { Chapter } from "../types/course-structure.types";
import { MaterialIcon } from "../../components/teacher-icons";

export function ChapterAccordion({ chapters }: { chapters: Chapter[] }) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? "");

  return (
    <div className="space-y-md">
      {chapters.map((chapter) => {
        const isActive = activeChapterId === chapter.id;

        return (
          <article
            className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(35,39,51,0.06)]"
            key={chapter.id}
          >
            <button
              className="flex w-full flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between"
              onClick={() => setActiveChapterId(isActive ? "" : chapter.id)}
              type="button"
            >
              <div className="flex min-w-0 items-center gap-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-headline-md font-bold text-primary-container">
                  {chapter.order}
                </div>
                <div className="min-w-0">
                  <h4 className="break-words text-headline-md font-semibold text-primary">
                    {chapter.title}
                  </h4>
                  <p className="text-label-sm font-semibold text-on-surface-variant">
                    {chapter.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-sm sm:justify-end">
                <IconButton icon="edit" label="Sửa tên chương" />
                <IconButton danger icon="delete" label="Xóa chương" />
                <span className="hidden h-6 w-px bg-outline-variant/30 sm:block" />
                <span className="inline-flex items-center gap-xs rounded-lg bg-outline-variant/10 px-sm py-xs text-label-sm font-semibold text-primary">
                  <MaterialIcon className="h-5 w-5 text-[20px]">add</MaterialIcon>
                  Thêm bài học
                </span>
                <MaterialIcon
                  className={`text-on-surface-variant transition-transform ${
                    isActive ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </MaterialIcon>
              </div>
            </button>

            {isActive && (
              <div className="mt-md border-t border-outline-variant/20 pt-md">
                {chapter.lessons.length > 0 ? (
                  <div className="space-y-xs">
                    {chapter.lessons.map((lesson) => (
                      <LessonRow key={lesson.title} lesson={lesson} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-surface-container-low p-xl text-center text-label-md font-medium italic text-on-surface-variant/60">
                    Chưa có nội dung hiển thị cho chương này. Hãy thêm bài học
                    đầu tiên!
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function IconButton({
  danger = false,
  icon,
  label,
}: {
  danger?: boolean;
  icon: string;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className={`rounded-lg p-base transition ${
        danger
          ? "text-on-surface-variant hover:bg-error-container/20 hover:text-error"
          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
      }`}
      role="button"
      title={label}
    >
      <MaterialIcon>{icon}</MaterialIcon>
    </span>
  );
}

function LessonRow({
  lesson,
}: {
  lesson: { title: string; icon: string };
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl p-sm transition hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-md">
        <MaterialIcon className="text-outline-variant">drag_indicator</MaterialIcon>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container/30 text-on-secondary-container">
          <MaterialIcon className="h-[18px] w-[18px] text-[18px]">
            {lesson.icon}
          </MaterialIcon>
        </div>
        <span className="break-words text-label-md font-medium text-on-surface">
          {lesson.title}
        </span>
      </div>
      <div className="flex items-center gap-base opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <button className="p-xs transition hover:text-primary" type="button">
          <MaterialIcon className="h-5 w-5 text-[20px]">edit</MaterialIcon>
        </button>
        <button className="p-xs transition hover:text-error" type="button">
          <MaterialIcon className="h-5 w-5 text-[20px]">delete</MaterialIcon>
        </button>
      </div>
    </div>
  );
}
