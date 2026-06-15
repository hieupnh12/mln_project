import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Running seeder sync...");
try {
  const output = execSync('node import-bundles-seeder.js', { cwd: __dirname, encoding: 'utf8' });
  console.log("Seeder completed successfully!");
  console.log(output);
} catch (error) {
  console.error("Seeder failed with error:");
  console.error(error.stdout || error.stderr || error.message);
  process.exit(1);
}
