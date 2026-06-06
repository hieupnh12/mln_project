const ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".pptx"] as const;
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

export const MATERIAL_FILE_ACCEPT =
  ".png,.jpg,.jpeg,.webp,.pdf,.pptx,image/*";

export function isAcceptedMaterialFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension),
  );

  return hasAcceptedExtension || file.type.startsWith("image/");
}

export function isPdfMaterialFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return lowerName.endsWith(".pdf") || file.type === "application/pdf";
}

export function isPptxMaterialFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return (
    lowerName.endsWith(".pptx") ||
    lowerName.endsWith(".ppt") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.type === "application/vnd.ms-powerpoint"
  );
}

export function isImageMaterialFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return (
    IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension)) ||
    file.type.startsWith("image/")
  );
}

export function getMaterialFilesValidationError(files: File[]): string | null {
  if (files.length <= 1) {
    return null;
  }

  const allPdf = files.every(isPdfMaterialFile);
  const allPptx = files.every(isPptxMaterialFile);
  const allImages = files.every(isImageMaterialFile);

  if (allPdf || allPptx || allImages) {
    return null;
  }

  return "Khi chọn nhiều file, tất cả phải cùng loại (chỉ ảnh, chỉ PDF hoặc chỉ PPTX).";
}

export function filterAcceptedMaterialFiles(fileList: FileList | File[]): File[] {
  return Array.from(fileList).filter(isAcceptedMaterialFile);
}
