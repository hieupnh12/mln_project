import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { recordPageView } from "../services/analytics.service";

export function usePageViewTracker() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (lastPathRef.current === path) {
      return;
    }
    lastPathRef.current = path;

    void recordPageView(path).catch(() => {
      // Tracking must not interrupt UX.
    });
  }, [location.pathname, location.search]);
}
