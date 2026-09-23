// Marks every migration in prisma/migrations as ALREADY APPLIED,
// without running its SQL.
//
// Why: while the deploy uses the `db:align` bridge, each migration's DDL
// reaches the DB through `align-prod-schema.sql`, not through Prisma. Those DBs'
// `_prisma_migrations` table doesn't know that, so the day `build:render` is
// switched to `prisma migrate deploy` it would try to re-run them: the
// `ADD COLUMN`s would fail with "column already exists" and break the deploy.
//
// This script closes that gap once per database:
//   DATABASE_URL=<the DB> node prisma/scripts/baseline-applied.cjs
//   (or: npm run db:baseline)
//
// Safe to re-run: already registered migrations are skipped.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

async function appliedNames(prisma) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      "SELECT migration_name FROM _prisma_migrations",
    );
    return new Set(rows.map((r) => r.migration_name));
  } catch {
    // The table doesn't exist yet: no migration is registered.
    return new Set();
  }
}

(async () => {
  const local = fs
    .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort(); // the timestamp prefix sorts chronologically

  if (local.length === 0) {
    console.log("[db:baseline] no migrations in prisma/migrations.");
    return;
  }

  const prisma = new PrismaClient();
  let applied;
  try {
    applied = await appliedNames(prisma);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }

  const pending = local.filter((name) => !applied.has(name));
  if (pending.length === 0) {
    console.log(
      `[db:baseline] nothing to do: all ${local.length} migration(s) are already registered.`,
    );
    return;
  }

  for (const name of pending) {
    console.log(`[db:baseline] marking as applied: ${name}`);
    execFileSync("npx", ["prisma", "migrate", "resolve", "--applied", name], {
      stdio: "inherit",
      cwd: path.join(__dirname, "..", ".."),
    });
  }
  console.log(
    `[db:baseline] OK — ${pending.length} migration(s) marked. ` +
      "`npm run db:migrate` can now be used on this DB.",
  );
})().catch((e) => {
  console.error("[db:baseline] ERROR:", e.message);
  process.exit(1);
});
