import { MaterialIcon } from "../../../../components/teacher-icons";
import type { ImportFieldMapping } from "../../../types/import-batch.types";

type ImportFieldMappingPanelProps = {
  mappings: ImportFieldMapping[];
  onMappingChange: (id: string, column: string) => void;
};

export function ImportFieldMappingPanel({
  mappings,
  onMappingChange,
}: ImportFieldMappingPanelProps) {
  return (
    <div className="space-y-4 lg:col-span-1">
      <h3 className="flex items-center gap-2 text-headline-md font-semibold text-primary">
        <MaterialIcon className="text-secondary">alt_route</MaterialIcon>
        Ánh xạ trường dữ liệu
      </h3>
      <div className="space-y-4 rounded-lg border border-outline-variant/10 bg-surface-container-low p-6 shadow-sm">
        <div className="space-y-3">
          {mappings.map((mapping) => (
            <label className="block" key={mapping.id}>
              <span className="mb-1 block text-label-md text-on-surface-variant">
                Thuộc tính hệ thống: {mapping.systemLabel}
              </span>
              <select
                className="w-full rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-body-md transition-all focus:border-secondary focus:ring-1 focus:ring-secondary"
                onChange={(e) => onMappingChange(mapping.id, e.target.value)}
                value={mapping.selectedColumn}
              >
                {mapping.options.map((option) => (
                  <option key={option} value={option}>
                    Cột import: {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="mt-4 border-t border-outline-variant/10 pt-4">
          <div className="flex items-start gap-2 text-label-sm text-on-secondary-container">
            <MaterialIcon className="text-[18px]">info</MaterialIcon>
            <span>3 trường đã được tự động khớp theo tiêu đề cột.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
