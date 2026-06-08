import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { AUTH_ROUTES } from "../constants/auth-session.constants";
import { isPathAllowedForRole } from "../constants/route-access";
import { getAuthSession } from "../services/auth-session.service";
import type { AppUserRole, AuthSession } from "../types/auth-session.types";
import { getRoleHomePath } from "../utils/role-home-path";
import { showInfoToast } from "../utils/toast";
import { PageLoadingShell } from "./page-loading-shell";

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

export function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = AUTH_ROUTES.login,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const session = getAuthSession();

    if (!session) {
      setIsAuthorized(false);
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!isAllowedRole(session, allowedRoles)) {
      setIsAuthorized(false);
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
    return (
      <PageLoadingShell
        description="Vui lòng chờ trong giây lát để hệ thống xác thực tài khoản của bạn..."
        title="Đang kiểm tra quyền truy cập"
      />
    );
  }

  return <>{children}</>;
}
