import { MaterialIcon } from "../../../../components/teacher-icons";

type ImportInlineProgressProps = {
  label: string;
  detail?: string;
  progress?: number;
  indeterminate?: boolean;
};

export function ImportInlineProgress({
  label,
  detail,
  progress = 0,
  indeterminate = false,
}: ImportInlineProgressProps) {
  return (
    <div className="rounded-xl border border-secondary/20 bg-secondary-container/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <MaterialIcon className="animate-spin text-secondary">sync</MaterialIcon>
        <div className="min-w-0 flex-1">
          <p className="text-label-md font-medium text-on-surface">{label}</p>
          {detail ? <p className="text-label-sm text-on-surface-variant">{detail}</p> : null}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            {indeterminate ? (
              <div className="async-progress-indeterminate h-full w-1/3 rounded-full bg-secondary" />
            ) : (
              <div
                className="h-full rounded-full bg-secondary transition-[width] duration-300"
                style={{ width: `${Math.max(8, progress)}%` }}
              />
            )}
          </div>
        </div>
        {!indeterminate ? (
          <span className="font-mono text-label-sm text-secondary">{Math.round(progress)}%</span>
        ) : null}
      </div>
    </div>
  );
}
