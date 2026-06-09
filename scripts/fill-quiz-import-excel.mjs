import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATE_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi.xlsx";
const OUTPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111-quiz.xlsx";
const DOCX_XML_PATH = "C:/Users/Admin/Downloads/_docx_extract/content/word/document.xml";

const SUBJECT = "Triết học Mác - Lênin";

const CHAPTER_MAP = {
  "CHƯƠNG 1": "KHÁI LUẬN VỀ TRIẾT HỌC  VÀ TRIẾT HỌC MÁC - LÊNIN",
  "CHƯƠNG 2": "CHỦ NGHĨA DUY VẬT BIỆN CHỨNG",
  "CHƯƠNG 3": "CHỦ NGHĨA DUY VẬT LỊCH SỬ",
};

const CHAPTER_TAGS = {
  "KHÁI LUẬN VỀ TRIẾT HỌC  VÀ TRIẾT HỌC MÁC - LÊNIN": "Chương 1, MLN111",
  "CHỦ NGHĨA DUY VẬT BIỆN CHỨNG": "Chương 2, MLN111",
  "CHỦ NGHĨA DUY VẬT LỊCH SỬ": "Chương 3, MLN111",
};

function extractParagraphs(xml) {
  const paragraphs = [];
  const paragraphRegex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  let match;

  while ((match = paragraphRegex.exec(xml)) !== null) {
    const texts = [...match[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((item) => item[1]);
    if (texts.length > 0) {
      paragraphs.push(texts.join("").trim());
    }
  }

  return paragraphs;
}

function normalizeChapter(line) {
  const chapterMatch = line.match(/^CHƯƠNG\s*(\d+)/i);
  if (!chapterMatch) {
    return null;
  }

  return CHAPTER_MAP[`CHƯƠNG ${chapterMatch[1]}`] ?? null;
}

function parseQuestions(paragraphs) {
  const questions = [];
  let currentChapter = null;
  let current = null;

  for (const line of paragraphs) {
    const chapter = normalizeChapter(line);
    if (chapter) {
      currentChapter = chapter;
      continue;
    }

    const questionMatch = line.match(/^Câu\s*(\d+)\s*[:：]\s*(.+)$/i);
    if (questionMatch) {
      if (current) {
        questions.push(current);
      }

      current = {
        chapter: currentChapter,
        num: Number.parseInt(questionMatch[1], 10),
        content: questionMatch[2].trim(),
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch) {
      current[`option_${optionMatch[1].toLowerCase()}`] = optionMatch[2].trim();
      continue;
    }

    const answerMatch = line.match(/^Đáp\s*án\s*[:：]\s*([A-D])\s*$/i);
    if (answerMatch) {
      current.correct_answer = answerMatch[1].toUpperCase();
    }
  }

  if (current) {
    questions.push(current);
  }

  return questions;
}

async function main() {
  const xml = fs.readFileSync(DOCX_XML_PATH, "utf8");
  const paragraphs = extractParagraphs(xml);
  const questions = parseQuestions(paragraphs);

  if (questions.length === 0) {
    throw new Error("Không tìm thấy câu hỏi trong file docx.");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE_PATH);

  const worksheet = workbook.getWorksheet("Cau hoi");
  if (!worksheet) {
    throw new Error('Không tìm thấy sheet "Cau hoi" trong file mẫu.');
  }

  const lastRowNumber = worksheet.rowCount;
  for (let rowNumber = lastRowNumber; rowNumber > 1; rowNumber -= 1) {
    worksheet.spliceRows(rowNumber, 1);
  }

  for (const question of questions) {
    worksheet.addRow([
      SUBJECT,
      question.chapter ?? "",
      "",
      question.content,
      "Trắc nghiệm",
      "Cơ bản",
      CHAPTER_TAGS[question.chapter] ?? "MLN111",
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
      question.correct_answer,
      "",
    ]);
  }

  await workbook.xlsx.writeFile(OUTPUT_PATH);

  const byChapter = questions.reduce((acc, question) => {
    const key = question.chapter ?? "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Đã ghi ${questions.length} câu hỏi vào: ${OUTPUT_PATH}`);
  console.log("Phân bổ theo chương:", byChapter);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
