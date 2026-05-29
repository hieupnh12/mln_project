import { mindmapNodes } from "../constants/mindmap.constants";
import { MaterialIcon } from "../../components/teacher-icons";

export function MindmapManager() {
  return (
    <div className="mx-auto max-w-6xl">
      <ManagerHeader
        action="Tạo nhánh mới"
        description="Thiết kế sơ đồ tư duy cho từng chương, kéo thả ý chính và gắn tài liệu liên quan."
        icon="add_circle"
        title="Mindmap học phần"
      />

      <div className="grid gap-gutter lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-outline-variant/20 bg-white p-gutter shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <div className="relative min-h-[460px] overflow-hidden rounded-xl bg-surface-container-low p-md">
            <div className="absolute left-1/2 top-8 w-[min(78%,360px)] -translate-x-1/2 rounded-2xl bg-primary-container p-md text-center text-white shadow-lg">
              <p className="text-label-sm font-semibold uppercase tracking-wider text-secondary-container">
                Trung tâm
              </p>
              <h3 className="mt-1 text-headline-md font-semibold">
                Triết học Mác - Lênin
              </h3>
            </div>
            <div className="mt-44 grid gap-md md:grid-cols-3">
              {mindmapNodes.slice(1).map((node) => (
                <article
                  className="rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm"
                  key={node.title}
                >
                  <h4 className="text-headline-md font-semibold text-primary">
                    {node.title}
                  </h4>
                  <p className="mt-2 text-body-md text-on-surface-variant">
                    {node.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {node.children.map((child) => (
                      <span
                        className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary"
                        key={child}
                      >
                        {child}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
          <h3 className="text-headline-md font-semibold text-primary">
            Thuộc tính nhánh
          </h3>
          <label className="block">
            <span className="text-label-md font-medium text-on-surface-variant">
              Tiêu đề
            </span>
            <input
              className="mt-2 w-full rounded-lg border-outline-variant bg-surface-container-low"
              defaultValue="Vật chất & ý thức"
            />
          </label>
          <label className="block">
            <span className="text-label-md font-medium text-on-surface-variant">
              Mô tả
            </span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border-outline-variant bg-surface-container-low"
              defaultValue="Mối quan hệ nền tảng trong vấn đề cơ bản của triết học."
            />
          </label>
          <button className="w-full rounded-lg bg-primary px-md py-sm text-label-md font-medium text-white">
            Lưu thay đổi
          </button>
        </aside>
      </div>
    </div>
  );
}

function ManagerHeader({
  action,
  description,
  icon,
  title,
}: {
  action: string;
  description: string;
  icon: string;
  title: string;
}) {
  return (
    <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-xs">
        <h3 className="text-headline-lg font-semibold text-primary">{title}</h3>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          {description}
        </p>
      </div>
      <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm sm:w-auto">
        <MaterialIcon>{icon}</MaterialIcon>
        <span className="text-label-md font-medium">{action}</span>
      </button>
    </div>
  );
}
