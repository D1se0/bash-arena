/*
 * gen-round-6 — EXPANSIÓN del catálogo (ronda 6):
 *   · grep  +18 (l51–l68) — MUCHA más práctica de grep
 *   · awk   +18 (l51–l68) — MUCHA más práctica de awk
 * Técnica: cada nivel introduce (o combina) al menos una herramienta o idioma
 * nuevo respecto a la ronda anterior, para afilar FLUIDEZ y VARIEDAD.
 * Regenerar: node scripts/gen-round-6.mjs
 * Contrato del test (scripts/test-levels.mjs): el setup contiene $DOJO_FLAG
 * literal; la solución NO lo menciona, termina con exit 0 y lo imprime en
 * stdout. En los template literals de JS, "$DOJO_FLAG" es texto normal (no
 * interpola: solo lo hace "${").
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));
const HOME = '/home/agent';

function mk(o) {
  return {
    id: `${o.track}-l${o.index}`,
    track: o.track,
    index: o.index,
    title: o.title,
    subtitle: o.subtitle ?? '',
    xp: o.xp,
    difficulty: o.difficulty,
    brief: o.brief,
    goal: o.goal,
    setup: `#!/bin/bash\nset -e\n${o.setup()}`,
    solution: o.solution,
    hints: o.hints,
    teach: o.teach,
    cheatsheet: o.cheatsheet,
    keywords: o.keywords,
    profile: o.profile ?? 'default',
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{round6-demo}' }],
  };
}

function emit(track, defs) {
  const dir = path.join(repoRoot, 'levels', track);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const lv of defs) {
    fs.writeFileSync(path.join(dir, `l${lv.index}.yaml`), YAML.stringify(lv, { lineWidth: 90 }));
  }
  console.log(`${track}: +${defs.length} niveles (l${defs[0].index}–l${defs[defs.length - 1].index})`);
}

const P = (n, tr) => `arena-prompt "LVL ${n}" "${tr}"\n`;

/* ════════════════════════════════════════════════════════════ GREP ══ */
const GREP = [];

GREP.push(mk({
  track: 'grep', index: 51, title: 'El censo de fallos', subtitle: '-c: cuenta, no muestra',
  xp: 50, difficulty: 2,
  brief: 'El turnero registra los accesos; interesa CUÁNTOS fallos hubo y verlos todos: la marca viaja en uno de ellos.',
  goal: 'De acceso.log imprime PRIMERO el CONTEO de líneas FAIL (solo el número) y a continuación TODAS las líneas FAIL (la marca viaja en una).',
  setup: () => P(51, 'Grep') + `cat > ${HOME}/acceso.log <<EOF
08:01 OK usuario root
08:02 FAIL usuario root flag=$DOJO_FLAG
08:03 FAIL usuario root
08:04 OK usuario alice
08:05 FAIL usuario alice
08:06 OK usuario bob
08:07 FAIL usuario bob
EOF
chown agent:agent ${HOME}/acceso.log`,
  solution: `grep -c 'FAIL' ${HOME}/acceso.log; grep 'FAIL' ${HOME}/acceso.log`,
  hints: [
    '-c cambia el modo de salida: en vez de las líneas, imprime CUÁNTAS casan.',
    'El conteo va en la primera impresión; para las líneas completas ejecuta un grep normal después (separados por ; desde tu terminal).',
    `grep -c 'FAIL' acceso.log; grep 'FAIL' acceso.log`,
  ],
  teach: '-c es el «říke « cuántas?» de grep: en auditores de rápido uso es la primera métrica. Combinarlo con un grep de líneas completas te da conteo Y evidencia en una sola pasada de flujo.',
  cheatsheet: [
    { cmd: 'grep -c p f', desc: 'número de líneas que casan (no las líneas)' },
    { cmd: 'grep -cv p f', desc: 'cuenta de las que NO casan' },
  ],
  keywords: ['grep', '-c', 'contar', 'conteo'],
}));

GREP.push(mk({
  track: 'grep', index: 52, title: 'Palabra exacta', subtitle: '-w: la coincidencia completa',
  xp: 50, difficulty: 2,
  brief: 'El fichero es un zoo de derivados «fallo», «fallos», «fallo2026»… solo con LA PALABRA CASI SIN PEGAMENTO es legítima y ahí viaja la marca.',
  goal: 'De acciones.txt imprime ÚNICAMENTE las líneas que contienen la PALABRA «fallo» como palabra completa (no derivados ni mezclas).',
  setup: () => P(52, 'Grep') + `cat > ${HOME}/acciones.txt <<EOF
sondeo fallo leve
make cierra el registro fallos
afin fallo2026 fuera de plazo
bancos sin fallo; sin aviso flag=$DOJO_FLAG
media fallo_media a controlar
EOF
chown agent:agent ${HOME}/acciones.txt`,
  solution: `grep -w 'fallo' ${HOME}/acciones.txt`,
  hints: [
    '-w solo casa cuando el patrón está rodeado por límites de palabra (letras, números o _ cuentan como pegamento).',
    'Con -w, «fallos» y «fallo2026» NO casan «fallo»: el pegamento de detrás mata la coincidencia.',
    `grep -w 'fallo' acciones.txt`,
  ],
  teach: '-w es el antídoto contra el «casi»: cuando buscas un token EXACTO entre derivados, evita recortados a MessageBox y falso-positivos de subsegún.',
  cheatsheet: [{ cmd: 'grep -w p f', desc: 'coincidencia con palabra completa' }],
  keywords: ['grep', '-w', 'palabra', 'límites'],
}));

GREP.push(mk({
  track: 'grep', index: 53, title: 'La empresa exacta', subtitle: '-x: línea completa + vecina con -A',
  xp: 50, difficulty: 2,
  brief: 'El tablero lista estados: la mayoría son variantes; la línea EXACTA de proceder es un baliza — y SU siguiente línea trae la marca.',
  goal: 'De tareas.log imprime la línea EXACTA "procedimiento: completo" (y solo ella) JUNTO con la línea que la sigue en el fichero: la marca viaja en la vecina.',
  setup: () => P(53, 'Grep') + `cat > ${HOME}/tareas.log <<EOF
procedimiento: completo parcial
procedimiento: completo revisado
procedimiento: completo cancelado
procedimiento: completo cancelado
procedimiento: completo
sello de vecindad flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/tareas.log`,
  solution: `grep -A 1 -x 'procedimiento: completo' ${HOME}/tareas.log`,
  hints: [
    '-x ANCLA el patrón a toda la línea: para casar, la línea debe COINCIDIR de principio a fin.',
    'Las variantes «parcial», «revisado», «cancelado» caen por no ser *exactamente* iguales.',
    'Con -A 1 la coincidenciaexacta ARRASTRA su vecina siguiente: ahí está la marca.',
    `grep -A 1 -x 'procedimiento: completo' tareas.log`,
  ],
  teach: '-x + -A forman el par preciso: primero recorto a la línea ÚNICA; luego me quedo con quien llega después. Es el reconocimiento de EVENTO + EFECTO sobre un log.',
  cheatsheet: [
    { cmd: "grep -x 'toda la línea' f", desc: 'coincide solo si ES la línea entera' },
    { cmd: "grep -A 1 -x 'toda la línea' f", desc: 'línea exacta + vecina de abajo' },
  ],
  keywords: ['grep', '-x', '-A', 'exacta', 'vecina'],
}));

GREP.push(mk({
  track: 'grep', index: 54, title: 'Los antecedentes', subtitle: '-B: lo que pasó ANTES',
  xp: 55, difficulty: 2,
  brief: 'Al cerrar cada bloque del informe electronically borra las evidencias… pero las 2 líneas ANTERIORES al cierre siguen en disco. La marca viaja en una de ellas.',
  goal: 'De informe.txt imprime las DOS líneas PREVIAS a cada "cierre de bloque" (la marca viaja en una de las previas; la de cierre también puede aparecer).',
  setup: () => P(54, 'Grep') + `cat > ${HOME}/informe.txt <<EOF
inicio del bloque 1
dato intermedio
resumen con marca flag=$DOJO_FLAG
anexo sin valor
cierre de bloque
fin del archivo
EOF
chown agent:agent ${HOME}/informe.txt`,
  solution: `grep -B 2 'cierre de bloque' ${HOME}/informe.txt`,
  hints: [
    '-B N arranca el corte ANTES de la coincidencia: imprime N líneas previas + la línea de la coincidencia.',
    'Con -B 2, para «cierre de bloque» incluyes «resumen con marca…» y «anexo sin valor».',
    `grep -B 2 'cierre de bloque' informe.txt`,
  ],
  teach: '-B es el «contexto_previo»: inservible para informes de rollo-lineaal.» cuando el HECHO está EN LA LÍNEA de cierre pero la marca viajó ANTES. Usado hasta el abeedo en logs de auditoría real.',
  cheatsheet: [
    { cmd: "grep -B N p f", desc: 'N líneas previas + la coincidencia' },
    { cmd: "grep -C N p f", desc: 'N antes y N después (simétrico)' },
  ],
  keywords: ['grep', '-B', 'contexto', 'previas'],
}));

