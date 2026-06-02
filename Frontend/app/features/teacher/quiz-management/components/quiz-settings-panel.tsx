import type { ReactNode } from "react";

import {
  NumberInput,
  SelectInput,
  TextInput,
  ToggleInput,
} from "../../components/teacher-form-controls";
import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizSettings } from "../types/quiz-management.types";
import { Metric } from "./quiz-metric";

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
    <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="flex items-center gap-sm text-headline-md font-semibold text-primary">
        <MaterialIcon>tune</MaterialIcon>
        Cài đặt quiz
      </h4>

      <SettingsSection icon="title" title="Thông tin cơ bản">
        <TextInput
          label="Tên quiz"
          onChange={(title) => onSettingsChange({ ...settings, title })}
          value={settings.title}
        />
        {titleWarning ? (
          <p className="text-label-md text-error">Tên quiz nên có ít nhất 3 ký tự.</p>
        ) : null}
      </SettingsSection>

      <SettingsSection icon="school" title="Phạm vi nội dung">
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
        <p className="text-label-md text-on-surface-variant">
          {candidateCount} câu hỏi đã duyệt khớp phạm vi hiện tại.
        </p>
      </SettingsSection>

      <SettingsSection icon="schedule" title="Thời gian & điểm">
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
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
      </SettingsSection>

      <SettingsSection icon="shuffle" title="Tùy chọn làm bài">
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
      </SettingsSection>

      {showRandomAction ? (
        <button
          className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container disabled:opacity-60"
          disabled={candidateCount === 0}
          onClick={onGenerateRandom}
          type="button"
        >
          <MaterialIcon>casino</MaterialIcon>
          Tạo ngẫu nhiên từ {candidateCount} câu
        </button>
      ) : null}

      <div className="grid grid-cols-2 gap-sm text-center">
        <Metric label="Đã chọn" value={selectedCount} />
        <Metric label="Nguồn lọc" value={candidateCount} />
      </div>
    </aside>
  );
}

function SettingsSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: string;
  title: string;
}) {
  return (
    <section className="space-y-sm rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-sm">
      <h5 className="flex items-center gap-2 text-label-md font-semibold uppercase tracking-wide text-primary">
        <MaterialIcon className="text-secondary">{icon}</MaterialIcon>
        {title}
      </h5>
      <div className="space-y-sm">{children}</div>
    </section>
  );
}
