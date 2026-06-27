import { execFileSync } from "node:child_process";
import ExcelJS from "exceljs";
import fs from "fs";
import os from "os";
import path from "path";

const TEMPLATE_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi (2).xlsx";
const DOCX_PATH = "D:/HocKy8/MLN111/Đề MLN111/ĐỀ MLN111_SU26_C1.docx";
const OUTPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1.xlsx";

const SUBJECT = "Triết học Mác - Lênin";
const CHAPTER = "KHÁI LUẬN VỀ TRIẾT HỌC  VÀ TRIẾT HỌC MÁC - LÊNIN";
const TAGS = "Chương 1, MLN111, SU26";

function extractDocxXml(docxPath) {
  const zipPath = path.join(os.tmpdir(), "mln111-import-docx.zip");
  const extractDir = path.join(os.tmpdir(), "mln111-import-docx-extract");

  fs.copyFileSync(docxPath, zipPath);

  if (fs.existsSync(extractDir)) {
    fs.rmSync(extractDir, { recursive: true, force: true });
  }

  fs.mkdirSync(extractDir, { recursive: true });

  execFileSync("powershell", [
    "-NoProfile",
    "-Command",
    `Expand-Archive -Path '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`,
  ]);

  return fs.readFileSync(path.join(extractDir, "word", "document.xml"), "utf8");
}

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

function parseQuestions(paragraphs) {
  const questions = [];
  let current = null;

  for (const line of paragraphs) {
    if (/^ĐỀ\s+/i.test(line)) {
      continue;
    }

    const questionMatch = line.match(/^Câu\s*[:：]\s*(.+)$/i);
    if (questionMatch) {
      if (current) {
        questions.push(current);
      }

      current = {
        content: questionMatch[1].trim(),
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

    const answerMatch = line.match(/^Đáp\s*án\s*[:：]\s*([A-D])\.\s*(.+)$/i);
    if (answerMatch) {
      const letter = answerMatch[1].toUpperCase();
      const optionKey = `option_${letter.toLowerCase()}`;
      current.correct_answer = current[optionKey] || answerMatch[2].trim();
    }
  }

  if (current) {
    questions.push(current);
  }

  return questions;
}

async function main() {
  const xml = extractDocxXml(DOCX_PATH);
  const paragraphs = extractParagraphs(xml);
  const questions = parseQuestions(paragraphs);

  if (questions.length === 0) {
    throw new Error("Không tìm thấy câu hỏi trong file docx.");
  }

  const invalidQuestions = questions.filter(
    (question) =>
      !question.content ||
      !question.option_a ||
      !question.option_b ||
      !question.option_c ||
      !question.option_d ||
      !question.correct_answer,
  );

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE_PATH);

  const worksheet = workbook.getWorksheet("Cau hoi");
  if (!worksheet) {
    throw new Error('Không tìm thấy sheet "Cau hoi" trong file mẫu.');
  }

  for (let rowNumber = worksheet.rowCount; rowNumber > 1; rowNumber -= 1) {
    worksheet.spliceRows(rowNumber, 1);
  }

  for (const question of questions) {
    worksheet.addRow([
      SUBJECT,
      CHAPTER,
      "",
      question.content,
      "Trắc nghiệm",
      "Cơ bản",
      TAGS,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
      question.correct_answer,
      "",
    ]);
  }

  await workbook.xlsx.writeFile(OUTPUT_PATH);

  console.log(`Đã ghi ${questions.length} câu hỏi vào: ${OUTPUT_PATH}`);
  console.log(`Câu hợp lệ: ${questions.length - invalidQuestions.length}/${questions.length}`);

  if (invalidQuestions.length > 0) {
    console.warn("Các câu thiếu dữ liệu:");
    invalidQuestions.forEach((question, index) => {
      console.warn(`${index + 1}. ${question.content}`);
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
