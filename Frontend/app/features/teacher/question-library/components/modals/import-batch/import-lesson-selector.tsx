import { useEffect, useMemo, useState } from "react";

import type { LessonOptionDto } from "../../../types/question-library-api.types";
import {
  findLessonOption,
  formatLessonOptionLabel,
  getChapterTitles,
  getLessonsForChapter,
  getSubjectTitles,
} from "../../../utils/lesson-options";

type ImportLessonSelectorProps = {
  lessonOptions: LessonOptionDto[];
  value: number | null;
  onChange: (lessonId: number | null) => void;
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
    <div className="space-y-1">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <select
        className="w-full appearance-none rounded-lg border border-outline-variant/20 bg-white px-3 py-2.5 text-body-md focus:ring-2 focus:ring-secondary/20 disabled:opacity-60"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
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

export function ImportLessonSelector({
  lessonOptions,
  value,
  onChange,
}: ImportLessonSelectorProps) {
  const selected = findLessonOption(lessonOptions, value ?? undefined);
  const [subject, setSubject] = useState(selected?.subjectTitle ?? "");
  const [chapter, setChapter] = useState(selected?.chapterTitle ?? "");

  useEffect(() => {
    if (!selected) {
      return;
    }
    setSubject(selected.subjectTitle);
    setChapter(selected.chapterTitle);
  }, [selected?.id]);

  const subjectOptions = useMemo(() => getSubjectTitles(lessonOptions), [lessonOptions]);
  const chapterOptions = useMemo(
    () => (subject ? getChapterTitles(lessonOptions, subject) : []),
    [lessonOptions, subject],
  );
  const lessonItems = useMemo(
    () => (subject && chapter ? getLessonsForChapter(lessonOptions, subject, chapter) : []),
    [chapter, lessonOptions, subject],
  );

  function handleSubjectChange(nextSubject: string) {
    setSubject(nextSubject);
    setChapter("");
    onChange(null);
  }

  function handleChapterChange(nextChapter: string) {
    setChapter(nextChapter);
    onChange(null);
  }

  function handleLessonChange(lessonId: string) {
    const parsed = Number(lessonId);
    onChange(Number.isNaN(parsed) ? null : parsed);
  }

  const selectedLabel = selected ? formatLessonOptionLabel(selected) : null;

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low/60 p-4">
      <div className="mb-3">
        <h3 className="text-label-md font-semibold text-on-surface">Bài học mặc định</h3>
        <p className="mt-1 text-label-sm text-on-surface-variant">
          Dùng cho các dòng trong file <span className="font-medium">không điền</span> Môn/Chương/Bài.
          Dòng đã điền đủ 3 cột sẽ được gán theo từng dòng.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <HierarchySelect
          disabled={lessonOptions.length === 0}
          label="Môn học"
          onChange={handleSubjectChange}
          options={subjectOptions.map((item) => ({ value: item, label: item }))}
          placeholder="Chọn môn học"
          value={subject}
        />
        <HierarchySelect
          disabled={!subject}
          label="Chương"
          onChange={handleChapterChange}
          options={chapterOptions.map((item) => ({ value: item, label: item }))}
          placeholder="Chọn chương"
          value={chapter}
        />
        <HierarchySelect
          disabled={!chapter}
          label="Bài học"
          onChange={handleLessonChange}
          options={lessonItems.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
          placeholder="Chọn bài học"
          value={value ?? ""}
        />
      </div>
      {selectedLabel ? (
        <p className="mt-3 text-label-sm text-secondary">Mặc định: {selectedLabel}</p>
      ) : null}
    </section>
  );
}
