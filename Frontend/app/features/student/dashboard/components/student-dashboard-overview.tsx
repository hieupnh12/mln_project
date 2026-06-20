import { Award, ChartNoAxesCombined, Clock3, TrendingUp } from "lucide-react";

import {
  studentDashboardAccentClasses,
  type StudentDashboardAccent,
} from "../constants/student-dashboard.constants";
import { StudentDashboardSectionHeader } from "./student-dashboard-section-header";

const overviewStats = [
  {
    label: "Điểm trung bình",
    value: "0 / 10",
    icon: TrendingUp,
    accent: "teal",
  },
  {
    label: "Bài kiểm tra đã xong",
    value: "0",
    icon: Award,
    accent: "gold",
  },
  {
    label: "Giờ học tích lũy",
    value: "0",
    icon: Clock3,
    accent: "red",
  },
] as const satisfies ReadonlyArray<{
  accent: StudentDashboardAccent;
  icon: typeof TrendingUp;
  label: string;
  value: string;
}>;

export function StudentDashboardOverview() {
  return (
    <section className="space-y-md scroll-mt-24" id="analytics">
      <StudentDashboardSectionHeader
        accent="teal"
        description="Kết quả và thời lượng học tập của bạn."
        eyebrow="Tiến độ cá nhân"
        icon={ChartNoAxesCombined}
        title="Tổng quan học tập"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          const accent = studentDashboardAccentClasses[stat.accent];

          return (
            <article
              className="group relative overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white p-5 shadow-lg shadow-landing-text/5 transition duration-300 hover:-translate-y-1 hover:border-outline/30 hover:shadow-xl"
              key={stat.label}
            >
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.line}`}
              />
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition group-hover:scale-105 ${accent.icon}`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <span
                  aria-hidden="true"
                  className={`h-8 w-8 rounded-full ${accent.decorative}`}
                />
              </div>
              <p className="mt-5 text-2xl font-bold text-landing-text">{stat.value}</p>
              <p className="mt-1 text-label-md text-landing-text-soft">{stat.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
