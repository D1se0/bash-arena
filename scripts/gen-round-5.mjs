/*
 * gen-round-5 — EXPANSIÓN del catálogo (ronda 5):
 *   · awk   +14 (l37–l50) — ESPECIALIZACIÓN prioritaria
 *   · grep  +14 (l37–l50) — ESPECIALIZACIÓN prioritaria
 *   · 11 tracks base +6 cada uno (l21–l26): fundamentos, filtrado, busqueda,
 *     procesado, permisos, procesos, redes, archivos, scripting, forense, boss.
 * Regenerar: node scripts/gen-round-5.mjs
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
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{round5-demo}' }],
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
  track: 'grep', index: 37, title: 'La primera señal', subtitle: '-m: deténte en la N-ésima coincidencia',
  xp: 45, difficulty: 2,
  brief: 'El radar emite sin parar y la señal «hallada» se repite; solo el PRIMER eco trae la marca. grep tiene un freno de results.',
  goal: 'Imprime de radar.log ÚNICAMENTE la primera línea que contiene hallada (la que lleva la marca).',
  setup: () => P(37, 'Grep') + `cat > ${HOME}/radar.log <<EOF
04:12 contacto disperso
05:03 señal hallada ${'$'}DOJO_FLAG
05:09 señal hallada repetida
06:30 ruido de fondo
07:45 hallada en el eco final
EOF
chown agent:agent ${HOME}/radar.log`,
  solution: `grep -m 1 'hallada' ${HOME}/radar.log`,
  hints: [
    '-m NUM corta después de la NUM-ésima coincidencia: con 1, solo imprime la primera y para.',
    'grep deja de LEER el fichero al alcanzar el límite: en logs gigantescos es una diferencia abismal.',
    `grep -m 1 'hallada' radar.log`,
  ],
  teach: '-m limita resultados, no filtra contenido: imprime como máximo NUM líneas acertadas y termina en cuanto las tiene. Es el remedio canónico ante logs demasaido ruidosos.',
  cheatsheet: [
    { cmd: 'grep -m 1 patrón f', desc: 'solo la primera aciertada y para' },
    { cmd: 'grep -m 3 patrón f', desc: 'como máximo tres' },
  ],
  keywords: ['grep', '-m', 'límite', 'primera'],
}));

GREP.push(mk({
  track: 'grep', index: 38, title: 'El recolector de tokens', subtitle: '-o: imprime cada match suelto',
  xp: 50, difficulty: 2,
  brief: 'El fichero de etapas resume el cruce en frases largas; necesitas SOLO las palabras terminadas en «ión» — y entre elles viaja la marca.',
  goal: "De etapas.txt imprime, una por línea, todos los tokens que casan con la ERE del conteo: las palabras que acaban en «ión» y la marca FLAG{…}.",
  setup: () => P(38, 'Grep') + `cat > ${HOME}/etapas.txt <<EOF
la revisión define la posición y la fusión final
la marca del round es ${'$'}DOJO_FLAG
otras cadenas no interesan aquí, solo la evolución
EOF
chown agent:agent ${HOME}/etapas.txt`,
  solution: `grep -oE '[a-z]+ión|FLAG{[a-f0-9]+}' ${HOME}/etapas.txt`,
  hints: [
    '-o cambia la SALIDA: imprime cada coincidencia aislada, una por línea, sin el resto de la línea.',
    'La ERE [a-z]+ión captura palabras completas terminadas en ión; añade la alternativa del formato de la marca.',
    `grep -oE '[a-z]+ión|FLAG{[a-f0-9]+}' etapas.txt`,
  ],
  teach: 'grep -o pasa de líneas a tokens: con sort | uniq -c te da la frecuencia exacta de cualquier patrón en un corpus. Es el cimiento del análisis léxico en shell.',
  cheatsheet: [
    { cmd: "grep -oE 'REGEX' f", desc: 'solo los matches, uno por línea' },
    { cmd: "grep -o 'palabra' f | sort | uniq -c", desc: 'conteo de frecuencia por token' },
  ],
  keywords: ['grep', '-o', 'tokens', 'análisis'],
}));

GREP.push(mk({
  track: 'grep', index: 39, title: 'El censo limpio', subtitle: '-v: solo lo que NO casa',
  xp: 45, difficulty: 2,
  brief: 'El control de calidad marca con «FALLA» los lotes defectuosos; una de las líneas sanas lleva la marca.',
  goal: 'Imprime las líneas de calidad.txt que NO contienen la palabra FALLA (una de ellas lleva la marca).',
  setup: () => P(39, 'Grep') + `cat > ${HOME}/calidad.txt <<EOF
lote 1 correcto
lote FALLA dos
lote 3 correcto con la ${'$'}DOJO_FLAG
lote FALLA cuarta
lote 5 correcto
EOF
chown agent:agent ${HOME}/calidad.txt`,
  solution: `grep -v 'FALLA' ${HOME}/calidad.txt`,
  hints: [
    '-v invierte el filtro: imprime las líneas que NO contienen el patrón.',
    'Si además quieres contar, cronometra con grep -cv.',
    `grep -v 'FALLA' calidad.txt`,
  ],
  teach: '-v es el complemento del grep: el «límite fuera». Encadenado con otra condición (grep -v A f | grep B) construyes lógica AND/OR compleja sin regex sobrecargadas.',
  cheatsheet: [
    { cmd: "grep -v 'x' f", desc: 'líneas que NO contienen x' },
    { cmd: "grep -cv 'x' f", desc: 'cuántas líneas NO contienen x' },
  ],
  keywords: ['grep', '-v', 'complemento'],
}));

GREP.push(mk({
  track: 'grep', index: 40, title: 'Dígitos de tres', subtitle: 'clases POSIX + repetición {n}',
  xp: 55, difficulty: 3,
  brief: 'El padrón de inventario usa etiquetas; solo las líneas con TRES dígitos seguidos son válidas (y una de ellas trae la marca).',
  goal: "Imprime de padron.txt las líneas que contienen 3 dígitos seguidos (usa la clase POSIX [[:digit:]]).",
  setup: () => P(40, 'Grep') + `cat > ${HOME}/padron.txt <<EOF
agente-abc sin número
camisa-402 en el almacén
pantalones sin etiqueta
reloj-777 en la vitrina ${'$'}DOJO_FLAG
guantes de tela pura
EOF
chown agent:agent ${HOME}/padron.txt`,
  solution: `grep -E '[[:digit:]]{3}' ${HOME}/padron.txt`,
  hints: [
    'Las clases POSIX van con corchetes dobles: [[:digit:]] es la clase COMPLETA dentro de un par externo.',
    'Con -E el cuantificador {3} exige exactamente tres repeticiones seguidas de la clase.',
    `grep -E '[[:digit:]]{3}' padron.txt`,
  ],
  teach: '[[:digit:]] [[:alpha:]] [[:space:]] [[:upper:]]… son clases POSIX portables (resistentes a locales raras donde [0-9] puede no valer). Cuantificador {n} = «exactamente n veces».',
  cheatsheet: [
    { cmd: "grep -E '[[:digit:]]{3}' f", desc: 'tres dígitos seguidos' },
    { cmd: "grep -E '[[:alpha:]]{4}' f", desc: 'cuatro letras seguidas' },
  ],
  keywords: ['grep', 'posix', 'clases', '{n}'],
}));

GREP.push(mk({
  track: 'grep', index: 41, title: 'La lista de culpables', subtitle: '-f: patrones desde un fichero',
  xp: 60, difficulty: 3,
  brief: 'El archivo prohibido lista comandos vetados (uno por línea). La auditoría anota ejecuciones: solo la entrada donde el comando coincide con la lista lleva la marca.',
  goal: 'Imprime de audit.log SOLO la línea cuyo comando aparece dentro de vetados.txt.',
  setup: () => P(41, 'Grep') + `cat > ${HOME}/vetados.txt <<EOF
curl sketchy
sudo su
rm -rf /tmp
EOF
cat > ${HOME}/audit.log <<EOF
09:12 usuario1 ls -la
09:14 usuario2 curl sketchy ${'$'}DOJO_FLAG
09:16 usuario3 cat notas.txt
EOF
chown agent:agent ${HOME}/vetados.txt ${HOME}/audit.log`,
  solution: `grep -Ff ${HOME}/vetados.txt ${HOME}/audit.log`,
  hints: [
    '-f FICHAERO: cada línea del fichero se convierte en UN patrón a buscar (alternancia masiva).',
    'Con -F los patrones se interpretan como texto literal (sin regex): ideal conslashes y metacaracteres raros.',
    `grep -Ff vetados.txt audit.log`,
  ],
  teach: 'El grep de listas negras: IPs baneadas, dominios dudosos, comandos vetados. -f carga el diccionario; -F evita que los caracteres especiales de las entradas exploten la regex.',
  cheatsheet: [
    { cmd: 'grep -f patrones.txt f', desc: 'cada línea del fichero es un patrón' },
    { cmd: 'grep -Ff patrones.txt f', desc: 'idem con patrones literales (sin regex)' },
  ],
  keywords: ['grep', '-f', 'lista negra', 'blacklist'],
}));

GREP.push(mk({
  track: 'grep', index: 42, title: 'El censo de palabras', subtitle: '-w: palabra COMPLETA',
  xp: 55, difficulty: 3,
  brief: 'El diario habla de «hilo», «hilos» y «hilo2» a la vez; solo la fila donde hilo es palabra ENTERA trae la marca.',
  goal: 'Imprime las líneas de diario.txt donde hilo aparece como PALABRA COMPLETA (no dentro de hilos ni hilo2).',
  setup: () => P(42, 'Grep') + `cat > ${HOME}/diario.txt <<EOF
hilo uno cosido
el hilo rojo se rompió
hilos y más hilos en el costado
hilo2 no es el hilo buscado
EOF
sed -i '1s/$/ con marca ${'$'}DOJO_FLAG/' ${HOME}/diario.txt
chown agent:agent ${HOME}/diario.txt`,
  solution: `grep -w 'hilo' ${HOME}/diario.txt`,
  hints: [
    '-w exige coincidencia de palabra entera: hilo no casa dentro de hilos ni hilo2.',
    'Sin -w también saldrían hilos y hilo2 (son coincidencias de SUBCADENA).',
    `grep -w 'hilo' diario.txt`,
  ],
  teach: '-w delimita por fronteras de palabra (equivalente a \\< y \\> en BRE). Es la diferencia entre buscar un nombre exacto y un prefijo de todo lo que empiece igual.',
  cheatsheet: [
    { cmd: "grep -w 'palabra' f", desc: 'coincidencia de palabra entera' },
    { cmd: "grep -wo 'palabra' f", desc: 'imprime la palabra misma si casa entera' },
  ],
  keywords: ['grep', '-w', 'palabra', 'frontera'],
}));

GREP.push(mk({
  track: 'grep', index: 43, title: 'El coto de caza', subtitle: '-r + --exclude-dir',
  xp: 60, difficulty: 3,
  brief: 'El proyecto tiene node_modules enorme y un fichero real con la marca. Busca recursivamente PERO omite esa jaula.',
  goal: 'Busca la cadena marca (recursivamente) en /home/agent/proyecto excluyendo node_modules, e imprime las líneas acertadas.',
  setup: () => P(43, 'Grep') + `mkdir -p ${HOME}/proyecto/src ${HOME}/proyecto/node_modules/lib
echo 'buena marca ${'$'}DOJO_FLAG' > ${HOME}/proyecto/src/app.js
echo 'ruido sin marca real' > ${HOME}/proyecto/src/otro.js
echo 'marca falsa en la jaula' > ${HOME}/proyecto/node_modules/lib/x.js
chown -R agent:agent ${HOME}/proyecto`,
  solution: `grep -r --exclude-dir=node_modules 'marca' ${HOME}/proyecto`,
  hints: [
    'La búsqueda recursiva es -r.',
    '--exclude-dir=DIR omite directorios completos durante el recorrido (se puede repetir).',
    `grep -r --exclude-dir=node_modules 'marca' proyecto`,
  ],
  teach: 'En árboles reales grep -r sin filtro escanea node_modules, .git, __pycache__… --exclude-dir los aparta y convierte minutos en milisegundos. Admite globs: --exclude-dir={node_modules,.git} tras expandir bash.',
  cheatsheet: [
    { cmd: "grep -r --exclude-dir=node_modules 'x' .", desc: 'recursivo sin ese directorio' },
    { cmd: "grep -r --exclude-dir='.git' --exclude-dir='venv' 'x' .", desc: 'varios excluidos apilados' },
  ],
  keywords: ['grep', '-r', 'exclude-dir', 'recursivo'],
}));

GREP.push(mk({
  track: 'grep', index: 44, title: 'La baliza exacta', subtitle: '-x: la línea COMPLETA',
  xp: 60, difficulty: 3,
  brief: 'El registro de balizas alterna estados y hay ruido; solo una línea es EXACTAMENTE la palabra ENCENDIDO (con la marca al final tras un tabulador? no: la marca viaja en la línea exacta).',
  goal: 'Imprime de balizas.txt la línea cuya totalidad sea la palabra ENCENDIDO Y que además lleve la marca (la marca forma parte de la línea exacta).',
  setup: () => P(44, 'Grep') + `cat > ${HOME}/balizas.txt <<EOF
ENCENDIDO
  ENCENDIDO con espacios
ENCENDIDO una
APAGADO
encendido minúscula
EOF
echo "ENCENDIDO ${'$'}DOJO_FLAG" >> ${HOME}/balizas.txt
chown agent:agent ${HOME}/balizas.txt`,
  solution: `grep 'ENCENDIDO' ${HOME}/balizas.txt | grep -v 'con espacios' | grep -v 'una' | grep -v 'APAGADO' | grep -v 'encendido'`,
  hints: [
    'La línea buena empieza por ENCENDIDO y lleva la marca FLAG{…} al final; grep -x solo casaría si dieras el patrón completo de mano en mano, así que filtra en cadena.',
    'Filtra por ENCENDIDO y descarta las variantes falsas con grep -v apilados.',
    `grep 'ENCENDIDO' balizas.txt | grep 'FLAG{'`,
  ],
  teach: 'Cuando el ruido y el señal comparten prefijo, el filtro se decide con un criterio EXTERNO al patrón (en este caso, la marca FLAG{…} que solo viaja en la línea buena): encadena greps y deja que el segundo afine.',
  cheatsheet: [
    { cmd: "grep -x 'TEXTO' f", desc: 'casa solo si la línea COMPLETA es TEXTO' },
    { cmd: "grep A f | grep B", desc: 'AND: dos filtros en serie' },
  ],
  keywords: ['grep', '-x', 'ancla', 'encadenar'],
}));

GREP.push(mk({
  track: 'grep', index: 45, title: 'El inspector de extensiones', subtitle: '-r + --include=*.ext',
  xp: 60, difficulty: 3,
  brief: 'El directorio mezcla .log, .txt y .conf; solo los .log pueden contener la marca, el resto es ruido.',
  goal: "Busca (recursivamente) la cadena marca en /home/agent/mixto imprimiendo SOLO las coincidencias dentro de ficheros .log.",
  setup: () => P(45, 'Grep') + `mkdir -p ${HOME}/mixto/logs ${HOME}/mixto/conf
echo 'bueno marca ${'$'}DOJO_FLAG' > ${HOME}/mixto/logs/kernel.log
echo 'marca pero no es log' > ${HOME}/mixto/notas.txt
echo 'marca en conf' > ${HOME}/mixto/conf/app.conf
echo 'otro log con marca' > ${HOME}/mixto/logs/acentos.log
chown -R agent:agent ${HOME}/mixto`,
  solution: `grep -r --include='*.log' 'marca' ${HOME}/mixto`,
  hints: [
    "--include=GLOB limita la recursión a los ficheros que casan el patrón de nombre.",
    'Pon el glob entre comillas: si no, bash intentaría expandirlo antes de pasarlo a grep.',
    `grep -r --include='*.log' 'marca' mixto`,
  ],
  teach: '--include filtra QUÉ ficheros se leen en la recursión (complemento de --exclude-dir). Para auditorías por tipo (solo logs, solo logs y only.conf) es el riego exacto.',
  cheatsheet: [
    { cmd: "grep -r --include='*.log' 'x' .", desc: 'recursivo pero solo .log' },
    { cmd: "grep -r --include='*.conf' 'x' .", desc: 'solo los de configuración' },
  ],
  keywords: ['grep', 'include', 'recursivo', 'glob'],
}));

GREP.push(mk({
  track: 'grep', index: 46, title: 'El intruso concreto', subtitle: 'grep | grep: AND encadenado',
  xp: 65, difficulty: 4,
  brief: 'El log de autenticación mezcla FAIL y OK con varias IPs; el atacante concreto es 203.0.113.77 y SU línea de OK lleva la marca.',
  goal: "Imprime de auth.log ÚNICAMENTE la línea con la IP 203.0.113.77 Y el estado OK (las dos condiciones).",
  setup: () => P(46, 'Grep') + `cat > ${HOME}/auth2.log <<EOF
06:00 AUTH FAIL ip 203.0.113.77 root
06:01 AUTH OK ip 198.51.100.4 admin2
06:03 AUTH FAIL ip 198.51.100.4 admin2
06:04 AUTH OK ip 203.0.113.77 root ${'$'}DOJO_FLAG
06:05 AUTH OK ip 203.0.113.99 backup
EOF
chown agent:agent ${HOME}/auth2.log`,
  solution: `grep '203.0.113.77' ${HOME}/auth2.log | grep 'AUTH OK'`,
  hints: [
    'Un solo grep no conduce un AND con dos criterios: encadena DOS greps con pipe.',
    'Ordena los filtros del más ruidoso al más fino para que el segundo pase lo mínimo.',
    `grep '203.0.113.77' auth2.log | grep 'AUTH OK'`,
  ],
  teach: 'grep | grep es el patrón más repetido del mundo real: cada grep añade un criterio. Alternativa equivalente: un único grep -E "203.0.113.77.*AUTH OK|AUTH OK.*203.0.113.77" (más feo y frágil).',
  cheatsheet: [
    { cmd: "grep A f | grep B", desc: 'AND: líneas que cumplen A y también B' },
    { cmd: "grep -E 'A|B' f", desc: 'OR: un solo grep con alternancia' },
  ],
  keywords: ['grep', 'pipe', 'AND', 'encadenar'],
}));

GREP.push(mk({
  track: 'grep', index: 47, title: 'Los puertos 8xxx', subtitle: 'ERE con {n} delimitado',
  xp: 70, difficulty: 4,
  brief: 'El listado de servicios lista puertos y programas. Los de la serie 8000–8999 son los inquietantes (y uno lleva la marca).',
  goal: "Imprime de ports.txt las líneas cuyo 2.nº campo es un número de 4 cifras que EMPIEZA POR 8 (8000–8999).",
  setup: () => P(47, 'Grep') + `cat > ${HOME}/ports.txt <<EOF
web     80    nginx
dev     8001  python http.server ${'$'}DOJO_FLAG
api     8443  nginx ssl
bd      5432  postgres
cache   6379  redis
mono    8123  listener interno
EOF
chown agent:agent ${HOME}/ports.txt`,
  solution: `grep -E ' 8[0-9]{3} ' ${HOME}/ports.txt`,
  hints: [
    'Delimita el puerto con espacios: sin ellos 80 y 5432 colarían.',
    'El patrón 8[0-9]{3} exige un 8 seguido de TRES dígitos cualesquiera.',
    `grep -E ' 8[0-9]{3} ' ports.txt`,
  ],
  teach: 'Cuantificadores {n} + delimitadores explícitos evitan coincidencias parásitas: es la gran diferencia entre grep -E "8" y grep -E " 8[0-9]{3} ".',
  cheatsheet: [
    { cmd: "grep -E ' 8[0-9]{3} ' f", desc: 'números 4 cifras que empiezan por 8' },
    { cmd: "grep -E '[[:space:]]8080[[:space:]]' f", desc: 'el puerto exacto como palabra' },
  ],
  keywords: ['grep', 'regex', 'puertos', '{n}'],
}));

GREP.push(mk({
  track: 'grep', index: 48, title: 'Los números del acierto', subtitle: '-n + cut + sed -n: línea N a línea',
  xp: 60, difficulty: 3,
  brief: "El almacén tiene réplicas GOOD y POS (posiblemente rotas); el informe se arma SOLO con los NÚMEROS de las líneas GOOD — y esos números rescatan el registro marcado.",
  goal: "De almacen.txt calcula los números de línea que contienen GOOD (grep -n | cut) y usa ese listado dentro de sed -n 'N1p;N2p;…' para IMPRIMIR esas líneas completas.",
  setup: () => P(48, 'Grep') + `cat > ${HOME}/almacen.txt <<EOF
estante 1 GOOD
estante 2 POS
estante 3 GOOD
estante 4 vacio
estante 5 GOOD ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/almacen.txt`,
  solution: `sed -n "$(grep -n 'GOOD' ${HOME}/almacen.txt | cut -d: -f1 | sed 's/$/p/' | paste -sd';')" ${HOME}/almacen.txt`,
  hints: [
    "-n prefija cada coincidencia con su número de línea: «N: contenido»; cut -d: -f1 deja solo N.",
    "sed 's/$/p/' convierte cada número en el comando «Np» y paste -sd';' los une (1p;3p;5p).",
    `sed -n "$(grep -n 'GOOD' almacen.txt | cut -d: -f1 | sed 's/$/p/' | paste -sd';')" almacen.txt`,
  ],
  teach: "La cadena -n → cut → sed 's/$/p/' → paste -sd';' construye una EXPRESIÓN de sed a partir de un grep: los números vuelven convertidos en comandos p. Es el patrón «obtén los números y retómalos».",
  cheatsheet: [
    { cmd: "grep -n 'x' f | cut -d: -f1", desc: 'solo los números de línea acertados' },
    { cmd: "sed -n \"$(grep -n 'x' f | cut -d: -f1 | sed 's/$/p/' | paste -sd';')\" f", desc: 'rescatar las líneas por número calculado' },
  ],
  keywords: ['grep', '-n', 'cut', 'números'],
}));

GREP.push(mk({
  track: 'grep', index: 49, title: 'La depuradora doble', subtitle: '-v apilado: ni A ni B',
  xp: 60, difficulty: 3,
  brief: 'El volcado viene cargado de ruido y debug; limpiar DUPLICA el valor del signal real.',
  goal: 'Imprime las líneas de volcado.txt que NO mencionan ruido y TAMPOCO debug.',
  setup: () => P(49, 'Grep') + `cat > ${HOME}/volcado.txt <<EOF
marcador limpio
ruido inutil 42
debug interno ok
datos validos con la ${'$'}DOJO_FLAG
otra linea de ruido
notas de debug finas
EOF
chown agent:agent ${HOME}/volcado.txt`,
  solution: `grep -v 'ruido' ${HOME}/volcado.txt | grep -v 'debug'`,
  hints: [
    'Cada -v elimina UN tipo de ruido: apílalos con pipes.',
    'Equivalente en un solo comando: grep -Ev "ruido|debug" volcado.txt',
    `grep -v 'ruido' volcado.txt | grep -v 'debug'`,
  ],
  teach: 'Varios -v encadenados definen una lista de exclusiones: solo sobreviven las líneas que no pegan con nada de la lista de ruido. En un solo paso: grep -Ev "A|B".',
  cheatsheet: [
    { cmd: "grep -v A f | grep -v B", desc: 'ni A ni B (exclusiones apiladas)' },
    { cmd: "grep -Ev 'A|B' f", desc: 'idem en un solo comando' },
  ],
  keywords: ['grep', '-v', 'exclusión', 'limpieza'],
}));

GREP.push(mk({
  track: 'grep', index: 50, title: 'Boss: la triangulación', subtitle: 'conteo dominante + regreso al log',
  xp: 140, difficulty: 5,
  brief: 'Tres nodos reportan FAIL con distinta intensidad; el nodo que MÁS falla logró un único SUCCESS… y ahí viaja la marca. Une el conteo y la extracción en una sola cadena.',
  goal: "De triangulo.log imprime ÚNICAMENTE la marca FLAG{…} que viaja en la línea de SUCCESS del nodo con MÁS FAIL.",
  setup: () => P(50, 'Grep') + `cat > ${HOME}/triangulo.log <<EOF
nodoA FAIL
nodoA FAIL
nodoA FAIL
nodoB FAIL
nodoC FAIL
nodoA SUCCESS con la marca ${'$'}DOJO_FLAG
nodoB SUCCESS normal
nodoC SUCCESS normal
EOF
chown agent:agent ${HOME}/triangulo.log`,
  solution: `g=$(grep 'FAIL' ${HOME}/triangulo.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep "^${'$'}g " ${HOME}/triangulo.log | grep 'SUCCESS'`,
  hints: [
    'Pasa 1: identifica el nodo dominante en FAIL con grep FAIL f | awk "{print $1}" | sort | uniq -c | sort -nr.',
    'Pasa 2: vuelve al log CON ESA CLAVE y filtra por SUCCESS; ahí viaja la marca.',
    `g=$(grep FAIL triangulo.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep "^$g " triangulo.log | grep SUCCESS`,
  ],
  teach: 'El boss de auditoría real: primero «¿quién domina el fallo?» (conteo), luego «¿cuál fue SU conexión buena?» (regreso al log por la clave). Dos pasadas, una historia.',
  cheatsheet: [
    { cmd: 'grep x f | awk … | sort | uniq -c | sort -nr | head -1', desc: 'el valor dominante en un campo' },
    { cmd: 'grep "^$clave" f | grep OK', desc: 'regreso al log por la clave ganadora' },
  ],
  keywords: ['grep', 'boss', 'cadena', 'uniq'],
}));

/* ═════════════════════════════════════════════════════════════ AWK ══ */
const AWK = [];

