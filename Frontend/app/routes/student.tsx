import { StudentLayout } from "../layouts/student-layout";
import { ProtectedRoute } from "../shared/components/protected-route";
import { ROUTE_ACCESS } from "../shared/constants/route-access";

export default function StudentRoute() {
  return (
    <ProtectedRoute allowedRoles={ROUTE_ACCESS.student}>
      <StudentLayout />
    </ProtectedRoute>
  );
}
