import { useEffect, useRef } from "react";

import { useUpdateLessonProgressMutation } from "./use-student-progress-queries";
import type { StudentProgressStatus } from "../types/student-progress.types";

type UseSlideLessonProgressOptions = {
  subjectId: number;
  lessonId: number;
  activeSlideIndex: number;
  totalSlides: number;
  currentStatus: StudentProgressStatus | undefined;
  onLessonCompleted?: () => void;
  enabled?: boolean;
};

export function useSlideLessonProgress({
  subjectId,
  lessonId,
  activeSlideIndex,
  totalSlides,
  currentStatus,
  onLessonCompleted,
  enabled = true,
}: UseSlideLessonProgressOptions) {
  const { mutate, mutateAsync } = useUpdateLessonProgressMutation();
  const mutateRef = useRef(mutate);
  const mutateAsyncRef = useRef(mutateAsync);
  const inProgressSentRef = useRef(false);
  const completedSentRef = useRef(false);
  const onLessonCompletedRef = useRef(onLessonCompleted);

  mutateRef.current = mutate;
  mutateAsyncRef.current = mutateAsync;
  onLessonCompletedRef.current = onLessonCompleted;

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
        .then(() => onLessonCompletedRef.current?.())
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
