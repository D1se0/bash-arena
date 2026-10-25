#!/usr/bin/env node
/**
 * gen-round-4 — ronda 4 de niveles (determinista; NO borra niveles previos):
 *   · grep  l27–l36 (10): -c, -l, -f, -m, -q/exit, alternancias -oE, -B/-A mixto,
 *     --exclude-dir, -vn+anclas, boss de análisis de auth.log.
 *   · awk   l27–l36 (10): -v, FS/OFS, printf, length/substr, split multi-sep,
 *     gsub, tabla por grupo, min+max, join por FILENAME, boss acumulador.
 *   · sysadmin l19–l28 (10): sshd Port/AllowUsers, authorized_keys, apache
 *     vhost+configtest, nginx -t, binarios (install/which/file), logs, systemd,
 *     cron, PATH/hash, boss final de servicios.
 *   · dns   l13–l20 (8): hosts, resolv.conf, A/CNAME, SOA serial/TTL, MX/SRV,
 *     precedencia nsswitch, zona inversa PTR, boss DNS completo.
 *   · sql   l17–l22 (6): subconsulta, CASE, HAVING, UPDATE+WHERE, INSERT+SELECT,
 *     boss LEFT JOIN + IS NULL.
 *
 * Contrato de scripts/test-levels.mjs: setup contiene $DOJO_FLAG, la solución
 * NO la menciona y la imprime en stdout con exit 0.
 * Regenerar: node scripts/gen-round-4.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));
const HOME = '/home/agent';

/** verificador por nivel: valida y, si todo pasa, suelta /var/.dojo-hit (la flag). */
function verifier(name, name_es, checks) {
  const body = [
    `#!/bin/bash`,
    `case "$1" in`,
    `  ${name})`,
    ...checks.map((c) => `    ${c}`),
    `    echo "✓ directo ${name}: ${name_es}"; cat /var/.dojo-hit ;;`,
    `esac`,
  ].join('\n');
  return `cat > /usr/local/bin/dojo-verificar <<'CHECK'\n${body}\nCHECK\nchmod 0755 /usr/local/bin/dojo-verificar`;
}

/** mk: acepta setup como string FINAL (svc/dns) o como función f(flag) (grep/awk). */
function mk({ track, index, title, subtitle, xp, difficulty, brief, goal, setup, solution, hints, teach, cheatsheet, keywords, profile = 'default' }) {
  let setupFinal = setup;
  if (typeof setup === 'function') {
    setupFinal = '#!/bin/bash\nset -e\n' + setup().trimEnd() + '\n';
  }
  return {
    id: `${track}-l${index}`, track, index, title, subtitle, xp, difficulty,
    brief, goal, setup: setupFinal, solution, hints, teach, cheatsheet, keywords, profile,
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{d3b09a4f7c2e1b8d6041a5f3}' }],
  };
}

/* ══════════════════════════════════════════════════════ GREP l27–l36 ══ */
const GREP = [];

GREP.push(mk({
  track: 'grep', index: 27, title: 'Contar las caídas', subtitle: 'grep -c: nº de líneas que casan',
  xp: 45, difficulty: 2,
  brief: 'El monitor de ping anota cada corte por hora. Para el informe necesitas el TOTAL de cortes registrados, no las líneas en sí.',
  goal: 'Primero CUENTA (grep -c) las líneas de corte de cortes.log y después muestra ESAS líneas: contienen la marca del dojo.',
  setup: () => `arena-prompt "LVL 27" "Grep"
{
  i=0
  for hora in 08 09 10 11 12 13 14 15 16 17; do
    i=$((i+1))
    if [ $((i % 3)) -eq 0 ]; then echo "corte \${hora}:00 enlace colapsado $DOJO_FLAG"; else echo "ok \${hora}:00 servicio normal"; fi
  done
} > ${HOME}/cortes.log
chown agent:agent ${HOME}/cortes.log`,
  solution: `grep -c 'corte' ${HOME}/cortes.log && grep 'corte' ${HOME}/cortes.log`,
  hints: [
    'grep -c no imprime las líneas: imprime CUÁNTAS casaron (solo el número).',
    'El segundo grep SIN -c re-muestra ya las líneas completas: llevan la marca.',
    `grep -c 'corte' ${HOME}/cortes.log && grep 'corte' ${HOME}/cortes.log`,
  ],
  teach: 'grep -c devuelve el CONTEO de líneas que casan (0 si ninguna, exit 1). Trampa clásica: cuenta LÍNEAS, no apariciones (dos matches en la misma línea valen 1); con -o + wc -l contarías apariciones en vez de líneas.',
  cheatsheet: [
    { cmd: 'grep -c p f', desc: 'cuántas líneas casan' },
    { cmd: 'grep -o p f | wc -l', desc: 'cuántas apariciones (otra vía)' },
  ],
  keywords: ['grep', '-c', 'contar'],
}));

GREP.push(mk({
  track: 'grep', index: 28, title: 'Sospechosos habituales', subtitle: 'grep -l y -L: nombres de ficheros',
  xp: 55, difficulty: 3,
  brief: 'En carpeta/ hay varios informes. Solo uno recibió la marca leaked: localízalo con -l y muestra SU línea (que lleva la marca).',
  goal: 'Imprime el NOMBRE del fichero de carpeta/ que contiene leaked (con grep -l) y a continuación SU LÍNEA (grep). La línea lleva la marca del dojo.',
  setup: () => `arena-prompt "LVL 28" "Grep"
mkdir -p ${HOME}/carpeta
echo 'informe A: redacción final, sin anexos' > ${HOME}/carpeta/informe-A.txt
echo 'informe B: corrección ortográfica revisada' > ${HOME}/carpeta/informe-B.txt
echo 'informe C: leaked se detectó en el anexo dos: $DOJO_FLAG' > ${HOME}/carpeta/informe-C.txt
echo 'informe D: adjuntos reenviados al archivo' > ${HOME}/carpeta/informe-D.txt
echo 'memorando: revisión de plantilla del mes' > ${HOME}/carpeta/memo.txt
chown -R agent:agent ${HOME}/carpeta`,
  solution: `f=$(grep -rl 'leaked' ${HOME}/carpeta); echo "$f"; grep 'leaked' "$f"`,
  hints: [
    '-l imprime el NOMBRE DE FICHERO (una vez por fichero), no las líneas: guardalo en una variable.',
    '"f=$(grep -rl …)" captura la ruta; luego grep patrón "$f" muestra la línea culpable (marca incluida).',
    `f=$(grep -rl 'leaked' carpeta); echo "$f"; grep 'leaked' "$f"`,
  ],
  teach: 'grep -l lista los ficheros que contienen el patrón (ideal para pipelines con xargs) y -L los que NO lo contienen. La pareja l/L es el filtro de «en qué archivo está» para árboles grandes.',
  cheatsheet: [
    { cmd: 'grep -rl p dir', desc: 'solo nombres de ficheros que casan' },
    { cmd: 'grep -rL p dir', desc: 'ficheros SIN el patrón' },
  ],
  keywords: ['grep', '-l', '-L', 'lista'],
}));

GREP.push(mk({
  track: 'grep', index: 29, title: 'La lista vetada', subtitle: 'grep -f: patrones leídos de un fichero',
  xp: 60, difficulty: 3,
  brief: 'El filtro de spam reúne TÉRMINOS VETADOS en vetados.txt (uno por línea). Un correo usa un vetado para colar la marca.',
  goal: 'Busca en los .msg del buzón con TODA la lista de vetados de una vez (grep -f) y encuentra el correo que lleva FLAG{…}.',
  setup: () => `arena-prompt "LVL 29" "Grep"
mkdir -p ${HOME}/buzon
cat > ${HOME}/buzon/vetados.txt <<EOF
pokerza
farmaciu
apuestum
criptojuego
EOF
echo 'hola: oferta del día con apuestum dentro pero sin marca' > ${HOME}/buzon/un.msg
echo 'curso online de apuestum online: tipografías serif: $DOJO_FLAG' > ${HOME}/buzon/dos.msg
echo 'ronda trimestral de resultados según protocolo' > ${HOME}/buzon/tres.msg
echo 'criptojuego NFT: ¡hazte rico jugando! sin marca' > ${HOME}/buzon/cuatro.msg
chown -R agent:agent ${HOME}/buzon`,
  solution: `grep -f ${HOME}/buzon/vetados.txt -r ${HOME}/buzon | grep 'dos.msg' | grep -oE 'FLAG\\{[^}]*\\}'`,
  hints: [
    '-f FICHERO lee patrones UNO POR LÍNEA: no hace falta un grep por término.',
    'Los cuatro .msg casan con los vetados; el correo del curso tipográfico trae la marca.',
    `grep -f vetados.txt -r ${HOME}/buzon  # y luego aislar la línea con la marca`,
  ],
  teach: 'grep -f lista.txt busca TODOS los patrones del fichero a la vez (uno por línea). Es el detector reutilizable: la lista puede crecer sin tocar el comando (la blacklist de producción).',
  cheatsheet: [
    { cmd: 'grep -f lista.txt f', desc: 'múltiples patrones de un fichero' },
    { cmd: 'grep -Ff lista.txt f', desc: 'ídem, patrones literales (sin regex)' },
  ],
  keywords: ['grep', '-f', 'lista', 'spam'],
}));

GREP.push(mk({
  track: 'grep', index: 30, title: 'La primera señal', subtitle: 'grep -m N: máximo de coincidencias',
  xp: 55, difficulty: 3,
  brief: 'El radar avisa CADA segundo que ve señal, pero para el ticket solo necesitas LA PRIMERA: -m corta en cuanto la tiene.',
  goal: 'Imprime SOLO una línea de radar.log (la primera que contenga señal) usando el límite de coincidencias.',
  setup: () => `arena-prompt "LVL 30" "Grep"
{
  for i in $(seq 1 12); do
    if [ "$i" -eq 1 ]; then echo "señal $DOJO_FLAG ttl $i"; else echo "señal eco sin jugador ttl $i"; fi
  done
} > ${HOME}/radar.log
chown agent:agent ${HOME}/radar.log`,
  solution: `grep -m 1 'señal' ${HOME}/radar.log`,
  hints: [
    '-m N deja de buscar tras N coincidencias: -m 1 imprime SOLO la primera.',
    'Ojo: todas las líneas contienen «señal»; -m 1 corta tras la 1.ª y no escanea más.',
    `grep -m 1 'señal' ${HOME}/radar.log`,
  ],
  teach: 'grep -m 1 imprime la primera coincidencia y PARA (abandona el escaneo). En ficheros gigantes es la diferencia entre 2ms y 2 minutos.',
  cheatsheet: [
    { cmd: 'grep -m 1 p f', desc: 'primera coincidencia y cortar' },
    { cmd: 'grep -m 5 p f', desc: 'hasta 5 coincidencias' },
  ],
  keywords: ['grep', '-m', 'límite'],
}));

GREP.push(mk({
  track: 'grep', index: 31, title: 'El detector silencioso', subtitle: 'grep -q + $? en un if',
  xp: 65, difficulty: 4,
  brief: 'En scripting NO quieres la salida: quieres SABER si está. El guardián del dojo usa -q y $?.',
  goal: 'Si marca.trace contiene marcada, imprime «Vamos con la señal» y su contenido (una línea con FLAG{…}).',
  setup: () => `arena-prompt "LVL 31" "Grep"
echo 'firma del zinco en tránsito' > ${HOME}/step-inside.txt
echo 'marcada: $DOJO_FLAG' > ${HOME}/marca.trace
chmod 0644 ${HOME}/marca.trace`,
  solution: `if grep -q 'marcada' ${HOME}/marca.trace; then echo "Vamos con la señal"; cat ${HOME}/marca.trace; else echo 'sin señal: abortando'; fi`,
  hints: [
    'grep -q es silencioso: su ÚNICO mensaje es el exit code (0 si casó, 1 si no).',
    'Un if COMANDO then … evalúa el exit code: -q + cat del trace.',
    `if grep -q 'marcada' marca.trace; then cat marca.trace; fi`,
  ],
  teach: 'grep -q (quiet) solo dice SÍ/NO con el código de salida: 0 si encontró, 1 si no. Es el grep que alimenta if/&&/|| en scripts — inmediato y sin salida contaminante.',
  cheatsheet: [
    { cmd: 'grep -q patrón f', desc: 'solo exit code (0=sí, 1=no)' },
    { cmd: 'if cmd; then …; fi', desc: 'evaluar exit code de un comando' },
  ],
  keywords: ['grep', '-q', 'exit', 'scripting'],
}));

GREP.push(mk({
  track: 'grep', index: 32, title: 'Tokens al oculto', subtitle: 'grep -oE con alternancia: extraer VARIOS tipos de pieza',
  xp: 70, difficulty: 4,
  brief: 'En eventos.log hay piezas event=HEX y request=HEX mezcladas. La alternancia captura AMBOS tipos; la marca viaja en uno de los tokens válidos.',
  goal: 'Extrae de eventos.log los tokens event=HEX y request=HEX donde HEX sea EXACTAMENTE 4 hexadecimales en MAYÚSCULAS (con -oE) y después muestra la línea de la sorpresa: lleva la marca.',
  setup: () => `arena-prompt "LVL 32" "Grep"
cat > ${HOME}/eventos.log <<EOF
event=1A2B procesado sin incidencias
req event=OKIA mal formato: solo 3 mayúsculas
request=1A2C quedó pendiente otro ciclo
sumerio request=xyz9 lowercase fuera de sílaba
sorpresa: $DOJO_FLAG escondida entre tokens válidos
request=0001 en la cola del balance
EOF
chown agent:agent ${HOME}/eventos.log`,
  solution: `grep -oE '(event|request)=[0-9A-F]{4}' ${HOME}/eventos.log && grep '^sorpresa:' ${HOME}/eventos.log`,
  hints: [
    'La alternancia (event|request) captura CUALQUIERA de las dos cabeceras.',
    '[0-9A-F]{4} exige EXACTAMENTE 4 hexadecimales en MAYÚSCULAS (ni lowercase ni más largos).',
    'Tras los tokens, la línea de la sorpresa es un uso de grep plano (ancla ^sorpresa:).',
    `grep -oE '(event|request)=[0-9A-F]{4}' ${HOME}/eventos.log && grep '^sorpresa:' ${HOME}/eventos.log`,
  ],
  teach: 'Con alternancia (a|b) + clases exactas ([0-9A-F]{4}) iscribes un recogedor de tokens: coge cualquier pieza con cualquiera de las cabeceras y formato exacto. Toda la validación vive en la regex.',
  cheatsheet: [
    { cmd: "grep -oE '(a|b)=[0-9A-F]{4}'", desc: 'extraer dos tipos de tokens' },
    { cmd: 'grep -oE … | wc -l', desc: 'ídem contando extracciones' },
  ],
  keywords: ['grep', '-oE', 'alternancia', 'tokens'],
}));

