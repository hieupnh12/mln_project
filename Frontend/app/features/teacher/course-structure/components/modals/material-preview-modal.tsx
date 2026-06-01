import { MaterialIcon } from "../../../components/teacher-icons";
import type { CourseStructureMaterial } from "../../types/course-structure.types";
import { getMaterialTypeLabel } from "../../utils/map-course-structure-dto";
import { MaterialPreviewContent } from "../material-preview/material-preview-content";
import { CourseStructureModalOverlay } from "./course-structure-modal-overlay";
import { CourseStructureModalPanel } from "./course-structure-modal-panel";

type MaterialPreviewModalProps = {
  open: boolean;
  material: CourseStructureMaterial | null;
  onClose: () => void;
};

export function MaterialPreviewModal({ open, material, onClose }: MaterialPreviewModalProps) {
  if (!material) {
    return null;
  }

  return (
    <CourseStructureModalOverlay
      labelledBy="material-preview-title"
      onClose={onClose}
      open={open}
      size="wide"
    >
      <CourseStructureModalPanel>
        <div className="p-gutter">
          <div className="mb-md flex items-start justify-between gap-sm">
            <div className="min-w-0">
              <p className="text-label-sm font-medium uppercase tracking-wide text-on-surface-variant">
                Xem trước tài liệu
              </p>
              <h2 className="text-headline-md font-semibold text-primary" id="material-preview-title">
                {material.title}
              </h2>
              <p className="mt-1 text-label-md text-on-surface-variant">
                {getMaterialTypeLabel(material.contentType)}
                {material.slideCount ? ` · ${material.slideCount} slide` : ""}
              </p>
            </div>
            <button
              aria-label="Đóng"
              className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
              onClick={onClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>

          <MaterialPreviewContent materialId={material.id} />
        </div>
      </CourseStructureModalPanel>
    </CourseStructureModalOverlay>
  );
}
