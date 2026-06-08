import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { Route } from "./+types/root";
import { AsyncActivityBar } from "./shared/components/async-activity-bar";
import { GOOGLE_SITE_VERIFICATION_CODE } from "./shared/constants/site-verification.constants";
import { NotFoundPage } from "./shared/components/not-found-page";
import { AppQueryProvider } from "./shared/providers/query-provider";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="light" lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION_CODE} />
        <Meta />
        <Links />
      </head>
      <body>
        <AppQueryProvider>{children}</AppQueryProvider>
        <AsyncActivityBar />
        <ToastContainer
          className="text-label-md"
          closeButton
          limit={4}
          newestOnTop
          theme="light"
          toastClassName="!rounded-lg !border !border-outline-variant/20 !shadow-sm"
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  let message = "Đã xảy ra lỗi";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="grid min-h-svh place-items-center bg-background px-margin-mobile py-12 text-on-surface">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center">
        <h1 className="font-serif text-headline-md font-bold text-primary">{message}</h1>
        <p className="mt-3 text-body-md text-on-surface-variant">{details}</p>
        {stack && (
          <pre className="mt-6 w-full overflow-x-auto rounded-lg bg-surface-container-low p-4 text-left text-label-sm text-on-surface-variant">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
