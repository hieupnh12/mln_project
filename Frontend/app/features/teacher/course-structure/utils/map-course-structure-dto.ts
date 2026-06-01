import type {
  ChapterDto,
  LessonWithMaterialsDto,
  MaterialDetailDto,
  MaterialSummaryDto,
} from "../types/course-structure-api.types";
import type {
  CourseStructureChapter,
  CourseStructureLesson,
  CourseStructureMaterial,
  CourseStructureMaterialDetail,
  CourseStructureSlideItem,
} from "../types/course-structure.types";

function readEntityId(
  dto: { LessonId?: number; lessonId?: number; MaterialId?: number; materialId?: number },
  capitalKey: "LessonId" | "MaterialId",
  camelKey: "lessonId" | "materialId",
): number {
  const value = dto[capitalKey] ?? dto[camelKey];
  if (value == null) {
    throw new Error(`Missing ${capitalKey}`);
  }
  return Number(value);
}

function mapMaterial(dto: MaterialSummaryDto): CourseStructureMaterial {
  return {
    id: readEntityId(dto, "MaterialId", "materialId"),
    lessonId: dto.lessonId,
    title: dto.title,
    contentType: dto.contentType === "YOUTUBE" ? "YOUTUBE" : "SLIDE_DECK",
    slideCount: dto.slideCount ?? null,
    previewImageUrl: dto.previewImageUrl ?? null,
  };
}

export function mapChapterDto(dto: ChapterDto, orderIndex: number): CourseStructureChapter {
  return {
    id: dto.chapterId,
    subjectId: dto.subjectId,
    title: dto.title,
    orderLabel: String(orderIndex).padStart(2, "0"),
  };
}

export function mapLessonDto(dto: LessonWithMaterialsDto): CourseStructureLesson {
  return {
    id: readEntityId(dto, "LessonId", "lessonId"),
    title: dto.title,
    teacherName: dto.teacherName,
    materials: (dto.materials ?? []).map(mapMaterial),
  };
}

export function mapMaterialDetailDto(dto: MaterialDetailDto): CourseStructureMaterialDetail {
  const slides: CourseStructureSlideItem[] = (dto.slides ?? [])
    .slice()
    .sort((a, b) => a.slideIndex - b.slideIndex)
    .map((slide) => ({
      id: slide.slideId,
      index: slide.slideIndex,
      imageUrl: slide.imageUrl,
    }));

  return {
    id: dto.materialId,
    lessonId: dto.lessonId,
    title: dto.title,
    contentType: dto.contentType === "YOUTUBE" ? "YOUTUBE" : "SLIDE_DECK",
    slideCount: dto.slideCount ?? (slides.length > 0 ? slides.length : null),
    youtubeEmbedUrl: dto.youtubeEmbedUrl ?? null,
    slides,
  };
}

export function getMaterialIcon(contentType: CourseStructureMaterial["contentType"]) {
  return contentType === "YOUTUBE" ? "play_circle" : "slideshow";
}

export function getMaterialTypeLabel(contentType: CourseStructureMaterial["contentType"]) {
  return contentType === "YOUTUBE" ? "Video YouTube" : "Slide bài giảng";
}

export function formatLessonSummary(lessonCount: number) {
  return `${lessonCount} bài học`;
}