GREP.push(mk({
  track: 'grep', index: 55, title: 'El bache simétrico', subtitle: '-C: contexto a AMBOS lados',
  xp: 55, difficulty: 2,
  brief: 'El sensor bota un valor PICO cada cierto tramo; alrededor de cada pico hay ruido útil. La marca viaja pegada a un pico (a un lado u otro).',
  goal: 'De sensor.txt imprime cada línea "PICO" con UNA línea de contexto por cada lado (antes y después): la marca viaja en el alrededor.',
  setup: () => P(55, 'Grep') + `cat > ${HOME}/sensor.txt <<EOF
lectura nivel 1
valor alto flag=$DOJO_FLAG
PICO latencia
lectura nivel 2
PICO memoria
lectura nivel 3
EOF
chown agent:agent ${HOME}/sensor.txt`,
  solution: `grep -C 1 'PICO' ${HOME}/sensor.txt`,
  hints: [
    '-C N es el atajo de -A N -B N: contexto SIMÉTRICO alrededor de la coincidencia.',
    'Con -C 1 los PICOs «latencia» y «memoria» traen su vecina; entre ellas, la marcada.',
    `grep -C 1 'PICO' sensor.txt`,
  ],
  teach: '-C 1 es el modo «zoom» del log: ver el pico SIN perder el vecino. Casi todos los triajes de monitoreo (alerta + entorno) se montan con -C.',
  cheatsheet: [{ cmd: "grep -C N p f", desc: 'simétrico: N antes+N después' }],
  keywords: ['grep', '-C', 'simétrico', 'contexto'],
}));

GREP.push(mk({
  track: 'grep', index: 56, title: 'Laповід casing', subtitle: '-i: mayúsculas no les interesa',
  xp: 55, difficulty: 3,
  brief: 'La radio reporta la señal en cualquier formato: «señal», «SEÑAL», «Señal»… la marca viaja en la línea CON LA MAYÚSCULA más ruidosa.',
  goal: 'De rf.log imprime TODAS las líneas con «señal» IGNORENDO mayúsculas/minúsculas (la marca viaja en una con mayúsculas).',
  setup: () => P(56, 'Grep') + `cat > ${HOME}/rf.log <<EOF
la señal es débil
SEÑAL CONSTANTE
falsas señales abajo
ruido sin nada
SEÑAL MAXIMA flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/rf.log`,
  solution: `grep -i 'señal' ${HOME}/rf.log`,
  hints: [
    '-i ignora el CASE: «señal» casa con «SEÑAL», «Señal», «sEñal»…',
    'Sin -i, la línea mayúsculizada que trae la flag SE ESCAPA.',
    `grep -i 'señal' rf.log`,
  ],
  teach: 'Cuidado: -i SÍ traga acentos FREE-UTF8 en la locale C.UTF-8 del dojo. La regla práctica: si tu patrón describe CONCEPTOS (no exactas), -i siempre.',
  cheatsheet: [{ cmd: 'grep -i p f', desc: 'case-insensitive' }],
  keywords: ['grep', '-i', 'case', 'mayúsculas'],
}));

GREP.push(mk({
  track: 'grep', index: 57, title: 'Stream limpio', subtitle: '-h: multi-fichero SIN prefijo',
  xp: 55, difficulty: 3,
  brief: 'Tres diarios del mismo servicio llegan mezclados; cuando grep recibe varios ficheros, PREPONDRÁ el nombre a cada línea — para unir el stream necesitas quitarlo.',
  goal: 'Del directorio diario/ imprime las líneas "eco especial" (están en los .log) SIN el prefijo de nombre de fichero: la marca viaja en una de ellas.',
  setup: () => P(57, 'Grep') + `mkdir -p ${HOME}/diario
echo "ciclo normal 1" > ${HOME}/diario/d1.log
echo "eco especial flag=$DOJO_FLAG" > ${HOME}/diario/d2.log
echo "ciclo normal 2" > ${HOME}/diario/d3.log
echo "solo texto lista" > ${HOME}/diario/indice.txt
chown agent:agent ${HOME}/diario/d1.log ${HOME}/diario/d2.log ${HOME}/diario/d3.log ${HOME}/diario/indice.txt`,
  solution: `grep -h 'eco especial' ${HOME}/diario/*.log`,
  hints: [
    'Con VARIOS ficheros, grep antepone "fichero:" por defecto; -h SUPRIME ese prefijo.',
    'Con patrón literal "eco especial" el índice.txt (que no matchea) ni molesta.',
    `grep -h 'eco especial' diario/*.log`,
  ],
  teach: '-h es el interruptor del «stream JOIN»: el resultado se comporta como UN solo log, ideal para redirecciones y pipes de análisis.',
  cheatsheet: [{ cmd: "grep -h p f1 f2", desc: 'sin prefijo de nombre de fichero' }],
  keywords: ['grep', '-h', 'stream', 'multifichero'],
}));

GREP.push(mk({
  track: 'grep', index: 58, title: 'El recolector recursivo', subtitle: '-r --include: solo los .log',
  xp: 55, difficulty: 3,
  brief: 'El pool tiene mezcla de yaml, txt y logs; el sello está en el ÚNICO log. Barrer TODO con find es fácil… pero grep puede hacerlo solo.',
  goal: 'Recorre POOL/ de forma recursiva y hayarle la línea "sello del pool" limitándose a los ficheros EXTENSIÓN .log (la marca viaja en el único log).',
  setup: () => P(58, 'Grep') + `mkdir -p ${HOME}/pool/sub
echo "nota informativa txt" > ${HOME}/pool/base.txt
echo "sello del pool flag=$DOJO_FLAG" > ${HOME}/pool/rastreo.log
echo "nota del yaml" > ${HOME}/pool/sub/meta.yaml
echo "eco redundante" > ${HOME}/pool/sub/eco.log
chown agent:agent ${HOME}/pool/base.txt ${HOME}/pool/rastreo.log ${HOME}/pool/sub/meta.yaml ${HOME}/pool/sub/eco.log`,
  solution: `grep -r --include '*.log' 'sello del pool' ${HOME}/pool`,
  hints: [
    '-r baja recursivo por el árbol; --include PATTERN filtra los ficheros por su NOMBRE (glob).',
    'Sin --include, el txt y el yaml también se procesarían (harto ruido).',
    "grep -r --include '*.log' 'sello del pool' ../pool",
  ],
  teach: '-r con --include es la navaja del «barrer árboles SIN find»: en un nutrido catálogo la diferencia es el ruido que evita.',
  cheatsheet: [{ cmd: 'grep -r --include "*.log" p dir', desc: 'recursivo SOLO ficheros .log' }],
  keywords: ['grep', '-r', 'include', 'recursivo'],
}));

GREP.push(mk({
  track: 'grep', index: 59, title: 'El patrocinio del bloc', subtitle: '-f: patrones desde fichero',
  xp: 60, difficulty: 3,
  brief: 'El equipo franco «vencidos» es una lista en disco; el registro rumana maneja eventos. Recetea con TODAS las líneas cuyo texto COINCIDA con ALGÚN FAHREN?—, y una de ellas trae la marca.',
  goal: 'De registro.log imprime las líneas que coinciden con ALGÚN patrón de vencidos.txt (la lista puede ser larga; los patrones viven en un fichero). La marca viaja en una de las líneas.',
  setup: () => P(59, 'Grep') + `cat > ${HOME}/vencidos.txt <<EOF
tick 101
tick 207
revocado 004
EOF
cat > ${HOME}/registro.log <<EOF
evento normal rotativo
tick 101 en curso
evento normal segundo
revocado 004 a decisión flag=$DOJO_FLAG
tick 999 sin lista
EOF
chown agent:agent ${HOME}/vencidos.txt ${HOME}/registro.log`,
  solution: `grep -f ${HOME}/vencidos.txt ${HOME}/registro.log`,
  hints: [
    '-f FICHERO toma los patrones, uno por línea del fichero: grep los testea TODOS.',
    'Es el equivalente a 3 greps con OR pero sin límite arbitrario de patrones.',
    `grep -f vencidos.txt registro.log`,
  ],
  teach: '-f convierte grep en un MATCHER INSTEAD más: lista negra/liverpool por fichero, una rol fila por patrón. Es la SEMILLA de la auditoría periódica.',
  cheatsheet: [{ cmd: 'grep -f patrones.txt f', desc: 'muchos patrones desde fichero' }],
  keywords: ['grep', '-f', 'fichero de patrones', 'lista negra'],
}));

