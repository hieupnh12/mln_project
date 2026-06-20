import { TEACHER_MODAL_FIELD, TEACHER_MODAL_PANEL } from "../../../../constants/teacher-ui.constants";
import type { ImportExamQuizConfig } from "../../../types/quiz-import.types";

type ImportExamQuizConfigSectionProps = {
  config: ImportExamQuizConfig;
  courseOptions: string[];
  chapterOptions: string[];
  lessonOptions: string[];
  rowCount: number;
  onChange: (config: ImportExamQuizConfig) => void;
};

export function ImportExamQuizConfigSection({
  config,
  courseOptions,
  chapterOptions,
  lessonOptions,
  rowCount,
  onChange,
}: ImportExamQuizConfigSectionProps) {
  function update<K extends keyof ImportExamQuizConfig>(key: K, value: ImportExamQuizConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  function handleTimePerQuestionChange(seconds: number) {
    const safeSeconds = Math.max(15, seconds);
    onChange({
      ...config,
      timePerQuestionSeconds: safeSeconds,
      duration: Math.max(5, Math.ceil((rowCount * safeSeconds) / 60)),
    });
  }

  return (
    <section className={TEACHER_MODAL_PANEL}>
      <h3 className="mb-4 text-headline-sm font-semibold text-landing-text">Cấu hình quiz</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Tên đề / quiz</span>
          <input
            className={TEACHER_MODAL_FIELD}
            onChange={(event) => update("title", event.target.value)}
            value={config.title}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Môn học</span>
          <select
            className={TEACHER_MODAL_FIELD}
            onChange={(event) => update("course", event.target.value)}
            value={config.course}
          >
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Chương</span>
          <select
            className={TEACHER_MODAL_FIELD}
            onChange={(event) => update("chapter", event.target.value)}
            value={config.chapter}
          >
            <option value="all">Tất cả</option>
            {chapterOptions.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Bài học</span>
          <select
            className={TEACHER_MODAL_FIELD}
            onChange={(event) => update("lesson", event.target.value)}
            value={config.lesson}
          >
            <option value="all">Tất cả</option>
            {lessonOptions.map((lesson) => (
              <option key={lesson} value={lesson}>
                {lesson}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Thời gian (phút)</span>
          <input
            className={TEACHER_MODAL_FIELD}
            min={5}
            onChange={(event) => update("duration", Number(event.target.value) || 5)}
            type="number"
            value={config.duration}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Giây / câu (ước tính)</span>
          <input
            className={TEACHER_MODAL_FIELD}
            min={15}
            onChange={(event) => handleTimePerQuestionChange(Number(event.target.value) || 60)}
            type="number"
            value={config.timePerQuestionSeconds}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-label-md font-medium text-landing-text">Điểm đạt (%)</span>
          <input
            className={TEACHER_MODAL_FIELD}
            max={100}
            min={1}
            onChange={(event) => update("passingScore", Number(event.target.value) || 70)}
            type="number"
            value={config.passingScore}
          />
        </label>

        <label className="flex items-center gap-2 self-end">
          <input
            checked={config.shuffleAnswers}
            className="h-4 w-4 rounded border-outline-variant/40 text-primary focus:ring-primary/20"
            onChange={(event) => update("shuffleAnswers", event.target.checked)}
            type="checkbox"
          />
          <span className="text-body-md text-landing-text">Xáo trộn đáp án khi làm bài</span>
        </label>
      </div>
      <p className="mt-4 text-body-sm text-landing-text-soft">
        File có {rowCount.toLocaleString("vi-VN")} dòng. Quiz sẽ giữ thứ tự câu trong file; câu trùng
        ngân hàng được gắn lại tự động.
      </p>
    </section>
  );
}