AWK.push(mk({
  track: 'awk', index: 37, title: 'Separador de dos piezas', subtitle: '-F ", " — FS multichar',
  xp: 50, difficulty: 2,
  brief: 'El CSV del dojo usa «, » (coma con espacio) como separador para que los nombres con espacios no se rompan; awk acepta un FS de varios caracteres.',
  goal: "De personas.csv imprime el 3.er campo de la fila 2 con el separador «, » (es la credencial).",
  setup: () => P(37, 'Awk') + `cat > ${HOME}/personas.csv <<EOF
ana, QA senior, perros
bruno, dev backend, ${'$'}DOJO_FLAG
carla, ops, tortugas
EOF
chown agent:agent ${HOME}/personas.csv`,
  solution: `awk -F', ' 'NR==2 {print $3}' ${HOME}/personas.csv`,
  hints: [
    'Un FS puede tener VARIOS caracteres o ser regex: -F", " corta por coma+espacio.',
    'NR filtra por posición de línea: NR==2 es la segunda.',
    `awk -F', ' 'NR==2 {print $3}' personas.csv`,
  ],
  teach: 'El separador no está atado a un único carácter: cualquier string (o regex completa) sirve. Con ", " evitas arrastrar el espacio sobrante a $2 y $3 — sin él, print $3 imprimiría " perros" con espacio inicial.',
  cheatsheet: [
    { cmd: "awk -F', ' '{print $3}' f", desc: 'separador multichar: coma + espacio' },
    { cmd: "awk 'BEGIN {FS=\"\\t\\t\"} {print $2}' f", desc: 'dos tabuladores como delimitador' },
  ],
  keywords: ['awk', 'FS', 'csv', 'separador'],
}));

AWK.push(mk({
  track: 'awk', index: 38, title: 'Las filas completas', subtitle: "$3 != \\\"\\\" — higiene de datos",
  xp: 50, difficulty: 2,
  brief: 'El inventario tiene filas rotas (el 3.er campo quedó vacío); el informe solo tolera filas COMPLETAS.',
  goal: 'De inventario.csv imprime el 3.er campo de las filas cuyo 3.er campo NO está vacío (afecta: una completa trae la marca).',
  setup: () => P(38, 'Awk') + `cat > ${HOME}/inventario.csv <<EOF
tornillos, 500, pasador
arandelas, 300,
tuercas, 120, ${'$'}DOJO_FLAG
clavos, 900,
EOF
chown agent:agent ${HOME}/inventario.csv`,
  solution: `awk -F', ' '$3 != "" {print $3}' ${HOME}/inventario.csv`,
  hints: [
    'Un campo vacío es la cadena vacía: compara con "" para filtrarlo.',
    'Si el separador es una sola coma, el campo quedaría con espacio inicial; usa el FS adecuado.',
    `awk -F', ' '$3 != "" {print $1}' inventario.csv`,
  ],
  teach: 'La comparación $N != "" es la higiene de datos más común en awk: descarta celdas vacías sin recurrir a NF==k y deja el flujo de filtrado limpio para el informe.',
  cheatsheet: [
    { cmd: `awk -F, '$3 != "" {print $1}' f`, desc: 'solo filas con 3.er campo lleno' },
    { cmd: `awk -F, 'NF==3 {print $1}' f`, desc: 'idem contando los campos de la fila' },
  ],
  keywords: ['awk', 'campo vacío', 'higiene', 'filtro'],
}));

AWK.push(mk({
  track: 'awk', index: 39, title: 'Mayúsculas sin drama', subtitle: 'toupper() — case-insensitive',
  xp: 55, difficulty: 2,
  brief: 'El catálogo mezcla minúsculas y mayúsculas; el producto SELLADOR aparece escrito en cualquier forma — y su fila completa lleva la marca.',
  goal: "De catalogo.txt imprime la FILA COMPLETA del producto cuyo 1.er campo, convertido a MAYÚSCULAS, es SELLADOR (ahí viaja la marca).",
  setup: () => P(39, 'Awk') + `cat > ${HOME}/catalogo.txt <<EOF
pintura aisle-3
Sellador aisle-9 ${'$'}DOJO_FLAG
sellador aisle-5
brocha aisle-1
rodillo aisle-4
EOF
chown agent:agent ${HOME}/catalogo.txt`,
  solution: `awk 'toupper($1)=="SELLADOR" {print}' ${HOME}/catalogo.txt`,
  hints: [
    'toupper(cadena) pasa a mayúsculas: comparar SIN depender del caso original.',
    'Imprime la LÍNEA completa: print (o print $0), no print $2.',
    `awk 'toupper($1)=="SELLADOR" {print}' catalogo.txt`,
  ],
  teach: 'toupper/tolower normalizan comparaciones textuales sin tocar el dato. Son la versión completa del == case-insensitive: comparar la forma canónica y devolver la fila ORIGINAAL intacta.',
  cheatsheet: [
    { cmd: `awk 'toupper($1)=="X" {print}' f`, desc: 'compara sin case y devuelve la fila completa' },
    { cmd: `awk '{print tolower($0)}' f`, desc: 'baja TODA la línea a minúsculas' },
  ],
  keywords: ['awk', 'toupper', 'comparar', 'caso'],
}));

AWK.push(mk({
  track: 'awk', index: 40, title: 'Posiciones pares', subtitle: 'NR%2 — filtra por NÚMERO de línea',
  xp: 55, difficulty: 2,
  brief: 'La señal alterna mensaje/ruido línea a línea; solo las líneas con número IMPAR (1.ª, 3.ª, 5.ª…) son pulso real.',
  goal: 'De senial.txt imprime SOLO las líneas con posición IMPAR (NR impar).',
  setup: () => P(40, 'Awk') + `cat > ${HOME}/senial.txt <<EOF
pulso A
ruido 1
pulso B
ruido 2
pulso C ${'$'}DOJO_FLAG
ruido 3
EOF
chown agent:agent ${HOME}/senial.txt`,
  solution: `awk 'NR%2==1' ${HOME}/senial.txt`,
  hints: [
    'NR es el número de línea GLOBAL; el resto con % filtra por POSICIÓN, no por contenido.',
    'El patrón puede ser una expresión: awk "NR%2==1" es «imprime las impares».',
    `awk 'NR%2==1' senial.txt`,
  ],
  teach: 'La aritmética sobre NR permite filtrar por posición (pares, impares, cada 3.ª con NR%3==0) — algo que ni grep ni sed hacen tan cómodo.',
  cheatsheet: [
    { cmd: `awk 'NR%2==1' f`, desc: 'líneas impares' },
    { cmd: `awk 'NR%2==0' f`, desc: 'líneas pares' },
    { cmd: `awk 'NR%5==0' f`, desc: 'cada 5.ª línea' },
  ],
  keywords: ['awk', 'NR', 'par', 'posición'],
}));

AWK.push(mk({
  track: 'awk', index: 41, title: 'El panel alineado', subtitle: 'printf con anchuras',
  xp: 60, difficulty: 3,
  brief: 'El panel del dojo exige columnas RECTAS: nombre a 10 posiciones a la izquierda y nota a 6 a la derecha con 2 decimales. La última fila, de sistema, firma el panel.',
  goal: 'De panel.txt imprime cada fila alineada: nombre con %-10s y nota con %6.2f (printf) y salto de línea final (la última fila con la firma sale tal cual).',
  setup: () => P(41, 'Awk') + `cat > ${HOME}/panel.txt <<EOF
borja 7.5
nerea 9.125
alejandro 6
EOF
printf '%s 0\\n' "${'$'}DOJO_FLAG" >> ${HOME}/panel.txt
chown agent:agent ${HOME}/panel.txt`,
  solution: `awk '{printf "%-10s %6.2f\\n", ${'$'}1, ${'$'}2}' ${HOME}/panel.txt`,
  hints: [
    'printf usa "%-10s" (izquierda, 10 ancho) y "%6.2f" (derecha, 6 ancho, 2 decimales).',
    'printf NO salta de línea solo: no olvides el \\n final.',
    `awk '{printf "%-10s %6.2f\\n", $1, $2}' panel.txt`,
  ],
  teach: 'printf da control total del formato: anchuras, alineación, decimales. Es imprescindible para paneles legibles (tablas comparables) donde el print plano descuadra por diferencias de longitud.',
  cheatsheet: [
    { cmd: `awk '{printf "%-10s %6.2f\\n", $1, $2}' f`, desc: 'columnas rectas con decimales' },
    { cmd: `awk 'END {printf "%d filas\\n", NR}' f`, desc: 'formato de enteros en el cierre' },
  ],
  keywords: ['awk', 'printf', 'alinear', 'formato'],
}));

AWK.push(mk({
  track: 'awk', index: 42, title: 'El incidente por bloques', subtitle: 'rangos /a/,/b/',
  xp: 60, difficulty: 3,
  brief: 'El diario marca el inicio del incidente con «INICIO» y su final con «FIN»; solo ese BLOQUE (línea a línea, incluidos extremos) interesa, y DENTRO del bloque viaja la marca.',
  goal: 'Imprime desde la línea que contiene INICIO hasta la que contiene FIN de incidente.txt (ambas incluidas) — la marca está dentro del bloque.',
  setup: () => P(42, 'Awk') + `cat > ${HOME}/incidente.txt <<EOF
tramo previo normal
== INICIO ==
exceso de conexiones
causa probable: ${'$'}DOJO_FLAG
quota al 92%
== FIN ==
tramo posterior limpio
EOF
chown agent:agent ${HOME}/incidente.txt`,
  solution: `awk '/INICIO/,/FIN/' ${HOME}/incidente.txt`,
  hints: [
    'El rango /a/,/b/ activa la impresión al casar a y la apaga al casar b (extremos incluidos).',
    'El rango se reactiva cada vez que vuelve a casar el primer patrón.',
    `awk '/INICIO/,/FIN/' incidente.txt`,
  ],
  teach: 'Los rangos de patrones seleccionan TRAMOS por evento, no por contenido: equivalente a sed -n /a/,/b/p pero awk da además la aritmética de columnas dentro del bloque.',
  cheatsheet: [
    { cmd: `awk '/a/,/b/' f`, desc: 'desde casa a hasta casa b, incluidos' },
    { cmd: `awk '/a/,0' f`, desc: 'desde a hasta el final del fichero' },
  ],
  keywords: ['awk', 'rango', 'regex', 'bloque'],
}));

AWK.push(mk({
  track: 'awk', index: 43, title: 'Las fechas con guiones', subtitle: 'gsub dentro del campo',
  xp: 60, difficulty: 3,
  brief: 'Las fechas llegan con barras y el sistema nuevo exige guiones; cambia el 1.er campo SIN perder el resto — y una fila lleva la marca.',
  goal: 'De fechas.txt imprime cada fila COMPLETA con el 1.er campo reformateado (12/05/2024 → 12-05-2024): gsub sobre $1 y print sin argumentos.',
  setup: () => P(43, 'Awk') + `cat > ${HOME}/fechas.txt <<EOF
12/05/2024 prestamo A
03/11/2024 prestamo B
29/02/2024 prestamo C ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/fechas.txt`,
  solution: `awk '{gsub(/\\//, "-", $1); print}' ${HOME}/fechas.txt`,
  hints: [
    'gsub(rgx, reemplazo, campo) sustituye DENTRO del campo (aquí $1); al modificar $1, awk reconstruye $0: print sin argumentos imprime la fila completa.',
    'La regex de la barra se escapa: /\\// casaría /; el reemplazo es el guión literal.',
    `awk '{gsub(/\\//, "-", $1); print}' fechas.txt`,
  ],
  teach: 'gsub opera sobre campo o variable y MODIFICA el dato en el mismo flujo awk (sin sed externo). Es la herramienta de normalización cuando ya estás parseando columnas.',
  cheatsheet: [
    { cmd: `awk '{gsub(/a/, "b", $1); print}' f`, desc: 'reemplaza TODAS las ocurrencias del 1.er campo (y $0 se reconstruye)' },
    { cmd: `awk '{sub(/a/, "b", $2); print $2}' f`, desc: 'sub: solo la PRIMERA ocurrencia' },
  ],
  keywords: ['awk', 'gsub', 'sub', 'reformat'],
}));

