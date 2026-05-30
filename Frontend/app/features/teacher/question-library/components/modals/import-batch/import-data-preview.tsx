import { MaterialIcon } from "../../../../components/teacher-icons";
import type { ImportPreviewRow } from "../../../types/import-batch.types";

type ImportDataPreviewProps = {
  rows: ImportPreviewRow[];
  rowCount: number;
};

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
          <table className="w-full text-left">
            <thead className="bg-surface-container text-label-sm uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-semibold">Nội dung câu hỏi</th>
                <th className="px-6 py-4 font-semibold">Loại</th>
                <th className="px-6 py-4 font-semibold">Độ khó</th>
                <th className="px-6 py-4 font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md">
              {rows.map((row) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={row.id}>
                  <td className="max-w-xs truncate px-6 py-4">{row.content}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-secondary-container px-2 py-1 text-label-sm text-on-secondary-container">
                      {row.typeLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">{row.difficulty}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
