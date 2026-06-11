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

async function main() {
  console.log(`Connecting to database to clean up mock data...`);
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('Cleaning up quiz attempt questions...');
    await connection.query(`
      DELETE FROM quiz_attempt_question 
      WHERE attempt_id IN (
        SELECT id FROM quiz_attempt WHERE student_id BETWEEN 10000 AND 10299
      )
    `);

    console.log('Cleaning up quiz attempt details...');
    await connection.query(`
      DELETE FROM quiz_attempt_detail 
      WHERE attempt_id IN (
        SELECT id FROM quiz_attempt WHERE student_id BETWEEN 10000 AND 10299
      )
    `);

    console.log('Cleaning up quiz attempts...');
    await connection.query(`
      DELETE FROM quiz_attempt WHERE student_id BETWEEN 10000 AND 10299
    `);

    console.log('Cleaning up mock users...');
    const [result] = await connection.query(`
      DELETE FROM user WHERE id BETWEEN 10000 AND 10299
    `);

    console.log(`✅ Cleaned up successfully. Mock users deleted: ${result.affectedRows}`);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

main().catch(console.error);
