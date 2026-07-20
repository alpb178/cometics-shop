// Ejecuta el script idempotente de alineación de esquema (align-prod-schema.sql)
// contra la BD apuntada por DATABASE_URL. Pensado para correr en el deploy
// (Build o Pre-Deploy Command de Render), donde DATABASE_URL es la BD de prod.
//
// Idempotente: usa `ADD COLUMN IF NOT EXISTS`, así que es seguro en cada deploy.
//   Uso: node prisma/scripts/align-schema.cjs   (o: yarn db:align)

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  const sqlPath = path.join(__dirname, "align-prod-schema.sql");
  const raw = fs.readFileSync(sqlPath, "utf8");
  // Quita líneas de comentario y separa en sentencias por `;`.
  const statements = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    console.log("[db:align] ejecutando:", stmt);
    await prisma.$executeRawUnsafe(stmt);
  }
  console.log(`[db:align] OK — ${statements.length} sentencia(s) aplicada(s).`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("[db:align] ERROR:", e.message);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
