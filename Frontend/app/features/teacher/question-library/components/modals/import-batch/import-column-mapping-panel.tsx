import { MaterialIcon } from "../../../../components/teacher-icons";
import type { ImportFieldMapping } from "../../../types/import-batch.types";

type ImportColumnMappingPanelProps = {
  mappings: ImportFieldMapping[];
  matchedCount: number;
};

export function ImportColumnMappingPanel({
  mappings,
  matchedCount,
}: ImportColumnMappingPanelProps) {
  return (
    <div className="space-y-4 lg:col-span-1">
      <h3 className="flex items-center gap-2 text-headline-md font-semibold text-primary">
        <MaterialIcon className="text-secondary">alt_route</MaterialIcon>
        Ánh xạ trường dữ liệu
      </h3>
      <div className="space-y-4 rounded-lg border border-outline-variant/10 bg-surface-container-low p-4 shadow-sm lg:p-6">
        <p className="text-label-sm leading-relaxed text-on-surface-variant">
          Hệ thống tự nhận diện cột Excel theo <span className="font-medium">tiêu đề hàng 1</span>{" "}
          trong file mẫu. Không cần cấu hình thủ công — chỉ cần giữ đúng tên cột hoặc tải lại file
          mẫu.
        </p>

        <div className="overflow-hidden rounded-lg border border-outline-variant/10">
          <table className="w-full text-left text-label-sm">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="px-3 py-2 font-semibold">Trường hệ thống</th>
                <th className="px-3 py-2 font-semibold">Cột trong file</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td className="px-3 py-2 text-on-surface">{mapping.systemLabel}</td>
                  <td className="px-3 py-2">
                    {mapping.matched ? (
                      <span className="inline-flex items-center gap-1 text-secondary">
                        <MaterialIcon className="text-[16px]">check_circle</MaterialIcon>
                        {mapping.excelColumn}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-on-surface-variant/60">
                        <MaterialIcon className="text-[16px]">remove_circle</MaterialIcon>
                        Không có / tùy chọn
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-outline-variant/10 pt-4">
          <div className="flex items-start gap-2 text-label-sm text-on-secondary-container">
            <MaterialIcon className="text-[18px]">info</MaterialIcon>
            <span>
              Đã khớp {matchedCount}/{mappings.length} cột bắt buộc. Cột Môn/Chương/Bài có thể để
              trống nếu dùng bài học mặc định.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
