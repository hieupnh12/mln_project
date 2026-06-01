const SKELETON_ROW_COUNT = 10;

export function QuestionTableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <tr className="animate-pulse" key={`question-skeleton-${index}`}>
          <td className="px-4 py-4">
            <div className="mx-auto h-4 w-4 rounded bg-surface-container-high" />
          </td>
          <td className="px-3 py-4">
            <div className="mx-auto h-4 w-10 rounded bg-surface-container-high" />
          </td>
          <td className="px-4 py-4">
            <div className="space-y-2">
              <div className="h-4 w-full max-w-md rounded bg-surface-container-high" />
              <div className="h-3 w-32 rounded bg-surface-container-high md:hidden" />
            </div>
          </td>
          <td className="hidden px-3 py-4 md:table-cell">
            <div className="h-4 w-24 rounded bg-surface-container-high" />
          </td>
          <td className="px-3 py-4">
            <div className="mx-auto h-6 w-16 rounded-full bg-surface-container-high" />
          </td>
          <td className="hidden px-3 py-4 sm:table-cell">
            <div className="h-4 w-20 rounded bg-surface-container-high" />
          </td>
          <td className="px-3 py-4">
            <div className="h-4 w-20 rounded bg-surface-container-high" />
          </td>
          <td className="px-3 py-4">
            <div className="ml-auto flex justify-end gap-1">
              <div className="h-8 w-8 rounded-lg bg-surface-container-high" />
              <div className="h-8 w-8 rounded-lg bg-surface-container-high" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