GREP.push(mk({
  track: 'grep', index: 60, title: 'La sombra legítima', subtitle: '-l: ¿en QUÉ fichero está?',
  xp: 60, difficulty: 3,
  brief: 'Entre las sombras solo una se legitima: el ÚNICO fichero que contiene el "sello"对所有 los demás pasan. La marca viaja dentro de él.',
  goal: 'Del directorio sombras/ localiza el ÚNICO fichero que contiene "sello" (sin imprimir sus líneas) y muestra SU CONTENIDO completo: la marca viaja dentro.',
  setup: () => P(60, 'Grep') + `mkdir -p ${HOME}/sombras
echo "nota fantasma_alpha" > ${HOME}/sombras/a.log
echo "sello oficial flag=$DOJO_FLAG" > ${HOME}/sombras/b.log
echo "nota fantasma_beta" > ${HOME}/sombras/c.log
echo "nota fantasma_gamma" > ${HOME}/sombras/d.log
chown agent:agent ${HOME}/sombras/*.log`,
  solution: `f=$(grep -l 'sello' ${HOME}/sombras/*.log); cat "$f"`,
  hints: [
    '-l imprime SOLO el nombre del fichero que casó (una vez), no sus líneas.',
    'Captúralo en una variable con $() y SACA su contenido completo.',
    `f=$(grep -l 'sello' sombras/*.log); cat "$f"`,
  ],
  teach: '-l + variable + cat es el REGRESO al fichero: grep te dice DÓNDE; tú decides QUÉ ver. Modo de trabajo canónico en repos de tamaño logarítico.',
  cheatsheet: [{ cmd: "f=$(grep -l p dir/*); cat \"$f\"", desc: 'localiza y muestra el fichero' }],
  keywords: ['grep', '-l', 'fichero', 'localizar'],
}));

GREP.push(mk({
  track: 'grep', index: 61, title: 'El sediento 101', subtitle: '-c por fichero + ranking + regreso',
  xp: 60, difficulty: 4,
  brief: 'Tres logs de tentativas; en el que MÁS intentos hay… la marca también. El conteo por fichero es la balanza.',
  goal: 'Del directorio logs/ localiza el fichero con MÁS líneas "intento" (grep -c) y muestra SU contenido completo: la marca viaja dentro.',
  setup: () => P(61, 'Grep') + `mkdir -p ${HOME}/logs
cat > ${HOME}/logs/atras.log <<EOF
intento unico
fin del fichero
EOF
cat > ${HOME}/logs/medio.log <<EOF
intento uno
intento dos
ctrilla y respiro
EOF
cat > ${HOME}/logs/dominante.log <<EOF
intento uno
intento dos
intento tres
intento cuatro flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/logs/*.log`,
  solution: `f=$(grep -c 'intento' ${HOME}/logs/*.log | sort -t: -k2 -nr | head -1 | cut -d: -f1); cat "$f"`,
  hints: [
    '-c sobre GUIONES让我: salida formato "fichero:conteo" por fichero (grep ve cada fichero por separado).',
    'sort -t: -k2 -nr ordvuespá排序 por el 2.º campo NUMÉRICO descendente; head -1 elige el GANADOR.',
    'cut -d: -f1 recupera el NOMBRE del fichero; cat lo muestra entero (la marca viaja dentro).',
    `f=$(grep -c 'intento' logs/*.log | sort -t: -k2 -nr | head -1 | cut -d: -f1); cat "$f"`,
  ],
  teach: 'La trilogía grep -c → sort -k2 -nr | head → regreso con cut/cat es el ESCALADO del conteo: de métrica a apuntar el fichero GANADOR. Escalable a directorios de decenas de logs.',
  cheatsheet: [{ cmd: "f=$(grep -c p dir/* | sort -t: -k2 -nr | head -1 | cut -d: -f1); cat \"$f\"", desc: 'el fichero con MÁS coincidencias' }],
  keywords: ['grep', '-c', 'sort', 'ranking'],
}));

GREP.push(mk({
  track: 'grep', index: 62, title: 'Bitácora cerrada', subtitle: '-E con anclas a ambos extremos',
  xp: 60, difficulty: 4,
  brief: 'La bitácora mezcla formatos; una sesión válida EMPIEZA por hora (dígito) y TERMINA en «cierre de sesión» literal. La marca viaja en una de esas filas.',
  goal: 'De bitacora.log imprime SOLO las líneas que EMPIEZAN por dígitos y TERMINAN exactamente con "cierre de sesión" (la marca viaja en una).',
  setup: () => P(62, 'Grep') + `cat > ${HOME}/bitacora.log <<EOF
hora no válida
09:11 monitor establecio
09:21 transición flag=$DOJO_FLAG cierre de sesión
10:00 detecciones nemesis cierre de sesión revisada
10:11 hipotético completo cierre de sesión
EOF
chown agent:agent ${HOME}/bitacora.log`,
  solution: `grep -E '^[0-9]+.*cierre de sesión$' ${HOME}/bitacora.log`,
  hints: [
    '^ ancla el inicio de línea; $ ancla el FINAL: ambas a la vez = la línea EMPIEZA por dígito y TERMINA en el texto dado.',
    'Grep normal no hace regex; para anclas + clases usa -E (ERE).',
    `grep -E '^[0-9]+.*cierre de sesión$' bitacora.log`,
  ],
  teach: 'Las dos anclas juntas definen la RULE del registro completo: la fila entera como formato. Es la base de la validación de SCHOEMA en logs por línea.',
  cheatsheet: [{ cmd: "grep -E '^patrón.*cierre$' f", desc: 'anclas de inicio y fin' }],
  keywords: ['grep', '-E', 'anclas', 'regex'],
}));

GREP.push(mk({
  track: 'grep', index: 63, title: 'La fórmula literal', subtitle: '-F: los metacaracteres NO rompen',
  xp: 60, difficulty: 4,
  brief: 'El config usa fragmentos rícos de metacaracteres tipo mod[$1](*) ; grep con regex los descompone… a no ser que Uses el MODOFIJO. La marca viaja en esa línea.',
  goal: 'De config.toml imprime SOLO la línea cuyo texto contiene EXACTAMENTE el fragmento mod[$1](*) (los corchetes, paréntesis y asterisco son LITERAres).',
  setup: () => P(63, 'Grep') + `cat > ${HOME}/config.toml <<EOF
modes = "normal"
mod_lift = true
mod[2](x) otra variante
fin del config
EOF
printf '%s\n' 'mod[$1](*) flag=$DOJO_FLAG' >> ${HOME}/config.toml
chown agent:agent ${HOME}/config.toml`,
  solution: `grep -F 'mod[$1](*)' ${HOME}/config.toml`,
  hints: [
    '-F cambia a modo FIJO: el patrón se compara línea por línea TAL CUAL, sin regex.',
    'Con corchetes y paréntesis, el mod RE interpreta [... ] etc. y tu patrón se rompe: con -F no.',
    `grep -F 'mod[$1](*)' config.toml`,
  ],
  teach: '-F es el antídoto del metacaracter: cuando buscas código, yaml, sql u otras sintaxis LLENAS de símbolos especiales, el modo fijo te salva. Más rápido además.',
  cheatsheet: [{ cmd: "grep -F 'texto.tal_cual[*]' f", desc: 'coincidencia literal sin regex' }],
  keywords: ['grep', '-F', 'literal', 'metacaracteres'],
}));

GREP.push(mk({
  track: 'grep', index: 64, title: 'El corte asimétrico', subtitle: '-B 3 -A 1: distinto antes y después',
  xp: 60, difficulty: 4,
  brief: 'El error crítico deja 3 líneas de antecedentes y solo 1 de reacción — la marca viaja JUSTO DETRÁS. El corte no es simétrico: se afina por separado.',
  goal: 'De secuencia.log imprime cada "ERROR crítico" con TRES líneas previas y UNA posterior (la marca viaja en la posterior).',
  setup: () => P(64, 'Grep') + `cat > ${HOME}/secuencia.log <<EOF
capa 1 iniciando
capa 2 sin alerta
capa 3 midiendo
capa 4 ERROR crítico
eco posterior flag=$DOJO_FLAG
modo de recuperación
fin del archivo
EOF
chown agent:agent ${HOME}/secuencia.log`,
  solution: `grep -B 3 -A 1 'ERROR crítico' ${HOME}/secuencia.log`,
  hints: [
    'Puedes combinar -B y -A en el MISMO grep: -B 3 -A 1 imprime 3 antes y 1 después.',
    'La simetría NO es obligatoria: se ajusta al corte que tu auditoría necesita.',
    `grep -B 3 -A 1 'ERROR crítico' secuencia.log`,
  ],
  teach: '-B N -A M es el corte quirúrgico FACTURADO: prefacio y reacción por separado. Prevalece antes que -C cuando el mapa del incidente es asimétrico.',
  cheatsheet: [{ cmd: "grep -B 3 -A 1 p f", desc: 'corte asimétrico: 3 antes, 1 después' }],
  keywords: ['grep', '-B', '-A', 'asimétrico'],
}));

