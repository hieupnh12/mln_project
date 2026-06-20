import { MaterialIcon } from "../../components/teacher-icons";

type CourseStructureHeaderProps = {
  onAddSubject: () => void;
  addDisabled?: boolean;
};

export function CourseStructureHeader({ onAddSubject, addDisabled = false }: CourseStructureHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-landing-text">Khóa học</h1>
        <p className="mt-1 max-w-2xl text-body-md text-landing-text-soft">
          Quản lý môn học, chương, bài học và tài liệu theo lộ trình giảng dạy.
        </p>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={addDisabled}
        onClick={onAddSubject}
        type="button"
      >
        <MaterialIcon>add</MaterialIcon>
        <span className="text-label-md font-medium">Thêm môn học</span>
      </button>
    </header>
  );
}
