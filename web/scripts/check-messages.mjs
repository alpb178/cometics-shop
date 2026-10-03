// Fails when the catalogues under locales/ (es, en, pt) differ in files or
// keys, or when a message is empty. Keep `locales` in sync with i18n/routing.ts.
// Usage: node scripts/check-messages.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "locales");
const locales = ["es", "en", "pt"];

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const catalogs = Object.fromEntries(
  locales.map((l) => {
    const files = readdirSync(join(root, l)).filter((f) => f.endsWith(".json"));
    const flat = {};
    for (const f of files) {
      const ns = f.replace(/\.json$/, "");
      flatten(JSON.parse(readFileSync(join(root, l, f), "utf8")), ns, flat);
    }
    return [l, flat];
  })
);

let problems = 0;
for (const a of locales) {
  for (const b of locales) {
    if (a === b) continue;
    for (const key of Object.keys(catalogs[a])) {
      if (!(key in catalogs[b])) {
        console.error(`missing in ${b}: ${key}`);
        problems++;
      }
    }
  }
  for (const [key, value] of Object.entries(catalogs[a])) {
    if (value === "" || value == null) {
      console.error(`empty in ${a}: ${key}`);
      problems++;
    }
  }
}
console.log(
  problems ? `${problems} problem(s)` : `OK — ${Object.keys(catalogs.es).length} keys in each of ${locales.join(", ")}`
);
process.exit(problems ? 1 : 0);
