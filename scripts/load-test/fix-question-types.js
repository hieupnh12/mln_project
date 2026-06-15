import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../../.env');

function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    const lines = fs.readFileSync(ENV_PATH, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();
        env[key] = value.replace(/(^['"]|['"]$)/g, ''); // strip quotes
      }
    }
  }
  return env;
}

const env = loadEnv();

const dbConfig = {
  host: env.MYSQL_HOST,
  port: parseInt(env.MYSQL_PORT || '3306', 10),
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  ssl: env.MYSQL_SSL_MODE === 'REQUIRED' || env.MYSQL_SSL_MODE === 'VERIFY_CA' || env.MYSQL_SSL_MODE === 'VERIFY_IDENTITY'
    ? { rejectUnauthorized: false }
    : undefined
};

// Replicate QuestionContentNormalizer.java
function normalizeContent(raw) {
  if (!raw) return "";
  let normalized = raw.normalize('NFC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.replace(/[^\p{L}\p{N}\s]/gu, '');
}

// Replicate QuestionContentHasher.java
function hashQuestion(lessonId, type, normalizedContent) {
  const payload = `${lessonId}|${type}|${normalizedContent}`;
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

async function main() {
  console.log("Connecting to database to fix question types...");
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // 1. Fetch all unique question IDs linked to quizzes with ID >= 12 (the newly imported/renamed quizzes)
    const [questions] = await connection.query(`
      SELECT DISTINCT q.id, q.content, q.lesson_id, q.type, q.content_hash
      FROM question q
      INNER JOIN quizQuestion qq ON q.id = qq.question_id
      WHERE qq.quiz_id >= 12
    `);

    console.log(`Fetched ${questions.length} unique questions linked to imported quizzes.`);

    let updatedCount = 0;

    for (const q of questions) {
      // 2. Query all correct answers for this question
      const [answers] = await connection.query(
        "SELECT id FROM answer WHERE question_id = ? AND is_correct = 1",
        [q.id]
      );

      if (answers.length > 1) {
        const newType = "Nhiều đáp án";
        const normalized = normalizeContent(q.content);
        const newHash = hashQuestion(q.lesson_id, newType, normalized);

        console.log(`Question ID ${q.id} has ${answers.length} correct answers. Updating type to "${newType}".`);
        console.log(`- Old Hash: ${q.content_hash}`);
        console.log(`- New Hash: ${newHash}`);

        // Update in database
        await connection.query(
          "UPDATE question SET type = ?, content_hash = ? WHERE id = ?",
          [newType, newHash, q.id]
        );
        updatedCount++;
      }
    }

    console.log(`\n✅ Finished updating question types. Total questions updated: ${updatedCount}`);
  } catch (error) {
    console.error("Error updating question types:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

main().catch(console.error);
