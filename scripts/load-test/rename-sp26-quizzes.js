import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../../.env');
const BUNDLES_PATH = path.join(__dirname, 'quiz.exambundles.txt');

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

const renamingMap = {
  'MLN111 - SP26 - FE': 'MLN111 - 26-1',
  'MLN111 - SP26 - B5 - FE': 'MLN111 - 26-2',
  'MLN111 - SP26 - B5 - RE': 'MLN111 - 26-3',
  'MLN111 - SP26 - FE - RE': 'MLN111 - 26-4'
};

async function main() {
  console.log("Renaming SP26 exam bundles in both database and local files...");

  // 1. Update Database
  console.log("Connecting to database...");
  const connection = await mysql.createConnection(dbConfig);
  try {
    for (const [oldName, newName] of Object.entries(renamingMap)) {
      const [res] = await connection.query(
        "UPDATE quiz SET title = ? WHERE title = ?",
        [newName, oldName]
      );
      console.log(`Database update for "${oldName}" -> "${newName}": Affected rows = ${res.affectedRows}`);
    }
  } catch (error) {
    console.error("Error updating database:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }

  // 2. Update quiz.exambundles.txt
  if (fs.existsSync(BUNDLES_PATH)) {
    console.log("Reading quiz.exambundles.txt...");
    const content = fs.readFileSync(BUNDLES_PATH, 'utf8');
    let bundles = JSON.parse(content);
    let updatedCount = 0;

    for (const bundle of bundles) {
      if (renamingMap[bundle.examKey]) {
        const oldName = bundle.examKey;
        const newName = renamingMap[oldName];
        bundle.examKey = newName;
        updatedCount++;
        console.log(`Updated examKey in memory: "${oldName}" -> "${newName}"`);
      }
    }

    if (updatedCount > 0) {
      fs.writeFileSync(BUNDLES_PATH, JSON.stringify(bundles, null, 2), 'utf8');
      console.log(`Successfully updated ${updatedCount} keys in quiz.exambundles.txt!`);
    } else {
      console.log("No matching exam keys found in quiz.exambundles.txt to update.");
    }
  } else {
    console.warn(`File not found: ${BUNDLES_PATH}`);
  }

  console.log("✅ Renaming complete!");
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
