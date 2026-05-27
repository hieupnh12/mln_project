import { teacherProfile } from "../constants/teacher-dashboard.constants";
import { MaterialIcon } from "./teacher-icons";

export function TeacherTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-background/90 backdrop-blur lg:fixed lg:right-0 lg:w-[calc(100%-16rem)] lg:border-b-0">
      <div className="flex h-auto items-center justify-between gap-4 px-margin-mobile py-md md:px-margin-desktop lg:h-xl">
        <div className="min-w-0">
          <p className="text-label-sm font-semibold uppercase tracking-wider text-secondary lg:hidden">
            Teacher Portal
          </p>
          <h2 className="truncate text-headline-md font-bold text-primary">
            Chào buổi sáng, {teacherProfile.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-md">
          <button
            aria-label="Thông báo"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-secondary-container/50"
          >
            <MaterialIcon>notifications</MaterialIcon>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-white" />
          </button>
          <div className="hidden h-8 w-px bg-outline-variant/30 sm:block" />
          <div className="hidden items-center gap-sm sm:flex">
            <span className="text-label-md font-semibold">
              {teacherProfile.course}
            </span>
            <MaterialIcon className="text-primary-container/60">
              arrow_drop_down
            </MaterialIcon>
          </div>
        </div>
      </div>
    </header>
  );
}
