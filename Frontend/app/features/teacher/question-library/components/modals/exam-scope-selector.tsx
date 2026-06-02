import { useMemo, useState } from "react";

import { MaterialIcon } from "../../../components/teacher-icons";
import type { LessonOptionDto } from "../../types/question-library-api.types";
import type { RandomExamScope } from "../../types/export-exam.types";
import {
  buildScopeSummary,
  countSelectedLessons,
  getSelectedLessonIdsInChapter,
  getVisibleLessonGroups,
  isChapterFullySelected,
  isChapterPartiallySelected,
  isEntireSubjectSelected,
  isLessonSelected,
  selectAllChapters,
  selectEntireSubject,
  toggleChapterScope,
  toggleLessonScope,
  type ChapterScopeGroup,
} from "../../utils/exam-scope-selection";

type ExamScopeSelectorProps = {
  scope: RandomExamScope;
  lessonOptions: LessonOptionDto[];
  onChange: (scope: RandomExamScope) => void;
};

export function ExamScopeSelector({
  scope,
  lessonOptions,
  onChange,
}: ExamScopeSelectorProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const subjects = useMemo(
    () => [...new Set(lessonOptions.map((item) => item.subjectTitle).filter(Boolean))],
    [lessonOptions],
  );

  const chapterGroups = useMemo(
    () => getVisibleLessonGroups(scope, lessonOptions),
    [scope, lessonOptions],
  );

  const summary = buildScopeSummary(scope, lessonOptions);
  const selectedLessonCount = countSelectedLessons(scope, lessonOptions);
  const entireSubject = isEntireSubjectSelected(scope, lessonOptions);

  function handleSubjectChange(subjectTitle: string) {
    setExpandedChapter(null);
    onChange({
      subjectTitle,
      chapterTitles: [],
      lessonIds: [],
    });
  }

  function handleToggleChapter(group: ChapterScopeGroup) {
    onChange(toggleChapterScope(scope, group));
  }

  function handleToggleLesson(lesson: LessonOptionDto) {
    onChange(toggleLessonScope(scope, lesson, chapterGroups));
  }

  return (
    <div className="space-y-4 rounded-xl border border-outline-variant/15 bg-surface-container-low/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Phạm vi chương / bài
          </span>
          <p className="mt-1 text-body-md text-primary">{summary}</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            {selectedLessonCount} bài được chọn
            {entireSubject ? " · mặc định lấy toàn môn" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ScopeActionButton
            label="Toàn môn"
            onClick={() => onChange(selectEntireSubject(scope))}
            selected={entireSubject}
          />
          <ScopeActionButton
            label="Chọn hết"
            onClick={() => onChange(selectAllChapters(scope, lessonOptions))}
          />
        </div>
      </div>

      <select
        className="w-full rounded-lg border-outline-variant/30 bg-surface-container-lowest p-3 text-body-md focus:ring-2 focus:ring-secondary/20"
        onChange={(event) => handleSubjectChange(event.target.value)}
        value={scope.subjectTitle}
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      <div className="custom-scrollbar max-h-[min(320px,40vh)] space-y-2 overflow-y-auto pr-1">
        {chapterGroups.map((group) => (
          <ChapterScopeAccordion
            expanded={expandedChapter === group.chapterTitle}
            group={group}
            key={group.chapterTitle}
            onToggleChapter={() => handleToggleChapter(group)}
            onToggleExpand={() =>
              setExpandedChapter((current) =>
                current === group.chapterTitle ? null : group.chapterTitle,
              )
            }
            onToggleLesson={handleToggleLesson}
            scope={scope}
          />
        ))}
      </div>
    </div>
  );
}

function ChapterScopeAccordion({
  group,
  scope,
  expanded,
  onToggleExpand,
  onToggleChapter,
  onToggleLesson,
}: {
  group: ChapterScopeGroup;
  scope: RandomExamScope;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleChapter: () => void;
  onToggleLesson: (lesson: LessonOptionDto) => void;
}) {
  const fullySelected = isChapterFullySelected(scope, group);
  const partiallySelected = isChapterPartiallySelected(scope, group);
  const selectedInChapter = getSelectedLessonIdsInChapter(scope, group).length;

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/15 bg-surface-container-lowest">
      <div className="flex items-center gap-2 px-3 py-2">
        <ChapterCheckbox
          checked={fullySelected}
          indeterminate={partiallySelected}
          onToggle={onToggleChapter}
        />
        <button
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={onToggleExpand}
          type="button"
        >
          <MaterialIcon className="shrink-0 text-on-surface-variant">
            {expanded ? "expand_less" : "expand_more"}
          </MaterialIcon>
          <span className="truncate text-body-md font-medium text-primary">
            {group.chapterTitle}
          </span>
        </button>
        <span className="shrink-0 rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant">
          {selectedInChapter}/{group.lessons.length}
        </span>
      </div>

      {expanded ? (
        <div className="flex flex-wrap gap-2 border-t border-outline-variant/10 px-3 py-3">
          {group.lessons.map((lesson) => {
            const selected = isLessonSelected(scope, lesson);
            return (
              <button
                className={
                  selected
                    ? "rounded-full border border-secondary bg-secondary-container/40 px-3 py-1.5 text-label-sm font-medium text-primary"
                    : "rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-label-sm text-on-surface-variant transition hover:border-secondary/50"
                }
                key={lesson.id}
                onClick={() => onToggleLesson(lesson)}
                type="button"
              >
                {lesson.title}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ChapterCheckbox({
  checked,
  indeterminate,
  onToggle,
}: {
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-label={checked ? "Bỏ chọn chương" : "Chọn cả chương"}
      className={
        checked || indeterminate
          ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-secondary bg-secondary-container/30 text-secondary"
          : "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-outline-variant/30 text-on-surface-variant transition hover:border-secondary/50"
      }
      onClick={onToggle}
      type="button"
    >
      <MaterialIcon className="text-[18px]" filled={checked}>
        {checked ? "check_box" : indeterminate ? "indeterminate_check_box" : "check_box_outline_blank"}
      </MaterialIcon>
    </button>
  );
}

function ScopeActionButton({
  label,
  onClick,
  selected = false,
}: {
  label: string;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      className={
        selected
          ? "rounded-full border border-secondary bg-secondary-container/30 px-3 py-1.5 text-label-sm font-medium text-primary"
          : "rounded-full border border-outline-variant/30 px-3 py-1.5 text-label-sm text-on-surface-variant transition hover:border-secondary/50 hover:text-primary"
      }
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
