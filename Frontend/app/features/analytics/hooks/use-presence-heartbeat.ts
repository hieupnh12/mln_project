import { useEffect } from "react";

import { getAuthSession } from "~/shared/services/auth-session.service";

import { PRESENCE_HEARTBEAT_INTERVAL_MS } from "../constants/analytics.constants";
import { sendPresenceHeartbeat } from "../services/analytics.service";

export function usePresenceHeartbeat() {
  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      return;
    }

    const beat = () => {
      if (!getAuthSession()) {
        return;
      }
      void sendPresenceHeartbeat().catch(() => {
        // Presence updates are best-effort.
      });
    };

    beat();
    const intervalId = window.setInterval(beat, PRESENCE_HEARTBEAT_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        beat();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
}
