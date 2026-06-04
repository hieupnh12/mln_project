import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
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
  const wrapperClass = embedded
    ? "w-full"
    : "hidden w-full shrink-0 lg:block lg:max-w-xs xl:max-w-sm";

  return (
    <aside className={wrapperClass}>
      <div
        className={
          embedded
            ? "rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-gutter shadow-sm"
            : "sticky top-20 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-gutter shadow-sm"
        }
      >
        <h3 className="mb-4 text-label-md font-bold text-primary">Các bài kiểm tra khác</h3>
        {tests.length === 0 ? (
          <p className="rounded-lg bg-surface-container-low p-3 text-label-sm text-on-surface-variant">
            Chức năng làm bài kiểm tra sẽ được cập nhật ở phiên bản sau.
          </p>
        ) : null}
        <ul className="custom-scrollbar flex max-h-[calc(100vh-7rem)] flex-col gap-3 overflow-y-auto">
          {tests.map((test) => {
            const isActive = test.id === activeTestId;
            return (
              <li key={test.id}>
                <button
                  className={
                    isActive
                      ? "w-full rounded-xl border border-secondary bg-secondary-container/20 p-4 text-left ring-2 ring-secondary/10"
                      : "w-full rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 text-left transition hover:border-secondary/40"
                  }
                  onClick={() => onSelectTest(test.id)}
                  type="button"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container text-primary">
                    <MaterialIcon>quiz</MaterialIcon>
                  </div>
                  <p className="text-label-md font-semibold text-primary">{test.title}</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">{test.description}</p>
                  <p className="mt-2 text-label-sm text-on-surface-variant">
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