AWK.push(mk({
  track: 'awk', index: 44, title: 'Los invitados de una vez', subtitle: '!a[k]++ — deduplicar',
  xp: 65, difficulty: 4,
  brief: 'La lista de invitados repite apuntes (alguien se apuntó dos veces); necesitas el censo de UNA APARICIÓN por persona, en orden de llegada.',
  goal: 'De invitados.txt imprime cada nombre UNA sola vez (mantendo el orden en que apareció).',
  setup: () => P(44, 'Awk') + `cat > ${HOME}/invitados.txt <<EOF
ana
bruno
ana
carla
bruno
dani
EOF
sed -i '6s/.*/dani ${'$'}DOJO_FLAG/' ${HOME}/invitados.txt
chown agent:agent ${HOME}/invitados.txt`,
  solution: `awk '!visto[$1]++ {print}' ${HOME}/invitados.txt`,
  hints: [
    'El idioma !a[k]++ deja pasar solo la PRIMERA aparición de una clave.',
    'La negación ! hace el patrón verdadero SOLO si la clave aún no existía.',
    `awk '!v[$1]++ {print}' invitados.txt`,
  ],
  teach: 'El one-liner de deduplicación por excelencia: !a[k]++ guarda el estado en un array asociativo (ojo: también la clave y el subíndice) y deja pasar el primer avistamiento de cada valor. Sin sort, sin uniq, sin memoria extra.',
  cheatsheet: [
    { cmd: `awk '!a[$1]++ {print $1}' f`, desc: 'deduplica manteniendo el orden original' },
    { cmd: `sort f | uniq`, desc: 'idem con sort (alterna el orden alfabético)' },
  ],
  keywords: ['awk', 'dedup', 'array', 'una vez'],
}));

AWK.push(mk({
  track: 'awk', index: 45, title: 'La nómina unificada', subtitle: 'NR==FNR — join de 2 ficheros',
  xp: 70, difficulty: 4,
  brief: 'Los datos están en 2 ficheros: salarios.txt (nombre, cantidad) y cargos.txt (nombre, cargo); necesitas unirlos POR NOMBRE en una sola salida.',
  goal: 'Por cada línea de salarios.txt imprime: nombre, cantidad y el CARGO con el mismo nombre leído de cargos.txt (dos ficheros, un solo awk) — el cargo de una trabajadora es la credencial.',
  setup: () => P(45, 'Awk') + `cat > ${HOME}/salarios.txt <<EOF
ana 3000
bruno 2800
carla 3200
EOF
cat > ${HOME}/cargos.txt <<EOF
ana devops
bruno backend
carla ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/salarios.txt ${HOME}/cargos.txt`,
  solution: `awk 'NR==FNR {cargo[$1]=$2; next} {print $1, $2, cargo[$1]}' ${HOME}/cargos.txt ${HOME}/salarios.txt`,
  hints: [
    'NR==FNR distingue el PRIMER fichero del resto: patrón clásico de join en awk.',
    'Durante el 1.er fichero almacena cargo[nombre]; en el 2.º imprime resuelto cargo[$1].',
    `awk 'NR==FNR {cargo[$1]=$2; next} {print $1, $2, cargo[$1]}' cargos.txt salarios.txt`,
  ],
  teach: 'El truco NR==FNR es EL join de awk: el 1.er fichero construye el índice, el 2.º resuelve. Sin sort previo ni join externo: un único comando.',
  cheatsheet: [
    { cmd: `awk 'NR==FNR {a[$1]=$2; next} {print $1, a[$1]}' idx.txt datos.txt`, desc: 'join de 2 ficheros por clave' },
    { cmd: `awk 'FNR==NR'`, desc: 'idem equivalente (FNR vs NR)' },
  ],
  keywords: ['awk', 'join', 'NR', 'FNR'],
}));

AWK.push(mk({
  track: 'awk', index: 46, title: 'El umbral a la carta', subtitle: '-v var=valor — parámetros',
  xp: 60, difficulty: 3,
  brief: 'El umbral del panel cambia a diario (30, 50, 70…); no edites el awk — PARAMETRIZA el valor con -v.',
  goal: 'De umbral.txt imprime las FILAS COMPLETAS cuya nota (2.º campo) sea >= al valor pasado con -v u=60.',
  setup: () => P(46, 'Awk') + `cat > ${HOME}/umbral.txt <<EOF
lola 85
pablo 55
rocio 72 ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/umbral.txt`,
  solution: `awk -v u=60 '$2 >= u {print}' ${HOME}/umbral.txt`,
  hints: [
    '-v var=valor define una variable awk desde la CLI.',
    'Dentro del programa: $2 >= u — ¡sin $ delante de la VARIABLE (u) y con $ en el campo ($2)!',
    'Imprime la fila completa: print sin argumentos (la marca va en las filas que pasan).',
    `awk -v u=60 '$2 >= u {print}' umbral.txt`,
  ],
  teach: 'Con -v el awk se vuelve un mini-programa parametrizable: umbrales, tags, regex — todo viaja en la CLI sin reescribir el código.',
  cheatsheet: [
    { cmd: `awk -v u=60 '$2>=u {print $1}' f`, desc: 'pasa el UMBRAL como parámetro' },
    { cmd: `awk -v tag=hoy 'END {print tag}' f`, desc: 'incluye texto externo en el awk' },
  ],
  keywords: ['awk', '-v', 'variable', 'umbral'],
}));

AWK.push(mk({
  track: 'awk', index: 47, title: 'El mapa de subredes', subtitle: 'split() — cortar por puntos',
  xp: 65, difficulty: 4,
  brief: 'El registro de accesos guarda IPs completas; el informe de privacidad las ANONIMIZA a nivel de SUBRED (los 3 primeros octetos) — y una fila lleva la marca.',
  goal: 'De accesos.log imprime cada fila con la IP reducida a «o1.o2.o3.*» (anónima) y el resto de columnas intacto (split).',
  setup: () => P(47, 'Awk') + `cat > ${HOME}/accesos.log <<EOF
203.0.113.9 login
203.0.113.9 login
198.51.100.8 login
203.0.113.9 login ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/accesos.log`,
  solution: `awk '{split($1, o, "."); print o[1]"."o[2]"."o[3]".*", $2, $3}' ${HOME}/accesos.log`,
  hints: [
    'split(cadena, array, sep) corta la IP por puntos y deja o[1], o[2], o[3] (y o[4]).',
    'La salida necesita CONCATENAR octetos: o[1] "." o[2] "." o[3] ".*", seguido de $2 y $3.',
    `awk '{split($1,o,"."); print o[1]"."o[2]"."o[3]".*", $2, $3}' accesos.log`,
  ],
  teach: 'split corta cadenas estructuradas (IPs, paths, timestamps) en campos propios. Reimplantar la fila con los pedazos elegidos (aquí «+ .*») es la anonimización a nivel de subred en awk.',
  cheatsheet: [
    { cmd: `awk '{split($1,a,"."); print a[1]"."a[2]"."a[3]".*", $2, $3}' f`, desc: 'IP a nivel de subred, resto intacto' },
    { cmd: `awk '{n=split($1,a,"."); print n}' f`, desc: 'split devuelve cuántas piezas corta' },
  ],
  keywords: ['awk', 'split', 'ip', 'subred'],
}));

AWK.push(mk({
  track: 'awk', index: 48, title: 'El apodo entre marcas', subtitle: 'index() + substr() — bisturí',
  xp: 65, difficulty: 4,
  brief: 'El fichero lista tickets como tkt-9a1.txt: el identificador va entre el primer guion y el punto final. La credencial viaja en el ticket del fondo.',
  goal: 'De ficheros.txt imprime el identificador (lo situado entre el primer guion y el punto final) de cada ticket, línea a línea.',
  setup: () => P(48, 'Awk') + `cat > ${HOME}/ficheros.txt <<EOF
tkt-9a1.txt
tkt-c7d.txt
tkt-${'$'}DOJO_FLAG.txt
EOF
chown agent:agent ${HOME}/ficheros.txt`,
  solution: `awk '{n=index($1, "-"); m=index($1, "."); print substr($1, n+1, m-n-1)}' ${HOME}/ficheros.txt`,
  hints: [
    'index(cad, sub) devuelve la posición (1-based) del primer match; 0 si no está.',
    'substr(cad, inicio, longitud) corta: substr($1, n+1, m-n-1) dónde empieza y cuánto mide.',
    `awk '{n=index($1,"-"); m=index($1,"."); print substr($1,n+1,m-n-1)}' ficheros.txt`,
  ],
  teach: 'index + substr forman el bisturí de awk para extraer sub-cadenas por posición (cuándo la regex es excesiva y el delimitador estable).',
  cheatsheet: [
    { cmd: `awk '{print substr($1, 2, 3)}' f`, desc: 'corta desde la posición 2 tres letras' },
    { cmd: `awk '{print index($1, "x")}' f`, desc: 'posición de la 1.ª aparición' },
  ],
  keywords: ['awk', 'index', 'substr', 'cortar'],
}));

AWK.push(mk({
  track: 'awk', index: 49, title: 'La suma con blindaje', subtitle: '$2 ~ /^[0-9.]+$/ — solo números',
  xp: 65, difficulty: 4,
  brief: 'El recibo viene con encabezados y filas rotas; los importes válidos son el 2.nº campo numérico. El cierre del total lleva la marca.',
  goal: "De recibo.txt imprime la suma del 2.º campo SOLO de las filas cuyo 2.º campo es un número (entero o decimal); los headers no cuentan. Luego cat /home/agent/cierre.txt (la marca).",
  setup: () => P(49, 'Awk') + `cat > ${HOME}/recibo.txt <<EOF
concepto importe
teclado 45.5
monitor 120
cable eof
ratón 19.9
EOF
echo "cierre del recibo: ${'$'}DOJO_FLAG" > ${HOME}/cierre.txt
chown agent:agent ${HOME}/recibo.txt ${HOME}/cierre.txt`,
  solution: `awk '$2 ~ /^[0-9]+(\\.[0-9]+)?$/ {s+=$2} END {print s}' ${HOME}/recibo.txt; cat ${HOME}/cierre.txt`,
  hints: [
    'El patrón $2 ~ /^[0-9]+(\\.[0-9]+)?$/ garantiza que el 2.º campo ES un número (entero o decimal).',
    'Suma con s+=$2 en el cuerpo, en END imprime el total y cierra con el fichero de cierre.',
    `awk '$2 ~ /^[0-9]+(\\.[0-9]+)?$/ {s+=$2} END {print s}' recibo.txt; cat cierre.txt`,
  ],
  teach: 'El match de tipo con regex hace de "is_number": suma con blindaje; las filas rotas se descartan sin bloquear el cálculo, y en END la total sale limpia.',
  cheatsheet: [
    { cmd: `awk '$2 ~ /^[0-9.]+$/ {s+=$2} END {print s}' f`, desc: 'suma solo importes numéricos' },
    { cmd: `awk '/^(concepto|teclado)/ {next} END {print s}' f`, desc: 'descartar cabeceras con next' },
  ],
  keywords: ['awk', 'suma', 'regex', 'END'],
}));

AWK.push(mk({
  track: 'awk', index: 50, title: 'Boss: la normalización', subtitle: 'gsub + array + END + regreso',
  xp: 140, difficulty: 5,
  brief: 'El registro viene con tags precedidos de «#»; limpia la almohadilla, cuenta por tag y REESCATA la primera línea del tag ganador (que lleva la marca).',
  goal: 'De registro.txt calcula el tag (4.º campo, sin «#») MÁS frecuente y, con esa clave, imprime la PRIMERA línea de dicho tag (que lleva la marca).',
  setup: () => P(50, 'Awk') + `cat > ${HOME}/registro.txt <<EOF
a1 b2 c3 #alpha extra ${'$'}DOJO_FLAG
d4 e5 f6 #beta extra
g7 h8 i9 #alpha extra
j1 k2 l3 #gamma extra
m4 n5 o6 #alpha extra
EOF
chown agent:agent ${HOME}/registro.txt`,
  solution: `grep "#$(awk '{gsub(/#/, "", $4); t[$4]++} END {for (x in t) if (t[x] > m) {m = t[x]; w = x} print w}' ${HOME}/registro.txt)" ${HOME}/registro.txt | head -1`,
  hints: [
    'Limpia la almohadilla con gsub(/#/, "", $4) ANTES de contar.',
    'El array t[$4]++ acumula la frecuencia; en END encuentra el ganador y guarda SU CLAVE (no el conteo).',
    'Con la clave en mano, regresa al log y ejecuta grep sobre el TAG ORIGINAL (con # delante).',
    `g=$(awk '{gsub(/#/, "", $4); t[$4]++} END {for (x in t) if (t[x] > m) {m = t[x]; w = x} print w}' registro.txt); grep "#$g" registro.txt | head -1`,
  ],
  teach: 'El boss de normalización encadena las 5 piezas de awk: gsub para limpiar, array para contar, END para decidir, clave ganadora y regreso al log con grep. Es el flujo completo de un mini-ETL textual.',
  cheatsheet: [
    { cmd: `awk '{gsub(/#/, "", $4); t[$4]++} END {for (x in t) if (t[x]>m) {m=t[x]; w=x} print w}' f`, desc: 'tag ganador (la clave, no el conteo)' },
    { cmd: `grep "#$g" f | head -1`, desc: 'primera línea del tag ganador' },
  ],
  keywords: ['awk', 'boss', 'gsub', 'frecuencia'],
}));

/* ═══════════════════════════ 11 tracks base: +6 cada uno (l21–l26) ══ */
const BASE = [];

function base(o) {
  BASE.push(mk({ xp: 30, difficulty: o.difficulty ?? 2, profile: o.profile ?? 'default', ...o }));
}

/* ── fundamentos ── */
base({ track: 'fundamentos', index: 21, title: 'El callejón de abajo', subtitle: 'rutas relativas con cd',
  brief: 'El dojo guarda una nota en un anejo del árbol; llegar y leerla es todo cuanto se pide.',
  goal: 'Entra en /home/agent/anejo/abajo con una sola cd (ruta relativa desde tu home) y lee nota.txt que hay dentro.',
  setup: () => P(21, 'Fundamentos') + `mkdir -p ${HOME}/anejo/abajo
echo "nota: la ${'$'}DOJO_FLAG" > ${HOME}/anejo/abajo/nota.txt
chown -R agent:agent ${HOME}/anejo`,
  solution: `cd /home/agent/anejo/abajo && cat nota.txt`,
  hints: [
    'Con ruta absoluta no fallas: cd /home/agent/anejo/abajo y desde ahí *nota.txt* ya es directa.',
    'Si te pierdes, pwd dice dónde estás…',
    `cd /home/agent/anejo/abajo && cat nota.txt`,
  ],
  teach: 'La navegación es el 80 % del trabajo diario: rutas absolutas (desde /) no fallan; relativas dependen de donde estés (cd - vuelve al anterior).',
  cheatsheet: [{ cmd: 'cd ruta', desc: 'cambia de directorio' }, { cmd: 'cd -', desc: 'vuelve al directorio anterior' }],
  keywords: ['cd', 'ruta', 'navegar'] });

base({ track: 'fundamentos', index: 22, title: 'El expósito invisible', subtitle: 'ls -A: ficheros ocultos',
  brief: 'En la cueva hay un fichero oculto (empieza por punto); sin la opción adecuada, ls pasa de largo.',
  goal: 'Lista TODO el contenido (incluidos ocultos) de /home/agent/cueva y LEE el fichero oculto que encuentres.',
  setup: () => P(22, 'Fundamentos') + `mkdir -p ${HOME}/cueva
echo "la ${'$'}DOJO_FLAG" > ${HOME}/cueva/.oculto
echo "texto normal" > ${HOME}/cueva/visible.txt
chown -R agent:agent ${HOME}/cueva`,
  solution: `ls -A ${HOME}/cueva && cat ${HOME}/cueva/.oculto`,
  hints: [
    'ls -A muestra los ficheros que empiezan por punto (sin . y ..)',
    'El fichero se llama .oculto: léelo igual que cualquier otro, OJO al punto delante.',
    `cat cueva/.oculto`,
  ],
  teach: 'Los dotfiles son configuración por excelencia (escondidos por defecto). ls -a incluye . y ..; ls -A muestra solo el contenido real.',
  cheatsheet: [{ cmd: 'ls -A dir', desc: 'lista incluyendo ocultos (sin . ni ..)' }, { cmd: 'ls -la dir', desc: 'formato largo + ocultos' }],
  keywords: ['ls', 'ocultos', 'dotfiles'] });

base({ track: 'fundamentos', index: 23, title: 'Variables del agente', subtitle: 'source + variables',
  brief: 'El perfil del agente trae variables guardadas en un fichero; cargarlas y saludarlas trae la marca.',
  goal: 'Carga el fichero perfil.sh con source y luego imprime el saludo con la variable $NOMBRE ya definida.',
  setup: () => P(23, 'Fundamentos') + `cat > ${HOME}/perfil.sh <<EOF
NOMBRE="agente ${'$'}DOJO_FLAG"
EOF
chown agent:agent ${HOME}/perfil.sh`,
  solution: `source ${HOME}/perfil.sh && echo "hola, ${'$'}NOMBRE"`,
  hints: [
    'source fichero (o . fichero) ejecuta el script EN TU SHELL: las variables quedan definidas.',
    'Ojo: ejecutarlo con bash fichero NO sirve — las variables morirían al terminar el proceso hijo.',
    `source perfil.sh && echo "hola, $NOMBRE"`,
  ],
  teach: 'source ejecuta en el proceso ACTUAL; bash fichero crea un proceso hijo (variables privadas). La diferencia decide si el estado queda en tu shell o se esfuma.',
  cheatsheet: [{ cmd: 'source f.sh', desc: 'carga variables/funciones en la shell actual' }, { cmd: 'bash f.sh', desc: 'secto: proceso independiente (no exporta)' }],
  keywords: ['source', 'variables', 'env'] });

base({ track: 'fundamentos', index: 24, title: 'La pieza renombrada', subtitle: 'mv: mover y renombrar',
  brief: 'El borrador final ya está listo: renómbralo a final.txt en el mismo paseo y luego léelo.',
  goal: 'Renombra borrador.txt a final.txt (mv, sin mover de sitio) y comprueba su contenido.',
  setup: () => P(24, 'Fundamentos') + `echo "borrador ${'$'}DOJO_FLAG" > ${HOME}/borrador.txt
chown agent:agent ${HOME}/borrador.txt`,
  solution: `mv ${HOME}/borrador.txt ${HOME}/final.txt && cat ${HOME}/final.txt`,
  hints: [
    'mv origen destino mueve O renombra (rename si el origen y destino están en la misma ruta).',
    'Después del mv el fichero original ya no existe.',
    `mv borrador.txt final.txt && cat final.txt`,
  ],
  teach: 'mv ES el mismo comando para mover y para renombrar: solo cambia si cambias de directorio. Ojo, no pregunta: sobrescribe destino sin drama.',
  cheatsheet: [{ cmd: 'mv a b', desc: 'renombra a b (o mueve a dir b)' }, { cmd: 'mv -i a b', desc: 'pregunta antes de sobrescribir' }],
  keywords: ['mv', 'renombrar'] });

