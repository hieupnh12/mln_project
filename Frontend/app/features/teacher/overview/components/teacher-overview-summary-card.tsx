import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import type { TeacherSummaryIconStyle } from "../constants/teacher-overview.constants";

type TeacherOverviewSummaryCardProps = {
  icon: string;
  iconStyle: TeacherSummaryIconStyle;
  isLoading?: boolean;
  label: string;
  to: string;
  value: number;
};

export function TeacherOverviewSummaryCard({
  icon,
  iconStyle,
  isLoading = false,
  label,
  to,
  value,
}: TeacherOverviewSummaryCardProps) {
  return (
    <Link
      aria-label={`Đi tới ${label}`}
      className="group relative flex min-w-[148px] flex-1 items-center gap-3 rounded-2xl bg-landing-gray/45 p-4 transition duration-300 hover:bg-landing-gray/70"
      to={to}
    >
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-outline-variant/45 bg-landing-white transition group-hover:border-landing-red/35"
      />

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${iconStyle.square}`}
      >
        <MaterialIcon className="text-[22px]">{icon}</MaterialIcon>
      </div>

      <div className="min-w-0 pr-6">
        <p className="text-2xl font-bold leading-none text-landing-text">
          {isLoading ? "..." : value.toLocaleString("vi-VN")}
        </p>
        <p className="mt-1 text-label-sm text-landing-text-soft">{label}</p>
      </div>
    </Link>
  );
}
