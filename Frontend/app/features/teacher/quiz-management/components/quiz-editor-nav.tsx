import { MaterialIcon } from "../../components/teacher-icons";
import { quizEditorTabLabels } from "../constants/quiz-management.constants";
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
    <nav aria-label="Bước soạn quiz">
      <ol className="flex gap-1 rounded-lg border border-outline-variant/20 bg-white p-1 shadow-sm">
        {tabs.map((tab, index) => {
          const active = tab === activeTab;
          const complete = stepComplete[tab];

          return (
            <li className="min-w-0 flex-1" key={tab}>
              <button
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-label-md font-semibold transition ${
                  active
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
                onClick={() => onTabChange(tab)}
                type="button"
              >
                <StepBadge active={active} complete={complete} index={index} />
                <MaterialIcon className="text-[16px]">{tabIcons[tab]}</MaterialIcon>
                <span className="truncate">{quizEditorTabLabels[tab]}</span>
                {tab === "questions" ? (
                  <span
                    className={`rounded-full px-1.5 text-label-sm ${
                      active ? "bg-white/15" : "bg-surface-container-high text-primary"
                    }`}
                  >
                    {questionCount}
                  </span>
                ) : null}
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
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
        active
          ? "bg-white/15 text-on-primary"
          : complete
            ? "bg-secondary-container text-primary"
            : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {complete && !active ? (
        <MaterialIcon className="text-[12px]">check</MaterialIcon>
      ) : (
        index + 1
      )}
    </span>
  );
}