GREP.push(mk({
  track: 'grep', index: 33, title: 'Un antes, dos después', subtitle: 'grep -B1 -A2: contexto asimétrico',
  xp: 70, difficulty: 4,
  brief: 'El protocolo dice: al ERROR acompañan SU línea ANTERIOR (causa) y DOS POSTERIORES (impacto). Contexto asimétrico.',
  goal: 'Muestra de protocolo.log las líneas del ERROR con SU línea previa y DOS posterior (uso de -B1 y -A2).',
  setup: () => `arena-prompt "LVL 33" "Grep"
cat > ${HOME}/protocolo.log <<EOF
inicio del dia 17
cache recalibrada en la mesa
ERROR aplicando en casilla 17: $DOJO_FLAG
sanidad revisada
impactos: 2 camas
impacto total no visible
EOF
chown agent:agent ${HOME}/protocolo.log`,
  solution: `grep -B1 -A2 'ERROR' ${HOME}/protocolo.log`,
  hints: [
    '-B1 pide UNA línea ANTES (Before) y -A2 DOS después (After): se combinan en el mismo comando.',
    'grep -B1 -A2 patrón fichero aplica las DOS ventanas al patrón en una única pasada.',
    `grep -B1 -A2 'ERROR' ${HOME}/protocolo.log`,
  ],
  teach: '-B y -A se usan juntos para contexto asimétrico: -B1 -A2 = 1 antes + propio + 2 después (4 líneas por match). -C4 sería el modo simétrico cómodo.',
  cheatsheet: [
    { cmd: 'grep -B1 -A2 p f', desc: 'contexto asimétrico: 1 antes, 2 después' },
    { cmd: 'grep -C5 p f', desc: '5 líneas a ambos lados' },
  ],
  keywords: ['grep', '-B', '-A', 'contexto'],
}));

GREP.push(mk({
  track: 'grep', index: 34, title: 'El respaldo engañoso', subtitle: 'grep -r --exclude-dir y --exclude',
  xp: 75, difficulty: 4,
  brief: 'El proyecto archiva versiones viejas en respaldo/ y ficheros .bak: contienen marcas ANTIGUAS (falsas). La marca VIVA está solo en el código actual.',
  goal: 'Busca en proyecto/ la marca viva excluyendo el directorio respaldo/ y los ficheros terminados en .bak (con --exclude-dir y --exclude).',
  setup: () => `arena-prompt "LVL 34" "Grep"
mkdir -p ${HOME}/proyecto/respaldo ${HOME}/proyecto/src
echo 'marca vieja falsa del enero: FLAG{viejafalsa}' > ${HOME}/proyecto/respaldo/version1.py
echo 'copia respaldada con FLAG{viejafalsa} perdida' > ${HOME}/proyecto/gagd.bak
echo 'saludo: poca cosa y sin marca real' > ${HOME}/proyecto/src/leer.py
echo 'puerta: el sello vivo se encontro en el main: $DOJO_FLAG' > ${HOME}/proyecto/src/main.py
chown -R agent:agent ${HOME}/proyecto`,
  solution: `grep -r --exclude-dir=respaldo --exclude='*.bak' 'FLAG{' ${HOME}/proyecto`,
  hints: [
    '--exclude-dir=NOMBRE excluye CARPETAS (sin globs: el nombre).',
    '--exclude="*.bak" sí acepta GLOBS de FICHERO: excluye los backups.',
    `grep -r --exclude-dir=respaldo --exclude='*.bak' 'FLAG{' ${HOME}/proyecto`,
  ],
  teach: '--exclude-dir filtra CARPETAS completas (respaldo/, node_modules/) y --exclude filtra NOMBRES de fichero con glob (*.bak, *.min.js). Ambas junto a -r son obligatorias cuando hay respaldos que ENGAÑAN la señal.',
  cheatsheet: [
    { cmd: 'grep -r --exclude-dir=respaldo p dir', desc: 'excluye una carpeta completa' },
    { cmd: "grep -r --exclude='*.bak' p dir", desc: 'excluye ficheros por glob' },
  ],
  keywords: ['grep', 'exclude-dir', 'exclude', 'recursivo'],
}));

GREP.push(mk({
  track: 'grep', index: 35, title: 'Palabras fuera del caserío', subtitle: 'grep -v con anclas: excluir palabra EXACTA',
  xp: 75, difficulty: 4,
  brief: 'El glosario mezcla señales con rellenos que EMPIEZAN por test (aislado): hay que EXCLUIR esas filas con anclaje ^test+espacio y dejar pasar testear/testing.',
  goal: 'De glosario.txt imprime las líneas numeradas (-n) que NO empiecen por test como palabra test (test solo con espacio al final del vocablo), dejando pasar testear y testing.',
  setup: () => `arena-prompt "LVL 35" "Grep"
cat > ${HOME}/glosario.txt <<EOF
test de señal no: marca falsa filtrada
testear a las 12 es aceptable
antibiotest curación por doble dosis
test sola (esto SI se debe excluir)
testing en el sprint reboot: $DOJO_FLAG
EOF
chown agent:agent ${HOME}/glosario.txt`,
  solution: `grep -vnE '^test([[:space:]]|$)' ${HOME}/glosario.txt`,
  hints: [
    'El GREP invierte: -v descarta las que CASAN; el patrón describe las QUE QUIERES QUITAR.',
    'Con -w + -v las dando ambiguas: mejor el ancla ^test + espacio o fin de línea.',
    `grep -vnE '^test( |$)' ${HOME}/glosario.txt`,
  ],
  teach: '-v con anclas quita las que casan: en vez de -w (ambiguo con -v), se ancla ^test + espacio|fin de línea: la palabra test desaparece y testear/testing permanecen. La combinación -v -n -E demuestra que las opciones se acumulan.',
  cheatsheet: [
    { cmd: 'grep -vn patrón f', desc: 'numeradas, excluyendo las que casan' },
    { cmd: "grep -vE '^test( |$)' f", desc: 'excluir test como palabra inicial' },
  ],
  keywords: ['grep', '-v', 'ancla', 'excluir'],
}));

GREP.push(mk({
  track: 'grep', index: 36, title: 'Boss: el intruso del SSH', subtitle: 'cadena: contar IPs + localizar su única conexión OK',
  xp: 140, difficulty: 5,
  brief: 'En auth.log los AUTH FAIL se concentran en UNA IP. Dicho atacante solo logró un SUCCESS: ahí viaja la marca. Cadena de greps y sort/uniq/awk.',
  goal: 'Imprime de auth.log ÚNICAMENTE la marca FLAG{…} que viaja en la línea de SUCCESS del atacante (IP con MÁS FAIL).',
  setup: () => `arena-prompt "LVL 36" "Grep"
cat > ${HOME}/auth.log <<EOF
06:00 AUTH FAIL ip 203.0.113.77 usuario root
06:01 AUTH FAIL ip 203.0.113.77 usuario root
06:02 AUTH FALLA ip 198.51.100.4 usuario admin2
06:03 AUTH OK ip 198.51.100.4 usuario admin2
06:04 AUTH FAIL ip 203.0.113.77 usuario root
06:05 AUTH FAIL ip 203.0.113.77 usuario root
06:06 AUTH OK ip 203.0.113.77 usuario root flag=$DOJO_FLAG
06:07 AUTH FAIL ip 192.168.44.4 usuario backup
06:08 AUTH OK ip 192.168.44.4 usuario backup
06:09 AUTH FAIL ip 198.51.100.4 usuario admin2
EOF
chown agent:agent ${HOME}/auth.log`,
  solution: `ip=$(grep 'AUTH FAIL' ${HOME}/auth.log | grep -oE 'ip [0-9.]+' | sort | uniq -c | sort -nr | head -1 | awk '{print $3}'); grep "ip $ip" ${HOME}/auth.log | grep 'AUTH OK' | grep -oE 'flag=\\S+'`,
  hints: [
    'Paso 1: filtra los FAIL (grep "AUTH FAIL") y encuentra la IP dominante con sort | uniq -c | sort -nr | head -1.',
    'Paso 2: con la IP en mano (awk {print $3}), filtra esa IP Y el OK, y extrae flag= con grep -oE.',
    'Compón con variables: ip=$(grep "AUTH FAIL" auth.log | …); grep "$ip" auth.log | …',
  ],
  teach: 'El boss une análisis de conteos con la cadena de greps: primero «¿quién domina el FAIL?» (sort|uniq -c|sort -nr) y luego la extracción de la línea OK del atacante con grep -oE. Es EL paso completo de auditoría de logs real.',
  cheatsheet: [
    { cmd: 'grep x f | sort | uniq -c | sort -nr | head -1', desc: 'el valor que más se repite' },
    { cmd: 'grep "ip $ip" f | grep OK | grep -oE', desc: 'por IP + criterio + extraer' },
  ],
  keywords: ['grep', 'boss', 'log', 'cadena', 'uniq'],
}));

/* ══════════════════════════════════════════════════════ AWK l27–l36 ══ */
const AWK = [];

AWK.push(mk({
  track: 'awk', index: 27, title: 'El umbral importado', subtitle: 'awk -v y BEGIN: variables desde fuera',
  xp: 50, difficulty: 3,
  brief: 'El despacho del dojo usa el umbral 140 pero configurable: awk -v inyecta variables limpias al motor (sin tocar el código del programa).',
  goal: 'Con awk y la variable externa UMBRAL=140, imprime NOMBRE y NOTA (print $1, $3) de los envíos cuyo peso SUPERA ese umbral.',
  setup: () => `arena-prompt "LVL 27" "Awk"
cat > ${HOME}/envios.txt <<EOF
sacos 30 nota:muy ligero
ladrillo 150 nota:$DOJO_FLAG
mago 21 nota:paquete raro
vigas 142 nota:casi arriba
cemento 160 nota:peso máximo
EOF
chown agent:agent ${HOME}/envios.txt`,
  solution: `awk -v UMBRAL=140 '$2 > UMBRAL {print $1, $3}' ${HOME}/envios.txt`,
  hints: [
    'awk -v VAR=valor habilita VAR antes de leer: dentro del programa es una variable como cualquier otra.',
    'La comparación $2 > UMBRAL usa la variable: el 140 no aparece en el código.',
    `awk -v UMBRAL=140 '$2 > UMBRAL {print $1, $3}' ${HOME}/envios.txt`,
  ],
  teach: '-v conecta el shell con el awk: envía parámetros (umbral, fecha, hostname…) sin enchufarlos en el texto del programa. BEGIN se ejecuta ANTES de leer el fichero: el sitio lógico de los valores por defecto.',
  cheatsheet: [
    { cmd: "awk -v UMBRAL=140 '$2 > UMBRAL'", desc: 'variable inyectada desde el shell' },
    { cmd: "awk 'BEGIN {print \"inicio\"}'", desc: 'bloque previo a los datos' },
  ],
  keywords: ['awk', '-v', 'BEGIN', 'variable'],
}));

AWK.push(mk({
  track: 'awk', index: 28, title: 'El conversor de tabla', subtitle: 'awk FS/OFS: reformat con BEGIN {OFS}',
  xp: 55, difficulty: 3,
  brief: 'El inventario llega en columnas separadas por «:» (como passwd). Se convierte a tabulación (TSV) para el grid del dojo: OFS lo reescribe.',
  goal: 'De inventario.dat (separado por :) imprime campo1 y campo3 SEPARADOS POR TABULADOR (solo esas dos columnas).',
  setup: () => `arena-prompt "LVL 28" "Awk"
cat > ${HOME}/inventario.dat <<EOF
herraje:stato:$DOJO_FLAG:12
candado:activo:latón:30
pallet:inactivo:nota:8
tornillería:activo:acero:55
EOF
chown agent:agent ${HOME}/inventario.dat`,
  solution: `awk -F: 'BEGIN {OFS="\\t"} {print $1, $3}' ${HOME}/inventario.dat`,
  hints: [
    'OFS es el Output Field Separator: con BEGIN {OFS="\\t"} los campos impresos con coma quedan TAB-separados.',
    'print $1, $3 (con COMA) usa el OFS; print $1 $3 (sin coma) concatenaría SIN separador.',
    `awk -F: 'BEGIN {OFS="\\t"} {print $1, $3}' inventario.dat`,
  ],
  teach: 'FS es el separador de ENTRADA (algo como -F:) y OFS el de SALIDA: la pareja convierte formatos limpios en una línea. $1, $3 con coma aplica el OFS asignado.',
  cheatsheet: [
    { cmd: 'awk -F: \'BEGIN {OFS="\\t"} {print $1,$3}\' f', desc: 'de «:» a tab' },
    { cmd: 'awk \'BEGIN {FS=","; OFS="|"}\' f', desc: 'de CSV a PIPE' },
  ],
  keywords: ['awk', 'OFS', 'FS', 'formato'],
}));

