import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_ID = 10000;
const COUNT = 300;
const OUTPUT_FILE = path.join(__dirname, 'seed-users.sql');

function generateSeeder() {
  let sql = `-- SQL Script to seed 300 test users for load testing
-- IDs from ${START_ID} to ${START_ID + COUNT - 1}
-- You can run this in your MySQL database client (e.g., DBeaver, MySQL Workbench)

INSERT INTO user (id, username, email, full_name, role, is_active) VALUES
`;

  const rows = [];
  for (let i = 0; i < COUNT; i++) {
    const id = START_ID + i;
    const username = `test_student_${id}`;
    const email = `student${id}@test.com`;
    const fullName = `Test Student ${id}`;
    const role = 'STUDENT';
    const isActive = 1;

    rows.push(`(${id}, '${username}', '${email}', '${fullName}', '${role}', ${isActive})`);
  }

  sql += rows.join(',\n') + ';\n\n';

  // Add cleanup script for reference
  sql += `-- To clean up these test users afterwards, run the following:
-- DELETE FROM user WHERE id BETWEEN ${START_ID} AND ${START_ID + COUNT - 1};
`;

  fs.writeFileSync(OUTPUT_FILE, sql, 'utf8');
  console.log(`Successfully generated SQL seeder at: ${OUTPUT_FILE}`);
}

generateSeeder();
