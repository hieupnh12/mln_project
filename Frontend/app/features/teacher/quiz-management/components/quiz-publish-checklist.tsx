import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizReadinessCheck } from "../utils/quiz-ui.helpers";

type QuizPublishChecklistProps = {
  checks: QuizReadinessCheck[];
  isPublished: boolean;
};

export function QuizPublishChecklist({ checks, isPublished }: QuizPublishChecklistProps) {
  const passedCount = checks.filter((check) => check.passed).length;

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-white p-md shadow-sm">
      <header className="mb-md flex items-start justify-between gap-sm">
        <div>
          <h4 className="flex items-center gap-2 text-headline-md font-semibold text-primary">
            <MaterialIcon>fact_check</MaterialIcon>
            Checklist trước khi xuất bản
          </h4>
          <p className="mt-1 text-label-md text-on-surface-variant">
            {passedCount}/{checks.length} mục đã sẵn sàng
          </p>
        </div>
        {isPublished ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-primary">
            <MaterialIcon>check_circle</MaterialIcon>
            Live
          </span>
        ) : null}
      </header>

      <ul className="space-y-sm">
        {checks.map((check) => (
          <li
            className={`flex items-start gap-sm rounded-lg border p-sm ${
              check.passed
                ? "border-secondary-container/50 bg-secondary-container/20"
                : "border-outline-variant/20 bg-surface-container-low"
            }`}
            key={check.id}
          >
            <MaterialIcon
              className={check.passed ? "text-secondary" : "text-on-surface-variant"}
            >
              {check.passed ? "check_circle" : "radio_button_unchecked"}
            </MaterialIcon>
            <div className="min-w-0">
              <p className="font-medium text-primary">{check.label}</p>
              {!check.passed ? (
                <p className="mt-0.5 text-label-md text-on-surface-variant">{check.hint}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