AWK.push(mk({
  track: 'awk', index: 29, title: 'La factura en columnas', subtitle: 'awk printf: alinear columnas (%s %d %.1f)',
  xp: 60, difficulty: 3,
  brief: 'El reporte del taller quiere columnas ALINEADAS: printf formatea anchos (y decimales) sin jugar con columnas a ojo.',
  goal: 'De medidas.txt: printf %-12s %7.1f (codename a la izquierda en 12, valor 1 decimal) para TODAS las filas. La marca viaja en el codename de una de las medidas.',
  setup: () => `arena-prompt "LVL 29" "Awk"
cat > ${HOME}/medidas.txt <<EOF
vapor 12.5
fuego 98.75
axena 3.2
$DOJO_FLAG 45.0
EOF
chown agent:agent ${HOME}/medidas.txt`,
  solution: `awk '{printf "%-12s %7.1f\\n", $1, $2}' ${HOME}/medidas.txt`,
  hints: [
    'printf NO agrega salto de línea: acompañalo siempre con \\n.',
    '"%-12s" deja el nombre IZQUIERDO en 12; "%7.1f" numérico de 7 con 1 decimal.',
    `awk '{printf "%-12s %7.1f\\n", $1, $2}' ${HOME}/medidas.txt`,
  ],
  teach: 'printf de awk es el printf de C: %s cadena, %d entero, %.1f decimal, %-10s izquierdo en 10, %6.1f derecho de 6 con 1 decimal. Alinea informes sin tocarse a mano.',
  cheatsheet: [
    { cmd: 'printf "%-10s %6.1f\\n", a, b', desc: 'columnas con anchos' },
    { cmd: 'printf "%05d\\n", n', desc: 'entero rellenado a 5 dígitos' },
  ],
  keywords: ['awk', 'printf', 'formato'],
}));

AWK.push(mk({
  track: 'awk', index: 30, title: 'Códigos de longitud exacta', subtitle: 'awk length + substr',
  xp: 60, difficulty: 3,
  brief: 'En codigos.txt los códigos válidos ocupan EXACTAMENTE 8 caracteres en el PRIMER campo. La marca viaja en la nota de uno de esos códigos.',
  goal: 'Imprime de codigos.txt SOLO las líneas cuyo PRIMER campo mide EXACTAMENTE 8 caracteres (length($1)==8): una trae la nota con la marca.',
  setup: () => `arena-prompt "LVL 30" "Awk"
cat > ${HOME}/codigos.txt <<EOF
AB123 corto
NOTA7YZ1 marcada: $DOJO_FLAG
ABCDEF cortito2
GHIJKLMN7 decalcado con rewrite
ZOPERTUIS demasiado larga: 9 letras
EOF
chown agent:agent ${HOME}/codigos.txt`,
  solution: `awk 'length($1) == 8 {print}' ${HOME}/codigos.txt`,
  hints: [
    'length($1) mide el PRIMER CAMPO (no la línea): así notas y ruido de la fila no cuentan.',
    'Con $0 medirías TODO (incluida la nota): el código quedo fuera de la medida.',
    `awk 'length($1) == 8 {print}' ${HOME}/codigos.txt`,
  ],
  teach: "length() mide (de $1 un campo o $0 la línea) y substr() corta partes FÍSICAS. length($1)==8 filtra por el código; length($0)==8 mediría la fila entera (con nota): elige QUÉ mides.",
  cheatsheet: [
    { cmd: "awk 'length($1) == 8' f", desc: 'filtra por longitud del 1.er campo' },
    { cmd: "awk '{print substr($0,1,4)}' f", desc: 'recorta los 4 primeros símbolos' },
  ],
  keywords: ['awk', 'length', 'substr'],
}));

AWK.push(mk({
  track: 'awk', index: 31, title: 'El registro híbrido', subtitle: 'awk split() con varios separadores',
  xp: 65, difficulty: 4,
  brief: 'El registro de alias mezcla separadores: «ALIAS;objeto:peso», con punto y coma + dos puntos en la misma línea. split() lo resuelve.',
  goal: 'De rangos.txt imprime el PESO (3.ª pieza) del alias cuyo valor exacto (1.ª pieza) es rival.',
  setup: () => `arena-prompt "LVL 31" "Awk"
cat > ${HOME}/rangos.txt <<EOF
mago;baston:50
rival;espada:$DOJO_FLAG
druida;trasto:25
rival;sombra:9
EOF
chown agent:agent ${HOME}/rangos.txt`,
  solution: `awk '{split($0, a, /[;:]/); if (a[1] == "rival") print a[3]}' ${HOME}/rangos.txt`,
  hints: [
    'split($0, a, SEP) parte en piezas arbitrarias: SEP puede ser regex [;:] que engulle «;» y «:».',
    'Piezas tras el split: a[1] alias, a[2] objeto, a[3] peso.',
    `awk '{split($0, a, /[;:]/); if (a[1] == "rival") print a[3]}' ${HOME}/rangos.txt`,
  ],
  teach: 'split() con regex [;:] gestiona separadores MÚLTIPLES en la misma línea. Es la herramienta para ficheros mixtos que ni FS ni -F cubren: parte, separa y accede por índice.',
  cheatsheet: [
    { cmd: 'split($0, a, /[;:]/)', desc: 'separador multi-carácter regex' },
    { cmd: 'split($1, b, ":")', desc: 'parte un CAMPO ya separado' },
  ],
  keywords: ['awk', 'split', 'regex'],
}));

AWK.push(mk({
  track: 'awk', index: 32, title: 'El ruido limpiado', subtitle: 'awk gsub(): sustitución global',
  xp: 65, difficulty: 4,
  brief: 'El clima escupe ruidos «eco-N» por la línea: gsub() los barre TODOS y la marca queda limpia.',
  goal: 'De ruido.txt limpia las líneas retirando CADA eco- (patrón eco-[0-9]) y después imprime el resto (la marca visible al final).',
  setup: () => `arena-prompt "LVL 32" "Awk"
cat > ${HOME}/ruido.txt <<EOF
eco-1 $DOJO_FLAG eco-2 señal
ruido final eco-3 limpio
EOF
chown agent:agent ${HOME}/ruido.txt`,
  solution: `awk '{gsub(/eco-[0-9]/, ""); print}' ${HOME}/ruido.txt`,
  hints: [
    'gsub(/regex/, "reemplazo") sustituye TODAS las apariciones de la línea ($0).',
    'El gsub modifica $0 en el sitio y el {print} implícito re-escribe limpio.',
    `awk '{gsub(/eco-[0-9]/, ""); print}' ${HOME}/ruido.txt`,
  ],
  teach: 'gsub(/regex/, texto) limpia en toda la línea (reemplazo global) y sub() cambia SOLO el primero. La pareja es la base de la limpieza de logs al vuelo (quitar anexos, blancos, ts…).',
  cheatsheet: [
    { cmd: 'gsub(/ruido/, "")', desc: 'elimina el patrón de la línea' },
    { cmd: 'sub(/una/, "O", $1)', desc: 'sub() = una sola sustitución' },
  ],
  keywords: ['awk', 'gsub', 'limpiar'],
}));

AWK.push(mk({
  track: 'awk', index: 33, title: 'Menú del suma la pizarra', subtitle: 'awk arrays con clave: total por grupo y acceso directo',
  xp: 70, difficulty: 4,
  brief: 'tickets.txt registra «usuario tickets nota». Suma tickets por usuario (array t) y acumula SUS notas (array n): en END imprime el total y la nota de elka.',
  goal: 'Suma los tickets por usuario (t[$1] += $2), acumula las notas en otro array (n[$1]) y en END imprime el TOTAL de elka y SUS notas (dos líneas).',
  setup: () => `arena-prompt "LVL 33" "Awk"
cat > ${HOME}/tickets.txt <<EOF
elka 2 nota:maniana
mira 3 nota:al ESPEJO
eka 9 nota:recuento
eka3 1 nota:eco
elka 7 nota:$DOJO_FLAG
sara 5 nota:sueño
mira 12 nota:madrugada
EOF
chown agent:agent ${HOME}/tickets.txt`,
  solution: `awk '{t[$1] += $2; n[$1] = n[$1] " " $3} END {print t["elka"]; print n["elka"]}' ${HOME}/tickets.txt`,
  hints: [
    'Dos arrays en paralelo: t suma el valor ($2) y n CONCATENA la nota ($3) con n[$1] = n[$1] " " $3.',
    'En END imprime el total (t["elka"]) y SU nota acumulada (n["elka"]) — dos print.',
    `awk '{t[$1]+=$2; n[$1]=n[$1] " " $3} END {print t["elka"]; print n["elka"]}' ${HOME}/tickets.txt`,
  ],
  teach: 't[$1] += valor construye la tabla por clave; varios arrays (t, n) guardan distintas piezas por USUARIO, con concatenación para notas. En END accedes a cualquier clave directo (t["elka"]).',
  cheatsheet: [
    { cmd: 'awk \'{t[$1] += $2} END {print t["x"]}\'', desc: 'acumula por clave y lee un valor' },
    { cmd: 'awk \'{c[$1]++} END {print c["x"]}\'', desc: 'contar apariciones de la clave' },
  ],
  keywords: ['awk', 'array', 'grupo', 'total'],
}));

AWK.push(mk({
  track: 'awk', index: 34, title: 'Los extremos del pulso', subtitle: 'awk min + max en la misma pasada',
  xp: 75, difficulty: 4,
  brief: 'El despertador cardíaco trae valores distintos por línea. AWK necesita MIN y MAX de la MISMA columna con acumuladores.',
  goal: 'Imprime de estiramiento.txt el MÍNIMO y el MÁXIMO de la 2.ª columna, y la NOTA (3.er campo) del turno donde está el max (una línea: min, max, nota).',
  setup: () => `arena-prompt "LVL 34" "Awk"
cat > ${HOME}/estiramiento.txt <<EOF
turno1 45 nota:risa tranquila
turno2 12 nota:brisa gélida
turno3 96 nota:$DOJO_FLAG
turno4 70 nota:vapor caliente
EOF
chown agent:agent ${HOME}/estiramiento.txt`,
  solution: `awk 'NR==1 {mn=$2; mx=$2} NR>1 {if ($2<mn) mn=$2; if ($2>mx) {mx=$2; nota=$3}} END {print mn, mx, nota}' ${HOME}/estiramiento.txt`,
  hints: [
    'Inicializa en la PRIMERA línea (NR==1): mínimo y máximo ya son el valor.',
    'En el resto: if ($2<mn) mn=$2; if ($2>mx) {mx=$2; nota=$3} — guarda TAMBIÉN el dato asociado al max.',
    `awk 'NR==1{mn=$2;mx=$2} NR>1{if($2<mn)mn=$2; if($2>mx){mx=$2; nota=$3}} END{print mn, mx, nota}' estiramiento.txt`,
  ],
  teach: 'La manera clásica de min/max: inicializa en la 1.ª línea, actualiza con ifs en el resto e imprime en END. DOS valores en la misma pasada (una sola lectura del fichero).',
  cheatsheet: [
    { cmd: 'END {print mn, mx}', desc: 'imprimir los DOS acumuladores' },
    { cmd: 'awk -v OFS=", " … print mn, mx', desc: 'salida con separador custom' },
  ],
  keywords: ['awk', 'min', 'max', 'END'],
}));

AWK.push(mk({
  track: 'awk', index: 35, title: 'Índice y lookup', subtitle: 'awk FILENAME: join inflexible de tablas',
  xp: 80, difficulty: 4,
  brief: 'El registro de precios: precios en precios.txt, pedidos en pedidos.txt. AWK une por el valor del índice con el FILENAME que dice DÓNDE estás.',
  goal: 'De pedidos.txt + precios.txt imprime para CADA pedido su ARTÍCULO y su PRECIO (2 campos separados por espacio).',
  setup: () => `arena-prompt "LVL 35" "Awk"
cat > ${HOME}/precios.txt <<EOF
tornillo 12
EOF
cat > ${HOME}/pedidos.txt <<EOF
tornillo 3 $DOJO_FLAG
EOF
chown agent:agent ${HOME}/pedidos.txt ${HOME}/precios.txt`,
  solution: `awk 'FILENAME ~ /precios/ {p[$1]=$2; next} {print $1, p[$1], $3}' ${HOME}/pedidos.txt ${HOME}/precios.txt`,
  hints: [
    'FILENAME es el fichero PROCESADO: la condición FILENAME ~ /precios/ filtra las líneas de precios.',
    'En precios llenas p[$1]=$2; con next saltas; en pedidos imprimes pedido + precio con p[$1] (+ extra).',
    `awk 'FILENAME ~ /precios/ {p[$1]=$2; next} {print $1, p[$1], $3}' pedidos.txt precios.txt`,
  ],
  teach: 'FILENAME selecciona líneas por fichero: el equivalente del join SQL: p[artículo]=precio + print pedido, precio. Ventaja: FILENAME no depende del ORDEN de los ficheros (a diferencia de FNR==NR).',
  cheatsheet: [
    { cmd: "awk 'FILENAME ~ /a/ {…next} FILENAME ~ /b/ {…}' a b", desc: 'select por fichero' },
    { cmd: "awk 'FNR==NR {…}' a a2", desc: 'otro modo de join' },
  ],
  keywords: ['awk', 'FILENAME', 'join'],
}));

