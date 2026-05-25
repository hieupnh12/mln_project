import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NihongoGo - Japanese Learning Demo" },
    {
      name: "description",
      content: "Frontend-only Japanese learning interface for VPS testing.",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
