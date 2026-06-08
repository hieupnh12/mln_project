import { useId, useRef, useState } from "react";

import { showErrorToast } from "~/shared/utils/toast";

import { MaterialIcon } from "../../../components/teacher-icons";
import {
  filterAcceptedMaterialFiles,
  MATERIAL_FILE_ACCEPT,
} from "../../utils/validate-material-files";

type MaterialFileDropZoneProps = {
  disabled?: boolean;
  onFilesChange: (files: File[]) => void;
};

export function MaterialFileDropZone({
  disabled = false,
  onFilesChange,
}: MaterialFileDropZoneProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function applyFiles(nextFiles: File[]) {
    if (nextFiles.length === 0) {
      showErrorToast("Chỉ hỗ trợ file PNG, JPG, WEBP, PDF hoặc PPTX.");
      return;
    }

    onFilesChange(nextFiles);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    applyFiles(filterAcceptedMaterialFiles(event.target.files ?? []));
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    applyFiles(filterAcceptedMaterialFiles(event.dataTransfer.files));
  }

  return (
    <div
      className={
        isDragging
          ? "flex flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed border-secondary bg-secondary-container/25 p-lg transition-colors"
          : "flex flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed border-secondary-container bg-surface-container-low p-lg transition-colors"
      }
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <MaterialIcon className="text-[28px] text-secondary">upload_file</MaterialIcon>
      <p className="text-center text-label-md text-on-surface-variant">
        Kéo thả file vào đây
      </p>
      <p className="text-center text-label-sm text-on-surface-variant/70">hoặc</p>
      <button
        className="rounded-lg bg-secondary-container/50 px-sm py-xs text-label-sm font-semibold text-on-secondary-container transition-colors hover:bg-secondary-container disabled:opacity-60"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        Choose Files
      </button>
      <input
        accept={MATERIAL_FILE_ACCEPT}
        className="sr-only"
        disabled={disabled}
        id={fileInputId}
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
