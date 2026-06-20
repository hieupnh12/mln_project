import { EXAM_CATALOG_PAGE_SIZE } from "../constants/exam-catalog.constants";

export function ExamCatalogSkeleton() {
  return (
    <div>
      <div className="mb-md h-14 animate-pulse rounded-xl border border-outline-variant/25 bg-landing-white" />
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: EXAM_CATALOG_PAGE_SIZE }).map((_, index) => (
          <div
            className="overflow-hidden rounded-2xl bg-landing-white shadow-md"
            key={index}
          >
            <div className="h-40 animate-pulse bg-gradient-to-br from-secondary via-landing-red/70 to-primary" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-4/5 animate-pulse rounded-lg bg-landing-gray" />
              <div className="h-4 w-28 animate-pulse rounded-lg bg-landing-gray" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((__, starIndex) => (
                  <div
                    className="h-3.5 w-3.5 animate-pulse rounded-sm bg-landing-gray"
                    key={starIndex}
                  />
                ))}
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-4">
                <div className="h-4 w-14 animate-pulse rounded bg-landing-gray" />
                <div className="h-4 w-16 animate-pulse rounded bg-landing-gray" />
                <div className="h-4 w-12 animate-pulse rounded bg-landing-gray" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-full bg-landing-gray" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
