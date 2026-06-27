import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.resolve(__dirname, "../.env");
const DOCX_PATH = "c:/Users/Admin/Downloads/MLN111 (1).docx";
const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv() {
  const env = {};
  if (!fs.existsSync(ENV_PATH)) return env;
  for (const line of fs.readFileSync(ENV_PATH, "utf8").replace(/\r?\n/g, "\n").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/(^['"]|['"]$)/g, "");
  }
  return env;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

function matchScore(left, right) {
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length > b.length ? a : b;
  if (longer.includes(shorter) && shorter.length >= 30) {
    return shorter.length / longer.length;
  }
  const prefixLen = Math.min(a.length, b.length, 60);
  if (a.slice(0, prefixLen) === b.slice(0, prefixLen) && prefixLen >= 25) {
    return prefixLen / Math.max(a.length, b.length);
  }
  return 0;
}

function extractDocxXml(docxPath) {
  const zipPath = path.join(os.tmpdir(), "mln111-sync-docx.zip");
  const extractDir = path.join(os.tmpdir(), "mln111-sync-docx-extract");
  fs.copyFileSync(docxPath, zipPath);
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true });
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
    const line = texts.join("").replace(/\u00a0/g, " ").trim();
    if (line) paragraphs.push(line);
  }
  return paragraphs;
}

function splitInlineOptions(text) {
  const optionRegex = /([A-D])\.\s*/g;
  const matches = [...text.matchAll(optionRegex)];
  if (matches.length < 2) return null;
  const first = matches[0];
  const question = text.slice(0, first.index).trim();
  const options = {};
  for (let i = 0; i < matches.length; i += 1) {
    const letter = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    options[letter] = text.slice(start, end).trim();
  }
  return { question, options };
}

function createEmptyQuestion() {
  return {
    content: "",
    options: { A: "", B: "", C: "", D: "" },
    answer: "",
  };
}

