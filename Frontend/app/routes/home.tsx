import { redirect } from "react-router";

import { AuthenticatedRedirectFallback } from "~/features/auth/components/authenticated-redirect-fallback";
import { useRedirectAuthenticatedUser } from "~/features/auth/hooks/use-auth-redirect";
import { getAuthenticatedRedirectPath } from "~/features/auth/utils/auth-route-redirect";
import { HomePage, meta as homeMeta } from "../features/welcome/pages/home-page";
import type { Route } from "./+types/home";

export const meta = (args: Route.MetaArgs) => homeMeta();

export function loader({ request }: Route.LoaderArgs) {
  const redirectPath = getAuthenticatedRedirectPath(request);

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return null;
}

export default function Home() {
  const { isRedirecting, redirectPath } = useRedirectAuthenticatedUser();

  if (isRedirecting) {
    return <AuthenticatedRedirectFallback redirectPath={redirectPath ?? "/student"} />;
  }

  return <HomePage />;
}