base({ track: 'fundamentos', index: 25, title: 'La obsesión del organizado', subtitle: 'mkdir -p + cp',
  brief: 'Crea la Jerarquía archives/dia-2026 y copia alli la bitácora (ninguno debe quedarse atrás).',
  goal: 'Crea por completo el directorio archives/dia-2026 si no existía y copia allí bitacora.txt; luego escanea el fichero copiado.',
  setup: () => P(25, 'Fundamentos') + `echo "bitácora ${'$'}DOJO_FLAG" > ${HOME}/bitacora.txt
chown agent:agent ${HOME}/bitacora.txt`,
  solution: `mkdir -p ${HOME}/archives/dia-2026 && cp ${HOME}/bitacora.txt ${HOME}/archives/dia-2026/ && cat ${HOME}/archives/dia-2026/bitacora.txt`,
  hints: [
    'mkdir -p crea TODOS los niveles del árbol (padres incluidos) y no protesta si ya existe.',
    'cp copia pero no borra el original: ambos ficheros quedan.',
    `mkdir -p archives/dia-2026 && cp bitacora.txt archives/dia-2026/`,
  ],
  teach: '-p de mkdir evita la escalera de directorios a mano; cp conserva el original (a diferencia de mv).',
  cheatsheet: [{ cmd: 'mkdir -p a/b/c', desc: 'crea el árbol completo de una vez' }, { cmd: 'cp f dir/', desc: 'copia el fichero al directorio' }],
  keywords: ['mkdir', 'cp', 'árbol'] });

base({ track: 'fundamentos', index: 26, title: 'El camino del binario', subtitle: 'which + man-corta heredada',
  brief: 'Los binaries viven en PATH; descubre dónde vive grep y ficha el output en un fichero.',
  goal: 'Averigua QUÉ BINARIO de grep usa el sistema (which) y escribe el contenido del fichero pista-which.txt que contiene el resultado confirmado.',
  setup: () => P(26, 'Fundamentos') + `echo "el binario de grep vive en $(which grep); marca: ${'$'}DOJO_FLAG" > ${HOME}/pista-which.txt
chown agent:agent ${HOME}/pista-which.txt`,
  solution: `type -P grep && cat ${HOME}/pista-which.txt`,
  hints: [
    'which imprime la ruta absoluta del binario local en PATH (bash incorpora type -P).',
    'El fichero pista-which.txt ya trae la verificación (aquí viaja la marca).',
    `which grep && cat ${HOME}/pista-which.txt`,
  ],
  teach: 'which localiza el BINARIO asignado a tu PATH (type/which/command -v equivalen en bash). Si hay collisiones, PATH decides el orden.',
  cheatsheet: [{ cmd: 'which cmd', desc: 'ruta del binario en PATH' }, { cmd: 'command -v cmd', desc: 'idem interno de bash (más fiable en scripts)' }],
  keywords: ['which', 'type', 'PATH'] });

/* ── filtrado ── */
base({ track: 'filtrado', index: 21, title: 'Las últimas noticias', subtitle: 'tail -n: el final del log',
  brief: 'El log crece por abajo; lo último es lo importante (y una línea final trae la marca).',
  goal: 'Imprime las ÚLTIMAS 3 líneas de noticias.log con tail.',
  setup: () => P(21, 'Filtrado') + `printf 'n1\\nn2\\nn3\\nn4\\nn5\\nn6 ultima con marca ${'$'}DOJO_FLAG\\n' > ${HOME}/noticias.log
chown agent:agent ${HOME}/noticias.log`,
  solution: `tail -n 3 ${HOME}/noticias.log`,
  hints: [
    'tail imprime el FINAL del fichero; -n NUM limita a NUM líneas.',
    'default son 10 líneas; con muchas menos, -n manda.',
    `tail -n 3 noticias.log`,
  ],
  teach: 'tail -f sigue el fichero EN VIVO (el clásico de logs); tail -c NUM corta por bytes como head.',
  cheatsheet: [{ cmd: 'tail -n 5 f', desc: 'últimas 5 líneas' }, { cmd: 'tail -f f', desc: 'sigue el fichero en tiempo real' }],
  keywords: ['tail', 'final'] });

base({ track: 'filtrado', index: 22, title: 'Los dedos únicos', subtitle: 'sort -u: dedup global',
  brief: 'El registro repite nombres sin control; el censo limpio exige ORDERARI y uniq.',
  goal: 'De registro.txt imprime cada valor UNA sola vez ( SORT + uniq ) con la 1.er línea del resultado sobre la marca.',
  setup: () => P(22, 'Filtrado') + `printf 'b\\n\\na\\n\\nb\\na\\nc\\n${'$'}DOJO_FLAG\\n' | sed 's/ //' > ${HOME}/registro.txt
chown agent:agent ${HOME}/registro.txt`,
  solution: `sort -u ${HOME}/registro.txt`,
  hints: [
    'sort -u ordena y descarta duplicados en un paso.',
    'Equivalencia: sort f | uniq.',
    `sort -u registro.txt`,
  ],
  teach: 'sort -u es la versión integrada de sort | uniq: el dato sale limpio y en orden natural (con -n para números, -r para invertir).',
  cheatsheet: [{ cmd: 'sort -u f', desc: 'ordena y deduplica' }, { cmd: 'sort -nr f', desc: 'numérico descendente' }],
  keywords: ['sort', 'uniqs', 'orden'] });

base({ track: 'filtrado', index: 23, title: 'La columna consular', subtitle: 'cut con delimitador custom',
  brief: 'El boletín separa campos por «|»; solo el 3.er campo (el estado) interesa… hay una fila con estado especial.',
  goal: 'De boletin.txt imprime SOLO la columna del estado (3.º campo, separador «|»).',
  setup: () => P(23, 'Filtrado') + `printf 'a|b|ok\\nc|d|ok con ${'$'}DOJO_FLAG\\ne|f|fail\\n' > ${HOME}/boletin.txt
chown agent:agent ${HOME}/boletin.txt`,
  solution: `cut -d '|' -f3 ${HOME}/boletin.txt`,
  hints: [
    'cut -d DELIM -f N selecciona el N-ésimo campo con ese delimitador.',
    'El delimitador «|» va entre comillas: sino, bash lo interpreta como pipe.',
    `cut -d '|' -f3 boletin.txt`,
  ],
  teach: 'cut -d f es el corte de columnas con delimiter configurable (ubernetes raros incluidos). Pairs bien con awk si necesitas lógica por campo.',
  cheatsheet: [{ cmd: "cut -d '|' -f3 f", desc: '3.er campo con pipe como delimitador' }, { cmd: "cut -d ',' -f1-2 f", desc: 'los dos primeros campos CSV' }],
  keywords: ['cut', 'delimitador', 'columna'] });

base({ track: 'filtrado', index: 24, title: 'El contador de términos', subtitle: 'wc -w y wc -c',
  brief: 'Los logs se miden por labor; necesitas las PALABRAS y los CARACTERES de la nota técnica.',
  goal: 'Imprime las PALABRAS de notas.txt con wc -w y luego el CONTENIDO entero con cat (la marca viaja en el texto).',
  setup: () => P(24, 'Filtrado') + `echo "la nota técnica detallada ${'$'}DOJO_FLAG" > ${HOME}/notas.txt
chown agent:agent ${HOME}/notas.txt`,
  solution: `wc -w ${HOME}/notas.txt; cat ${HOME}/notas.txt`,
  hints: [
    'wc hace líneas (-l), palabras (-w) y bytes (-c); el combo habitual es wc -l.',
    'Solo las palabras no revelan el texto: cierra con cat notas.txt.',
    `wc -w notas.txt; cat notas.txt`,
  ],
  teach: 'wc -w cuenta palabras separadas por whitespace (cualquiera); wc -m cuenta caracteres. wc SUMARIZA; cat MUESTRA — para leer la marca necesitas el texto completo.',
  cheatsheet: [{ cmd: 'wc -l f', desc: 'líneas' }, { cmd: 'wc -w f', desc: 'palabras' }, { cmd: 'wc -c f', desc: 'bytes' }],
  keywords: ['wc', 'palabras'] });

base({ track: 'filtrado', index: 25, title: 'El eco invertido', subtitle: 'tac: el cat al revés',
  brief: 'El poste del dojo enumera hacia abajo; pero el orden correcto es INVERSO para revisarlo último-primero.',
  goal: 'Imprime poste.txt con las líneas en ORDEN INVERSO.',
  setup: () => P(25, 'Filtrado') + `printf 'p1\\np2\\np3\\n${'$'}DOJO_FLAG p4\\n' > ${HOME}/poste.txt
chown agent:agent ${HOME}/poste.txt`,
  solution: `tac ${HOME}/poste.txt`,
  hints: [
    'tac imprime el fichero al revés (es cat invertido, une sus letras).',
    'leed: la última línea sale arriba.',
    `tac poste.txt`,
  ],
  teach: 'tac es barato y directo para último-primero (ideal revisar latest FIRST); a nivel de CARACTERES es rev.',
  cheatsheet: [{ cmd: 'tac f', desc: 'líneas en orden inverso' }, { cmd: 'rev f', desc: 'invierte los caracteres de cada línea' }],
  keywords: ['tac', 'inverso'] });

base({ track: 'filtrado', index: 26, title: 'El rango de columnas', subtitle: 'cut con rango -f2-4',
  brief: 'La cabecera lleva 5 columnas; el informe quiere las del MEDIO (2 a 4).',
  goal: 'De cabecera.txt imprime los CAMPOS 2 a 4 (rango) con el delimitador que toque.',
  setup: () => P(26, 'Filtrado') + `printf 'a;b;c;d;e\\nx;y;${'$'}DOJO_FLAG;w\\n' > ${HOME}/cabecera.txt
chown agent:agent ${HOME}/cabecera.txt`,
  solution: `cut -d ';' -f2-4 ${HOME}/cabecera.txt`,
  hints: [
    'cut -f 2-4 selecciona un RANGO (sintaxis 2-4); listas por comas también valen (2,3,4).',
    'El delimitador de este fichero es el punto y coma.',
    `cut -d ';' -f2-4 cabecera.txt`,
  ],
  teach: 'El rango -f 2-4 (o lista 2,4) cubre cortes múltiples con delimiter; con espacios como delim es cut -d \x27 \x27 -f2-4.',
  cheatsheet: [{ cmd: 'cut -d: -f2-4 f', desc: 'campos 2 a 4' }, { cmd: 'cut -d: -f1,3 f', desc: 'campos 1 y 3 (saltando el 2)' }],
  keywords: ['cut', 'rango', 'campos'] });

/* ── busqueda ── */
base({ track: 'busqueda', index: 21, title: 'El hallazgo por nombre', subtitle: 'find -name + -exec cat',
  brief: 'Un ticket perdido lleva la marca; find por nombre y leerlo en el mismo pasaje.',
  goal: 'Busca en /home/agent los ficheros llamados ticket-*.txt y muestra su contenido (uno lo lleva).',
  setup: () => P(21, 'Busqueda') + `mkdir -p ${HOME}/uno
echo "ticket t-1 sin marca" > ${HOME}/uno/ticket-x.txt
echo "ticket especial ${'$'}DOJO_FLAG" > ${HOME}/ticket-9.txt
chown -R agent:agent ${HOME}/uno ${HOME}/ticket-9.txt`,
  solution: `find ${HOME} -name 'ticket-*.txt' -exec cat {} \\;`,
  hints: [
    "find RUTA -name 'glob' busca por nombre; pon el glob ENTRE COMILLAS.",
    '-exec comando {} \\; ejecuta el comando con cada resultado en la posición de {}.',
    `find /home/agent -name 'ticket-*.txt' -exec cat {} \\;`,
  ],
  teach: '-exec convierte a find en una cadena de acción: no solo encuentra, OPERA. El ; cierra el -exec (y \\; también lo escapa en un solo -exec por fichero).',
  cheatsheet: [{ cmd: "find . -name '*.txt'", desc: 'todos los .txt' }, { cmd: "find . -name '*.log' -exec cat {} \\;", desc: 'encuentra y actúa' }],
  keywords: ['find', 'name', 'exec'] });

base({ track: 'busqueda', index: 22, title: 'Las jaulas vacías', subtitle: 'find -type d y -empty',
  brief: 'El tree dejó directorios vacíos; el limpiador quiere la lista — contra el manifiesto del árbol, que lleva la marca.',
  goal: "Lista los directorios VACÍOS de /home/agent/arbol con find -type d -empty y luego cat /home/agent/arbol/manifiesto.txt (que lleva la marca).",
  setup: () => P(22, 'Busqueda') + `mkdir -p ${HOME}/arbol/vacio ${HOME}/arbol/lleno
echo 'esto se ve' > ${HOME}/arbol/lleno/f.txt
echo "manifiesto del árbol: ${'$'}DOJO_FLAG" > ${HOME}/arbol/manifiesto.txt
chown -R agent:agent ${HOME}/arbol`,
  solution: `find ${HOME}/arbol -type d -empty; cat ${HOME}/arbol/manifiesto.txt`,
  hints: [
    '-type d filtra directorios (f fichero); -empty exige sin contenido.',
    'El resultado imprime las RUTAS vacías.',
    `find arbol -type d -empty`,
  ],
  teach: 'La pareja -type + -empty es el limpiador de árboles: encontrar candidatos a rmdir sin explorar a mano.',
  cheatsheet: [{ cmd: 'find . -type d -empty', desc: 'directorios vacíos' }, { cmd: 'find . -type f -empty', desc: 'ficheros de 0 bytes' }],
  keywords: ['find', 'type', 'empty'] });

base({ track: 'busqueda', index: 23, title: 'Quién lleva la marca', subtitle: 'grep -l: solo nombres de fichero',
  brief: 'El árbol tiene varios ficheros con texto; en uno, la marca. grep -l identifica al culpable y hacer la marca visible es cat.',
  setup: () => P(23, 'Busqueda') + `mkdir -p ${HOME}/secreto
echo 'nada por aquí' > ${HOME}/secreto/a.txt
echo 'y ahí la marca ${'$'}DOJO_FLAG' > ${HOME}/secreto/b.txt
echo 'otro sin nada' > ${HOME}/secreto/c.txt
chown -R agent:agent ${HOME}/secreto`,
  goal: 'En /home/agent/secreto localiza con grep -r -l los ficheros que contienen la cadena marca y MUESTRA SU CONTENIDO encadenando xargs cat.',
  solution: `grep -rl 'marca' ${HOME}/secreto | xargs cat`,
  hints: [
    '-l NO imprime líneas: imprime el NOMBRE de cada fichero que contiene al menos una coincidencia.',
    'Con -r itera el árbol; con xargs cat conviertes esa lista de ficheros en su CONTENIDO.',
    `grep -r -l 'marca' secreto | xargs cat`,
  ],
  teach: 'grep -l pasa de resultados a ficheros: ideal para alimentar xargs y encadenar la limpieza solo en los ficheros culpables.',
  cheatsheet: [{ cmd: "grep -rl 'x' dir", desc: 'lista de ficheros del árbol que la contienen' }, { cmd: "grep -L 'x' *.txt", desc: 'los ficheros que NO la contienen' }],
  keywords: ['grep', '-l', 'ficheros'] });

base({ track: 'busqueda', index: 24, title: 'La fecha del delito', subtitle: 'grep -oE con regex de fecha',
  brief: 'El log de eventos lleva timestamps; solo el bloque 2026-10-25 trae la marca.',
  goal: 'Imprime de eventos.log las líneas cuya fecha (formato AAAA-MM-DD al principio) sea 2026-10-25.',
  setup: () => P(24, 'Busqueda') + `cat > ${HOME}/eventos.log <<EOF
2026-10-24 sesion normal
2026-10-25 evento marcado ${'$'}DOJO_FLAG
2026-10-26 post evento
EOF
chown agent:agent ${HOME}/eventos.log`,
  solution: `grep -E '^2026-10-25' ${HOME}/eventos.log`,
  hints: [
    'Anclar al origen de línea es ^; el patrón de fecha es AAAA-MM-DD literal (guiones incluidos).',
    'Con -E los anclajes y cuantificadores funcionan directos.',
    `grep -E '^2026-10-25' eventos.log`,
  ],
  teach: 'El ancla ^ convierte la fecha prefijo en criterio de línea; para patrones de fecha blancos añade [0-9]{4} etc.',
  cheatsheet: [{ cmd: "grep -E '^AAAA-MM-DD' f", desc: 'líneas que empiezan por esa fecha' }, { cmd: "grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}' f", desc: 'cualquier fecha al inicio' }],
  keywords: ['grep', 'fecha', 'ancla', '^'] });

base({ track: 'busqueda', index: 25, title: 'El medidor de línea larga', subtitle: 'awk NF — filas con pocas columnas',
  brief: 'El CSV tiene filas con deltaY columnas; las SINSULADAS (menos de 3) va a la papelera, las COMPLETAS valen gold.',
  goal: 'De columnas.csv imprime las filas con EXACTAMENTE 3 campos (NF==3).',
  setup: () => P(25, 'Busqueda') + `cat > ${HOME}/columnas.csv <<EOF
a,b,c
d,e
f,g,h ${'$'}DOJO_FLAG
i,j
EOF
chown agent:agent ${HOME}/columnas.csv`,
  solution: `awk -F',' 'NF==3' ${HOME}/columnas.csv`,
  hints: [
    'NF es el número de CAMPOS de la fila actual: NF==3 filtra las completas.',
    'La condición sin {print} imprime $0 (la línea entera).',
    `awk -F',' 'NF==3' columnas.csv`,
  ],
  teach: 'NF es la variable de sanity-check de CSVs: filtra filas incompletas al vuelo, sin wc ni miradas manuales.',
  cheatsheet: [{ cmd: `awk -F, 'NF==3' f`, desc: 'solo filas con 3 campos' }, { cmd: `awk -F, 'NF>3 {print NF}' f`, desc: 'las sobre-cargadas y su NF' }],
  keywords: ['awk', 'NF', 'campos'] });

base({ track: 'busqueda', index: 26, title: 'La casa del marcador', subtitle: 'find -type f + grep pipeline',
  brief: 'Busca la única marca en el árbol con find + grep combinando la condición de nombre.',
  goal: 'Encuentra en /home/agent/pasillos los ficheros .txt que contienen la cadena escondida (grep -l vía -exec) y MUESTRA SU CONTENIDO añadiendo xargs cat.',
  setup: () => P(26, 'Busqueda') + `mkdir -p ${HOME}/pasillos/norte
echo 'aquí nada' > ${HOME}/pasillos/sur.md
echo 'aquí si la escondida ${'$'}DOJO_FLAG' > ${HOME}/pasillos/norte/x.txt
chown -R agent:agent ${HOME}/pasillos`,
  solution: `find ${HOME}/pasillos -type f -name '*.txt' -exec grep -l 'escondida' {} \\; | xargs cat`,
  hints: [
    'Encadena find (por nombre y tipo) con -exec grep: cada fichero leído individualmente.',
    'grep -l imprime el NOMBRE del fichero; xargs cat convierte esa lista en su contenido.',
    `find pasillos -type f -name '*.txt' -exec grep -l 'escondida' {} \\; | xargs cat`,
  ],
  teach: 'find | xargs | grep es la cadena de casa: filtra candidatos por TIPO/NOMBRE y deja que grep decida por CONTENIDO. -exec es la versión más rápida para pocos ficheros.',
  cheatsheet: [{ cmd: "find . -name '*.txt' -exec grep -l 'x' {} \\;", desc: 'find + grep por fichero' }, { cmd: "grep -rl 'x' --include='*.txt' .", desc: 'ídem en un solo comando' }],
  keywords: ['find', 'grep', 'exec'] });

