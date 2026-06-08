import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import type { StudentProgressStatus } from "../types/student-progress.types";

type LessonProgressStatusBadgeProps = {
  status: StudentProgressStatus;
};

export function LessonProgressStatusBadge({ status }: LessonProgressStatusBadgeProps) {
  if (status === "COMPLETED") {
    return (
      <MaterialIcon className="shrink-0 text-sm text-secondary" filled>
        check_circle
      </MaterialIcon>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <span className="shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
        Đang học
      </span>
    );
  }

  return null;
}
