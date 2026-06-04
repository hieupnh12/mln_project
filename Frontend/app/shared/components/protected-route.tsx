import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { AUTH_ROUTES } from "../constants/auth-session.constants";
import { isPathAllowedForRole } from "../constants/route-access";
import { getAuthSession } from "../services/auth-session.service";
import type { AppUserRole, AuthSession } from "../types/auth-session.types";
import { getRoleHomePath } from "../utils/role-home-path";
import { showInfoToast } from "../utils/toast";

type ProtectedRouteProps = {
  allowedRoles?: readonly AppUserRole[];
  children: ReactNode;
  redirectTo?: string;
};

function isAllowedRole(session: AuthSession, allowedRoles?: readonly AppUserRole[]) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(session.role);
}

function getSafeReturnPath(
  session: AuthSession,
  locationState: unknown,
): string {
  if (
    typeof locationState === "object" &&
    locationState !== null &&
    "from" in locationState &&
    typeof locationState.from === "string" &&
    isPathAllowedForRole(locationState.from, session.role)
  ) {
    return locationState.from;
  }

  return getRoleHomePath(session.role);
}

function ProtectedRouteLoading() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-margin-mobile text-on-surface">
      <div className="w-full max-w-sm rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-md text-center shadow-[0_12px_30px_rgba(35,39,51,0.06)]">
        <p className="text-label-md font-medium text-on-surface-variant">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    </main>
  );
}

export function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = AUTH_ROUTES.login,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getAuthSession();

    if (!session) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!isAllowedRole(session, allowedRoles)) {
      const returnPath = getSafeReturnPath(session, location.state);
      const roleLabel =
        session.role === "teacher"
          ? "giáo viên"
          : session.role === "admin"
            ? "quản trị"
            : "sinh viên";

      showInfoToast(
        `Khu vực này chỉ dành cho ${allowedRoles?.includes("teacher") ? "giáo viên" : allowedRoles?.includes("admin") ? "quản trị viên" : "sinh viên"}. Đã chuyển về khu vực ${roleLabel}.`,
      );
      navigate(returnPath, { replace: true });
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, location.pathname, location.search, location.state, navigate, redirectTo]);

  if (!isAuthorized) {
    return <ProtectedRouteLoading />;
  }

  return <>{children}</>;
}
