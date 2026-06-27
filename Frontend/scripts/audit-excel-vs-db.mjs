import ExcelJS from "exceljs";

import { createMysqlConnection } from "./db-env.mjs";

function normalize(text) {
  return String(text ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const conn = await createMysqlConnection();

const [questions] = await conn.query(
  `SELECT q.id, q.content, q.type, l.id AS lesson_id, l.title AS lesson, c.title AS chapter, s.title AS subject
   FROM question q
   LEFT JOIN lesson l ON l.id = q.lesson_id
   LEFT JOIN chapter c ON c.id = l.chapter_id
   LEFT JOIN subject s ON s.id = c.subject_id`,
);

const byContent = new Map();
for (const question of questions) {
  const key = normalize(question.content);
  if (!byContent.has(key)) {
    byContent.set(key, []);
  }
  byContent.get(key).push(question);
}

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile("C:/Users/Admin/Downloads/mau-import-cau-hoi-MLN111_SU26_C1.xlsx");
const worksheet = workbook.getWorksheet("Cau hoi");

let exact = 0;
let mismatch = 0;
let newQuestions = 0;
const fixes = [];

for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
  const row = worksheet.getRow(rowNumber);
  const content = String(row.getCell(4).value ?? "").trim();
  const key = normalize(content);
  const matches = byContent.get(key) ?? [];

  if (matches.length === 0) {
    newQuestions += 1;
    continue;
  }

  exact += 1;
  const match = matches[0];
  const excelChapter = String(row.getCell(2).value ?? "").trim();
  const excelLesson = String(row.getCell(3).value ?? "").trim();
  const dbChapter = String(match.chapter ?? "").trim();
  const dbLesson = String(match.lesson ?? "").trim();

  if (normalize(excelChapter) !== normalize(dbChapter) || normalize(excelLesson) !== normalize(dbLesson)) {
    mismatch += 1;
    fixes.push({
      row: rowNumber - 1,
      content: content.slice(0, 70),
      excelChapter,
      excelLesson,
      dbChapter,
      dbLesson,
      questionIds: matches.map((item) => item.id),
    });
  }
}

console.log(JSON.stringify({ exact, newQuestions, mismatch, fixes }, null, 2));
await conn.end();
