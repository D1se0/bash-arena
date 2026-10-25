/*
 * gen-expansion-ext — EXTENSIÓN de los tracks grep y awk:
 *   · grep: 12 niveles nuevos (l15..l26): contexto -A/-B/-C, -m, -oE para
 *     extraer tokens, -h recursivo, --exclude, -w, multi -e, head/tail+grep,
 *     sort|uniq -c y boss de triple cadena.
 *   · awk: 12 niveles nuevos (l15..l26): NF, $NF, sub por campo, FS/OFS,
 *     rangos /a/,/b/, join NR==FNR, length($0), printf ancho, split(),
 *     getline+pipe, tolower, y boss de doble filtro numérico+cadena.
 * Contrato del motor (scripts/test-levels.mjs):
 *   · setup contiene $DOJO_FLAG (se sustituye por la flag del test).
 *   · la solución NO menciona $DOJO_FLAG e imprime la flag por stdout (exit 0).
 *   · hints ≥ 2 · cheatsheet · teach · keywords · profile · examples.
 * Regenerar: node scripts/gen-expansion-ext.mjs  (determinista)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const HOME = '/home/agent';

/* ═══════════════════════════════════════════════════════════════════ GREP ══ */
const GREP = [
  {
    track: 'grep', index: 15, title: 'Lo que viene después', subtitle: 'grep -A: contexto posterior',
    xp: 70, difficulty: 4,
    brief: 'El log del análisis guarda la ALERTA y, en la línea SIGUIENTE, la causa raíz. El diagnóstico vive en la línea de abajo.',
    goal: 'De alerta.log imprime la línea que contiene ALERTA y, además, la línea INMEDIATAMENTE POSTERIOR (1 línea de contexto posterior con -A).',
    setup: () => `
cat > ${HOME}/alerta.log <<EOF
recopilación de los datos del sondeo
ALERTA: checksum inválido en el nodo 3
causa raíz detectada: ${'$'}DOJO_FLAG
la máquina vuelve a operar con normalidad
EOF
chown agent:agent ${HOME}/alerta.log`,
    solution: `grep -A 1 'ALERTA' ${HOME}/alerta.log`,
    hints: [
      '-A N imprime cada match y las N líneas que le SIGUEN (A de after).',
      'Aquí la flag no está en la línea del match, sino en la de abajo: por eso piden contexto posterior.',
      `grep -A 1 'ALERTA' ${HOME}/alerta.log`,
    ],
    teach: 'grep -A N añade N líneas posteriores al match: el patrón clásico para logs tipo detalle/causa, donde lo importante VA DESPUÉS del identificador del evento.',
    cheatsheet: [
      { cmd: 'grep -A 1 pat f', desc: 'match + 1 línea siguiente' },
      { cmd: 'grep -B 2 pat f', desc: 'match + 2 líneas previas' },
    ],
    keywords: ['grep', '-A', 'contexto', 'after'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'ALERTA: checksum inválido…\ncausa raíz detectada: FLAG{…}' }],
  },
  {
    track: 'grep', index: 16, title: 'Lo que precedió', subtitle: 'grep -B: contexto anterior',
    xp: 70, difficulty: 4,
    brief: 'El log incide: el FALLO es el evento; lo que lo PRODUJO está dos líneas por encima.',
    goal: 'De falla.log imprime la línea FALLO y las DOS líneas ANTERIORES (2 líneas de contexto previo con -B).',
    setup: () => `
cat > ${HOME}/falla.log <<EOF
14:01 tráfico anómalo: ${'$'}DOJO_FLAG
14:02 los umbrales se reevaluaron
14:03 FALLO: bloqueo de la sesión aplicado
14:04 todo vuelve a la normalidad
EOF
chown agent:agent ${HOME}/falla.log`,
    solution: `grep -B 2 'FALLO' ${HOME}/falla.log`,
    hints: [
      '-B N imprime cada match y las N líneas que lo PRECEDEN (B de before).',
      'La flag está dos líneas POR ENCIMA del match: necesitas mirar hacia atrás.',
      `grep -B 2 'FALLO' ${HOME}/falla.log`,
    ],
    teach: 'El diagnóstico de logs casi siempre mira atrás: -B N muestra "qué produjo esto". Con -A y -B en el mismo grep ves la banda completa a tu medida.',
    cheatsheet: [
      { cmd: 'grep -B 2 pat f', desc: '2 líneas antes + match' },
      { cmd: 'grep -A 2 -B 1 pat f', desc: 'banda asimétrica' },
    ],
    keywords: ['grep', '-B', 'contexto', 'before'],
    examples: [{ title: 'salida esperada (flag demo)', content: '14:01 tráfico anómalo: FLAG{…}\n14:02 los umbrales…\n14:03 FALLO: bloqueo…' }],
  },
  {
    track: 'grep', index: 17, title: 'La escena completa', subtitle: 'grep -C: contexto simétrico',
    xp: 70, difficulty: 4,
    brief: 'El evento CRITICA solo se entiende con DOS líneas de contexto a cada lado: la cinta entera.',
    goal: 'De critica.log imprime la línea del evento CRITICA con DOS líneas de contexto POR ENCIMA y POR DEBAJO.',
    setup: () => `
cat > ${HOME}/critica.log <<EOF
guardia abierta a las 22:00
escaneo programado de la subred
CRITICA: saturación de conexiones simuladas
la señal de interés: ${'$'}DOJO_FLAG
cierre de guardia a las 04:00
EOF
chown agent:agent ${HOME}/critica.log`,
    solution: `grep -C 2 'CRITICA' ${HOME}/critica.log`,
    hints: [
      '-C N equivale a -A N -B N en una sola opción (C de context).',
      'El match está en medio: la ventana ±2 cubre la línea de la flag.',
      `grep -C 2 'CRITICA' ${HOME}/critica.log`,
    ],
    teach: '-C N envuelve el match con N líneas a cada lado. Es el "muéstrame la escena" de producción; combina con -n para llevar los números de línea al informe.',
    cheatsheet: [
      { cmd: 'grep -C 2 pat f', desc: '2 antes + match + 2 después' },
      { cmd: 'grep -C 2n pat f', desc: 'idem con números de línea' },
    ],
    keywords: ['grep', '-C', 'contexto'],
    examples: [{ title: 'salida esperada (flag demo)', content: '2 antes + CRITICA + 2 después (aquí viaja la flag)' }],
  },
  {
    track: 'grep', index: 18, title: 'Solo la primera onda', subtitle: 'grep -m: corte tras el primer match',
    xp: 70, difficulty: 4,
    brief: 'El log de beacons repite la señal cada segundo. Para el diagnóstico vale SOLO LA PRIMERA, y ahí va la firma del nivel.',
    goal: 'De beacon.log imprime únicamente la PRIMERA línea que contenga BEACON.',
    setup: () => `
cat > ${HOME}/beacon.log <<EOF
t=001 BEACON: pulso firme y la firma: ${'$'}DOJO_FLAG
t=002 BEACON repetición obligatoria
t=003 BEACON repetición obligatoria
t=004 BEACON silencio confirmado
EOF
chown agent:agent ${HOME}/beacon.log`,
    solution: `grep -m 1 'BEACON' ${HOME}/beacon.log`,
    hints: [
      '-m N detiene la lectura del fichero cuando ya acumuló N matches.',
      'Con -m 1 el resto del fichero NO se escanea: es una ganancia real de rendimiento.',
      `grep -m 1 'BEACON' ${HOME}/beacon.log`,
    ],
    teach: 'grep -m N es el límite de coincidencias por fichero. En logs enormes y repetitivos, -m 1 imprime el primer hallazgo y para de leer.',
    cheatsheet: [
      { cmd: 'grep -m 1 pat f', desc: 'solo el primer match' },
      { cmd: 'grep -m 5 pat f', desc: 'los primeros 5' },
    ],
    keywords: ['grep', '-m', 'límite', 'rendimiento'],
    examples: [{ title: 'salida esperada (flag demo)', content: 't=001 BEACON: pulso firme y la firma: FLAG{…}' }],
  },
  {
    track: 'grep', index: 19, title: 'El token que viaja', subtitle: 'grep -oE: extracción con clase',
    xp: 75, difficulty: 5,
    brief: 'Cada línea del registro envía un campo token=… entre más texto. En UNA de ellas viaja la firma; el resto son sesiones de decoración.',
    goal: 'De envios.log extrae SOLO los fragmentos token=VALOR (el valor completo, sin el resto de la línea) con -oE.',
    setup: () => `
cat > ${HOME}/envios.log <<EOF
envío normal: sess=abc123 fin del registro
paquete del dojo: token=${'$'}DOJO_FLAG fin
decoración de relleno: auth=deadbeef fin
EOF
chown agent:agent ${HOME}/envios.log`,
    solution: `grep -oE 'token=\\S+' ${HOME}/envios.log`,
    hints: [
      '-o imprime SOLO la parte casada (no toda la línea).',
      '\\S+ casa uno o más caracteres que NO son espacio: agarra el valor completo del token.',
      `grep -oE 'token=\\S+' ${HOME}/envios.log`,
    ],
    teach: 'Combinar -o con -E convierte a grep en un EXTRACTOR: cada coincidencia sale limpia en su propia línea. Es el primer paso del pipeline de cualquier integración de logs.',
    cheatsheet: [
      { cmd: "grep -oE 'token=\\S+' f", desc: 'extrae solo el match' },
      { cmd: "grep -oE '[0-9]{4}-[0-9]{2}' f", desc: 'extractor de fechas parciales' },
    ],
    keywords: ['grep', '-oE', 'extracción', 'token'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'token=FLAG{…}' }],
  },
  {
    track: 'grep', index: 20, title: 'El árbol sin rutas', subtitle: 'grep -rh: recursivo sin nombres',
    xp: 75, difficulty: 4,
    brief: 'En el árbol sondas/ hay ficheros con líneas PING. Para el informe TARDA menos ignorar el nombre del fichero: solo importan los datos.',
    goal: 'Del árbol sondas/ imprime SOLO el CONTENIDO de las líneas que contengan PING (sin el prefijo nombre-fichero: que añade -r).',
    setup: () => `
mkdir -p ${HOME}/sondas/octubre
echo 'PING: señal del nivel: ${'$'}DOJO_FLAG' > ${HOME}/sondas/nodo-a.log
echo 'PING: latencia 2ms' > ${HOME}/sondas/nodo-b.log
echo 'PING sin señal: línea de mantenimiento' > ${HOME}/sondas/octubre/nodo-c.log
chown -R agent:agent ${HOME}/sondas`,
    solution: `grep -rh 'PING' ${HOME}/sondas`,
    hints: [
      '-r busca recursivamente en el árbol; -h OCULTA el nombre del fichero en el resultado.',
      'La combinación -rh es la gran limpiadora para volcar contenido de logs dispersos.',
      `grep -rh 'PING' ${HOME}/sondas`,
    ],
    teach: 'Cuando comparas o concatenas bytes de varios ficheros, -h evita el ruido de rutas: "dime el dato, no de dónde salió". Luego, si necesitas las rutas, grep -r a secas las lista.',
    cheatsheet: [
      { cmd: 'grep -rh pat dir', desc: 'solo el contenido, sin rutas' },
      { cmd: 'grep -rl pat dir', desc: 'solo LOS FICHEROS' },
    ],
    keywords: ['grep', '-r', '-h', 'recursivo'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'PING: señal del nivel: FLAG{…}\nPING: latencia 2ms\n…' }],
  },
  {
    track: 'grep', index: 21, title: 'Sin respaldos antiguos', subtitle: 'grep -r --exclude: descartar por nombre',
    xp: 75, difficulty: 4,
    brief: 'El árbol de configuraciones guarda la invitación ACTUAL y una copia de seguridad antigua (.bak) que YA NO vale.',
    goal: 'Del árbol invitaciones/, imprime las líneas que contienen cláve IGNORANDO todos los ficheros que terminan en .bak.',
    setup: () => `
mkdir -p ${HOME}/invitaciones
printf '%s\\n' 'cláve = ${'$'}DOJO_FLAG (la actual)' > ${HOME}/invitaciones/abril.conf
printf '%s\\n' 'cláve = copia-vieja-no-vale' > ${HOME}/invitaciones/abril.conf.bak
printf '%s\\n' 'cláve = sin-version' > ${HOME}/invitaciones/otro.conf
chown -R agent:agent ${HOME}/invitaciones`,
    solution: `grep -r --exclude='*.bak' 'cláve' ${HOME}/invitaciones`,
    hints: [
      "--exclude='*.patrón' descarta los ficheros cuyo NOMBRE case con el patrón.",
      'El *.bak es la extensión clásica de backups; filtrarla de la búsqueda por contenido es rutina en producción.',
      `grep -r --exclude='*.bak' 'cláve' ${HOME}/invitaciones`,
    ],
    teach: 'En árboles con copias de seguridad, --exclude evita false positives de toda la era .bak. El análogo de INCLUIR solo ciertos tipos es --include="*.log".',
    cheatsheet: [
      { cmd: "grep -r --exclude='*.bak' p dir", desc: 'sin los .bak' },
      { cmd: "grep -r --include='*.conf' p dir", desc: 'solo los .conf' },
    ],
    keywords: ['grep', '-r', '--exclude', 'backups'],
    examples: [{ title: 'salida esperada (flag demo)', content: '…abril.conf: cláve = FLAG{…} (la actual)…' }],
  },
  {
    track: 'grep', index: 22, title: 'La palabra entera', subtitle: 'grep -w: bordes de palabra',
    xp: 75, difficulty: 5,
    brief: 'El log de módulos tiene trampas de nombre: user2, myuser, usuarios… Solo la PALABRA exacta "user" es la señal (y la firma del nivel va a su lado).',
    goal: 'De modululos.log imprime SOLAMENTE las líneas que contienen la PALABRA COMPLETA user (no user2, no myuser).',
    setup: () => `
cat > ${HOME}/modululos.log <<EOF
user solvente, carga controlada con ${'$'}DOJO_FLAG
user2 intentó autenticación fallida
myuser no tiene permisos
usuarios del grupo recargaron
EOF
chown agent:agent ${HOME}/modululos.log`,
    solution: `grep -w 'user' ${HOME}/modululos.log`,
    hints: [
      '-w casa solo si el patrón es una PALABRA ENTERA, rodeada de bordes (espacios, puntuación, inicio/fin).',
      'user2 y myuser NO casan con -w porque la letra pegada rompe la frontera de palabra.',
      `grep -w 'user' ${HOME}/modululos.log`,
    ],
    teach: 'grep -w es el filtro del "solo palabra completa": user ≠ user2. Alternativa en regex extendida: \\buser\\b. Los falsos positivos por subcadenas desaparecen con esta opción.',
    cheatsheet: [
      { cmd: 'grep -w palabra f', desc: 'palabra completa' },
      { cmd: "grep -E '\\\\buser\\\\b' f", desc: 'idem con fronteras a mano' },
    ],
    keywords: ['grep', '-w', 'palabra', 'bordes'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'user solvente, carga controlada con FLAG{…}' }],
  },
  {
    track: 'grep', index: 23, title: 'El doble patrón -e', subtitle: 'grep -e A -e B: varios patrones en una pasada',
    xp: 70, difficulty: 4,
    brief: 'El registro recibe informes de los TURNOS diurnos (DIA) y nocturnos (NOCHE). Ambos importan y la firma viaja con los nocturnos.',
    goal: 'De turnos.log imprime las líneas que contengan NOCHE o DIA (dos patrones en el MISMO grep con -e).',
    setup: () => `
cat > ${HOME}/turnos.log <<EOF
12:00 DIA: el memoranda se firmó a tiempo
23:30 NOCHE: ${'$'}DOJO_FLAG
03:00 MADRUGADA: guardia de servicio solo
EOF
chown agent:agent ${HOME}/turnos.log`,
    solution: `grep -e 'NOCHE' -e 'DIA' ${HOME}/turnos.log`,
    hints: [
      '-e patrón añade UN patrón más a la búsqueda; puedes poner varios en el mismo comando.',
      'La alternativa a -e -e es la alternancia -E: NOCHE|DIA. Ambas son válidas.',
      `grep -e 'NOCHE' -e 'DIA' ${HOME}/turnos.log`,
    ],
    teach: 'grep -e A -e B acepta varios patrones en una pasada, sin la -E. La ventaja: cada patrón es un argumento limpio, sin regex anidadas que te confundan.',
    cheatsheet: [
      { cmd: 'grep -e a -e b f', desc: 'dos patrones, una pasada' },
      { cmd: "grep -E 'a|b' f", desc: 'idem con alternancia' },
    ],
    keywords: ['grep', '-e', 'patrones'],
    examples: [{ title: 'salida esperada (flag demo)', content: '12:00 DIA…\n23:30 NOCHE: FLAG{…}' }],
  },
  {
    track: 'grep', index: 24, title: 'La ventana exacta', subtitle: 'head + tail + grep: rango de líneas',
    xp: 75, difficulty: 5,
    brief: 'El fichero marcas.txt tiene la firma en una zona CONCRETA (líneas 6..9). El EXTERIOR es ruido y no vale.',
    goal: 'De marcas.txt imprime las líneas que contienen TERMINAL SOLAMENTE si están entre las líneas 6 y 9 (las exteriores no valen).',
    setup: () => `
cat > ${HOME}/marcas.txt <<EOF
uno simple sin señal
dos decoración
tres TERMINAL fuera de rango
cuatro TERMINAL exterior igualmente
cinco nada relevante
seis decorado ligero
siete TERMINAL del rango con la firma: ${'$'}DOJO_FLAG
ocho TERMINAL interior válido
nueve TERMINAL el final del rango
diez TERMINAL fuera de nuevo
EOF
chown agent:agent ${HOME}/marcas.txt`,
    solution: `head -n 9 ${HOME}/marcas.txt | tail -n +6 | grep 'TERMINAL'`,
    hints: [
      'La ventana 6..9 se obtiene con head -n 9 (corta desde arriba hasta la 9) | tail -n +6 (empieza en la 6).',
      'El último grep filtra dentro de esa ventana SOLO las líneas TERMINAL.',
      `head -n 9 ${HOME}/marcas.txt | tail -n +6 | grep 'TERMINAL'`,
    ],
    teach: 'head y tail son la "tijera de líneas"; acotar un bloque antes del grep evita falsos positivos en todo el fichero. Otra forma es sed -n 6,9p; aquí practicamos la fórmula head/tail, independiente de sed.',
    cheatsheet: [
      { cmd: 'head -n 9 f | tail -n +6', desc: 'líneas 6..9' },
      { cmd: 'sed -n 6,9p f', desc: 'idem con sed' },
    ],
    keywords: ['grep', 'head', 'tail', 'ventana'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'las líneas 7..9 (TERMINAL), con la flag del nivel en la 7' }],
  },
  {
    track: 'grep', index: 25, title: 'El recuento de las vigas', subtitle: 'grep | sort | uniq -c: frecuencias',
    xp: 80, difficulty: 5,
    brief: 'El log de vigas repite señales: el informe pide CUÁNTAS VECES aparece cada tramo, ordenado.',
    goal: 'De vigas.log imprime cada línea que contenga VIGA, ordenadas alfabéticamente y, delante de cada una, el NÚMERO de veces que se repite (uniq -c).',
    setup: () => `
cat > ${HOME}/vigas.log <<EOF
VIGA tramo alfa
VIGA tramo gamma
VIGA tramo alfa
VIGA limpieza sin señal
VIGA tramo función: ${'$'}DOJO_FLAG
VIGA tramo gamma
EOF
chown agent:agent ${HOME}/vigas.log`,
    solution: `grep 'VIGA' ${HOME}/vigas.log | sort | uniq -c`,
    hints: [
      'uniq -c añade un CONTADOR a la izquierda de cada línea única; exige que las líneas DUPLICADAS estén adyacentes.',
      'sort ordena las líneas y prepara la adyacencia para uniq.',
      `grep 'VIGA' ${HOME}/vigas.log | sort | uniq -c`,
    ],
    teach: 'El trío grep | sort | uniq -c es EL medidor de frecuencias del shell. Cuidado: uniq -c cuenta LÍNEAS ÚNICAS (no ficheros), y sin sort los duplicados no quedan contiguos y el conteo se parte.',
    cheatsheet: [
      { cmd: 'grep pat f | sort | uniq -c', desc: 'frecuencia de cada línea' },
      { cmd: 'sort f | uniq -c | sort -rn', desc: 'ranking por frecuencia' },
    ],
    keywords: ['grep', 'uniq', '-c', 'sort', 'frecuencia'],
    examples: [{ title: 'salida esperada (flag demo)', content: '   2 VIGA tramo alfa\n   1 VIGA tramo función: FLAG{…}\n…' }],
  },
  {
    track: 'grep', index: 26, title: 'Boss: la cadena de tres', subtitle: 'incluir → anclar → excluir',
    xp: 170, difficulty: 5,
    brief: 'El log de auditoría mezcla eventos CRITICA de años pasados, simulacros y el evento REAL. El informe exige tres pasos encadenados, y la firma viaja con el evento real.',
    goal: 'De auditoria.log imprime SOLO las líneas que: contengan CRITICA, EMPIECEN por 2026 (año del dojo) y NO contengan simulacro.',
    setup: () => `
cat > ${HOME}/auditoria.log <<EOF
2025-11-02 CRITICA año viejo (no vale)
2026-10-25 CRITICA simulacro de octubre
2026-10-25 CRITICA del evento real urge: ${'$'}DOJO_FLAG
2026-10-25 CRITICA otro simulacro que no vale
EOF
chown agent:agent ${HOME}/auditoria.log`,
    solution: `grep 'CRITICA' ${HOME}/auditoria.log | grep -E '^2026' | grep -v 'simulacro'`,
    hints: [
      'Paso 1: grep CRITICA deja las líneas del evento.',
      'Paso 2: grep -E "^2026" (ancla de inicio de línea) exige el año de este dojo.',
      'Paso 3: grep -v simulacro elimina los falsos positivos.',
      `grep 'CRITICA' ${HOME}/auditoria.log | grep -E '^2026' | grep -v 'simulacro'`,
    ],
    teach: 'El boss final de este bloque encadena include → ancla → exclude. Tres etapas: primero SUELTA la señal, luego AFILA su forma, y por último QUITA LOS FALSOS. Cada etapa es un grep y juntos se leen como una frase.',
    cheatsheet: [
      { cmd: 'grep a f | grep -E "^x" | grep -v y', desc: 'include + ancla + exclude' },
      { cmd: "grep -E '^2026' f", desc: 'anclar por año' },
    ],
    keywords: ['grep', 'boss', 'pipeline', 'cadena'],
    examples: [{ title: 'salida esperada (flag demo)', content: '2026-10-25 CRITICA … FLAG{…}' }],
  },
];

