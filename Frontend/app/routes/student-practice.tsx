import { Navigate, useParams } from "react-router";

import { getStudentCoursePath } from "../features/student/constants/student-routes.constants";

export function meta() {
  return [{ title: "Luyện tập | ML Learning" }];
}

/** Legacy URL — redirect to course tab Kiểm tra. */
export default function StudentPracticeRoute() {
  const { courseId } = useParams();
  if (!courseId) {
    return <Navigate replace to="/student" />;
  }
  return <Navigate replace to={`${getStudentCoursePath(courseId)}?tab=tests`} />;
}
