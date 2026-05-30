import { useState } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";
import {
  chapterOptions,
  courseOptions,
  difficultyOptions,
  lessonOptions,
} from "../../../constants/question-library.constants";
import {
  bloomLevelOptions,
  createQuestionReferenceImage,
} from "../../../constants/create-question.constants";
import type { BloomLevel, Difficulty, QuestionDraft } from "../../../types/question-library.types";

type CreateQuestionMetadataProps = {
  draft: QuestionDraft;
  onChange: (draft: QuestionDraft) => void;
};

export function CreateQuestionMetadata({ draft, onChange }: CreateQuestionMetadataProps) {
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const value = tagInput.trim();
    if (!value || draft.tags.includes(value)) return;
    onChange({ ...draft, tags: [...draft.tags, value] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    onChange({ ...draft, tags: draft.tags.filter((item) => item !== tag) });
  }

  return (
    <div className="space-y-md">
      <div className="grid grid-cols-2 gap-md">
        <div className="col-span-2 space-y-xs">
          <span className="text-label-md text-on-surface-variant">Môn học</span>
          <select
            className="w-full appearance-none rounded-lg border-none bg-surface-container px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/20"
            onChange={(e) => onChange({ ...draft, course: e.target.value })}
            value={draft.course}
          >
            {courseOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-xs">
          <span className="text-label-md text-on-surface-variant">Chương</span>
          <select
            className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/20"
            onChange={(e) => onChange({ ...draft, chapter: e.target.value })}
            value={draft.chapter}
          >
            {chapterOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-xs">
          <span className="text-label-md text-on-surface-variant">Bài học</span>
          <select
            className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary/20"
            onChange={(e) => onChange({ ...draft, lesson: e.target.value })}
            value={draft.lesson}
          >
            {lessonOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2 space-y-xs">
          <span className="text-label-md text-on-surface-variant">Độ khó</span>
          <div className="flex gap-2">
            {difficultyOptions.map((level) => {
              const selected = draft.difficulty === level;
              return (
                <button
                  className={
                    selected
                      ? "flex-1 rounded-lg border-2 border-secondary bg-secondary-container px-3 py-2 text-label-md font-bold text-on-secondary-container"
                      : "flex-1 rounded-lg border border-outline-variant bg-white px-3 py-2 text-label-md transition hover:border-secondary"
                  }
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
