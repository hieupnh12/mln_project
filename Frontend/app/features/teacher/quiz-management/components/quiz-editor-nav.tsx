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
      <ol className="flex gap-1 rounded-2xl border border-outline-variant/25 bg-landing-gray/30 p-1">
        {tabs.map((tab, index) => {
          const active = tab === activeTab;
          const complete = stepComplete[tab];

          return (
            <li className="min-w-0 flex-1" key={tab}>
              <button
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-label-md font-semibold transition ${
                  active
                    ? "bg-landing-white text-landing-text shadow-sm ring-1 ring-outline-variant/20"
                    : "text-landing-text-soft hover:bg-landing-white/60 hover:text-landing-text"
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
                      active ? "bg-landing-gray text-landing-text" : "bg-landing-gray/70 text-landing-text-soft"
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
          ? "bg-landing-gray text-landing-text"
          : complete
            ? "bg-catalog-cyan/15 text-catalog-cobalt"
            : "bg-landing-gray/70 text-landing-text-soft"
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
