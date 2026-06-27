import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");

const SUBJECT_ID = 1;
const CREATED_BY = 1;
const PASSING_SCORE = 70;
const TIME_LIMIT = 60;
const STATUS = "DRAFT";
const TARGET_COUNT = 105;

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.resolve(__dirname, "../.env"), "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

function decodeHtmlEntities(text) {
  return String(text ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripNhungTag(text) {
  return String(text ?? "")
    .replace(/\s*\(?\s*NHUNG\s+HO[ÀA]NG\s*\)?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function verifyNormalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

function verifyMatchScore(left, right) {
  const a = verifyNormalize(left);
  const b = verifyNormalize(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length > b.length ? a : b;
  if (longer.includes(shorter) && shorter.length >= 30) return shorter.length / longer.length;
  const prefixLen = Math.min(a.length, b.length, 60);
  if (a.slice(0, prefixLen) === b.slice(0, prefixLen) && prefixLen >= 25) {
    return prefixLen / Math.max(a.length, b.length);
  }
  return 0;
}

function resolveNormalize(raw) {
  return stripNhungTag(decodeHtmlEntities(raw))
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function resolveMatchScore(left, right) {
  const a = resolveNormalize(left);
  const b = resolveNormalize(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length > b.length ? a : b;
  if (longer.includes(shorter) && shorter.length >= 20) {
    return Math.max(0.9, shorter.length / longer.length);
  }
  const prefixLen = Math.min(a.length, b.length, 80);
  if (a.slice(0, prefixLen) === b.slice(0, prefixLen) && prefixLen >= 25) {
    return Math.max(0.85, prefixLen / Math.max(a.length, b.length));
  }
  return 0;
}

function findBestDbQuestion(content, dbQuestions) {
  let best = null;
  let bestScore = 0;
  for (const dbQ of dbQuestions) {
    const score = resolveMatchScore(content, dbQ.content);
    if (score > bestScore) {
      bestScore = score;
      best = dbQ;
    }
  }
  return bestScore >= 0.75 ? best : null;
}

function collectVerifyNotFoundDocQuestions(docQuestions, dbQuestions) {
  const usedDbIds = new Set();
  const notFoundDocs = [];

  for (const docQ of docQuestions) {
    let best = null;
    let bestScore = 0;

    for (const dbQ of dbQuestions) {
      if (usedDbIds.has(dbQ.id)) continue;
      const score = verifyMatchScore(docQ.content, dbQ.content);
      if (score > bestScore) {
        bestScore = score;
        best = dbQ;
      }
    }

    if (!best || bestScore < 0.75) {
      notFoundDocs.push(docQ);
      continue;
    }
    usedDbIds.add(best.id);
  }

  return notFoundDocs;
}

function resolveBatchQuestionIds(notFoundDocs, dbQuestions) {
  const ids = [];
  const seen = new Set();
  const unresolved = [];

  for (const docQ of notFoundDocs) {
    const content = stripNhungTag(decodeHtmlEntities(docQ.content));
    const match = findBestDbQuestion(content, dbQuestions);
    if (!match) {
      unresolved.push(content.slice(0, 80));
      continue;
    }
    if (seen.has(match.id)) continue;
    seen.add(match.id);
    ids.push(match.id);
  }

  return { ids: ids.sort((a, b) => a - b), unresolved, seen };
}

function supplementFromDoc(docQuestions, dbQuestions, batchIds, seen, excludedIds, targetCount) {
  const excluded = new Set([...excludedIds, ...batchIds]);

  for (const docQ of docQuestions) {
    if (batchIds.length >= targetCount) break;
    const content = stripNhungTag(decodeHtmlEntities(docQ.content));
    const match = findBestDbQuestion(content, dbQuestions);
    if (!match || seen.has(match.id) || excluded.has(match.id)) continue;
    seen.add(match.id);
    excluded.add(match.id);
    batchIds.push(match.id);
  }

  return [...batchIds].sort((a, b) => a - b);
}

function splitIntoTwo(ids) {
  const midpoint = Math.ceil(ids.length / 2);
  return [ids.slice(0, midpoint), ids.slice(midpoint)];
}

async function createQuiz(connection, title, questionIds) {
  const [result] = await connection.query(
    `INSERT INTO quiz (
      title, time_limit, passing_score, status, shuffle_answers, random_questions,
      random_question_count, subject_id, chapter_id, lesson_id, created_by,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, 1, 0, ?, ?, NULL, NULL, ?, NOW(), NOW())`,
    [title, TIME_LIMIT, PASSING_SCORE, STATUS, questionIds.length, SUBJECT_ID, CREATED_BY],
  );

  const quizId = result.insertId;
  for (let index = 0; index < questionIds.length; index += 1) {
    await connection.query(
      "INSERT INTO quizQuestion (quiz_id, question_id, sort_order, points) VALUES (?, ?, ?, 1.00)",
      [quizId, questionIds[index], index + 1],
    );
  }

  return quizId;
}

async function main() {
  const docQuestions = JSON.parse(
    fs.readFileSync(path.join(__dirname, "doc-questions-parsed.json"), "utf8"),
  );

  const env = loadEnv();
  const connection = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: parseInt(env.MYSQL_PORT || "3306", 10),
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    ssl: env.MYSQL_SSL_MODE === "REQUIRED" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const [dbQuestions] = await connection.query(
      "SELECT id, content FROM question WHERE status = 'PUBLISHED' ORDER BY id",
    );

    const notFoundDocs = collectVerifyNotFoundDocQuestions(docQuestions, dbQuestions);
    const { ids, unresolved, seen } = resolveBatchQuestionIds(notFoundDocs, dbQuestions);
    let batchIds = [...ids];

    const [usedInExisting] = await connection.query(
      "SELECT DISTINCT question_id AS id FROM quizQuestion WHERE quiz_id IN (26, 27)",
    );
    const usedInExistingSet = new Set(usedInExisting.map((row) => row.id));
    batchIds = batchIds.filter((id) => !usedInExistingSet.has(id));

    if (batchIds.length < TARGET_COUNT) {
      batchIds = supplementFromDoc(
        docQuestions,
        dbQuestions,
        batchIds,
        seen,
        [...usedInExistingSet],
        TARGET_COUNT,
      );
    }

    batchIds = batchIds.slice(0, TARGET_COUNT);
    const [part1, part2] = splitIntoTwo(batchIds);
    const titles = ["MLN111_SU26 - Bổ sung 1", "MLN111_SU26 - Bổ sung 2"];

    console.log("Doc entries in 105 batch (verify greedy):", notFoundDocs.length);
    console.log("Resolved unique question IDs:", ids.length);
    console.log("Using for quizzes:", batchIds.length);
    console.log(`Quiz 1 (${titles[0]}): ${part1.length} câu`);
    console.log(`Quiz 2 (${titles[1]}): ${part2.length} câu`);
    console.log("Unresolved:", unresolved.length);

    if (batchIds.length === 0) {
      throw new Error("Không có câu hỏi để tạo quiz.");
    }

    if (DRY_RUN) {
      console.log("\nDRY RUN");
      console.log("Quiz 1 sample IDs:", part1.slice(0, 10).join(", "));
      console.log("Quiz 2 sample IDs:", part2.slice(0, 10).join(", "));
      return;
    }

    await connection.beginTransaction();
    try {
      const quiz1Id = await createQuiz(connection, titles[0], part1);
      const quiz2Id = await createQuiz(connection, titles[1], part2);
      await connection.commit();
      console.log(`\nCreated quiz #${quiz1Id}: ${titles[0]}`);
      console.log(`Created quiz #${quiz2Id}: ${titles[1]}`);
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
