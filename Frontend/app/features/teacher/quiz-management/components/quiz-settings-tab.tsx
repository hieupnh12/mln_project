import type { QuestionItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";
import { QuizSettingsPanel } from "./quiz-settings-panel";
import { QuizSettingsSummary } from "./quiz-settings-summary";

type QuizSettingsTabProps = {
  candidateCount: number;
  chapterOptions: string[];
  courseOptions: string[];
  lessonOptions: string[];
  onGenerateRandom: () => void;
  onSettingsChange: (settings: QuizSettings) => void;
  selectedCount: number;
  settings: QuizSettings;
};

export function QuizSettingsTab({
  candidateCount,
  chapterOptions,
  courseOptions,
  lessonOptions,
  onGenerateRandom,
  onSettingsChange,
  selectedCount,
  settings,
}: QuizSettingsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-md xl:grid-cols-[minmax(0,1fr)_320px]">
      <QuizSettingsPanel
        candidateCount={candidateCount}
        chapterOptions={chapterOptions}
        courseOptions={courseOptions}
        lessonOptions={lessonOptions}
        onGenerateRandom={onGenerateRandom}
        onSettingsChange={onSettingsChange}
        selectedCount={selectedCount}
        settings={settings}
        showRandomAction={false}
      />
      <QuizSettingsSummary
        candidateCount={candidateCount}
        selectedCount={selectedCount}
        settings={settings}
      />
    </div>
  );
}

export { QuizSettingsSectionHint } from "./quiz-settings-tab-hint";
