import { MaterialIcon } from "../../../components/teacher-icons";
import {
  exportColumnOptions,
  exportFormatOptions,
  exportStatusOptions,
} from "../../constants/export-exam.constants";
import type { ExportConfig, ExportFormat, ExportStatusFilter } from "../../types/export-exam.types";

type ExportConfigSectionProps = {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
  onExport: () => void;
};

export function ExportConfigSection({
  config,
  onChange,
  onExport,
}: ExportConfigSectionProps) {
  return (
    <div className="glass-card rounded-xl p-md shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-secondary-container p-2">
          <MaterialIcon className="text-secondary">ios_share</MaterialIcon>
        </div>
        <h3 className="text-headline-md font-semibold text-primary">
          Cấu hình xuất dữ liệu
        </h3>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Định dạng xuất
        </span>
        <div className="flex gap-3">
          {exportFormatOptions.map((format) => {
            const selected = config.format === format.id;
            return (
              <button
                className={
                  selected
                    ? "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 border-primary bg-primary py-4 text-on-primary transition-all"
                    : "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 border-outline-variant/30 py-4 transition-all hover:border-secondary"
                }
                key={format.id}
                onClick={() =>
                  onChange({ ...config, format: format.id as ExportFormat })
                }
                type="button"
              >
                <MaterialIcon className="text-[24px]">{format.icon}</MaterialIcon>
                <span className="text-label-md font-medium">{format.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Lọc theo trạng thái
        </span>
        <div className="flex rounded-full bg-surface-container p-1">
          {exportStatusOptions.map((status) => {
            const selected = config.statusFilter === status.id;
            return (
              <button
                className={
                  selected
                    ? "flex-1 rounded-full bg-surface-container-lowest py-2 text-label-md font-medium text-primary shadow-sm"
                    : "flex-1 rounded-full py-2 text-label-md font-medium text-on-surface-variant transition hover:text-primary"
                }
                key={status.id}
                onClick={() =>
                  onChange({
                    ...config,
                    statusFilter: status.id as ExportStatusFilter,
                  })
                }
                type="button"
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          Cột dữ liệu
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {exportColumnOptions.map((column) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg bg-surface-container-low p-3 transition hover:bg-surface-container"
              key={column.id}
            >
              <input
                checked={config.columns[column.id]}
                className="rounded border-outline-variant text-primary focus:ring-primary"
                onChange={(e) =>
                  onChange({
                    ...config,
                    columns: {
                      ...config.columns,
                      [column.id]: e.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              <span className="text-body-md">{column.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-label-md font-medium text-on-primary transition hover:opacity-90 active:scale-[0.98]"
        onClick={onExport}
        type="button"
      >
        <MaterialIcon>download</MaterialIcon>
        Xử lý &amp; xuất dữ liệu
      </button>
    </div>
  );
}
