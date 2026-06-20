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
        <h3 className="flex items-center gap-2 text-headline-md font-semibold text-landing-text">
          <MaterialIcon className="text-catalog-cobalt">visibility</MaterialIcon>
          Xem trước dữ liệu
        </h3>
        <span className="rounded-full bg-landing-gray px-2.5 py-1 text-label-sm text-landing-text-soft">
          {rowCount} dòng được phát hiện
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-outline-variant/25 bg-landing-white shadow-[0_4px_20px_rgb(17,24,39,0.05)]">
        <div className="hide-scrollbar overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-landing-gray/35 text-label-sm uppercase tracking-wider text-landing-text-soft">
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
                <tr className="transition-colors hover:bg-landing-gray/35" key={row.id}>
                  <td className="max-w-xs px-4 py-4">
                    <p className="line-clamp-2 text-landing-text" title={row.content}>
                      {truncateText(row.content, 80)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {row.lessonError ? (
                      <span className="text-label-sm text-error" title={row.lessonError}>
                        {truncateText(row.lessonLabel ?? "Lỗi gán bài", 36)}
                      </span>
                    ) : (
                      <span className="text-label-sm text-landing-text-soft" title={row.lessonLabel}>
                        {truncateText(row.lessonLabel ?? "—", 36)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-landing-gray px-2.5 py-1 text-label-sm text-landing-text-soft">
                      {row.typeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-label-sm text-landing-text" title={row.answer}>
                    {formatAnswerPreview(row)}
                  </td>
                  <td className="max-w-[140px] px-4 py-4 text-label-sm text-landing-text-soft">
                    <p className="line-clamp-2" title={row.explanation}>
                      {row.explanation ? truncateText(row.explanation, 40) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-landing-text">{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
