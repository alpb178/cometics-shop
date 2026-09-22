// Marca como YA APLICADAS todas las migraciones presentes en prisma/migrations,
// sin ejecutar su SQL.
//
// Para qué: mientras el deploy use el puente `db:align`, el DDL de cada
// migración llega a la BD por `align-prod-schema.sql`, no por Prisma. La tabla
// `_prisma_migrations` de esas BD no lo sabe, así que el día que se cambie
// `build:render` a `prisma migrate deploy` intentaría re-ejecutarlas: los
// `ADD COLUMN` fallarían con "column already exists" y tumbarían el deploy.
//
// Este script cierra ese hueco de una vez por base de datos:
//   DATABASE_URL=<la BD> node prisma/scripts/baseline-applied.cjs
//   (o: npm run db:baseline)
//
// Es seguro repetirlo: las migraciones ya registradas se omiten.

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
    // La tabla no existe todavía: ninguna migración está registrada.
    return new Set();
  }
}

(async () => {
  const local = fs
    .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort(); // el prefijo temporal ordena cronológicamente

  if (local.length === 0) {
    console.log("[db:baseline] no hay migraciones en prisma/migrations.");
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
      `[db:baseline] nada que hacer: las ${local.length} migración(es) ya están registradas.`,
    );
    return;
  }

  for (const name of pending) {
    console.log(`[db:baseline] marcando como aplicada: ${name}`);
    execFileSync("npx", ["prisma", "migrate", "resolve", "--applied", name], {
      stdio: "inherit",
      cwd: path.join(__dirname, "..", ".."),
    });
  }
  console.log(
    `[db:baseline] OK — ${pending.length} migración(es) marcadas. ` +
      "Ya se puede usar `npm run db:migrate` en esta BD.",
  );
})().catch((e) => {
  console.error("[db:baseline] ERROR:", e.message);
  process.exit(1);
});
