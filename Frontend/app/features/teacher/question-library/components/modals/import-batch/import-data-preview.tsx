import { MaterialIcon } from "../../../../components/teacher-icons";
import type { ImportPreviewRow } from "../../../types/import-batch.types";
import { truncateText } from "../../../utils/truncate-text";

type ImportDataPreviewProps = {
  rows: ImportPreviewRow[];
  rowCount: number;
};

function formatAnswerPreview(row: ImportPreviewRow) {
  if (row.answer?.trim()) {
    return truncateText(row.answer, 32);
  }
  if ((row.options?.length ?? 0) > 0) {
    return `${row.options?.length} lựa chọn`;
  }
  return "—";
}

export function ImportDataPreview({ rows, rowCount }: ImportDataPreviewProps) {
  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-headline-md font-semibold text-primary">
          <MaterialIcon className="text-secondary">visibility</MaterialIcon>
          Xem trước dữ liệu
        </h3>
        <span className="rounded bg-surface-container px-2 py-1 text-label-sm text-on-surface-variant">
          {rowCount} dòng được phát hiện
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
        <div className="hide-scrollbar overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-surface-container text-label-sm uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-4 py-4 font-semibold">Nội dung</th>
                <th className="px-4 py-4 font-semibold">Bài học</th>
                <th className="px-4 py-4 font-semibold">Loại</th>
                <th className="px-4 py-4 font-semibold">Đáp án</th>
                <th className="px-4 py-4 font-semibold">Giải thích</th>
                <th className="px-4 py-4 font-semibold">Độ khó</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md">
              {rows.map((row) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={row.id}>
                  <td className="max-w-xs px-4 py-4">
                    <p className="line-clamp-2" title={row.content}>
                      {truncateText(row.content, 80)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {row.lessonError ? (
                      <span className="text-label-sm text-error" title={row.lessonError}>
                        {truncateText(row.lessonLabel ?? "Lỗi gán bài", 36)}
                      </span>
                    ) : (
                      <span className="text-label-sm text-on-surface-variant" title={row.lessonLabel}>
                        {truncateText(row.lessonLabel ?? "—", 36)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded bg-secondary-container px-2 py-1 text-label-sm text-on-secondary-container">
                      {row.typeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-label-sm text-on-surface" title={row.answer}>
                    {formatAnswerPreview(row)}
                  </td>
                  <td className="max-w-[140px] px-4 py-4 text-label-sm text-on-surface-variant">
                    <p className="line-clamp-2" title={row.explanation}>
                      {row.explanation ? truncateText(row.explanation, 40) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4">{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
