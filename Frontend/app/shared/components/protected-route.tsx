import { useEffect, useState, type ReactNode } from "react";

import { AUTH_ROUTES } from "../constants/auth-session.constants";
import { getAuthSession } from "../services/auth-session.service";
import type { AppUserRole, AuthSession } from "../types/auth-session.types";

type ProtectedRouteProps = {
  allowedRoles?: readonly AppUserRole[];
  children: ReactNode;
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
};

function isAllowedRole(session: AuthSession, allowedRoles?: readonly AppUserRole[]) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(session.role);
}

function ProtectedRouteLoading() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-margin-mobile text-on-surface">
      <div className="w-full max-w-sm rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-md text-center shadow-[0_12px_30px_rgba(35,39,51,0.06)]">
        <p className="text-label-md font-medium text-on-surface-variant">
          Dang kiem tra quyen truy cap...
        </p>
      </div>
    </main>
  );
}

export function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = AUTH_ROUTES.login,
  unauthorizedRedirectTo = AUTH_ROUTES.unauthorized,
}: ProtectedRouteProps) {
  const [session, setSession] = useState<AuthSession | null>();

  useEffect(() => {
    const nextSession = getAuthSession();

    if (!nextSession) {
      window.location.replace(redirectTo);
      return;
    }

    if (!isAllowedRole(nextSession, allowedRoles)) {
      window.location.replace(unauthorizedRedirectTo);
      return;
    }

    setSession(nextSession);
  }, [allowedRoles, redirectTo, unauthorizedRedirectTo]);

  if (session === undefined) {
    return <ProtectedRouteLoading />;
  }

  if (!session) {
    return <ProtectedRouteLoading />;
  }

  return children;
}
