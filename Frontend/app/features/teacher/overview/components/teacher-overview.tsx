import { flashcardSets } from "../../flashcard/constants/flashcard.constants";
import { pdfDocuments } from "../../pdf-document/constants/pdf-document.constants";
import { questionItems } from "../../question-library/constants/question-library.constants";
import { quizItems } from "../../quiz-management/constants/quiz-management.constants";
import { MaterialIcon } from "../../components/teacher-icons";

export function TeacherOverview() {
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
        <MetricCard icon="account_tree" label="Chương học" value={0} />
        <MetricCard icon="picture_as_pdf" label="Tài liệu PDF" value={pdfDocuments.length} />
        <MetricCard icon="style" label="Bộ flashcard" value={flashcardSets.length} />
        <MetricCard icon="task" label="Quiz" value={quizItems.length} />
      </section>

      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <h4 className="mb-md text-headline-md font-semibold text-primary">
            Câu hỏi cần rà soát
          </h4>
          <div className="space-y-sm">
            {questionItems.map((item) => (
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
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <div className="mb-md flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
        <MaterialIcon>{icon}</MaterialIcon>
      </div>
      <strong className="text-headline-lg font-semibold text-primary">
        {value}
      </strong>
      <p className="text-label-md font-medium text-on-surface-variant">
        {label}
      </p>
    </article>
  );
}
