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
    <nav aria-label="Các bước soạn quiz" className="space-y-sm">
      <div className="flex flex-wrap gap-2 rounded-xl border border-outline-variant/20 bg-white p-2 shadow-sm">
        {tabs.map((tab, index) => {
          const active = tab === activeTab;
          const complete = stepComplete[tab];

          return (
            <button
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-lg px-4 py-2.5 text-left transition sm:flex-none sm:min-w-[140px] ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`}
              key={tab}
              onClick={() => onTabChange(tab)}
              type="button"
            >
              <span className="flex w-full items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-label-sm font-bold ${
                    active
                      ? "bg-white/15 text-on-primary"
                      : complete
                        ? "bg-secondary-container text-primary"
                        : "bg-surface-container-high"
                  }`}
                >
                  {complete && !active ? (
                    <MaterialIcon className="text-[16px]">check</MaterialIcon>
                  ) : (
                    index + 1
                  )}
                </span>
                <MaterialIcon>{tabIcons[tab]}</MaterialIcon>
                <span className="text-label-md font-semibold">{quizEditorTabLabels[tab]}</span>
                {tab === "questions" ? (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-label-sm ${
                      active ? "bg-white/15" : "bg-surface-container-high"
                    }`}
                  >
                    {questionCount}
                  </span>
                ) : null}
              </span>
              <span
                className={`pl-8 text-label-sm ${
                  active ? "text-on-primary/80" : "text-on-surface-variant"
                }`}
              >
                {quizEditorTabDescriptions[tab]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
