import { Link } from "react-router";

import {
  getStudentCoursePath,
  getStudentCoursePracticeTabPath,
} from "../../../constants/student-routes.constants";

type ExamReviewNextStepsProps = {
  courseId: string;
  wrongCount: number;
};

export function ExamReviewNextSteps({ courseId, wrongCount }: ExamReviewNextStepsProps) {
  return (
    <div className="grid grid-cols-1 gap-gutter py-8 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-xl bg-secondary-container/40 p-8">
        <div>
          <h4 className="mb-2 text-headline-md font-semibold text-on-secondary-fixed-variant">
            Chủ đề cần cải thiện
          </h4>
          <p className="text-body-md text-on-secondary-fixed-variant/90">
            {wrongCount > 0
              ? `Bạn trả lời sai ${wrongCount} câu. Hãy ôn lại phần kiến thức liên quan.`
              : "Bạn đã trả lời đúng tất cả. Có thể thử làm lại để củng cố."}
          </p>
        </div>
        <Link
          className="mt-6 inline-flex w-fit rounded-lg bg-secondary px-6 py-2 text-label-md text-on-secondary transition-transform active:scale-95"
          to={getStudentCoursePracticeTabPath(courseId)}
        >
          Ôn tập ngay
        </Link>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container-high/60 p-8">
        <div>
          <h4 className="mb-2 text-headline-md font-semibold text-primary">Tài liệu tham khảo</h4>
          <p className="text-body-md text-on-surface-variant">
            Xem lại bài giảng và flashcard trong khóa học để củng cố kiến thức.
          </p>
        </div>
        <Link
          className="mt-6 inline-flex w-fit rounded-lg bg-primary px-6 py-2 text-label-md text-on-primary transition-transform active:scale-95"
          to={`${getStudentCoursePath(courseId)}?tab=flashcards`}
        >
          Xem Flashcards
        </Link>
      </div>
    </div>
  );
}
