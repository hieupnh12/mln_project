import { usePracticeCountdown } from "../hooks/use-practice-countdown";
import { usePracticeKeyboard } from "../hooks/use-practice-keyboard";
import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
} from "../types/practice.types";
import { PracticeAnswerFeedback } from "./practice-answer-feedback";
import { PracticeCountdownBar } from "./practice-countdown-bar";
import { PracticeOptionsList } from "./practice-options-list";
import { PracticeQuestionCard } from "./practice-question-card";
import { PracticeShortcutsHint } from "./practice-shortcuts-hint";

type PracticeSessionContentProps = {
  settings: PracticeModeSettings;
  currentQuestion: PracticeQuestion;
  displayIndex: number;
  answerState: PracticeAnswerState;
  selectedOptionIndices: number[];
  countdownActive: boolean;
  countdownVariant?: "inline" | "fixed";
  showShortcutsHint?: boolean;
  keyboardEnabled?: boolean;
  onSelectOption: (index: number) => void;
  onSubmitAnswer: () => void;
  onContinue: () => void;
  onCountdownComplete: () => void;
};

export function PracticeSessionContent({
  settings,
  currentQuestion,
  displayIndex,
  answerState,
  selectedOptionIndices,
  countdownActive,
  countdownVariant = "inline",
  showShortcutsHint = true,
  keyboardEnabled = true,
  onSelectOption,
  onSubmitAnswer,
  onContinue,
  onCountdownComplete,
}: PracticeSessionContentProps) {
  const { progressPercent } = usePracticeCountdown({
    totalSeconds: settings.autoAdvanceSeconds,
    active: countdownActive,
    onComplete: onCountdownComplete,
  });

  usePracticeKeyboard({
    enabled: keyboardEnabled,
    optionCount: currentQuestion.options.length,
    answerState,
    isMultipleChoice: currentQuestion.isMultipleChoice,
    hasSelection: selectedOptionIndices.length > 0,
    onSelectOption,
    onSubmitAnswer,
    onContinue,
  });

  const showFeedback = answerState === "answered";
  const showSubmitButton =
    currentQuestion.isMultipleChoice
    && answerState === "idle"
    && selectedOptionIndices.length > 0;

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
        questionType={currentQuestion.isMultipleChoice ? "Nhiều đáp án" : undefined}
      />

      <PracticeOptionsList
        answerState={answerState}
        correctOptionIndices={currentQuestion.correctOptionIndices}
        isMultipleChoice={currentQuestion.isMultipleChoice}
        onSelect={onSelectOption}
        options={currentQuestion.options}
        selectedOptionIndices={selectedOptionIndices}
      />

      {showSubmitButton ? (
        <div className="flex justify-end">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95"
            onClick={onSubmitAnswer}
            type="button"
          >
            Xác nhận đáp án
            <span className="rounded-full bg-on-primary/15 px-2 py-0.5 text-label-sm">
              {selectedOptionIndices.length}
            </span>
            <kbd className="rounded border border-on-primary/25 bg-on-primary/10 px-1.5 py-0.5 font-mono text-label-sm">
              Enter
            </kbd>
          </button>
        </div>
      ) : null}

      {showFeedback ? (
        <PracticeAnswerFeedback
          autoAdvance={settings.autoAdvance}
          autoAdvanceSeconds={settings.autoAdvanceSeconds}
          explanation={currentQuestion.explanation}
          onContinue={onContinue}
        />
      ) : null}

      {showShortcutsHint ? <PracticeShortcutsHint compact /> : null}
    </div>
  );
}
