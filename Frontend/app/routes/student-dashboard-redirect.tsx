import { redirect } from "react-router";

import { STUDENT_ROUTES } from "../features/student/constants/student-routes.constants";

export function loader() {
  return redirect(STUDENT_ROUTES.dashboard);
}

export default function StudentDashboardRedirectRoute() {
  return null;
}
