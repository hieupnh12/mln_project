import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function matchNormalize(raw) {
  return String(raw ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
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

const docQuestions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "doc-questions-parsed.json"), "utf8"),
);

const env = loadEnv();
const c = await mysql.createConnection({
  host: env.MYSQL_HOST,
  port: 3306,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  ssl: { rejectUnauthorized: false },
});

const [db] = await c.query("SELECT id, content FROM question");

const stillMissing = [];
for (const docQ of docQuestions) {
  const content = stripNhungTag(decodeHtmlEntities(docQ.content));
  if (content.length < 25) continue;
  let best = 0;
  for (const row of db) best = Math.max(best, matchScore(content, row.content));
  if (best < 0.75) stillMissing.push({ content, answer: docQ.answer });
}

console.log("Still missing after decode match:", stillMissing.length);
stillMissing.slice(0, 15).forEach((q, i) => console.log(`${i + 1}. [${q.answer}] ${q.content.slice(0, 100)}`));

await c.end();
