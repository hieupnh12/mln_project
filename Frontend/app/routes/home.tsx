import { HomePage, meta as homeMeta } from "../features/welcome/pages/home-page";
import type { Route } from "./+types/home";

export const meta = (args: Route.MetaArgs) => homeMeta();

export default function Route() {
  return <HomePage />;
}