AWK.push(mk({
  track: 'awk', index: 36, title: 'Boss: la hora pico', subtitle: 'awkk acumula por franja y END top',
  xp: 140, difficulty: 5,
  brief: 'El registro de tráfico dice «hora endpoint megas». La hora con MÁS tráfico total es la pico. Extrae el VALOR total acumulado de esa hora.',
  goal: 'Imprime de trafico.txt las LÍNEAS de la hora (1.º campo) con MÁS tráfico total (suma del 3.º campo) — la marca viaja en la fila pico.',
  setup: () => `arena-prompt "LVL 36" "Awk"
cat > ${HOME}/trafico.txt <<EOF
08:00 api 120
08:00 web 30
09:00 api 40
10:00 web 300
10:00 api 120 $DOJO_FLAG
09:00 web 50
EOF
chown agent:agent ${HOME}/trafico.txt`,
  solution: `h=$(awk '{t[$1] += $3} END {for (x in t) if (t[x] > m) {m = t[x]; horax = x} print horax}' ${HOME}/trafico.txt); grep "^$h " ${HOME}/trafico.txt`,
  hints: [
    'Suma por HORA: t[$1] += $3; en END guarda el GANADOR (hora) junto al max: horax = x.',
    'El awk imprime la HORA pico (no el número); captúrala en h=$(awk …).',
    'Último paso: grep "^$h " trafico.txt muestra TODAS las líneas de esa hora (la marca incluida).',
    `h=$(awk '{t[$1]+=$3} END {for (x in t) if (t[x] > m) {m = t[x]; horax = x} print horax}' trafico.txt); grep "^$h " trafico.txt`,
  ],
  teach: 'El boss une arrays asociativos, agregación por grupos, el max en END y el «vuelta al log» con grep: suma por grupos (t[$1] += $3), guarda la HORA ganadora (no el número) y después vuelve sobre el fichero con grep ^hora para enseñar las filas completas.',
  cheatsheet: [
    { cmd: 'END {for (k in t) if (t[k] > m) {m = t[k]; ganador = k} print ganador}', desc: 'máximo por clave (guarda la clave, no el valor)' },
    { cmd: 'grep "^$h " f', desc: 'ancla la hora + espacio: solo las filas de esa franja' },
  ],
  keywords: ['awk', 'boss', 'array', 'end', 'log'],
}));

/* ═══════════════════════════════════════════════ sysadmin l19–l28 ══ */
const SYS = [];
const SVC_PRELUDE = '#!/bin/bash\nset -e\ngrep -q " $(hostname)" /etc/hosts 2>/dev/null || echo "127.0.0.1 $(hostname)" >> /etc/hosts\nmkdir -p /run/sshd /run/nginx /run/apache2 /var/dojo 2>/dev/null || true\n';

function svc(level, name, name_es, setupBody, solution, hints, extra) {
  return mk({
    track: 'sysadmin', index: level, profile: 'sudo',
    title: extra.title, subtitle: extra.subtitle,
    xp: extra.xp ?? 70, difficulty: extra.difficulty ?? 4,
    brief: extra.brief, goal: extra.goal,
    setup: SVC_PRELUDE + setupBody + '\nprintf \'%s\\n\' \'$DOJO_FLAG\' > /var/.dojo-hit\nchmod 0644 /var/.dojo-hit\n' + verifier(name, name_es, extra.checks),
    solution, hints, teach: extra.teach,
    cheatsheet: extra.cheatsheet,
    keywords: extra.keywords,
  });
}

SYS.push(svc(19, 'sshd-port', 'puerto y usuarios de SSH controlados',
`mkdir -p /etc/ssh/sshd_config.d
printf '%s\\n' '## nivel sshd-port' > /etc/ssh/sshd_config.d/dojo19.conf
printf '%s\\n' 'UsePAM no' >> /etc/ssh/sshd_config.d/dojo19.conf`,
  'sudo bash -c \'printf "%s\\n" "Port 2222" "AllowUsers agent" "MaxAuthTries 3" >> /etc/ssh/sshd_config.d/dojo19.conf && sshd -t\' && dojo-verificar sshd-port',
  [
    'Las directivas van EN SU LÍNEA dentro del drop-in: una por línea.',
    'sshd -t valida la sintaxis COMO root (los drop-in se leen en orden).',
    'Patrón: sudo bash -c "printf … >> fichero && sshd -t" y luego dojo-verificar sshd-port.',
  ],
  {
    title: 'El puerto secreto',
    subtitle: 'sshd: Port, AllowUsers y MaxAuthTries',
    xp: 75, difficulty: 4,
    brief: 'La política del dojo: SSH en el PUERTO 2222, SOLO el agente conecta y máximo 3 intentos por sesión. Son las directivas de hardening sshd del primer día.',
    goal: 'Añade en /etc/ssh/sshd_config.d/dojo19.conf las directivas Port 2222, AllowUsers agent y MaxAuthTries 3, valida con sudo sshd -t y cierra con dojo-verificar sshd-port.',
    checks: [
      `grep -Eq '^[[:space:]]*Port[[:space:]]+2222[[:space:]]*$' /etc/ssh/sshd_config.d/dojo19.conf || { echo "falta Port 2222"; exit 1; }`,
      `grep -Eq '^[[:space:]]*AllowUsers[[:space:]]+agent[[:space:]]*$' /etc/ssh/sshd_config.d/dojo19.conf || { echo "falta AllowUsers agent"; exit 1; }`,
      `grep -Eq '^[[:space:]]*MaxAuthTries[[:space:]]+3[[:space:]]*$' /etc/ssh/sshd_config.d/dojo19.conf || { echo "falta MaxAuthTries 3"; exit 1; }`,
      `sudo sshd -t 2>&1 || { echo "sshd -t falla"; exit 1; }`,
    ],
    teach: 'Port cambia la escucha (2222 deja de recibir el ruido del escaneo automático del 22), AllowUsers es la lista blanca de QUIÉN puede entrar y MaxAuthTries límita los reintentos por conexión. El trío clásico de hardening sshd.',
    cheatsheet: [
      { cmd: 'sshd -t', desc: 'validar la sintaxis del sshd_config' },
      { cmd: 'Port / AllowUsers / MaxAuthTries', desc: 'durísimo de SSH: puerto, lista blanca, reintentos' },
    ],
    keywords: ['sshd', 'port', 'allowusers', 'hardening'],
  }));

SYS.push(svc(20, 'sshd-key', 'claves SSH del agente e authorized_keys',
`mkdir -p ${HOME}/.ssh && chmod 0700 ${HOME}/.ssh
touch ${HOME}/.ssh/authorized_keys && chmod 0600 ${HOME}/.ssh/authorized_keys
chown -R agent:agent ${HOME}/.ssh`,
  `ssh-keygen -t ed25519 -N '' -f ${HOME}/.ssh/id_ed25519 -C dojo-agent && cat ${HOME}/.ssh/id_ed25519.pub >> ${HOME}/.ssh/authorized_keys && chmod 600 ${HOME}/.ssh/authorized_keys && dojo-verificar sshd-key`,
  [
    'ssh-keygen -t ed25519 genera el par. La .pub es la CLAVE PÚBLICA; la otra es privada.',
    'authorized_keys recibe la .pub: cat id_ed25519.pub >> authorized_keys (una línea por clave).',
    'Los PERMISOS deben ser estrictos: ~/.ssh 0700, authorized_keys 0600. Si no, sshd rechaza.',
  ],
  {
    title: 'La pareja de claves',
    subtitle: 'sshd: ssh-keygen ed25519 + authorized_keys + permisos',
    xp: 80, difficulty: 4,
    brief: 'Para entrar sin contraseña: generas un par ed25519, colocas la CLAVE PÚBLICA en authorized_keys y dejas los permisos celosos. sshd se niega a aceptar configs con permisos flojos.',
    goal: 'Genera un par ed25519 en ~/.ssh/ SIN passphrase, añade la .pub a ~/.ssh/authorized_keys y deja 0700/0600. cierra con dojo-verificar sshd-key.',
    checks: [
      `[ -f /home/agent/.ssh/id_ed25519 ] || { echo "falta el par de claves id_ed25519"; exit 1; }`,
      `[ -s /home/agent/.ssh/id_ed25519.pub ] || { echo "falta la clave pública .pub"; exit 1; }`,
      `grep -q "$(cut -d' ' -f2 /home/agent/.ssh/id_ed25519.pub)" /home/agent/.ssh/authorized_keys || { echo "la .pub no está en authorized_keys"; exit 1; }`,
      `[ "$(stat -c %a /home/agent/.ssh)" = "700" ] || { echo "permisos ~/.ssh deben ser 700"; exit 1; }`,
    ],
    teach: 'La pareja: id_ed25519 (privada, viaja contigo) + id_ed25519.pub (pública, va a authorized_keys de cada máquina a la que entras). Permisos rotos (755 en .ssh) = sshd IGNORA la clave: es una medida de seguridad.',
    cheatsheet: [
      { cmd: "ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_ed25519", desc: 'generar par ed25519 sin passphrase' },
      { cmd: 'cat id.pub >> ~/.ssh/authorized_keys', desc: 'instalar la clave pública' },
    ],
    keywords: ['ssh', 'keygen', 'authorized_keys', 'permisos'],
  }));

SYS.push(svc(21, 'apache-vhost', 'vhost apache con DocumentRoot correcto',
`mkdir -p ${HOME}/www/dojo
echo '<h1>dojo web</h1>' > ${HOME}/www/dojo/index.html
cat > ${HOME}/dojo-vhost.conf <<'EOF'
# vhost del dojo: el DocumentRoot está mal (pension/…)
<VirtualHost *:80>
  ServerName dojo.local
  DocumentRoot pension/www/dojo
  <Directory pension/www/dojo>
    AllowOverride None
    Require all granted
  </Directory>
</VirtualHost>
EOF
chown agent:agent ${HOME}/dojo-vhost.conf`,
  `sed -i 's#pension/www/dojo#/home/agent/www/dojo#g' ${HOME}/dojo-vhost.conf && sudo cp ${HOME}/dojo-vhost.conf /etc/apache2/sites-available/000-dojo.conf && sudo apache2ctl configtest && dojo-verificar apache-vhost`,
  [
    'El root apunta a pension/… que NO existe: el DocumentRoot debe ser /home/agent/www/dojo.',
    'sudo apache2ctl configtest = Syntax OK (parsea el config SIN arrancar puertos).',
    'Sitio instalado: sudo cp a sites-available/000-dojo.conf.',
  ],
  {
    title: 'El sitio del dojo',
    subtitle: 'apache2: VirtualHost, DocumentRoot y configtest',
    xp: 85, difficulty: 4,
    brief: 'El vhost viene con el DocumentRoot malo (pension/…) y ni está instalado. Configura, valida con apache2ctl configtest y déjalo en sites-available.',
    goal: 'Repara el DocumentRoot de /home/agent/dojo-vhost.conf (debe ser /home/agent/www/dojo), instala el fichero en /etc/apache2/sites-available/000-dojo.conf, valida con sudo apache2ctl configtest y cierra con dojo-verificar apache-vhost.',
    checks: [
      `grep -Eq 'DocumentRoot[[:space:]]+/home/agent/www/dojo' /etc/apache2/sites-available/000-dojo.conf || { echo "DocumentRoot malo"; exit 1; }`,
      `sudo apache2ctl configtest 2>&1 | grep -q 'Syntax OK' || { echo "apache2ctl configtest falla"; exit 1; }`,
    ],
    teach: 'Apache sirve ficheros desde DocumentRoot: si apunta a un camino inexistente, el sitio no responde aunque la sintaxis valga. configtest parsea el config y exige «Syntax OK»: la validación correcta antes de enlazar el sitio.',
    cheatsheet: [
      { cmd: 'sudo apache2ctl configtest', desc: 'valida la sintaxis (Syntax OK)' },
      { cmd: 'DocumentRoot /ruta/sitio', desc: 'raíz de ficheros del vhost' },
    ],
    keywords: ['apache', 'vhost', 'documentroot', 'configtest'],
  }));

SYS.push(svc(22, 'nginx-conf', 'nginx: server_name reparado y nginx -t OK',
`mkdir -p ${HOME}/nginx/logs ${HOME}/nginx/html ${HOME}/nginx/tmp
mkdir -p ${HOME}/nginx/tmp/body ${HOME}/nginx/tmp/proxy ${HOME}/nginx/tmp/fastcgi ${HOME}/nginx/tmp/uwsgi ${HOME}/nginx/tmp/scgi
printf '%s\\n' '<h1>dojo</h1>' > ${HOME}/nginx/html/index.html
cat > ${HOME}/nginx/nginx.conf <<'EOF'
pid /home/agent/nginx/logs/nginx.pid;
worker_processes 1;
error_log /home/agent/nginx/logs/error.log;
events { worker_connections 64; }
http {
  access_log /home/agent/nginx/logs/access.log;
  client_body_temp_path /home/agent/nginx/tmp/body;
  proxy_temp_path /home/agent/nginx/tmp/proxy;
  fastcgi_temp_path /home/agent/nginx/tmp/fastcgi;
  uwsgi_temp_path /home/agent/nginx/tmp/uwsgi;
  scgi_temp_path /home/agent/nginx/tmp/scgi;
  server {
    listen 8080;
    servr_name dojo.local;
    location / { root html; index index.html; }
  }
}
EOF
chown -R agent:agent ${HOME}/nginx`,
  `sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf && dojo-verificar nginx-conf`,
  [
    'El typo está en servr_name: nginx exige server_name dentro de cada server { }.',
    'nginx -t -c FICHERO valida un config PROPIO sin tocar /etc/nginx ni arrancar nada.',
    'Si -t falla, te dice el fichero y la LÍNEA exacta del problema.',
  ],
  {
    title: 'El typo de nginx',
    subtitle: 'nginx -t: validar TU config',
    xp: 80, difficulty: 4,
    brief: 'El config trae un typo: servr_name. nginx ni arranca con eso. Encuéntralo, repáralo y valida el fichero PROPIO con nginx -t (sin tocar el del sistema).',
    goal: 'Repara el typo del /home/agent/nginx/nginx.conf (server_name) y valida TU config con nginx -t -c. cierra con dojo-verificar nginx-conf.',
    checks: [
      `grep -q 'server_name' ${HOME}/nginx/nginx.conf || { echo "falta server_name"; exit 1; }`,
      `! grep -q 'servr_name' ${HOME}/nginx/nginx.conf || { echo "aún queda el typo servr_name"; exit 1; }`,
      `nginx -t -c ${HOME}/nginx/nginx.conf 2>&1 | grep -Eq 'syntax is ok|test is successful' || { echo "nginx -t falla"; exit 1; }`,
    ],
    teach: 'nginx -t -c FICHERO prueba la sintaxis de CUALQUIER config (sistema o propio): imprime «syntax is ok / test is successful» o la LÍNEA exacta del fallo. La práctica correcta antes de la recarga real.',
    cheatsheet: [
      { cmd: 'nginx -t -c /ruta/nginx.conf', desc: 'validar config portable' },
      { cmd: 'server_name dominio;', desc: 'nombre del server virtual' },
    ],
    keywords: ['nginx', 'server_name', 'validar', 'configtest'],
  }));

