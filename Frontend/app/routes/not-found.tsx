import { NotFoundPage } from "../shared/components/not-found-page";

export function meta() {
  return [
    { title: "404 | M-L Master" },
    {
      name: "description",
      content: "The requested page could not be found.",
    },
  ];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
