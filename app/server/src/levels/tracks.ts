/** Metadatos de los tracks (única fuente de verdad; también los usa el front vía API). */

export const TRACKS = [
  { id: 'fundamentos', name: 'Fundamentos', icon: '🎓', color: '#88C0D0', order: 1, description: 'ls, cd, pwd, cat, touch, mkdir, cp, mv, rm, rutas, globbing y ayuda' },
  { id: 'filtrado', name: 'Lectura y filtrado', icon: '🔍', color: '#81A1C1', order: 2, description: 'head, tail -f, less, wc, cut, sort, uniq, tr' },
  { id: 'busqueda', name: 'Búsqueda', icon: '🔎', color: '#5E81AC', order: 3, description: 'grep, find, locate, xargs, regex' },
  { id: 'procesado', name: 'Procesamiento de texto', icon: '⚙️', color: '#A3BE8C', order: 4, description: 'awk, sed, pipes, redirecciones, tee, process substitution' },
  { id: 'permisos', name: 'Permisos y usuarios', icon: '🔐', color: '#EBCB8B', order: 5, description: 'chmod, chown, umask, sudo, SUID, grupos' },
  { id: 'procesos', name: 'Procesos y sistema', icon: '📟', color: '#D08770', order: 6, description: 'ps, top, kill, jobs, systemctl simulado, df, du, lsof, señales' },
  { id: 'redes', name: 'Redes (simulado)', icon: '🌐', color: '#BF616A', order: 7, description: 'ss, curl interno, nc, dig simulado' },
  { id: 'archivos', name: 'Archivos y compresión', icon: '📦', color: '#B48EAD', order: 8, description: 'tar, gzip, zip, diff, patch, enlaces' },
  { id: 'scripting', name: 'Scripting Bash', icon: '📜', color: '#A3BE8C', order: 9, description: 'variables, condicionales, bucles, funciones, trap, getopts, set -x' },
  { id: 'forense', name: 'Forense / CTF de logs', icon: '🕵️', color: '#EBCB8B', order: 10, description: 'logs, base64, hex, rot13, detectar intrusos' },
  { id: 'boss', name: 'Boss / Cronometrado', icon: '⚔️', color: '#BF616A', order: 11, description: 'desafíos que combinan varias herramientas' },
  { id: 'grep', name: 'Grep (especialización)', icon: '🧲', color: '#8FBCBB', order: 12, description: 'solo grep a fondo: -i -v -n -o -E -F -r -w, contexto -A/-B, anclas, clases, --include, -x y boss en cadena' },
  { id: 'awk', name: 'Awk (especialización)', icon: '📐', color: '#88C0D0', order: 13, description: 'solo awk a fondo: campos, NF/NR, -F:, comparaciones, regex por campo, máximo+END, concatenación, asociativos, join FNR==NR y match()' },
  { id: 'grep-pro', name: 'Grep Maestro', icon: '🥇', color: '#5EBA97', order: 14, description: '24 niveles de experto SOLO grep: extracción -oE, -c/-l/-L, límite -m, patrones -f, contexto -A/-B/-C asimétrico, alternancia anclada, --include/--exclude, IPs y fechas y boss triple-filtro' },
  { id: 'awk-pro', name: 'Awk Maestro', icon: '🏅', color: '#EBCB8B', order: 15, description: '24 niveles de experto SOLO awk: -F, umbrales numéricos, suma/máximo, NR y rangos, regex por campo, length/substr/index/split, sub/gsub, printf/sprintf, BEGIN/FS, OFS, arrays dedup e histograma, join FNR==NR y match()' },
  { id: 'sysadmin', name: 'Sysadmin', icon: '🛠️', color: '#D08770', order: 16, description: 'configura y valida servicios reales: sshd (sshd -t, AllowUsers, banner), nginx -t, apache2ctl configtest, usuarios, binarios y procesos' },
  { id: 'dns', name: 'DNS y resolución', icon: '🌐', color: '#BF616A', order: 17, description: 'dig contra un dnsmasq local: A/TXT/MX/ANY/PTR, +short, +noall +answer, NXDOMAIN, +tcp, resolv.conf/getent, logs de consultas y /etc/hosts' },
  { id: 'sql', name: 'SQL / SQLite', icon: '🗃️', color: '#5E81AC', order: 18, description: 'sqlite3: SELECT/WHERE/ORDER BY, COUNT/GROUP BY, LIKE, JOIN, MAX, borrados y UPDATE, CASE, funciones datetime, transacciones y boss de agregados' },
] as const;

export interface CheatsheetEntry {
  cmd: string;
  desc: string;
}

/** Un «ejemplo» del nivel: cómo se ve la SALIDA esperada (sin revelar el comando). */
export interface LevelExample {
  title: string;   // p. ej. «salida esperada (flag demo)»
  content: string; // bloque terminal pre-formateado
}

export type TrackId = (typeof TRACKS)[number]['id'];
export type SecurityProfile = 'default' | 'sudo';
export type TrackMetadata = (typeof TRACKS)[number];

export function loadTrackMetadata(): TrackMetadata[] {
  return [...TRACKS];
}

export interface LevelDefinition {
  id: string;              // p. ej. fundamentos-l1
  track: TrackId;
  index: number;           // 1-based dentro del track
  title: string;
  subtitle?: string;
  xp: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  brief: string;           // historia/misión
  goal: string;            // objetivo en una frase
  /** Script de setup (bash, se ejecuta como root; tiene $DOJO_FLAG inyectada). */
  setup: string;
  /** Solución de referencia: nunca lee $DOJO_FLAG del entorno. */
  solution: string;
  hints: string[];         // progresivas, en orden
  cheatsheet: CheatsheetEntry[];
  teach: string;           // explicación post-nivel
  keywords: string[];
  profile: SecurityProfile;
  /** Ejemplos visuales de la salida esperada (generados con scripts/gen-examples.mjs). */
  examples?: LevelExample[];
}
