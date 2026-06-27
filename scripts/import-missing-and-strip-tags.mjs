import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");
const TAGS = "Chương 1, MLN111, SU26";
const QUESTION_TYPE = "Trắc nghiệm";
const DIFFICULTY = "Cơ bản";
const STATUS = "PUBLISHED";
const DEFAULT_LESSON_ID = 1;
const DEFAULT_CREATED_BY = 1;

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

function stripNhungTag(text) {
  return String(text ?? "")
    .replace(/\s*\(?\s*NHUNG\s+HO[ÀA]NG\s*\)?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeContent(raw) {
  return String(raw ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

function matchNormalize(raw) {
  return normalizeContent(raw)
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function contentHash(lessonId, type, normalizedContent) {
  const payload = `${lessonId}|${type}|${normalizedContent}`;
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}

function matchScore(left, right) {
  const a = matchNormalize(left);
  const b = matchNormalize(right);
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

function findDbMatch(docContent, dbQuestions) {
  let best = null;
  let bestScore = 0;
  for (const dbQ of dbQuestions) {
    const score = matchScore(docContent, dbQ.content);
    if (score > bestScore) {
      bestScore = score;
      best = dbQ;
    }
  }
  return bestScore >= 0.75 ? best : null;
}

function decodeHtmlEntities(text) {
  return String(text ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function buildTitle(content) {
  return content.length > 500 ? content.slice(0, 500) : content;
}

async function ensureTags(connection, tagNames) {
  const tagIds = [];
  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const [existing] = await connection.query("SELECT id FROM tag WHERE name = ? LIMIT 1", [trimmed]);
    if (existing.length > 0) {
      tagIds.push(existing[0].id);
      continue;
    }
    const [result] = await connection.query("INSERT INTO tag (name) VALUES (?)", [trimmed]);
    tagIds.push(result.insertId);
  }
  return tagIds;
}

async function removeNhungTags(connection) {
  const [rows] = await connection.query(`
    SELECT id, lesson_id, type, content, title
    FROM question
    WHERE content REGEXP 'NHUNG[[:space:]]*HO'
       OR title REGEXP 'NHUNG[[:space:]]*HO'
  `);

  const updates = [];
  for (const row of rows) {
    const newContent = stripNhungTag(decodeHtmlEntities(row.content));
    const newTitle = stripNhungTag(decodeHtmlEntities(row.title));
    if (newContent !== row.content || newTitle !== row.title) {
      updates.push({
        id: row.id,
        content: newContent,
        title: buildTitle(newTitle || newContent),
        hash: contentHash(
          row.lesson_id ?? DEFAULT_LESSON_ID,
          row.type || QUESTION_TYPE,
          normalizeContent(newContent),
        ),
      });
    }
  }

  console.log(`Remove NHUNG tag: ${updates.length} questions to update`);
  if (DRY_RUN || updates.length === 0) return updates.length;

  for (const item of updates) {
    await connection.query(
      "UPDATE question SET content = ?, title = ?, content_hash = ?, updated_at = NOW() WHERE id = ?",
      [item.content, item.title, item.hash, item.id],
    );
  }
  return updates.length;
}

async function importMissingQuestions(connection, docQuestions, dbQuestions) {
  const toImport = [];

  for (const docQ of docQuestions) {
    const content = stripNhungTag(decodeHtmlEntities(docQ.content));
    if (!content || content.length < 25) continue;

    const match = findDbMatch(content, dbQuestions);
    if (match) continue;

    const options = ["A", "B", "C", "D"]
      .map((letter) => stripNhungTag(decodeHtmlEntities(docQ.options[letter] || "")))
      .filter(Boolean);

    if (options.length < 3 || !docQ.answer || !docQ.correctText) continue;

    toImport.push({
      content,
      title: buildTitle(content),
      answerLetter: docQ.answer,
      correctText: stripNhungTag(decodeHtmlEntities(docQ.correctText)),
      options,
    });
  }

  // Deduplicate within import batch
  const unique = [];
  const seen = new Set();
  for (const item of toImport) {
    const key = normalizeContent(item.content);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  console.log(`Import missing questions: ${unique.length} new questions`);
  if (unique.length === 0) return 0;

  if (DRY_RUN) {
    unique.slice(0, 10).forEach((q, i) => console.log(`${i + 1}. ${q.content.slice(0, 100)}`));
    return unique.length;
  }

  await connection.beginTransaction();
  try {
    const tagIds = await ensureTags(connection, TAGS.split(","));
    let imported = 0;

    for (const item of unique) {
      const normalized = normalizeContent(item.content);
      const hash = contentHash(DEFAULT_LESSON_ID, QUESTION_TYPE, normalized);

      const [dup] = await connection.query(
        "SELECT id FROM question WHERE lesson_id = ? AND content_hash = ? LIMIT 1",
        [DEFAULT_LESSON_ID, hash],
      );
      if (dup.length > 0) continue;

      const [qResult] = await connection.query(
        `INSERT INTO question (
          lesson_id, title, content, content_hash, type, difficulty, status,
          score, estimated_time_seconds, created_by, updated_by, created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 60, ?, ?, NOW(), NOW(), NOW())`,
        [
          DEFAULT_LESSON_ID,
          item.title,
          item.content,
          hash,
          QUESTION_TYPE,
          DIFFICULTY,
          STATUS,
          DEFAULT_CREATED_BY,
          DEFAULT_CREATED_BY,
        ],
      );

      const questionId = qResult.insertId;
      const letters = ["A", "B", "C", "D"];

      for (let i = 0; i < item.options.length; i += 1) {
        const letter = letters[i];
        const isCorrect = letter === item.answerLetter;
        await connection.query(
          "INSERT INTO answer (question_id, content, is_correct, sort_order) VALUES (?, ?, ?, ?)",
          [questionId, item.options[i], isCorrect ? 1 : 0, i],
        );
      }

      for (const tagId of tagIds) {
        await connection.query(
          "INSERT IGNORE INTO questionTag (question_id, tag_id) VALUES (?, ?)",
          [questionId, tagId],
        );
      }

      dbQuestions.push({ id: questionId, content: item.content });
      imported += 1;
    }

    await connection.commit();
    return imported;
  } catch (error) {
    await connection.rollback();
    throw error;
  }
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

  const docQuestions = JSON.parse(
    fs.readFileSync(path.join(__dirname, "doc-questions-parsed.json"), "utf8"),
  ).map((q) => ({
    ...q,
    content: stripNhungTag(q.content),
    options: Object.fromEntries(
      Object.entries(q.options).map(([k, v]) => [k, stripNhungTag(String(v))]),
    ),
    correctText: stripNhungTag(q.correctText),
  }));

  try {
    const [dbQuestions] = await connection.query("SELECT id, content, lesson_id FROM question");
    const removed = await removeNhungTags(connection);
    const imported = await importMissingQuestions(connection, docQuestions, dbQuestions);

    console.log("\n=== DONE ===");
    console.log(`NHUNG tag removed from: ${removed} questions`);
    console.log(`New questions imported: ${imported}`);
    if (DRY_RUN) console.log("(DRY RUN - no DB changes)");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
