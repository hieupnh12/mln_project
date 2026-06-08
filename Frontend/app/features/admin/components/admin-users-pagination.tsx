import { useEffect, useState } from "react";
import { MaterialIcon } from "./admin-icons";

type AdminUsersPaginationProps = {
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function AdminUsersPagination({
  totalItems,
  rangeStart,
  rangeEnd,
  page,
  totalPages,
  onPageChange,
}: AdminUsersPaginationProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-label-md text-on-surface-variant">
        Hiển thị {rangeStart} - {rangeEnd} trong số{" "}
        {totalItems.toLocaleString("vi-VN")} người dùng
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <PageIconButton
          ariaLabel="Trang đầu"
          disabled={page <= 1}
          icon="first_page"
          onClick={() => onPageChange(1)}
        />
        <PageIconButton
          ariaLabel="Trang trước"
          disabled={page <= 1}
          icon="chevron_left"
          onClick={() => onPageChange(page - 1)}
        />
        <PageNumberInput page={page} totalPages={totalPages} onPageChange={onPageChange} />
        <PageIconButton
          ariaLabel="Trang sau"
          disabled={page >= totalPages}
          icon="chevron_right"
          onClick={() => onPageChange(page + 1)}
        />
        <PageIconButton
          ariaLabel="Trang cuối"
          disabled={page >= totalPages}
          icon="last_page"
          onClick={() => onPageChange(totalPages)}
        />
      </div>
    </div>
  );
}

function PageNumberInput({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [inputValue, setInputValue] = useState(String(page));

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  function commitPageValue() {
    const parsed = Number.parseInt(inputValue.trim(), 10);
    if (Number.isNaN(parsed)) {
      setInputValue(String(page));
      return;
    }

    const nextPage = Math.min(Math.max(1, parsed), totalPages);
    setInputValue(String(nextPage));
    if (nextPage !== page) {
      onPageChange(nextPage);
    }
  }

  return (
    <div className="flex items-center gap-1 px-2">
      <label className="sr-only" htmlFor="admin-users-page-input">
        Nhập số trang
      </label>
      <input
        aria-label={`Trang hiện tại, tổng ${totalPages} trang`}
        className="w-14 rounded-lg border border-outline-variant/30 bg-white px-2 py-1.5 text-center text-label-md font-medium text-on-surface focus:ring-2 focus:ring-primary/20"
        id="admin-users-page-input"
        inputMode="numeric"
        min={1}
        max={totalPages}
        onBlur={commitPageValue}
        onChange={(event) => setInputValue(event.target.value.replace(/[^\d]/g, ""))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitPageValue();
          }
        }}
        type="text"
        value={inputValue}
      />
      <span className="text-label-md text-on-surface-variant">/ {totalPages}</span>
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
