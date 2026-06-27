import { execFileSync } from "node:child_process";
import ExcelJS from "exceljs";
import fs from "fs";
import os from "os";
import path from "path";

import { createMysqlConnection } from "./db-env.mjs";

const TEMPLATE_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi (2).xlsx";
const DOCX_PATH = "D:/HocKy8/MLN111/Đề MLN111/ĐỀ  MLN111_SU26_C2.docx";
const OUTPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C2-fixed.xlsx";
const PROJECT_COPY = "D:/HocKy8/MLN111/MLNProject/docs/mau-import-cau-hoi-MLN111_SU26_C2-fixed.xlsx";

const SUBJECT = "Triết học Mác - Lênin";
const TAGS = "Chương 2, MLN111, SU26";
const MAX_ANSWER_LENGTH = 255;

const CHAPTER_KL = "KHÁI LUẬN VỀ TRIẾT HỌC  VÀ TRIẾT HỌC MÁC - LÊNIN";
const CHAPTER_CNDVBC = "CHỦ NGHĨA DUY VẬT BIỆN CHỨNG";
const CHAPTER_CNDVLS = "CHỦ NGHĨA DUY VẬT LỊCH SỬ";
const DEFAULT_LESSON = { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" };

function normalize(text) {
  return String(text ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function trimAnswer(text) {
  const value = String(text ?? "").trim();
  if (value.length <= MAX_ANSWER_LENGTH) {
    return value;
  }
  return `${value.slice(0, MAX_ANSWER_LENGTH - 3).trimEnd()}...`;
}

function extractDocxXml(docxPath) {
  const zipPath = path.join(os.tmpdir(), "mln111-import-c2.zip");
  const extractDir = path.join(os.tmpdir(), "mln111-import-c2-extract");

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

function parseAnswerLetters(rawAnswer) {
  const trimmed = rawAnswer.trim();
  const letterListMatch = trimmed.match(/^([A-D](?:\s*,\s*[A-D])+)\.?$/i);
  if (letterListMatch) {
    return [...letterListMatch[1].matchAll(/[A-D]/gi)].map((item) => item[0].toUpperCase());
  }
  return [];
}

function resolveCorrectAnswer(current, rawAnswer) {
  const letters = parseAnswerLetters(rawAnswer);
  if (letters.length > 1) {
    return {
      type: "Nhiều đáp án",
      correctAnswer: letters.join(","),
    };
  }

  const singleMatch = rawAnswer.match(/^([A-D])\s*\.?\s*(.*)$/i);
  if (!singleMatch) {
    return {
      type: "Trắc nghiệm",
      correctAnswer: rawAnswer.trim(),
    };
  }

  const letter = singleMatch[1].toUpperCase();
  const optionKey = `option_${letter.toLowerCase()}`;
  const optionText = current[optionKey] || singleMatch[2].trim();

  return {
    type: "Trắc nghiệm",
    correctAnswer: optionText,
  };
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
        type: "Trắc nghiệm",
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const optionMatch = line.match(/^([A-D])\s*\.?\s*(.+)$/i);
    if (optionMatch) {
      current[`option_${optionMatch[1].toLowerCase()}`] = optionMatch[2].trim();
      continue;
    }

    const answerMatch = line.match(/^Đáp\s*án\s*[:：]\s*(.+)$/i);
    if (answerMatch) {
      const resolved = resolveCorrectAnswer(current, answerMatch[1].trim());
      current.type = resolved.type;
      current.correct_answer = resolved.correctAnswer;
    }
  }

  if (current) {
    questions.push(current);
  }

  return questions;
}

/** Pedagogical mapping for ĐỀ MLN111_SU26_C2.docx (60 câu) */
const QUESTION_LESSON_MAP = [
  { chapter: CHAPTER_KL, lesson: "I.2. Vấn Đề Cơ Bản Của Triết Học" },
  { chapter: CHAPTER_KL, lesson: "I.2. Vấn Đề Cơ Bản Của Triết Học" },
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_KL, lesson: "I.1. Khái niệm triết học" },
  { chapter: CHAPTER_KL, lesson: "I.3. Biện chứng và siêu hình" },
  { chapter: CHAPTER_KL, lesson: "II.3. Vai trò của triết học Mác - Lênin trong đời sống xã hội" },
  { chapter: CHAPTER_KL, lesson: "II.1. Sự ra đời và phát triển của triết học Mác - Lênin" },
  { chapter: CHAPTER_KL, lesson: "II.2. Đối tượng và chức năng của triết học Mác - Lênin" },
  { chapter: CHAPTER_KL, lesson: "II.1. Sự ra đời và phát triển của triết học Mác - Lênin" },
  { chapter: CHAPTER_KL, lesson: "I.3. Biện chứng và siêu hình" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_KL, lesson: "II.1. Sự ra đời và phát triển của triết học Mác - Lênin" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.1. Vật chất và phương thức tồn tại của vật chất" },
  { chapter: CHAPTER_KL, lesson: "I.3. Biện chứng và siêu hình" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "I.3. Mối quan hệ giữa vật chất và ý thức" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "II.2. Nội dung của phép biện chứng duy vật" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVBC, lesson: "III.2. Lý luận nhận thức duy vật biện chứng" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.3. Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng của xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.3. Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng của xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.1. Sản xuất vật chất là cơ sở của sự tồn tại và phát triển xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.2. Dân tộc" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.1. Giai cấp và đấu tranh giai cấp" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.1. Giai cấp và đấu tranh giai cấp" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.1. Giai cấp và đấu tranh giai cấp" },
  { chapter: CHAPTER_CNDVLS, lesson: "I.4. Sự phát triển các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.2. Cách mạng xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.1. Nhà nước" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.1. Nhà nước" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.2. Cách mạng xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "III.2. Cách mạng xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.1. Khái niệm tồn tại xã hội và các yếu tố cơ bản của tồn tại xã hội" },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "V.1. Con người và bản chất con người" },
  { chapter: CHAPTER_CNDVLS, lesson: "II.1. Giai cấp và đấu tranh giai cấp" },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVBC, lesson: "I.2. Nguồn gốc, bản chất và kết cấu của ý thức" },
  { chapter: CHAPTER_CNDVLS, lesson: "IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng giữa tồn tại xã hội và ý thức xã hội..." },
  { chapter: CHAPTER_CNDVLS, lesson: "V.2. Hiện tượng tha hóa con người và vấn đề giải phóng con người" },
];

function pickDbMatch(matches, excelChapter, excelLesson) {
  const exactTriple = matches.find(
    (item) =>
      normalize(item.chapter) === normalize(excelChapter) &&
      normalize(item.lesson) === normalize(excelLesson),
  );
  if (exactTriple) {
    return exactTriple;
  }

  const exactLesson = matches.find((item) => normalize(item.lesson) === normalize(excelLesson));
  if (exactLesson) {
    return exactLesson;
  }

  return [...matches].sort((left, right) => left.id - right.id)[0];
}

async function syncWithDatabase(worksheet) {
  const conn = await createMysqlConnection();

  const [questions] = await conn.query(
    `SELECT q.id, q.content, q.type, l.title AS lesson, c.title AS chapter
     FROM question q
     JOIN lesson l ON l.id = q.lesson_id
     JOIN chapter c ON c.id = l.chapter_id`,
  );

  const byContent = new Map();
  for (const question of questions) {
    const key = normalize(question.content);
    if (!byContent.has(key)) {
      byContent.set(key, []);
    }
    byContent.get(key).push(question);
  }

  await conn.end();

  let linkedToDb = 0;
  let keptMapping = 0;
  let trimmedAnswers = 0;

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const content = String(row.getCell(4).value ?? "").trim();
    const excelChapter = String(row.getCell(2).value ?? "").trim();
    const excelLesson = String(row.getCell(3).value ?? "").trim();
    const matches = byContent.get(normalize(content)) ?? [];

    if (matches.length > 0) {
      const match = pickDbMatch(matches, excelChapter, excelLesson);
      const currentType = String(row.getCell(5).value ?? "").trim();
      row.getCell(2).value = match.chapter;
      row.getCell(3).value = match.lesson;
      if (currentType !== "Nhiều đáp án" && match.type && String(match.type).includes("Nhiều")) {
        row.getCell(5).value = match.type;
      }
      linkedToDb += 1;
    } else {
      keptMapping += 1;
    }

    for (const columnIndex of [8, 9, 10, 11, 12]) {
      const cell = row.getCell(columnIndex);
      const original = String(cell.value ?? "").trim();
      if (!original) {
        continue;
      }
      const trimmed = trimAnswer(original);
      if (trimmed !== original) {
        cell.value = trimmed;
        trimmedAnswers += 1;
      }
    }
  }

  return { linkedToDb, keptMapping, trimmedAnswers };
}

async function main() {
  const xml = extractDocxXml(DOCX_PATH);
  const paragraphs = extractParagraphs(xml);
  const questions = parseQuestions(paragraphs);

  if (questions.length === 0) {
    throw new Error("Không tìm thấy câu hỏi trong file docx.");
  }

  if (questions.length !== QUESTION_LESSON_MAP.length) {
    console.warn(
      `Cảnh báo: mapping ${QUESTION_LESSON_MAP.length} mục cho ${questions.length} câu — sẽ dùng bài mặc định cho câu thiếu.`,
    );
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

  const multiAnswerCount = questions.filter((question) => question.type === "Nhiều đáp án").length;

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE_PATH);

  const worksheet = workbook.getWorksheet("Cau hoi");
  if (!worksheet) {
    throw new Error('Không tìm thấy sheet "Cau hoi" trong file mẫu.');
  }

  for (let rowNumber = worksheet.rowCount; rowNumber > 1; rowNumber -= 1) {
    worksheet.spliceRows(rowNumber, 1);
  }

  questions.forEach((question, index) => {
    const mapping = QUESTION_LESSON_MAP[index] ?? DEFAULT_LESSON;
    worksheet.addRow([
      SUBJECT,
      mapping.chapter,
      mapping.lesson,
      question.content,
      question.type,
      "Cơ bản",
      TAGS,
      trimAnswer(question.option_a),
      trimAnswer(question.option_b),
      trimAnswer(question.option_c),
      trimAnswer(question.option_d),
      question.correct_answer,
      "",
    ]);
  });

  const dbSync = await syncWithDatabase(worksheet);

  await workbook.xlsx.writeFile(OUTPUT_PATH);
  await workbook.xlsx.writeFile(PROJECT_COPY);

  console.log(`Đã ghi ${questions.length} câu hỏi vào: ${OUTPUT_PATH}`);
  console.log(`- Câu hợp lệ: ${questions.length - invalidQuestions.length}/${questions.length}`);
  console.log(`- Câu nhiều đáp án: ${multiAnswerCount}`);
  console.log(`- Gán theo liên kết DB: ${dbSync.linkedToDb} câu`);
  console.log(`- Câu mới (giữ mapping): ${dbSync.keptMapping} câu`);
  console.log(`- Rút gọn đáp án >255 ký tự: ${dbSync.trimmedAnswers} ô`);

  if (invalidQuestions.length > 0) {
    console.warn("Các câu thiếu dữ liệu:");
    invalidQuestions.forEach((question, index) => {
      console.warn(`${index + 1}. ${question.content}`);
    });
  }

  questions
    .filter((question) => question.type === "Nhiều đáp án")
    .forEach((question) => {
      console.log(`[Nhiều đáp án] ${question.content.slice(0, 80)} => ${question.correct_answer}`);
    });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
