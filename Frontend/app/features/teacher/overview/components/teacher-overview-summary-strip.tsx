import { TEACHER_OVERVIEW_MODULES } from "../constants/teacher-overview.constants";
import { getTeacherModuleMetrics } from "../utils/teacher-overview-metrics";
import type { ModuleMetricsInput } from "../utils/teacher-overview-metrics";
import { TeacherOverviewAddCard } from "./teacher-overview-add-card";
import { TeacherOverviewSummaryCard } from "./teacher-overview-summary-card";

type TeacherOverviewSummaryStripProps = {
  isLoading?: boolean;
  metricsInput: ModuleMetricsInput;
};

export function TeacherOverviewSummaryStrip({
  isLoading = false,
  metricsInput,
}: TeacherOverviewSummaryStripProps) {
  return (
    <section className="mt-6 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TEACHER_OVERVIEW_MODULES.map((module) => {
        const metrics = getTeacherModuleMetrics(module.moduleKey, metricsInput);

        return (
          <TeacherOverviewSummaryCard
            icon={module.icon}
            iconStyle={module.iconStyle}
            isLoading={isLoading}
            key={module.moduleKey}
            label={module.label}
            to={module.to}
            value={metrics.value}
          />
        );
      })}

      <TeacherOverviewAddCard />
    </section>
  );
}
