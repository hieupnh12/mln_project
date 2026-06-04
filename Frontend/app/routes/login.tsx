import { redirect } from "react-router";
import { AuthenticatedRedirectFallback } from "~/features/auth/components/authenticated-redirect-fallback";
import { useRedirectAuthenticatedUser } from "~/features/auth/hooks/use-auth-redirect";
import { getAuthenticatedRedirectPath } from "~/features/auth/utils/auth-route-redirect";
import { LoginPage, meta as loginMeta } from "../features/auth/pages/login-page";
import type { Route } from "./+types/login";

export const meta = loginMeta;

export function loader({ request }: Route.LoaderArgs) {
  const redirectPath = getAuthenticatedRedirectPath(request);

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return null;
}

export default function Route() {
  const { isRedirecting, redirectPath } = useRedirectAuthenticatedUser();

  if (isRedirecting) {
    return <AuthenticatedRedirectFallback redirectPath={redirectPath ?? "/student"} />;
  }

  return <LoginPage />;
}
