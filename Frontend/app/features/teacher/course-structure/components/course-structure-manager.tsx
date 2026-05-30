import { chapters } from "../constants/course-structure.constants";
import { ChapterAccordion } from "./chapter-accordion";
import { MaterialIcon } from "../../components/teacher-icons";
import { TeacherVisualGrid } from "../../components/teacher-visual-grid";

export function CourseStructureManager() {
  return (
    <div className="mx-auto max-w-5xl" id="course-structure">
      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-primary">
            Quản lý Chương & Bài học
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Tổ chức lộ trình học tập của bạn một cách trực quan và khoa học.
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm transition hover:shadow-md active:scale-95 sm:w-auto">
          <MaterialIcon>add_circle</MaterialIcon>
          <span className="text-label-md font-medium">Thêm chương mới</span>
        </button>
      </div>

      <ChapterAccordion chapters={chapters} />

      <section className="mt-xl flex flex-col gap-lg rounded-2xl border-l-[8px] border-secondary-container bg-primary-container p-lg text-white shadow-lg md:flex-row md:items-center">
        <div className="flex-1">
          <h5 className="mb-xs text-headline-md font-semibold">
            Mẹo quản lý khóa học
          </h5>
          <p className="text-body-md leading-relaxed opacity-80">
            Chia nhỏ các bài học thành các chương từ 15-20 phút giúp sinh viên
            duy trì sự tập trung cao độ và ghi nhớ kiến thức tốt hơn.
          </p>
        </div>
        <MaterialIcon className="hidden h-16 w-16 text-[64px] text-secondary-container md:inline-flex">
          lightbulb
        </MaterialIcon>
      </section>

      <TeacherVisualGrid />
    </div>
  );
}
