import { useEffect, useRef } from "react";

import { useUpdateLessonProgressMutation } from "./use-student-progress-queries";
import type { StudentProgressStatus } from "../types/student-progress.types";

type UseYoutubeLessonProgressOptions = {
  subjectId: number;
  lessonId: number;
  currentStatus: StudentProgressStatus | undefined;
  onLessonCompleted?: () => void;
  enabled?: boolean;
};

/** Video YouTube không có slide — coi như hoàn thành khi mở xem. */
export function useYoutubeLessonProgress({
  subjectId,
  lessonId,
  currentStatus,
  onLessonCompleted,
  enabled = true,
}: UseYoutubeLessonProgressOptions) {
  const { mutateAsync } = useUpdateLessonProgressMutation();
  const mutateAsyncRef = useRef(mutateAsync);
  const completedSentRef = useRef(false);
  const onLessonCompletedRef = useRef(onLessonCompleted);

  mutateAsyncRef.current = mutateAsync;
  onLessonCompletedRef.current = onLessonCompleted;

  useEffect(() => {
    completedSentRef.current = false;
  }, [lessonId]);

  useEffect(() => {
    if (!enabled || currentStatus === "COMPLETED" || completedSentRef.current) {
      return;
    }

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
  }, [currentStatus, enabled, lessonId, subjectId]);
}
