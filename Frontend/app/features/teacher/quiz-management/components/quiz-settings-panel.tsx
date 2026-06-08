import {
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
    <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-sm border-b border-outline-variant/10 bg-surface-container-low/50 px-md py-sm">
        <h4 className="flex items-center gap-2 text-label-md font-semibold text-primary">
          <MaterialIcon className="text-secondary">tune</MaterialIcon>
          Cài đặt quiz
        </h4>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container/50 px-2.5 py-0.5 text-label-sm font-medium text-primary">
          <MaterialIcon className="text-[14px]">library_books</MaterialIcon>
          {candidateCount} câu khả dụng
        </span>
      </header>

      <div className="space-y-sm p-md">
        <QuizFormSection highlight icon="title" title="Thông tin cơ bản">
          <TextInput
            label="Tên quiz"
            onChange={(title) => onSettingsChange({ ...settings, title })}
            placeholder="VD: Quiz chương 1 — Khái niệm cơ bản"
            value={settings.title}
          />
          {titleWarning ? (
            <p className="text-label-sm text-error">Tên quiz nên có ít nhất 3 ký tự.</p>
          ) : null}
        </QuizFormSection>

        <QuizFormSection
          description="Lọc ngân hàng câu hỏi cho tab tiếp theo"
          icon="school"
          title="Phạm vi nội dung"
        >
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-3">
            <SelectInput
              label="Môn"
              onChange={(course) => onSettingsChange({ ...settings, course })}
              value={settings.course}
            >
              {courseOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
            <SelectInput
              label="Chương"
              onChange={(chapter) => onSettingsChange({ ...settings, chapter })}
              value={settings.chapter}
            >
              {chapterOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
            <SelectInput
              label="Bài"
              onChange={(lesson) => onSettingsChange({ ...settings, lesson })}
              value={settings.lesson}
            >
              <option value="all">Tất cả bài</option>
              {lessonOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </div>
        </QuizFormSection>

        <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
          <QuizFormSection icon="schedule" title="Thời gian & điểm">
            <div className="grid grid-cols-2 gap-sm">
              <NumberInput
                label="Thời gian (phút)"
                min={5}
                onChange={(duration) => onSettingsChange({ ...settings, duration })}
                value={settings.duration}
              />
              <NumberInput
                label="Điểm đạt (%)"
                min={1}
                onChange={(passingScore) =>
                  onSettingsChange({ ...settings, passingScore })
                }
                value={settings.passingScore}
              />
            </div>
            <NumberInput
              label="Số câu random (tab Câu hỏi)"
              min={1}
              onChange={(randomCount) => onSettingsChange({ ...settings, randomCount })}
              value={settings.randomCount}
            />
          </QuizFormSection>

          <QuizFormSection icon="shuffle" title="Tùy chọn làm bài">
            <div className="space-y-xs">
              <ToggleInput
                label="Trộn đáp án"
                onChange={(shuffleAnswers) =>
                  onSettingsChange({ ...settings, shuffleAnswers })
                }
                value={settings.shuffleAnswers}
              />
              <ToggleInput
                label="Random câu khi sinh viên làm bài"
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
            Tạo ngẫu nhiên từ {candidateCount} câu
          </button>
          <div className="grid grid-cols-2 gap-sm">
            <Metric label="Đã chọn" value={selectedCount} />
            <Metric label="Nguồn lọc" value={candidateCount} />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
