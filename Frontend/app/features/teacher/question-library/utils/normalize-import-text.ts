/** Shared text normalization for import lesson/title matching. */
export function normalizeImportText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

export function isImportTextEqual(left: string, right: string) {
  const a = normalizeImportText(left);
  const b = normalizeImportText(right);
  return a.length > 0 && a === b;
}

export function isImportTextCompatible(left: string, right: string) {
  const a = normalizeImportText(left);
  const b = normalizeImportText(right);
  if (!a || !b) {
    return false;
  }
  return a === b || a.includes(b) || b.includes(a);
}