/* ═══════════════════════════════════════════════════════════════════ AWK ══ */
const AWK = [
  {
    track: 'awk', index: 15, title: 'Los campos contados', subtitle: 'awk NF: filtrar por nº de campos',
    xp: 70, difficulty: 4,
    brief: 'El registro de sesiones guarda filas de DISTINTA anchura: incompletas, normales y una fila extra-larga. A la vez, la firma viaja en una fila de 4 campos.',
    goal: 'De sesiones.dat imprime SOLAMENTE las filas que tienen EXACTAMENTE 4 campos (NF).',
    setup: () => `
cat > ${HOME}/sesiones.dat <<EOF
sesion-01 usuario
sesion-02 ${'$'}DOJO_FLAG completa estado
sesion-03 empleado activo hoy tarde
sesion-04 usuario activo 23:10 tienda
EOF
chown agent:agent ${HOME}/sesiones.dat`,
    solution: `awk 'NF == 4' ${HOME}/sesiones.dat`,
    hints: [
      'NF es el NÚMERO de campos de la línea actual: la primera variable de diagnóstico de awk.',
      'La fila 2 tiene 4 campos y la 3 tiene 5: la comparación NF == 4 la única que imprime es la de la flag.',
      `awk 'NF == 4' ${HOME}/sesiones.dat`,
    ],
    teach: 'NF cuenta los campos de la línea actual. Con NF, desechas filas truncas o incompletas ANTES de procesar: es la primera validación de calidad de cualquier log.',
    cheatsheet: [
      { cmd: "awk 'NF == 4' f", desc: 'filas con 4 campos' },
      { cmd: "awk 'NF > 3 {print NF, $0}' f", desc: 'ver NF junto a la fila' },
    ],
    keywords: ['awk', 'NF', 'campos'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'la fila de 4 campos (aquí viaja la flag)' }],
  },
  {
    track: 'awk', index: 16, title: 'El último campo', subtitle: 'awk $NF: el campo final',
    xp: 70, difficulty: 4,
    brief: 'El registro de entregas guarda un concepto VARIABLE al final de cada fila; la fila del dojo es la única cuyo último campo es la firma.',
    goal: 'De entregas.dat imprime ÚNICAMENTE el último campo de cada línea ($NF).',
    setup: () => `
cat > ${HOME}/entregas.dat <<EOF
paquete-01 entregado racionalmente
paquete-02 estado final: ${'$'}DOJO_FLAG
paquete-03 devuelto al almacén
EOF
chown agent:agent ${HOME}/entregas.dat`,
    solution: `awk '{ print $NF }' ${HOME}/entregas.dat`,
    hints: [
      '$NF SIEMPRE apunta al último campo, sin importar cuántos haya: NF es el número, $NF es el VALOR.',
      'No necesitas contar los campos: awk ya lo sabe.',
      `awk '{ print $NF }' ${HOME}/entregas.dat`,
    ],
    teach: 'El idiom $NF es ÚTIL cuando el último dato importa y el nº de campos varía (logs con apéndices opcionales). $0 es la línea entera; $(NF-1) es el penúltimo.',
    cheatsheet: [
      { cmd: "awk '{print $NF}' f", desc: 'último campo de cada fila' },
      { cmd: "awk '{print $(NF-1)}' f", desc: 'penúltimo campo' },
    ],
    keywords: ['awk', '$NF', 'último', 'campo'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'racionalmente\nFLAG{…}\nal almacén… (los últimos de cada fila)' }],
  },
  {
    track: 'awk', index: 17, title: 'La cirugía de un campo', subtitle: 'awk sub() SOLO en un campo',
    xp: 75, difficulty: 5,
    brief: 'Los nombres de servicio llevan la vieja etiqueta beta. Hay que renombrar SOLO el primer campo (el resto de la fila, con la firma, queda intacto).',
    goal: 'De servicios.dat imprime cada fila con el campo 1 modificado: sustituye beta por v2 SOLO dentro del primer campo.',
    setup: () => `
cat > ${HOME}/servicios.dat <<EOF
api-beta Gateway Latino ${'$'}DOJO_FLAG
worker-beta cola de tareas
web-beta frontend de la demo
EOF
chown agent:agent ${HOME}/servicios.dat`,
    solution: `awk '{ sub(/beta/, "v2", $1); print }' ${HOME}/servicios.dat`,
    hints: [
      'sub(/patrón/, "reemplazo", $1) sustituye el PRIMER match DENTRO del campo 1.',
      'Al reasignar un campo, awk RECONSTRUYE la línea dejando el resto intacto.',
      `awk '{ sub(/beta/, "v2", $1); print }' ${HOME}/servicios.dat`,
    ],
    teach: 'sub/gsub aceptan un TERCER argumento: el campo donde operar. Sustituir en $1 NO toca $2 ni $3: la cirugía de awk evita regex desenfrenadas sobre toda la línea.',
    cheatsheet: [
      { cmd: "awk '{sub(/a/, \"b\", $1); print}' f", desc: 'sustitución solo en campo 1' },
      { cmd: "awk '{sub(/a/, \"b\"); print}' f", desc: 'idem sobre TODA la línea' },
    ],
    keywords: ['awk', 'sub', 'campo', 'sustitución'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'api-v2 Gateway Latino FLAG{…}' }],
  },
  {
    track: 'awk', index: 18, title: 'El conversor de separadores', subtitle: 'awk FS/OFS: cambiar delimitador',
    xp: 75, difficulty: 5,
    brief: 'El inventario viene separado por «dos puntos», pero el CSV final debe salir con comas. FS y OFS hacen el trabajo sin regex.',
    goal: 'De inventario.txt imprime cada línea con los ":" sustituidos por "," (re-juntando los mismos campos en el MISMO orden).',
    setup: () => `
cat > ${HOME}/inventario.txt <<EOF
correa-percha:azul:3:${'$'}DOJO_FLAG
cuerda-fina:roja:9
sal-piedra:blanca:2
EOF
chown agent:agent ${HOME}/inventario.txt`,
    solution: `awk -F: -v OFS=',' '{ $1 = $1; print }' ${HOME}/inventario.txt`,
    hints: [
      '-F: define el separador de ENTRADA (FS) y -v OFS="," el separador de SALIDA (Output Field Separator).',
      'El truco $1 = $1 REASIGNA el campo 1; al reasignar, awk RECONSTRUYE $0 pegando los campos con el OFS nuevo.',
      `awk -F: -v OFS=',' '{ $1 = $1; print }' ${HOME}/inventario.txt`,
    ],
    teach: 'El conversor FS→OFS con $1=$1 es el re-decoder de formato del shell: separar campos y re-pegarlos con otro delimitador sin regex ni sed. La firma viaja intacta como un campo.',
    cheatsheet: [
      { cmd: "awk -F: -v OFS=',' '1' f", desc: 'variante corta (1 = true)' },
      { cmd: "awk -F, -v OFS=';' '{$1=$1;print}' f", desc: 'de coma a punto y coma' },
    ],
    keywords: ['awk', 'FS', 'OFS', 'delimitador'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'correa-percha,azul,3,FLAG{…}' }],
  },
  {
    track: 'awk', index: 19, title: 'El bloque entero', subtitle: 'awk rango /inicio/,/fin/',
    xp: 75, difficulty: 5,
    brief: 'El log del día divide la escena en BLOQUES con banderas INICIO y FIN. Solo el bloque nocturno (entre banderas) tiene la firma.',
    goal: 'De menu.log imprime TODO el contenido ENTRE la línea que empieza por INICIO y la que empieza por FIN (inclusas).',
    setup: () => `
cat > ${HOME}/menu.log <<EOF
INICIO
cena a las 21:00
vino del sommelier con la firma: ${'$'}DOJO_FLAG
FIN
postre para el desayuno
EOF
chown agent:agent ${HOME}/menu.log`,
    solution: `awk '/^INICIO/,/^FIN/' ${HOME}/menu.log`,
    hints: [
      'El rango /a/,/b/ imprime desde la línea que casa con /a/ hasta la línea que casa con /b/ (inclusas).',
      'Con ^ anclas al inicio de línea, evitas un FIN a mitad de frase u otros candidatos.',
      `awk '/^INICIO/,/^FIN/' ${HOME}/menu.log`,
    ],
    teach: 'El selector de bloques /a/,/b/ es la herramienta de awk para "trozos marcados" (el análogo de sed -n /a/,/b/p). La ventaja: después puedes meter acciones encima del rango, filtrar y acumular.',
    cheatsheet: [
      { cmd: "awk '/^a/,/^b/' f", desc: 'bloque entre anclas' },
      { cmd: "awk '/BEGIN/,/END/ {print}' f", desc: 'bloque entre literales' },
    ],
    keywords: ['awk', 'rango', 'bloque', 'ancla'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'INICIO\n…cena…\n…firma…\nFIN' }],
  },
  {
    track: 'awk', index: 20, title: 'La lista blanca', subtitle: 'awk join NR==FNR: dos ficheros',
    xp: 80, difficulty: 5,
    brief: 'El sistema de vigilancia tiene una lista blanca de IPs y un log de tráfico. La firma viaja con el tráfico DE la lista blanca.',
    goal: 'De trafico.log imprime las líneas cuya primera columna aparece en permitidas.dat (el patrón del join con NR==FNR).',
    setup: () => `
cat > ${HOME}/permitidas.dat <<EOF
10.20.30.40
192.168.5.11
EOF
cat > ${HOME}/trafico.log <<EOF
10.20.30.40 cliente autorizado: ${'$'}DOJO_FLAG
10.55.55.55 intruso claro
192.168.5.11 cliente autorizado también
8.8.8.8 tráfico externo
EOF
chown agent:agent ${HOME}/permitidas.dat ${HOME}/trafico.log`,
    solution: `awk 'NR==FNR { lista[$1]; next } $1 in lista' ${HOME}/permitidas.dat ${HOME}/trafico.log`,
    hints: [
      'Al recibir DOS ficheros, NR cuenta global y FNR por fichero: NR==FNR es TRUE solo en el PRIMERO.',
      'lista[$1] registra la línea como clave del arreglo; luego $1 in lista consulta el arreglo',
      `awk 'NR==FNR { lista[$1]; next } $1 in lista' ${HOME}/permitidas.dat ${HOME}/trafico.log`,
    ],
    teach: 'NR==FNR {cargar; next} es EL join de awk: el primer fichero alimenta un arreglo, el segundo se consulta contra él. Mantiene listas blancas/negras del shell sin sort ni comm.',
    cheatsheet: [
      { cmd: "awk 'NR==FNR{a[$1];next} $1 in a' patrón datos", desc: 'join clásico' },
      { cmd: "awk 'NR==FNR{a[$1];next} !($1 in a)' patrón datos", desc: 'el inverso: lo NO presente' },
    ],
    keywords: ['awk', 'NR', 'FNR', 'join', 'lista'],
    examples: [{ title: 'salida esperada (flag demo)', content: '…las filas de trafico.log con IP blanca, con la flag' }],
  },
  {
    track: 'awk', index: 21, title: 'La línea sospechosamente larga', subtitle: 'awk length($0): filtrar por tamaño',
    xp: 70, difficulty: 4,
    brief: 'En el registro de pulsos, TODAS las líneas normales son pequeñas. La firma del nivel es la ÚNICA sospechosamente larga.',
    goal: 'De pulsos.log imprime SÓLO las líneas que miden MÁS de 50 caracteres (length($0)).',
    setup: () => `
cat > ${HOME}/pulsos.log <<EOF
pulso pequeño
pulso junto
señal critica detectada en la red: ${'$'}DOJO_FLAG
otro pulso
EOF
chown agent:agent ${HOME}/pulsos.log`,
    solution: `awk 'length($0) > 50' ${HOME}/pulsos.log`,
    hints: [
      'length($0) devuelve el número de CARACTERES de la línea actual (length($1) la del campo 1).',
      'La comparación con 50 filtra las anomalías en longitud: la primera revisión de calidad de los logs.',
      `awk 'length($0) > 50' ${HOME}/pulsos.log`,
    ],
    teach: 'length() existe SIN argumento (equivale a length($0)) y CON argumento. Filtrar por longitud detecta líneas truncas, anomalías de volcado y concatenados por accidente.',
    cheatsheet: [
      { cmd: "awk 'length($0) > 50' f", desc: 'líneas largas (más de 50)' },
      { cmd: "awk '{print length($1)}' f", desc: 'medir el primer campo' },
    ],
    keywords: ['awk', 'length', 'longitud'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'la línea larga con la flag' }],
  },
  {
    track: 'awk', index: 22, title: 'La tabla ancha', subtitle: 'awk printf: columnas alineadas',
    xp: 75, difficulty: 5,
    brief: 'La tabla de comercios mezcla nombres cortos y largos. Para el informe se alinea a un ANCHO fijo: printf "%-12s" a cada nombre, y el valor de la 2.ª columna después.',
    goal: 'De comercios.dat imprime cada fila CON EL CAMPO 1 ALINEADO A UN ANCHO DE 12 CARACTERES (a la izquierda, rellenando con espacios), y después el campo 2.',
    setup: () => `
cat > ${HOME}/comercios.dat <<EOF
tienda-1 7
tienda-2 ${'$'}DOJO_FLAG
tienda-de-rapida 190284
EOF
chown agent:agent ${HOME}/comercios.dat`,
    solution: `awk '{ printf "%-12s %s\\n", $1, $2 }' ${HOME}/comercios.dat`,
    hints: [
      'printf es de estilo C: %-12s alinea la CADENA a la IZQUIERDA con 12 de ancho (rellena con espacios).',
      'printf NO añade salto de línea por sí: se lo das con \\\\n explícito.',
      `awk '{ printf "%-12s %s\\n", $1, $2 }' ${HOME}/comercios.dat`,
    ],
    teach: "La aritmética del formato de awk vive en printf: %-12s (cadena a la izquierda), %10d (número a la derecha), %.2f (2 decimales). Es la máscara de todos los CSV alineados.",
    cheatsheet: [
      { cmd: "awk '{printf \"%-12s %s\\n\", $1, $2}' f", desc: 'columna ancha fija' },
      { cmd: "awk '{printf \"%10d\\n\", $2}' f", desc: 'número a la derecha' },
    ],
    keywords: ['awk', 'printf', 'alineación', 'ancho'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'tienda-1     7\ntienda-2     FLAG{…}\n…' }],
  },
  {
    track: 'awk', index: 23, title: 'La partición manual', subtitle: 'awk split(): trocear a medida',
    xp: 75, difficulty: 5,
    brief: 'El fichero rutas.dat usa ":" como separador y CADA fila tiene tres partes. Necesitas la TERCERA zona (el valor) y split() te la da.',
    goal: 'De rutas.dat imprime, con split() en un arreglo, el TERCER elemento de cada línea (troceando por ":").',
    setup: () => `
cat > ${HOME}/rutas.dat <<EOF
catalogo:seccion-1:${'$'}DOJO_FLAG
catalogo:seccion-2:item-dos
catalogo:seccion-3:item-tres
EOF
chown agent:agent ${HOME}/rutas.dat`,
    solution: `awk '{ split($0, a, ":"); print a[3] }' ${HOME}/rutas.dat`,
    hints: [
      'split(cadena, arreglo, separador) trocea y LLENA a[1], a[2], a[3]… devuelve el Nº de piezas.',
      'a[3] es la TERCERA parte: el índice es 1-based, como todo en awk.',
      `awk '{ split($0, a, ":"); print a[3] }' ${HOME}/rutas.dat`,
    ],
    teach: 'split() da control manual: monta arreglos a medida para filtrar y contar, sin depender del FS. Muy útil cuando hay DOS tipos de separadores en la misma línea.',
    cheatsheet: [
      { cmd: "awk '{split($0,a,\":\"); print a[2]}' f", desc: 'segunda pieza' },
      { cmd: "awk '{n=split($0,a,\":\"); print n}' f", desc: 'número de piezas' },
    ],
    keywords: ['awk', 'split', 'arreglo'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…} (la tercera pieza de la primera fila)' }],
  },
  {
    track: 'awk', index: 24, title: 'La hora externa', subtitle: 'awk getline: ejecutar y capturar',
    xp: 75, difficulty: 5,
    brief: 'El informe exige ESTAMPAR cada línea con la HORA en que se leyó. awk puede pedir la hora al sistema con getline y ponerla delante.',
    goal: 'De reportes.log imprime la HORA actual (date +%H, ejecutado y capturado con getline) DELANTE de cada línea.',
    setup: () => `
cat > ${HOME}/reportes.log <<EOF
reporte del dojo con la firma: ${'$'}DOJO_FLAG
otro reporte sin nada
EOF
chown agent:agent ${HOME}/reportes.log`,
    solution: `awk 'BEGIN { "date +%H" | getline hora } { print hora, $0 }' ${HOME}/reportes.log`,
    hints: [
      '"comando" | getline var EJECUTA el comando una vez y copia SU salida en la variable.',
      'En BEGIN basta: la variable "hora" queda llena antes de leer la primera línea.',
      `awk 'BEGIN { "date +%H" | getline hora } { print hora, $0 }' ${HOME}/reportes.log`,
    ],
    teach: 'El getline de awk con una PIPE es el CALL OUT al SHELL: captura la salida de un comando (date, hostname, whoami…) y la usa EN el programa awk. El clásico estampado con marca de tiempo auténtico.',
    cheatsheet: [
      { cmd: 'awk \'BEGIN{"date" | getline d}{print d, $0}\' f', desc: 'captura date con getline' },
      { cmd: 'awk \'BEGIN{"hostname" | getline h}{print h}\' f', desc: 'otro comando local' },
    ],
    keywords: ['awk', 'getline', 'pipe', 'shell'],
    examples: [{ title: 'salida esperada (flag demo)', content: '14 reporte del dojo con la firma: FLAG{…} (hora: depende del momento)' }],
  },
  {
    track: 'awk', index: 25, title: 'El caso sin drama', subtitle: 'awk tolower: comparación insensible',
    xp: 75, difficulty: 5,
    brief: 'El log de usuarios escribe inicio, Inicio e INICIO sin criterio. Tres filas son válidas; la firma viaja con la de MAYÚSCULAS.',
    goal: 'De sesiones2.log imprime las filas cuyo 1.er campo vale inicio en CUALQUIER combinación de mayúsculas/minúsculas.',
    setup: () => `
cat > ${HOME}/sesiones2.log <<EOF
inicio minúsculas sin nada
Inicio capitalizado tampoco
INICIO la fila con la firma: ${'$'}DOJO_FLAG
inmidio no es inicio
EOF
chown agent:agent ${HOME}/sesiones2.log`,
    solution: `awk 'tolower($1) == "inicio"' ${HOME}/sesiones2.log`,
    hints: [
      'tolower(cadena) pasa la cadena a minúsculas; toupper() hace lo contrario.',
      'Con este selector las filas 1, 2 y 3 casan (inicio, Inicio, INICIO): entre ellas está la del nivel.',
      `awk 'tolower($1) == "inicio"' ${HOME}/sesiones2.log`,
    ],
    teach: 'tolower/toupper normalizan a un caso ÚNICO antes de comparar: ni ||-cadenas ni listas de variantes.Normaliza AMBOS lados (patrón y campo) para no colar inmidio ni emparejar sin sentido.',
    cheatsheet: [
      { cmd: "awk 'tolower($1) == \"inicio\"' f", desc: 'compara insensible' },
      { cmd: "awk '{print toupper($1), $2}' f", desc: 'imprime el campo en mayúsculas' },
    ],
    keywords: ['awk', 'tolower', 'toupper', 'caso'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'las tres filas de inicio; la de la firma va en mayúsculas' }],
  },
  {
    track: 'awk', index: 26, title: 'Boss: la nómina filtrada', subtitle: '2 condiciones: numérica y exacta',
    xp: 170, difficulty: 5,
    brief: 'En nomina.dat cada fila es: nombre importe estado. La firma del nivel pide las filas con importe ≥ 4000 Y estado "critica" A LA VEZ.',
    goal: 'De nomina.dat imprime las filas cuyo importe (2.ª columna) sea MAYOR O IGUAL a 4000 Y cuyo estado (3.ª columna) sea EXACTAMENTE critica.',
    setup: () => `
cat > ${HOME}/nomina.dat <<EOF
marcus 1200 normal
nista 4800 critica ${'$'}DOJO_FLAG
leila 3999 critica
juan 5000 normal
hussain 9500 critica
EOF
chown agent:agent ${HOME}/nomina.dat`,
    solution: `awk '$2 >= 4000 && $3 == "critica"' ${HOME}/nomina.dat`,
    hints: [
      'La condición NUMÉRICA ($2 >= 4000) y la de CADENA ($3 == "critica") se unen con &&.',
      'Compara la cadena de forma EXACTA: critica sin tilde, como está en el log.',
      `awk '$2 >= 4000 && $3 == "critica"' ${HOME}/nomina.dat`,
    ],
    teach: 'El CIERRE de este bloque: dos condiciones de TIPOS DIFERENTES (numérica y cadena) sobre columnas distintas, unidas con &&. Es el patrón de auditoría de pagos, facturación y QoS: filas que cumplen VARIAS dimensiones a la vez.',
    cheatsheet: [
      { cmd: 'awk \'$2 >= 4000 && $3 == "critica"\' f', desc: 'número Y cadena a la vez' },
      { cmd: 'awk \'$2 >= 4000 || $3 == "critica"\' f', desc: 'el OR análogo' },
    ],
    keywords: ['awk', 'boss', '&&', 'filtro'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'nista 4800 critica FLAG{…}' }],
  },
];

function emit(track, items, startIndex) {
  const dir = path.join(repoRoot, 'levels', track);
  fs.mkdirSync(dir, { recursive: true });
  let done = 0;
  items.forEach((it, i) => {
    const idx = startIndex + i + 1;
    const y = {
      id: `${track}-l${idx}`,
      track,
      index: idx,
      title: it.title,
      subtitle: it.subtitle,
      xp: it.xp,
      difficulty: it.difficulty,
      brief: it.brief,
      goal: it.goal,
      setup: `#!/bin/bash\nset -e\n${it.setup()}`,
      solution: it.solution,
      hints: it.hints,
      teach: it.teach,
      cheatsheet: it.cheatsheet,
      keywords: it.keywords,
      profile: it.profile ?? 'default',
      examples: it.examples,
    };
    fs.writeFileSync(path.join(dir, `l${idx}.yaml`), YAML.stringify(y));
    done++;
  });
  return done;
}

const nGrep = emit('grep', GREP, 14);
const nAwk = emit('awk', AWK, 14);
console.log(`gen-expansion-ext: grep +${nGrep}, awk +${nAwk} niveles nuevos`);
