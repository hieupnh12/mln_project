import { Navigate, useParams } from "react-router";

import { getStudentCoursePracticeTabPath } from "../features/student/constants/student-routes.constants";

export function meta() {
  return [{ title: "Luyện tập | ML Learning" }];
}

/** Legacy URL — redirect to course tab Luyện tập. */
export default function StudentPracticeRoute() {
  const { courseId } = useParams();
  if (!courseId) {
    return <Navigate replace to="/student" />;
  }
  return <Navigate replace to={getStudentCoursePracticeTabPath(courseId)} />;
}
