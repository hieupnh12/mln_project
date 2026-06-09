import type { QuestionItem } from "../../question-library/types/question-library.types";
import type { QuizSettings } from "../types/quiz-management.types";
import { getQuizReadinessChecks } from "../utils/quiz-ui.helpers";
import { QuizPreview } from "./quiz-preview";
import { QuizPublishChecklist } from "./quiz-publish-checklist";
import { QuizPublishSummary } from "./quiz-publish-summary";

type QuizPublishPanelProps = {
  isPublished: boolean;
  onRemove: (id: string) => void;
  questions: QuestionItem[];
  settings: QuizSettings;
};

export function QuizPublishPanel({
  isPublished,
  onRemove,
  questions,
  settings,
}: QuizPublishPanelProps) {
  const checks = getQuizReadinessChecks(
    settings.title,
    questions.length,
    settings.duration,
    settings.passingScore,
  );

  return (
    <div className="space-y-md">
      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        <QuizPublishChecklist checks={checks} isPublished={isPublished} />
        <QuizPublishSummary questionCount={questions.length} settings={settings} />
      </div>
      <QuizPreview
        isPublished={isPublished}
        onRemove={onRemove}
        questions={questions}
        settings={settings}
      />
    </div>
  );
}
