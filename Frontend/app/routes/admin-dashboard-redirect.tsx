import { redirect } from "react-router";

import { ADMIN_ROUTES } from "../features/admin/constants/admin-dashboard.constants";

export function loader() {
  return redirect(ADMIN_ROUTES.dashboard);
}

export default function AdminDashboardRedirectRoute() {
  return null;
}
