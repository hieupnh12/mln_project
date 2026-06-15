import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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

// Map keywords to lesson IDs
function getLessonIdForQuestion(content) {
  const lower = content.toLowerCase();
  
  // Chapter 7: CHỦ NGHĨA DUY VẬT LỊCH SỬ
  if (lower.includes("giai cấp") || lower.includes("đấu tranh giai cấp")) return 27; // II.1. Giai cấp và đấu tranh giai cấp
  if (lower.includes("dân tộc")) return 28; // II.2. Dân tộc
  if (lower.includes("nhà nước")) return 30; // III.1. Nhà nước
  if (lower.includes("cách mạng xã hội")) return 31; // III.2. Cách mạng xã hội
  if (lower.includes("tồn tại xã hội") || lower.includes("ý thức xã hội")) return 34; // IV.2. Khái niệm, kết cấu, mối quan hệ biện chứng...
  if (lower.includes("con người") || lower.includes("bản chất con người")) return 35; // V.1. Con người và bản chất con người
  if (lower.includes("lực lượng sản xuất") || lower.includes("quan hệ sản xuất")) return 24; // I.2. Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất
  if (lower.includes("cơ sở hạ tầng") || lower.includes("kiến trúc thượng tầng")) return 25; // I.3. Biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng
  if (lower.includes("hình thái kinh tế")) return 26; // I.4. Sự phát triển các hình thái kinh tế - xã hội...
  if (lower.includes("sản xuất vật chất")) return 23; // I.1. Sản xuất vật chất là cơ sở...

  // Chapter 2: CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
  if (lower.includes("vật chất") || lower.includes("vận động") || lower.includes("đứng im") || lower.includes("không gian") || lower.includes("thời gian")) return 16; // I.1. Vật chất và phương thức tồn tại của vật chất
  if (lower.includes("ý thức") || lower.includes("não người") || lower.includes("bộ óc")) return 17; // I.2. Nguồn gốc, bản chất và kết cấu của ý thức
  if (lower.includes("mối quan hệ giữa vật chất và ý thức")) return 18; // I.3. Mối quan hệ giữa vật chất và ý thức
  if (lower.includes("biện chứng") || lower.includes("phép biện chứng")) return 19; // II.1. Hai loại hình biện chứng và phép biện chứng duy vật
  if (lower.includes("nguyên nhân") || lower.includes("kết quả") || lower.includes("tất nhiên") || lower.includes("ngẫu nhiên") || lower.includes("bản chất") || lower.includes("hiện tượng") || lower.includes("quy luật") || lower.includes("mâu thuẫn") || lower.includes("đối lập") || lower.includes("lượng") || lower.includes("chất")) return 20; // II.2. Nội dung của phép biện chứng duy vật
  if (lower.includes("nhận thức") || lower.includes("chân lý") || lower.includes("cảm tính") || lower.includes("lý tính")) return 22; // III.2. Lý luận nhận thức duy vật biện chứng

  // Default to Chapter 1
  if (lower.includes("triết học") || lower.includes("vấn đề cơ bản")) return 2; // I.2. Vấn Đề Cơ Bản Của Triết Học
  return 1; // I.1. Khái niệm triết học
}

// Parse answersText
function parseAnswers(answersText) {
  const map = new Map(); // questionNumber -> array of letters
  const lines = answersText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines) {
    const match = line.match(/^Q(\d+):\s*(.*)/i);
    if (match) {
      const qNum = parseInt(match[1], 10);
      const answers = match[2].split(',').map(s => s.trim().toUpperCase());
      map.set(qNum, answers);
    }
  }
  return map;
}

// Parse questionsText blocks
function parseQuestions(questionsText) {
  const blocks = questionsText.split(/=====\s+Q\d+\.webp\s+=====|\n=====\s+Q\d+\.webp\s+=====/);
  const parsed = [];
  
  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;

    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Question:")) {
        startIdx = i;
        break;
      }
    }

    const qLine = lines[startIdx] || "";
    const match = qLine.match(/^Question:\s*(\d+)\s*(.*)/i);
    if (!match) continue;

    const qNum = parseInt(match[1], 10);
    const initialText = match[2];

    const questionParts = [initialText];
    const options = [];
    let isParsingOptions = false;

    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      const optionMatch = line.match(/^([A-H])\.\s*(.*)/i);
      if (optionMatch) {
        isParsingOptions = true;
        options.push({
          letter: optionMatch[1].toUpperCase(),
          content: optionMatch[2].trim()
        });
      } else if (isParsingOptions) {
        if (options.length > 0) {
          options[options.length - 1].content += "\n" + line;
        }
      } else {
        if (!line.startsWith("(Choose")) {
          questionParts.push(line);
        }
      }
    }

    parsed.push({
      qNum,
      content: questionParts.join("\n").trim(),
      options
    });
  }

  return parsed.sort((a, b) => a.qNum - b.qNum);
}

