import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env from the parent directory
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
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

// Default JWT secret key from application.yaml if not configured in .env
const JWT_SIGNER_KEY = env.JWT_SIGNER_KEY || 'jwtSecretKey12345678901234567890123456789012345678901234567890';
const START_ID = 10000;
const COUNT = 300;
const OUTPUT_FILE = path.join(__dirname, 'tokens.json');

function base64UrlEncode(obj) {
  const str = JSON.stringify(obj);
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateJwt(userId, email, role, secretKey) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const expSeconds = nowSeconds + 86400 * 7; // 7 days expiration

  // JJWT library puts custom claims at root level
  const payload = {
    sub: String(userId),
    email: email,
    role: role,
    iat: nowSeconds,
    exp: expSeconds
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);

  // HMAC SHA256 Signature
  // In Java, Keys.hmacShaKeyFor(secret.getBytes(UTF-8)) is used
  // So in Node, we use the same UTF-8 bytes buffer of the secret key
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretKey, 'utf8'))
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function main() {
  console.log(`Using JWT Signer Key: ${JWT_SIGNER_KEY.slice(0, 10)}... (length: ${JWT_SIGNER_KEY.length})`);
  
  const tokens = [];
  for (let i = 0; i < COUNT; i++) {
    const id = START_ID + i;
    const email = `student${id}@test.com`;
    const role = 'STUDENT';

    const token = generateJwt(id, email, role, JWT_SIGNER_KEY);
    tokens.push({
      userId: id,
      email: email,
      token: token
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2), 'utf8');
  console.log(`Successfully generated ${COUNT} tokens at: ${OUTPUT_FILE}`);
}

main();
