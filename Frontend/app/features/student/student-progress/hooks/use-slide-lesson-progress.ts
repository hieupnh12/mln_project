import { useEffect, useRef } from "react";

import { useUpdateLessonProgressMutation } from "./use-student-progress-queries";
import type { StudentProgressStatus } from "../types/student-progress.types";

type UseSlideLessonProgressOptions = {
  subjectId: number;
  lessonId: number;
  activeSlideIndex: number;
  totalSlides: number;
  currentStatus: StudentProgressStatus | undefined;
  enabled?: boolean;
};

export function useSlideLessonProgress({
  subjectId,
  lessonId,
  activeSlideIndex,
  totalSlides,
  currentStatus,
  enabled = true,
}: UseSlideLessonProgressOptions) {
  const { mutate, mutateAsync } = useUpdateLessonProgressMutation();
  const mutateRef = useRef(mutate);
  const mutateAsyncRef = useRef(mutateAsync);
  const inProgressSentRef = useRef(false);
  const completedSentRef = useRef(false);

  mutateRef.current = mutate;
  mutateAsyncRef.current = mutateAsync;

  useEffect(() => {
    inProgressSentRef.current = false;
    completedSentRef.current = false;
  }, [lessonId]);

  useEffect(() => {
    if (!enabled || totalSlides <= 0) {
      return;
    }

    if (currentStatus === "COMPLETED") {
      completedSentRef.current = true;
      return;
    }

    const hasReadAllSlides = activeSlideIndex === totalSlides - 1;

    if (hasReadAllSlides && !completedSentRef.current) {
      completedSentRef.current = true;
      void mutateAsyncRef
        .current({
          subjectId,
          lessonId,
          status: "COMPLETED",
        })
        .catch(() => {
          // Giữ completedSentRef = true — tránh spam API khi backend lỗi.
        });
      return;
    }

    if (
      currentStatus === "NOT_STARTED" &&
      !inProgressSentRef.current &&
      !completedSentRef.current
    ) {
      inProgressSentRef.current = true;
      mutateRef.current(
        {
          subjectId,
          lessonId,
          status: "IN_PROGRESS",
        },
        {
          onError: () => {
            inProgressSentRef.current = false;
          },
        },
      );
    }
  }, [activeSlideIndex, currentStatus, enabled, lessonId, subjectId, totalSlides]);

  const slideProgressPercent =
    totalSlides > 0 ? Math.round(((activeSlideIndex + 1) / totalSlides) * 100) : 0;

  return { slideProgressPercent };
}
