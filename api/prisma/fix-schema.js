/**
 * Post-proceso de `prisma db pull` sobre el esquema que genera Strapi.
 *
 * Strapi crea índices con el mismo nombre que la foreign key (`*_fk`, `*_ifk`),
 * y Prisma exige nombres únicos por modelo entre PK/índices/FKs. Renombramos el
 * `map` de los `@@index` afectados con sufijo `_idx`. Solo afecta a metadatos de
 * migración (nunca ejecutamos `prisma migrate` contra esta BD: el esquema lo
 * gestiona Strapi hasta la fase 5).
 *
 * Uso: npm run prisma:pull (encadena db pull + este script + generate)
 */
const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");

let renamed = 0;
const fixed = schema.replace(
  /(@@index\(\[[^\]]*\], map: ")([^"]*_i?fk)(")/g,
  (_, pre, name, post) => {
    renamed += 1;
    return `${pre}${name}_idx${post}`;
  },
);

fs.writeFileSync(schemaPath, fixed);
console.log(`fix-schema: ${renamed} índices renombrados con sufijo _idx`);
