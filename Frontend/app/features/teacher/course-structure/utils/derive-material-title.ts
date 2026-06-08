import type { MaterialFormMode } from "../types/course-structure.types";

function stripFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
}

export function deriveMaterialTitle({
  mode,
  lessonTitle,
  files,
}: {
  mode: MaterialFormMode;
  lessonTitle: string;
  files?: File[];
}): string {
  if (mode === "SLIDE_DECK" && files && files.length > 0) {
    const fromFile = stripFileExtension(files[0].name).trim();
    if (fromFile) {
      return fromFile;
    }
  }

  if (mode === "YOUTUBE") {
    return "Video YouTube";
  }

  return lessonTitle.trim() || "Tài liệu";
}
