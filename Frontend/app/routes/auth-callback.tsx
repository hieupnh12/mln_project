import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { setAuthSession } from "~/shared/services/auth-session.service";
import { AUTH_ROLE_REDIRECTS } from "~/features/auth/constants/auth.constants";
import type { AppUserRole } from "~/shared/types/auth-session.types";

const allowedRoles: readonly AppUserRole[] = ["student", "teacher", "admin"];

function isAppUserRole(value: string | null): value is AppUserRole {
  return allowedRoles.includes(value as AppUserRole);
}

export function meta() {
  return [
    { title: "Xác thực | M-L Master" },
  ];
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getRedirectUrl = (role: AppUserRole) => {
    return AUTH_ROLE_REDIRECTS[role] ?? AUTH_ROLE_REDIRECTS.student;
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role") as string | null;
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_failed");
      return;
    }

    if (!token) {
      console.error("Missing token");
      navigate("/login?error=missing_params");
      return;
    }

    try {
      const normalizedRole: AppUserRole = isAppUserRole(role) ? role : "student";

      // Set auth session with real JWT token
      setAuthSession({
        accessToken: token,
        role: normalizedRole,
      });

      // Redirect based on role
      navigate(getRedirectUrl(normalizedRole), { replace: true });
    } catch (err) {
      console.error("Failed to set auth session:", err);
      navigate("/login?error=auth_failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-outline-variant border-t-primary mx-auto"></div>
        <p className="text-on-surface-variant">Đang xác thực...</p>
      </div>
    </div>
  );
}
