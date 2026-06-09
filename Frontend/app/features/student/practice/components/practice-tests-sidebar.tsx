import { ClipboardCheck } from "lucide-react";

import type { PracticeTestCard } from "../types/practice.types";

type PracticeTestsSidebarProps = {
  tests: PracticeTestCard[];
  activeTestId: string;
  onSelectTest: (testId: string) => void;
  embedded?: boolean;
};

export function PracticeTestsSidebar({
  tests,
  activeTestId,
  onSelectTest,
  embedded = false,
}: PracticeTestsSidebarProps) {
  if (tests.length === 0) {
    return null;
  }

  const wrapperClass = embedded
    ? "w-full"
    : "hidden w-full shrink-0 lg:block lg:max-w-xs xl:max-w-sm";

  return (
    <aside className={wrapperClass}>
      <div
        className={
          embedded
            ? "rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5"
            : "sticky top-20 rounded-xl border border-outline-variant/35 bg-landing-white p-gutter shadow-lg shadow-landing-text/5"
        }
      >
        <h3 className="mb-4 flex items-center gap-2 text-label-md font-bold text-landing-text">
          <ClipboardCheck aria-hidden="true" className="h-5 w-5 text-landing-red" />
          Các bài kiểm tra khác
        </h3>
        <ul className="custom-scrollbar flex max-h-[calc(100vh-7rem)] flex-col gap-3 overflow-y-auto">
          {tests.map((test) => {
            const isActive = test.id === activeTestId;

            return (
              <li key={test.id}>
                <button
                  className={
                    isActive
                      ? "w-full rounded-xl border border-landing-red/25 bg-landing-red/5 p-4 text-left"
                      : "w-full rounded-xl border border-outline-variant/30 bg-landing-cream p-4 text-left transition hover:border-landing-red/20"
                  }
                  onClick={() => onSelectTest(test.id)}
                  type="button"
                >
                  <p className="text-label-md font-semibold text-landing-text">
                    {test.title}
                  </p>
                  <p className="mt-1 text-label-sm text-landing-text-soft">
                    {test.description}
                  </p>
                  <p className="mt-2 text-label-sm font-medium text-landing-red">
                    {test.questionCountLabel} · {test.durationLabel}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