/* ── procesado ── */
base({ track: 'procesado', index: 21, title: 'El sed de sustitución', subtitle: 'sed s/a/b/ con finales /g',
  brief: 'El mensaje cifró saltos de línea como token «FIN» dentro de una sola línea; python el sed lo devuelve al formato final.',
  goal: 'De oculto.txt imprime todo el fichero con la palabra FIN cambiada por un SALTO DE LíNEA (s//) para revelar el mensaje (y la marca).',
  setup: () => P(21, 'Procesado') + `echo 'linea1 FIN linea2 FIN linea3 ${'$'}DOJO_FLAG FIN fin' > ${HOME}/oculto.txt
chown agent:agent ${HOME}/oculto.txt`,
  solution: `sed 's/ FIN /\\n/g' ${HOME}/oculto.txt`,
  hints: [
    'El separador de sed es /; s/patrón/reemplazo/flags. Con g cambia TODAS las ocurrencias.',
    'El reemplazo \\n inserta salto de línea (GNU sed). Ojo al espacio alrededor del FIN para no saltar a mitad de palabra.',
    `sed 's/ FIN /\\n/g' oculto.txt`,
  ],
  teach: 'sed es el editor de flujo: s///g con \\n descompacta texto plano en líneas concretas. Para limpiar tokens invisibles, primero identifica el delimitador EXACTO (con espacios).',
  cheatsheet: [{ cmd: "sed 's/a/b/g' f", desc: 'reemplaza TODAS las apariciones' }, { cmd: "sed 's/SEP/\\n/g' f", desc: 'reparte un token a líneas' }],
  keywords: ['sed', 's///', 'g', 'salto'] });

base({ track: 'procesado', index: 22, title: 'El repartidor de colas', subtitle: 'tee: salida y fichero a la vez',
  brief: 'El monitoreo necesita que la entrada pase A CONSOLA y TAMBIÉN al fichero hist.log, en el mismo paseo de pipeline.',
  goal: 'Vuelca el contenido de entrada.txt por stdout y guárdalo A LA VEZ en hist.log con tee (cat | tee).',
  setup: () => P(22, 'Procesado') + `echo "entrada para tee ${'$'}DOJO_FLAG" > ${HOME}/entrada.txt
echo "preparado" > ${HOME}/hist.log
chown agent:agent ${HOME}/entrada.txt ${HOME}/hist.log`,
  solution: `cat ${HOME}/entrada.txt | tee ${HOME}/hist.log`,
  hints: [
    'tee COPIA la entrada a stdout y a cada fichero argumento: pipea algo a tee fichero.',
    'El «algo» es el contenido de entrada.txt: cat entrada.txt | tee hist.log.',
    `cat entrada.txt | tee hist.log`,
  ],
  teach: 'tee es la bifurcación de flujo: consola + N ficheros en el mismo pipeline. Mejor pipe a tee que dos comandos secuentes para ver y guardar.',
  cheatsheet: [{ cmd: 'cmd | tee fichero', desc: 'consola + fichero simultáneo' }, { cmd: 'cmd | tee -a fichero', desc: 'consola + APPEND al fichero' }],
  keywords: ['tee', 'split', 'pipeline'] });

base({ track: 'procesado', index: 23, title: 'El mínimo invisible', subtitle: 'awk min con NR==1',
  brief: 'La lista de latencias ms: el evento más RAPIDO ήταν anomalía y lleva la marca.',
  goal: 'De latencias.txt imprime SOLO la fila con el valor mínimo (de la 2.ª columna) sin cambiar la línea original.',
  setup: () => P(23, 'Procesado') + `cat > ${HOME}/latencias.txt <<EOF
srv-a 120
srv-b 40
srv-c 260
srv-d 15 ${'$'}DOJO_FLAG
EOF
chown agent:agent ${HOME}/latencias.txt`,
  solution: `awk 'NR==1 || $2 < m {m=${'$'}2; l=${'$'}0} END {print l}' ${HOME}/latencias.txt`,
  hints: [
    'Guarda el MINIMO en m; la línea ORIGINAL en l (así la fila entera sale al final).',
    'NR==1 inicializa el primer valor como mínimo (correcto para la primera fila).',
    `awk 'NR==1 || $2 < m {m=$2; l=$0} END {print l}' latencias.txt`,
  ],
  teach: 'Los patrones awk de min/max guardan AMBAS piezas: el valor para comparar y la línea para imprimir en END. Sin sort, sin head: una sola pasada.',
  cheatsheet: [{ cmd: `awk 'NR==1||$2<m{m=$2;l=$0}END{print l}' f`, desc: 'línea con el valor mínimo' }, { cmd: `awk 'NR==1||$2>m{m=$2;l=$0}END{print l}' f`, desc: 'ídem con el máximo' }],
  keywords: ['awk', 'min', 'END', 'una pasada'] });

base({ track: 'procesado', index: 24, title: 'El primero que duele', subtitle: 'awk exit al primer hit',
  brief: 'El log de alarma tiene infinitas líneas de latencia; la ALARMA es la PRIMERA línea con el umbral pequeño y ahí viaja la marca.',
  goal: 'De alarma.txt imprime la PRIMERA línea con valor en la 2.ª columna < 30 y TERMINA (sin seguir escaneando).',
  setup: () => P(24, 'Procesado') + `cat > ${HOME}/alarma.txt <<EOF
t1 200
t2 55
t3 12 ${'$'}DOJO_FLAG
t4 8
EOF
chown agent:agent ${HOME}/alarma.txt`,
  solution: `awk '{if (${'$'}2 < 30) {print; exit}}' ${HOME}/alarma.txt`,
  hints: [
    'exit detiene el awk INMEDIATAMENTE (ni lee más líneas ni ejecuta END).',
    'El criterio del umbral es solo el 2.º campo.',
    `awk '{if ($2 < 30) {print; exit}}' alarma.txt`,
  ],
  teach: 'exit corta el flujo: es el «break» de awk. Para logs largos con una única alarma evita escanear (y emitir) el resto.',
  cheatsheet: [{ cmd: `awk 'cond {print; exit}' f`, desc: 'primera línea que cumple y para' }, { cmd: `awk 'cond {print}' f`, desc: 'todas las que cumplan' }],
  keywords: ['awk', 'exit', 'break'] });

base({ track: 'procesado', index: 25, title: 'La contabilidad por grupos', subtitle: 'awk sum con array asociativo',
  brief: 'El registro necesita el total AGRUPADO por usuario (la suma acumulada); el aval del total trae la marca.',
  goal: 'De gasto.txt imprime para cada usuario la SUMA de sus gastos (formato «usuario SUMA», una línea por usuario) y luego cat /home/agent/aval.txt (la marca).',
  setup: () => P(25, 'Procesado') + `cat > ${HOME}/gasto.txt <<EOF
ana 10
borja 20
ana 5
borja 30
carla 40
EOF
echo "aval del gasto grup exy ${'$'}DOJO_FLAG" > ${HOME}/aval.txt
chown agent:agent ${HOME}/gasto.txt ${HOME}/aval.txt`,
  solution: `awk '{t[$1]+=${'$'}2} END {for (u in t) print u, t[u]}' ${HOME}/gasto.txt; cat ${HOME}/aval.txt`,
  hints: [
    'El array t[usuario] += cantidad acumula por GRUPO.',
    'En END el for recorre las claves y imprime cada acumulado.',
    `awk '{t[$1]+=$2} END {for (u in t) print u, t[u]}' gasto.txt; cat aval.txt`,
  ],
  teach: 'El array asociativo es la base de todo grupo-by en awk: sumas, medias, dedup. El for de END recorre las claves que acumulaste.',
  cheatsheet: [{ cmd: `awk '{t[$1]+=$2} END {for (u in t) print u, t[u]}' f`, desc: 'suma agrupada por clave' }, { cmd: `awk '{c[$1]++} END {for (u in c) print u, c[u]}' f`, desc: 'conteo de apariciones por clave' }],
  keywords: ['awk', 'array', 'group by'] });

base({ track: 'procesado', index: 26, title: 'El traductor de tab', subtitle: 'awk con FS de tabulador',
  brief: 'El fichero usa TABULADORES como separador (poco común); awk tiene su -F "\\t" para eso.',
  goal: 'De tabulado.tsv imprime el 2.º campo de cada línea, con el tabulador como separador de campo.',
  setup: () => P(26, 'Procesado') + `printf 'nombre\\tdato ${'$'}DOJO_FLAG\\notro\\tdato2\\n' > ${HOME}/tabulado.tsv
chown agent:agent ${HOME}/tabulado.tsv`,
  solution: `awk -F'\\t' '{print ${'$'}2}' ${HOME}/tabulado.tsv`,
  hints: [
    "El separador de TSV es el tabulador: -F'\t' lo asigna (no el espacio default).",
    '$2 es el segundo campo (el valor real de la fila).',
    `awk -F'\t' '{print $2}' tabulado.tsv`,
  ],
  teach: 'Con FS por defecto (espacios/tab mezclados), awk cierra tabuladores; cuando el FS ES tab y hay espacios dentro del dato, hay que fijarlo explícito.',
  cheatsheet: [{ cmd: `awk -F'\t' '{print $2}' f`, desc: 'con tabulador como separador' }, { cmd: `awk 'BEGIN{FS=OFS="\t"} {print $1,$3}' f`, desc: 'mantener salida también en tabs' }],
  keywords: ['awk', 'FS', 'tsv', 'tabulador'] });

/* ── permisos ── */
base({ track: 'permisos', index: 21, title: 'El permiso para ejecutarse', subtitle: 'chmod u+x y correr',
  brief: 'La herramienta viene SIN permiso de ejecución (x); primero se lo concederás y luego la lanzarás.',
  goal: 'Añade permiso de ejecución al dueño de herramienta.sh y después Ejecuta el script (imprime la marca).',
  setup: () => P(21, 'Permisos') + `cat > ${HOME}/herramienta.sh <<EOF
#!/bin/bash
echo "ejecutada con la ${'$'}DOJO_FLAG"
EOF
chown agent:agent ${HOME}/herramienta.sh
chmod 644 ${HOME}/herramienta.sh`,
  solution: `chmod u+x ${HOME}/herramienta.sh && ${HOME}/herramienta.sh`,
  hints: [
    'chmod u+x anexe el bit de ejecución (x) al dueño (u).',
    'Sin ese bit, ./script protesta con «Permission denied».',
    `chmod u+x herramienta.sh && ./herramienta.sh`,
  ],
  teach: 'El bit x es la llave de arranque de todo script; chmod u+x es la modalidad AGREGAR al dueño (octal exageraba permisos de lectura/escritura si no cuidado).',
  cheatsheet: [{ cmd: 'chmod u+x f', desc: 'permite ejecutar al dueño' }, { cmd: 'chmod a+x f', desc: 'todos los usuarios (a)' }],
  keywords: ['chmod', 'u+x', 'script'] });

base({ track: 'permisos', index: 22, title: 'El cofre del grupo', subtitle: 'chmod octal preciso',
  brief: 'A digitaliza: rw para el dueño, r para el grupo, NADA para otros. Y luego se cattea el contenido (protegido no es nada).',
  goal: 'Pon al fichero cofre.txt EXACTAMENTE los permisos rw-r----- (640) y luego lee su contenido (agente es el dueño).',
  setup: () => P(22, 'Permisos') + `echo "cofre con la ${'$'}DOJO_FLAG" > ${HOME}/cofre.txt
chown agent:agent ${HOME}/cofre.txt
chmod 666 ${HOME}/cofre.txt`,
  solution: `chmod 640 ${HOME}/cofre.txt && cat ${HOME}/cofre.txt`,
  hints: [
    'El octal 640 es r=4+w=2=6 para dueño, r=4 para grupo, 0 (nada) para otros.',
    'Orden: chmod en octal SIEMPRE de exacto (sustituye, no añade).',
    `chmod 640 cofre.txt && cat cofre.txt`,
  ],
  teach: 'El octal reemplaza sin drama: u=rwx g=rx o= nada — 750. Formato simbólico exacto con = (u=rw,g=r,o=) para asignar precisión.',
  cheatsheet: [{ cmd: 'chmod 640 f', desc: 'rw-r----- dueño, grupo lea' }, { cmd: 'chmod u=rw,g=r,o= f', desc: 'ídem con formato simbólico exacto' }],
  keywords: ['chmod', 'octal', '640'] });

base({ track: 'permisos', index: 23, title: 'El grupo correcto', subtitle: 'chgrp y verificación con ls -l',
  brief: 'El fichero debe pertenecer al grupo dojo (el agente no tiene chown pero sí chgrp si es suyo y del grupo).',
  goal: 'Cambia el GRUPO de audit.txt a dojo (chgrp) y luego imprime los permisos+dueño para verificarse (agente no puede cambiar el dueño sin sudo, pero SÍ el grupo si es miembro).',
  setup: () => P(23, 'Permisos') + `echo "audit ${'$'}DOJO_FLAG" > ${HOME}/audit.txt
chown agent:dojo ${HOME}/audit.txt 2>/dev/null || chown agent:agent ${HOME}/audit.txt
chown agent:agent ${HOME}/audit.txt 2>/dev/null || true
chgrp dojo ${HOME}/audit.txt 2>/dev/null || true
echo "grupo actual de audit.txt: $(stat -c %G ${HOME}/audit.txt)" >> ${HOME}/audit.txt`,
  solution: `ls -l ${HOME}/audit.txt && cat ${HOME}/audit.txt`,
  hints: [
    'ls -l imprime dueño:grupo y permisos en la 1.ª línea por fichero.',
    'Si el grupo ya es dojo, la verificación se queda en ls (y el contenido lleva la marca).',
    `ls -l audit.txt && cat audit.txt`,
  ],
  teach: 'El dueño puede cambiar GRUPO del fichero a cualquier grupo al que pertenezca (sin sudo). chown -R para árboles; chgrp solo toca grupo.',
  cheatsheet: [{ cmd: 'chgrp grupo f', desc: 'cambia el grupo (dueño lo puede si es miembro)' }, { cmd: 'stat -c %G f', desc: 'imprime solo el grupo actual' }],
  keywords: ['chgrp', 'grupo', 'stat'] });

base({ track: 'permisos', index: 24, title: 'La umbral de recién creado', subtitle: 'umask: la máscara del cero',
  brief: 'El cero inicial del sistema determina los permisos al crear ficheros; hay que CONSULTAR umask y apuntar la marca.',
  goal: 'Muestra el umask ACTUAL de tu shell (comando umask) y luego cat nota-umask.txt que relaciona ese valor con la marca.',
  setup: () => P(24, 'Permisos') + `echo "umask corrente: 0022 — margin: ${'$'}DOJO_FLAG" > ${HOME}/nota-umask.txt
echo "umask referencia: 0022" > ${HOME}/umask-ref.txt
chown agent:agent ${HOME}/nota-umask.txt ${HOME}/umask-ref.txt`,
  solution: `umask | tee ${HOME}/rez.txt >/dev/null; cat ${HOME}/nota-umask.txt`,
  hints: [
    'umask sin argumentos IMPRIME el valor actual (cifar nxxx).',
    'La marca viaja en el fichero nota-umask; léelo con cat después de mostrar el umask.',
    `umask; cat ${HOME}/nota-umask.txt`,
  ],
  teach: 'umask SUBSTRAE permisos al crear ficheros: 022 al 666 da 644 para ficheros (y 755 para directorios dibujados con 777).',
  cheatsheet: [{ cmd: 'umask', desc: 'imprime la máscara actual' }, { cmd: 'umask 022', desc: 'fija una máscara (no persiste solo en tu shell)' }],
  keywords: ['umask', 'creación'] });

base({ track: 'permisos', index: 25, title: 'El viajo del sudoers', subtitle: 'sudo NO disponible en sandbox — sudoers audit',
  brief: 'En la sala por defecto el agente NO tiene sudo (el perfil sudo lo habilita); aquí se audita el fichero de ejemplo y se confirma el permiso con la marca.',
  goal: 'Imprime las líneas del fichero sudoers-demo.conf que mencionan NOPASSWD y cat del fichero que confirma el permiso real (con la marca).',
  setup: () => P(25, 'Permisos') + `cat > ${HOME}/sudoers-demo.conf <<EOF
## regla demo
agent ALL=(ALL) NOPASSWD: /usr/bin/systemctl
root ALL=(ALL:ALL) ALL
EOF
echo "permiso real (sin sudo en sandbox): ${'$'}DOJO_FLAG" > ${HOME}/permiso-real.txt
chown agent:agent ${HOME}/sudoers-demo.conf ${HOME}/permiso-real.txt`,
  solution: `grep 'NOPASSWD' ${HOME}/sudoers-demo.conf && cat ${HOME}/permiso-real.txt`,
  hints: [
    'grep NOPASSWD sudoers-demo.conf filtra las reglas sin contraseña.',
    'La marca viaja en el fichero permiso-real: cat para verla.',
    `grep NOPASSWD sudoers-demo.conf && cat permiso-real.txt`,
  ],
  teach: 'El sudoers real vive en /etc/sudoers: NUNCA lo edites sin visudo. En este track se estudia un fichero de ejemplo (la sala no da sudo real por defecto: perfil sudo lo habilita).',
  cheatsheet: [{ cmd: 'visudo', desc: 'edita /etc/sudoers con validación' }, { cmd: "sudo -l", desc: 'lista tus permisos sudo actuales' }],
  keywords: ['sudoers', 'NOPASSWD', 'sudo'] });

base({ track: 'permisos', index: 26, title: 'El grupo extranjero', subtitle: 'chgrp de árboles con -R',
  brief: 'El árbol transferido quedó con GRUPO ajeno (adm); siendo su dueño, el agente puede reasignar TODO el grupo a su propio equipo con chgrp -R.',
  goal: 'Cambia el GRUPO de TODO el árbol /home/agent/arbol-roto al grupo agent (chgrp -R) y luego cat firma.txt (la marca).',
  setup: () => P(26, 'Permisos') + `mkdir -p ${HOME}/arbol-roto/dados
echo 'contenido normal' > ${HOME}/arbol-roto/dados/f1.txt
echo "firma con marca ${'$'}DOJO_FLAG" > ${HOME}/arbol-roto/firma.txt
chown -R agent:adm ${HOME}/arbol-roto
`,
  solution: `chgrp -R agent ${HOME}/arbol-roto && cat ${HOME}/arbol-roto/firma.txt`,
  hints: [
    'chgrp -R aplica el grupo recursivamente a TODO el árbol (dirs y ficheros).',
    'Cambiar el DUEÑO requiere root, pero el dueño de un fichero sí puede fijar su GRUPO a uno propio de su pertenencia (agent).',
    `chgrp -R agent arbol-roto && cat arbol-roto/firma.txt`,
  ],
  teach: 'chgrp -R reasigna el grupo de todo el tree de una tacada (el dueño puede, si el grupo nuevo le pertenece). Cambiar el DUEÑO (chown) en cambio exige root — por eso las transferencias de dueño se hacen en admin.',
  cheatsheet: [{ cmd: 'chgrp -R group dir', desc: 'cambia el grupo de TODO el árbol' }, { cmd: 'find dir ! -group group', desc: 'qué ficheros NO están en ese grupo' }],
  keywords: ['chgrp', '-R', 'grupo', 'recursivo'] });

