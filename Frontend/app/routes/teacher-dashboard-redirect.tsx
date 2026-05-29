import { redirect } from "react-router";

import { TEACHER_ROUTES } from "../features/teacher/constants/teacher-dashboard.constants";

export function loader() {
  return redirect(TEACHER_ROUTES.dashboard);
}

export default function TeacherDashboardRedirectRoute() {
  return null;
}
