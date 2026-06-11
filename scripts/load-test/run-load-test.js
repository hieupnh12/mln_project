import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_FILE = path.join(__dirname, 'tokens.json');

// Settings
const BACKEND_URL = 'http://localhost:8080/api';
const SUBJECT_ID = 1;
const QUIZ_ID = 'QZ-9';
const RAMP_UP_INTERVAL_MS = 20; // Start a new user every 20ms (total ~6 seconds to ramp up 300 users)

// Statistics tracker
const stats = {
  totalUsers: 0,
  completedUsers: 0,
  activeUsers: 0,
  
  session: {
    sent: 0,
    success: 0,
    failed: 0,
    times: []
  },
  submit: {
    sent: 0,
    success: 0,
    failed: 0,
    times: []
  },
  errors: {}
};

function trackError(stage, errMessage) {
  const key = `[${stage}] ${errMessage}`;
  stats.errors[key] = (stats.errors[key] || 0) + 1;
}

// Helper for sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to calculate statistics
function getStatsSummary(times) {
  if (times.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...times);
  const max = Math.max(...times);
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  return { min, max, avg };
}

async function simulateStudent(user) {
  stats.activeUsers++;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  };

  const userId = user.userId;
  let questionIds = [];
  let answers = [];

  // --- STAGE 1: GET SESSION ---
  stats.session.sent++;
  const t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/student/courses/${SUBJECT_ID}/quizzes/${QUIZ_ID}/session`, {
      method: 'GET',
      headers: params.headers,
      signal: AbortSignal.timeout(15000)
    });
    
    const duration = Date.now() - t0;
    stats.session.times.push(duration);

    if (res.status === 200) {
      stats.session.success++;
      const data = await res.json();
      
      if (data.result && data.result.questions) {
        const questions = data.result.questions;
        questionIds = questions.map(q => q.id);
        answers = questions.map(q => {
          const option = q.options && q.options.length > 0 ? q.options[0] : null;
          return {
            questionId: q.id,
            answerId: option ? option.answerId : null
          };
        });
      }
    } else {
      stats.session.failed++;
      trackError('GET SESSION', `HTTP Status ${res.status}`);
    }
  } catch (err) {
    const duration = Date.now() - t0;
    stats.session.times.push(duration);
    stats.session.failed++;
    trackError('GET SESSION', err.message);
  }

  // If we couldn't load questions, we cannot submit
  if (questionIds.length === 0) {
    stats.activeUsers--;
    stats.completedUsers++;
    return;
  }

  // --- STAGE 2: THINK TIME ---
  // Simulate thinking between 1.5s to 3.5s
  const thinkTime = 1500 + Math.random() * 2000;
  await sleep(thinkTime);

  // --- STAGE 3: SUBMIT EXAM ---
  stats.submit.sent++;
  const submitPayload = {
    studentId: null,
    elapsedSeconds: Math.floor(thinkTime / 1000),
    questionIds: questionIds,
    answers: answers
  };

  const t1 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/student/courses/${SUBJECT_ID}/quizzes/${QUIZ_ID}/submit`, {
      method: 'POST',
      headers: params.headers,
      body: JSON.stringify(submitPayload),
      signal: AbortSignal.timeout(15000)
    });

    const duration = Date.now() - t1;
    stats.submit.times.push(duration);

    if (res.status === 200) {
      stats.submit.success++;
    } else {
      stats.submit.failed++;
      trackError('POST SUBMIT', `HTTP Status ${res.status}`);
    }
  } catch (err) {
    const duration = Date.now() - t1;
    stats.submit.times.push(duration);
    stats.submit.failed++;
    trackError('POST SUBMIT', err.message);
  }

  stats.activeUsers--;
  stats.completedUsers++;
}

