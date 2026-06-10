import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizReadinessCheck } from "../utils/quiz-ui.helpers";

type QuizPublishChecklistProps = {
  checks: QuizReadinessCheck[];
  isPublished: boolean;
};

export function QuizPublishChecklist({ checks, isPublished }: QuizPublishChecklistProps) {
  const passedCount = checks.filter((check) => check.passed).length;

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-white p-sm shadow-sm">
      <header className="mb-sm flex items-center justify-between gap-sm">
        <h4 className="flex items-center gap-1.5 text-label-md font-semibold text-primary">
          <MaterialIcon className="text-[16px]">fact_check</MaterialIcon>
          Checklist
          <span className="font-normal text-on-surface-variant">
            {passedCount}/{checks.length}
          </span>
        </h4>
        {isPublished ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-primary">
            <MaterialIcon className="text-[14px]">check_circle</MaterialIcon>
            Live
          </span>
        ) : null}
      </header>

      <ul className="space-y-1">
        {checks.map((check) => (
          <li
            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
              check.passed
                ? "border-secondary-container/50 bg-secondary-container/20"
                : "border-outline-variant/20 bg-surface-container-low"
            }`}
            key={check.id}
          >
            <MaterialIcon
              className={`text-[16px] ${check.passed ? "text-secondary" : "text-on-surface-variant"}`}
            >
              {check.passed ? "check_circle" : "radio_button_unchecked"}
            </MaterialIcon>
            <div className="min-w-0 flex-1">
              <p className="text-label-md font-medium text-primary">{check.label}</p>
              {!check.passed ? (
                <p className="text-label-sm text-on-surface-variant">{check.hint}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
