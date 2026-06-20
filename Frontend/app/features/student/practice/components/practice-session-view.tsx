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
  selectedOptionIndices: number[];
  stats: PracticeSessionStats;
  countdownActive: boolean;
  onEnd: () => void;
  onSelectOption: (index: number) => void;
  onSubmitAnswer: () => void;
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
  selectedOptionIndices,
  stats,
  countdownActive,
  onEnd,
  onSelectOption,
  onSubmitAnswer,
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

      <div className="mx-auto w-full max-w-[1040px] px-margin-mobile py-6 md:px-gutter md:py-8 xl:px-0">
        <PracticeSessionContent
          answerState={answerState}
          countdownActive={countdownActive}
          countdownVariant="fixed"
          currentQuestion={currentQuestion}
          displayIndex={displayIndex}
          onContinue={onContinue}
          onCountdownComplete={onCountdownComplete}
          onSelectOption={onSelectOption}
          onSubmitAnswer={onSubmitAnswer}
          selectedOptionIndices={selectedOptionIndices}
          settings={settings}
        />
      </div>
    </>
  );
}
