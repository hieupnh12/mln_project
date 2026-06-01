import { MaterialIcon } from "../../../components/teacher-icons";
import type { CourseStructureMaterial } from "../../types/course-structure.types";
import { getMaterialIcon } from "../../utils/map-course-structure-dto";

type MaterialThumbnailProps = {
  material: CourseStructureMaterial;
  className?: string;
};

export function MaterialThumbnail({ material, className = "" }: MaterialThumbnailProps) {
  const icon = getMaterialIcon(material.contentType);

  if (material.previewImageUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-low ${className}`}
      >
        <img
          alt={`Xem trước ${material.title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          src={material.previewImageUrl}
        />
        {material.contentType === "YOUTUBE" ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <MaterialIcon className="text-[28px] text-white">play_circle</MaterialIcon>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg border border-outline-variant/20 bg-secondary-container/30 text-secondary ${className}`}
    >
      <MaterialIcon className="text-[22px]">{icon}</MaterialIcon>
    </div>
  );
}
