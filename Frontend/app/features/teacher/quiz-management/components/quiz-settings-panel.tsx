import {
  DateTimeInput,
  NumberInput,
  SelectInput,
  TextInput,
  ToggleInput,
} from "../../components/teacher-form-controls";
import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { Metric } from "./quiz-metric";
import { QuizFormSection } from "./quiz-form-section";

type QuizSettingsPanelProps = {
  candidateCount: number;
  chapterOptions: string[];
  courseOptions: string[];
  lessonOptions: string[];
  onGenerateRandom: () => void;
  onSettingsChange: (settings: QuizSettings) => void;
  selectedCount: number;
  settings: QuizSettings;
  showRandomAction?: boolean;
};

export function QuizSettingsPanel({
  candidateCount,
  chapterOptions,
  courseOptions,
  lessonOptions,
  onGenerateRandom,
  onSettingsChange,
  selectedCount,
  settings,
  showRandomAction = true,
}: QuizSettingsPanelProps) {
  const titleWarning = settings.title.trim().length > 0 && settings.title.trim().length < 3;

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-sm border-b border-outline-variant/10 bg-surface-container-lowest px-gutter py-4">
        <h4 className="flex items-center gap-2 text-label-md font-semibold text-primary-container">
          <MaterialIcon className="text-[18px] text-secondary">tune</MaterialIcon>
          Cài đặt quiz
        </h4>
        <span className="text-label-sm text-on-surface-variant">
          {candidateCount.toLocaleString("vi-VN")} câu khả dụng
        </span>
      </header>

      <div className="space-y-gutter p-gutter">
        <QuizFormSection highlight icon="title" title="Tên">
          <TextInput
            label="Tên quiz"
            onChange={(title) => onSettingsChange({ ...settings, title })}
            placeholder="Quiz chương 1..."
            value={settings.title}
          />
          {titleWarning ? <p className="text-label-sm text-error">≥ 3 ký tự</p> : null}
        </QuizFormSection>

        <QuizFormSection icon="school" title="Phạm vi">
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-3">
            <SelectInput
              label="Môn"
              onChange={(course) =>
                onSettingsChange({ ...settings, course, chapter: "all", lesson: "all" })
              }
              value={settings.course}
            >
              {courseOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
            <SelectInput
              label="Chương"
              onChange={(chapter) =>
                onSettingsChange({ ...settings, chapter, lesson: "all" })
              }
              value={settings.chapter}
            >
              <option value="all">Tất cả</option>
              {chapterOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
            <SelectInput
              label="Bài"
              onChange={(lesson) => onSettingsChange({ ...settings, lesson })}
              value={settings.lesson}
            >
              <option value="all">Tất cả</option>
              {lessonOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </div>
        </QuizFormSection>

        <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
          <QuizFormSection icon="schedule" title="Thời gian">
            <div className="grid grid-cols-2 gap-sm">
              <NumberInput
                label="Phút"
                min={5}
                onChange={(duration) => onSettingsChange({ ...settings, duration })}
                value={settings.duration}
              />
              <NumberInput
                label="Điểm %"
                min={1}
                onChange={(passingScore) =>
                  onSettingsChange({ ...settings, passingScore })
                }
                value={settings.passingScore}
              />
            </div>
            <NumberInput
              label="Random"
              min={1}
              onChange={(randomCount) => onSettingsChange({ ...settings, randomCount })}
              value={settings.randomCount}
            />
            <DateTimeInput
              label="Đóng lúc"
              onChange={(availableUntil) => onSettingsChange({ ...settings, availableUntil })}
              value={settings.availableUntil}
            />
          </QuizFormSection>

          <QuizFormSection icon="shuffle" title="Tùy chọn">
            <div className="space-y-xs">
              <ToggleInput
                label="Trộn đáp án"
                onChange={(shuffleAnswers) =>
                  onSettingsChange({ ...settings, shuffleAnswers })
                }
                value={settings.shuffleAnswers}
              />
              <ToggleInput
                label="Random câu"
                onChange={(randomQuestions) =>
                  onSettingsChange({ ...settings, randomQuestions })
                }
                value={settings.randomQuestions}
              />
            </div>
          </QuizFormSection>
        </div>
      </div>

      {showRandomAction ? (
        <footer className="space-y-sm border-t border-outline-variant/10 bg-surface-container-low/30 px-md py-sm">
          <button
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-2 text-label-md font-semibold text-primary transition hover:opacity-90 disabled:opacity-60"
            disabled={candidateCount === 0}
            onClick={onGenerateRandom}
            type="button"
          >
            <MaterialIcon>casino</MaterialIcon>
            Random {candidateCount}
          </button>
          <div className="grid grid-cols-2 gap-sm">
            <Metric label="Chọn" value={selectedCount} />
            <Metric label="Nguồn" value={candidateCount} />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