SYS.push(svc(23, 'binarios', 'binarios: install, which, file y chmod 0755',
`cat > ${HOME}/dojo-health <<'EOF'
#!/bin/bash
echo "cpu $(cut -d' ' -f1 /proc/loadavg)"
EOF
chmod 0644 ${HOME}/dojo-health
cat > ${HOME}/tool-lame <<'EOF'
#!/bin/bash
echo lame
EOF
chmod 0644 ${HOME}/tool-lame
chown agent:agent ${HOME}/dojo-health ${HOME}/tool-lame`,
  `sudo install -m 0755 ${HOME}/dojo-health /usr/local/bin/dojo-health && chmod 0755 ${HOME}/tool-lame && which dojo-health >/dev/null && file /usr/local/bin/dojo-health >/dev/null && ${HOME}/tool-lame >/dev/null && /usr/local/bin/dojo-health >/dev/null && dojo-verificar binarios`,
  [
    'Un 0644 NO se ejecuta: falta el bit x. install -m 0755 src dst copia a /usr/local/bin y da los permisos de golpe.',
    'which BINARIO localiza el comando en $PATH; file BINARIO dice el TIPO (ELF, shell script…).',
    'chmod 0755 sobre el fichero de tu HOME lo vuelve ejecutable sin moverlo.',
  ],
  {
    title: 'El binario instalado',
    subtitle: 'binarios: install -m, which, file, chmod 0755',
    xp: 80, difficulty: 4,
    brief: 'Tu script dojo-health nació 0644 (¡ni es ejecutable!) y debe convertirse en un comando real de la PATH. Y tool-lame debe quedar ejecutable en tu HOME. BINARIOS: permisos + rutas + which/file.',
    goal: 'Instala dojo-health en /usr/local/bin con 0755 (sudo install -m 0755), deja ejecutable tool-lame en tu HOME (chmod 0755) y confirma con which/file que EXISTEN y corren. cierra con dojo-verificar binarios.',
    checks: [
      `[ -x /usr/local/bin/dojo-health ] || { echo "dojo-health no se ejecuta: faltan x bits"; exit 1; }`,
      `[ "$(stat -c %a /usr/local/bin/dojo-health)" = "755" ] || { echo "dojo-health debe ser 755"; exit 1; }`,
      `[ -x /home/agent/tool-lame ] || { echo "tool-lame no es ejecutable"; exit 1; }`,
      `/usr/local/bin/dojo-health >/dev/null || { echo "dojo-health falla al ejecutarse"; exit 1; }`,
    ],
    teach: 'La línea entre «fichero» y «comando» son los bits x y el PATH: install -m 0755 copia a /usr/local/bin con permisos de golpe. which localiza el comando en PATH; file identifica el TIPO (ELF, script shell…). chmod 0755 es la alternativa sin mover el fichero.',
    cheatsheet: [
      { cmd: 'install -m 0755 src /usr/local/bin/…', desc: 'instala binario con x bits' },
      { cmd: 'which cmd && file cmd', desc: 'localiza en PATH e identifica' },
    ],
    keywords: ['chmod', 'path', 'binarios', 'install'],
  }));

SYS.push(svc(24, 'service-log', 'logs del servicio: tail + grep + extracción',
`mkdir -p /var/log/dojo
for i in $(seq 1 25); do
  echo "23:$((60-i)) nivel1 línea de servicio sin detalles" >> /var/log/dojo/service.log
done
echo "22:59 warning despistada: marca no esta aquí" >> /var/log/dojo/service.log
echo "23:59 ERROR connection failed: $DOJO_FLAG" >> /var/log/dojo/service.log`,
  `tail -3 /var/log/dojo/service.log | grep 'ERROR connection failed' | grep -oE 'FLAG\\{[^}]*\\}' && dojo-verificar service-log`,
  [
    'tail -3 lee únicamente el FINAL del log: el ERROR reciente está en las 3 últimas líneas.',
    'La línea del ERROR lleva flag={…}: grep ERROR la filtra y grep -oE la extrae limpia.',
    'Pipeline: tail -3 log | grep ERROR | grep -oE "FLAG\\{[^}]*\\}"',
  ],
  {
    title: 'La colada del logger',
    subtitle: 'tail/grep sobre el log real del servicio',
    xp: 70, difficulty: 3,
    brief: 'Los sistemas no sueltan la flag directa: el log del servicio la esconde entre warnings y ERRORs. tail corta el final; grep filtra la línea del ERROR y -oE extrae.',
    goal: 'Extrae de /var/log/dojo/service.log ÚNICAMENTE la FLAG{…} que viaja en la línea ERROR connection failed (está al final del log).',
    checks: [
      `[ -r /var/log/dojo/service.log ] || { echo "sin log: no puedo verificar"; exit 1; }`,
      `tail -3 /var/log/dojo/service.log | grep -q 'ERROR connection failed' || { echo "el ERROR no está en el final del log"; exit 1; }`,
    ],
    teach: 'El baile de logs reales: tail -n (últimas N) | grep PATRÓN | grep -oE EXTRACT. Es la base de journalctl --since y del tail -f en observación continua: primero aislar, luego extraer.',
    cheatsheet: [
      { cmd: 'tail -5 log', desc: 'últimas 5 líneas del log' },
      { cmd: 'tail -c 1024 log', desc: 'últimos 1024 bytes' },
    ],
    keywords: ['tail', 'grep', 'log', 'servicio'],
  }));

SYS.push(svc(25, 'systemd-unit', 'unidad systemd: Restart + WantedBy + enable',
`mkdir -p /etc/systemd/system /etc/systemd/system/multi-user.target.wants
cat > /etc/systemd/system/dojo.service <<EOF
[Unit]
Description=dojo worker
[Service]
ExecStart=/bin/false
EOF`,
  `(printf '\\nRestart=on-failure\\nRestartSec=5\\n\\n[Install]\\nWantedBy=multi-user.target\\n' | sudo tee -a /etc/systemd/system/dojo.service >/dev/null) && sudo ln -sf /etc/systemd/system/dojo.service /etc/systemd/system/multi-user.target.wants/dojo.service && dojo-verificar systemd-unit`,
  [
    'La unidad [Service] ajusta Restart y RestartSec; el bloque [Install] ajusta WantedBy.',
    'systemctl enable CREA el symlink en multi-user.target.wants: aquí lo probamos con ln -sf (equivalente).',
    'Si el config es erróneo, systemd-analyze verify marcaría las líneas con error.',
  ],
  {
    title: 'La unidad bien enrutada',
    subtitle: 'systemd: Restart, WantedBy, enable y symlink',
    xp: 85, difficulty: 4,
    brief: 'La unidad dojo.service está a media configuración: falta Restart on-failure, reinicio a 5s y el [Install] con WantedBy. Y hay que enablearla (symlink en wants).',
    goal: 'Añade a /etc/systemd/system/dojo.service Restart=on-failure y RestartSec=5 en [Service], el bloque [Install] con WantedBy=multi-user.target, y deja el enable: symlink en /etc/systemd/system/multi-user.target.wants/dojo.service. cierra con dojo-verificar systemd-unit.',
    checks: [
      `grep -Eq 'Restart=on-failure' /etc/systemd/system/dojo.service || { echo "falta Restart=on-failure"; exit 1; }`,
      `grep -Eq 'RestartSec=5' /etc/systemd/system/dojo.service || { echo "falta RestartSec=5"; exit 1; }`,
      `grep -Eq 'WantedBy=multi-user.target' /etc/systemd/system/dojo.service || { echo "falta WantedBy=multi-user.target"; exit 1; }`,
      `[ -e /etc/systemd/system/multi-user.target.wants/dojo.service ] || { echo "dojo.service no está enable: falta el symlink"; exit 1; }`,
    ],
    teach: 'Un service con Restart=on-failure + RestartSec=N resucita si cae (política de reintentos). WantedBy en [Install] decide QUÉ targets lo quieren; systemctl enable crea el symlink inverso en multi-user.target.wants — sin eso el servicio NO arranca al boot.',
    cheatsheet: [
      { cmd: 'systemctl enable my.service', desc: 'crea el symlink en wants/*' },
      { cmd: 'Restart=on-failure', desc: 'rearranque del servicio caído' },
    ],
    keywords: ['systemd', 'unit', 'restart', 'enable'],
  }));

SYS.push(svc(26, 'cron-dojo', 'cronjob: línea de /etc/cron.d correcta',
`mkdir -p /etc/cron.d
echo '# fichero vacío del dojo cron' > /etc/cron.d/dojo-backup
touch ${HOME}/backup.sh
chmod 0644 ${HOME}/backup.sh
chown agent:agent ${HOME}/backup.sh`,
  `printf '%s\\n' '5 4 * * * agent /home/agent/backup.sh' | sudo tee /etc/cron.d/dojo-backup >/dev/null && sudo chmod 644 /etc/cron.d/dojo-backup && chmod 755 ${HOME}/backup.sh && dojo-verificar cron-dojo`,
  [
    'El formato de cron: m h dom mon dow comando (en /etc/cron.d ADEMÁS va el usuario tras los 5 campos).',
    'Para este nivel: 04:05, usuario agent, comando /home/agent/backup.sh.',
    'El fichero /etc/cron.d/dojo-backup debe quedar chmod 644 y el script destination ejecutable (0755).',
  ],
  {
    title: 'El backup programado',
    subtitle: 'cron: m h dom mon dow + fichero /etc/cron.d',
    xp: 75, difficulty: 4,
    brief: 'El dojo debe lanzar su backup cada día a las 04:05 como agent. Un fichero en /etc/cron.d con la línea correcta Y los permisos correctos: si el script destino no es ejecutable, cron lo ignora.',
    goal: 'Escribe en /etc/cron.d/dojo-backup la línea 5 4 * * * agent /home/agent/backup.sh, dale chmod 644 y deja el script backup.sh existente y ejecutable. cierra con dojo-verificar cron-dojo.',
    checks: [
      `grep -q '^5 4 \\* \\* \\* agent /home/agent/backup.sh$' /etc/cron.d/dojo-backup || { echo "la línea cron incorrecta"; exit 1; }`,
      `[ "$(stat -c %a /etc/cron.d/dojo-backup)" = "644" ] || { echo "el fichero debe chmod 644"; exit 1; }`,
      `[ -x /home/agent/backup.sh ] || { echo "el script backup.sh no existe o no es ejecutable"; exit 1; }`,
    ],
    teach: 'La línea cron es m h dom mon dow user comando (5 campos de tiempo + usuario en /etc/cron.d). Los ficheros de /etc/cron.d exigen chmod 644 (si hay permisos raros, cron lo ignora). El comando destino DEBE existir y ser ejecutable — si no, cron falla silenciosamente (el error acaba en syslog/mail).',
    cheatsheet: [
      { cmd: 'm h dom mon dow user cmd', desc: 'formato de /etc/cron.d' },
      { cmd: 'chmod 644 /etc/cron.d/job', desc: 'permisos obligatorios' },
    ],
    keywords: ['cron', 'crontab', 'backup'],
  }));

SYS.push(svc(27, 'path-hijack', 'PATH: binario sombra, command -v y hash -r',
`mkdir -p ${HOME}/bin
cat > ${HOME}/bin/nc <<'EOF'
#!/bin/bash
echo nc-sombra
EOF
chmod 0755 ${HOME}/bin/nc
cat > ${HOME}/legit <<'EOF'
#!/bin/bash
echo nc-legitimato
EOF
chmod 0755 ${HOME}/legit`,
  `export PATH="${HOME}/bin:$PATH" && hash -r && command -v nc | grep -q '/home/agent/bin/nc' && sudo install -m 0755 ${HOME}/legit /usr/local/bin/nc-safe && command -v nc-safe | grep -q '/usr/local/bin/nc-safe' && /home/agent/legit | grep -q 'nc-legitimato' && /home/agent/bin/nc | grep -q 'nc-sombra' && dojo-verificar path-hijack`,
  [
    'El nc sombra en /home/agent/bin GANA si esa carpeta va ANTES en PATH (la primera entrada manda).',
    'command -v BINARIO muestra la RUTA REAL que bash ejecutaría: verifica con grep para la ruta sospechosa.',
    'hash -r limpia la caché de binarios del shell (tras mover/instalar binarios, la caché queda rancia).',
  ],
  {
    title: 'El hijo prodigo de PATH',
    subtitle: 'PATH: orden, command -v, hash -r y shadowing',
    xp: 85, difficulty: 5,
    brief: 'Un nc sombra en /home/agent/bin puede secuestrar la PATH si va ANTES: la PRIMERA entrada gana. hash -r refresca la caché de bash; command -v es el método fiable de verificar.',
    goal: 'Monta PATH con ${HOME}/bin delante (export PATH="${HOME}/bin:$PATH"), limpia la caché (hash -r), verifica que nc resuelto por command -v ES el sombra (/home/agent/bin/nc), instala legit como /usr/local/bin/nc-safe (sudo install -m 0755) y comprueba que ejecuta. cierra con dojo-verificar path-hijack.',
    checks: [
      `[ -x /home/agent/bin/nc ] || { echo "no existe la sombra nc en /home/agent/bin"; exit 1; }`,
      `[ -x /home/agent/legit ] || { echo "legit no es ejecutable"; exit 1; }`,
      `[ -x /usr/local/bin/nc-safe ] || { echo "legit no se instaló como /usr/local/bin/nc-safe"; exit 1; }`,
      `/usr/local/bin/nc-safe | grep -q 'nc-legitimato' || { echo "nc-safe no corre bien"; exit 1; }`,
    ],
    teach: 'PATH gana el PRIMERO: si /home/agent/bin precede, tu nc sombra dobla a la shell. bash cachea las rutas de binarios en su tabla hash — hash -r es obligatorio tras mover/instalar comandos, o seguirías ejecutando el VIEJO. command -v es la forma fiable de saber la ruta real.',
    cheatsheet: [
      { cmd: 'command -v cmd', desc: 'ruta REAL que bash ejecutaría' },
      { cmd: 'hash -r', desc: 'limpiar la caché de binarios' },
    ],
    keywords: ['path', 'which', 'command', 'hash', 'shadow'],
  }));

