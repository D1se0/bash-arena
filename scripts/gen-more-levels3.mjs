/**
 * gen-more-levels3 — runner de la tanda 3 de expansión:
 *   fundamentos/filtrado (12) · busqueda/procesado/permisos (18) ·
 *   procesos/redes (12) · archivos/scripting/forense (18) · boss (4)
 *  → 64 niveles nuevos (l13..l18 en cada track, l11..l14 en boss).
 * Idempotente: los ficheros que ya existen NO se reescriben.
 * Uso:  node scripts/gen-more-levels3.mjs [track]
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { repoRoot, mk } from './lib-levels.mjs';
import partA from './gen-levels3-f.mjs';
import partB from './gen-levels3-b2.mjs';
import partC from './gen-levels3-c.mjs';
import partD from './gen-levels3-d.mjs';
import partE from './gen-levels3-e.mjs';

const YAML = createRequire(import.meta.url)(path.join(repoRoot, 'node_modules/yaml')).default
  ?? createRequire(import.meta.url)(path.join(repoRoot, 'node_modules/yaml'));

const levels = [...partA, ...partB, ...partC, ...partD, ...partE];

const filter = process.argv[2] ?? '';
let created = 0, skipped = 0;
for (const lvl of levels) {
  if (filter && lvl.track !== filter) continue;
  const dir = path.join(repoRoot, 'levels', lvl.track);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `l${lvl.index}.yaml`);
  if (fs.existsSync(file)) { skipped++; continue; }
  fs.writeFileSync(file, YAML.stringify(lvl, { lineWidth: 100 }));
  created++;
  console.log(`  + ${lvl.id} · ${lvl.title}`);
}
console.log(`total: ${created} creados, ${skipped} ya existían (de ${levels.length} definidos)`);
