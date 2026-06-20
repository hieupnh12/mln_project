import { useRef, useState, type DragEvent } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";
import { TEACHER_MODAL_BTN_SECONDARY } from "../../../../constants/teacher-ui.constants";

type ImportUploadZoneProps = {
  fileName: string | null;
  compact?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
};

export function ImportUploadZone({
  fileName,
  compact = false,
  disabled = false,
  onFileSelect,
}: ImportUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasFile = Boolean(fileName);

  function openPicker() {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }

  if (hasFile && compact) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-catalog-cyan/12 text-catalog-cobalt">
            <MaterialIcon>description</MaterialIcon>
          </div>
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-wider text-landing-text-soft">
              File đã chọn
            </p>
            <p className="text-body-md font-medium text-landing-text">{fileName}</p>
          </div>
        </div>
        <button
          className={`${TEACHER_MODAL_BTN_SECONDARY} disabled:opacity-50`}
          disabled={disabled}
          onClick={openPicker}
          type="button"
        >
          <MaterialIcon>upload_file</MaterialIcon>
          Chọn file khác
        </button>
        <input
          accept=".xlsx,.csv,.xls"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
          ref={inputRef}
          type="file"
        />
      </div>
    );
  }

  return (
    <div className="group relative transition-all duration-300">
      <div
        className={
          isDragging
            ? "relative flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-catalog-cobalt/40 bg-catalog-cyan/8 p-lg text-center"
            : hasFile
              ? "relative flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-outline-variant/40 bg-landing-gray/25 p-lg text-center"
              : "relative flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-outline-variant/45 bg-landing-gray/20 p-lg text-center transition-colors hover:border-outline-variant/70 hover:bg-landing-gray/30 disabled:cursor-not-allowed disabled:opacity-60"
        }
        onClick={hasFile || disabled ? undefined : openPicker}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
        role={hasFile ? undefined : "button"}
        tabIndex={hasFile ? undefined : 0}
      >
        <div
          className={
            hasFile
              ? "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-catalog-cyan/12 text-catalog-cobalt"
              : "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-landing-gray/50 text-landing-text-soft"
          }
        >
          <MaterialIcon className="text-4xl">
            {hasFile ? "check_circle" : "cloud_upload"}
          </MaterialIcon>
        </div>
        <div>
          {hasFile ? (
            <>
              <p className="text-headline-md font-semibold text-landing-text">{fileName}</p>
              <p className="mt-1 text-landing-text-soft">
                File hợp lệ — xem trước và ánh xạ bên dưới
              </p>
            </>
          ) : (
            <>
              <p className="text-headline-md font-semibold text-landing-text">
                Kéo thả file vào đây
              </p>
              <p className="mt-1 text-landing-text-soft">
                hoặc nhấn để chọn từ máy tính ·{" "}
                <span className="text-label-sm">Dùng file Excel theo mẫu chuẩn</span>
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="rounded-full bg-landing-gray px-3 py-1 text-label-sm text-landing-text-soft">
            .XLSX
          </span>
          <span className="rounded-full bg-landing-gray px-3 py-1 text-label-sm text-landing-text-soft">
            .CSV
          </span>
          {hasFile ? (
            <button
              className="rounded-xl border border-outline-variant/40 px-3 py-1 text-label-sm font-medium text-landing-text transition hover:bg-landing-gray/50"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              type="button"
            >
              Đổi file
            </button>
          ) : null}
        </div>
        <input
          accept=".xlsx,.csv,.xls"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
          ref={inputRef}
          type="file"
        />
      </div>
    </div>
  );
}
