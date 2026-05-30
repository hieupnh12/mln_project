import type { ImportFieldMapping, ImportPreviewRow } from "../../../types/import-batch.types";
import { MaterialIcon } from "../../../../components/teacher-icons";
import { ImportActionsBar } from "./import-actions-bar";
import { ImportDataPreview } from "./import-data-preview";
import { ImportFieldMappingPanel } from "./import-field-mapping";

type ImportReviewSectionProps = {
  fieldMappings: ImportFieldMapping[];
  isProcessing: boolean;
  previewRows: ImportPreviewRow[];
  rowCount: number;
  onCancel: () => void;
  onFinalize: () => void;
  onMappingChange: (id: string, column: string) => void;
};

export function ImportReviewSection({
  fieldMappings,
  isProcessing,
  previewRows,
  rowCount,
  onCancel,
  onFinalize,
  onMappingChange,
}: ImportReviewSectionProps) {
  return (
    <div className="import-review-enter space-y-gutter">
      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
        <ImportDataPreview rowCount={rowCount} rows={previewRows} />
        <ImportFieldMappingPanel
          mappings={fieldMappings}
          onMappingChange={onMappingChange}
        />
      </div>
      <ImportActionsBar
        isProcessing={isProcessing}
        onCancel={onCancel}
        onFinalize={onFinalize}
      />
    </div>
  );
}

export function ImportReviewPlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-lg text-center">
      <MaterialIcon className="mx-auto text-[40px] text-on-surface-variant/30">
        table_chart
      </MaterialIcon>
      <p className="mt-3 text-body-md text-on-surface-variant">
        Tải file lên để xem trước dữ liệu và cấu hình ánh xạ trường.
      </p>
    </div>
  );
}