SYS.push(svc(28, 'boss-servizi', 'boss de los servicios: ssh + nginx + systemd + cron + binarios',
`mkdir -p /etc/ssh/sshd_config.d /etc/systemd/system /etc/systemd/system/multi-user.target.wants /etc/cron.d
mkdir -p ${HOME}/nginx/logs ${HOME}/nginx/html ${HOME}/nginx/tmp
mkdir -p ${HOME}/nginx/tmp/body ${HOME}/nginx/tmp/proxy ${HOME}/nginx/tmp/fastcgi ${HOME}/nginx/tmp/uwsgi ${HOME}/nginx/tmp/scgi
mkdir -p ${HOME}/.ssh
printf '%s\\n' '<h1>boss dojo</h1>' > ${HOME}/nginx/html/index.html
cat > ${HOME}/nginx/nginx.conf <<'EOF'
pid /home/agent/nginx/logs/nginx.pid;
worker_processes 1;
error_log /home/agent/nginx/logs/error.log;
events { worker_connections 64; }
http {
  access_log /home/agent/nginx/logs/access.log;
  client_body_temp_path /home/agent/nginx/tmp/body;
  proxy_temp_path /home/agent/nginx/tmp/proxy;
  fastcgi_temp_path /home/agent/nginx/tmp/fastcgi;
  uwsgi_temp_path /home/agent/nginx/tmp/uwsgi;
  scgi_temp_path /home/agent/nginx/tmp/scgi;
  server {
    listen 8081;
    servr_name boss.local;
    location / { root html; index index.html; }
  }
}
EOF
printf '%s\\n' '## boss sshd: Port 2200, AllowUsers agent, MaxAuthTries 2' > /etc/ssh/sshd_config.d/dojo28.conf
printf '%s\\n' 'UsePAM no' >> /etc/ssh/sshd_config.d/dojo28.conf
touch ${HOME}/.ssh/authorized_keys && chmod 0600 ${HOME}/.ssh/authorized_keys
cat > /etc/systemd/system/boss.service <<EOF
[Unit]
Description=dojo boss
[Service]
Type=simple
ExecStart=/bin/true
EOF
echo '# fichero cron vacío del boss' > /etc/cron.d/dojo-backup
cat > ${HOME}/bin-fake <<'EOF'
#!/bin/bash
echo boss-cmd-ok
EOF
chmod 0644 ${HOME}/bin-fake
chown -R agent:agent ${HOME}/nginx ${HOME}/.ssh ${HOME}/bin-fake`,
  `ssh-keygen -t ed25519 -N '' -f ${HOME}/.ssh/id_ed25519 >/dev/null 2>&1 && cat ${HOME}/.ssh/id_ed25519.pub >> ${HOME}/.ssh/authorized_keys && sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && sudo bash -c 'printf "%s\\n" "Port 2200" "AllowUsers agent" "MaxAuthTries 2" >> /etc/ssh/sshd_config.d/dojo28.conf && sshd -t' && printf '\\n[Install]\\nWantedBy=multi-user.target\\n' | sudo tee -a /etc/systemd/system/boss.service >/dev/null && sudo ln -sf /etc/systemd/system/boss.service /etc/systemd/system/multi-user.target.wants/boss.service && printf '%s\\n' '5 4 * * * agent /home/agent/backup.sh' | sudo tee /etc/cron.d/dojo-backup >/dev/null && sudo chmod 644 /etc/cron.d/dojo-backup && sudo install -m 0755 ${HOME}/bin-fake /usr/local/bin/dojo-boss-cmd && nginx -t -c ${HOME}/nginx/nginx.conf && [ -e /etc/systemd/system/multi-user.target.wants/boss.service ] && [ -x /usr/local/bin/dojo-boss-cmd ] && dojo-verificar boss-servizi`,
  [
    'La lista de entregables: id_ed25519 (+ .pub en authorized_keys), nginx -t OK (sin servr_name), sshd -t OK con Port 2200, boss.service enable (symlink en multi-user.target.wants), línea cron 5 4 * * * agent con chmod 644 y binario /usr/local/bin/dojo-boss-cmd con 0755.',
    'Vas uniendo piezas con && (esta tras la otra) o ; (independiente).',
    'El orden recomendado: ssh-keygen → authorized_keys → sed nginx → sshd config → systemd → cron → install binario → validaciones → dojo-verificar.',
  ],
  {
    title: 'La gran carrera de servicios',
    subtitle: 'boss: ssh + nginx + systemd + cron + binarios juntos',
    xp: 160, difficulty: 5,
    brief: 'El boss de la configuración total: claves SSH + puerto, nginx (typo server_name + nginx -t), systemd (WantedBy + enable), cron (línea + chmod) y un binario instalado en /usr/local/bin. TODO junto, TODO validado.',
    goal: 'Genera el par ed25519 (id_ed25519 en authorized_keys), arregla el server_name y que nginx -t pase OK, añade Port 2200 / AllowUsers agent / MaxAuthTries 2 al dojo28.conf con sudo sshd -t OK, deja boss.service enable (symlink en multi-user.target.wants), escribe el cron 5 4 * * * agent /home/agent/backup.sh con chmod 644 y instala bin-fake como /usr/local/bin/dojo-boss-cmd con 0755. cierra con dojo-verificar boss-servizi.',
    checks: [
      `[ -s /home/agent/.ssh/id_ed25519.pub ] || { echo "sin par de claves"; exit 1; }`,
      `grep -q "$(cut -d' ' -f2 /home/agent/.ssh/id_ed25519.pub 2>/dev/null)" /home/agent/.ssh/authorized_keys || { echo "falta la .pub en authorized_keys"; exit 1; }`,
      `! grep -q 'servr_name' /home/agent/nginx/nginx.conf || { echo "queda el typo del server_name"; exit 1; }`,
      `nginx -t -c /home/agent/nginx/nginx.conf 2>&1 | grep -Eq 'syntax is ok|test is successful' || { echo "nginx -t falla"; exit 1; }`,
      `sudo sshd -t 2>&1 || { echo "sshd -t falla: el sshd config NI es válido"; exit 1; }`,
      `grep -Eq '^[[:space:]]*Port[[:space:]]+2200[[:space:]]*$' /etc/ssh/sshd_config.d/dojo28.conf || { echo "falta Port 2200"; exit 1; }`,
      `[ -e /etc/systemd/system/multi-user.target.wants/boss.service ] || { echo "boss.service no está enable"; exit 1; }`,
      `grep -q '^5 4 \\* \\* \\* agent /home/agent/backup.sh$' /etc/cron.d/dojo-backup || { echo "cron del boss incorrecto"; exit 1; }`,
      `[ "$(stat -c %a /etc/cron.d/dojo-backup)" = "644" ] || { echo "cron dentro: chmod 644"; exit 1; }`,
      `[ -x /usr/local/bin/dojo-boss-cmd ] || { echo "el binario no se instaló con 0755"; exit 1; }`,
    ],
    teach: 'El boss pega TODO lo previo en un único entregable: SSH expón claves + puerto, nginx -t valida el config, systemd enable crea el symlink, cron escribe su línea con sus permisos y el binario se instala con install -m 0755 + validaciones. El check final del sysadmin de primer día.',
    cheatsheet: [
      { cmd: 'nginx -t -c … && sudo sshd -t', desc: 'validar los configs antes de activar' },
      { cmd: 'install -m 0755 + ln -sf (enable)', desc: 'instalación + enable' },
    ],
    keywords: ['boss', 'sysadmin', 'servicios', 'ssh', 'nginx', 'systemd'],
  }));

/* ══════════════════════════════════════════════════════ DNS l13–l20 ══ */
const DNS = [];

function dnsLvl({ index, title, subtitle, xp, difficulty, brief, goal, setupBody, solution, hints, teach, cheatsheet, keywords, checks, verifierName, profile }) {
  return mk({
    track: 'dns', index, title, subtitle, xp, difficulty, brief, goal,
    setup: '#!/bin/bash\nset -e\n' + setupBody + '\nprintf \'%s\\n\' \'$DOJO_FLAG\' > /var/.dojo-hit\nchmod 0644 /var/.dojo-hit\n' + verifier(verifierName, title, checks),
    solution, hints, teach, cheatsheet, profile: profile || 'default',
  });
}

DNS.push(dnsLvl({
  index: 13, profile: 'sudo', title: 'El anfitrión jurado', subtitle: '/etc/hosts: mapear hostname → IP',
  xp: 55, difficulty: 2,
  brief: 'El servicio del dojo espera su hostname. Si /etc/hosts no lo resuelve, el daemon confunde su propio nombre: asegúralo en la tabla local.',
  goal: 'Añade a /etc/hosts la línea que mapea dojo.local → 10.0.0.5 y cierra con dojo-verificar dns-hosts.',
  verifierName: 'dns-hosts',
  setupBody: `arena-prompt "LVL 13" "DNS"
grep -q '^127.0.0.1 localhost' /etc/hosts || echo '127.0.0.1 localhost' >> /etc/hosts
printf '%s\\n' 'hosts: files dns' > /etc/nsswitch.conf`,
  solution: `echo "10.0.0.5 dojo.local" | sudo tee -a /etc/hosts && dojo-verificar dns-hosts`,
  hints: [
    'El formato de línea de /etc/hosts es: IP[TAB o espacios]hostname [alias…].',
    'La fila correcta aquí: 10.0.0.5 dojo.local (una sola línea, sin alias).',
    'Con el shell: echo "10.0.0.5 dojo.local" >> /etc/hosts',
  ],
  checks: [
    `grep -qE '^10\\.0\\.0\\.5[[:space:]]+dojo\\.local$' /etc/hosts || { echo "la mapping no está en /etc/hosts"; exit 1; }`,
  ],
  teach: '/etc/hosts es el mapeo manual ANTES del resolver (precedencia files > dns en /etc/nsswitch.conf): una línea por entrada IP hostname. Es la tabla que la libc consulta primero en cada getaddrinfo.',
  cheatsheet: [
    { cmd: 'grep dojo.local /etc/hosts', desc: 'verificar la entrada del hosts' },
    { cmd: 'getent hosts dominio', desc: 'resolver según nsswitch' },
  ],
  keywords: ['dns', 'hosts', 'mapa'],
}));

DNS.push(dnsLvl({
  index: 14, profile: 'sudo', title: 'El badén del resolver', subtitle: '/etc/resolv.conf: nameserver y search',
  xp: 60, difficulty: 3,
  brief: 'El fichero del resolver quedó VACÍO: sin nameserver ni search, getent no resuelve nada. Rellena las dos directivas.',
  goal: 'Reconstruye /etc/resolv.conf con nameserver 10.0.0.6 y search dojo.local (una línea por directiva) y cierra con dojo-verificar dns-resolver.',
  verifierName: 'dns-resolver',
  setupBody: `arena-prompt "LVL 14" "DNS"
printf '%s\\n' '# sin resolver aún' > /etc/resolv.conf`,
  solution: `printf '%s\\n' 'nameserver 10.0.0.6' 'search dojo.local' | sudo tee /etc/resolv.conf && dojo-verificar dns-resolver`,
  hints: [
    'resolv.conf declara nameserver IP (pueden haber varios en orden).',
    'search añade ese dominio cuando el nombre consultado es corto (no FQDN).',
    'Una por línea: «nameserver …» en la 1.ª, «search …» en la 2.ª. sudo tee para escribir en /etc/resolv.conf.',
  ],
  checks: [
    `grep -Eq '^nameserver[[:space:]]+10\\.0\\.0\\.6$' /etc/resolv.conf || { echo "falta nameserver 10.0.0.6"; exit 1; }`,
    `grep -Eq '^search[[:space:]]+dojo\\.local$' /etc/resolv.conf || { echo "falta search dojo.local"; exit 1; }`,
  ],
  teach: '/etc/resolv.conf es la CONFIG del resolver del sistema: nameserver IP (por orden de uso) y search dominio (lo que se añade si el nombre no es FQDN). Es lo que getent, dig y casi todas las herramientas consumen.',
  cheatsheet: [
    { cmd: 'cat /etc/resolv.conf', desc: 'leer el resolver actual' },
    { cmd: 'getent hosts google.com', desc: 'resolver FQDN vía libc' },
  ],
  keywords: ['dns', 'resolver', 'nameserver', 'search'],
}));

DNS.push(dnsLvl({
  index: 15, title: 'La zona con alias', subtitle: 'fichero de zona: A + CNAME (punto final FQDN)',
  xp: 65, difficulty: 3,
  brief: 'La zona de dojo.local tiene el CNAME roto: apunta a un nombre que NO existe. Debe apuntar a web (que sí tiene A) con punto final.',
  goal: 'Repara el CNAME de /home/agent/dojo.local.zone para que apunte a web.dojo.local. (con punto final) y cierra con dojo-verificar dns-zone.',
  verifierName: 'dns-zone',
  setupBody: `arena-prompt "LVL 15" "DNS"
cat > ${HOME}/dojo.local.zone <<'EOF'
web   IN A   10.0.0.11
web2  IN A   10.0.0.12
mail  IN A   10.0.0.13
www   IN CNAME wymarcus2.dojo.local.
EOF
chown agent:agent ${HOME}/dojo.local.zone`,
  solution: `sed -i 's/wymarcus2\\.dojo\\.local\\./web.dojo.local./' ${HOME}/dojo.local.zone && dojo-verificar dns-zone`,
  hints: [
    'Un CNAME debe apuntar a un NOMBRE declarado en la zona: web.dojo.local. ya tiene su A.',
    'El punto FINAL (dojo.local.) marca FQDN: sin punto, la zona expandiría el origen al final.',
    'sed -i de wymarcus2 → web con el punto final INCLUÍDO.',
  ],
  checks: [
    `grep -Eq 'IN[[:space:]]+CNAME[[:space:]]+web\\.dojo\\.local\\.$' ${HOME}/dojo.local.zone || { echo "el CNAME no apunta a web.dojo.local. (FQDN con punto final)"; exit 1; }`,
    `grep -Eq 'IN[[:space:]]+A[[:space:]]+10\\.0\\.0\\.11$' ${HOME}/dojo.local.zone || { echo "falta el A web"; exit 1; }`,
  ],
  teach: 'Un A mapea NOMBRE→IP; un CNAME alias→otro nombre. El punto terminal (dojo.local.) marca FQDN: SIN punto, el nombre es RELATIVO y la zona expande el origen al final. Un CNAME SIEMPRE apunta a un nombre existente (y no coexiste otros registros en el mismo nombre).',
  cheatsheet: [
    { cmd: 'dig +noall +answer dominio', desc: 'leer los A/AAAA del dominio' },
    { cmd: 'grep CNAME zone.txt', desc: 'verificar el alias en la zona' },
  ],
  keywords: ['dns', 'zona', 'cname', 'a'],
}));