GREP.push(mk({
  track: 'grep', index: 65, title: 'El goteo de dominios', subtitle: '-oE con clase + nota al margen',
  xp: 60, difficulty: 4,
  brief: 'La agenda cruza CONTACTO@DOMINIO; te interesan SOLO los dominios @dojo.lan… y al final hay una nota al margen que contiene la marca.',
  goal: 'De contactos.txt extrae SOLO los dominios (fragmentos que empezando por la @ van seguidos de letras/números/puntos) y después imprime la línea "nota clave" (la marca viaja en ella).',
  setup: () => P(65, 'Grep') + `cat > ${HOME}/contactos.txt <<EOF
ana@dojo.lan casual
pepe@gmail.com externo
lucia@dojo.lan interna
muestra otro texto
nota clave flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/contactos.txt`,
  solution: `grep -oE '@[A-Za-z0-9.]+' ${HOME}/contactos.txt; grep 'nota clave' ${HOME}/contactos.txt`,
  hints: [
    '-o imprime solo el TEXTO casado; -E con clase @[A-Za-z0-9.]+ captura @ + alfanuméricos/puntos.',
    'Después, el grep del segundo bloque imprime la línea de la marca (del mismo fichero).',
    `grep -oE '@[A-Za-z0-9.]+' contactos.txt; grep 'nota clave' contactos.txt`,
  ],
  teach: 'El patrón de «token pegado» con clases + -o es la EXTRACCIÓN por excelencia (dominios, tags, refs). Combinado con un segundo grep del marcador obtienes extracción + evidencia en una sola llamada.',
  cheatsheet: [{ cmd: "grep -oE '@[A-Za-z0-9.]+' f", desc: 'extrae solo el fragmento casado' }],
  keywords: ['grep', '-oE', 'dominios', 'extracción'],
}));

GREP.push(mk({
  track: 'grep', index: 66, title: 'El token de plaza', subtitle: '-E con clase POSIX + cuantificador',
  xp: 65, difficulty: 4,
  brief: 'El fichero de visitantes tiene identidades con códigos de longitud variable; a los de AL MENOS 3 dígitos seguidos se les concede acceso. La marca viaja en una de esas filas.',
  goal: 'De visitantes.log imprime SOLO las líneas cuyo texto contenga TRES O MÁS dígitos CONSECUTIVOS (clase POSIX numeral + cuantificador): la marca viaja en una.',
  setup: () => P(66, 'Grep') + `cat > ${HOME}/visitantes.log <<EOF
visor 12 sin números extra
portero 101 admitido
planimetría normal
portero 9X escapado
comprobante 8123 escaneado flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/visitantes.log`,
  solution: `grep -E '[[:digit:]]{3,}' ${HOME}/visitantes.log`,
  hints: [
    '[[:digit:]] es la clase POSIX de dígitos (fiable incluso en locales raras); {3,} exige TRES O MÁS seguidos.',
    '"12" y "9X" quedan fuera: no alcanzan las 3 cifras seguidas.',
    `grep -E '[[:digit:]]{3,}' visitantes.log`,
  ],
  teach: 'POSIX con cuantificador mezcla PORTABILIDAD y semana: en logs multilenguaje la clase POSIX evita sorpresas de acento/locale. Tres cifras seguidas suele significar «código de plaza» real.',
  cheatsheet: [{ cmd: "grep -E '[[:digit:]]{3,}' f", desc: '3+ dígitos seguidos si o si' }],
  keywords: ['grep', 'posix', '[[:digit:]]', 'cuantificador'],
}));

GREP.push(mk({
  track: 'grep', index: 67, title: 'El little boss: Plantilla literal', subtitle: '-Ff: lista literal desde fichero',
  xp: 110, difficulty: 5,
  brief: 'La plantilla contiene FRASES EXACTAS cargadas de metacaracteres; el flujo boardioesto tracks que matchean. Con -F y -f a la vez, la lista y el filtro operan en MODOFIJO. La marca viaja en la línea que casó.',
  goal: 'Del directorio actual: imprime las líneas de flujo.log cuyo texto contenga ALGUNA de las frases LITERALES de plantilla.txt (sin interpretar regex; la marca viaja en una).',
  setup: () => P(67, 'Grep') + `cat > ${HOME}/plantilla.txt <<EOF
[evacuación] *cruda*
fase (1?) -{telecom}-
EOF
cat > ${HOME}/flujo.log <<EOF
arranque normal del flujo
[evacuación] *cruda* señal alerta flag=$DOJO_FLAG
otra línea sin plantilla
fase (1?) -{telecom}- encendida flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/plantilla.txt ${HOME}/flujo.log`,
  solution: `grep -Ff ${HOME}/plantilla.txt ${HOME}/flujo.log`,
  hints: [
    '-F activa modo fijo; -f toma los PATRONES de un fichero: las dos juntas = lista literal de frases.',
    'Sin -F, los corchetes o el asterisco de la plantilla se interpretarían como regex y NO casarían.',
    `grep -Ff plantilla.txt flujo.log`,
  ],
  teach: '-Ff es el mini-boss del filtrado por LISTA: cuando los patrones son FRASES de config o SQL y no regex, es el único modo sano. Prueba quitar -F y mira cómo explota.',
  cheatsheet: [{ cmd: 'grep -Ff literales.txt f', desc: 'lista de frases LITERALES como patrones' }],
  keywords: ['grep', '-F', '-f', 'boss', 'literal'],
}));

GREP.push(mk({
  track: 'grep', index: 68, title: '¡Boss!: la balanza de las fallas', subtitle: '-c ranking → IP dominante → regreso OK con flag',
  xp: 150, difficulty: 5,
  brief: 'Tres logs compiten; el que más FALLAS acumula es el punto de intrusión. Dentro de él, la IP con más fallos logró UNA conexión OK — ahí viaja la marca.',
  goal: 'Del directorio logs/: 1) localiza el fichero con MÁS FALLAS (grep -c + sort + head); 2) extrae la IP dominante de sus fallos (grep -oE + sort | uniq -c); 3) regresa al fichero y imprime su ÚNICA línea OK de esa IP (la marca viaja en ella).',
  setup: () => P(68, 'Grep') + `mkdir -p ${HOME}/logs
mkdir -p ${HOME}/logs
cat > ${HOME}/logs/alpha.log <<EOF
01:00 FAIL ip 10.0.0.1
01:01 FAIL ip 10.0.0.1
01:02 OK ip 10.0.0.2
EOF
cat > ${HOME}/logs/beta.log <<EOF
03:00 FAIL ip 10.7.7.7
03:05 OK ip 10.7.7.8
EOF
cat > ${HOME}/logs/gamma.log <<EOF
06:00 FAIL ip 10.0.0.5
06:01 FAIL ip 10.0.0.7
06:02 FAIL ip 10.0.0.5
06:03 FAIL ip 10.0.0.9
06:04 OK ip 10.0.0.5 flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/logs/*.log`,
  solution: `f=$(grep -c 'FAIL' ${HOME}/logs/*.log | sort -t: -k2 -nr | head -1 | cut -d: -f1); ip=$(grep 'FAIL' "$f" | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep "ip $ip" "$f" | grep 'OK'`,
  hints: [
    'Paso 1: la BALANZA por fichero: f=$(grep -c FAIL logs/* | sort -t: -k2 -nr | head -1 | cut -d: -f1) → gamma.',
    'Paso 2: la IP dominante de los FAIL de $f: grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" + sort | uniq -c | sort -nr | head -1 | awk {print $2}.',
    'Paso 3: el REGRESO: grep "ip $ip" "$f" | grep OK → una única línea (la de la marca).',
    `f=$(grep -c 'FAIL' logs/* | sort -t: -k2 -nr | head -1 | cut -d: -f1); ip=$(grep 'FAIL' "$f" | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep "ip $ip" "$f" | grep 'OK'`,
  ],
  teach: 'El boss de round 6 encadena TRES grep por función distinta: -c métrica, -oE extractor, -h filtro final etapa. Es el flujo completo de ratio→detalle→evidencia de un SOC, todo con una sola herramienta.',
  cheatsheet: [
    { cmd: 'grep -c p dir/* | sort -t: -k2 -nr | head -1', desc: 'fichero con más coincidencias' },
    { cmd: "grep p f | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' | sort | uniq -c | sort -nr | head -1", desc: 'IP dominante' },
    { cmd: 'grep "ip $ip" f | grep OK', desc: 'regreso: la única línea OK del atacante' },
  ],
  keywords: ['grep', 'boss', 'c', 'ranking', 'uniq'],
}));

