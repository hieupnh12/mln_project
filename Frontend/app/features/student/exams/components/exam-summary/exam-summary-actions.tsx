import { Link, useNavigate } from "react-router";

import { StudentMaterialIcon as MaterialIcon } from "../../../components/student-material-icon";
import {
  getStudentCourseExamsTabPath,
  getStudentExamSessionPath,
  STUDENT_ROUTES,
} from "../../../constants/student-routes.constants";

type ExamSummaryActionsProps = {
  courseId: string;
  quizId: string;
  passed: boolean;
};

export function ExamSummaryActions({ courseId, quizId, passed }: ExamSummaryActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-xl flex flex-col items-center justify-center gap-md md:flex-row">
      {!passed ? (
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-xl py-md text-label-md text-on-primary transition-all hover:opacity-90 active:scale-95 md:w-auto"
          onClick={() => navigate(getStudentExamSessionPath(courseId, quizId))}
          type="button"
        >
          <MaterialIcon>restart_alt</MaterialIcon>
          Làm lại bài kiểm tra
        </button>
      ) : (
        <Link
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-xl py-md text-label-md text-on-primary transition-all hover:opacity-90 md:w-auto"
          to={getStudentCourseExamsTabPath(courseId)}
        >
          <MaterialIcon>menu_book</MaterialIcon>
          Về danh sách kiểm tra
        </Link>
      )}
      {!passed ? (
        <Link
          className="flex w-full items-center justify-center gap-2 rounded-lg px-xl py-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container md:w-auto"
          to={getStudentCourseExamsTabPath(courseId)}
        >
          <MaterialIcon>list</MaterialIcon>
          Danh sách kiểm tra
        </Link>
      ) : null}
      <Link
        className="flex w-full items-center justify-center gap-2 rounded-lg px-xl py-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container md:w-auto"
        to={STUDENT_ROUTES.dashboard}
      >
        <MaterialIcon>home</MaterialIcon>
        Về trang chủ
      </Link>
    </div>
  );
}
