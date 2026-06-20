export function getCourseMainLeftPaddingClass(leftSidebarCollapsed: boolean) {
  return leftSidebarCollapsed ? "md:pl-[4.5rem]" : "md:pl-56 lg:pl-60";
}

export function getCourseMainRightPaddingClass(
  curriculumCollapsed: boolean,
  showCurriculumSidebar: boolean,
) {
  if (!showCurriculumSidebar) {
    return "";
  }

  return curriculumCollapsed ? "xl:pr-[4.5rem]" : "xl:pr-[340px]";
}
