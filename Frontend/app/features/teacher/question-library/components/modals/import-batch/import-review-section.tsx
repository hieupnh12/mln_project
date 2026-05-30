import type { ImportFieldMapping, ImportPreviewRow } from "../../../types/import-batch.types";
import { MaterialIcon } from "../../../../components/teacher-icons";
import { ImportActionsBar } from "./import-actions-bar";
import { ImportColumnMappingPanel } from "./import-column-mapping-panel";
import { ImportDataPreview } from "./import-data-preview";
import { ImportLessonSelector } from "./import-lesson-selector";
import type { LessonOptionDto } from "../../../types/question-library-api.types";

type ImportReviewSectionProps = {
  fieldMappings: ImportFieldMapping[];
  matchedColumnCount: number;
  isProcessing: boolean;
  previewRows: ImportPreviewRow[];
  rowCount: number;
  lessonOptions: LessonOptionDto[];
  defaultLessonId: number | null;
  lessonIssueCount: number;
  onDefaultLessonChange: (lessonId: number | null) => void;
  onCancel: () => void;
  onFinalize: () => void;
};

export function ImportReviewSection({
  fieldMappings,
  matchedColumnCount,
  isProcessing,
  previewRows,
  rowCount,
  lessonOptions,
  defaultLessonId,
  lessonIssueCount,
  onDefaultLessonChange,
  onCancel,
  onFinalize,
}: ImportReviewSectionProps) {
  return (
    <div className="import-review-enter space-y-gutter">
      <ImportLessonSelector
        lessonOptions={lessonOptions}
        onChange={onDefaultLessonChange}
        value={defaultLessonId}
      />

      {lessonIssueCount > 0 ? (
        <p className="rounded-lg bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          {lessonIssueCount} dòng chưa gán được bài học. Kiểm tra cột Môn/Chương/Bài hoặc chọn
          bài học mặc định.
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
        <ImportDataPreview rowCount={rowCount} rows={previewRows} />
        <ImportColumnMappingPanel matchedCount={matchedColumnCount} mappings={fieldMappings} />
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
        Tải file lên để xem trước dữ liệu và kiểm tra ánh xạ cột.
      </p>
    </div>
  );
}
