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
      <h3 className="flex items-center gap-2 text-headline-md font-semibold text-landing-text">
        <MaterialIcon className="text-catalog-cobalt">alt_route</MaterialIcon>
        Ánh xạ trường dữ liệu
      </h3>
      <div className="space-y-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 lg:p-6">
        <p className="text-label-sm leading-relaxed text-landing-text-soft">
          Hệ thống tự nhận diện cột Excel theo <span className="font-medium">tiêu đề hàng 1</span>{" "}
          trong file mẫu. Không cần cấu hình thủ công — chỉ cần giữ đúng tên cột hoặc tải lại file
          mẫu.
        </p>

        <div className="overflow-hidden rounded-xl border border-outline-variant/20">
          <table className="w-full text-left text-label-sm">
            <thead className="bg-landing-gray/35 text-landing-text-soft">
              <tr>
                <th className="px-3 py-2 font-semibold">Trường hệ thống</th>
                <th className="px-3 py-2 font-semibold">Cột trong file</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td className="px-3 py-2 text-landing-text">{mapping.systemLabel}</td>
                  <td className="px-3 py-2">
                    {mapping.matched ? (
                      <span className="inline-flex items-center gap-1 text-catalog-cobalt">
                        <MaterialIcon className="text-[16px]">check_circle</MaterialIcon>
                        {mapping.excelColumn}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-landing-text-soft">
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

        <div className="border-t border-outline-variant/15 pt-4">
          <div className="flex items-start gap-2 text-label-sm text-landing-text-soft">
            <MaterialIcon className="text-[18px] text-catalog-cobalt">info</MaterialIcon>
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
