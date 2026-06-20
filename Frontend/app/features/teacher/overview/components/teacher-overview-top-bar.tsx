import { MaterialIcon } from "../../components/teacher-icons";

type TeacherOverviewTopBarProps = {
  onSearchChange: (value: string) => void;
  search: string;
};

export function TeacherOverviewTopBar({ onSearchChange, search }: TeacherOverviewTopBarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-landing-text">Tổng quan</h1>
        <p className="mt-1 text-label-md text-landing-text-soft">
          Quản lý học liệu và ngân hàng câu hỏi.
        </p>
      </div>

      <label className="relative w-full max-w-md">
        <span className="sr-only">Tìm kiếm câu hỏi</span>
        <MaterialIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-landing-text-soft">
          search
        </MaterialIcon>
        <input
          className="w-full rounded-full border-0 bg-landing-gray/80 py-3 pl-11 pr-4 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/20 transition placeholder:text-landing-text-soft focus:ring-landing-red/30"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm câu hỏi..."
          type="search"
          value={search}
        />
      </label>
    </header>
  );
}
