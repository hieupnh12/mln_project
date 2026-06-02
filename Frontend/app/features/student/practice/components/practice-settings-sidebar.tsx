import type { CourseChapterItem, CourseLessonItem } from "../../course-learning/types/course-learning.types";
import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { PRACTICE_AUTO_SECONDS_OPTIONS } from "../constants/practice.constants";
import type { PracticeModeSettings, PracticeScope } from "../types/practice.types";
import { PracticeTestsSidebar } from "./practice-tests-sidebar";
import type { PracticeTestCard } from "../types/practice.types";

type PracticeSettingsSidebarProps = {
  scope: PracticeScope;
  settings: PracticeModeSettings;
  chapters: CourseChapterItem[] | undefined;
  lessons: CourseLessonItem[] | undefined;
  chaptersLoading: boolean;
  lessonsLoading: boolean;
  tests: PracticeTestCard[];
  activeTestId: string;
  onScopeChange: (scope: PracticeScope) => void;
  onSettingsChange: (settings: PracticeModeSettings) => void;
  onSelectTest: (testId: string) => void;
};

export function PracticeSettingsSidebar({
  scope,
  settings,
  chapters,
  lessons,
  chaptersLoading,
  lessonsLoading,
  tests,
  activeTestId,
  onScopeChange,
  onSettingsChange,
  onSelectTest,
}: PracticeSettingsSidebarProps) {
  return (
    <div className="flex flex-col gap-gutter">
      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-gutter shadow-sm">
        <h3 className="text-label-md font-bold text-primary">Phạm vi &amp; chế độ</h3>

        <div className="mt-4 space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-label-sm font-medium text-on-surface-variant">Chương</span>
            <select
              className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md"
              disabled={chaptersLoading}
              onChange={(event) => {
                const value = event.target.value;
                onScopeChange({
                  chapterId: value === "" ? null : Number(value),
                  lessonId: null,
                });
              }}
              value={scope.chapterId ?? ""}
            >
              <option value="">Tất cả chương</option>
              {chapters?.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-sm font-medium text-on-surface-variant">Bài học</span>
            <select
              className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md"
              disabled={scope.chapterId == null || lessonsLoading}
              onChange={(event) => {
                const value = event.target.value;
                onScopeChange({
                  ...scope,
                  lessonId: value === "" ? null : Number(value),
                });
              }}
              value={scope.lessonId ?? ""}
            >
              <option value="">Tất cả bài</option>
              {lessons?.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-label-sm font-medium text-primary">Chuyển câu liên tục</span>
            <input
              checked={settings.autoAdvance}
              className="h-5 w-5 accent-secondary"
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  autoAdvance: event.target.checked,
                  requireContinue: !event.target.checked,
                })
              }
              type="checkbox"
            />
          </label>

          {settings.autoAdvance ? (
            <label className="flex flex-col gap-2">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Giây chờ
              </span>
              <select
                className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md"
                onChange={(event) =>
                  onSettingsChange({
                    ...settings,
                    autoAdvanceSeconds: Number(event.target.value),
                  })
                }
                value={settings.autoAdvanceSeconds}
              >
                {PRACTICE_AUTO_SECONDS_OPTIONS.map((seconds) => (
                  <option key={seconds} value={seconds}>
                    {seconds} giây
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="flex items-center gap-2 text-label-sm text-on-surface-variant">
              <MaterialIcon className="text-base">touch_app</MaterialIcon>
              Bấm Tiếp theo sau mỗi câu
            </p>
          )}
        </div>
      </section>

      <PracticeTestsSidebar
        activeTestId={activeTestId}
        embedded
        onSelectTest={onSelectTest}
        tests={tests}
      />
    </div>
  );
}
