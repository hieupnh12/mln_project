import { MaterialIcon } from "../../components/teacher-icons";
import { quizEditorTabDescriptions, quizEditorTabLabels } from "../constants/quiz-management.constants";
import type { QuizEditorTab } from "../types/quiz-management.types";

type QuizEditorNavProps = {
  activeTab: QuizEditorTab;
  questionCount: number;
  onTabChange: (tab: QuizEditorTab) => void;
  stepComplete: Record<QuizEditorTab, boolean>;
};

const tabIcons: Record<QuizEditorTab, string> = {
  settings: "tune",
  questions: "checklist",
  publish: "publish",
};

const tabs: QuizEditorTab[] = ["settings", "questions", "publish"];

export function QuizEditorNav({
  activeTab,
  questionCount,
  onTabChange,
  stepComplete,
}: QuizEditorNavProps) {
  return (
    <nav aria-label="Các bước soạn quiz">
      <ol className="flex gap-1 rounded-xl border border-outline-variant/20 bg-white p-1 shadow-sm">
        {tabs.map((tab, index) => {
          const active = tab === activeTab;
          const complete = stepComplete[tab];

          return (
            <li className="min-w-0 flex-1" key={tab}>
              <button
                aria-current={active ? "step" : undefined}
                className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition ${
                  active
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
                onClick={() => onTabChange(tab)}
                type="button"
              >
                <span className="flex w-full items-center gap-1.5">
                  <StepBadge active={active} complete={complete} index={index} />
                  <MaterialIcon className="text-[18px]">{tabIcons[tab]}</MaterialIcon>
                  <span className="truncate text-label-md font-semibold">
                    {quizEditorTabLabels[tab]}
                  </span>
                  {tab === "questions" ? (
                    <span
                      className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-label-sm font-medium ${
                        active ? "bg-white/15 text-on-primary" : "bg-surface-container-high text-primary"
                      }`}
                    >
                      {questionCount}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`hidden pl-7 text-label-sm sm:block ${
                    active ? "text-on-primary/75" : "text-on-surface-variant"
                  }`}
                >
                  {quizEditorTabDescriptions[tab]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepBadge({
  active,
  complete,
  index,
}: {
  active: boolean;
  complete: boolean;
  index: number;
}) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-label-sm font-bold ${
        active
          ? "bg-white/15 text-on-primary"
          : complete
            ? "bg-secondary-container text-primary"
            : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {complete && !active ? (
        <MaterialIcon className="text-[14px]">check</MaterialIcon>
      ) : (
        index + 1
      )}
    </span>
  );
}
