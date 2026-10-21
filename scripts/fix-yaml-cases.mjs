/**
 * Corrige los YAML con escapes inválidos detectados por el lint.
 * (los caracteres \\' y \\$ se rompieron al generar los ficheros)
 */
import fs from 'node:fs';

function patch(file, from, to) {
  const t = fs.readFileSync(file, 'utf8');
  if (!t.includes(from)) {
    console.log(`NO MATCH en ${file}`);
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(file, t.split(from).join(to));
  console.log(`ok ${file}`);
}

// 1) filtrado/l5: cheatsheet con comillas rotas
patch(
  'levels/filtrado/l5.yaml',
  "  - {cmd: 'tr -d \\' \\''}\n",
  "  - {cmd: \"tr -d ' '\", desc: 'borra espacios'}\n",
);

// nota: si la línea original era la desc completa, probamos la variante larga
try {
  const t = fs.readFileSync('levels/filtrado/l5.yaml', 'utf8');
  if (!t.includes("cmd: \"tr -d ' '\"")) {
    fs.writeFileSync(
      'levels/filtrado/l5.yaml',
      t.replace(/  - \{cmd: 'tr -d .*?borra espacio\}\n/, "  - {cmd: \"tr -d ' '\", desc: 'borra espacios'}\n"),
    );
    console.log('ok (regex) levels/filtrado/l5.yaml');
  }
} catch { /* noop */ }

// 2) procesos/l3 hint con \$ escapado
patch(
  'levels/procesos/l3.yaml',
  '"cat \\$(du -a /var/dojo/silo | sort -n | tail -1 | cut -f2-)"',
  '"cat $(du -a /var/dojo/silo | sort -n | tail -1 | cut -f2-)"',
);

// 3) archivos/l5 hint con \$ escapado
patch(
  'levels/archivos/l5.yaml',
  '"cat \\$(readlink -f /home/agent/pomer-c)"',
  '"cat $(readlink -f /home/agent/pomer-c)"',
);

// 4) boss/l1 hint con \$ escapado
patch(
  'levels/boss/l1.yaml',
  '"cat \\$(find /var/dojo/jungla -name \'(.*)\' ) | base64 -d"',
  '"cat $(find /var/dojo/jungla -name \'.*\') | base64 -d"',
);
