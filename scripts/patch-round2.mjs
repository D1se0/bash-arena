/**
 * Ronda de parches 2: defectos detectados por test-levels.
 *  - mkdir -p /var/dojo en los setups que escriben ahí sin crearlo
 *  - setsid para los procesos de fondo (sin setsid mueren con el exec)
 *  - soluciones corregidas
 */
import fs from 'node:fs';

function patch(file, pairs) {
  let t = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of pairs) {
    if (!t.includes(from)) {
      console.log(`WARN no-match en ${file}: ${JSON.stringify(from.slice(0, 50))}`);
      continue;
    }
    t = t.split(from).join(to);
    changed = true;
  }
  if (changed) fs.writeFileSync(file, t);
  console.log(`ok ${file}`);
}

const cmd = {
  q: "'", // comilla simple
};

const mkdirTargets = [
  'levels/filtrado/l3.yaml',
  'levels/filtrado/l4.yaml',
  'levels/filtrado/l5.yaml',
  'levels/busqueda/l3.yaml',
  'levels/procesado/l1.yaml',
  'levels/procesado/l2.yaml',
  'levels/procesado/l3.yaml',
  'levels/procesado/l4.yaml',
  'levels/procesado/l5.yaml',
  'levels/permisos/l3.yaml',
  'levels/archivos/l4.yaml',
  'levels/forense/l2.yaml',
  'levels/forense/l3.yaml',
  'levels/forense/l4.yaml',
  'levels/forense/l5.yaml',
];
const mkdirLine = '  arena-prompt "LVL ';
const mkdirLineBoss = '  arena-prompt "BOSS ';
for (const f of mkdirTargets) {
  patch(f, [
    [mkdirLine, '  mkdir -p /var/dojo\n  arena-prompt "LVL '],
    [mkdirLineBoss, '  mkdir -p /var/dojo\n  arena-prompt "BOSS '],
  ]);
}

// procesos-l1: proceso de fondo con setsid para sobrevivir al exec
patch('levels/procesos/l1.yaml', [
  [
    'python3 -c "import time\\ntime.sleep(30000)" "$DOJO_FLAG" &',
    'setsid python3 -c "import time\\ntime.sleep(30000)" "$DOJO_FLAG" >/dev/null 2>&1 &',
  ],
  [
    "ps aux | grep 'FLAG{'",
    "ps aux | grep 'FLAG{' | grep -v grep",
  ],
]);

// procesos-l2: hunterd con setsid (sin disown suelto)
patch('levels/procesos/l2.yaml', [
  ['  setsid /usr/local/bin/hunterd &\n  disown', '  setsid /usr/local/bin/hunterd >/dev/null 2>&1 &'],
]);

// procesos-l3: el mayor puede ser el directorio; usa -type f -printf
patch('levels/procesos/l3.yaml', [
  [
    'cat "$(du -a /var/dojo/silo | sort -n | tail -1 | cut -f2-)"',
    'cat "$(find /var/dojo/silo -type f -printf "%s %p\n" | sort -n | tail -1 | cut -d" " -f2-)"',
  ],
  [
    '"cat \\$(du -a /var/dojo/silo | sort -n | tail -1 | cut -f2-)"',
    '"find /var/dojo/silo -type f -printf \'%s %p\\n\' | sort -n | tail -1  (el mayor en bytes)"',
  ],
]);

// procesos-l4: el sostenedor del fd sobrevive con setsid
patch('levels/procesos/l4.yaml', [
  [
    "python3 -c \"\n  import sys, time\n  f = open('/tmp/ocultad.sock')\n  time.sleep(30000)\n  \" &\n  disown",
    'setsid python3 -c "f = open(\'/tmp/ocultad.sock\'); import time; time.sleep(30000)" >/dev/null 2>&1 &',
  ],
]);

// redes-l1: servidor TCP python persistente en loopback (sustituye el loop nc)
patch('levels/redes/l1.yaml', [
  [
    "setsid bash -c 'while true; do nc -l 127.0.0.1 7080 < /var/oracle/msg.txt; done' >/dev/null 2>&1 &\n",
    "setsid python3 -c \"import socket\ns = socket.socket()\ns.bind(('127.0.0.1', 7080))\ns.listen(1)\nwhile True:\n    c, _ = s.accept()\n    c.send(open('/var/oracle/msg.txt', 'rb').read())\n    c.close()\" >/dev/null 2>&1 &\n",
  ],
]);

// redes-l3: servidor persistente en el puerto enhorabuena
patch('levels/redes/l3.yaml', [
  [
    "setsid bash -c 'while true; do nc -l 127.0.0.1 9696 < /tmp/puerto-constancia.txt; done' >/dev/null 2>&1 &\n",
    "setsid python3 -c \"import socket\ns = socket.socket()\ns.bind(('127.0.0.1', 9696))\ns.listen(1)\nwhile True:\n    c, _ = s.accept()\n    c.send(open('/tmp/puerto-constancia.txt', 'rb').read())\n    c.close()\" >/dev/null 2>&1 &\n",
  ],
]);

console.log('ronda 2 lista');
