/*
 * gen-walkthroughs — genera la sección «Soluciones paso a paso» del sitio de
 * docs. Lee levels/*.yaml y produce docs-site/src/walkthroughs.generated.ts
 * con, por nivel: objetivo, contexto, pasos numerados (cada comando
 * desglosado con su «por qué» y cada flag explicada), pistas del dojo y
 * la lección (teach). Los flags no catalogados se marcan «consulta el
 * manual» en vez de inventar significados.
 * Salida: docs-site/src/walkthroughs.generated.ts (regenerable siempre).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));

const TRACK_ORDER = ['fundamentos', 'filtrado', 'busqueda', 'procesado', 'permisos', 'procesos', 'redes', 'archivos', 'scripting', 'forense', 'boss', 'grep', 'awk', 'grep-pro', 'awk-pro'];
const LEVELS_DIR = path.join(repoRoot, 'levels');
const OUT = path.join(repoRoot, 'docs-site/src/walkthroughs.generated.ts');

/* ── diccionario didáctico de comandos ─────────────────────────────────── */
const DICT = {
  cat: { desc: 'vuelca el contenido de un fichero al stdout (concatenar archivos)', flags: { n: 'numera las líneas al mostrarse' } },
  cd: { desc: 'comando interno del shell: cambia el directorio de trabajo actual; no es un binario, bash lo interpreta' },
  ls: { desc: 'lista el contenido de un directorio', flags: { l: 'formato largo (permisos, dueño, tamaño, fecha)', a: 'incluye ocultos (.nombre)', h: 'tamaños humanamente legibles (con -l)', R: 'recursivo: baja a subdirectorios', S: 'ordena por tamaño', t: 'ordena por fecha de modificación', r: 'invierte el orden' } },
  echo: { desc: 'imprime sus argumentos en stdout (con \\n final)', flags: { n: 'sin salto de línea final', e: 'interpola secuencias de escape (\\n, \\t…)' } },
  printf: { desc: 'imprime con formato estilo C: cada %s sustituye un argumento; controla el salto de línea con \\n' },
  grep: { desc: 'filtra las líneas que coinciden con un patrón (regex básica por defecto)', flags: { i: 'insensible a mayúsculas', v: 'invierte el filtro: descarta las que SÍ coinciden', r: 'búsqueda recursiva en directorios', o: 'imprime solo la parte que coincide (no la línea entera)', E: 'regex extendida (ERE: +, ?, |, alternancia)', F: 'patrón literal, sin regex', n: 'numera las líneas coincidentes', c: 'cuenta coincidencias en vez de imprimirlas', l: 'solo nombres de fichero con coincidencia', q: 'silencioso: solo el código de salida (0 = hubo coincidencia)' } },
  sed: { desc: 'editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación', flags: { n: 'suprime la impresión automática (útil con el comando p)' } },
  awk: { desc: 'procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)', flags: { F: 'cambia el separador de campos (p. ej. -F:)' } },
  cut: { desc: 'corta columnas de texto por delimitador o por posición', flags: { c: 'selección por caracteres (rangos tipo 1-5)', d: 'carácter delimitador (con -f)', f: 'números de campo a conservar' } },
  sort: { desc: 'ordena líneas lexicográficamente por defecto', flags: { n: 'orden numérico', r: 'inverso (descendente)', u: 'elimina duplicados tras ordenar', k: 'ordena por columna concreta (k2 = segunda)' } },
  uniq: { desc: 'comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)', flags: { c: 'prefija cada línea con su nº de repeticiones', u: 'muestra solo las únicas (nunca repetidas)', d: 'muestra solo las repetidas' } },
  wc: { desc: 'cuenta: sin opciones imprime líneas/palabras/bytes', flags: { l: 'sólo nº de líneas', w: 'sólo nº de palabras', c: 'sólo nº de bytes' } },
  tr: { desc: 'traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)', flags: { d: 'elimina los caracteres del conjunto dado' } },
  rev: { desc: 'invierte cada línea carácter a carácter' },
  tac: { desc: 'invierte el ORDEN de las líneas (cat al revés)' },
  nl: { desc: 'numera las líneas de un texto' },
  head: { desc: 'imprime el principio de un fichero/flujo', flags: { n: 'cuántas líneas mostrar (-n 5 = las primeras 5)' } },
  tail: { desc: 'imprime el final de un fichero/flujo', flags: { n: 'cuántas líneas mostrar (-n 3 = las últimas 3)', f: 'sigue el fichero en vivo (log en marchas)' } },
  diff: { desc: 'compara dos ficheros línea a línea; -u produce el formato de remiendo (contexto + marcadores)', flags: { u: 'formato unificado (el que consumen patch/git)' } },
  patch: { desc: 'aplica un remiendo (diff) sobre un fichero; se lee el diff de stdin con <', flags: { p: 'nivela los prefijos de las rutas del remiendo (p0 = tal cual, p1 = quita el primer componente)' } },
  base64: { desc: 'codifica/decodifica base64 (binario ↔ texto plano)', flags: { d: 'decodifica (de base64 a binario)' } },
  xxd: { desc: 'volcado hexadecimal de un fichero (byte a byte con representación ASCII la derecha)', flags: { r: 'revertir: de hexadecimal de vuelta a bytes', p: 'salida limpia: sólo hex sin offsets ni columna ASCII' } },
  strings: { desc: 'extrae las cadenas de texto imprimible de un fichero binario' },
  stat: { desc: 'metadatos de fichero: tamaño, permisos en octal, dueño, timestamps de acceso/modificación' },
  file: { desc: 'adivina el TIPO real de un fichero mirando su contenido (cabecera mágica), no su extensión' },
  du: { desc: 'tamaño en disco usado por ficheros/directorios', flags: { h: 'legible para humanos (K, M, G)', s: 'resumen (no el detalle por fichero)' } },
  df: { desc: 'uso de espacio en los sistemas de ficheros montados', flags: { h: 'legible para humanos' } },
  find: { desc: 'busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo', flags: { name: 'coincidencia del nombre (comillas: -name "*.log")', type: 'tipo de nodo (f fichero, d directorio, l enlace)', mmin: 'modificado hace n minutos', size: 'por tamaño (p. ej. +100k)' } },
  chmod: { desc: 'cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)', flags: { R: 'recursivo' } },
  chown: { desc: 'cambia dueño/grupo de un fichero (formato usuario:grupo)', flags: { R: 'recursivo' } },
  groups: { desc: 'lista los grupos a los que pertenece un usuario' },
  id: { desc: 'uid, gid y grupos del usuario actual (o del dado)' },
  sudo: { desc: 'ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)' },
  ps: { desc: 'lista procesos', flags: { a: 'de otros usuarios', u: 'con dueño/uso', x: 'incluye sin terminal', e: 'todos los procesos del sistema', f: 'árbol con argumentos completos' } },
  kill: { desc: 'manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)', flags: { '9': 'señal KILL: muerte inmediata sin limpieza (última opción)' } },
  jobs: { desc: 'trabajos del shell en background/suspended (comando interno de bash)' },
  nice: { desc: 'lanza un comando con prioridad de CPU ajustada (downgrade/up de cortesía)' },
  ln: { desc: 'crea enlaces (duros por defecto; -s para simbólico)', flags: { s: 'enlace simbólico (atajo que guarda la RUTA, no los datos)' } },
  readlink: { desc: 'resuelve el destino de un enlace simbólico', flags: { f: 'resuelve toda la cadena hasta el fichero real' } },
  realpath: { desc: 'ruta canónica absoluta de un fichero' },
  mktemp: { desc: 'crea un fichero temporal con nombre seguro y devuelve su ruta' },
  mkdir: { desc: 'crea directorios', flags: { p: 'crea los niveles intermedios que falten y no da error si ya existen' } },
  cp: { desc: 'copia ficheros', flags: { r: 'recursivo (directorios)', p: 'conserva permisos/timestamps', a: 'archivo: r+p+conservar enlaces' } },
  mv: { desc: 'mueve o renombra ficheros/directorios' },
  rm: { desc: 'borra ficheros (¡irrecuperable!)', flags: { r: 'recursivo (directorios)', f: 'sin preguntar ni avisar de inexistentes' } },
  tar: { desc: 'empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)', flags: { c: 'crear archivo', x: 'extraer', t: 'listar contenido sin extraer', z: 'filtro gzip', f: 'nombre del archivo tar' } },
  gzip: { desc: 'comprime un fichero (locreature .gz; el original desaparece)', flags: { d: 'descomprimir', k: 'conserva el original', l: 'sólo información de compresión' } },
  gunzip: { desc: 'descomprime ficheros .gz', flags: { k: 'conserva el .gz original' } },
  xz: { desc: 'compresión de alta tasa (ficheros .xz)', flags: { d: 'descomprimir' } },
  unzip: { desc: 'extrae archivos .zip' },
  zip: { desc: 'crea archivos .zip', flags: { r: 'recursivo (directorios enteros)' } },
  sha256sum: { desc: 'hash SHA-256 por fichero (integridad: dos ficheros iguales → mismo hash)' },
  md5sum: { desc: 'hash MD5 por fichero (integridad clásica, criptografía obsoleta)' },
  python3: { desc: 'intérprete Python: para procesar datos finos cuando grep/sed/awk no bastan; con -c ejecuta código inline' },
  bc: { desc: "calculadora de precisión arbitraria; espera operaciones forma stdin (p. ej. echo '2+2' | bc)" },
  xargs: { desc: 'convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)', flags: { n: 'nº máx de argumentos por invocación', I: 'marcador de sustitución {}: cada línea va ahí' } },
  tee: { desc: 'divide el flujo: lo Guía TANTO a un fichero como a stdout (tubería en T)' },
  curl: { desc: 'petición HTTP/CLI (sólo red local del dojo, sin internet)', flags: { s: 'silencia la barra de progreso' } },
  nc: { desc: 'netcat: conexiones TCP/UDP crudas para probar puertos o escuchar (sólo localhost en el dojo)', flags: { z: 'modo scan: comprueba el puerto sin enviar datos', l: 'modo listen (espera conexiones)' } },
  ss: { desc: 'estado de sockets y puertos (sustituto moderno de netstat)', flags: { t: 'sólo TCP', l: 'sólo en escucha', n: 'no resuelve nombres' } },
  ping: { desc: 'comprueba alcanzabilidad de un host por ICMP' },
  hostname: { desc: 'nombre del host (y con -I su IP)' },
  whoami: { desc: 'el usuario actual' },
  uptime: { desc: 'tiempo encendido y carga media del sistema' },
  watch: { desc: 'repite un comando cada N segundos y refresca la pantalla' },
  sleep: { desc: 'espera los segundos dados (o s/m/h)' },
  export: { desc: 'comando interno de bash: marca variables de entorno visibles para los procesos hijos' },
  source: { desc: 'comando interno de bash: interpreta un script EN el shell actual (no en un hijo)' },
  env: { desc: 'imprime (o lanza con) las variables de entorno actuales' },
  exit: { desc: 'termina el shell/swrss con el código dado' },
  sh: { desc: 'shell POSIX (aquí bash): sh -c \'CHAIN\' ejecuta una cadena de comandos como proceso nuevo' },
  bash: { desc: 'ejecuta un script/cadena con bash' },
};