/* ── procesos ── */
base({ track: 'procesos', index: 21, title: 'El fugitivo dormido', subtitle: 'ps ax -o pid,comm',
  brief: 'Un proceso sleep quedó corriendo desde el setup; localiza su PID real con ps y contrástalo con el fichero pid.txt (que lleva la marca).',
  goal: 'Imprime el PID del proceso sleep y luego cat pid.txt para confirmar que ES el mismo (el fichero lleva la marca).',
  setup: () => P(21, 'Procesos') + `sleep 600 & echo "pid en el setup: ${'$'}! — ${'$'}DOJO_FLAG" > ${'$'}HOME/pid.txt
chown agent:agent ${'$'}HOME/pid.txt`,
  solution: `ps -o pid= -C sleep | head -1; cat ${'$'}HOME/pid.txt`,
  hints: [
    'ps -o pid= -C sleep lista los PID de los procesos llamados sleep (sin cabecera por el =).',
    'El fichero pid.txt guarda el PID desde el setup: compáralos a simple vista.',
    `ps -o pid= -C sleep; cat pid.txt`,
  ],
  teach: 'ps con -o (output) + -C (por nombre) es el listado quirúrgico: solo los campos que pides, solo ese comando. El = quita la cabecera.',
  cheatsheet: [{ cmd: 'ps -o pid=,cmd= -C NAME', desc: 'PID+cmd de un proceso exacto' }, { cmd: 'ps aux | grep NAME', desc: 'búsqueda laxa clásica' }],
  keywords: ['ps', 'pid', 'procesos'] });

base({ track: 'procesos', index: 22, title: 'El mata-sueño', subtitle: 'pkill por nombre',
  brief: 'El proceso sleep estorba; mátalo con pkill y demuestra que ya no existe (el fichero de log lleva la marca).',
  goal: 'Mata todos los procesos sleep con pkill y luego cat egolog.txt, que registra la hazaña (con la marca).',
  setup: () => P(22, 'Procesos') + `sleep 600 &
sleep 900 &
echo "los sueño han sido ejecutados: ${'$'}DOJO_FLAG" > ${'$'}HOME/egolog.txt
chown agent:agent ${'$'}HOME/egolog.txt`,
  solution: `pkill sleep || true; sleep 1; ! ps -o comm -C sleep | grep -q sleep; cat ${'$'}HOME/egolog.txt`,
  hints: [
    'pkill NAME es la receta corta: mata por nombre de proceso (sin PID a mano).',
    'Verifica después con ps que ya NO aparece.',
    `pkill sleep; ps -C sleep; cat egolog.txt`,
  ],
  teach: 'pkill/pattern mata por NOMBRE; kill PID es quirúrgico. Con procesos que no mueren al primer golpe, kill -9 es el martillo (último recurso).',
  cheatsheet: [{ cmd: 'pkill NAME', desc: 'manda TERM a procesos por nombre' }, { cmd: 'kill -9 PID', desc: 'mata a las bravas (sin rescate)' }],
  keywords: ['pkill', 'kill', 'procesos'] });

base({ track: 'procesos', index: 23, title: 'El pulso del sistema', subtitle: 'uptime y load average',
  brief: 'El latido del sistema se mide con uptime: carga media, usuarios, tiempo activo… y la marca viaja en el fichero final.',
  goal: 'Imprime uptime (la carga media de la máquina) y luego cat pulso.txt (la marca viaja allí).',
  setup: () => P(23, 'Procesos') + `echo "pulso confirmado: ${'$'}DOJO_FLAG" > ${'$'}HOME/pulso.txt
chown agent:agent ${'$'}HOME/pulso.txt`,
  solution: `uptime; cat ${'$'}HOME/pulso.txt`,
  hints: [
    'uptime imprime la hora, uptime, usuarios y los 3 load-averages (1, 5, 15 min).',
    'Es el diagnóstico de casa y el 1.er dato en todo post-mortem.',
    `uptime; cat pulso.txt`,
  ],
  teach: 'load average RELATIVO a núcleos: 2.0 en máquina de 4 cores es descanso; en 1 core es ahogo. La regla de bolsillo: load ≈ cores está al límite.',
  cheatsheet: [{ cmd: 'uptime', desc: 'hora + uptime + load 1/5/15' }, { cmd: 'cat /proc/loadavg', desc: 'los mismos números desde procfs' }],
  keywords: ['uptime', 'load', 'diagnóstico'] });

base({ track: 'procesos', index: 24, title: 'La vida del PID', subtitle: 'kill -0: ¿sigue vivo?',
  brief: 'Un PID apuntado en vida.txt pudo morir; kill -0 no mata, pregunta: el fichero de respuesta lleva la marca.',
  goal: 'Comprueba si el PID anotado en vida.txt RESPONDE a señales (kill -0 PID; exit status 0 = vivo) y luego cat respuesta.txt (que lleva la marca).',
  setup: () => P(24, 'Procesos') + `sleep 600 & echo "pid del sueño: ${'$'}!" > ${'$'}HOME/vida.txt
echo "respuesta del pulso: ${'$'}DOJO_FLAG" > ${'$'}HOME/respuesta.txt
chown agent:agent ${'$'}HOME/vida.txt ${'$'}HOME/respuesta.txt`,
  solution: `p=$(sed 's/pid del sueño: //' ${'$'}HOME/vida.txt); kill -0 "${'$'}p" && echo "el proceso ${'$'}p responde (vivo)"; cat ${'$'}HOME/respuesta.txt`,
  hints: [
    'kill -0 PID no envía señal real: solo comprueba si ENVIAR sería posible (proceso vivo y permisos).',
    'El PID se lee del fichero vida.txt (limpia su prefijo).',
    `kill -0 $(sed 's/.*: //' vida.txt) && cat respuesta.txt`,
  ],
  teach: 'kill -0 es el ping de procesos: barato y fiable antes de hacer kill de verdad (evita matar un PID reutilizado).',
  cheatsheet: [{ cmd: 'kill -0 PID && echo vivo', desc: 'comprueba existencia sin señalar' }, { cmd: 'ps -p PID -o comm=', desc: 'ídem consultando la tabla' }],
  keywords: ['kill', '-0', 'señal'] });

base({ track: 'procesos', index: 25, title: 'El forestal del disco', subtitle: 'df -h: qué FS y cuán lleno',
  brief: 'Mide el ESPACIO del disco con df -h y deja la huella en el fichero disco.txt (que lleva la marca).',
  goal: 'Imprime df -h (uso del filesystem) y luego cat disco.txt, que confirma el paseo.',
  setup: () => P(25, 'Procesos') + `echo "disco analizado: ${'$'}DOJO_FLAG" > ${'$'}HOME/disco.txt
chown agent:agent ${'$'}HOME/disco.txt`,
  solution: `df -h; cat ${'$'}HOME/disco.txt`,
  hints: [
    'df -h resume cada filesystem montado: tamaño, usado, libre y % de uso.',
    'Última línea por fichero: la marca viaja en disco.txt.',
    `df -h; cat disco.txt`,
  ],
  teach: 'df mira los TAKES por filesystem; du mira el fichero/directorio concreto. Ambos son navegación básica del sysadmin.',
  cheatsheet: [{ cmd: 'df -h', desc: 'uso de filesystems (legible)' }, { cmd: 'du -sh dir', desc: 'tamaño total del directorio' }],
  keywords: ['df', 'disco', 'espacio'] });

base({ track: 'procesos', index: 26, title: 'El semáforo de memoria', subtitle: 'free -m — RAM y swap',
  brief: 'El desbordamiento de memoria tumba el sistema en segundos; con free se vê el estado de RAM en MB (el fichero memoria.txt lo ratifica con la marca).',
  goal: 'Imprime free -m (memoria libre) y luego cat memoria.txt (donde viaja la marca).',
  setup: () => P(26, 'Procesos') + `echo "memoria revisada: ${'$'}DOJO_FLAG" > ${'$'}HOME/memoria.txt
chown agent:agent ${'$'}HOME/memoria.txt`,
  solution: `free -m; cat ${'$'}HOME/memoria.txt`,
  hints: [
    'free da memoria total/usada/libre (y swap). -m en MB (o -h legible).',
    'La fila libre REAL es la de «available», no la de «free» (cache inclusa).',
    `free -m; cat memoria.txt`,
  ],
  teach: 'La columna «available» resume lo que el kernel puede ceder sin arriesgar el rendimiento; mirar la de «free» lleva a pánicos falsos.',
  cheatsheet: [{ cmd: 'free -m', desc: 'memoria en MB' }, { cmd: 'free -h', desc: 'ídem con unidades legibles' }],
  keywords: ['free', 'memoria', 'RAM'] });

/* ── redes ── */
base({ track: 'redes', index: 21, title: 'El puerto a la escucha', subtitle: 'ss -tln — SÍMBIOSIS de sockets',
  brief: 'El servidor local nc quedó a la escucha en un puerto; ss muestra los LISTEN (y el fichero puerto.txt lleva la marca si lo confirms).',
  goal: 'Lista los puertos en escucha (ss -tln) y luego cat puerto.txt, que anota el puerto del servicio espía (con la marca).',
  setup: () => P(21, 'Redes') + `(printf "banner de servicio\\n"; sleep 600) | nc -l -p 4444 & echo "el espía escucha en 4444: ${'$'}DOJO_FLAG" > ${'$'}HOME/puerto.txt
chown agent:agent ${'$'}HOME/puerto.txt`,
  solution: `ss -tln | grep 4444; cat ${'$'}HOME/puerto.txt`,
  hints: [
    'ss -tln lista sockets TCP (t) en estado LISTEN (l) con números de puerto (-n implicita en tln).',
    'El servicio espía quedó pegado al puerto 4444: ss debe listar su línea.',
    `ss -tln; cat puerto.txt`,
  ],
  teach: 'ss ES el netstat moderno (iproute2): -t TCP, -l LISTEN, -n numérico sin resolver nombres (muchos más rápido).',
  cheatsheet: [{ cmd: 'ss -tln', desc: 'puertos TCP a la escucha' }, { cmd: 'ss -tlnp', desc: 'ídem con el PID del dueño' }],
  keywords: ['ss', 'listen', 'puerto'] });

base({ track: 'redes', index: 22, title: 'El saludo del servidor', subtitle: 'nc client: eco TCP simple',
  brief: 'El servidor espía devuelve un banner al conectarte por TCP; ese banner lleva la marca.',
  goal: 'Conéctate con nc al puerto 4455 LOCAL y muestra el banner que devuelve (que trae la marca).',
  setup: () => P(22, 'Redes') + `(printf "banner de bienvenida ${'$'}DOJO_FLAG\\n" ; sleep 600) | nc -l -p 4455 & sleep 0.3`,
  solution: `nc -w 2 127.0.0.1 4455 < /dev/null`,
  hints: [
    'nc HOST PORT abre una conexión TCP y pasa stdin/stdout a través.',
    'Con < /dev/null evitas que nc espere tu entrada; solo lee el banner del servidor.',
    `nc -w 2 127.0.0.1 4455 < /dev/null`,
  ],
  teach: 'nc es la navaja suiza TCP/UDP: cliente, servidor o escáner. En este nivel hace de CLIENTE y captura el banner.',
  cheatsheet: [{ cmd: 'nc host port', desc: 'conexión TCP simple' }, { cmd: 'nc -z host 1-1000', desc: 'escaneo de puertos (bandera/z)' }],
  keywords: ['nc', 'cliente', 'tcp'] });

base({ track: 'redes', index: 23, title: 'El nombre de la casa', subtitle: 'hostname y /etc/hosts',
  brief: 'El hostname del sandbox es la firma del contenedor; el fichero hosts trae la marca si se lampado.',
  goal: 'Imprime el hostname del sistema y luego cat /home/agent/hosts-marcado.txt (que lleva la marca).',
  setup: () => P(23, 'Redes') + `echo "hosts local con firma: ${'$'}DOJO_FLAG" > ${'$'}HOME/hosts-marcado.txt
echo "127.0.0.1 $(hostname) ${'$'}DOJO_FLAG" >> /etc/hosts 2>/dev/null || true
chown agent:agent ${'$'}HOME/hosts-marcado.txt`,
  solution: `hostname; cat ${'$'}HOME/hosts-marcado.txt`,
  hints: [
    'hostname imprime el nombre del contenedor (CONFIG en docker).',
    'El fichero /etc/hosts mapea IP→nombre SIN DNS (nos vamos con dnsmasq).',
    `hostname; cat hosts-marcado.txt`,
  ],
  teach: 'La resolución local ocurre ANTES del DNS si /etc/nsswitch.conf prioriza files: getent hosts consulta esa cadena completa.',
  cheatsheet: [{ cmd: 'hostname', desc: 'nombre del host' }, { cmd: 'getent hosts localhost', desc: 'resolución real (NSS+DNS)' }],
  keywords: ['hostname', 'etc hosts'] });

base({ track: 'redes', index: 24, title: 'El inventario de interfaces', subtitle: 'ip -4 addr',
  brief: 'El contenedor tiene interfaces de red concretas (lo y quizá alguna vlan); el fichero red.txt ratifica el paseo (y la marca).',
  goal: 'Imprime las direcciones IP del sistema (ip -4 addr) y luego cat red.txt donde viaje la marca.',
  setup: () => P(24, 'Redes') + `echo "inventario IPV4: ${'$'}DOJO_FLAG" > ${'$'}HOME/red.txt
chown agent:agent ${'$'}HOME/red.txt`,
  solution: `ip -4 addr show; cat ${'$'}HOME/red.txt`,
  hints: [
    'ip -4 addr show es el ifconfig moderno (iproute2): muestra direcciones por interface.',
    '127.0.0.1/8 en lo SIEMPRE existe aunque el contenedor carezca de red externa.',
    `ip -4 addr show; cat red.txt`,
  ],
  teach: 'El boot completo con «ip a» es el punto de partida para ver IPs, MTUs y estado de cada interface; con -br sale a modo compacto.',
  cheatsheet: [{ cmd: 'ip -4 addr', desc: 'direcciones IPv4 por interfaz' }, { cmd: 'ip -br addr', desc: 'resumen breve (una línea por interfaz)' }],
  keywords: ['ip', 'addr', 'interfaz'] });

base({ track: 'redes', index: 25, title: 'Las conexiones estables', subtitle: 'ss -tn (establecidas)',
  brief: 'Hola TCP al servicio espía establece una conexión ESTABLECIDA (ESTAB) que ss lista; el fichero conns.txt takea la marca.',
  goal: 'Abre (en segundo plano) una conexión al puerto 4466 y con ss -tn comprueba que existe ESTAB, luego cat conns.txt (que lleva la marca).',
  setup: () => P(25, 'Redes') + `echo "conexiones listadas: ${'$'}DOJO_FLAG" > ${'$'}HOME/conns.txt
chown agent:agent ${'$'}HOME/conns.txt
(printf "hola\\n"; sleep 600) | nc -l -p 4466 & sleep 0.3`,
  solution: `nc -w 5 127.0.0.1 4466 < /dev/null > /dev/null 2>&1 & sleep 0.3; ss -tn | grep -q ESTAB; ss -tn | head -5; cat ${'$'}HOME/conns.txt`,
  hints: [
    'ss -tn lista las conexiones TCP establecidas (sin flags de estado LISTEN).',
    'Cada conexión muestra SU STATUS: ESTAB si viva, y los endpoints (IP:PORT a desglose completo).',
    `ss -tn; cat conns.txt`,
  ],
  teach: 'Cada boca de un socket TCP tiene 4 datos: local IP:PORT y remote IP:PORT. ss -tn las lista EN ESTABLECIMIENTO (estado ESTAB).',
  cheatsheet: [{ cmd: 'ss -tn', desc: 'conexiones TCP activas' }, { cmd: 'ss -tn state established', desc: 'filtra por estado directamente' }],
  keywords: ['ss', 'estab', 'conexiones'] });

base({ track: 'redes', index: 26, title: 'El DNS simulado', subtitle: 'getent hosts con /etc/hosts',
  brief: 'En la sala la resolución incluye /etc/hosts; getent hosts lo refleja (el fichero dns.txt confirma la marca).',
  goal: 'Resuelve la entrada personalizada dojo.local con getent hosts y luego cat dns.txt para confirmar (la marca viaja allí).',
  setup: () => P(26, 'Redes') + `echo "resolución ok: ${'$'}DOJO_FLAG" > ${'$'}HOME/dns.txt
echo "10.10.10.10 dojo.local" >> /etc/hosts 2>/dev/null || true
chown agent:agent ${'$'}HOME/dns.txt`,
  solution: `getent hosts dojo.local; cat ${'$'}HOME/dns.txt`,
  hints: [
    'getent hosts NOMBRE consulta la cadena NSS (incluye /etc/hosts) igual que las apps.',
    'La entrada se añadió en /etc/hosts en el setup (e.g. 10.10.10.10 dojo.local).',
    `getent hosts dojo.local; cat dns.txt`,
  ],
  teach: 'getent es lo que usan los programas (getaddrinfo), no lo que usan los humanos: refleja el orden REAL de resolución (/etc/hosts primero, luego DNS).',
  cheatsheet: [{ cmd: 'getent hosts NOMBRE', desc: 'resuelve como lo hace el sistema' }, { cmd: 'resolvectl status', desc: 'detalles del resolvedor (con systemd)' }],
  keywords: ['getent', 'dns', 'hosts'] });

/* ── archivos ── */
base({ track: 'archivos', index: 21, title: 'El paquete sellado', subtitle: 'tar -czf + -O extract',
  brief: 'El secreto queda dentro de un tar.gz; crea el paquete, confírmalo con -t y extrae el contenido con -O.',
  goal: 'Empaqueta secreto.txt en paquete.tgz (tar -czf), verifica que la entrada está en el listado (-t) y extrae su contenido a stdout con -O.',
  setup: () => P(21, 'Archivos') + `echo "secreto en el paquete ${'$'}DOJO_FLAG" > ${'$'}HOME/secreto.txt
chown agent:agent ${'$'}HOME/secreto.txt`,
  solution: `tar -czf ${'$'}HOME/paquete.tgz -C ${'$'}HOME secreto.txt && tar -tzf ${'$'}HOME/paquete.tgz | grep -q secreto && tar -Oxz f ${'$'}HOME/paquete.tgz 2>/dev/null || tar -Oxzf ${'$'}HOME/paquete.tgz`,
  hints: [
    'tar -czf paquete.tgz fichero crea el paquete comprimido (z=gzip).',
    '-t lista el contenido sin extraer; -O extrae a STDOUT (no a disco) y permite cat-tear el fichero interior.',
    `tar czf paquete.tgz secreto.txt; tar tzf paquete.tgz; tar Oxzf paquete.tgz`,
  ],
  teach: 'tar czf empaca; -t inspecciona sin descomprimir; -O extrae a consola. Con -C eliges carpeta para nombrar rutas dentro del paquete (arboless limpios).',
  cheatsheet: [{ cmd: 'tar czf p.tgz f', desc: 'empaca y comprime' }, { cmd: 'tar tzf p.tgz', desc: 'lista el contenido' }, { cmd: 'tar xOzf p.tgz f', desc: 'extrae f a stdout' }],
  keywords: ['tar', 'czf', 'tzf', 'O'] });

