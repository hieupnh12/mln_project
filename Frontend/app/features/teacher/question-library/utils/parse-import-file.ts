import * as XLSX from "xlsx";

import { IMPORT_TEMPLATE_HEADER_LABELS, IMPORT_TEMPLATE_HEADERS } from "../constants/import-batch.constants";
import type { ParsedImportFileRow } from "./resolve-import-lesson";

const HEADER_FIELD_MAP: Record<string, keyof ParsedImportFileRow> = {
  content: "content",
  type: "type",
  difficulty: "difficulty",
  tags: "tags",
  subject: "subject",
  chapter: "chapter",
  lesson: "lesson",
  option_a: "optionA",
  option_b: "optionB",
  option_c: "optionC",
  option_d: "optionD",
  correct_answer: "correctAnswer",
  explanation: "explanation",
};

function buildLabelMap() {
  const map = new Map<string, keyof ParsedImportFileRow>();
  for (const [key, label] of Object.entries(IMPORT_TEMPLATE_HEADER_LABELS)) {
    map.set(normalizeHeader(label), HEADER_FIELD_MAP[key] ?? "content");
    map.set(normalizeHeader(key), HEADER_FIELD_MAP[key] ?? "content");
  }
  return map;
}

const LABEL_TO_FIELD = buildLabelMap();

function normalizeHeader(value: string) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function cellValue(value: unknown) {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

function emptyRow(): ParsedImportFileRow {
  return {
    content: "",
    type: "",
    difficulty: "",
    tags: "",
    subject: "",
    chapter: "",
    lesson: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    explanation: "",
  };
}

function mapSheetRow(
  headers: string[],
  values: unknown[],
): ParsedImportFileRow | null {
  const row = emptyRow();

  headers.forEach((header, index) => {
    const field = LABEL_TO_FIELD.get(normalizeHeader(header));
    if (!field) {
      return;
    }
    row[field] = cellValue(values[index]);
  });

  if (!row.content.trim()) {
    return null;
  }

  return row;
}

export async function parseImportFile(file: File): Promise<{
  rows: ParsedImportFileRow[];
  detectedHeaders: string[];
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName =
    workbook.SheetNames.find((name) => normalizeHeader(name) === "cau hoi") ??
    workbook.SheetNames[0];
  if (!sheetName) {
    return { rows: [], detectedHeaders: [] };
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const headerRow = matrix[0]?.map((cell) => cellValue(cell)) ?? [];

  if (matrix.length < 2) {
    return { rows: [], detectedHeaders: headerRow };
  }

  const rows: ParsedImportFileRow[] = [];

  for (let index = 1; index < matrix.length; index += 1) {
    const parsed = mapSheetRow(headerRow, matrix[index] ?? []);
    if (parsed) {
      rows.push(parsed);
    }
  }

  return { rows, detectedHeaders: headerRow };
}

export function getImportTemplateFieldKeys() {
  return IMPORT_TEMPLATE_HEADERS;
}