async function main() {
  if (!fs.existsSync(TOKENS_FILE)) {
    console.error(`Error: File tokens.json not found! Please run generate-tokens.js first.`);
    process.exit(1);
  }

  const users = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  let limit = users.length;
  if (process.argv[2]) {
    const parsed = parseInt(process.argv[2], 10);
    if (!isNaN(parsed) && parsed > 0) {
      limit = parsed;
    }
  }
  const selectedUsers = users.slice(0, limit);
  stats.totalUsers = selectedUsers.length;

  console.log(`\n🔥 WARMING UP SERVER (establishing Hikari connections & JIT warmup)...`);
  // Send 15 sequential requests to warm up the connection pool
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`${BACKEND_URL}/student/courses/${SUBJECT_ID}/quizzes/${QUIZ_ID}/session`, {
        headers: { 'Authorization': `Bearer ${selectedUsers[0].token}` },
        signal: AbortSignal.timeout(10000)
      });
      if (res.status === 200) {
        process.stdout.write("🔥");
      } else {
        process.stdout.write("⚠️");
      }
    } catch (e) {
      process.stdout.write("❌");
    }
  }
  console.log("\n✅ Warmup finished. Starting main test...\n");

  console.log(`======================================================`);
  console.log(`🚀 STARTING LOAD TEST FOR ${stats.totalUsers} VIRTUAL USERS`);
  console.log(`Target URL:  ${BACKEND_URL}`);
  console.log(`Subject ID:  ${SUBJECT_ID}`);
  console.log(`Quiz ID:     ${QUIZ_ID}`);
  console.log(`======================================================\n`);

  const startTime = Date.now();

  // Start real-time monitoring display
  const monitorInterval = setInterval(() => {
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const progressPercent = ((stats.completedUsers / stats.totalUsers) * 100).toFixed(0);
    
    // Clear line and print current status
    process.stdout.write(
      `\r[${elapsedSec}s] Tiến trình: ${stats.completedUsers}/${stats.totalUsers} (${progressPercent}%) | Đang hoạt động: ${stats.activeUsers} | Session (S/F): ${stats.session.success}/${stats.session.failed} | Submit (S/F): ${stats.submit.success}/${stats.submit.failed}`
    );
  }, 100);

  // Ramp up students sequentially
  const promises = [];
  for (let i = 0; i < selectedUsers.length; i++) {
    promises.push(simulateStudent(selectedUsers[i]));
    await sleep(RAMP_UP_INTERVAL_MS);
  }

  // Wait for all simulations to finish
  await Promise.all(promises);

  clearInterval(monitorInterval);
  const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print results
  console.log(`\n\n======================================================`);
  console.log(`🏁 LOAD TEST COMPLETED IN ${totalDurationSec} SECONDS`);
  console.log(`======================================================`);

  const sessionStats = getStatsSummary(stats.session.times);
  const submitStats = getStatsSummary(stats.submit.times);

  console.log(`\n📊 THÔNG KÊ THỜI GIAN PHẢN HỒI (RESPONSE TIME):`);
  console.log(`------------------------------------------------------`);
  console.log(`1. GET Session (Lấy đề thi):`);
  console.log(`   - Gửi thành công: ${stats.session.success} / ${stats.session.sent}`);
  console.log(`   - Nhanh nhất (Min): ${sessionStats.min.toFixed(0)} ms`);
  console.log(`   - Chậm nhất (Max): ${sessionStats.max.toFixed(0)} ms`);
  console.log(`   - Trung bình (Avg): ${sessionStats.avg.toFixed(1)} ms`);
  
  console.log(`\n2. POST Submit (Nộp bài thi):`);
  console.log(`   - Gửi thành công: ${stats.submit.success} / ${stats.submit.sent}`);
  console.log(`   - Nhanh nhất (Min): ${submitStats.min.toFixed(0)} ms`);
  console.log(`   - Chậm nhất (Max): ${submitStats.max.toFixed(0)} ms`);
  console.log(`   - Trung bình (Avg): ${submitStats.avg.toFixed(1)} ms`);
  console.log(`------------------------------------------------------`);

  // Report errors if any
  const errorEntries = Object.entries(stats.errors);
  if (errorEntries.length > 0) {
    console.log(`\n❌ CÁC LỖI GẶP PHẢI TRONG QUÁ TRÌNH TEST:`);
    console.log(`------------------------------------------------------`);
    for (const [errMsg, count] of errorEntries) {
      console.log(`   - ${errMsg}: ${count} lần`);
    }
    console.log(`------------------------------------------------------`);
  } else {
    console.log(`\n✅ KHÔNG CÓ LỖI XẢY RA! Hệ thống hoạt động ổn định.`);
  }
  console.log(`======================================================\n`);
}

main().catch(err => console.error("Unhandled error during load test:", err));
