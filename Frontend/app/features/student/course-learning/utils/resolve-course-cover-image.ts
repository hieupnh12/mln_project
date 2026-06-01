import defaultCourseCover from "../../../../../image/van-de-co-ban-cua-triet-hoc.jpg";

const COURSE_COVER_BY_KEYWORD: Array<{ keyword: string; imageUrl: string }> = [
  { keyword: "triết", imageUrl: defaultCourseCover },
  { keyword: "triet", imageUrl: defaultCourseCover },
];

export function resolveCourseCoverImage(subjectTitle: string) {
  const normalized = subjectTitle.trim().toLowerCase();

  const matched = COURSE_COVER_BY_KEYWORD.find((entry) =>
    normalized.includes(entry.keyword),
  );

  return matched?.imageUrl ?? defaultCourseCover;
}

export function getMaterialTypeLabel(contentType: "SLIDE_DECK" | "YOUTUBE") {
  return contentType === "YOUTUBE" ? "Video YouTube" : "Slide bài giảng";
}

export function getMaterialTypeIcon(contentType: "SLIDE_DECK" | "YOUTUBE") {
  return contentType === "YOUTUBE" ? "play_circle" : "slideshow";
}
