import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import type { QuestionListItem } from "../../question-library/types/question-library.types";
import { showInfoToast } from "~/shared/utils/toast";
import {
  TEACHER_OVERVIEW_ROW_SHADOW,
  TEACHER_QUESTION_DIFFICULTY_BADGE,
  TEACHER_QUESTION_STATUS_BADGE,
} from "../constants/teacher-overview.constants";

type TeacherOverviewQuestionRowProps = {
  item: QuestionListItem;
};

function copyCoursePath(item: QuestionListItem) {
  const path = `${item.course} / ${item.chapter} / ${item.lesson}`;

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(path).then(() => {
      showInfoToast("Đã sao chép vị trí câu hỏi.");
    });
    return;
  }

  showInfoToast(path);
}

export function TeacherOverviewQuestionRow({ item }: TeacherOverviewQuestionRowProps) {
  const coursePath = `${item.course} / ${item.chapter}`;

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl bg-landing-gray/35 p-4 lg:flex-row lg:items-center ${TEACHER_OVERVIEW_ROW_SHADOW}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-landing-red/10 text-landing-red">
          <MaterialIcon className="text-[22px]">quiz</MaterialIcon>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-landing-text">{item.id}</p>
          <p className="line-clamp-1 text-label-sm text-landing-text-soft">{item.question}</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-label-sm text-landing-text-soft lg:w-[220px]">
        <span className="truncate">{coursePath}</span>
        <button
          aria-label={`Sao chép vị trí ${item.id}`}
          className="shrink-0 rounded-lg p-1 text-landing-text-soft transition hover:bg-landing-white hover:text-landing-red"
          onClick={() => copyCoursePath(item)}
          type="button"
        >
          <MaterialIcon className="text-[18px]">content_copy</MaterialIcon>
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-label-sm text-landing-text-soft lg:w-[180px]">
        <span className="truncate">{item.lesson}</span>
        <Link
          aria-label={`Mở ngân hàng câu hỏi — ${item.id}`}
          className="shrink-0 rounded-lg p-1 text-landing-text-soft transition hover:bg-landing-white hover:text-landing-red"
          to={TEACHER_ROUTES.questions}
        >
          <MaterialIcon className="text-[18px]">open_in_new</MaterialIcon>
        </Link>
      </div>

      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-label-sm font-medium ${TEACHER_QUESTION_DIFFICULTY_BADGE[item.difficulty]}`}
      >
        {item.difficulty}
      </span>

      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-label-sm font-medium ${TEACHER_QUESTION_STATUS_BADGE[item.status]}`}
      >
        {item.status === "Đã xuất bản" ? "Đã duyệt" : item.status}
      </span>

      <div className="flex items-center gap-2 lg:ml-auto">
        <span className="hidden text-label-sm text-landing-text-soft xl:inline">{item.type}</span>
        <Link
          aria-label={`Tùy chọn ${item.id}`}
          className="rounded-lg p-1.5 text-landing-text-soft transition hover:bg-landing-white hover:text-landing-red"
          to={TEACHER_ROUTES.questions}
        >
          <MaterialIcon>more_vert</MaterialIcon>
        </Link>
      </div>
    </article>
  );
}
