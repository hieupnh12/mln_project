import type {
  ChapterDto,
  LessonWithMaterialsDto,
  MaterialDetailDto,
  MaterialSummaryDto,
} from "../types/course-learning-api.types";
import type {
  CourseChapterItem,
  CourseContentType,
  CourseLessonItem,
  CourseMaterialDetail,
  CourseMaterialSummary,
  CourseSlideItem,
} from "../types/course-learning.types";

function readEntityId(
  dto: { LessonId?: number; lessonId?: number; MaterialId?: number; materialId?: number },
  capitalKey: "LessonId" | "MaterialId",
  camelKey: "lessonId" | "materialId",
): number {
  const capital = dto[capitalKey];
  const camel = dto[camelKey];
  const value = capital ?? camel;

  if (value == null || Number.isNaN(Number(value))) {
    throw new Error(`Missing identifier on ${capitalKey}`);
  }

  return Number(value);
}

function mapContentType(value: string): CourseContentType {
  return value === "YOUTUBE" ? "YOUTUBE" : "SLIDE_DECK";
}

function mapMaterialSummary(dto: MaterialSummaryDto): CourseMaterialSummary {
  return {
    id: readEntityId(dto, "MaterialId", "materialId"),
    lessonId: dto.lessonId,
    title: dto.title,
    contentType: mapContentType(dto.contentType),
    slideCount: dto.slideCount ?? null,
    previewImageUrl: dto.previewImageUrl ?? null,
  };
}

export function mapChapterDto(dto: ChapterDto, orderIndex: number): CourseChapterItem {
  return {
    id: dto.chapterId,
    subjectId: dto.subjectId,
    title: dto.title,
    orderIndex,
  };
}

export function mapLessonDto(dto: LessonWithMaterialsDto): CourseLessonItem {
  return {
    id: readEntityId(dto, "LessonId", "lessonId"),
    title: dto.title,
    chapterName: dto.chapterName,
    teacherName: dto.teacherName,
    materials: (dto.materials ?? []).map(mapMaterialSummary),
  };
}

export function mapMaterialDetailDto(dto: MaterialDetailDto): CourseMaterialDetail {
  const slides: CourseSlideItem[] = (dto.slides ?? [])
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
    contentType: mapContentType(dto.contentType),
    resourceUrl: dto.resourceUrl ?? null,
    slideCount: dto.slideCount ?? (slides.length > 0 ? slides.length : null),
    youtubeVideoId: dto.youtubeVideoId ?? null,
    youtubeEmbedUrl: dto.youtubeEmbedUrl ?? null,
    slides,
  };
}