/* ═════════════════════════════════════════════════════════════ AWK ══ */
const AWK = [];

AWK.push(mk({
  track: 'awk', index: 51, title: 'La cola del registro', subtitle: '$NF: el último campo',
  xp: 50, difficulty: 2,
  brief: 'El catálogo termina siempre en estado; el último campo es el que manda. La marca viaja en el campo final de una fila.',
  goal: 'De catalogo.txt imprime el ÚLTIMO campo de cada línea (la marca viaja en el de una fila).',
  setup: () => P(51, 'Awk') + `cat > ${HOME}/catalogo.txt <<EOF
ref oro activo
ref plata vendido
ref cobre activo
ref paladium mixto flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/catalogo.txt`,
  solution: `awk '{print $NF}' ${HOME}/catalogo.txt`,
  hints: [
    '$NF es el ÚLTIMO campo (NF = número de campos): no importa cuántos haya.',
    'Es la receta para «cualquiera que sea la última palabra», sin contar la posición.',
    `awk '{print $NF}' catalogo.txt`,
  ],
  teach: '$NF libera el campo variable: parses de logs con número de columnas irregular viven de $NF (y de $(NF-1) para la penúltima).',
  cheatsheet: [
    { cmd: "awk '{print $NF}' f", desc: 'último campo' },
    { cmd: "awk '{print $(NF-1)}' f", desc: 'penúltimo campo' },
  ],
  keywords: ['awk', 'NF', 'último', 'campo'],
}));

AWK.push(mk({
  track: 'awk', index: 52, title: 'El comité del cinco', subtitle: 'NF==5: filtro por Nº de campos',
  xp: 50, difficulty: 2,
  brief: 'El formulario solo es VÁLIDO si trae EXACTAMENTE 5 campos; las filas rotas se caen. La marca viaja en una fila completa.',
  goal: 'De formularios.txt imprime ÚNICAMENTE las filas con EXACTAMENTE 5 campos (la marca viaja en una).',
  setup: () => P(52, 'Awk') + `cat > ${HOME}/formularios.txt <<EOF
fila corta de tres
fila con cuatro campos
fila valida de cinco flag=$DOJO_FLAG
fila extra con seis campos aqui
EOF
chown agent:agent ${HOME}/formularios.txt`,
  solution: `awk 'NF == 5 {print}' ${HOME}/formularios.txt`,
  hints: [
    'NF (sin $) es el NÚMERO de campos de la fila actual: compárralo en el patrón.',
    'NF==5 filtra la fila «sana»; las rotas (4 o 6 campos) no pasan.',
    `awk 'NF == 5 {print}' formularios.txt`,
  ],
  teach: 'El patrón NF condicional es la CARTA DE SALUD del registro: con NF-in/guard detects rotas, truncadas y filas que sobran sin tocar el ELSE.',
  cheatsheet: [
    { cmd: "awk 'NF == 5 {print}' f", desc: 'filas con exactamente 5 campos' },
    { cmd: "awk 'NF < 3 {print}' f", desc: 'filas rotas: menos de 3 campos' },
  ],
  keywords: ['awk', 'NF', 'filtro', 'campos'],
}));

AWK.push(mk({
  track: 'awk', index: 53, title: 'El token largo', subtitle: 'length($NF): medir el último campo',
  xp: 50, difficulty: 2,
  brief: 'El registro guarda tokens al final; los kunst LARGOS (más de 8 caracteres) son los secretos. Ahí viaja la marca.',
  goal: 'De tokens.txt imprime las filas cuyo ÚLTIMO campo supere 8 caracteres (la marca viaja en una: es un token largo).',
  setup: () => P(53, 'Awk') + `cat > ${HOME}/tokens.txt <<EOF
gw corto
gw media1
gw larguitito
gw superlongtokenito flag=$DOJO_FLAG
gw fin
EOF
chown agent:agent ${HOME}/tokens.txt`,
  solution: `awk 'length($NF) > 8 {print}' ${HOME}/tokens.txt`,
  hints: [
    'length($NF) mide la LONGITUD del último campo; compárrala en el patrón.',
    'La cadena de 24 hex de la marca siempre supera 8: esa fila pasa el filtro.',
    `awk 'length($NF) > 8 {print}' tokens.txt`,
  ],
  teach: 'length() en el GUARD es el compass de calibración del texto: tokens/sessiones/IDs de tamaño ⁪min⁪imo se filtran sin éxito algo regex.',
  cheatsheet: [{ cmd: "awk 'length($NF) > 8 {print}' f", desc: 'filas con último campo largo' }],
  keywords: ['awk', 'length', 'último', 'filtro'],
}));

AWK.push(mk({
  track: 'awk', index: 54, title: 'El prefijo ZM', subtitle: 'substr() en el guard',
  xp: 50, difficulty: 2,
  brief: 'Los códigos del almacén MEZclan series; a las filas cuyo código EMPIEZA con ZM se las expedis hacia la zona segura. La marca viaja en una de ellas.',
  goal: 'De codigos.txt imprime Únicamente las filas cuyo PRIMER campo empieza por «ZM» (los 2 primeros caracteres de la columna 1): la marca viaja en una.',
  setup: () => P(54, 'Awk') + `cat > ${HOME}/codigos.txt <<EOF
AB-1001-XY norte
ZM-2022-QA sur
CD-3033-ZW este
ZM-4044-FL oeste flag=$DOJO_FLAG
EF-5055-ZN centro
EOF
chown agent:agent ${HOME}/codigos.txt`,
  solution: `awk 'substr($1, 1, 2) == "ZM" {print}' ${HOME}/codigos.txt`,
  hints: [
    'substr($1, 1, 2) recorta los DOS primeros caracteres del 1.er campo; compárralo en el guard.',
    'El equivalente regex sería /^ZM/ anclado al inicio de la línea; con substr NO necesitas regex.',
    `awk 'substr($1, 1, 2) == "ZM" {print}' codigos.txt`,
  ],
  teach: 'substr() en el GUARD es el mecanismo de REGLAS por prefijo (códigos, SKU, rutas). Es lectura directa cuando la posición fija se conoce.',
  cheatsheet: [{ cmd: 'awk \'substr($1, 1, 2) == "XX" {print}\' f', desc: 'filas cuyo 1.er campo empieza por XX' }],
  keywords: ['awk', 'substr', 'prefijo', 'guard'],
}));

AWK.push(mk({
  track: 'awk', index: 55, title: 'La normalización de columnas', subtitle: 'BEGIN{OFS} + composición de salida',
  xp: 50, difficulty: 2,
  brief: 'El visor quiere UNIFICAR el formato «ID | ESTADO» aunque la fila tenga muchos campos del medio: awk recomponniendo con OFS. La marca viaja como estado.',
  goal: 'De inventario.txt imprime dos columnas separadas por " | ": el PRIMER campo y el ÚLTIMO campo de cada fila (la marca viaja en el último de una).',
  setup: () => P(55, 'Awk') + `cat > ${HOME}/inventario.txt <<EOF
id1 stock normal activo
id2 depósito revisar
id3 kit roto inactivo
id4 caja entera mixto flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/inventario.txt`,
  solution: `awk 'BEGIN { OFS = " | " } { print $1, $NF }' ${HOME}/inventario.txt`,
  hints: [
    'BEGIN { OFS = " | "} define el separador de SALIDA: los print con comas lo usan.',
    'print $1, $NF emite 1.er campo y último con el OFS enmedio — el central se descarta.',
    `awk 'BEGIN { OFS = " | " } { print $1, $NF }' inventario.txt`,
  ],
  teach: 'El par BEGIN{OFS} + print $1, $NF es el reconstructor de columnas: normaliza formatos antes de un export u otro tool. $NF absorbe catálogos con muchos campos.',
  cheatsheet: [
    { cmd: "awk 'BEGIN{OFS=\" | \"} {print $1, $NF}' f", desc: 'recompone 1.º y último campo' },
    { cmd: "awk 'BEGIN{OFS=\",\"} {print $3,$1}' f", desc: 'reordena y cambia separador' },
  ],
  keywords: ['awk', 'OFS', 'BEGIN', 'columnas'],
}));

