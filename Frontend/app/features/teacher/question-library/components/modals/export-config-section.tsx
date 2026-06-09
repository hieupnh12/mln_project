import { MaterialIcon } from "../../../components/teacher-icons";
import {
  exportColumnOptions,
  exportFormatOptions,
  exportStatusOptions,
} from "../../constants/export-exam.constants";
import type { ExportColumnId, ExportConfig } from "../../types/export-exam.types";

type ExportConfigSectionProps = {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
};

export function ExportConfigSection({ config, onChange }: ExportConfigSectionProps) {
  return (
    <div className="glass-card rounded-xl p-md shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-secondary-container p-2">
          <MaterialIcon className="text-secondary">ios_share</MaterialIcon>
        </div>
        <h3 className="text-headline-md font-semibold text-primary">Cấu hình xuất dữ liệu</h3>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Định dạng xuất
        </span>
        <div className="flex gap-3">
          {exportFormatOptions.map((format) => (
            <div
              className="flex flex-1 flex-col items-center gap-2 rounded-lg border-2 border-primary bg-primary py-4 text-on-primary"
              key={format.id}
            >
              <MaterialIcon className="text-[24px]">{format.icon}</MaterialIcon>
              <span className="text-label-md font-medium">{format.label}</span>
            </div>
          ))}
        </div>
        <p className="text-label-sm text-on-surface-variant">
          File Wayground / Quizizz (sheet &quot;Create a Quiz&quot;).
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Lọc theo trạng thái
        </span>
        <div className="flex rounded-full bg-surface-container p-1">
          {exportStatusOptions.map((status) => (
            <button
              className={
                config.statusFilter === status.id
                  ? "flex-1 rounded-full bg-surface-container-lowest py-2 text-center text-label-md font-medium text-primary shadow-sm"
                  : "flex-1 rounded-full py-2 text-center text-label-md font-medium text-on-surface-variant transition hover:text-primary"
              }
              key={status.id}
              onClick={() => onChange({ ...config, statusFilter: status.id })}
              type="button"
            >
              {status.label}
            </button>
          ))}
        </div>
        <p className="text-label-sm text-on-surface-variant">
          Chỉ áp dụng cho dữ liệu trong modal export.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Cột dữ liệu
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {exportColumnOptions.map((column) => (
            <label
              className={
                column.locked
                  ? "flex cursor-default items-center gap-3 rounded-lg bg-surface-container-low p-3 opacity-80"
                  : "flex cursor-pointer items-center gap-3 rounded-lg bg-surface-container-low p-3 transition hover:bg-surface-container"
              }
              key={column.id}
            >
              <input
                checked={config.columns[column.id]}
                className="rounded border-outline-variant text-primary focus:ring-primary disabled:opacity-70"
                disabled={column.locked}
                onChange={(event) =>
                  onChange({
                    ...config,
                    columns: {
                      ...config.columns,
                      [column.id]: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              <span className="text-body-md">
                {column.label}
                {column.hint ? (
                  <span className="mt-0.5 block text-label-sm text-on-surface-variant">
                    {column.hint}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Thời gian mỗi câu
        </span>
        <div className="rounded-lg bg-surface-container-low p-3">
          <label className="block text-body-md font-medium" htmlFor="time-per-question">
            Time in seconds (Wayground)
          </label>
          <input
            className="mt-3 w-full rounded-lg border-none bg-white p-3 text-center text-headline-md font-semibold focus:ring-2 focus:ring-primary/20"
            id="time-per-question"
            min={5}
            onChange={(event) =>
              onChange({
                ...config,
                timePerQuestionSeconds: Math.max(5, Number(event.target.value) || 5),
              })
            }
            type="number"
            value={config.timePerQuestionSeconds}
          />
        </div>
      </div>
    </div>
  );
}
