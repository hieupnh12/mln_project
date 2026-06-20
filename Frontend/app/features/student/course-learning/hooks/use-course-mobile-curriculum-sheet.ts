import { useCallback, useState } from "react";

export function useCourseMobileCurriculumSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const openCurriculum = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCurriculum = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    closeCurriculum,
    isOpen,
    openCurriculum,
  };
}
