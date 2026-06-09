import { Settings2, Timer, Touchpad } from "lucide-react";

import type {
  CourseChapterItem,
  CourseLessonItem,
} from "../../course-learning/types/course-learning.types";
import { PRACTICE_AUTO_SECONDS_OPTIONS } from "../constants/practice.constants";
import type { PracticeModeSettings, PracticeScope } from "../types/practice.types";
import { PracticeTestsSidebar } from "./practice-tests-sidebar";

type PracticeSettingsSidebarProps = {
  scope: PracticeScope;
  settings: PracticeModeSettings;
  chapters: CourseChapterItem[] | undefined;
  lessons: CourseLessonItem[] | undefined;
  chaptersLoading: boolean;
  lessonsLoading: boolean;
  onScopeChange: (scope: PracticeScope) => void;
  onSettingsChange: (settings: PracticeModeSettings) => void;
};

const selectClassName =
  "min-h-11 w-full min-w-0 max-w-full truncate rounded-lg border border-outline-variant/40 bg-landing-white px-3 py-2 text-body-md text-landing-text outline-none transition focus:border-landing-red/40 focus:ring-2 focus:ring-landing-red/10";

export function PracticeSettingsSidebar({
  scope,
  settings,
  chapters,
  lessons,
  chaptersLoading,
  lessonsLoading,
  onScopeChange,
  onSettingsChange,
}: PracticeSettingsSidebarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-gutter">
      <section className="min-w-0 rounded-xl border border-outline-variant/35 bg-landing-white p-5 shadow-lg shadow-landing-text/5">
        <h3 className="flex items-center gap-2 text-label-md font-bold text-landing-text">
          <Settings2 aria-hidden="true" className="h-5 w-5 text-landing-red" />
          Phạm vi và chế độ
        </h3>

        <div className="mt-5 space-y-5">
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-label-sm font-medium text-landing-text-muted">Chương</span>
            <select
              className={selectClassName}
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

          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-label-sm font-medium text-landing-text-muted">Bài học</span>
            <select
              className={selectClassName}
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

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-landing-gray/70 p-3">
            <span className="min-w-0">
              <span className="block text-label-sm font-semibold text-landing-text">
                Chuyển câu tự động
              </span>
              <span className="mt-1 block text-label-sm text-landing-text-soft">
                Tiếp tục sau khi xem đáp án
              </span>
            </span>
            <input
              checked={settings.autoAdvance}
              className="h-5 w-5 shrink-0 accent-landing-red"
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
            <label className="flex min-w-0 flex-col gap-2">
              <span className="flex items-center gap-2 text-label-sm font-medium text-landing-text-muted">
                <Timer aria-hidden="true" className="h-4 w-4 text-landing-red" />
                Thời gian chờ
              </span>
              <select
                className={selectClassName}
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
            <p className="flex items-center gap-2 text-label-sm text-landing-text-soft">
              <Touchpad aria-hidden="true" className="h-4 w-4 text-landing-red" />
              Bấm “Tiếp theo” sau mỗi câu
            </p>
          )}
        </div>
      </section>

      <PracticeTestsSidebar
        activeTestId=""
        embedded
        onSelectTest={() => undefined}
        tests={[]}
      />
    </div>
  );
}
