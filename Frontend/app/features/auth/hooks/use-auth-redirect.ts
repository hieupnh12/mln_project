import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { getAuthSession } from "~/shared/services/auth-session.service";
import { getRoleHomePath } from "~/shared/utils/role-home-path";

export function useRedirectAuthenticatedUser() {
  const navigate = useNavigate();
  const redirectPath = useMemo(() => {
    const session = getAuthSession();

    return session ? getRoleHomePath(session.role) : null;
  }, []);

  useEffect(() => {
    if (!redirectPath) {
      return;
    }

    navigate(redirectPath, { replace: true });
  }, [navigate, redirectPath]);

  return {
    isRedirecting: Boolean(redirectPath),
    redirectPath,
  };
}
