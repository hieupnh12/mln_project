import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  studentDashboardAccentClasses,
  type StudentDashboardAccent,
} from "../constants/student-dashboard.constants";

type StudentDashboardSectionHeaderProps = {
  accent?: StudentDashboardAccent;
  action?: ReactNode;
  description?: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
};

export function StudentDashboardSectionHeader({
  accent = "red",
  action,
  description,
  eyebrow,
  icon: Icon,
  title,
}: StudentDashboardSectionHeaderProps) {
  const accentClasses = studentDashboardAccentClasses[accent];

  return (
    <motion.header
      className="relative flex min-w-0 flex-col gap-4 border-b border-outline-variant/30 pb-5 sm:flex-row sm:items-end sm:justify-between"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45 }}
      viewport={{ amount: 0.35, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${accentClasses.icon}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className={`text-label-sm font-semibold ${accentClasses.text}`}>
            {eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-headline-md font-semibold text-landing-text sm:text-headline-lg">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-label-md leading-6 text-landing-text-soft sm:text-body-md">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action ? <div className="shrink-0 sm:pb-1">{action}</div> : null}

      <div
        aria-hidden="true"
        className={`absolute bottom-[-1px] left-0 h-0.5 w-20 bg-gradient-to-r ${accentClasses.line}`}
      />
    </motion.header>
  );
}
