import ExcelJS from "exceljs";

import { createMysqlConnection } from "./db-env.mjs";

const INPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1.xlsx";
const OUTPUT_PATH = "C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1-fixed.xlsx";
const PROJECT_COPY = "D:/HocKy8/MLN111/MLNProject/docs/mau-import-cau-hoi-MLN111_SU26_C1-fixed.xlsx";
const MAX_ANSWER_LENGTH = 255;

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

const conn = await createMysqlConnection();

const [questions] = await conn.query(
  `SELECT q.id, q.content, l.title AS lesson, c.title AS chapter, s.title AS subject
   FROM question q
   JOIN lesson l ON l.id = q.lesson_id
   JOIN chapter c ON c.id = l.chapter_id
   JOIN subject s ON s.id = c.subject_id`,
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

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(INPUT_PATH);
const worksheet = workbook.getWorksheet("Cau hoi");

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
    row.getCell(2).value = match.chapter;
    row.getCell(3).value = match.lesson;
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

await workbook.xlsx.writeFile(OUTPUT_PATH);
await workbook.xlsx.writeFile(PROJECT_COPY);

console.log(`Đã cập nhật file: ${OUTPUT_PATH}`);
console.log(`- Gán theo liên kết DB: ${linkedToDb} câu`);
console.log(`- Giữ mapping hiện tại (câu mới): ${keptMapping} câu`);
console.log(`- Rút gọn đáp án >255 ký tự: ${trimmedAnswers} ô`);