base({ track: 'archivos', index: 22, title: 'El_Cuerpo _Comprido', subtitle: 'gzip -c + zcat',
  brief: 'Comprime ASsenza tocar el fichero (gzip -c > .gz) y comprueba que se puede devolver por zcat.',
  goal: 'Comprime notas.txt a datos_notas.txt.gz sin tocar el original (gzip -c), luego imprime su contenido comprimido en stdout con zcat (que lleva la marca).',
  setup: () => P(22, 'Archivos') + `echo "notas comprimidas con marca ${'$'}DOJO_FLAG" > ${'$'}HOME/notas.txt
chown agent:agent ${'$'}HOME/notas.txt`,
  solution: `gzip -c ${'$'}HOME/notas.txt > ${'$'}HOME/notas.txt.gz && zcat ${'$'}HOME/notas.txt.gz`,
  hints: [
    'gzip -c escribe el fichero COMPRIMIDO a stdout (no renombra ni borra el original).',
    'zcat (registro de Z-CAT) desenplota los .gz en stdout.',
    `gzip -c notas.txt > notas.txt.gz; zcat notas.txt.gz`,
  ],
  teach: 'gzip SIN -c elimina el fichero original (le pone el nombre .gz) — usar -c + redirección es la forma no destructiva. Alias: zcat = gzip -dc.',
  cheatsheet: [{ cmd: 'gzip -c f > f.gz', desc: 'comprime sin tocar el original' }, { cmd: 'zcat f.gz', desc: 'descomprime a stdout' }],
  keywords: ['gzip', 'zcat', 'comprimir'] });

base({ track: 'archivos', index: 23, title: 'El parche que cicatriza', subtitle: 'patch f < parche.diff',
  brief: 'Un diff -u describe el cambio y patch lo aplica a base.txt: al final las novedades trae la marca.',
  goal: 'Aplica parche.diff a base.txt con patch y luego cat base.txt (la linea NUEVA trae la marca).',
  setup: () => P(23, 'Archivos') + `cat > ${'$'}HOME/base.txt <<EOF
linea 1 original
EOF
cat > ${'$'}HOME/parche.diff <<EOF
--- base.txt
+++ base.txt
@@ -1 +1 @@
-linea 1 original
+linea 1 parcheada ${'$'}DOJO_FLAG
EOF
chown agent:agent ${'$'}HOME/base.txt ${'$'}HOME/parche.diff`,
  solution: `cd ${'$'}HOME && patch base.txt < parche.diff && cat base.txt`,
  hints: [
    'patch FICHERO < parche.diff aplica los cambios y muestra «hunk applied».',
    'Si el fichero ya está parcheado, patch avisa con (reverse; apply anyway?): usa -N o deshacer con -R.',
    `patch base.txt < parche.diff; cat base.txt`,
  ],
  teach: 'diff genera la RECETA (hunks @@); patch la ejecuta. Son el canal formal para distribuir cambios de código sin fichero entero.',
  cheatsheet: [{ cmd: 'patch f < parche.diff', desc: 'aplica el parche' }, { cmd: 'patch -R f < parche.diff', desc: 'DESHACE el parche' }],
  keywords: ['patch', 'diff', 'changu'] });

base({ track: 'archivos', index: 24, title: 'El espejo duro', subtitle: 'ln sin -s: hardlink',
  brief: 'Los hardlink son DOS NOMBRES para el MISMOS dato; cambia uno y el otro ve lo mismo.',
  goal: 'Crea un hardlink de dato.txt llamado espejo.txt y comprueba que escribir en espejo apareció también en dato (cat).',
  setup: () => P(24, 'Archivos') + `echo "dato original ${'$'}DOJO_FLAG" > ${'$'}HOME/dato.txt
chown agent:agent ${'$'}HOME/dato.txt`,
  solution: `ln ${'$'}HOME/dato.txt ${'$'}HOME/espejo.txt && echo "anexando nota a espejo" >> ${'$'}HOME/espejo.txt && cat ${'$'}HOME/dato.txt`,
  hints: [
    'ln SIN -s crea hardlinks (mismo inode, dos nombres).',
    'Escribe en el espejo y lee el original para ver el efecto espejo.',
    `ln dato.txt espejo.txt; echo x >> espejo.txt; cat dato.txt`,
  ],
  teach: 'Hardlink comparte inode (mismo dato, bajo dos nombres); symlink es un ACCESO con destino: borra el original y el hardlink sigue vivo, el symlink queda roto.',
  cheatsheet: [{ cmd: 'ln a b', desc: 'hardlink: mismo inode' }, { cmd: 'ls -li f', desc: 'lista con número de inode para verificar' }],
  keywords: ['ln', 'hardlink', 'inode'] });

base({ track: 'archivos', index: 25, title: 'El tipo del fichero', subtitle: 'file + strings en binario',
  brief: 'Un fichero BINARIO lleva la marca en texto libre; file determina el tipo y strings extrae cadenas legibles.',
  goal: 'Determina el tipo de img.bin con file y extrae con strings la marca FLAG que hay escondida en el binario.',
  setup: () => P(25, 'Archivos') + `printf '\\x89PNG\\r\\n' > ${'$'}HOME/img.bin
printf 'cadena-lible-invisible ${'$'}DOJO_FLAG\\n' >> ${'$'}HOME/img.bin
chown agent:agent ${'$'}HOME/img.bin`,
  solution: `file ${'$'}HOME/img.bin; strings ${'$'}HOME/img.bin | grep 'FLAG'`,
  hints: [
    'file lee la firma (magic bytes) y determina el tipo real (no el extension).',
    'strings impime cadenas ASCII legibles dentro de datos binarios.',
    `file img.bin; strings img.bin | grep FLAG`,
  ],
  teach: 'file examina los magic bytes al inicio de la cabecera (PNG, ELF, gzip…); strings recorre el binario paraHumanizar las secuencias de impresión que hay dentro.',
  cheatsheet: [{ cmd: 'file f', desc: 'identifica el tipo real' }, { cmd: 'strings f | grep x', desc: 'cadens legibles dentro del binario' }],
  keywords: ['file', 'strings', 'binario'] });

base({ track: 'archivos', index: 26, title: 'El peso del mundo', subtitle: 'du -sh y wc -c del resultado',
  brief: 'El directorio lleva archivos de vario tamaño; du mide el total legible y el manifest lleva la marca.',
  goal: 'Mide el TAMAÑO total del directorio /home/agent/pesado con du -sh y luego cat manifest.txt (que lleva la marca).',
  setup: () => P(26, 'Archivos') + `mkdir -p ${'$'}HOME/pesado
dd if=/dev/zero of=${'$'}HOME/pesado/a.bin bs=1k count=10 2>/dev/null
echo "manifest del directorio pesado: ${'$'}DOJO_FLAG" > ${'$'}HOME/manifest.txt
chown -R agent:agent ${'$'}HOME/pesado ${'$'}HOME/manifest.txt`,
  solution: `du -sh ${'$'}HOME/pesado; cat ${'$'}HOME/manifest.txt`,
  hints: [
    'du resume por fichero/directorio: -s SOLO el total del objetivo, -h legible (K/M/G).',
    'El manifest es el fichero que cataloga el contenido.',
    `du -sh pesado; cat manifest.txt`,
  ],
  teach: 'du -sh es el medidor de bolsillo de un directorio; con --max-depth=1 compara hijos entre sí sin bajar más.',
  cheatsheet: [{ cmd: 'du -sh dir', desc: 'tamaño total del dir' }, { cmd: 'du -h --max-depth=1 dir', desc: 'por hijo (dimensionado)' }],
  keywords: ['du', 'tamaño', 'peso'] });

/* ── scripting ── */
base({ track: 'scripting', index: 21, title: 'El bucle de los archivos', subtitle: 'for f in glob; do … done',
  brief: 'El bucle for itera un glob y procesa cada fichero (cat) — una lleva la marca.',
  goal: 'Con bucle for, imprime el contenido de cada fichero .txt de /home/agent/lotes/ (uno lleva la marca).',
  setup: () => P(21, 'Scripting') + `mkdir -p ${'$'}HOME/lotes
printf 'lote uno\\n' > ${'$'}HOME/lotes/a.txt
printf 'lote dos\\n' > ${'$'}HOME/lotes/b.txt
printf 'lote con ${'$'}DOJO_FLAG\\n' > ${'$'}HOME/lotes/c.txt
chown -R agent:agent ${'$'}HOME/lotes`,
  solution: `for f in ${'$'}HOME/lotes/*.txt; do cat "${'$'}f"; done`,
  hints: [
    'for f in GLOB; do cat "$f"; done es la plantilla base de tratamientos por lotes.',
    'El glob *.txt EXPANDE en la lista de ficheros para el for.',
    `for f in lotes/*.txt; do cat "$f"; done`,
  ],
  teach: 'La tripleta for+glob+done es el cimiento de los pipelines batch. "Citar la variable" ($f) ENCERRA nombres con espacios — sin cita, rompe.',
  cheatsheet: [{ cmd: 'for f in *.txt; do echo "$f"; done', desc: 'itera ficheros del dir actual' }, { cmd: 'for i in 1 2 3; do …; done', desc: 'itera una lista literal' }],
  keywords: ['bash', 'for', 'glob'] });

base({ track: 'scripting', index: 22, title: 'La pregunta pertinente', subtitle: 'test -d / [ -d dir ]',
  brief: 'Antes de escribir en un dir, SIEMPRE preguntar probe exista [ -d dir ] — el fichero vale la pregunta final con marca.',
  goal: 'Comprueba si /home/agent/estantería existe como DIRECTORIO ([ -d ]) y luego cat la lista que lleva la marca (lista-ok.txt o similar, según la prueba).',
  setup: () => P(22, 'Scripting') + `mkdir -p ${'$'}HOME/estantería
echo "prueba de directorio: ${'$'}DOJO_FLAG" > ${'$'}HOME/resultado-test.txt
chown agent:agent ${'$'}HOME/resultado-test.txt`,
  solution: `[ -d ${'$'}HOME/estantería ] && echo "es directorio ✓"; cat ${'$'}HOME/resultado-test.txt`,
  hints: [
    '[ -d PATH ] es la prueba de EXISTENCIA COMO DIRECTORIO (exit 0 si existe).',
    'Y si no es un dir: la alternativa es [ -f ] (fichero normal).',
    `[ -d estantería ] && cat resultado-test.txt`,
  ],
  teach: 'Los [ expr ] son las pruebas de la shell: -d dir, -f fichero, -e exist, -r legible, -x ejecutable. El espacio DENTRO de los corchetes es OBLIGATORIO.',
  cheatsheet: [{ cmd: '[ -d dir ] && …', desc: 'es directorio' }, { cmd: '[ -f f ] && …', desc: 'es fichero normal' }],
  keywords: ['test', '-d', 'if'] });

base({ track: 'scripting', index: 23, title: 'El while del csv', subtitle: 'while IFS= read -r línea',
  brief: 'El while de línea en línea es el bucle de los CSV grandes: cada línea llega a una variable y la marca sale al cat final.',
  goal: 'Con while read, imprime cada línea de conjunto.txt (que lleva una con la marca).',
  setup: () => P(23, 'Scripting') + `printf ' Helena eres genial\\n y también trabajada\\n línea final ${'$'}DOJO_FLAG\\n' > ${'$'}HOME/conjunto.txt
chown agent:agent ${'$'}HOME/conjunto.txt`,
  solution: `while IFS= read -r l; do echo "${'$'}l"; done < ${'$'}HOME/conjunto.txt`,
  hints: [
    'El bucle estándar de línea a línea: while IFS= read -r línea; do …; done < fichero.',
    'IFS= preserva espacios al principio; -r evita interpretar \\\\ en el dato.',
    `while IFS= read -r l; do echo "$l"; done < conjunto.txt`,
  ],
  teach: 'read -r lee LINEA por LINEA (no palabra por palabra). < fichero alimenta el while, y la variable en $" es cada línea entera.',
  cheatsheet: [{ cmd: 'while read -r l; do echo "$l"; done < f', desc: 'procesa línea a línea' }, { cmd: 'while read -r a b; do echo "$b"; done < f', desc: 'lee por campos (a=1.º, b=resto)' }],
  keywords: ['while', 'read', 'línea'] });

base({ track: 'scripting', index: 24, title: 'La función propia', subtitle: 'function y llamadas',
  brief: 'Definir una función (mía) y llamarla una vez es scripting minimal: la llamada devuelve el contenido (con la marca).',
  goal: 'Define una función shell llamada mifuncion que haga cat del fichero dato.txt y LLÁMELA para ver el output (que lleva la marca).',
  setup: () => P(24, 'Scripting') + `echo "función ejecutada con ${'$'}DOJO_FLAG" > ${'$'}HOME/dato.txt
chown agent:agent ${'$'}HOME/dato.txt`,
  solution: `mifuncion() { cat ${'$'}HOME/dato.txt; }; mifuncion`,
  hints: [
    'Forma canónica: nombre() { comandos; } — declarada en la misma línea o en bloques.',
    'La llamada es SIN paréntesis: solo mifuncion al final.',
    `mifuncion() { cat dato.txt; }; mifuncion`,
  ],
  teach: 'Las funciones shell devuelven con $? (exit status) y no con return de datos: para RESULTADOS se usa stdout (por eso capturamos con $(mifuncion)).',
  cheatsheet: [{ cmd: 'f() { cmds; }; f', desc: 'define y ejecuta' }, { cmd: 'x=$(f)', desc: 'captura el stdout de una función' }],
  keywords: ['bash', 'función', 'def'] });

base({ track: 'scripting', index: 25, title: 'El menu atoi', subtitle: 'case … esac — ramificación',
  brief: 'El case unifica ISвана por primera palabra de un fichero: la opción correcta muestra la marca.',
  goal: 'Lee la 1.er palabra del fichero cmd.txt y con CASE imprime lo que pida: si dice show, muestra el fichero secreto con cat (que lleva la marca).',
  setup: () => P(25, 'Scripting') + `echo "show" > ${'$'}HOME/cmd.txt
echo "secreto mostrado con ${'$'}DOJO_FLAG" > ${'$'}HOME/secreto.txt
chown agent:agent ${'$'}HOME/cmd.txt ${'$'}HOME/secreto.txt`,
  solution: `case $(head -1 ${'$'}HOME/cmd.txt) in show) cat ${'$'}HOME/secreto.txt;; *) echo "otro comando";; esac`,
  hints: [
    'case VAR in patrón) …;; esac ramifica por patrón (ojo al «;;» de fin de rama).',
    'El «head -1 file» entrega la 1.er palabra de comándose (a para el case).',
    `case $(head -1 cmd.txt) in show) cat secreto.txt;; esac`,
  ],
  teach: 'case es el switch de bash: va bien para menús (r como show, help, exit…). Su ventaja: ESCAPA el if-elif anidado.',
  cheatsheet: [{ cmd: 'case $x in a) …;; b) …;; esac', desc: 'ramificación por patrones' }, { cmd: 'case $x in [0-9]) …;; esac', desc: 'patrones con clases' }],
  keywords: ['case', 'esac', 'switch'] });

base({ track: 'scripting', index: 26, title: 'El trap de salida', subtitle: 'trap … EXIT',
  brief: 'El trap EXIT se dispara al abandonar el script: imprimiendo la marca al morir — la firma del agente de buena muerte.',
  goal: 'Define un trap EXIT que imprime el contenido de salida.txt cuando el script acaba (y termina la shell para que de dispare).',
  setup: () => P(26, 'Scripting') + `echo "adiós del agente ${'$'}DOJO_FLAG" > ${'$'}HOME/salida.txt
chown agent:agent ${'$'}HOME/salida.txt`,
  solution: `bash -c 'trap "cat ${'$'}HOME/salida.txt" EXIT; echo "el roble"'`,
  hints: [
    'trap "cmds" EXIT ejecuta cmds CADA VEZ que la shell termina sea bien o mal.',
    'Con bash -c se crea una shell REVIENTA (sale tras echo y dispara el trap).',
    `bash -c 'trap "cat salida.txt" EXIT; echo fin'`,
  ],
  teach: 'trap EXIT es la acción final del script: limpieza, bitácora, cierre de sockets. En los scripts HARDR es obligatorio para liberar recursos.',
  cheatsheet: [{ cmd: 'trap "cmds" EXIT', desc: 'ejecuta cmds al salir de la shell' }, { cmd: 'trap - EXIT', desc: 'quita el trap definido' }],
  keywords: ['trap', 'EXIT', 'limpieza'] });

/* ── forense ── */
base({ track: 'forense', index: 21, title: 'La huella hexadecimal', subtitle: 'xxd -r -p: hex a bytes',
  brief: 'La marca llegó en formato hexadecimal; revertir con xxd -r -p es la herramienta neta.',
  goal: 'Convierte huella.txt (hex plano) de VUELTA a bytes legibles con xxd -r -p (que lleva la marca).',
  setup: () => P(21, 'Forense') + `printf '%s\\n' "$(${'$'}DOJO_FLAG | xxd -p | tr -d '\\n')" > ${'$'}HOME/hx 2>/dev/null || true
echo "la marca en hexadecimal es:" > ${'$'}HOME/huella.txt
printf '%s' "${'$'}DOJO_FLAG" | xxd -p | tr -d '\\n' >> ${'$'}HOME/hx2 >/dev/null 2>&1 || true
printf '%s' "${'$'}DOJO_FLAG" | xxd -p | tr -d "\\n" > ${'$'}HOME/hx3
echo "huella hex:" >> ${'$'}HOME/huella.txt
cat ${'$'}HOME/hx3 >> ${'$'}HOME/huella.txt
chown agent:agent ${'$'}HOME/huella.txt ${'$'}HOME/hx3`,
  solution: `xxd -r -p ${'$'}HOME/hx3`,
  hints: [
    'xxd -p muestra el binario en HEX plano (sin offsets); -r lo devuelve a bytes.',
    'La pipe es huella hex → xxd -r -p → texto original (la marca intacta).',
    `xxd -r -p hx3`,
  ],
  teach: 'xxd es el convertidor hex↔bytes dependiente del formato; -p mantiene el flujo limpio (sin offsets ni ASCII-gray).',
  cheatsheet: [{ cmd: 'xxd -p f', desc: 'bytes a hex plano' }, { cmd: 'xxd -r -p f', desc: 'hex plano a bytes' }],
  keywords: ['xxd', 'hex', 'rev'] });

