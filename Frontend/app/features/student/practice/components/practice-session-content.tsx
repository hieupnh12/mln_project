import { usePracticeCountdown } from "../hooks/use-practice-countdown";
import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
} from "../types/practice.types";
import { PracticeAnswerFeedback } from "./practice-answer-feedback";
import { PracticeCountdownBar } from "./practice-countdown-bar";
import { PracticeOptionsList } from "./practice-options-list";
import { PracticeQuestionCard } from "./practice-question-card";

type PracticeSessionContentProps = {
  settings: PracticeModeSettings;
  currentQuestion: PracticeQuestion;
  displayIndex: number;
  answerState: PracticeAnswerState;
  selectedOptionIndex: number | null;
  countdownActive: boolean;
  countdownVariant?: "inline" | "fixed";
  onSelectOption: (index: number) => void;
  onContinue: () => void;
  onCountdownComplete: () => void;
};

export function PracticeSessionContent({
  settings,
  currentQuestion,
  displayIndex,
  answerState,
  selectedOptionIndex,
  countdownActive,
  countdownVariant = "inline",
  onSelectOption,
  onContinue,
  onCountdownComplete,
}: PracticeSessionContentProps) {
  const { progressPercent } = usePracticeCountdown({
    totalSeconds: settings.autoAdvanceSeconds,
    active: countdownActive,
    onComplete: onCountdownComplete,
  });

  const showFeedback = answerState === "answered";

  return (
    <div className="relative flex flex-1 flex-col gap-4 pb-8 md:gap-5">
      <PracticeCountdownBar
        progressPercent={progressPercent}
        variant={countdownVariant}
        visible={countdownActive}
      />

      <PracticeQuestionCard
        questionIndex={displayIndex}
        questionText={currentQuestion.question}
      />

      <PracticeOptionsList
        answerState={answerState}
        correctOptionIndex={currentQuestion.correctOptionIndex}
        onSelect={onSelectOption}
        options={currentQuestion.options}
        selectedOptionIndex={selectedOptionIndex}
      />

      {showFeedback ? (
        <PracticeAnswerFeedback
          autoAdvance={settings.autoAdvance}
          autoAdvanceSeconds={settings.autoAdvanceSeconds}
          explanation={currentQuestion.explanation}
          onContinue={onContinue}
        />
      ) : null}
    </div>
  );
}
