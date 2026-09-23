// Runs the idempotent schema alignment script (align-prod-schema.sql)
// against the DB pointed to by DATABASE_URL. Meant to run on deploy
// (Render's Build or Pre-Deploy Command), where DATABASE_URL is the prod DB.
//
// Idempotent: it uses `ADD COLUMN IF NOT EXISTS`, so it is safe on every deploy.
//   Usage: node prisma/scripts/align-schema.cjs   (or: yarn db:align)

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  const sqlPath = path.join(__dirname, "align-prod-schema.sql");
  const raw = fs.readFileSync(sqlPath, "utf8");
  // Strip comment lines and split into statements on `;`.
  const statements = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    console.log("[db:align] executing:", stmt);
    await prisma.$executeRawUnsafe(stmt);
  }
  console.log(`[db:align] OK — ${statements.length} statement(s) applied.`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("[db:align] ERROR:", e.message);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