DNS.push(dnsLvl({
  index: 16, title: 'El serial del SOA', subtitle: 'SOA: serial +1 y $TTL 300',
  xp: 70, difficulty: 3,
  brief: 'El SOA tiene un serial VIEJO: los servidores secundarios no replican el update. Actualiza a 20260601 y baja el $TTL por defecto a 300 (5 min).',
  goal: 'Actualiza el serial del SOA de /home/agent/dojo.zone a 20260601 y el $TTL inicial a 300. cierra con dojo-verificar dns-soa.',
  verifierName: 'dns-soa',
  setupBody: `arena-prompt "LVL 16" "DNS"
cat > ${HOME}/dojo.zone <<'EOF'
$TTL 3600
@ IN SOA ns1.dojo.local. admin.dojo.local. (
      20260531 ; serial
      3600     ; refresh
      1200     ; retry
      1209600  ; expire
      3600 )   ; minimum
  IN NS ns1.dojo.local.
ns1 IN A 10.0.0.2
EOF
chown agent:agent ${HOME}/dojo.zone`,
  solution: `sed -i 's/20260531/20260601/' ${HOME}/dojo.zone && sed -i 's/\\$TTL 3600/\\$TTL 300/' ${HOME}/dojo.zone && dojo-verificar dns-soa`,
  hints: [
    'El serial SOA es el RELOJ de la REPLICACIÓN: se INCREMENTA en cada update (nunca atrás).',
    'Los tiempos son SEGUNDOS: $TTL 3600 = 1h; $TTL 300 = 5 min.',
    'sed -i en dos pasadas: una para el serial, otra para el $TTL.',
  ],
  checks: [
    `! grep -q '\\$TTL 3600' ${HOME}/dojo.zone && grep -q '\\$TTL 300' ${HOME}/dojo.zone || { echo "el TTL no es 300"; exit 1; }`,
    `grep -q '20260601' ${HOME}/dojo.zone || { echo "falta el serial 20260601"; exit 1; }`,
  ],
  teach: 'El SOA (Start Of Authority) gobierna la zona: el serial es la versión (se incrementa o los secundarios ignoran el update), refresh/retry/expire controlan la recarga por el esclavo y $TTL es el default de cacheo de la zona.',
  cheatsheet: [
    { cmd: 'grep serial zone.txt', desc: 'leer el serial actual' },
    { cmd: 'grep "\\$TTL" zone.txt', desc: 'leer el TTL default' },
  ],
  keywords: ['dns', 'soa', 'serial', 'ttl'],
}));

DNS.push(dnsLvl({
  index: 17, title: 'El correo prioritario', subtitle: 'zona MX + SRV: prioridad y peso',
  xp: 70, difficulty: 4,
  brief: 'La zona necesita los MX con su sintaxis correcta y el SRV del protocolo VoIP del dojo: prioridad, peso, puerto y destino.',
  goal: 'Añade a la zona dos MX (10 mail1.dojo.local., 20 mail2.dojo.local.) y un SRV _sip._tcp hacia sip.dojo.local. en puerto 5060. cierra con dojo-verificar dns-mx.',
  verifierName: 'dns-mx',
  setupBody: `arena-prompt "LVL 17" "DNS"
cat > ${HOME}/dojo.zone <<'EOF'
@ IN NS ns1.dojo.local.
ns1 IN A 10.0.0.2
web IN A 10.0.0.11
EOF
chown agent:agent ${HOME}/dojo.zone`,
  solution: `printf '%s\\n' '@ IN MX 10 mail1.dojo.local.' '@ IN MX 20 mail2.dojo.local.' '_sip._tcp IN SRV 0 5 5060 sip.dojo.local.' >> ${HOME}/dojo.zone && dojo-verificar dns-mx`,
  hints: [
    'MX se declara: nombre IN MX PRIORIDAD host. (prioridad MENOR gana).',
    'SRV: _servicio._proto IN SRV prioridad peso puerto destino. (5 campos).',
    'ORDEN estricto: mail1 (10) y mail2 (20); SRV 5060 → sip.dojo.local.',
  ],
  checks: [
    `grep -Eq 'IN[[:space:]]+MX[[:space:]]+10[[:space:]]+mail1\\.dojo\\.local' ${HOME}/dojo.zone || { echo "falta MX mail1 prioridad 10"; exit 1; }`,
    `grep -Eq 'IN[[:space:]]+MX[[:space:]]+20[[:space:]]+mail2\\.dojo\\.local' ${HOME}/dojo.zone || { echo "falta MX mail2 prioridad 20"; exit 1; }`,
    `grep -Eq '_sip\\._tcp[[:space:]].*5060[[:space:]]+sip\\.dojo' ${HOME}/dojo.zone || { echo "falta el SRV _sip._tcp puerto 5060"; exit 1; }`,
  ],
  teach: 'El MX (Mail Exchange) enruta el correo: prioridad MENOR = más preferente (mail1 10, mail2 20). SRV descubre SERVICIOS: _servicio._proto IN SRV pri peso port target — el estándar de localización para SIP, XMPP y otros.',
  cheatsheet: [
    { cmd: 'dig MX dominio', desc: 'consultar MX de un dominio' },
    { cmd: 'dig SRV _sip._tcp.dom', desc: 'consultar SRV records' },
  ],
  keywords: ['dns', 'mx', 'srv', 'prioridad'],
}));

DNS.push(dnsLvl({
  index: 18, profile: 'sudo', title: 'La pelea de la precedencia', subtitle: 'hosts > dns: nsswitch precedence test',
  xp: 75, difficulty: 4,
  brief: 'getent acepta el resolver EXTERIOR, pero localhost y el alias interno van por /etc/hosts. Comprueba que la PRECEDENCIA respeta (files antes de dns).',
  goal: 'Mete la mapping local en /etc/hosts (127.0.0.1 dojo.internal) y CAMBIA el orden de /etc/nsswitch.conf a «files dns». Verifica con getent hosts y cierra con dojo-verificar dns-gradation.',
  verifierName: 'dns-gradation',
  setupBody: `arena-prompt "LVL 18" "DNS"
printf '%s\\n' 'hosts: dns files' > /etc/nsswitch.conf`,
  solution: `printf '%s\\n' '127.0.0.1 dojo.internal' | sudo tee -a /etc/hosts && sudo sed -i 's/hosts: *dns *files/hosts: files dns/' /etc/nsswitch.conf && getent hosts dojo.internal && dojo-verificar dns-gradation`,
  hints: [
    'En /etc/nsswitch.conf, la línea hosts define el ORDEN de resolución.',
    'files = los ficheros locales (hosts); dns = el resolver.',
    'Con sudo sed -i de la línea hosts: first files, después dns (y sudo tee -a para el /etc/hosts).',
  ],
  checks: [
    `grep -qE '^127\\.0\\.0\\.1[[:space:]]+dojo\\.internal$' /etc/hosts || { echo "mapping no está"; exit 1; }`,
    `grep -Eq '^hosts:[[:space:]]+files[[:space:]]+dns' /etc/nsswitch.conf || { echo "nsswitch no está files primero"; exit 1; }`,
  ],
  teach: '/etc/nsswitch.conf hosts: files dns define la CADENA de resolución: 1) los ficheros locales (/etc/hosts), 2) dns el resolver. Con files de primero, los nombres internos se resuelven SIN tocar el DNS externo — el patrón de los sistemas reales.',
  cheatsheet: [
    { cmd: 'cat /etc/nsswitch.conf', desc: 'leer el orden de resolución' },
    { cmd: 'grep -n "dojo" /etc/hosts', desc: 'buscar mappings manual' },
  ],
  keywords: ['dns', 'nsswitch', 'precedencia', 'hosts'],
}));

DNS.push(dnsLvl({
  index: 19, title: 'La zona del revés', subtitle: 'PTR: IP → nombre con $ORIGIN in-addr.arpa',
  xp: 75, difficulty: 4,
  brief: 'El auditor pide la ZONA INVERSA: un PTR que diga IP→nombre. Añade el PTR de la IP 10.0.0.11 apuntando a web.dojo.local. dentro del $ORIGIN inverso.',
  goal: 'Añade a /home/agent/dojo.inversa.zone el PTR: 11 IN PTR web.dojo.local. (en la $ORIGIN 11.0.10.in-addr.arpa. correcta). Cierra con dojo-verificar dns-ptr.',
  verifierName: 'dns-ptr',
  setupBody: `arena-prompt "LVL 19" "DNS"
cat > ${HOME}/dojo.inversa.zone <<'EOF'
$ORIGIN 11.0.10.in-addr.arpa.
$TTL 300
@ IN SOA ns1.dojo.local. admin.dojo.local. (
        20260601 ; serial
        300      ; refresh
        120      ; retry
        86400    ; expire
        300 )    ; minimum
  IN NS ns1.dojo.local.
2 IN PTR ns1.dojo.local.
EOF
chown agent:agent ${HOME}/dojo.inversa.zone`,
  solution: `printf '%s\\n' '11 IN PTR web.dojo.local.' >> ${HOME}/dojo.inversa.zone && dojo-verificar dns-ptr`,
  hints: [
    'La zona inversa usa in-addr.arpa: la IP se escribe AL REVÉS (10.0.0.11 → 11.0.10.in-addr.arpa).',
    'El PTR declara el ÚLTIMO octeto: «11 IN PTR nombre_fqdn.».',
    'Append con printf: la línea al final del fichero, respetando el punto final.',
  ],
  checks: [
    `grep -Eq '^11[[:space:]]+IN[[:space:]]+PTR[[:space:]]+web\\.dojo\\.local\\.$' ${HOME}/dojo.inversa.zone || { echo "falta el PTR 11 → web.dojo.local."; exit 1; }`,
  ],
  teach: 'La zona INVERSA en in-addr.arpa resuelve IP→nombre con PTR. El ORIGIN inverso: 11.0.10.in-addr.arpa. es para la IP 10.0.0.11 (¡la IP se escribe AL REVÉS!). El PTR lo miran el correo (anti-spam) y las validaciones de llegada.',
  cheatsheet: [
    { cmd: 'dig -x 10.0.0.11', desc: 'consulta inversa (PTR)' },
    { cmd: 'grep PTR zone.rev', desc: 'leer los PTR del fichero inverso' },
  ],
  keywords: ['dns', 'ptr', 'inversa', 'inaddr'],
}));

DNS.push(dnsLvl({
  index: 20, profile: 'sudo', title: 'Boss: el DNS completo', subtitle: 'hosts + resolver + zona (serial + A)',
  xp: 150, difficulty: 5,
  brief: 'El boss DNS: prepara la máquina para resolver el dominio del dojo SIN servidor real: hosts + resolv.conf + la zona con serial nuevo y su A.',
  goal: 'Configura /etc/hosts (127.0.0.1 dojo.local), /etc/resolv.conf (nameserver 127.0.0.53, search dojo.local), sube el serial de /home/agent/dojo.completa a ≥ 20260601 y añade el registro web IN A 10.0.0.99. cierra con dojo-verificar dns-boss.',
  verifierName: 'dns-boss',
  setupBody: `arena-prompt "LVL 20" "DNS"
printf '%s\\n' 'nameserver 8.8.8.8' > /etc/resolv.conf
cat > ${HOME}/dojo.completa <<'EOF'
$TTL 3600
@ IN SOA ns1.dojo.local. admin.dojo.local. (
      20260531 ; serial
      3600     ; refresh
      1200     ; retry
      1209600  ; expire
      3600 )   ; minimum
  IN NS ns1.dojo.local.
ns1 IN A 127.0.0.53
EOF
chown agent:agent ${HOME}/dojo.completa`,
  solution: `printf '%s\\n' '127.0.0.1 dojo.local' | sudo tee -a /etc/hosts && printf '%s\\n' 'nameserver 127.0.0.53' 'search dojo.local' | sudo tee /etc/resolv.conf && sed -i 's/20260531/20260602/' ${HOME}/dojo.completa && printf '%s\\n' 'web IN A 10.0.0.99' >> ${HOME}/dojo.completa && dojo-verificar dns-boss`,
  hints: [
    'Tres parejas: hosts (127.0.0.1 dojo.local), resolv.conf (nameserver + search) y la zona (serial + A web).',
    'El hosts exige la líneas EXACTA 127.0.0.1 dojo.local (agregar con >>).',
    'El resolv.conf completo SOBREESCRIBE: nameserver 127.0.0.53 + search dojo.local (2 líneas).',
  ],
  checks: [
    `grep -qE '^127\\.0\\.0\\.1[[:space:]]+dojo\\.local$' /etc/hosts || { echo "mapping dojo.local no está en /etc/hosts"; exit 1; }`,
    `grep -Eq '^nameserver[[:space:]]+127\\.0\\.0\\.53$' /etc/resolv.conf || { echo "falta nameserver 127.0.0.53"; exit 1; }`,
    `grep -Eq '^search[[:space:]]+dojo\\.local$' /etc/resolv.conf || { echo "falta search dojo.local"; exit 1; }`,
    `awk '/2026/{if ($1+0 >= 20260601) ok=1} END {exit ok ? 0 : 1}' ${HOME}/dojo.completa || { echo "serial bajo (>= 20260601)"; exit 1; }`,
    `grep -Eq 'IN[[:space:]]+A[[:space:]]+10\\.0\\.0\\.99$' ${HOME}/dojo.completa || { echo "falta el A web en la zona"; exit 1; }`,
  ],
  teach: 'El DNS ES una CADENA: hosts (mapeos locales) → resolv.conf (a quién pregunta) → zona (el fichero autoritativo con SOA/serial) → inversa (PTR). El boss une la cadena completa. Las consultas se resuelven en el orden del nsswitch: local antes que remoto.',
  cheatsheet: [
    { cmd: 'getent hosts dojo.local', desc: 'verificar el lookup final' },
    { cmd: 'grep -n "dojo" /etc/hosts /etc/resolv.conf', desc: 'auditar el estado dns' },
  ],
  keywords: ['dns', 'boss', 'hosts', 'resolver', 'zona'],
}));

