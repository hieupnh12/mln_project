import { NotFoundPage } from "../shared/components/not-found-page";

export function meta() {
  return [
    { title: "404 | Học LLCT" },
    {
      name: "description",
      content: "The requested page could not be found.",
    },
  ];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
