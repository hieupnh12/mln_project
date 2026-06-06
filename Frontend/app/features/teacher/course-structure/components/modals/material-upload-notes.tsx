export function MaterialUploadNotes() {
  return (
    <div className="space-y-xs rounded-lg border border-outline-variant/25 bg-surface-container-low px-sm py-xs">
      <p className="text-label-sm font-medium text-on-surface">Định dạng được chèn</p>
      <ul className="list-inside list-disc space-y-0.5 text-label-sm text-on-surface-variant">
        <li>Ảnh slide: PNG, JPG, WEBP</li>
        <li>Tài liệu: PDF</li>
        <li>Chọn nhiều file: tất cả phải cùng loại (chỉ ảnh, chỉ PDF hoặc chỉ PPTX)</li>
      </ul>
      <p className="text-label-sm text-on-surface-variant">
        <span className="font-semibold text-primary">Lưu ý:</span> Nếu dùng file PPTX, hãy export
        sang PDF trước khi tải lên để slide hiển thị ổn định và đúng bố cục.
      </p>
    </div>
  );
}
