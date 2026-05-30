import { useCallback, useMemo, useState } from "react";

export function useQuestionSelection(questionIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const allSelected =
    questionIds.length > 0 && questionIds.every((id) => selectedIds.has(id));

  const toggleAll = useCallback(() => {
    setSelectedIds((current) => {
      if (questionIds.every((id) => current.has(id))) {
        return new Set();
      }
      return new Set(questionIds);
    });
  }, [questionIds]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const pruneSelection = useCallback((validIds: string[]) => {
    const valid = new Set(validIds);
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => valid.has(id)));
      return next.size === current.size ? current : next;
    });
  }, []);

  const selectionProps = useMemo(
    () => ({
      selectedIds,
      selectedCount,
      allSelected,
      toggleAll,
      toggleOne,
      clearSelection,
      isSelected: (id: string) => selectedIds.has(id),
    }),
    [
      allSelected,
      clearSelection,
      selectedCount,
      selectedIds,
      toggleAll,
      toggleOne,
    ],
  );

  return { ...selectionProps, pruneSelection };
}