AWK.push(mk({
  track: 'awk', index: 56, title: 'El código escondido', subtitle: 'match() + RSTART + RLENGTH',
  xp: 55, difficulty: 3,
  brief: 'Cada fila tiene un código embebido de cualquier manera: DOS MAYÚSCULAS + guion + 4 dígitos. Awk puede localizarlos SIN saber en qué columna. La marca viaja en una fila final aparte.',
  goal: 'De codigos.txt: 1) extrae de cada fila el código que casa con DOS mayúsculas + guion + 4 dígitos; 2) además imprimé la línea completa donde aparezca la palabra "marca" (la marca viaja ahí).',
  setup: () => P(56, 'Awk') + `cat > ${HOME}/codigos.txt <<EOF
detalle XY-1234 calle
mini AB-5678
eco sin código
ZZ-9999 completo
línea con marca flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/codigos.txt`,
  solution: `awk '{ if (match($0, /[A-Z]{2}-[0-9]{4}/)) print substr($0, RSTART, RLENGTH) } /marca/ { print }' ${HOME}/codigos.txt`,
  hints: [
    'match($0, REGEX) devuelve posición y fija RSTART (inicio) y RLENGTH (largo) del TROSO casado.',
    'substr($0, RSTART, RLENGTH) recoge EXACTAMENTE el fragmento casa — sin depender de columnas.',
    'El guard /marca/ { print } imprime la fila completa de la firma (otro if por modo).',
    `awk '{ if (match($0, /[A-Z]{2}-[0-9]{4}/)) print substr($0, RSTART, RLENGTH) } /marca/ { print }' codigos.txt`,
  ],
  teach: 'El trípode match + RSTART/RLENGTH + substr es el extractor UNIVERSAL de awk: cuando el dato NO vive en una columna fija, es el plan B. La regex ERE compatible con awk es potente.',
  cheatsheet: [
    { cmd: "awk 'match($0, /[A-Z]{2}-[0-9]{4}/) {print substr($0, RSTART, RLENGTH)}' f", desc: 'extrae el trozo casado' },
    { cmd: "awk 'match($0, re) {print RSTART, RLENGTH}' f", desc: 'posición y largo del match' },
  ],
  keywords: ['awk', 'match', 'RSTART', 'RLENGTH', 'substr'],
}));

AWK.push(mk({
  track: 'awk', index: 57, title: 'El bloque entero', subtitle: 'BEGIN{RS=""} con registros de párrafo',
  xp: 55, difficulty: 3,
  brief: 'El informe tiene PÁRRAFOS quasi-espaciados por línea vacía; el «sello» vive dentro de UN bloque entero. Cambiar RS hace que awk razona a nivel BLOQUE.',
  goal: 'De informe.txt imprime COMPLETO el párrafo (grupo de líneas separadas por línea en blanco) que contiene la palabra "sello" (la marca viaja en el bloque).',
  setup: () => P(57, 'Awk') + `cat > ${HOME}/informe.txt <<EOF
titul del informe

primer bloque
línea de datos primera
línea de datos segunda

segundo bloque
sello oficial flag=$DOJO_FLAG

tercer bloque
fin
EOF
chown agent:agent ${HOME}/informe.txt`,
  solution: `awk 'BEGIN { RS = "" } /sello/ { print }' ${HOME}/informe.txt`,
  hints: [
    'RS es el separador de REGISTRO; por defecto es "\n" (línea). Con RS="" cada PÁRRAFO es un registro.',
    'En ese modo, /sello/ busca EN TODO EL BLOQUE y print emite el bloque COMPLETO (sin la línea vacía).',
    `awk 'BEGIN { RS = "" } /sello/ { print }' informe.txt`,
  ],
  teach: 'El cambio de RS re-formula qué es «una línea» para awk: párrafos, mensajes multi-línea y bloques de config se procesan como UNA entidad. Es pivote para parsear correos y configs.',
  cheatsheet: [
    { cmd: "awk 'BEGIN{RS=\"\"} /p/ {print}' f", desc: 'imprime párrafos que contienen el patrón' },
    { cmd: "awk 'BEGIN{RS=\"\"} {print NR, NF}' f", desc: 'cuántas párrafos y palabras por bloque' },
  ],
  keywords: ['awk', 'RS', 'párrafo', 'bloque'],
}));

AWK.push(mk({
  track: 'awk', index: 58, title: 'La matriz del stock', subtitle: 'claves compuestas con FS + nota final',
  xp: 60, difficulty: 3,
  brief: 'El stock se apila por CATEGORÍA y PRODUCTO: una clave compuesta es el resumen justo. La marca viaja en una nota final aparte.',
  goal: 'De stocks.txt sumar el 3.er campo agrupando por los DOS primeros (clave compuesta) y al final imprimir la nota (cat nota.txt). La marca viaja en la nota.',
  setup: () => P(58, 'Awk') + `cat > ${HOME}/stocks.txt <<EOF
electronico widget 10
electronico widget 5
electronico cable 3
mueble silla 4
mueble mesa 9
mueble silla 6
EOF
echo "nota de auditoria flag=$DOJO_FLAG" > ${HOME}/nota.txt
chown agent:agent ${HOME}/stocks.txt ${HOME}/nota.txt`,
  solution: `awk '{ t[$1 FS $2] += $3 } END { for (k in t) print k, t[k] }' ${HOME}/stocks.txt; cat ${HOME}/nota.txt`,
  hints: [
    'Las claves asociativas aceptan CONCATENACIÓN: t[$1 FS $2] crea POR CATEGORÍA+PRODUCTO un bucket sinón del «GROUP BY» a dos niveles.',
    'FS dentro de la clave garantiza unido SIN ambiguos; en END recorres el tensor y sumas por bucket.',
    `awk '{ t[$1 FS $2] += $3 } END { for (k in t) print k, t[k] }' stocks.txt; cat nota.txt`,
  ],
  teach: 'El tensor compuesto t[a FS b] es el modo BI de awk: cubeta jerárquica que GNU sort y uniq no alcanzan en una sola pasada. La nota cat es la evidencia que tras procesos necesita un lugar en el stream.',
  cheatsheet: [
    { cmd: "awk '{t[$1 FS $2]+=$3} END {for (k in t) print k, t[k]}' f", desc: 'sumas por dos columnas (GROUP BY 2)' },
    { cmd: "awk '{t[$1 FS $2]++} END {for (k in t) print k, t[k]}' f", desc: 'conteos por dos columnas' },
  ],
  keywords: ['awk', 'array', 'FS', 'clave compuesta'],
}));

AWK.push(mk({
  track: 'awk', index: 59, title: 'El principio y su consecuencia', subtitle: 'getline: lee la fila siguiente',
  xp: 60, difficulty: 3,
  brief: 'Cada vez que el log dice «comienzo», la fila SIGUIENTE es el resultado. La marca viaja en una de las consequentes. getline lee ADELANTE sin doble pasada.',
  goal: 'De flujo.txt: por cada fila que dice "comienzo", imprime ESA fila y ADEMÁS la fila siguiente inmediata (la marca viaja en una de las siguientes).',
  setup: () => P(59, 'Awk') + `cat > ${HOME}/flujo.txt <<EOF
comienzo del ciclo
resultado normal
otra rutina sin cosa
comienzo del salto
resultado marcado flag=$DOJO_FLAG
cierre del flujo
EOF
chown agent:agent ${HOME}/flujo.txt`,
  solution: `awk '/comienzo/ { print; getline; print }' ${HOME}/flujo.txt`,
  hints: [
    'getline CONSUME la siguiente línea dentro del mismo bloque de patrón: print la actual, getline la siguiente, print la siguiente.',
    'Sin getline tendrías que doble-pasar o escribir split con index; aquí todo en una pasada.',
    `awk '/comienzo/ { print; getline; print }' flujo.txt`,
  ],
  teach: 'getline es el telescopio de la fila N+1: patrones «evento → consecuencia» (BEGIN/END, request/response) se resuelven en UNA pasada. Con retención: st = $0; más la forma st = getline var.',
  cheatsheet: [
    { cmd: "awk '/p/ {print; getline; print}' f", desc: 'coincidente + fila siguiente' },
    { cmd: "awk '{cur=$0; if (getline nxt) print cur, nxt}' f", desc: 'pares fila i, i+1' },
  ],
  keywords: ['awk', 'getline', 'siguiente', 'pares'],
}));

