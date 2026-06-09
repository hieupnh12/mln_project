import { Award, Clock3, LibraryBig, TrendingUp } from "lucide-react";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";
import { studentDashboardResources } from "../constants/student-dashboard.constants";

const overviewStats = [
  {
    label: "Điểm trung bình",
    value: "0 / 10",
    icon: TrendingUp,
  },
  {
    label: "Bài kiểm tra đã xong",
    value: "0",
    icon: Award,
  },
  {
    label: "Giờ học tích lũy",
    value: "0",
    icon: Clock3,
  },
] as const;

export function StudentDashboardOverview() {
  return (
    <>
      <section className="space-y-md" id="analytics">
        <div>
          <p className="text-label-md font-semibold text-landing-red">Tiến độ cá nhân</p>
          <h2 className="mt-2 font-serif text-headline-lg font-semibold text-landing-text">
            Tổng quan học tập
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                className="rounded-xl border border-outline-variant/35 bg-landing-white p-5 shadow-lg shadow-landing-text/5 transition hover:-translate-y-1 hover:border-landing-red/20"
                key={stat.label}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-red/10 text-landing-red">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <p className="mt-5 text-2xl font-bold text-landing-text">{stat.value}</p>
                <p className="mt-1 text-label-md text-landing-text-soft">{stat.label}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-md" id="resources">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label-md font-semibold text-landing-red">Thư viện nhanh</p>
            <h2 className="mt-2 font-serif text-headline-lg font-semibold text-landing-text">
              Tài nguyên đề xuất
            </h2>
          </div>
          <LibraryBig aria-hidden="true" className="hidden h-7 w-7 text-landing-gold sm:block" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {studentDashboardResources.map((resource) => (
            <article
              className="flex min-w-0 items-center gap-4 rounded-xl border border-outline-variant/35 bg-landing-cream p-5 transition hover:border-landing-red/20 hover:bg-landing-white"
              key={resource.title}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-landing-white text-landing-red shadow-sm">
                <MaterialIcon>{resource.icon}</MaterialIcon>
              </span>
              <div className="min-w-0">
                <p className="truncate text-label-md font-semibold text-landing-text">
                  {resource.title}
                </p>
                <p className="mt-1 text-label-sm text-landing-text-soft">{resource.type}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
