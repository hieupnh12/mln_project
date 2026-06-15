import fs from 'fs';
import path from 'path';
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

const targetQuizzes = [
  'MLN111 - 26-1',
  'MLN111 - 26-2',
  'MLN111 - 26-3',
  'MLN111 - 26-4'
];

async function main() {
  console.log("Updating passing score to 100% for target quizzes...");
  const connection = await mysql.createConnection(dbConfig);
  try {
    for (const title of targetQuizzes) {
      const [res] = await connection.query(
        "UPDATE quiz SET passing_score = 100 WHERE title = ?",
        [title]
      );
      console.log(`Quiz "${title}": updated ${res.affectedRows} row(s) to passing_score = 100.`);
    }
    
    // Verify the update
    const [rows] = await connection.query(
      "SELECT id, title, passing_score FROM quiz WHERE title IN (?, ?, ?, ?)",
      targetQuizzes
    );
    console.log("\nVerification of current state in DB:", rows);
  } catch (error) {
    console.error("Error during update:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

main().catch(console.error);