AWK.push(mk({
  track: 'awk', index: 60, title: 'El fichero elegido', subtitle: 'FILENAME == ARGV[2]: solo el segundo',
  xp: 60, difficulty: 3,
  brief: 'Awk procesa DOS ficheros en una llamada; solo interesa el SEGUNDO. FILENAME y ARGV volunteex el filtro. La marca viaja en una fila rota del segundo.',
  goal: 'Con UNA llamada a awk sobre par.txt y rota.txt, imprime SOLAMENTE las filas del SEGUNDO fichero que estén rotas (menos de 3 campos): la marca viaja en una.',
  setup: () => P(60, 'Awk') + `cat > ${HOME}/par.txt <<EOF
fila sana de par
par dos buena
par tres rota
EOF
cat > ${HOME}/rota.txt <<EOF
fila buena uno
fila buena dos
dato flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/par.txt ${HOME}/rota.txt`,
  solution: `awk 'FILENAME == ARGV[2] && NF < 3 { print }' ${HOME}/par.txt ${HOME}/rota.txt`,
  hints: [
    'FILENAME es el fichero que awk está leyendo AHORA; ARGV[2] es el SEGUNDO argumento (par=1, rota=2).',
    'El guard compuesto filtra BOTH a la vez: fichero correcto + filas armas rotas.',
    `awk 'FILENAME == ARGV[2] && NF < 3 { print }' par.txt rota.txt`,
  ],
  teach: 'El selector por FILENAME convierte awk en herramienta MULTI-FICHERO con reglas distintas por fichero: prepocesa A y audita B SIN servicios intermedios de cat.',
  cheatsheet: [
    { cmd: 'awk \'FILENAME == ARGV[2] {print}\' f1 f2', desc: 'procesa SOLO el segundo fichero' },
    { cmd: 'awk \'FILENAME ~ /rota/ {print}\' f1 rota.txt', desc: 'selector por nombre con regex' },
  ],
  keywords: ['awk', 'FILENAME', 'ARGV', 'multifichero'],
}));

AWK.push(mk({
  track: 'awk', index: 61, title: 'El importe mínimo', subtitle: 'mínimo dinámico con $0 capturado',
  xp: 60, difficulty: 4,
  brief: 'Los importes llegan empidadados; el MÍNIMO es el cupón premiado. La marca viaja en la FILA COMPLETA del menor (con su fecha y firma).',
  goal: 'De importes.txt imprime la FILA COMPLETA cuyo 2.º campo (el importe) sea el MÍNIMO de todos (la marca viaja en esa fila).',
  setup: () => P(61, 'Awk') + `cat > ${HOME}/importes.txt <<EOF
mayo 420 ajuste
junio 310 ajuste
cupon 105 flag=$DOJO_FLAG
julio 220 ajuste
EOF
chown agent:agent ${HOME}/importes.txt`,
  solution: `awk 'BEGIN { m = 1e9 } { if ($2 + 0 < m) { m = $2 + 0; ln = $0 } } END { print ln }' ${HOME}/importes.txt`,
  hints: [
    'm = 1e9 arranca el comparador por ARRIBA de todo importe razonable.',
    '$2 + 0 fuerza NUMÉRICO (evita la comparación de strings); al mejor, GUARDA $0 COMPLETO, no solo el número.',
    'En END imprimes ln: la fila completa ganadora (ahí viaja la marca).',
    `awk 'BEGIN { m = 1e9 } { if ($2 + 0 < m) { m = $2 + 0; ln = $0 } } END { print ln }' importes.txt`,
  ],
  teach: 'Guardar $0 (la fila entera) en variable en vez de reconstruir $1..$NF deja una capación limpia: max/min + devolución de la FILA. `1e9` es el techo inicial de los imports de laboratorio.',
  cheatsheet: [
    { cmd: "awk 'BEGIN{m=1e9} {if ($2+0<m) {m=$2+0; ln=$0}} END{print ln}' f", desc: 'fila completa del EXTREMO'
    },
    { cmd: "awk 'BEGIN{m=-1e9} {if ($2+0>m) {m=$2+0; ln=$0}} END{print ln}' f", desc: 'idem para el MÁXIMO' },
  ],
  keywords: ['awk', 'mínimo', 'max', 'fila'],
}));

AWK.push(mk({
  track: 'awk', index: 62, title: 'El diferencial', subtitle: 'comparación ENTRE columnas',
  xp: 60, difficulty: 4,
  brief: 'Cada fila trae el objetivo (col 3) y el RESULTADO (col 4): a las que SUPERAN se les abre válvula. La marca viaja en una fila que supera.',
  goal: 'De objetivos.txt imprime las filas donde la columna 4 sea MAYOR que la 3 (comparación entre campos, no contra umbral fijo): la marca viaja en una.',
  setup: () => P(62, 'Awk') + `cat > ${HOME}/objetivos.txt <<EOF
id1 previsto 50 real 40
id2 previsto 50 real 61
id3 previsto 30 real 25
id4 previsto 70 real 88 flag=$DOJO_FLAG
id5 previsto 20 real 20
EOF
chown agent:agent ${HOME}/objetivos.txt`,
  solution: `awk '$4 > $3 { print }' ${HOME}/objetivos.txt`,
  hints: [
    'En el GUARD los campos se comparan NUMÉRICAMENTE: $4 > $3 pregunta «superó su objetivo?».',
    'El umbral NO es fijo: viaja en la propia fila (por eso no sirve $4 > 50).',
    `awk '$4 > $3 { print }' objetivos.txt`,
  ],
  teach: 'La comparación CAMPO a CAMPO es el estado real de un KPI: objetivo vs resultado de la MISMA fila. Awk procesa cada fila aislada — es ideal para ese patrón de auto-regla.',
  cheatsheet: [{ cmd: "awk '$4 > $3 {print}' f", desc: 'filas donde col4 supera col3' }],
  keywords: ['awk', 'comparación', 'columnas', 'KPI'],
}));

AWK.push(mk({
  track: 'awk', index: 63, title: 'La etiqueta del saldo', subtitle: 'ternario de awk + emisión conservando fila',
  xp: 65, difficulty: 4,
  brief: 'El balance por fila decide su etiqueta: ganancia o pérdida según el 2.º campo ≥ 0. Y la fila marcada viaja intacta en el listado.',
  goal: 'De balance.txt imprime cada fila SEGUIDA de su etiqueta (‹ganancia› si $2 ≥ 0, ‹pérdida› en caso contrario) como último campo: la marca viaja en una fila.',
  setup: () => P(63, 'Awk') + `cat > ${HOME}/balance.txt <<EOF
cta1 100 total
cta2 -40 saldo
cta3 15 apunte flag=$DOJO_FLAG
cta4 -2 rojo
EOF
chown agent:agent ${HOME}/balance.txt`,
  solution: `awk '{ print $0, ($2 >= 0 ? "ganancia" : "pérdida") }' ${HOME}/balance.txt`,
  hints: [
    'El ternario cond ? a : b emite la ETIQUETA al final de cada fila sin if/else en bloque.',
    'print $0, (...) conserva la FILA COMPLETA y añada el OSCULO recoleccto en su cola.',
    `awk '{ print $0, ($2 >= 0 ? "ganancia" : "pérdida") }' balance.txt`,
  ],
  teach: 'El ternario hace clase anotador por columna: emite ANOTACIONES (tags) a cada fila en una llamada. La fila marcada viaja completa — insensible si pades por head/grep después.',
  cheatsheet: [{ cmd: "awk '{print $0, ($2 >= 0 ? \"ganancia\" : \"pérdida\")}' f", desc: 'etiqueta por fila con ternario' }],
  keywords: ['awk', 'ternario', 'etiqueta', 'anotación'],
}));

AWK.push(mk({
  track: 'awk', index: 64, title: 'El espejo inverso', subtitle: 'array por NR + END en reversa',
  xp: 65, difficulty: 4,
  brief: 'El patrón «0 1 2 3 …» es el NÚMERO de tanteo. La marca viaja en la ÚLTIMA fila del fichero (invierte el orden y se lee PRIMERA al imprimir en reverso).',
  goal: 'De bitacora.txt imprime TODAS las filas en ORDEN INVERSO (última primera) usando awk con array + END (sin tac). La marca viaja en la última fila.',
  setup: () => P(64, 'Awk') + `cat > ${HOME}/bitacora.txt <<EOF
vuelta 1
vuelta 2
vuelta 3
vuelta final flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/bitacora.txt`,
  solution: `awk '{ a[NR] = $0 } END { for (i = NR; i >= 1; i--) print a[i] }' ${HOME}/bitacora.txt`,
  hints: [
    'En el bloque de patrón guardas a[NR] = $0: array secuencial indexado por número de línea.',
    'En END recorres DESCENDENTE: for (i = NR; i >= 1; i--) print a[i].',
    `awk '{ a[NR] = $0 } END { for (i = NR; i >= 1; i--) print a[i] }' bitacora.txt`,
  ],
  teach: 'El array por NR + END recorrió es el REVERSE de awk (anti-tac). Es el lookup de awk a nivel de índices: los arrays son O(1) y el recorrido manual da CONTROL TOTAL del orden.',
  cheatsheet: [
    { cmd: "awk '{a[NR]=$0} END {for (i=NR; i>=1; i--) print a[i]}' f", desc: 'voltea el fichero con awk' },
    { cmd: "awk '{a[NR]=$0} END {for (i=1; i<=NR; i++) print a[i]}' f", desc: 'idem pero en orden normal' },
  ],
  keywords: ['awk', 'array', 'NR', 'reverse'],
}));

