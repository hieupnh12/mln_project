import { create } from "zustand";

import type {
  AsyncActivityItem,
  AsyncActivityStatus,
  StartAsyncActivityInput,
} from "../types/async-activity.types";

const SUCCESS_DISMISS_MS = 2800;
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

type AsyncActivityStore = {
  activities: AsyncActivityItem[];
  start: (input: StartAsyncActivityInput) => string;
  update: (id: string, patch: Partial<AsyncActivityItem>) => void;
  complete: (id: string, detail?: string) => void;
  fail: (id: string, detail?: string) => void;
  remove: (id: string) => void;
  clearFinished: () => void;
};

function scheduleDismiss(id: string, remove: (activityId: string) => void) {
  const existing = dismissTimers.get(id);
  if (existing) {
    clearTimeout(existing);
  }
  dismissTimers.set(
    id,
    setTimeout(() => {
      dismissTimers.delete(id);
      remove(id);
    }, SUCCESS_DISMISS_MS),
  );
}

function createActivity(input: StartAsyncActivityInput): AsyncActivityItem {
  const id = input.id ?? `activity-${crypto.randomUUID()}`;
  return {
    id,
    label: input.label,
    detail: input.detail,
    progress: input.progress ?? 0,
    indeterminate: input.indeterminate,
    status: "running",
    createdAt: Date.now(),
  };
}

export const useAsyncActivityStore = create<AsyncActivityStore>((set, get) => ({
  activities: [],

  start(input) {
    const activity = createActivity(input);
    set((state) => ({
      activities: [activity, ...state.activities.filter((item) => item.id !== activity.id)],
    }));
    return activity.id;
  },

  update(id, patch) {
    set((state) => ({
      activities: state.activities.map((item) =>
        item.id === id ? { ...item, ...patch, status: patch.status ?? item.status } : item,
      ),
    }));
  },

  complete(id, detail) {
    set((state) => ({
      activities: state.activities.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "success" as AsyncActivityStatus,
              progress: 100,
              indeterminate: false,
              detail: detail ?? item.detail,
            }
          : item,
      ),
    }));
    scheduleDismiss(id, get().remove);
  },

  fail(id, detail) {
    set((state) => ({
      activities: state.activities.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "error" as AsyncActivityStatus,
              indeterminate: false,
              detail: detail ?? item.detail,
            }
          : item,
      ),
    }));
  },

  remove(id) {
    set((state) => ({
      activities: state.activities.filter((item) => item.id !== id),
    }));
  },

  clearFinished() {
    set((state) => ({
      activities: state.activities.filter((item) => item.status === "running"),
    }));
  },
}));
