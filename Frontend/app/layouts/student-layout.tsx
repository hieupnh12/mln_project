import { Outlet } from "react-router";

import { ProtectedRoute } from "../shared/components/protected-route";
import { ROUTE_ACCESS } from "../shared/constants/route-access";

export function StudentLayout() {
  return (
    <ProtectedRoute allowedRoles={ROUTE_ACCESS.student}>
      <Outlet />
    </ProtectedRoute>
  );
}
