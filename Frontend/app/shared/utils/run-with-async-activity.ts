import { useAsyncActivityStore } from "../stores/async-activity-store";
import type { StartAsyncActivityInput } from "../types/async-activity.types";

type ProgressUpdater = (progress: number, detail?: string) => void;

type RunWithAsyncActivityOptions<T> = StartAsyncActivityInput & {
  task: (updateProgress: ProgressUpdater) => Promise<T>;
  simulateProgress?: boolean;
};

export async function runWithAsyncActivity<T>({
  task,
  simulateProgress = false,
  ...startInput
}: RunWithAsyncActivityOptions<T>): Promise<T> {
  const store = useAsyncActivityStore.getState();
  const activityId = store.start({ ...startInput, progress: startInput.progress ?? 5 });

  const updateProgress: ProgressUpdater = (progress, detail) => {
    store.update(activityId, {
      progress: Math.min(100, Math.max(0, progress)),
      detail,
      indeterminate: false,
    });
  };

  let progressTimer: ReturnType<typeof setInterval> | undefined;

  if (simulateProgress) {
    progressTimer = setInterval(() => {
      const current = useAsyncActivityStore
        .getState()
        .activities.find((item) => item.id === activityId);
      if (!current || current.status !== "running") {
        return;
      }
      if (current.progress < 88) {
        updateProgress(current.progress + 4 + Math.random() * 6);
      }
    }, 350);
  }

  try {
    const result = await task(updateProgress);
    if (progressTimer) {
      clearInterval(progressTimer);
    }
    store.complete(activityId);
    return result;
  } catch (error) {
    if (progressTimer) {
      clearInterval(progressTimer);
    }
    const message = error instanceof Error ? error.message : "Thao tác thất bại";
    store.fail(activityId, message);
    throw error;
  }
}