async function main() {
  console.log("Starting exam bundle import (ultra fast batch mode)...");
  if (!fs.existsSync(BUNDLES_PATH)) {
    throw new Error(`File ${BUNDLES_PATH} not found.`);
  }

  const bundles = JSON.parse(fs.readFileSync(BUNDLES_PATH, 'utf8'));
  console.log(`Loaded ${bundles.length} exam bundles.`);

  const connection = await mysql.createConnection(dbConfig);
  console.log("Connected to MySQL database.");

  try {
    // 1. Build a cache of existing questions in the database
    console.log("Caching existing questions to prevent duplicates...");
    const [existingQuestions] = await connection.query("SELECT id, lesson_id, content_hash FROM question");
    const questionCacheByHash = new Map(); // hash -> question

    for (const q of existingQuestions) {
      if (q.content_hash) {
        questionCacheByHash.set(q.content_hash, q);
      }
    }
    console.log(`Cached ${existingQuestions.length} existing questions.`);

    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

    // 2. Process each bundle
    for (const bundle of bundles) {
      const { examKey, answersText, questionsText } = bundle;
      console.log(`Processing bundle: ${examKey}...`);

      const answerMap = parseAnswers(answersText);
      const parsedQuestions = parseQuestions(questionsText);

      // List to store question IDs for the current quiz
      const quizQuestionIds = [];

      for (let i = 0; i < parsedQuestions.length; i++) {
        const pq = parsedQuestions[i];
        const lessonId = getLessonIdForQuestion(pq.content);
        const correctLetters = answerMap.get(pq.qNum) || [];
        const type = correctLetters.length > 1 ? "Nhiều đáp án" : "Trắc nghiệm";
        const normalized = normalizeContent(pq.content);
        const hash = hashQuestion(lessonId, type, normalized);

        // Check if question exists by hash and lesson
        let questionId = null;
        const exactMatch = questionCacheByHash.get(hash);
        if (exactMatch && exactMatch.lesson_id === lessonId) {
          questionId = exactMatch.id;
        }

        if (!questionId) {
          // Insert new question
          const title = pq.content.length > 500 ? pq.content.substring(0, 497) + "..." : pq.content;
          const [qInsertRes] = await connection.query(`
            INSERT INTO question (
              content, content_hash, duplicate_warning, lesson_id, title,
              type, difficulty, status, score, estimated_time_seconds,
              created_by, updated_by, created_at, updated_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            pq.content, hash, null, lessonId, title,
            type, "Cơ bản", "PUBLISHED", 1.00, 60,
            1, 1, formattedNow, formattedNow, formattedNow
          ]);

          questionId = qInsertRes.insertId;

          // Add to cache
          questionCacheByHash.set(hash, { id: questionId, lesson_id: lessonId });

          // Batch insert options
          const correctLetters = answerMap.get(pq.qNum) || [];
          if (pq.options.length > 0) {
            const optPlaceholders = [];
            const optValues = [];
            for (let idx = 0; idx < pq.options.length; idx++) {
              const opt = pq.options[idx];
              const isCorrect = correctLetters.includes(opt.letter) ? 1 : 0;
              
              // Truncate option content to 255 chars to prevent ER_DATA_TOO_LONG errors
              const safeContent = opt.content.length > 255 ? opt.content.substring(0, 252) + "..." : opt.content;
              
              optPlaceholders.push('(?, ?, ?, ?)');
              optValues.push(safeContent, isCorrect, questionId, idx);
            }
            await connection.query(`
              INSERT INTO answer (content, is_correct, question_id, sort_order)
              VALUES ${optPlaceholders.join(', ')}
            `, optValues);
          }
        }

        quizQuestionIds.push(questionId);
      }

      // Check if quiz already exists
      const [existingQuizzes] = await connection.query("SELECT id FROM quiz WHERE title = ?", [examKey]);
      let quizId = null;
      const targetPassingScore = [
        'MLN111 - 26-1',
        'MLN111 - 26-2',
        'MLN111 - 26-3',
        'MLN111 - 26-4'
      ].includes(examKey) ? 100 : 70;

      if (existingQuizzes.length > 0) {
        quizId = existingQuizzes[0].id;
        // Update passing score and delete old quiz questions
        await connection.query("UPDATE quiz SET passing_score = ? WHERE id = ?", [targetPassingScore, quizId]);
        await connection.query("DELETE FROM quizQuestion WHERE quiz_id = ?", [quizId]);
      } else {
        // Insert new Quiz
        const [quizInsertRes] = await connection.query(`
          INSERT INTO quiz (
            title, time_limit, passing_score, status, shuffle_answers,
            random_questions, random_question_count, created_by, created_at, updated_at,
            lesson_id, subject_id, chapter_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          examKey, 50, targetPassingScore, "PUBLISHED", 1,
          0, null, 1, formattedNow, formattedNow,
          null, 1, null // General exam for Subject ID 1
        ]);
        quizId = quizInsertRes.insertId;
      }

      // Batch link unique questions to Quiz
      const uniqueQuestionIds = [...new Set(quizQuestionIds)];
      if (uniqueQuestionIds.length > 0) {
        const placeholders = [];
        const values = [];
        for (let order = 0; order < uniqueQuestionIds.length; order++) {
          const qId = uniqueQuestionIds[order];
          placeholders.push('(?, ?, ?, ?)');
          values.push(quizId, qId, order + 1, 1.00);
        }
        await connection.query(`
          INSERT INTO quizQuestion (quiz_id, question_id, sort_order, points)
          VALUES ${placeholders.join(', ')}
        `, values);
      }
    }

    console.log("✅ Seeder completed successfully!");
  } catch (error) {
    console.error("Fatal error during import:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

main().catch(error => {
  console.error("Unhandled promise rejection in main:", error);
  process.exit(1);
});
