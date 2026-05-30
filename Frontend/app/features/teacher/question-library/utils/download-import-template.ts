import ExcelJS from "exceljs";

import {
  IMPORT_ANSWER_LETTER_OPTIONS,
  IMPORT_DIFFICULTY_OPTIONS,
  IMPORT_TEMPLATE_FILENAME,
  IMPORT_TEMPLATE_HEADER_LABELS,
  IMPORT_TEMPLATE_HEADERS,
  IMPORT_TEMPLATE_SAMPLE_ROWS,
  IMPORT_TEMPLATE_SHEET_NAME,
  IMPORT_TYPE_OPTIONS,
} from "../constants/import-batch.constants";
import type { LessonOptionDto } from "../types/question-library-api.types";
import { buildImportTemplateSamples } from "./resolve-import-lesson";

const CATALOG_SHEET = "Danh muc";
const GUIDE_SHEET = "Huong dan";
const DATA_ROW_COUNT = 500;

function applyListValidation(
  worksheet: ExcelJS.Worksheet,
  columnIndex: number,
  rangeFormula: string,
  allowBlank = true,
) {
  for (let row = 2; row <= DATA_ROW_COUNT + 1; row += 1) {
    worksheet.getCell(row, columnIndex).dataValidation = {
      type: "list",
      allowBlank,
      formulae: [rangeFormula],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Giá trị không hợp lệ",
      error: "Chọn giá trị từ danh sách có sẵn trong file mẫu.",
    };
  }
}

export async function downloadImportTemplate(lessonOptions: LessonOptionDto[] = []) {
  const sampleSource =
    lessonOptions.length > 0 ? buildImportTemplateSamples(lessonOptions) : IMPORT_TEMPLATE_SAMPLE_ROWS;

  const subjects = [...new Set(lessonOptions.map((item) => item.subjectTitle).filter(Boolean))];
  const chapters = [...new Set(lessonOptions.map((item) => item.chapterTitle).filter(Boolean))];
  const lessons = [...new Set(lessonOptions.map((item) => item.title).filter(Boolean))];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MLN Study";
  workbook.created = new Date();

  const guideSheet = workbook.addWorksheet(GUIDE_SHEET);
  guideSheet.columns = [{ width: 90 }];
  [
    "HƯỚNG DẪN IMPORT CÂU HỎI",
    "",
    "1. Sheet \"Cau hoi\": điền dữ liệu theo các cột tiêu đề.",
    "2. Môn/Chương/Bài: chọn từ dropdown (sheet Danh muc) để tránh sai tên.",
    "3. Dòng để trống Môn/Chương/Bài sẽ dùng bài học mặc định khi import trên web.",
    "4. Loại câu hỏi & Độ khó: chọn từ dropdown.",
    "5. Trắc nghiệm/Đúng-Sai: điền đáp án A-D; cột \"Đáp án đúng\" có thể nhập A/B/C/D hoặc nội dung đáp án.",
    "6. Tự luận/Điền khuyết: có thể để trống option, điền đáp án và giải thích.",
    "7. Không đổi tên cột tiêu đề ở hàng 1.",
  ].forEach((line, index) => {
    guideSheet.getCell(`A${index + 1}`).value = line;
    if (index === 0) {
      guideSheet.getCell("A1").font = { bold: true, size: 14 };
    }
  });

  const catalogSheet = workbook.addWorksheet(CATALOG_SHEET);
  catalogSheet.columns = [
    { header: "Môn học", key: "subject", width: 32 },
    { header: "Chương", key: "chapter", width: 36 },
    { header: "Bài học", key: "lesson", width: 32 },
    { header: "Loại câu hỏi", key: "type", width: 18 },
    { header: "Độ khó", key: "difficulty", width: 14 },
    { header: "Đáp án đúng (A-D)", key: "answerLetter", width: 18 },
  ];

  const catalogRows: Array<Record<string, string>> = [];
  if (lessonOptions.length > 0) {
    lessonOptions.forEach((option) => {
      catalogRows.push({
        subject: option.subjectTitle,
        chapter: option.chapterTitle,
        lesson: option.title,
        type: "",
        difficulty: "",
        answerLetter: "",
      });
    });
  } else {
    catalogRows.push(
      { subject: "Triết học Mác - Lênin", chapter: "Chương 1", lesson: "Bài 1.1", type: "", difficulty: "", answerLetter: "" },
    );
  }

  IMPORT_TYPE_OPTIONS.forEach((type, index) => {
    if (!catalogRows[index]) {
      catalogRows.push({ subject: "", chapter: "", lesson: "", type, difficulty: "", answerLetter: "" });
    } else {
      catalogRows[index].type = type;
    }
  });

  IMPORT_DIFFICULTY_OPTIONS.forEach((difficulty, index) => {
    if (!catalogRows[index]) {
      catalogRows.push({ subject: "", chapter: "", lesson: "", type: "", difficulty, answerLetter: "" });
    } else {
      catalogRows[index].difficulty = difficulty;
    }
  });

  IMPORT_ANSWER_LETTER_OPTIONS.forEach((letter, index) => {
    if (!catalogRows[index]) {
      catalogRows.push({ subject: "", chapter: "", lesson: "", type: "", difficulty: "", answerLetter: letter });
    } else {
      catalogRows[index].answerLetter = letter;
    }
  });

  catalogSheet.addRows(catalogRows);
  catalogSheet.getRow(1).font = { bold: true };

  const subjectCount = Math.max(subjects.length, 1);
  const chapterCount = Math.max(chapters.length, 1);
  const lessonCount = Math.max(lessons.length, 1);
  const typeCount = IMPORT_TYPE_OPTIONS.length;
  const difficultyCount = IMPORT_DIFFICULTY_OPTIONS.length;
  const answerCount = IMPORT_ANSWER_LETTER_OPTIONS.length;

  const worksheet = workbook.addWorksheet(IMPORT_TEMPLATE_SHEET_NAME);
  worksheet.columns = IMPORT_TEMPLATE_HEADERS.map((key) => ({
    header: IMPORT_TEMPLATE_HEADER_LABELS[key],
    key,
    width: key === "content" || key === "explanation" ? 48 : key.startsWith("option") ? 28 : 22,
  }));

  sampleSource.forEach((row) => {
    worksheet.addRow(
      IMPORT_TEMPLATE_HEADERS.reduce<Record<string, string>>((acc, key) => {
        acc[key] = row[key as keyof typeof row] ?? "";
        return acc;
      }, {}),
    );
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  if (subjects.length > 0) {
    applyListValidation(worksheet, 1, `'${CATALOG_SHEET}'!$A$2:$A$${subjectCount + 1}`);
  }
  if (chapters.length > 0) {
    applyListValidation(worksheet, 2, `'${CATALOG_SHEET}'!$B$2:$B$${chapterCount + 1}`);
  }
  if (lessons.length > 0) {
    applyListValidation(worksheet, 3, `'${CATALOG_SHEET}'!$C$2:$C$${lessonCount + 1}`);
  }

  applyListValidation(worksheet, 5, `'${CATALOG_SHEET}'!$D$2:$D$${typeCount + 1}`);
  applyListValidation(worksheet, 6, `'${CATALOG_SHEET}'!$E$2:$E$${difficultyCount + 1}`);
  applyListValidation(worksheet, 12, `'${CATALOG_SHEET}'!$F$2:$F$${answerCount + 1}`, true);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = IMPORT_TEMPLATE_FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
}
