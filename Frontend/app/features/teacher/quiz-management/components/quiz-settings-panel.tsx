import {
  NumberInput,
  SelectInput,
  TextInput,
  ToggleInput,
} from "../../components/teacher-form-controls";
import { MaterialIcon } from "../../components/teacher-icons";
import {
  chapterOptions,
  courseOptions,
  lessonOptions,
} from "../../question-library/constants/question-library.constants";
import type { QuizSettings } from "../types/quiz-management.types";
import { Metric } from "./quiz-metric";

type QuizSettingsPanelProps = {
  candidateCount: number;
  onGenerateRandom: () => void;
  onSettingsChange: (settings: QuizSettings) => void;
  selectedCount: number;
  settings: QuizSettings;
};

export function QuizSettingsPanel({
  candidateCount,
  onGenerateRandom,
  onSettingsChange,
  selectedCount,
  settings,
}: QuizSettingsPanelProps) {
  return (
    <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="flex items-center gap-sm text-headline-md font-semibold text-primary">
        <MaterialIcon>tune</MaterialIcon>
        Cài đặt quiz
      </h4>
      <TextInput
        label="Tên quiz"
        onChange={(title) => onSettingsChange({ ...settings, title })}
        value={settings.title}
      />
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
      <NumberInput
        label="Số câu random"
        min={1}
        onChange={(randomCount) =>
          onSettingsChange({ ...settings, randomCount })
        }
        value={settings.randomCount}
      />
      <ToggleInput
        label="Trộn đáp án"
        onChange={(shuffleAnswers) =>
          onSettingsChange({ ...settings, shuffleAnswers })
        }
        value={settings.shuffleAnswers}
      />
      <ToggleInput
        label="Random khi publish"
        onChange={(randomQuestions) =>
          onSettingsChange({ ...settings, randomQuestions })
        }
        value={settings.randomQuestions}
      />
      <button
        className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container"
        onClick={onGenerateRandom}
        type="button"
      >
        <MaterialIcon>casino</MaterialIcon>
        Tạo ngẫu nhiên từ {candidateCount} câu
      </button>
      <div className="grid grid-cols-2 gap-sm text-center">
        <Metric label="Đã chọn" value={selectedCount} />
        <Metric label="Nguồn lọc" value={candidateCount} />
      </div>
    </aside>
  );
}
