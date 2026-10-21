/**
 * Parche idempotente: añade `solution:` a los YAML que lo hayan perdido.
 * La solución siempre corre como agent y termina imprimiendo la flag.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const SOLUTIONS = {
  'fundamentos-l2.txt': null, // marcador no usado
};

const MAP = {
  'fundamentos-l2': [
    'cat /home/agent/empresa/mision/nota.txt',
  ],
  'fundamentos-l3': [
    'mkdir -p ~/evidencias',
    'cp /var/dojo/evidencias/*.png ~/evidencias/',
    'mv ~/evidencias/pieza-clave.png ~/evidencias/pieza-clave-final.png',
    'cat ~/evidencias/pieza-clave-final.png',
  ],
  'fundamentos-l4': [
    'rm -f /var/dojo/ruido/*.trash',
    'cat /var/dojo/ruido/.importantísimo',
  ],
  'fundamentos-l5': [
    'cat ~/aviso.txt',
    'cat ~/lab/.oculto/aviso.txt',
    'cat ~/lab/.oculto/nivel1/bodegon/.caldera/pentagram',
  ],
  'filtrado-l1': ['head -n 5 /var/log/telemetry.log'],
  'filtrado-l2': ['tail -n 4 /var/log/daemon.log'],
  'filtrado-l3': ['grep sysadmin /var/dojo/personal.csv | cut -d, -f4'],
  'filtrado-l4': ['sort -u /var/dojo/dupes.txt'],
  'filtrado-l5': ["cat /var/dojo/ofuscado.txt | tr -d ' '"],
  'busqueda-l1': ["grep '^FLAG{' /var/log/access.log"],
  'busqueda-l2': ['grep -r FLAG /var/dojo/proyecto'],
  'busqueda-l3': ["grep -oE 'FLAG\\{[0-9a-f]+\\}' /var/dojo/correspondencia.txt"],
  'busqueda-l4': ['cat "$(find /var/dojo/archivo -name \'*.flag\' -size +400c)"'],
  'busqueda-l5': ['grep -r FLAG /var/dojo/cartera'],
  'procesado-l1': ['awk \'$1=="root"{print $NF}\' /var/dojo/accesos.db'],
  'procesado-l2': ['grep EXTRAIDO /var/dojo/informe.md | sed \'s/EXTRAIDO ### \\(.*\\) ###.*/\\1/\''],
  'procesado-l3': ['cat /var/dojo/mitad-a /var/dojo/mitad-b'],
  'procesado-l4': ['diff /var/dojo/replica-a /var/dojo/replica-b'],
  'procesado-l5': ["grep tres /var/dojo/mixto | awk -F'|' '{print $2}' | cut -d: -f2"],
  'permisos-l1': [
    'sudo chmod 0644 /home/agent/bóveda.txt',
    'cat /home/agent/bóveda.txt',
  ],
  'permisos-l2': [
    'sudo chown agent:agent /home/agent/config-premium.conf',
    'cat /home/agent/config-premium.conf',
  ],
  'permisos-l4': ['cat /etc/dojo/confidencial'],
  'permisos-l5': [
    "sudo find /etc/dojo/bóveda -name 'atajo.notes'",
    'sudo cat /etc/dojo/bóveda/cajon/.profunda/atajo.notes',
  ],
  'procesos-l1': ["ps aux | grep 'FLAG{'"],
  'procesos-l2': [
    'pkill -f hunterd',
    'sleep 2',
    'cat /var/log/hunter.log',
  ],
  'procesos-l3': ['cat "$(du -a /var/dojo/silo | sort -n | tail -1 | cut -f2-)"'],
  'procesos-l4': [
    "pid=$(sudo lsof | grep 'ocultad.*deleted' | awk '{print $2}' | head -1)",
    "fdn=$(sudo ls -l /proc/$pid/fd | grep 'ocultad' | awk '{print $9}' | head -1)",
    'sudo cat /proc/$pid/fd/$fdn',
  ],
  'procesos-l5': [
    'systemctl list-units',
    'cat /etc/systemd/system/forge.service',
  ],
  'redes-l1': ['nc 127.0.0.1 7080'],
  'redes-l2': ['curl -s http://127.0.0.1:8501/secreto/.cargo'],
  'redes-l3': [
    'ss -tln',
    'nc 127.0.0.1 9696',
  ],
  'redes-l4': ['dig +short @127.0.0.1 -p 5353 flag.dojo TXT'],
  'archivos-l1': [
    'mkdir -p /tmp/x',
    'tar -xzf /var/dojo/notas.tar.gz -C /tmp/x',
    'cat /tmp/x/notas/nota_clave.txt',
  ],
  'archivos-l2': ['zcat /var/dojo/diario.txt.gz'],
  'archivos-l3': [
    'mkdir -p /tmp/extraigo',
    'unzip -o /var/dojo/maletin.zip -d /tmp/extraigo',
    'cat /tmp/extraigo/fondos/lote3/no-lucer/interior.txt',
  ],
  'archivos-l5': ['cat "$(readlink -f /home/agent/pomer-c)"'],
  'scripting-l2': [
    'cat /home/agent/pista-portero.txt',
    'portero espiral',
  ],
  'scripting-l1': [
    "for f in /var/dojo/apuntes/*; do",
    '  if grep -q "FLAG{" "$f"; then cat "$f"; fi',
    'done',
  ],
  'scripting-l3': ['bash /home/agent/verso.sh abierto sésamo'],
  'scripting-l4': ['oraculo -k matrix'],
  'scripting-l5': ['cat /var/dojo/fragmentos/*.b64 | base64 -d; echo'],
  'forense-l1': ['grep -v pifia /var/log/auth-dojo.log'],
  'forense-l2': ['tail -1 /var/dojo/interceptado.b64 | base64 -d'],
  'forense-l3': ["grep -a 'FLAG{' /var/dojo/core-dump"],
  'forense-l4': ["cat /var/dojo/rot13.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"],
  'forense-l5': ['tail -1 /var/dojo/exfiltrado.log | base64 -d | zcat'],
  'boss-l1': ['cat "$(find /var/dojo/jungla -name \'.*\')" | base64 -d'],
  'boss-l2': ['find /var/dojo/estantería -type f -mmin -30 -exec cat {} \\;'],
  'boss-l3': [
    'pkill -f transmisor',
    'sleep 1',
    'tail -1 /var/log/transmisor.log | base64 -d',
  ],
  'boss-l4': [
    'base64 -d /var/dojo/paquete-final.b64 > /tmp/paquete.tar.gz',
    'mkdir -p /tmp/e1 /tmp/e2',
    'tar -xzf /tmp/paquete.tar.gz -C /tmp/e1',
    'unzip -o /tmp/e1/flag.zip -d /tmp/e2',
    'cat /tmp/e2/flag.txt',
  ],
};

const TRACKS = ['fundamentos', 'filtrado', 'busqueda', 'procesado', 'permisos', 'procesos', 'redes', 'archivos', 'scripting', 'forense', 'boss'];
let patched = 0;
for (const track of TRACKS) {
  const dir = path.join(repoRoot, 'levels', track);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.yaml')) continue;
    const full = path.join(dir, f);
    const text = fs.readFileSync(full, 'utf8');
    let def;
    try {
      def = YAML.parse(text);
    } catch {
      continue; // los YAML rotos se corrigen a mano
    }
    if (def?.solution) continue;
    const id = def?.id;
    const sol = MAP[id];
    if (!sol) {
      console.log(`sin solución en el mapa: ${id} (${track}/${f})`);
      continue;
    }
    const block = `solution: |\n${sol.map((l) => `  ${l}`).join('\n')}\n`;
    // inserta antes de keywords: (o al final)
    let out;
    if (text.includes('\nkeywords:')) {
      out = text.replace(/\nkeywords:/, `\n${block}\nkeywords:`);
    } else {
      out = text.trimEnd() + '\n' + block;
    }
    fs.writeFileSync(full, out);
    patched++;
  }
}
console.log(patched === 0 ? 'NADA por parchear' : `parcheados ${patched} YAML`);
