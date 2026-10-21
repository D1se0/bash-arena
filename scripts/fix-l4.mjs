/**
 * Parche puntual: procesos/l4 — sustituye la línea rota del `su agent -c '...'`
 * por un script temporal escrito con heredoc y ejecutado con su (sin anidar comillas).
 */
import fs from 'node:fs';

const file = 'levels/procesos/l4.yaml';
const lines = fs.readFileSync(file, 'utf8').split('\n');
const brokenIdx = lines.findIndex((l) => l.includes('su agent -c'));
if (brokenIdx === -1) {
  console.log('no encontré la línea su agent…');
  process.exit(1);
}
const block = [
  "  cat > /tmp/.arena-holder <<'HOLD'",
  '  #!/bin/bash',
  '  setsid python3 -c "f = open(\'/tmp/ocultad.sock\'); import time; time.sleep(600)" >/dev/null 2>&1 &',
  '  HOLD',
  '  chown agent:agent /tmp/.arena-holder',
  "  su agent -c 'bash /tmp/.arena-holder; rm -f /tmp/.arena-holder'",
  '  sleep 1',
];
lines.splice(brokenIdx, 1, ...block);
fs.writeFileSync(file, lines.join('\n'));
console.log('ok parche procesos/l4');
