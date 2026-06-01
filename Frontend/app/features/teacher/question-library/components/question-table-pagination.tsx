import { MaterialIcon } from "../../components/teacher-icons";

type QuestionTablePaginationProps = {
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function QuestionTablePagination({
  totalItems,
  rangeStart,
  rangeEnd,
  page,
  totalPages,
  onPageChange,
}: QuestionTablePaginationProps) {
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-label-md text-on-surface-variant">
        Hiển thị {rangeStart} - {rangeEnd} trong số{" "}
        {totalItems.toLocaleString("vi-VN")} câu hỏi
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <PageIconButton
          ariaLabel="Trang trước"
          disabled={page <= 1}
          icon="chevron_left"
          onClick={() => onPageChange(page - 1)}
        />
        {pageNumbers.map((item, index) =>
          item === "ellipsis" ? (
            <span className="px-2 py-1 text-on-surface-variant" key={`e-${index}`}>
              ...
            </span>
          ) : (
            <button
              className={
                item === page
                  ? "rounded-lg bg-primary px-3 py-1 text-label-md font-medium text-on-primary"
                  : "rounded-lg px-3 py-1 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container"
              }
              key={item}
              onClick={() => onPageChange(item)}
              type="button"
            >
              {item}
            </button>
          ),
        )}
        <PageIconButton
          ariaLabel="Trang sau"
          disabled={page >= totalPages}
          icon="chevron_right"
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}

function PageIconButton({
  ariaLabel,
  disabled,
  icon,
  onClick,
}: {
  ariaLabel: string;
  disabled: boolean;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <MaterialIcon className="text-md">{icon}</MaterialIcon>
    </button>
  );
}

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 2, total - 1, total];
  }

  return [1, "ellipsis", current, "ellipsis", total];
}
