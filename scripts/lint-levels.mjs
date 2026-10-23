import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));

const TRACKS = ['fundamentos', 'filtrado', 'busqueda', 'procesado', 'permisos', 'procesos', 'redes', 'archivos', 'scripting', 'forense', 'boss', 'grep', 'awk', 'grep-pro', 'awk-pro'];
const req = ['id', 'track', 'title', 'goal', 'setup', 'solution', 'teach', 'hints', 'cheatsheet', 'keywords', 'profile'];

let bad = 0;
for (const track of TRACKS) {
  const dir = path.join(repoRoot, 'levels', track);
  if (!fs.existsSync(dir)) { console.log(`TRACK ausente: ${track}`); bad++; continue; }
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.yaml')) continue;
    const full = path.join(dir, f);
    const rel = `${track}/${f}`;
    const text = fs.readFileSync(full, 'utf8');
    if (text.includes('$DOJO_FLAG') === false) console.log(`⚠ ${rel}: sin $DOJO_FLAG`);
    try {
      const def = YAML.parse(text);
      const missing = req.filter((k) => def[k] === undefined || def[k] === null);
      if (missing.length) { console.log(`✗ ${rel}: faltan [${missing.join(', ')}]`); bad++; }
      else if (Array.isArray(def.hints) && def.hints.length < 2) { console.log(`⚠ ${rel}: pocas hints`); }
    } catch (e) {
      console.log(`✗ ${rel}: YAML inválido → ${e.message.split('\n')[0]}`);
      bad++;
    }
  }
}
console.log(bad === 0 ? 'LINT-OK' : `LINT-FAIL: ${bad} problema(s)`);
process.exit(bad === 0 ? 0 : 1);