base({ track: 'forense', index: 22, title: 'La marca base64', subtitle: 'base64 -d',
  brief: 'La marca viaja en BASE64: decodificar con base64 -d revela el texto limpio.',
  goal: 'Decodifica codificado.txt (su contenido, base64 puro) y revela la marca con base64 -d.',
  setup: () => P(22, 'Forense') + `printf '%s\\n' "${'$'}DOJO_FLAG" | base64 > ${'$'}HOME/codificado.txt
chown agent:agent ${'$'}HOME/codificado.txt`,
  solution: `base64 -d ${'$'}HOME/codificado.txt`,
  hints: [
    'base64 SIN argumentos codifica; con -d decodifica lo que recibe.',
    'El fichero es insert: una única línea BASE-64 (sin texto alrededor, o la decodificación se queja).',
    `base64 -d codificado.txt`,
  ],
  teach: 'base64 saca cualquier binario por TEXTO seguro (87 % de overhead): imprescindible para fichero emailing y cuerpos de HTTP.',
  cheatsheet: [{ cmd: 'base64 f', desc: 'codifica a base64' }, { cmd: 'base64 -d f', desc: 'decodifica (los -e alterna ambos sentidos)' }],
  keywords: ['base64', 'decode'] });

base({ track: 'forense', index: 23, title: 'El log arrugado', subtitle: 'grep por fecha + rango de horas',
  brief: 'El log chapuza en timestamp sin fecha; find por franja horaria 10:40 a 10:50 revela la marca.',
  goal: 'Imprime de syslog.txt las líneas entre las horas 10:40 y 10:50 (grep -E con el patrón adecuado).',
  setup: () => P(23, 'Forense') + `cat > ${'$'}HOME/syslog.txt <<EOF
10:35 arranque normal
10:42 entrada nocturna ${'$'}DOJO_FLAG
10:55 paseo de servicio
11:02 arranque normal
EOF
chown agent:agent ${'$'}HOME/syslog.txt`,
  solution: `grep -E '^10:4[0-9]' ${'$'}HOME/syslog.txt`,
  hints: [
    'El criterio es la HORA (prefijo 10:4x): con la clase [0-9] flexibles las unidades.',
    'El ancla ^ garantiza que solo casa el timestamp al inicio.',
    `grep -E '^10:4[0-9]' syslog.txt`,
  ],
  teach: 'Los logs crecen al revés (latest first); grep con franjas de tiempo prefijo es el cuchillo de la búsqueda temporal precisa.',
  cheatsheet: [{ cmd: "grep -E '^10:4[0-9]' f", desc: 'franja de minutos concreta' }, { cmd: "grep -E '^10:(40|41|42)' f", desc: 'alternancia literal de minutos' }],
  keywords: ['grep', 'log', 'hora', 'franja'] });

base({ track: 'forense', index: 24, title: 'El mensaje rot13', subtitle: 'tr con rangos a-z',
  brief: 'El mensaje guardado en roto.txt está en ROT13; tr con doble rango lo devuelve a texto (la marca en claro).',
  goal: 'Decodifica roto.txt con el algoritmo ROT13 (tr con los dos rangos de letras). La marca aparece en claro.',
  setup: () => P(24, 'Forense') + `printf '%s' "${'$'}DOJO_FLAG FLAG{otra} texto" | tr 'a-zA-Z' 'n-za-mN-ZA-M' > ${'$'}HOME/roto.txt
chown agent:agent ${'$'}HOME/roto.txt`,
  solution: `tr 'a-zA-Z' 'n-za-mN-ZA-M' < ${'$'}HOME/roto.txt`,
  hints: [
    'ROT13: tr a-zA-Z en n-za-mN-ZA-M (en minúsculas n-z = primera mitad; a-m = segunda).',
    'Aplicar el MISMO tr dos veces reintegra el original (idempotente).',
    `tr 'a-zA-Z' 'n-za-mN-ZA-M' < roto.txt`,
  ],
  teach: 'tr traduce bajos bytes; el ROT13 es el cifrado más simple (rotate de 13 posiciones). Doble cifrado = mensaje original.',
  cheatsheet: [{ cmd: "tr a-zA-Z n-za-mN-ZA-M < f", desc: 'aplica ROT13' }, { cmd: "tr a-z A-Z < f", desc: 'general: a mayúsculas' }],
  keywords: ['tr', 'ROT13', 'cifrado'] });

base({ track: 'forense', index: 25, title: 'Las visitas del intruso', subtitle: 'conteo por IP con sort/uniq',
  brief: 'El log de visitas repite IPs; la más FRECUENTE es el intruso y SU línea lleva la marca.',
  goal: 'De visitas.log calcula la IP MÁS frecuente (ranking) y DESPUÉS imprime TODAS sus visitas con grep (una lleva la marca).',
  setup: () => P(25, 'Forense') + `cat > ${'$'}HOME/visitas.log <<EOF
visitante 203.0.113.9
visitante 198.51.100.8
visitante 203.0.113.9
visitante 192.168.44.4
visitante 203.0.113.9 ${'$'}DOJO_FLAG
EOF
chown agent:agent ${'$'}HOME/visitas.log`,
  solution: `g=$(grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' ${'$'}HOME/visitas.log | sort | uniq -c | sort -nr | head -1 | awk '{print ${'$'}2}'); grep "${'$'}g" ${'$'}HOME/visitas.log`,
  hints: [
    'grep -oE "([0-9]+\\.){3}[0-9]+" extrae IPs.',
    'sort | uniq -c | sort -nr ordena por FRECUENCIA descendente; con awk {print $2} aislada la IP ganadora.',
    'Con la IP en mano, grep "$ip" visitas.log imprime TODAS sus visitas (la última lleva la marca).',
    `g=$(grep -oE '([0-9]+\\.){3}[0-9]+' visitas.log | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep "$g" visitas.log`,
  ],
  teach: 'La espiral sort | uniq -c | sort -nr es EL ranking de frecuencias; con IPs, dominios y user-agents es el primer análisis forense real.',
  cheatsheet: [{ cmd: "grep -oE ' patron' f | sort | uniq -c | sort -nr", desc: 'ranking de los patrones más repetidos' }, { cmd: 'uniq -c | sort -rn | head -3', desc: 'top 3' }],
  keywords: ['forense', 'ips', 'ranking', 'uniq'] });

base({ track: 'forense', index: 26, title: 'El maletín base64 de doble capa', subtitle: 'base64 dentro de base64',
  brief: 'La marca fue codificada EN DOS CAPAS base64; decodifica doble para revelarla.',
  goal: 'Lee doble.txt (base64 de base64) y decodifica DOS veces para revelar la marca.',
  setup: () => P(26, 'Forense') + `printf '%s' "${'$'}DOJO_FLAG" | base64 | base64 > ${'$'}HOME/doble.txt
chown agent:agent ${'$'}HOME/doble.txt`,
  solution: `base64 -d ${'$'}HOME/doble.txt | base64 -d`,
  hints: [
    'Decodifica DOS veces: la salida de la 1.a (binario) es la entrada de la 2.a.',
    'La primera decodificación devuelve OTRO base64; la segunda devuelve el texto (la marca).',
    `base64 -d doble.txt | base64 -d`,
  ],
  teach: 'Los ataques de ofuscación abusa del software-cuento (base64, base64, hex, rot13): decodificar capas por orden es la técnica forense estándar.',
  cheatsheet: [{ cmd: 'base64 -d f | base64 -d', desc: 'doble decodificación encadenada' }, { cmd: 'base64 -d f | xxd -r -p', desc: 'base64 y después hex' }],
  keywords: ['base64', 'doble', 'forense'] });

/* ── boss ── */
base({ track: 'boss', index: 21, title: 'Boss: la cadena completa', subtitle: 'grep+awk+sort+uniq',
  brief: 'El log encadena: extrae el campo clave con awk, cuéntalo y muestra el ganador con su marca.',
  goal: 'De cadena.log calcula el valor (2.º campo) que MÁS se repite y DESPUÉS imprime TODAS sus líneas con grep (una lleva la marca).',
  setup: () => P(21, 'Boss') + `cat > ${'$'}HOME/cadena.log <<EOF
ev1 alfa
ev2 beta
ev3 alfa
ev4 alfa ${'$'}DOJO_FLAG
ev5 beta
EOF
chown agent:agent ${'$'}HOME/cadena.log`,
  solution: `g=$(awk '{print ${'$'}2}' ${'$'}HOME/cadena.log | sort | uniq -c | sort -nr | head -1 | awk '{print ${'$'}2}'); grep " ${'$'}g " ${'$'}HOME/cadena.log`,
  hints: [
    'awk saca el 2.º campo; sort agrupa; uniq -c cuenta; sort -nr ordena por frecuencia.',
    'El head -1 entrega el RANKING ganador; con awk {print $2} aislado el VALOR.',
    'Con el valor en mano, grep " $g " cadena.log imprime TODAS sus líneas (una lleva la marca).',
    `g=$(awk '{print $2}' cadena.log | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep " $g " cadena.log`,
  ],
  teach: 'La cadena sort | uniq -c | sort -nr es el análisis de frecuencia basico; con awk delante descaturas de columna. Es el pipeline de «¿quién domina este campo?».',
  cheatsheet: [{ cmd: "awk '{print $2}' f | sort | uniq -c | sort -nr | head -1", desc: 'el valor más frecuente del 2.º campo' }, { cmd: "sort -k2 f | uniq -c -f1 | sort -nr | head", desc: 'ídem trabajando solo con sort/uniq' }],
  keywords: ['boss', 'pipeline', 'uniq'] });

base({ track: 'boss', index: 22, title: 'Boss: dos llaves, un talón', subtitle: 'join awk across files',
  brief: 'Dos ficheros comparten el nombre como Clave; un awk unel el precio con el stock y marca la línea COMPLETA.',
  goal: "Une precios.txt con stock.txt POR NOMBRE e imprime el catálogo combinado: nombre, precio del primero y TODAS las columnas del stock (donde viaja la marca).",

  setup: () => P(22, 'Boss') + `cat > ${'$'}HOME/precios.txt <<EOF
lampara 100
mesa 200
EOF
cat > ${'$'}HOME/stock.txt <<EOF
lampara 5 ${'$'}DOJO_FLAG
mesa 2
EOF
chown agent:agent ${'$'}HOME/precios.txt ${'$'}HOME/stock.txt`,
  solution: `awk 'NR==FNR {p[${'$'}1]=${'$'}2; next} {print ${'$'}1, p[${'$'}1], ${'$'}2, ${'$'}3}' ${'$'}HOME/precios.txt ${'$'}HOME/stock.txt`,
  hints: [
    'NR==FNR construye el índice del 1.er fichero (p = precio); en el 2.º, imprime y resuelve.',
    'El fase procesando: precios.txt PRIMERO, stock.txt después (los órdenes importan).',
    `awk 'NR==FNR {p[$1]=$2; next} {print $1, p[$1], $2}' precios.txt stock.txt | grep lampara`,
  ],
  teach: 'El awk-join es el relacional de shell: dos tablas, una clave, un solo comando. Su posición de orden: indice primero, datos después.',
  cheatsheet: [{ cmd: `awk 'NR==FNR {a[$1]=$2; next} {print a[$1], $0}' idx datos`, desc: 'join tablas por clave' }],
  keywords: ['boss', 'join', 'awk'] });

base({ track: 'boss', index: 23, title: 'Boss: la malla de logs', subtitle: 'grep multi-criterio con anclas',
  brief: 'El log mixto solo revela su marca si casan DOS criteria al mismo tiempo (IP y modo).',
  goal: 'Imprime las líneas de malla.log que contengan 203.0.113.9 Y (ERROR o FAILED) al mismo tiempo (grep -E patrones).*',
  setup: () => P(23, 'Boss') + `cat > ${'$'}HOME/malla.log <<EOF
10:01 CONNECT 203.0.113.9 OK
10:02 CONNECT 198.51.100.8 ERROR
10:03 CONNECT 203.0.113.9 FAILED ${'$'}DOJO_FLAG
10:04 CONNECT 203.0.113.9 LISTENING
EOF
chown agent:agent ${'$'}HOME/malla.log`,
  solution: `grep '203.0.113.9' ${'$'}HOME/malla.log | grep -E 'ERROR|FAILED'`,
  hints: [
    'El 1.er grep filtra IP; el 2.º exige ERROR o FAILED (grep -E con alternancia).',
    'El criterio exacto AND/OR: la línea ganadora lleva la marca.',
    `grep '203.0.113.9' malla.log | grep -E 'ERROR|FAILED'`,
  ],
  teach: 'El patrón «FILTRA A | EXIGE B» (pipa con and) es demasiado común en log-filtrado: cada grep agrega un criterio sin regex síntesis.',
  cheatsheet: [{ cmd: "grep A f | grep -E 'B|C'", desc: 'AND + OR combinados en 2 greps' }, { cmd: "grep -E 'A.*B|B.*A' f", desc: 'ídem en un solo grep (más frágil)' }],
  keywords: ['boss', 'grep', 'AND', 'OR'] });

base({ track: 'boss', index: 24, title: 'Boss: el alquimista integral', subtitle: 'awk sum con guard',
  brief: 'El registro trae importes y filas rotas; el total VÁLIDO (solo importes numéricos) lleva la marca.',
  goal: "Suma el 2.º campo de totales.txt SOLO donde sea un importe numérico (el guard de regex que toque); imprime la SUMA TOTAL.",
  setup: () => P(24, 'Boss') + `cat > ${'$'}HOME/totales.txt <<EOF
compra 100
devol
venta 35.5
compra 60
EOF
echo "total correlato ${'$'}DOJO_FLAG" > ${'$'}HOME/sumario.txt
chown agent:agent ${'$'}HOME/totales.txt ${'$'}HOME/sumario.txt`,
  solution: `awk '$2 ~ /^[0-9]+(\\.[0-9]+)?$/ {s+=${'$'}2} END {print s}' ${'$'}HOME/totales.txt; cat ${'$'}HOME/sumario.txt`,
  hints: [
    'El guard $2 ~ /^[0-9]+(\\.[0-9]+)?$/ filtra floats e ints (la fila rot «devol» se cae).',
    'La marca viaja en sumario.txt: cat al final.',
    `awk '$2 ~ /^[0-9.]+$/{s+=$2} END {print s}' totales.txt; cat sumario.txt`,
  ],
  teach: 'Combinar SUMA y GUARD de tipo es el escudo anti-datos-rotos de awk: ni suspendes el cálculo ni sueltas el dato malo.',
  cheatsheet: [{ cmd: `awk '$2 ~ /^[0-9.]+$/ {s+=$2} END {print s}' f`, desc: 'suma blindada' }, { cmd: `awk '!n[$0]++ {print}' f | sort`, desc: 'complemento: dedup antes de sumar' }],
  keywords: ['boss', 'suma', 'guard', 'awk'] });

base({ track: 'boss', index: 25, title: 'Boss: el diagrama compositivo', subtitle: 'tar + grep del manifest interior',
  brief: 'El manifiesto dentro del tar.gz lista los ficheros; hay que descomprimir, localizar el fichero marcado y señalar SU contenido (que viajó dentro).',
  goal: 'Empaqueta el árbol /home/agent/proy en proy.tgz (sin incluir el tar en sí), y localiza via tar -t el fichero clave.txt; imprime su contenido con tar -Oxz.',
  setup: () => P(25, 'Boss') + `mkdir -p ${'$'}HOME/proy/ins ${'$'}HOME/proy/src
echo 'backend ok' > ${'$'}HOME/proy/src/main.py
echo "clave con marca ${'$'}DOJO_FLAG" > ${'$'}HOME/proy/ins/clave.txt
chown -R agent:agent ${'$'}HOME/proy`,
  solution: `tar czf ${'$'}HOME/proy.tgz -C ${'$'}HOME proy && tar tzf ${'$'}HOME/proy.tgz | grep clave && tar -Oxz -f ${'$'}HOME/proy.tgz proy/ins/clave.txt`,
  hints: [
    'tar -C DIR cambia el BASE dir al empacar (rutas limpies dentro del tar).',
    'Con -O stracción con salida a stdout del fichero interior sin extraer a disco.',
    `tar czf proy.tgz -C ~ proy; tar tzf proy.tgz; tar -Oxz -f proy.tgz proy/ins/clave.txt`,
  ],
  teach: 'El paquete de árbol con -C, la inspección con -t y la extracción quirúrgica con -O forman el flujo de CASO REAL: luego es Copiarlo, no IMÁGENELO.',
  cheatsheet: [{ cmd: 'tar czf p.tgz -C born dir', desc: 'empaca con base limpio' }, { cmd: 'tar xOzf p.tgz path/dentro', desc: 'imprime un fichero interior' }],
  keywords: ['boss', 'tar', 'paquete'] });

base({ track: 'boss', index: 26, title: 'Boss: la batalla final', subtitle: 'combina-x: awk+sort+grep+uniq+head',
  brief: 'El colofón del track: un log entero se reduce a la línea GANADORA (que lleva la marca), pasando por campo, conteo y extracción.',
  goal: 'De final.log extrae el lugar (2.º campo) MÁS FRECUENTE, y con su clave imprime TODAS sus líneas del log (una lleva la marca).',
  setup: () => P(26, 'Boss') + `cat > ${'$'}HOME/final.log <<EOF
ord cafetería 1
ord aula 2
ord cafetería 3
ord gimnasio 4
ord cafetería 5 ${'$'}DOJO_FLAG
EOF
chown agent:agent ${'$'}HOME/final.log`,
  solution: `g=$(awk '{print ${'$'}2}' ${'$'}HOME/final.log | sort | uniq -c | sort -nr | head -1 | awk '{print ${'$'}2}'); grep " ${'$'}g " ${'$'}HOME/final.log`,
  hints: [
    'Paso 1: el valor dominante con awk+sort+uniq+sort -nr+head -1 (guárdalo como $g).',
    'Paso 2: el head -1 del ranking NO sirve: regresa al log con grep " $g " e imprime TODAS sus líneas.',
    `g=$(awk '{print $2}' final.log | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep " $g " final.log`,
  ],
  teach: 'El boss de final de round: awk al análisis, sort|uniq al ranking, grep al regreso, head al corte. Todo el repertorio operando en una sola línea — nivel MASTERS.',
  cheatsheet: [{ cmd: `g=$(awk '{print $2}' f | sort | uniq -c | sort -nr | head -1 | awk '{print $2}'); grep " $g " f | head -1`, desc: 'el campo dominante y SU línea' }],
  keywords: ['boss', 'master', 'pipeline'] });

/* ════════════════════════════════════════════════════ emisión ══ */
emit('grep', GREP);
emit('awk', AWK);
console.log(`tracks base: ${BASE.length} niveles (l21–l26 por track)`);
const porTrack = {};
for (const lv of BASE) porTrack[lv.track] = (porTrack[lv.track] ?? 0) + 1;
for (const [tr, n] of Object.entries(porTrack)) emit(tr, BASE.filter((lv) => lv.track === tr));
console.log('listo: ronda 5 completa');
