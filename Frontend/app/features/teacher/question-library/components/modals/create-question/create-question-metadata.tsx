import { useMemo, useState } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";
import { difficultyOptions } from "../../../constants/question-library.constants";
import {
  bloomLevelOptions,
  createQuestionReferenceImage,
} from "../../../constants/create-question.constants";
import type { LessonOptionDto } from "../../../types/question-library-api.types";
import type { BloomLevel, Difficulty, QuestionDraft } from "../../../types/question-library.types";
import {
  applyLessonToDraft,
  findLessonOption,
  getChapterTitles,
  getLessonsForChapter,
  getSubjectTitles,
} from "../../../utils/lesson-options";

type CreateQuestionMetadataProps = {
  draft: QuestionDraft;
  lessonOptions: LessonOptionDto[];
  lessonsLoading?: boolean;
  lessonsError?: boolean;
  onRetryLessons?: () => void;
  onChange: (draft: QuestionDraft) => void;
};

function HierarchySelect({
  label,
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: {
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-xs">
      <span className="text-label-md text-on-surface-variant">{label}</span>
      <select
        className="w-full appearance-none rounded-lg border-none bg-surface-container px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/20 disabled:opacity-60"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CreateQuestionMetadata({
  draft,
  lessonOptions,
  lessonsLoading = false,
  lessonsError = false,
  onRetryLessons,
  onChange,
}: CreateQuestionMetadataProps) {
  const [tagInput, setTagInput] = useState("");

  const subjectOptions = useMemo(() => getSubjectTitles(lessonOptions), [lessonOptions]);
  const selectedFromId = findLessonOption(lessonOptions, draft.lessonId);

  const activeSubject = selectedFromId
    ? selectedFromId.subjectTitle
    : draft.course && subjectOptions.includes(draft.course)
      ? draft.course
      : (subjectOptions[0] ?? "");

  const chapterOptions = useMemo(
    () => getChapterTitles(lessonOptions, activeSubject),
    [lessonOptions, activeSubject],
  );

  const activeChapter = selectedFromId
    ? selectedFromId.chapterTitle
    : draft.chapter && chapterOptions.includes(draft.chapter)
      ? draft.chapter
      : (chapterOptions[0] ?? "");

  const lessonsInChapter = useMemo(
    () => getLessonsForChapter(lessonOptions, activeSubject, activeChapter),
    [lessonOptions, activeSubject, activeChapter],
  );

  const activeLessonId = selectedFromId
    ? selectedFromId.id
    : draft.lessonId != null &&
        lessonsInChapter.some((item) => item.id === draft.lessonId)
      ? draft.lessonId
      : lessonsInChapter[0]?.id;

  function syncFromLesson(option: LessonOptionDto) {
    onChange(applyLessonToDraft(draft, option));
  }

  function handleSubjectChange(subjectTitle: string) {
    const first = lessonOptions.find((item) => item.subjectTitle === subjectTitle);
    if (first) {
      syncFromLesson(first);
    } else {
      onChange({ ...draft, course: subjectTitle, chapter: "", lesson: "", lessonId: undefined });
    }
  }

  function handleChapterChange(chapterTitle: string) {
    const first = lessonOptions.find(
      (item) => item.subjectTitle === activeSubject && item.chapterTitle === chapterTitle,
    );
    if (first) {
      syncFromLesson(first);
    } else {
      onChange({ ...draft, chapter: chapterTitle, lesson: "", lessonId: undefined });
    }
  }

  function handleLessonChange(lessonId: string) {
    const option = lessonOptions.find((item) => item.id === Number(lessonId));
    if (option) {
      syncFromLesson(option);
    }
  }

  function addTag() {
    const value = tagInput.trim();
    if (!value || draft.tags.includes(value)) return;
    onChange({ ...draft, tags: [...draft.tags, value] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    onChange({ ...draft, tags: draft.tags.filter((item) => item !== tag) });
  }

  const hierarchyDisabled = lessonsLoading || lessonsError || lessonOptions.length === 0;

  return (
    <div className="space-y-md">
      <div className="grid grid-cols-2 gap-md">
        <div className="col-span-2">
          {lessonsLoading ? (
            <p className="rounded-lg bg-surface-container px-4 py-3 text-body-md text-on-surface-variant">
              Đang tải môn, chương, bài học...
            </p>
          ) : lessonsError ? (
            <div className="space-y-2 rounded-lg bg-error-container/30 px-4 py-3 text-body-md text-on-error-container">
              <p>Không tải được danh sách từ API.</p>
              {onRetryLessons && (
                <button
                  className="text-label-md font-medium underline"
                  onClick={onRetryLessons}
                  type="button"
                >
                  Thử tải lại
                </button>
              )}
            </div>
          ) : lessonOptions.length === 0 ? (
            <p className="rounded-lg bg-surface-container px-4 py-3 text-body-md text-on-surface-variant">
              Chưa có dữ liệu lesson trong DB.
            </p>
          ) : (
            <>
              <HierarchySelect
                label="Môn học"
                onChange={handleSubjectChange}
                options={subjectOptions.map((title) => ({ value: title, label: title }))}
                placeholder=""
                value={activeSubject}
              />
              <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
                <HierarchySelect
                  disabled={chapterOptions.length === 0}
                  label="Chương"
                  onChange={handleChapterChange}
                  options={chapterOptions.map((title) => ({ value: title, label: title }))}
                  placeholder="Chọn chương"
                  value={activeChapter}
                />
                <HierarchySelect
                  disabled={lessonsInChapter.length === 0}
                  label="Bài học"
                  onChange={handleLessonChange}
                  options={lessonsInChapter.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                  placeholder="Chọn bài học"
                  value={activeLessonId ?? ""}
                />
              </div>
            </>
          )}
        </div>

        <div className="col-span-2 space-y-xs">
          <span className="text-label-md text-on-surface-variant">Độ khó</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {difficultyOptions.map((level) => {
              const selected = draft.difficulty === level;
              return (
                <button
                  className={
                    selected
                      ? "rounded-lg border-2 border-secondary bg-secondary-container px-3 py-2 text-label-md font-bold text-on-secondary-container"
                      : "rounded-lg border border-outline-variant bg-white px-3 py-2 text-label-md transition hover:border-secondary"
                  }
                  disabled={hierarchyDisabled}
                  key={level}
                  onClick={() => onChange({ ...draft, difficulty: level as Difficulty })}
                  type="button"
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-sm rounded-lg border border-outline-variant/10 bg-surface-container-low p-md">
        <label className="flex items-center gap-2 text-label-md font-medium text-primary">
          <MaterialIcon className="text-sm">school</MaterialIcon>
          THANG BLOOM
        </label>
        <div className="flex flex-wrap gap-2">
          {bloomLevelOptions.map((level) => {
            const selected = draft.bloomLevel === level;
            return (
              <button
                className={
                  selected
                    ? "rounded-full bg-secondary px-3 py-1.5 text-label-sm font-bold text-on-secondary shadow-sm"
                    : "rounded-full border border-outline-variant bg-white px-3 py-1.5 text-label-sm transition hover:bg-secondary-container/20"
                }
                key={level}
                onClick={() => onChange({ ...draft, bloomLevel: level as BloomLevel })}
                type="button"
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-sm">
        <label className="flex items-center gap-2 text-label-md font-medium text-on-surface">
          <MaterialIcon className="text-sm">label</MaterialIcon>
          TỪ KHÓA
        </label>
        <div className="flex min-h-[80px] flex-wrap gap-2 rounded-lg border border-outline-variant bg-white p-3">
          {draft.tags.map((tag) => (
            <span
              className="flex items-center gap-1 rounded-lg bg-secondary-container px-3 py-1 text-label-sm text-on-secondary-container"
              key={tag}
            >
              {tag}
              <button
                aria-label={`Xóa tag ${tag}`}
                className="inline-flex"
                onClick={() => removeTag(tag)}
                type="button"
              >
                <MaterialIcon className="text-[14px]">close</MaterialIcon>
              </button>
            </span>
          ))}
          <input
            className="min-w-[80px] flex-1 border-none p-0 text-label-sm focus:ring-0"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Thêm tag..."
            type="text"
            value={tagInput}
          />
        </div>
      </div>

      <div className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-lg border border-outline-variant">
        <img
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={createQuestionReferenceImage}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primary-container/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 font-label-md text-white">
            <MaterialIcon>upload_file</MaterialIcon>
            Thay ảnh minh họa
          </div>
        </div>
      </div>
    </div>
  );
}
