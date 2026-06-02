import ExcelJS from "exceljs";

import {
  WAYGROUND_EXPORT_FILENAME_PREFIX,
  WAYGROUND_HEADERS,
  WAYGROUND_INSTRUCTION_ROW,
  WAYGROUND_SHEET_NAME,
} from "../constants/wayground-export.constants";
import type { WaygroundExportOptions } from "../types/export-exam.types";
import type { QuestionItem } from "../types/question-library.types";
import {
  mapQuestionToWaygroundRow,
  waygroundRowToValues,
} from "./map-question-to-wayground-row";

function buildExportFilename(prefix = WAYGROUND_EXPORT_FILENAME_PREFIX) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `${prefix}-${stamp}.xlsx`;
}

export async function downloadWaygroundExport(
  questions: QuestionItem[],
  options: WaygroundExportOptions,
  filenamePrefix?: string,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MLN Study";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(WAYGROUND_SHEET_NAME);
  worksheet.columns = WAYGROUND_HEADERS.map((header) => ({
    key: header,
    width: header === "Question Text" || header === "Answer explanation" ? 48 : 24,
  }));

  worksheet.addRow([...WAYGROUND_HEADERS]);
  worksheet.addRow([...WAYGROUND_INSTRUCTION_ROW]);

  questions.forEach((question) => {
    const row = mapQuestionToWaygroundRow(question, options);
    worksheet.addRow(waygroundRowToValues(row));
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildExportFilename(filenamePrefix);
  anchor.click();
  URL.revokeObjectURL(url);
}
