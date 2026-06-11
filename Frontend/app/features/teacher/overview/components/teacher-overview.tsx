import { Link } from "react-router";

import { useTeacherSubjectsQuery } from "../../course-structure/hooks/use-course-structure-queries";
import { MaterialIcon } from "../../components/teacher-icons";
import { useTeacherFlashcardSets } from "../../hooks/use-flashcards";
import {
  useQuestionStatsQuery,
  useQuestionsQuery,
} from "../../question-library/hooks/use-question-library-queries";
import type { QuestionFilters } from "../../question-library/types/question-library.types";
import { useQuizStatsQuery } from "../../quiz-management/hooks/use-quiz-management-queries";

const DASHBOARD_QUESTION_FILTERS: QuestionFilters = {
  search: "",
  course: "all",
  chapter: "all",
  lesson: "all",
  difficulty: "all",
  type: "all",
  status: "all",
};

export function TeacherOverview() {
  const subjectsQuery = useTeacherSubjectsQuery();
  const flashcardSetsQuery = useTeacherFlashcardSets();
  const questionStatsQuery = useQuestionStatsQuery();
  const recentQuestionsQuery = useQuestionsQuery(DASHBOARD_QUESTION_FILTERS, 1, 5);
  const quizStatsQuery = useQuizStatsQuery();

  const totalFlashcards =
    flashcardSetsQuery.data?.reduce((total, set) => total + set.cards, 0) ?? 0;

  const hasStatsError =
    subjectsQuery.isError ||
    flashcardSetsQuery.isError ||
    questionStatsQuery.isError ||
    recentQuestionsQuery.isError ||
    quizStatsQuery.isError;

  return (
    <div className="mx-auto max-w-6xl space-y-md">
      <div className="space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">
          Dashboard
        </h3>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Tổng quan nhanh các học liệu, bài học và hoạt động kiểm tra của khóa.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="account_tree"
          isLoading={subjectsQuery.isLoading}
          label="Khóa học"
          to="/teacher/courses"
          value={subjectsQuery.data?.length ?? 0}
        />
        <MetricCard
          icon="database"
          isLoading={questionStatsQuery.isLoading}
          label="Câu hỏi"
          to="/teacher/questions"
          value={questionStatsQuery.data?.totalQuestions ?? 0}
        />
        <MetricCard
          icon="style"
          isLoading={flashcardSetsQuery.isLoading}
          label="Flashcard"
          to="/teacher/flashcards"
          value={totalFlashcards}
        />
        <MetricCard
          icon="task"
          isLoading={quizStatsQuery.isLoading}
          label="Quiz"
          to="/teacher/quizzes"
          value={quizStatsQuery.data?.total ?? 0}
        />
      </section>

      {hasStatsError ? (
        <div className="rounded-xl border border-error/25 bg-error-container p-sm text-label-md font-medium text-on-error-container">
          Không thể tải một phần dữ liệu thống kê. Vui lòng thử lại sau.
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <h4 className="mb-md text-headline-md font-semibold text-primary">
            Câu hỏi mới trong ngân hàng
          </h4>
          <div className="space-y-sm">
            {recentQuestionsQuery.isLoading ? (
              <div className="rounded-xl bg-surface-container-low p-sm text-body-md font-medium text-on-surface-variant">
                Đang tải danh sách câu hỏi...
              </div>
            ) : null}

            {!recentQuestionsQuery.isLoading &&
            !recentQuestionsQuery.isError &&
            recentQuestionsQuery.data?.items.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low p-sm text-body-md font-medium text-on-surface-variant">
                Chưa có câu hỏi nào trong ngân hàng.
              </div>
            ) : null}

            {recentQuestionsQuery.data?.items.map((item) => (
              <article
                className="rounded-xl bg-surface-container-low p-sm"
                key={item.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label-sm font-semibold text-secondary">
                    {item.id}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                    {item.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-body-md font-medium text-primary">
                  {item.question}
                </p>
                <p className="mt-1 text-label-sm font-medium text-on-surface-variant">
                  {item.course} / {item.chapter} / {item.lesson}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border-l-[6px] border-secondary-container bg-primary-container p-md text-white shadow-lg">
          <MaterialIcon className="mb-md h-12 w-12 text-[48px] text-secondary-container">
            lightbulb
          </MaterialIcon>
          <h4 className="text-headline-md font-semibold">
            Gợi ý vận hành
          </h4>
          <p className="mt-2 text-body-md text-secondary-container">
            Nên cập nhật mindmap và flashcard ngay sau khi hoàn tất từng chương
            để sinh viên ôn tập theo đúng tiến độ.
          </p>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  isLoading = false,
  label,
  to,
  value,
}: {
  icon: string;
  isLoading?: boolean;
  label: string;
  to: string;
  value: number;
}) {
  return (
    <Link
      aria-label={`Đi tới ${label}`}
      className="group rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)] transition hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-[0_10px_28px_rgba(35,39,51,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      to={to}
    >
      <div className="mb-md flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
        <MaterialIcon>{icon}</MaterialIcon>
      </div>
      <strong className="text-headline-lg font-semibold text-primary">
        {isLoading ? "..." : value.toLocaleString("vi-VN")}
      </strong>
      <p className="text-label-md font-medium text-on-surface-variant">
        {label}
      </p>
    </Link>
  );
}
