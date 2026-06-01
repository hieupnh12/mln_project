import { useEffect, useState } from "react";

import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { MaterialIcon } from "../../../components/teacher-icons";
import type { MaterialFormMode } from "../../types/course-structure.types";
import { CourseStructureModalOverlay } from "./course-structure-modal-overlay";
import { CourseStructureModalPanel } from "./course-structure-modal-panel";

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

export function CreateMaterialModal({
  open,
  lessonTitle,
  isPending = false,
  onClose,
  onSubmit,
}: CreateMaterialModalProps) {
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<MaterialFormMode>("SLIDE_DECK");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      setTitle("");
      setMode("SLIDE_DECK");
      setYoutubeUrl("");
      setFiles([]);
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showErrorToast("Vui lòng nhập tiêu đề tài liệu.");
      return;
    }

    if (mode === "YOUTUBE" && !youtubeUrl.trim()) {
      showErrorToast("Vui lòng nhập link YouTube.");
      return;
    }

    if (mode === "SLIDE_DECK" && files.length === 0) {
      showErrorToast("Vui lòng chọn file slide (PNG/JPG/WEBP/PDF/PPTX).");
      return;
    }

    try {
      await runWithAsyncActivity({
        id: `create-material-${Date.now()}`,
        label: "Đang tạo tài liệu",
        detail: trimmedTitle,
        simulateProgress: true,
        task: async () => {
          await onSubmit({
            title: trimmedTitle,
            mode,
            youtubeUrl: mode === "YOUTUBE" ? youtubeUrl.trim() : undefined,
            files: mode === "SLIDE_DECK" ? files : undefined,
          });
        },
      });
      showSuccessToast("Đã tạo tài liệu thành công.");
      onClose();
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Không thể tạo tài liệu. Vui lòng thử lại.",
      );
    }
  }

  return (
    <CourseStructureModalOverlay labelledBy="create-material-title" onClose={onClose} open={open}>
      <CourseStructureModalPanel>
        <form className="p-gutter" onSubmit={handleSubmit}>
          <div className="mb-md flex items-center justify-between gap-sm">
            <h2 className="text-headline-md font-semibold text-primary" id="create-material-title">
              Thêm tài liệu
            </h2>
            <button
              aria-label="Đóng"
              className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
              onClick={onClose}
              type="button" 
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>

          <p className="mb-md text-label-md text-on-surface-variant">Bài học: {lessonTitle}</p>

          <div className="space-y-md">
            <label className="block space-y-xs">
              <span className="text-label-md font-medium text-on-surface-variant">Tiêu đề</span>
              <input
                autoFocus
                className="w-full rounded-lg border border-outline-variant/50 px-md py-sm text-body-md outline-none focus:border-secondary"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </label>

            <div className="space-y-sm">
              <span className="text-label-md font-medium text-on-surface-variant">
                Loại tài liệu
              </span>
              <div className="flex flex-wrap gap-sm">
                {(
                  [
                    { id: "SLIDE_DECK", label: "Slide / PDF / PPTX" },
                    { id: "YOUTUBE", label: "YouTube" },
                  ] as const
                ).map((option) => (
                  <button
                    className={
                      mode === option.id
                        ? "rounded-lg bg-secondary-container px-4 py-2 text-label-md font-medium text-primary"
                        : "rounded-lg border border-outline-variant px-4 py-2 text-label-md font-medium text-on-surface-variant"
                    }
                    key={option.id}
                    onClick={() => setMode(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "YOUTUBE" ? (
              <label className="block space-y-xs">
                <span className="text-label-md font-medium text-on-surface-variant">
                  Link YouTube
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant/50 px-md py-sm text-body-md outline-none focus:border-secondary"
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                />
              </label>
            ) : (
              <label className="block space-y-xs">
                <span className="text-label-md font-medium text-on-surface-variant">
                  File slide
                </span>
                <input
                  accept=".png,.jpg,.jpeg,.webp,.pdf,.pptx,image/*"
                  className="w-full rounded-lg border border-outline-variant/50 px-md py-sm text-label-md text-on-surface-variant file:mr-3 file:rounded-md file:border-0 file:bg-secondary-container file:px-3 file:py-1 file:text-label-sm file:font-medium file:text-primary"
                  multiple
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                  type="file"
                />
                {files.length > 0 ? (
                  <p className="text-label-sm text-on-surface-variant">
                    Đã chọn {files.length} file
                  </p>
                ) : null}
              </label>
            )}
          </div>

          <div className="mt-lg flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <button
              className="rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary"
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary disabled:opacity-60"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Đang tạo..." : "Tạo tài liệu"}
            </button>
          </div>
        </form>
      </CourseStructureModalPanel>
    </CourseStructureModalOverlay>
  );
}
