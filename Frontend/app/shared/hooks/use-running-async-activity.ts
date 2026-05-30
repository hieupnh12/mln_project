import { useAsyncActivityStore } from "~/shared/stores/async-activity-store";

export function useRunningAsyncActivity(match: (id: string) => boolean) {
  return useAsyncActivityStore((state) =>
    state.activities.find((item) => item.status === "running" && match(item.id)),
  );
}
