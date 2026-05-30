import type { SubjectListItem } from "../../types/student.types";

import type { CourseTone, StudentDashboardCourse } from "../../types/student.types";

const SUBJECT_CARD_ICONS = [
  "school",
  "payments",
  "diversity_3",
  "menu_book",
  "history_edu",
] as const;

const SUBJECT_CARD_TONES: CourseTone[] = ["mint", "warm"];

export function mapSubjectToCourseCard(
  subject: SubjectListItem,
  index: number,
): StudentDashboardCourse {
  const tone = SUBJECT_CARD_TONES[index % SUBJECT_CARD_TONES.length];
  const icon = SUBJECT_CARD_ICONS[index % SUBJECT_CARD_ICONS.length];

  return {
    slug: String(subject.id),
    title: subject.title,
    status: subject.code,
    progress: 0,
    lessons: subject.description || "Chưa có mô tả",
    icon,
    tone,
  };
}
