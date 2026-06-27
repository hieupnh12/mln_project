import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
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
  if (longer.includes(shorter) && shorter.length >= 30) return shorter.length / longer.length;
  const prefixLen = Math.min(a.length, b.length, 60);
  if (a.slice(0, prefixLen) === b.slice(0, prefixLen) && prefixLen >= 25) {
    return prefixLen / Math.max(a.length, b.length);
  }
  return 0;
}

const docQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, "doc-questions-parsed.json"), "utf8"));
const env = loadEnv();
const c = await mysql.createConnection({
  host: env.MYSQL_HOST,
  port: 3306,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  ssl: { rejectUnauthorized: false },
});

const [dbQuestions] = await c.query("SELECT id, content FROM question ORDER BY id");
const used = new Set();
const notFound = [];
const contentDiff = [];

for (const docQ of docQuestions) {
  let best = null;
  let bestScore = 0;
  for (const dbQ of dbQuestions) {
    if (used.has(dbQ.id)) continue;
    const score = matchScore(docQ.content, dbQ.content);
    if (score > bestScore) {
      bestScore = score;
      best = dbQ;
    }
  }
  if (!best || bestScore < 0.75) {
    notFound.push(docQ.content.slice(0, 120));
    continue;
  }
  used.add(best.id);
  if (normalizeText(docQ.content) !== normalizeText(best.content)) {
    contentDiff.push({
      id: best.id,
      doc: docQ.content.slice(0, 100),
      db: best.content.slice(0, 100),
    });
  }
}

console.log("Not found in DB:", notFound.length);
console.log("Content differences:", contentDiff.length);
if (notFound.length) {
  console.log("\n--- Not in DB (first 15) ---");
  notFound.slice(0, 15).forEach((x, i) => console.log(i + 1 + ". " + x));
}
if (contentDiff.length) {
  console.log("\n--- Content diff (first 10) ---");
  contentDiff.slice(0, 10).forEach((x) => {
    console.log("Q" + x.id);
    console.log("  DOC:", x.doc);
    console.log("  DB :", x.db);
  });
}

const [bad] = await c.query(`
  SELECT COUNT(*) cnt FROM (
    SELECT q.id, SUM(a.is_correct) s FROM question q JOIN answer a ON a.question_id=q.id GROUP BY q.id HAVING s != 1
  ) t`);
console.log("\nQuestions with != 1 correct answer:", bad[0].cnt);

await c.end();
