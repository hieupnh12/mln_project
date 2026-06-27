import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../../.env');
const SQL_PATH = path.join(__dirname, 'seed-users.sql');

// Helper to load .env file
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

// Database configuration
const dbConfig = {
  host: env.MYSQL_HOST,
  port: parseInt(env.MYSQL_PORT || '3306', 10),
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  // Remote MySQL may require SSL (set MYSQL_SSL_MODE=REQUIRED in .env)
  // Aiven requires SSL, let's enable it
  ssl: env.MYSQL_SSL_MODE === 'REQUIRED' || env.MYSQL_SSL_MODE === 'VERIFY_CA' || env.MYSQL_SSL_MODE === 'VERIFY_IDENTITY'
    ? { rejectUnauthorized: false }
    : undefined
};

async function main() {
  console.log(`Connecting to database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}...`);
  if (dbConfig.ssl) {
    console.log(`SSL Connection is ENABLED (mode: ${env.MYSQL_SSL_MODE})`);
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully to MySQL database.');

    if (!fs.existsSync(SQL_PATH)) {
      throw new Error(`File seed-users.sql not found at ${SQL_PATH}! Run generate-seeder.js first.`);
    }

    console.log('Reading seed-users.sql...');
    const sqlContent = fs.readFileSync(SQL_PATH, 'utf8');

    // Remove SQL comments (both single-line and multi-line)
    const cleanedSql = sqlContent
      .replace(/--.*$/gm, '') // strip -- comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // strip /* */ comments

    console.log('Executing seed statements...');
    
    const queries = cleanedSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    for (const query of queries) {
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.startsWith('insert') || lowerQuery.startsWith('delete')) {
        console.log(`Executing query: ${query.substring(0, 80)}...`);
        const [result] = await connection.query(query);
        console.log(`Affected rows: ${result.affectedRows || 0}`);
      } else {
        console.log(`Skipped query (not insert/delete): ${query.substring(0, 50)}...`);
      }
    }

    console.log('✅ Database seeding completed successfully.');
  } catch (error) {
    console.error('❌ Database operation failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

main().catch(console.error);
