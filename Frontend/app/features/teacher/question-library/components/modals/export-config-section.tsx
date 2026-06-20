import { MaterialIcon } from "../../../components/teacher-icons";
import { TEACHER_MODAL_PANEL } from "../../../constants/teacher-ui.constants";
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
    <div className={TEACHER_MODAL_PANEL}>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-catalog-cyan/12 p-2 text-catalog-cobalt">
          <MaterialIcon>ios_share</MaterialIcon>
        </div>
        <h3 className="text-headline-md font-semibold text-landing-text">Cấu hình xuất dữ liệu</h3>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
          Định dạng xuất
        </span>
        <div className="flex gap-3">
          {exportFormatOptions.map((format) => (
            <div
              className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-outline-variant/30 bg-landing-white py-4 text-landing-text"
              key={format.id}
            >
              <MaterialIcon className="text-[24px]">{format.icon}</MaterialIcon>
              <span className="text-label-md font-medium">{format.label}</span>
            </div>
          ))}
        </div>
        <p className="text-label-sm text-landing-text-soft">
          File Wayground / Quizizz (sheet &quot;Create a Quiz&quot;).
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
          Lọc theo trạng thái
        </span>
        <div className="flex rounded-full bg-landing-gray/50 p-1">
          {exportStatusOptions.map((status) => (
            <button
              className={
                config.statusFilter === status.id
                  ? "flex-1 rounded-full bg-landing-white py-2 text-center text-label-md font-medium text-landing-text shadow-sm ring-1 ring-outline-variant/20"
                  : "flex-1 rounded-full py-2 text-center text-label-md font-medium text-landing-text-soft transition hover:text-landing-text"
              }
              key={status.id}
              onClick={() => onChange({ ...config, statusFilter: status.id })}
              type="button"
            >
              {status.label}
            </button>
          ))}
        </div>
        <p className="text-label-sm text-landing-text-soft">
          Chỉ áp dụng cho dữ liệu trong modal export.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
          Cột dữ liệu
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {exportColumnOptions.map((column) => (
            <label
              className={
                column.locked
                  ? "flex cursor-default items-center gap-3 rounded-xl bg-landing-gray/35 p-3 opacity-80"
                  : "flex cursor-pointer items-center gap-3 rounded-xl bg-landing-gray/35 p-3 transition hover:bg-landing-gray/55"
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
                  <span className="mt-0.5 block text-label-sm text-landing-text-soft">
                    {column.hint}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
          Thời gian mỗi câu
        </span>
        <div className="rounded-xl bg-landing-gray/35 p-3">
          <label className="block text-body-md font-medium text-landing-text" htmlFor="time-per-question">
            Time in seconds (Wayground)
          </label>
          <input
            className="mt-3 w-full rounded-xl border-0 bg-landing-white p-3 text-center text-headline-md font-semibold text-landing-text outline-none ring-1 ring-outline-variant/15 focus:ring-primary/25"
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
