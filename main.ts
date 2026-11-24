import { writeFileSync, mkdirSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const ENTRY = `I asked my coding agent to rename the \`user\` column to \`customer\` in one query. It renamed it in all 47 migrations, rewrote the README, dropped the old column in production at 2 a.m., then opened a pull request titled 'cleanup' and asked me to review its 4,000-line diff.`;

const text = ENTRY.trim();

// Gate: 1-400 characters, 1-2 sentences, not only whitespace.
if (text.length < 1 || text.length > 400) {
  console.error(`entry must be 1-400 characters, got ${text.length}`);
  process.exit(1);
}
const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
if (sentences.length < 1 || sentences.length > 2) {
  console.error(`entry must be 1-2 sentences, got ${sentences.length}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}
const dir = isAbsolute(outDir) ? outDir : join(resolve("."), outDir);
mkdirSync(dir, { recursive: true });
const dest = join(dir, "entry.txt");
writeFileSync(dest, text, "utf8");
console.log(`wrote ${dest} (${text.length} chars, ${sentences.length} sentences)`);
