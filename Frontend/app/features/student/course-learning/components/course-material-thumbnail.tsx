import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { CourseContentType } from "../types/course-learning.types";
import { getMaterialTypeIcon } from "../utils/resolve-course-cover-image";

type CourseMaterialThumbnailProps = {
  title: string;
  contentType: CourseContentType;
  previewImageUrl: string | null;
  className?: string;
};

export function CourseMaterialThumbnail({
  title,
  contentType,
  previewImageUrl,
  className = "",
}: CourseMaterialThumbnailProps) {
  const icon = getMaterialTypeIcon(contentType);

  if (previewImageUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-md border border-outline-variant/20 bg-surface-container-low ${className}`}
      >
        <img
          alt={`Xem trước ${title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          src={previewImageUrl}
        />
        {contentType === "YOUTUBE" ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <MaterialIcon className="text-[20px] text-white">play_circle</MaterialIcon>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-md border border-outline-variant/20 bg-secondary-container/30 text-secondary ${className}`}
    >
      <MaterialIcon className="text-[18px]">{icon}</MaterialIcon>
    </div>
  );
}