function stripNhungTag(text) {
  return String(text ?? "")
    .replace(/\s*\(?\s*NHUNG\s+HO[ÀA]NG\s*\)?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function finalizeQuestion(current, questions) {
  if (!current || !current.content || !current.answer) return null;
  const hasAnyOption = Object.values(current.options).some(Boolean);
  if (!hasAnyOption) return null;
  questions.push({
    content: stripNhungTag(current.content.trim()),
    options: {
      A: stripNhungTag(current.options.A),
      B: stripNhungTag(current.options.B),
      C: stripNhungTag(current.options.C),
      D: stripNhungTag(current.options.D),
    },
    answer: current.answer,
    correctText: stripNhungTag(current.options[current.answer] || ""),
  });
  return createEmptyQuestion();
}

function parseQuestions(paragraphs) {
  const questions = [];
  let current = createEmptyQuestion();

  for (const rawLine of paragraphs) {
    const line = rawLine.replace(/\u00a0/g, " ").trim();
    if (!line || /^ĐỀ\s+/i.test(line)) continue;
    if (/^\(Kiểu hỏi khác:/i.test(line)) continue;

    const questionPrefix = line.match(/^Câu\s*[:：]\s*(.+)$/i);
    if (questionPrefix) {
      current = finalizeQuestion(current, questions) ?? createEmptyQuestion();
      current.content = questionPrefix[1].trim();
      continue;
    }

    const inline = splitInlineOptions(line);
    if (inline?.question) {
      current = finalizeQuestion(current, questions) ?? createEmptyQuestion();
      current.content = inline.question;
      Object.assign(current.options, inline.options);
      continue;
    }

    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch) {
      if (!current.content) continue;
      current.options[optionMatch[1]] = optionMatch[2].trim();
      continue;
    }

    const answerLine = line.match(/^([A-D])(?:\(.+)?$/);
    if (answerLine && current.content) {
      current.answer = answerLine[1];
      current = finalizeQuestion(current, questions) ?? createEmptyQuestion();
      continue;
    }

    const answerFull = line.match(/^Đáp\s*án\s*[:：]\s*([A-D])(?:\.\s*(.+))?$/i);
    if (answerFull && current.content) {
      current.answer = answerFull[1].toUpperCase();
      current = finalizeQuestion(current, questions) ?? createEmptyQuestion();
      continue;
    }

    const looksLikeQuestion =
      /[?？:：]$/.test(line) ||
      /\(NHUNG HOÀNG\)/i.test(line) ||
      /\(NHUNG HOANG\)/i.test(line);

    if (looksLikeQuestion) {
      current = finalizeQuestion(current, questions) ?? createEmptyQuestion();
      current.content = line;
      continue;
    }

    if (!current.content) {
      current.content = line;
    }
  }

  finalizeQuestion(current, questions);
  return questions.filter((q) => q.content && q.answer && q.correctText);
}

function findBestDbMatch(docQ, dbQuestions, usedIds) {
  let best = null;
  let bestScore = 0;
  for (const dbQ of dbQuestions) {
    if (usedIds.has(dbQ.id)) continue;
    const score = matchScore(docQ.content, dbQ.content);
    if (score > bestScore) {
      bestScore = score;
      best = dbQ;
    }
  }
  return bestScore >= 0.75 ? best : null;
}

function isAnswerCorrect(value) {
  if (value === 1 || value === true) return true;
  if (Buffer.isBuffer(value)) return value.length > 0 && value[0] === 1;
  return false;
}

function findCorrectAnswer(answers, docQ) {
  const correctNorm = normalizeText(docQ.correctText);
  const byText = answers.find((a) => normalizeText(a.content) === correctNorm);
  if (byText) return byText;

  const byCompatible = answers.find((a) => {
    const aNorm = normalizeText(a.content);
    return aNorm.includes(correctNorm) || correctNorm.includes(aNorm);
  });
  if (byCompatible) return byCompatible;

  const letterIndex = docQ.answer.charCodeAt(0) - 65;
  if (letterIndex >= 0 && letterIndex < answers.length) {
    return answers[letterIndex];
  }
  return null;
}

async function main() {
  const env = loadEnv();
  const connection = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: parseInt(env.MYSQL_PORT || "3306", 10),
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    ssl: env.MYSQL_SSL_MODE === "REQUIRED" ? { rejectUnauthorized: false } : undefined,
  });

  const docQuestions = parseQuestions(extractParagraphs(extractDocxXml(DOCX_PATH)));
  fs.writeFileSync(
    path.join(__dirname, "doc-questions-parsed.json"),
    JSON.stringify(docQuestions, null, 2),
    "utf8",
  );
  console.log(`Parsed ${docQuestions.length} questions from docx.`);

  try {
    const [dbQuestions] = await connection.query(`
      SELECT q.id, q.content
      FROM question q
      ORDER BY q.id
    `);

    const [dbAnswers] = await connection.query(`
      SELECT a.id, a.question_id, a.content, a.is_correct, a.sort_order
      FROM answer a
      ORDER BY a.question_id, a.sort_order
    `);

    const answersByQuestion = new Map();
    for (const row of dbAnswers) {
      if (!answersByQuestion.has(row.question_id)) answersByQuestion.set(row.question_id, []);
      answersByQuestion.get(row.question_id).push(row);
    }

    const usedDbIds = new Set();
    const updates = [];
    const fixed = [];
    const skipped = [];
    const notFoundInDb = [];

    for (const docQ of docQuestions) {
      const dbQ = findBestDbMatch(docQ, dbQuestions, usedDbIds);
      if (!dbQ) {
        notFoundInDb.push(docQ.content.slice(0, 100));
        continue;
      }
      usedDbIds.add(dbQ.id);

      const answers = answersByQuestion.get(dbQ.id) ?? [];
      if (answers.length === 0) {
        skipped.push({ reason: "no_answers", id: dbQ.id, content: docQ.content.slice(0, 80) });
        continue;
      }

      const correctAnswer = findCorrectAnswer(answers, docQ);
      if (!correctAnswer) {
        skipped.push({
          reason: "cannot_map_answer",
          id: dbQ.id,
          content: docQ.content.slice(0, 80),
          docAnswer: `${docQ.answer}. ${docQ.correctText}`,
          dbOptions: answers.map((a) => a.content),
        });
        continue;
      }

      const currentCorrect = answers.filter((a) => isAnswerCorrect(a.is_correct));
      const alreadyOk =
        currentCorrect.length === 1 && currentCorrect[0].id === correctAnswer.id;

      if (alreadyOk) continue;

      fixed.push({
        questionId: dbQ.id,
        content: docQ.content.slice(0, 90),
        docAnswer: `${docQ.answer}. ${docQ.correctText}`,
        previousCorrect: currentCorrect.map((a) => a.content),
      });

      for (const ans of answers) {
        const shouldCorrect = ans.id === correctAnswer.id;
        const isCurrentlyCorrect = isAnswerCorrect(ans.is_correct);
        if (shouldCorrect !== isCurrentlyCorrect) {
          updates.push({ answerId: ans.id, questionId: dbQ.id, to: shouldCorrect });
        }
      }
    }

    console.log("\n=== SUMMARY ===");
    console.log(`Doc questions: ${docQuestions.length}`);
    console.log(`DB questions: ${dbQuestions.length}`);
    console.log(`Matched & need fix: ${fixed.length}`);
    console.log(`Answer flag updates: ${updates.length}`);
    console.log(`Skipped: ${skipped.length}`);
    console.log(`Not found in DB: ${notFoundInDb.length}`);

    if (fixed.length > 0) {
      console.log("\n=== FIXES (first 15) ===");
      for (const f of fixed.slice(0, 15)) {
        console.log(`Q${f.questionId}: ${f.docAnswer}`);
        if (f.previousCorrect.length) console.log(`  was: ${f.previousCorrect.join(" | ")}`);
      }
    }

    if (skipped.length > 0) {
      console.log("\n=== SKIPPED (first 10) ===");
      for (const s of skipped.slice(0, 10)) console.log(s);
    }

    if (updates.length === 0) {
      console.log("\nNo updates needed.");
      return;
    }

    if (DRY_RUN) {
      console.log(`\nDRY RUN - would apply ${updates.length} is_correct updates.`);
      return;
    }

    await connection.beginTransaction();
    try {
      for (const u of updates) {
        await connection.query("UPDATE answer SET is_correct = ? WHERE id = ?", [u.to ? 1 : 0, u.answerId]);
      }
      await connection.commit();
      console.log(`\nCommitted ${updates.length} is_correct updates.`);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
