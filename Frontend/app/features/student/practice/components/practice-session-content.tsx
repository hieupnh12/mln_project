import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { usePracticeCountdown } from "../hooks/use-practice-countdown";
import type {
  PracticeAnswerState,
  PracticeModeSettings,
  PracticeQuestion,
  PracticeSessionStats,
} from "../types/practice.types";
import { PracticeCountdownBar } from "./practice-countdown-bar";
import { PracticeExplanationPanel } from "./practice-explanation-panel";
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

  const showContinue = answerState === "answered" && !settings.autoAdvance;

  return (
    <div className="relative flex flex-col gap-4 md:gap-5">
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

      <div>
        <PracticeExplanationPanel
          explanation={currentQuestion.explanation}
          visible={answerState === "answered"}
        />
      </div>

      {showContinue ? (
        <div className="flex justify-end">
          <button
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-md font-bold text-on-primary shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95"
            onClick={onContinue}
            type="button"
          >
            Tiếp theo
            <MaterialIcon>arrow_forward</MaterialIcon>
          </button>
        </div>
      ) : null}

      {settings.autoAdvance && answerState === "answered" ? (
        <p className="text-center text-label-sm text-on-surface-variant">
          Tự chuyển câu sau {settings.autoAdvanceSeconds} giây…
        </p>
      ) : null}
    </div>
  );
}
