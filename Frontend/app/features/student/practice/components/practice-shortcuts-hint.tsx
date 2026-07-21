import { Keyboard } from "lucide-react";

import { PRACTICE_SHORTCUTS } from "../constants/practice-shortcuts";

type PracticeShortcutsHintProps = {
  compact?: boolean;
};

export function PracticeShortcutsHint({ compact = false }: PracticeShortcutsHintProps) {
  return (
    <section
      className={
        compact
          ? "rounded-xl border border-outline-variant/25 bg-surface-container-low/80 px-3 py-3"
          : "rounded-xl border border-outline-variant/35 bg-surface-container-lowest p-4 shadow-sm"
      }
    >
      <h3 className="mb-2 flex items-center gap-2 text-label-sm font-semibold text-primary">
        <Keyboard aria-hidden="true" className="h-4 w-4 text-secondary" />
        Phím tắt
      </h3>
      <ul className="space-y-1.5">
        {PRACTICE_SHORTCUTS.map((item) => (
          <li
            className="flex items-center justify-between gap-3 text-label-sm text-on-surface-variant"
            key={`${item.keys}-${item.label}`}
          >
            <span>{item.label}</span>
            <kbd className="shrink-0 rounded border border-outline-variant/35 bg-white px-2 py-0.5 font-mono text-label-sm font-semibold text-primary">
              {item.keys}
            </kbd>
          </li>
        ))}
      </ul>
    </section>
  );
}
