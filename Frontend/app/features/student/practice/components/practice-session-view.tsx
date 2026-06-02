import { PracticeSessionContent } from "./practice-session-content";
import { PracticeTopBar } from "./practice-top-bar";
import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
  PracticeSessionStats,
} from "../types/practice.types";
import { formatSessionTime } from "../utils/format-session-time";

type PracticeSessionViewProps = {
  courseTitle: string;
  exitHref: string;
  settings: PracticeModeSettings;
  currentQuestion: PracticeQuestion;
  displayIndex: number;
  answerState: PracticeAnswerState;
  selectedOptionIndex: number | null;
  stats: PracticeSessionStats;
  countdownActive: boolean;
  onEnd: () => void;
  onSelectOption: (index: number) => void;
  onContinue: () => void;
  onCountdownComplete: () => void;
};

export function PracticeSessionView({
  courseTitle,
  exitHref,
  settings,
  currentQuestion,
  displayIndex,
  answerState,
  selectedOptionIndex,
  stats,
  countdownActive,
  onEnd,
  onSelectOption,
  onContinue,
  onCountdownComplete,
}: PracticeSessionViewProps) {
  return (
    <>
      <PracticeTopBar
        courseTitle={courseTitle}
        exitHref={exitHref}
        onEnd={onEnd}
        questionLabel={`Câu hỏi ${displayIndex}`}
        sessionTimeLabel={formatSessionTime(stats.sessionSeconds)}
      />

      <div className="mx-auto w-full max-w-[800px] px-margin-mobile py-8 md:px-0 md:py-16">
        <PracticeSessionContent
          answerState={answerState}
          countdownActive={countdownActive}
          countdownVariant="fixed"
          currentQuestion={currentQuestion}
          displayIndex={displayIndex}
          onContinue={onContinue}
          onCountdownComplete={onCountdownComplete}
          onSelectOption={onSelectOption}
          selectedOptionIndex={selectedOptionIndex}
          settings={settings}
        />
      </div>
    </>
  );
}