/* significado de flags LONG (-- palabra) que se usan a menudo */
const LONG = {
  '--all': 'aplica a todos los ítems (p. ej. procesos, u ocultos)',
  '--help': 'imprime la ayuda del comando',
  '--color': 'colorea la salida',
  '--max-count': 'para tras N coincidencias',
  '--include': 'patrones de ficheros a incluir en la búsqueda',
};

/** ¿esto es un comando conocido? */
function word(w) { return /^[a-zA-Z0-9_.-]+$/.test(w); }

/** nota para un comando pequeño desconocido o builtin */
function whyOf(cmdName, rawSeg) {
  const base = cmdName.toLowerCase();
  if (DICT[base]) return DICT[base].desc;
  if (cmdName.startsWith('$')) return 'expansión de variable: el shell sustituye $VAR por su valor antes de ejecutar';
  if (cmdName === './' ) return 'ejecución de un binario local del directorio actual';
  return null;
}

/** divide una cadena en segmentos top-level por separadores (&&, ||, ;, |) */
function splitTop(src, seps) {
  const out = [];
  let cur = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const ch = src[i];
    if (quote) {
      if (ch === quote) quote = null;
      cur += ch; i++; continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; cur += ch; i++; continue; }
    if (ch === '\\') { cur += src[i + 1] ?? ''; i += 2; continue; }
    // heredoc: no trocear el cuerpo
    if (ch === '<' && src.slice(i, i + 2) === '<<') {
      // copia hasta el terminador del heredoc (línea EOF…)
      const m = /<<-?\s*(['"])([\w-]+)\1/.exec(src.slice(i, i + 60));
      const del = m ? m[2] : 'EOF';
      const from = src.indexOf('\n', i);
      if (from === -1) { cur += src.slice(i); i = src.length; continue; }
      const rest = src.slice(from + 1);
      const endIdx = rest.split('\n').findIndex((l) => l.trim() === del.trim());
      if (endIdx === -1) { cur += rest; i = src.length; continue; }
      const blockLines = rest.split('\n').slice(0, endIdx + 1).join('\n');
      cur += src.slice(i, from + 1) + blockLines;
      i = from + 1 + blockLines.length + (src[from + 1 + blockLines.length] === '\n' ? 1 : 0);
      // el heredoc pertenece al segmento actual; el shell lo cierra aquí
      // (los separadores tras el bloque cortan normal)
      continue;
    }
    let matched = null;
    for (const sep of seps) {
      if (src.startsWith(sep, i)) { matched = sep; break; }
    }
    if (matched) {
      out.push(cur.trim()); cur = ''; i += matched.length;
      if (matched === '&&' || matched === '||') { /* nada */ }
      continue;
    }
    cur += ch; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** pipeline: división de un segmento por | (fuera de comillas/heredoc) */
function splitPipeline(seg) { return splitTop(seg, ['|']); }

/** separa的美国 comando: palabra inicial + flags + argumentos */
function parseCmd(seg) {
  const tokens = [];
  let cur = '';
  let quote = null;
  let i = 0;
  while (i < seg.length) {
    const ch = seg[i];
    if (quote) { if (ch === quote) quote = null; else cur += ch; i++; continue; }
    if (ch === "'" || ch === '"') { quote = ch; i++; continue; }
    if (ch === '\\') { cur += seg[i + 1] ?? ''; i += 2; continue; }
    if (/\s/.test(ch)) { if (cur) tokens.push(cur); cur = ''; i++; continue; }
    cur += ch; i++;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function flagsOf(tokens, cmdName) {
  const help = DICT[cmdName]?.flags ?? {};
  const out = [];
  let numericOverride = null;
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.startsWith('-')) continue;
    if (numericOverride !== null && t === '') continue;
    if (t === '--') break;
    if (t.startsWith('--')) {
      const key = t.split('=')[0];
      out.push({ flag: t, meaning: LONG[key] ?? (t === '--help' ? 'ayuda' : 'flag larga del comando — revisa «man ' + cmdName + '»') });
      continue;
    }
    // flag corta, posiblemente combinada: -la → l + a
    const letters = t.slice(1);
    // si el siguiente token es número/argumento de -n estilos, es la flag suelta
    const isNumericFlag = /^n$|^[0-9]+$/.test(letters);
    for (const ltr of letters) {
      let meaning = help[ltr];
      if (meaning === undefined) meaning = /^[a-z]$/.test(ltr) ? `flag ${ltr} del comando — revisa «man ${cmdName}»` : null;
      if (meaning !== null) out.push({ flag: `-${ltr}`, meaning: meaning ?? `flag ${ltr} del comando — revisa «man ${cmdName}»` });
    }
    if (isNumericFlag && tokens[i + 1] && /^[0-9]+$/.test(tokens[i + 1])) {
      numericOverride = tokens[i + 1];
      out.push({ flag: `-n ${tokens[i + 1]}`, meaning: 'la flag -n ANTES de un número fija el número (aquí: ' + tokens[i + 1] + ')' });
      i++;
      continue;
    }
    if (isNumericFlag && tokens[i + 1] === undefined) {
      numericOverride = ' ';
    }
  }
  return out;
}

/** sospecha un heredoc? */
function hasHeredoc(seg) { return /<<-?/.test(seg); }

async function main() {
  const levels = [];
  for (const track of TRACK_ORDER) {
    const dir = path.join(LEVELS_DIR, track);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''), 10);
      const nb = parseInt(b.replace(/\D/g, ''), 10);
      return na - nb;
    });
    for (const f of files) {
      const def = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const solution = String(def.solution ?? '').trim();
      const steps = [];
      // corta en cadenas compuestas (&& || ;) y luego en pipes
      const bigSegs = splitTop(solution, ['&&', '||', ';']);
      for (const seg of bigSegs) {
        const pipes = splitPipeline(seg);
        const cmds = [];
        for (const piece of pipes) {
          if (!piece.trim()) continue;
          if (hasHeredoc(piece)) {
            const first = parseCmd(piece)[0] ?? 'bash';
            cmds.push({
              cmd: first,
              args: '(código/contenido inline via heredoc <<)',
              why: hasHeredoc(piece) ? `pasos escritos en línea: el shell lee el texto entre << y su delimitador y se lo enseña a ${first}` : '',
              flags: [],
            });
            continue;
          }
          const toks = parseCmd(piece);
          const name = toks[0] ?? '';
          if (!name) continue;
          let why = whyOf(name, piece);
          if (why === null) why = `comando ${name} — revisa «man ${name}»`;
          const flags = flagsOf(toks, name);
          cmds.push({
            cmd: name,
            args: toks.slice(1).join(' '),
            why,
            flags,
          });
        }
        steps.push({ raw: seg, cmds });
      }
      levels.push({
        id: def.id,
        track: def.track,
        index: def.index ?? 0,
        title: def.title,
        subtitle: def.subtitle ?? null,
        xp: def.xp,
        difficulty: def.difficulty,
        brief: String(def.brief ?? '').trim(),
        goal: String(def.goal ?? '').trim(),
        keywords: def.keywords ?? [],
        hints: (def.hints ?? []).map(String),
        cheatsheet: (def.cheatsheet ?? []).map((c) => ({ cmd: String(c.cmd), desc: String(c.desc) })),
        teach: String(def.teach ?? '').trim(),
        steps,
        raw: solution,
      });
    }
  }
  levels.sort((a, b) => {
    const ta = TRACK_ORDER.indexOf(a.track), tb = TRACK_ORDER.indexOf(b.track);
    return (ta - tb) || (a.index - b.index) || a.id.localeCompare(b.id);
  });
  const header = `/*
 * GENERADO — NO EDITAR A MANO. regenerar con: node scripts/gen-walkthroughs.mjs
 * Fuente de verdad: levels/*.yaml.
 */\n`;
  const body = `export interface StepCmd { cmd: string; args: string; why: string; flags: { flag: string; meaning: string }[]; }
export interface Step { raw: string; cmds: StepCmd[]; }
export interface WalkthroughData {
  id: string; track: string; index: number; title: string; subtitle: string | null;
  xp: number; difficulty: number; brief: string; goal: string; keywords: string[];
  hints: string[]; cheatsheet: { cmd: string; desc: string }[]; teach: string;
  steps: Step[]; raw: string;
}
export const WALKTHROUGHS: WalkthroughData[] = ${JSON.stringify(levels, null, 2)};
export const TRACK_ORDER = ${JSON.stringify(TRACK_ORDER)};
`;
  fs.writeFileSync(OUT, header + body);
  console.log(`WALKTHROUGHS generado: ${levels.length} niveles → ${path.relative(repoRoot, OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
}

await main();
