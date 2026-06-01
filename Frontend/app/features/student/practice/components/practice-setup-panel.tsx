import type { CourseChapterItem, CourseLessonItem } from "../../course-learning/types/course-learning.types";
import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { PRACTICE_AUTO_SECONDS_OPTIONS } from "../constants/practice.constants";
import type { PracticeModeSettings, PracticeScope } from "../types/practice.types";

type PracticeSetupPanelProps = {
  scope: PracticeScope;
  settings: PracticeModeSettings;
  chapters: CourseChapterItem[] | undefined;
  lessons: CourseLessonItem[] | undefined;
  chaptersLoading: boolean;
  lessonsLoading: boolean;
  onScopeChange: (scope: PracticeScope) => void;
  onSettingsChange: (settings: PracticeModeSettings) => void;
  onStart: () => void;
  canStart: boolean;
};

export function PracticeSetupPanel({
  scope,
  settings,
  chapters,
  lessons,
  chaptersLoading,
  lessonsLoading,
  onScopeChange,
  onSettingsChange,
  onStart,
  canStart,
}: PracticeSetupPanelProps) {
  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-gutter shadow-sm">
      <h2 className="text-headline-md font-semibold text-primary">Thiết lập luyện tập</h2>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Chọn phạm vi bài/chương và chế độ chuyển câu. Mỗi lần hiển thị một câu ngẫu nhiên từ
        ngân hàng, hết câu này sẽ chuyển sang câu khác.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-label-md font-medium text-primary">Chương</span>
          <select
            className="rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-md"
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
          <span className="text-label-md font-medium text-primary">Bài học</span>
          <select
            className="rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-md"
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
            <option value="">Tất cả bài trong chương</option>
            {lessons?.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-4 rounded-xl bg-surface-container-low p-4">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-label-md font-medium text-primary">Chuyển câu liên tục</p>
            <p className="text-label-sm text-on-surface-variant">
              Tự chuyển câu sau khi trả lời, không cần bấm Tiếp theo
            </p>
          </div>
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
            <span className="text-label-md font-medium text-primary">
              Thời gian chờ trước câu tiếp theo (giây)
            </span>
            <select
              className="max-w-xs rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-md"
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
            Sau khi trả lời, bấm Tiếp theo để sang câu mới
          </p>
        )}
      </div>

      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-label-md font-bold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        disabled={!canStart}
        onClick={onStart}
        type="button"
      >
        Bắt đầu luyện tập
        <MaterialIcon>play_arrow</MaterialIcon>
      </button>
    </section>
  );
}