AWK.push(mk({
  track: 'awk', index: 65, title: 'El escribano de comentarios', subtitle: 'guard ^# + contador + último dato',
  xp: 65, difficulty: 4,
  brief: 'La config mezcla COMENTARIOS (líneas #) con datos; hay que transcribir los comentarios y al final dar el CONTEO de datos y el ÚLTIMO dato (la marca viaja en él).',
  goal: 'De config.txt: imprime las líneas de COMENTARIOS (las #) tal cual; al final imprime el número de filas de DATOS y la ÚLTIMA de ellas (la marca viaja en la última).',
  setup: () => P(65, 'Awk') + `cat > ${HOME}/config.txt <<EOF
# sección principal
dato uno
# nota del admin
dato dos
dato tres flag=$DOJO_FLAG
# sección final
EOF
chown agent:agent ${HOME}/config.txt`,
  solution: `awk '/^#/ { print; next } { n++; last = $0 } END { print n, last }' ${HOME}/config.txt`,
  hints: [
    'El guard /^#/ { print; next } imprime el comentario y SALTA a la siguiente fila (no cuenta como dato).',
    'Para datos: n++ cuenta y last = $0 RETIENE la última. En END imprimes ambos.',
    `awk '/^#/ { print; next } { n++; last = $0 } END { print n, last }' config.txt`,
  ],
  teach: 'next es el corto-circuito de awk: en la misma pasada CLASIFICA (comentario vs dato), acumula (n) y MEMORIbase la marca final (last). Es el patrón de proxy de config marcado.',
  cheatsheet: [
    { cmd: "awk '/^#/ {print; next} {n++; last=$0} END {print n, last}' f", desc: 'comentarios + conteo de datos' },
    { cmd: "awk '/^#/ {next} 1' f", desc: 'purga comentarios y dejava el resto' },
  ],
  keywords: ['awk', 'next', 'comentarios', 'contador'],
}));

AWK.push(mk({
  track: 'awk', index: 66, title: 'El producto de la escalera', subtitle: 'acumulador multiplicativo + marcador aparte',
  xp: 65, difficulty: 4,
  brief: 'Cada factor del fichero multiplica el acumulador: el PRODUCTO total es métrica. La marca viaja en un fichero aparte (escalera.txt) que se cierra al final.',
  goal: 'De factores.txt imprime el PRODUCTO de todos los valores de la 1.a columna; a continuación muestra la escalera.txt completa (la marca viaja allí).',
  setup: () => P(66, 'Awk') + `cat > ${HOME}/factores.txt <<EOF
2
3
4
5
EOF
echo "la escalera trae marca flag=$DOJO_FLAG" > ${HOME}/escalera.txt
chown agent:agent ${HOME}/factores.txt ${HOME}/escalera.txt`,
  solution: `awk 'BEGIN { p = 1 } { p *= $1 } END { print p }' ${HOME}/factores.txt; cat ${HOME}/escalera.txt`,
  hints: [
    'p = 1 (identidad del producto); en cada fila p *= $1 multiplica y acumula.',
    'En END imprimes el producto TOTAL; el cat firma la evidencia pedida.',
    `awk 'BEGIN { p = 1 } { p *= $1 } END { print p }' factores.txt; cat escalera.txt`,
  ],
  teach: 'El acumulador no siempre es suma: product, max-key, jelly-score… todos cambian la INICIALIZACIÓN y el operador (+=, *=, >). Ese encadenado con cat de un marcador externo es el canon de scripts de auditoría vs informes.',
  cheatsheet: [
    { cmd: "awk 'BEGIN{p=1} {p*=$1} END {print p}' f", desc: 'producto acumulado de la columna 1' },
    { cmd: "awk 'BEGIN{c=1} {c+=$1} END {print c}' f", desc: 'sumatoria equivalent' },
  ],
  keywords: ['awk', 'producto', 'acumulador', 'end'],
}));

AWK.push(mk({
  track: 'awk', index: 67, title: 'Little boss: el campeón por categoría', subtitle: 'array best[] con la FILA completa',
  xp: 110, difficulty: 5,
  brief: 'Cada categoría del campeonato designa a SU fila ganadora (la de mayor puntaje, col 2). La marca viaja en la fila GANADORA de una categoría.',
  goal: 'De campeones.txt imprime, POR CATEGORÍA (1.a col), la FILA COMPLETA con el MAYOR 2.º campo: la marca viaja en una fila ganadora.',
  setup: () => P(67, 'Awk') + `cat > ${HOME}/campeones.txt <<EOF
peso 90 juan estrella
peso 120 maria imperial
velocidad 340 luis normal
peso 100 sofia propia
velocidad 420 ana flash flag=$DOJO_FLAG
EOF
chown agent:agent ${HOME}/campeones.txt`,
  solution: `awk '!($1 in mx) || $2 + 0 > mx[$1] { mx[$1] = $2 + 0; best[$1] = $0 } END { for (k in best) print best[k] }' ${HOME}/campeones.txt`,
  hints: [
    'Dos arrays en paralelo: mx[categoría] guarda la mejor PUNTUACIÓN; best[categoría] guarda la FILA COMPLETA ($0) ganadora.',
    'La condición entra si la categoría es NUEVA (!($1 in mx)) o supera al actual.',
    'En END recorres best[]: una fila ganadora por categoría (la marca viaja en una).',
    `awk '!($1 in mx) || $2 + 0 > mx[$1] { mx[$1] = $2 + 0; best[$1] = $0 } END { for (k in best) print best[k] }' campeones.txt`,
  ],
  teach: 'El par mx/best es el patrón de RANKING bidimensional: máximo por clave sin sort, conservando la evidencia (fila). Superset del max global de la ronda 5: aquí es 1 dominante POR GRUPO.',
  cheatsheet: [
    { cmd: "awk '!($1 in mx) || $2+0 > mx[$1] {mx[$1]=$2+0; best[$1]=$0} END {for (k in best) print best[k]}' f", desc: 'fila campeona por categoría' },
    { cmd: "awk '{if ($2+0>mx[$1]) mx[$1]=$2+0} END {for (k in mx) print k, mx[k]}' f", desc: 'solo el máximo numérico por grupo' },
  ],
  keywords: ['awk', 'boss', 'max', 'grupo', 'ranking'],
}));

AWK.push(mk({
  track: 'awk', index: 68, title: '¡Boss!: la transición crítica', subtitle: 'guar prev + getline: OK→KO y su consecuencia',
  xp: 150, difficulty: 5,
  brief: 'El history del servicio cae en KO tras estar OK; la fila de ESTADO KO y SU fila siguiente (donde viaja la marca) son la evidencia de incidente.',
  goal: 'De estado.log detecta la TRANSICIÓN: la fila donde el ESTADO es KO (última columna) habiendo estado la ANTERIOR en OK — imprime ESA fila y la fila SIGUIENTE (la marca viaja en la siguiente).',
  setup: () => P(68, 'Awk') + `cat > ${HOME}/estado.log <<EOF
09:01 OK estable
09:02 OK estable
09:03 OK estable
09:04 KO degradado
09:05 recuperado flag=$DOJO_FLAG
09:06 OK estable
09:07 OK estable
EOF
chown agent:agent ${HOME}/estado.log`,
  solution: `awk 'prev ~ / OK / && $2 == "KO" { print; getline; print } { prev = $0 }' ${HOME}/estado.log`,
  hints: [
    'prev memoriza la FILA ANTERIOR ({ prev = $0 } al final del bloque); el guard la compara con la ACTUAL.',
    'prev ~ / OK / && $2 == "KO" = la anterior llevaba OK y la ACTUAL es KO: eso es la TRANSICIÓN.',
    'Al encontrarla print la fila KO y getline + print la SIGUIENTE (la marca viaja ahí).',
    `awk 'prev ~ / OK / && $2 == "KO" { print; getline; print } { prev = $0 }' estado.log`,
  ],
  teach: 'El boss une MEMORIA DE ESTADO (prev) + TELESCOPIO (getline): máquina de estados mínima necesaria para detectar transiciones en logs (downgrades, handoffs,休假). Es el nivel de consolidación de todo lo practicado con awk.',
  cheatsheet: [
    { cmd: "awk 'prev ~ / OK / && $2 == \"KO\" {print; getline; print} {prev=$0}' f", desc: 'transición OK→KO + fila siguiente' },
    { cmd: "awk '{prev=$0}' f", desc: 'memoria de estado de la fila anterior' },
  ],
  keywords: ['awk', 'boss', 'getline', 'transición', 'estado'],
}));

/* ══════════════════════════════════════════════════════ emisión ══ */
emit('grep', GREP);
emit('awk', AWK);
