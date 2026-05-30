import {
  IMPORT_TEMPLATE_HEADER_LABELS,
  IMPORT_TEMPLATE_HEADERS,
} from "../constants/import-batch.constants";
import type { ImportFieldMapping } from "../types/import-batch.types";

function normalizeHeader(value: string) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const SYSTEM_FIELDS = IMPORT_TEMPLATE_HEADERS.map((key) => ({
  key,
  label: IMPORT_TEMPLATE_HEADER_LABELS[key],
}));

export function buildImportColumnMappings(detectedHeaders: string[]): ImportFieldMapping[] {
  const normalizedDetected = detectedHeaders.map((header) => ({
    raw: header,
    normalized: normalizeHeader(header),
  }));

  return SYSTEM_FIELDS.map(({ key, label }) => {
    const labelNormalized = normalizeHeader(label);
    const keyNormalized = normalizeHeader(key);

    const matched = normalizedDetected.find(
      (header) =>
        header.normalized === labelNormalized ||
        header.normalized === keyNormalized ||
        header.normalized.includes(labelNormalized) ||
        labelNormalized.includes(header.normalized),
    );

    return {
      id: key,
      systemField: key,
      systemLabel: label,
      excelColumn: matched?.raw ?? null,
      matched: Boolean(matched),
    };
  });
}

export function countMatchedColumns(mappings: ImportFieldMapping[]) {
  return mappings.filter((item) => item.matched).length;
}
