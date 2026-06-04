import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type PracticeInlineToolbarProps = {
  questionLabel: string;
  sessionTimeLabel: string;
};

export function PracticeInlineToolbar({
  questionLabel,
  sessionTimeLabel,
}: PracticeInlineToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-outline-variant/15 bg-surface-container-low px-3 py-2">
      <p className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
        {questionLabel}
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-2.5 py-1">
        <MaterialIcon className="text-[17px]">timer</MaterialIcon>
        <span className="text-label-sm font-medium text-primary">{sessionTimeLabel}</span>
      </div>
    </div>
  );
}
