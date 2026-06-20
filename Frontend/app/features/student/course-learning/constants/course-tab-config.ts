import { BookOpen, ClipboardCheck, Layers3, PenLine } from "lucide-react";

import type { LearningTab } from "../../types/student.types";
import { studentCourseTabs } from "./student-course.constants";

export const courseTabIcons = {
  lectures: BookOpen,
  flashcards: Layers3,
  practice: PenLine,
  exams: ClipboardCheck,
} satisfies Record<LearningTab, typeof BookOpen>;

export const courseTabItems = studentCourseTabs;

export const COURSE_SIDEBAR_STORAGE_KEY = "student-course-learning-sidebar-collapsed";

export const COURSE_CURRICULUM_SIDEBAR_STORAGE_KEY =
  "student-course-curriculum-sidebar-collapsed";
