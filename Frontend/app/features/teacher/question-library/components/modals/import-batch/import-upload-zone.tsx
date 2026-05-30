import { useRef, useState, type DragEvent } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";

type ImportUploadZoneProps = {
  fileName: string | null;
  compact?: boolean;
  onFileSelect: (file: File) => void;
};

export function ImportUploadZone({
  fileName,
  compact = false,
  onFileSelect,
}: ImportUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasFile = Boolean(fileName);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }

  if (hasFile && compact) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container/40">
            <MaterialIcon className="text-secondary">description</MaterialIcon>
          </div>
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              File đã chọn
            </p>
            <p className="text-body-md font-medium text-primary">{fileName}</p>
          </div>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-label-md font-medium text-secondary transition hover:bg-surface-container"
          onClick={openPicker}
          type="button"
        >
          <MaterialIcon>upload_file</MaterialIcon>
          Chọn file khác
        </button>
        <input
          accept=".xlsx,.csv,.xls"
          className="hidden"
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
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-secondary-container to-secondary-fixed opacity-20 blur transition duration-300 group-hover:opacity-40" />
      <div
        className={
          isDragging
            ? "relative flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-secondary bg-surface-container-low p-lg text-center"
            : hasFile
              ? "relative flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-secondary bg-secondary-container/10 p-lg text-center"
              : "relative flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-secondary-container bg-surface-container-low p-lg text-center transition-colors hover:border-secondary"
        }
        onClick={hasFile ? undefined : openPicker}
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
              ? "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container/50"
              : "mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container/30"
          }
        >
          <MaterialIcon className="text-4xl text-secondary">
            {hasFile ? "check_circle" : "cloud_upload"}
          </MaterialIcon>
        </div>
        <div>
          {hasFile ? (
            <>
              <p className="text-headline-md font-semibold text-on-surface">{fileName}</p>
              <p className="mt-1 text-on-surface-variant">
                File hợp lệ — xem trước và ánh xạ bên dưới
              </p>
            </>
          ) : (
            <>
              <p className="text-headline-md font-semibold text-on-surface">
                Kéo thả file vào đây
              </p>
              <p className="mt-1 text-on-surface-variant">
                hoặc nhấn để chọn từ máy tính
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="rounded bg-surface-container-highest px-3 py-1 text-label-sm text-on-surface-variant">
            .XLSX
          </span>
          <span className="rounded bg-surface-container-highest px-3 py-1 text-label-sm text-on-surface-variant">
            .CSV
          </span>
          {hasFile ? (
            <button
              className="rounded-lg border border-outline-variant px-3 py-1 text-label-sm font-medium text-secondary transition hover:bg-white"
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
