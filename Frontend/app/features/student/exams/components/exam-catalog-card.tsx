import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Clock3,
  HelpCircle,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

import type { ExamCard } from "../types/exams.types";
import { EXAM_CATALOG_STYLE } from "../constants/exam-catalog.constants";
import { getCatalogCardHeroTheme } from "../../shared/constants/catalog-card-hero.constants";
import { formatExamDuration } from "../utils/format-exam-duration";

type ExamCatalogCardProps = {
  exam: ExamCard;
  index: number;
  isRetake?: boolean;
  locked?: boolean;
  onStart?: (examId: string) => void;
};

export function ExamCatalogCard({
  exam,
  index,
  isRetake = false,
  locked = false,
  onStart,
}: ExamCatalogCardProps) {
  const reduceMotion = useReducedMotion();
  const isActionable = !locked && onStart != null;
  const indexLabel = String(index + 1).padStart(2, "0");
  const scopeLabel = [exam.chapter, exam.lesson !== "Tất cả bài" ? exam.lesson : null]
    .filter(Boolean)
    .join(" · ");
  const heroTheme = getCatalogCardHeroTheme(index, exam.id);

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-2xl bg-landing-white shadow-md shadow-landing-text/6 transition-shadow duration-300 hover:shadow-xl hover:shadow-landing-text/10"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ amount: 0.12, once: true }}
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div
        className={`relative flex min-h-[10rem] flex-col items-center justify-center overflow-hidden px-5 py-7 text-center ${heroTheme.hero}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/10 blur-2xl"
        />

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-label-sm font-semibold backdrop-blur-sm ${heroTheme.badge}`}
        >
          <ClipboardList className="h-3 w-3" />
          {locked ? "Sắp mở" : "Kiểm tra"}
        </span>

        <Sparkles
          aria-hidden="true"
          className={`pointer-events-none absolute right-4 top-4 h-4 w-4 ${heroTheme.sparkle}`}
        />

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-2 right-3 select-none font-serif text-[5rem] font-bold leading-none ${heroTheme.watermark}`}
        >
          {indexLabel}
        </span>

        <ClipboardList
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 ${heroTheme.deco}`}
          strokeWidth={1}
        />

        <h2
          className={`relative z-10 line-clamp-2 max-w-full font-sans text-lg font-bold leading-snug ${heroTheme.title}`}
        >
          {exam.title}
        </h2>
        <p className={`relative z-10 mt-2 text-label-sm ${heroTheme.subtitle}`}>
          {locked
            ? exam.scheduleLabel || "Chưa mở"
            : `${formatExamDuration(exam.durationMinutes)} · ${exam.questionCount} câu`}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-body-md font-bold leading-snug text-landing-text">
          {exam.title}
        </h3>

        <p className={`mt-1.5 text-label-md font-semibold ${EXAM_CATALOG_STYLE.accent}`}>
          {locked ? "Chưa mở" : isRetake ? "Làm lại bài kiểm tra" : "Đang mở"}
        </p>

        <ExamCatalogStarRow locked={locked} questionCount={exam.questionCount} />

        <ul className="mt-4 flex items-center justify-between gap-2 border-t border-outline-variant/20 pt-4 text-label-sm text-landing-text-soft">
          <li className="inline-flex min-w-0 items-center gap-1.5">
            <HelpCircle
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${EXAM_CATALOG_STYLE.metaIcon}`}
            />
            <span className="truncate">{exam.questionCount} câu</span>
          </li>
          <li className="inline-flex min-w-0 items-center gap-1.5">
            <Clock3
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${EXAM_CATALOG_STYLE.metaIcon}`}
            />
            <span className="truncate">{formatExamDuration(exam.durationMinutes)}</span>
          </li>
          <li className="inline-flex min-w-0 items-center gap-1.5">
            <Target
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${EXAM_CATALOG_STYLE.metaIcon}`}
            />
            <span className="truncate">{exam.passingScore}%</span>
          </li>
        </ul>

        {scopeLabel ? (
          <p className="mt-3 line-clamp-1 text-label-sm text-landing-text-soft">{scopeLabel}</p>
        ) : null}

        <motion.button
          className={
            isActionable
              ? `mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-label-md font-semibold ${EXAM_CATALOG_STYLE.cta}`
              : `mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full px-4 py-2.5 text-label-md font-semibold ${EXAM_CATALOG_STYLE.ctaDisabled}`
          }
          disabled={!isActionable}
          onClick={() => onStart?.(exam.id)}
          type="button"
          whileHover={isActionable && !reduceMotion ? { scale: 1.01 } : undefined}
          whileTap={isActionable && !reduceMotion ? { scale: 0.98 } : undefined}
        >
          {locked ? "Chưa mở" : isRetake ? "Làm lại" : "Làm bài"}
          {isActionable ? (
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          ) : null}
        </motion.button>
      </div>
    </motion.article>
  );
}

function ExamCatalogStarRow({
  locked,
  questionCount,
}: {
  locked: boolean;
  questionCount: number;
}) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, starIndex) => (
        <Star
          aria-hidden="true"
          className={
            locked
              ? `h-3.5 w-3.5 ${EXAM_CATALOG_STYLE.starInactive}`
              : `h-3.5 w-3.5 ${EXAM_CATALOG_STYLE.starActive}`
          }
          key={starIndex}
        />
      ))}
      <span className="ml-1.5 text-label-sm text-landing-text-soft">
        {locked ? "—" : `${questionCount} câu hỏi`}
      </span>
    </div>
  );
}