/* ══════════════════════════════════════════════════════ SQL l17–l22 ══ */
const SQL = [];

SQL.push(mk({
  track: 'sql', index: 17, title: 'Sub consultas y sello', subtitle: 'SELECT con IN (SELECT …)',
  xp: 95, difficulty: 4,
  brief: 'La misión «fallo» embarca un agente: la marca viaja en su SELLO. La subconsulta con IN filtra en dos pasos sin JOIN explícito.',
  goal: 'De agentess, imprime el SELLO (con la marca) de los agentes que TENGAN misión con tarea fallo (IN con SELECT interno).',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
CREATE TABLE misiones (id INTEGER PRIMARY KEY, agente_id INT, tarea TEXT);
INSERT INTO agentess VALUES (1,'xarevena','plata'),(2,'kira','$DOJO_FLAG'),(3,'miki','bronce');
INSERT INTO misiones VALUES (1,2,'fallo'),(2,1,'reparto'),(3,3,'ronda');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT sello FROM agentess WHERE id IN (SELECT agente_id FROM misiones WHERE tarea='fallo');"`,
  hints: [
    'Subquery: SELECT con IN (SELECT agente_id FROM misiones WHERE …).',
    'La tarea fallo pertenece al agente_id 2 — su sello es ORO.',
    'Una línea: sqlite3 db "SELECT …" imprime la cadena.',
  ],
  teach: 'IN (SELECT …) filtra con la lista de otra consulta: cuando buscas UNA familia (los agentes de la misión fallo), a veces un IN es MÁS claro que el JOIN explícito. Escalar (= (SELECT…)) trae 1 fila; IN trae MUCHAS.',
  cheatsheet: [
    { cmd: 'WHERE id IN (SELECT id FROM t)', desc: 'subconsulta con IN' },
    { cmd: 'WHERE id = (SELECT magic)', desc: 'escalar: solo una fila' },
  ],
  keywords: ['sql', 'subconsulta', 'in', 'select'],
}));

SQL.push(mk({
  track: 'sql', index: 18, title: 'CASE el sello cambia', subtitle: 'CASE WHEN THEN ELSE END en SELECT',
  xp: 95, difficulty: 4,
  brief: 'La DB tiene rangos: CASE transforma datos por reglas (ORO → elite, plata → soldado, resto → aprendiz) al vuelo. La marca viaja en el SELLO de sara: sácalo con un segundo SELECT.',
  goal: 'Del agente sara: SELECT con CASE que lo clasifique (elite/soldado/aprendiz) y después SU SELLO crudo con otro SELECT (la marca viaja ahí).',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
INSERT INTO agentess VALUES (1,'raul','plata'),(2,'sara','$DOJO_FLAG'),(3,'lilo','bronce');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT CASE WHEN sello='ORO' THEN 'elite' WHEN sello='plata' THEN 'soldado' ELSE 'aprendiz' END FROM agentess WHERE nombre='sara';" && sqlite3 ${HOME}/dojo.sqlite "SELECT sello FROM agentess WHERE nombre='sara';"`,
  hints: [
    'CASE WHEN cond THEN val [WHEN …] ELSE val END — la evaluación es secuencial.',
    'El WHERE filtra a sara antes de evaluar el CASE.',
    'El segundo SELECT (mismo WHERE) imprime su sello crudo: la marca del dojo.',
  ],
  teach: 'CASE WHEN … THEN … [ELSE] END evalúa secuencialmente (la PRIMERA condición que dispara gana). CASE es el IF de SQL: en SELECT, ORDER BY o GROUP BY encienden reportes con categorías. El dato crudo sale con un segundo SELECT.',
  cheatsheet: [
    { cmd: 'CASE WHEN x THEN a ELSE b END', desc: 'transforma según condición' },
    { cmd: "SELECT CASE WHEN cnt>5 THEN 'alto'", desc: 'agrega por valor' },
  ],
  keywords: ['sql', 'case', 'when'],
}));

SQL.push(mk({
  track: 'sql', index: 19, title: 'Grupos puntillosos', subtitle: 'agrupar con GROUP BY + HAVING',
  xp: 100, difficulty: 4,
  brief: 'El reporte misiones por agente: los que TENGAN 2 o más son los importantes. HAVING filtra por agregado; el SELLO de esos agentes se baja con una subconsulta IN.',
  goal: 'Devuelve el SELLO (con la marca) de los agentes que tienen ≥ 2 misiones: GROUP BY + HAVING COUNT(*) >= 2 dentro de un IN, apoyado por la tabla agentess.',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
CREATE TABLE misiones (id INTEGER PRIMARY KEY, agente_id INT, tarea TEXT);
INSERT INTO agentess VALUES (1,'xate','$DOJO_FLAG'),(2,'xai','bronce'),(3,'xii','plata');
INSERT INTO misiones VALUES (1,1,'espia'),(2,1,'robo'),(3,2,'vigilancia'),(4,3,'caza'),(5,1,'espia');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT sello FROM agentess WHERE id IN (SELECT agente_id FROM misiones GROUP BY agente_id HAVING COUNT(*) >= 2);"`,
  hints: [
    'GROUP BY agrupa y HAVING es el WHERE del GRUPO (filtra por COUNT, SUM…).',
    'El GROUP BY vive DENTRO de la subconsulta IN; el SELECT exterior baja el sello de agentess.',
    `sqlite3 dojo.sqlite "SELECT sello FROM agentess WHERE id IN (SELECT agente_id FROM misiones GROUP BY agente_id HAVING COUNT(*) >= 2);"`,
  ],
  teach: 'WHERE filtra filas ANTES de agrupar; HAVING es el WHERE del GROUP BY (filtra por agregados). El patrón: GROUP BY + COUNT + HAVING dentro de una subconsulta IN para bajar datos de otra tabla. La herramienta de los reportes reales.',
  cheatsheet: [
    { cmd: 'GROUP BY x HAVING COUNT > 1', desc: 'filtrar por grupos' },
    { cmd: 'ORDER BY cnt DESC LIMIT 3', desc: 'top-3 por grupo' },
  ],
  keywords: ['sql', 'group by', 'having', 'count'],
}));

SQL.push(mk({
  track: 'sql', index: 20, title: 'El sello se re-escribe', subtitle: 'UPDATE … WHERE: corregir fila exacta',
  xp: 100, difficulty: 4,
  brief: 'El agente 3 se grada: UPDATE su sello a ORO — CON WHERE (sin WHERE actualiza TODA la tabla, trágico).',
  goal: 'UPDATE agentess: el agente con id=3 pasa a sello ORO (imprescindible WHERE). Después imprime nombre y sello de TODAS las filas para confirmar (la marca viaja en una de ellas).',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
INSERT INTO agentess VALUES (1,'xate','plata'),(2,'xai','$DOJO_FLAG'),(3,'xii','bronce');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "UPDATE agentess SET sello='ORO' WHERE id=3;" && sqlite3 ${HOME}/dojo.sqlite "SELECT nombre, sello FROM agentess;"`,
  hints: [
    'UPDATE tabla SET col=valor WHERE id=3 — SIN WHERE CAMBIA TODA LA TABLA.',
    'SET es la asignación; WHERE es el filtro de la fila (solo id=3).',
    'El SELECT final (nombre, sello de TODAS las filas) confirma el resultado: ahí viaja la marca.',
  ],
  teach: 'UPDATE es DML: sin WHERE REESCRIBE TODA LA TABLA (error clásico de bases de datos reales). La prática: UPDATE … WHERE + SELECT de confirmación. En producción se envuelven en transacciones (BEGIN … COMMIT).',
  cheatsheet: [
    { cmd: 'UPDATE t SET v=1 WHERE id=3', desc: 'UPDATE de una fila exacta' },
    { cmd: 'BEGIN; UPDATE; COMMIT;', desc: 'transacción + confirmar' },
  ],
  keywords: ['sql', 'update', 'where', 'dml'],
}));

SQL.push(mk({
  track: 'sql', index: 21, title: 'INSERT SELECT del sello', subtitle: 'INSERT INTO tbl SELECT: copiar filas',
  xp: 105, difficulty: 4,
  brief: 'La migración de los ORO: para CADA agente con sello ORO, inserta su fila en la tabla promot. INSERT … SELECT es el SELECT de DML.',
  goal: 'INSERT INTO promot (id, nombre) SELECT id, nombre FROM agentess WHERE sello = ORO; y luego imprime TODAS las filas de promot (la marca viaja en un nombre).',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
CREATE TABLE promot (id INTEGER PRIMARY KEY, nombre TEXT);
INSERT INTO agentess VALUES (1,'ll','plata'),(2,'$DOJO_FLAG','ORO'),(3,'uu','ORO');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "INSERT INTO promot (id, nombre) SELECT id, nombre FROM agentess WHERE sello='ORO';" && sqlite3 ${HOME}/dojo.sqlite "SELECT * FROM promot;"`,
  hints: [
    'INSERT INTO target … SELECT … FROM source, sin VALUES (directo a la SELECT).',
    'La tabla target debe tener las columnas IGUALES que la SELECT (id, nombre).',
    'El SELECT final sobre promot muestra las filas migradas: ahí viaja la marca.',
  ],
  teach: 'INSERT … SELECT es la transferencia de FILAS: filtra la origen (WHERE), da forma a las columnas (SELECT col1, col2) e inserta en bloque. Para migraciones/copys es LA manera limpia (sin bucles, sin el API).',
  cheatsheet: [
    { cmd: 'INSERT INTO t1 SELECT … FROM t2', desc: 'INSERT desde SELECT (sin VALUES)' },
    { cmd: 'SELECT COUNT(*) FROM t1', desc: 'verificar filas añadidas' },
  ],
  keywords: ['sql', 'insert', 'select', 'migración'],
}));

SQL.push(mk({
  track: 'sql', index: 22, title: 'Boss LEFT JOIN y NULLs', subtitle: 'LEFT JOIN + IS NULL: anti-join defensivo',
  xp: 170, difficulty: 5,
  brief: 'El cheque final: si un agente está CREADO pero NO tiene misiones, es un sospechoso vacío. LEFT JOIN + IS NULL los revela (y sus nombres esconden la marca).',
  goal: 'De agentess: imprime nombre y sello (la marca viaja en el sello) de los agentes que NO tienen ninguna misión (LEFT JOIN misiones + IS NULL).',
  setup: () => `sqlite3 ${HOME}/dojo.sqlite "
CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT);
CREATE TABLE misiones (id INTEGER PRIMARY KEY, agente_id INT);
INSERT INTO agentess VALUES (1,'con','ORO'),(2,'dd','$DOJO_FLAG'),(3,'jj','ORO');
INSERT INTO misiones VALUES (1,1);" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
  solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT a.nombre, a.sello FROM agentess a LEFT JOIN misiones m ON m.agente_id = a.id WHERE m.agente_id IS NULL;"`,
  hints: [
    'LEFT JOIN conserva TODAS las del lado izquierdo: sin par, las columnas del lado derecho van NULL.',
    'ON m.agente_id = a.id es la clave del join: WHERE m.agente_id IS NULL atrapa las NO-matched.',
    'SELECT a.nombre, a.sello — el anti-join devuelve las filas huérfanas y SU sello.',
    'SELECT a.nombre, a.sello FROM agentess a LEFT JOIN misiones m ON m.agente_id=a.id WHERE m.agente_id IS NULL;',
  ],
  teach: 'LEFT JOIN produce filas sin par con columnas del lado derecho en NULL: la WHERE m.col IS NULL atrapa las SIN par (el «LEFT ANTI JOIN»). Es LA técnica de «¿quién no fue?, ¿qué no está asignado?»: la pregunta del debugging SQL real.',
  cheatsheet: [
    { cmd: 'LEFT JOIN t2 ON t1.id=t2.id WHERE t2.id IS NULL', desc: 'LEFT anti join' },
    { cmd: 'COUNT(t2.id)', desc: 'cuenta las filas del join (0 si vacío)' },
  ],
  keywords: ['sql', 'boss', 'left join', 'null'],
}));

/* ══════════════════════════════════════════════════════ VOLCADO ══ */
function emit(track, defs) {
  const dir = path.join(repoRoot, 'levels', track);
  fs.mkdirSync(dir, { recursive: true });
  let added = 0;
  for (const lv of defs) {
    const file = path.join(dir, `l${lv.index}.yaml`);
    if (fs.existsSync(file)) console.log(`→ ${track}/l${lv.index}.yaml ya existía: SOBREESCRITO (revisión)`);
    fs.writeFileSync(file, YAML.stringify(lv, { lineWidth: 100 }));
    added++;
  }
  console.log(`${track}: ${added} nivel(es) escritos → levels/${track}/`);
}

emit('grep', GREP);
emit('awk', AWK);
emit('sysadmin', SYS);
emit('dns', DNS);
emit('sql', SQL);
console.log('listo: ronda 4 de niveles (54 niveles).');
