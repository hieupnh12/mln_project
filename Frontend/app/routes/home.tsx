import { redirect, useLoaderData } from "react-router";

import { AuthenticatedRedirectFallback } from "~/features/auth/components/authenticated-redirect-fallback";
import { useRedirectAuthenticatedUser } from "~/features/auth/hooks/use-auth-redirect";
import { getAuthenticatedRedirectPath } from "~/features/auth/utils/auth-route-redirect";
import { landingLinks } from "~/features/welcome/constants/landing-seo";
import { HomePage, meta as homeMeta } from "../features/welcome/pages/home-page";
import type { Route } from "./+types/home";

export const meta = ({ data }: Route.MetaArgs) =>
  homeMeta({ canonicalUrl: data?.canonicalUrl });

export const links: Route.LinksFunction = () => landingLinks();

export function loader({ request }: Route.LoaderArgs) {
  const redirectPath = getAuthenticatedRedirectPath(request);

  if (redirectPath) {
    return redirect(redirectPath);
  }

  const url = new URL(request.url);

  return {
    canonicalUrl: `${url.origin}/`,
  };
}

export default function Home() {
  const { isRedirecting, redirectPath } = useRedirectAuthenticatedUser();
  const { canonicalUrl } = useLoaderData<typeof loader>();

  if (isRedirecting) {
    return <AuthenticatedRedirectFallback redirectPath={redirectPath ?? "/student"} />;
  }

  return <HomePage canonicalUrl={canonicalUrl} />;
}
