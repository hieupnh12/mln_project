import { useEffect, useState } from "react";

import { studentDashboardNavItems } from "../constants/student-dashboard.constants";

const DEFAULT_SECTION_HREF = studentDashboardNavItems[0].href;
const SECTION_OFFSET = 112;

function getActiveSectionHref() {
  const visibleSection = studentDashboardNavItems.reduce<string | null>(
    (activeHref, item) => {
      const section = document.getElementById(item.href.slice(1));

      if (section && section.getBoundingClientRect().top <= SECTION_OFFSET) {
        return item.href;
      }

      return activeHref;
    },
    null,
  );

  return visibleSection ?? DEFAULT_SECTION_HREF;
}

export function useActiveDashboardSection() {
  const [activeHref, setActiveHref] = useState(DEFAULT_SECTION_HREF);

  useEffect(() => {
    let frameId = 0;

    function updateActiveSection() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setActiveHref(getActiveSectionHref());
      });
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, []);

  return activeHref;
}
