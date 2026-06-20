import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";

export function TeacherOverviewAddCard() {
  return (
    <Link
      aria-label="Thêm câu hỏi mới"
      className="flex min-w-[120px] flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-landing-red/25 bg-landing-white/60 p-4 text-landing-text-soft transition hover:border-landing-red/45 hover:bg-landing-red/5 hover:text-landing-red"
      to={TEACHER_ROUTES.questions}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red">
          <MaterialIcon className="text-[26px]">add</MaterialIcon>
        </span>
        <span className="text-label-sm font-semibold">Thêm câu hỏi</span>
      </div>
    </Link>
  );
}
