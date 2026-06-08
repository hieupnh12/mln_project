import { useEffect, useState } from "react";

import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { MaterialIcon } from "../../../components/teacher-icons";
import type { MaterialFormMode } from "../../types/course-structure.types";
import { deriveMaterialTitle } from "../../utils/derive-material-title";
import { getMaterialFilesValidationError } from "../../utils/validate-material-files";
import { CourseStructureModalOverlay } from "./course-structure-modal-overlay";
import { CourseStructureModalPanel } from "./course-structure-modal-panel";
import { MaterialFileDropZone } from "./material-file-drop-zone";
import { MaterialSelectedFilesList } from "./material-selected-files-list";
import { MaterialUploadNotes } from "./material-upload-notes";
import { MaterialUploadProgress } from "./material-upload-progress";

type CreateMaterialModalProps = {
  open: boolean;
  lessonTitle: string;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    mode: MaterialFormMode;
    youtubeUrl?: string;
    files?: File[];
  }) => Promise<void>;
};

type UploadState = "idle" | "uploading" | "success";

const MATERIAL_TYPE_OPTIONS = [
  { id: "SLIDE_DECK" as const, label: "Slide / PDF / PPTX" },
  { id: "YOUTUBE" as const, label: "YouTube" },
];

const inputClassName =
  "w-full rounded-lg border border-outline-variant p-sm text-body-md outline-none transition-all focus:border-secondary-container focus:ring-2 focus:ring-secondary-container";

export function CreateMaterialModal({
  open,
  lessonTitle,
  isPending = false,
  onClose,
  onSubmit,
}: CreateMaterialModalProps) {
  const [mode, setMode] = useState<MaterialFormMode>("SLIDE_DECK");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const isBusy = isPending || uploadState === "uploading" || uploadState === "success";

  useEffect(() => {
    if (open) {
      setMode("SLIDE_DECK");
      setYoutubeUrl("");
      setFiles([]);
      setUploadState("idle");
      setUploadProgress(0);
    }
  }, [open]);

  function handleClose() {
    if (isBusy) return;
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (mode === "YOUTUBE" && !youtubeUrl.trim()) {
      showErrorToast("Vui lòng nhập đường dẫn YouTube.");
      return;
    }

    if (mode === "SLIDE_DECK" && files.length === 0) {
      showErrorToast("Vui lòng chọn file slide (PNG/JPG/WEBP/PDF/PPTX).");
      return;
    }

    const filesValidationError = getMaterialFilesValidationError(files);
    if (mode === "SLIDE_DECK" && filesValidationError) {
      showErrorToast(filesValidationError);
      return;
    }

    const materialTitle = deriveMaterialTitle({ mode, lessonTitle, files });

    setUploadState("uploading");
    setUploadProgress(8);

    const progressTimer = window.setInterval(() => {
      setUploadProgress((current) => (current < 88 ? current + 4 + Math.random() * 6 : current));
    }, 350);

    try {
      setUploadProgress(12);
      await onSubmit({
        title: materialTitle,
        mode,
        youtubeUrl: mode === "YOUTUBE" ? youtubeUrl.trim() : undefined,
        files: mode === "SLIDE_DECK" ? files : undefined,
      });

      window.clearInterval(progressTimer);
      setUploadProgress(100);
      setUploadState("success");
      showSuccessToast("Đã tạo tài liệu thành công.");

      window.setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      window.clearInterval(progressTimer);
      setUploadState("idle");
      setUploadProgress(0);
      showErrorToast(
        error instanceof Error ? error.message : "Không thể tạo tài liệu. Vui lòng thử lại.",
      );
    }
  }

  return (
    <CourseStructureModalOverlay
      labelledBy="create-material-title"
      onClose={handleClose}
      open={open}
      overlayClassName="bg-primary/40"
      scrollable={false}
      size="compact"
    >
      <CourseStructureModalPanel>
        <form className="w-full min-w-0" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b border-outline-variant/10 p-md">
            <h2 className="text-headline-md font-semibold text-primary" id="create-material-title">
              Thêm tài liệu
            </h2>
            <button
              aria-label="Đóng"
              className="rounded-full p-xs transition-colors hover:bg-surface-container disabled:opacity-50"
              disabled={isBusy}
              onClick={handleClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>

          <div className="space-y-md p-md">
            <p className="text-label-sm text-on-surface-variant">Bài học: {lessonTitle}</p>

            <div className="space-y-xs">
              <span className="block text-label-md font-medium text-primary">Loại tài liệu</span>
              <div className="flex gap-sm">
                {MATERIAL_TYPE_OPTIONS.map((option) => {
                  const isActive = mode === option.id;

                  return (
                    <button
                      className={
                        isActive
                          ? "rounded-lg bg-secondary-container px-md py-sm text-label-md font-semibold text-on-secondary-container transition-all"
                          : "rounded-lg border border-outline-variant px-md py-sm text-label-md font-medium text-on-surface-variant transition-all hover:bg-surface-container"
                      }
                      disabled={isBusy}
                      key={option.id}
                      onClick={() => setMode(option.id)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {mode === "YOUTUBE" ? (
              <div className="space-y-xs">
                <label className="block text-label-md font-medium text-primary" htmlFor="youtube-url">
                  Đường dẫn YouTube
                </label>
                <input
                  className={inputClassName}
                  disabled={isBusy}
                  id="youtube-url"
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                />
              </div>
            ) : (
              <div className="space-y-xs">
                <span className="block text-label-md font-medium text-primary">File slide</span>
                <MaterialUploadNotes />
                <MaterialFileDropZone disabled={isBusy} onFilesChange={setFiles} />
                <MaterialSelectedFilesList files={files} />
              </div>
            )}

            {uploadState !== "idle" ? (
              <div className="space-y-xs">
                <MaterialUploadProgress
                  progress={uploadProgress}
                  showSuccess={uploadState === "success"}
                />
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-sm bg-surface-container-lowest p-md">
            <button
              className="rounded-lg px-md py-sm text-label-md font-semibold text-on-surface-variant transition-all hover:bg-surface-container disabled:opacity-60"
              disabled={isBusy}
              onClick={handleClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className={
                isBusy
                  ? "flex items-center gap-sm rounded-lg bg-primary-container/60 px-md py-sm text-label-md font-semibold text-white/80"
                  : "flex items-center gap-sm rounded-lg bg-primary-container px-md py-sm text-label-md font-semibold text-on-primary transition-all hover:opacity-90"
              }
              disabled={isBusy}
              type="submit"
            >
              {uploadState === "uploading" || isPending ? (
                <>
                  <MaterialIcon className="animate-spin text-[18px]">sync</MaterialIcon>
                  <span>Đang tải...</span>
                </>
              ) : uploadState === "success" ? (
                <>
                  <MaterialIcon className="text-[18px]">check_circle</MaterialIcon>
                  <span>Thành công!</span>
                </>
              ) : (
                <span>Tạo tài liệu</span>
              )}
            </button>
          </div>
        </form>
      </CourseStructureModalPanel>
    </CourseStructureModalOverlay>
  );
}
