/*
 * gen-awk-grep — genera la dos pistas de ESPECIALIZACIÓN del dojo:
 *   · grep (14 niveles): solo grep a fondo — -i -v -n -o -E -F -r -w,
 *     contexto -A/-B, clases con anclas, --include, -x y boss en cadena.
 *   · awk  (14 niveles): solo awk a fondo — $N/$NF, NF, NR, -F:,
 *     comparaciones, regex por campo, máximo+END, concatenación,
 *     asociativos, join con FNR==NR, acumulador con filtro, match().
 * Contrato del motor (scripts/test-levels.mjs):
 *   · setup contiene $DOJO_FLAG (se sustituye por la flag del test).
 *   · la solución NO la menciona y la imprime en stdout (exit 0).
 *   · hints ≥ 2 · cheatsheet · teach · keywords · profile.
 * Regenerar: node scripts/gen-awk-grep.mjs  (determinista)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const HOME = '/home/agent';

/* ════════════════════════════════════════════════════════════ GREP ══ */
const GREP = [
  {
    index: 1, title: 'El diario del dojo', subtitle: 'grep básico: líneas que contienen algo',
    xp: 25, difficulty: 1,
    brief: 'El diario de visitas registra cada paso por el dojo. Una entrada anómala dejó constancia del hallazgo: es la única que habla de «hallazgo».',
    goal: 'Imprime la línea del diario que contiene la palabra hallazgo.',
    setup: (_, f) => `
cat > ${HOME}/visitas.log <<EOF
07:12 recepción acreditó al visitante
08:45 gimnasio rutina de la mañana
09:31 archivo visitó la sala oeste
10:02 hallazgo ${f}
11:20 cafetería colación del turno
12:44 salida del visitante por el portal
EOF
chown agent:agent ${HOME}/visitas.log`,
    solution: `grep 'hallazgo' ${HOME}/visitas.log`,
    hints: [
      'grep PATRÓN FICHERO imprime las líneas que contienen PATRÓN.',
      'El patrón es una palabra plana: hallazgo.',
      `grep 'hallazgo' ${HOME}/visitas.log`,
    ],
    teach: 'grep busca un patrón en un fichero y muestra cada línea que lo contiene. Es la base de todo el filtrado en la terminal: las variantes siguientes (−i, −v, −o…) son solo ajustes de esta misma idea.',
    cheatsheet: [
      { cmd: 'grep patrón fichero', desc: 'líneas que contienen el patrón' },
      { cmd: 'grep -c patrón f', desc: 'cuántas líneas casan' },
    ],
    keywords: ['grep', 'filtrado', 'log'],
  },
  {
    index: 2, title: 'Mayúsculas rebeldes', subtitle: 'grep -i: ignorar el caso',
    xp: 30, difficulty: 2,
    brief: 'El reactor escribe «critico» con gritos aleatorios: cRiTiCo, CRITICO… Solo −i se entera de todas sus formas.',
    goal: 'Imprime del reactor.log las líneas que contienen critico en cualquier combinación de mayúsculas y minúsculas.',
    setup: (_, f) => `
cat > ${HOME}/reactor.log <<EOF
temp=310 ventilador nominal
rumor crítico descartado por el operador
cRiTiCo refrigerante bajo: ${f}
alerta critica-formato (borrador del turno)
CRITICO simulacro programado a mediodía
FIN
chown agent:agent ${HOME}/reactor.log`,
    solution: `grep -i 'critico' ${HOME}/reactor.log`,
    hints: [
      '−i busca sin distinguir mayúsculas de minúsculas.',
      'El patrón en minúsculas + -i casa cRiTiCo y CRITICO también.',
      `grep -i 'critico' ${HOME}/reactor.log`,
    ],
    teach: 'grep -i ignora el caso: critico casa con cRiTiCo y CRITICO. Ojo con el acento: «crítico» con tilde NO casa con «critico» — en logs reales conviene decidir qué se busca y probarlo.',
    cheatsheet: [
      { cmd: 'grep -i patrón f', desc: 'insensible a mayúsculas' },
      { cmd: 'grep -v patrón f', desc: 'excluye las líneas que casan' },
    ],
    keywords: ['grep', '-i', 'mayúsculas'],
  },
  {
    index: 3, title: 'Quitar el ruido', subtitle: 'grep -v: excluir líneas',
    xp: 35, difficulty: 2,
    brief: 'El proxy.conf es un ruido de comentarios y líneas de debug. El ajuste auth_secret está ahí, escondido entre tanto adorno.',
    goal: 'Trae a la vista la línea auth_secret del config: primero descarta los comentarios (#), luego busca el ajuste.',
    setup: (_, f) => `
cat > ${HOME}/proxy.conf <<EOF
# proxy del dojo
# ajustes de escucha
port 8091
debug nivel 3
auth_secret ${f}
# notas del operador
timeout 30
debug detalle extra del demonio
FIN
chown agent:agent ${HOME}/proxy.conf`,
    solution: `grep -v '^#' ${HOME}/proxy.conf | grep 'auth_secret'`,
    hints: [
      '−v es el filtro inverso: muestra las líneas que NO casan.',
      'Encadena dos greps con una tubería: limpiar primero, apuntar después.',
      `grep -v '^#' ${HOME}/proxy.conf | grep 'auth_secret'`,
    ],
    teach: 'grep -v invierte el criterio: «muéstrame lo que NO casa». Combinar −v con un segundo grep es el patrón clásico de limpieza: quita lo inútil y entonces filtra lo importante.',
    cheatsheet: [
      { cmd: 'grep -v patrón f', desc: 'excluye las líneas que casan' },
      { cmd: 'cmd1 | cmd2', desc: 'tubería: la salida alimenta al siguiente' },
    ],
    keywords: ['grep', '-v', 'excluir'],
  },
  {
    index: 4, title: 'La línea número…', subtitle: 'grep -n: numerar resultados',
    xp: 35, difficulty: 2,
    brief: 'Para reportar el incidente al rango superior necesitas saber en QUÉ línea del registro aterrizó la anomalía.',
    goal: 'Imprime la línea de la anomalía con su número de línea (formato nº: contenido).',
    setup: (_, f) => `
{ for i in $(seq 1 15); do
    case $i in
      12) echo "2026-10-22 08:$i anomalía ${f}";;
      4) echo "2026-10-22 08:0$i revisión rutinaria";;
      *) echo "2026-10-22 08:$i turno sin novedades";;
    esac;
  done; } > ${HOME}/turnos.log
chown agent:agent ${HOME}/turnos.log`,
    solution: `grep -n 'anomalía' ${HOME}/turnos.log`,
    hints: [
      '−n antepone el número de línea a cada coincidencia.',
      'La palabra anomalía (con acento) aparece solo en la línea 12.',
      `grep -n 'anomalía' ${HOME}/turnos.log`,
    ],
    teach: 'grep -n numeriza las coincidencias: imprescindible para decir «línea 12» al operador de guardia. Se combina con las demás opciones: -in, -rn, -on…',
    cheatsheet: [
      { cmd: 'grep -n patrón f', desc: 'con número de línea' },
      { cmd: 'grep -in patrón f', desc: 'insensible + numerado' },
    ],
    keywords: ['grep', '-n', 'numerar'],
  },
  {
    index: 5, title: 'Solo la marca', subtitle: 'grep -o: extraer, no mostrar',
    xp: 45, difficulty: 3,
    brief: 'En carta.txt la marca viaja dentro de la prosa: la línea entera es demasiado ruido. Quieres SOLO la pieza que casa, nada más.',
    goal: 'Extrae de carta.txt únicamente la subcadena en formato FLAG{…} (una línea limpia, sin adornos).',
    setup: (_, f) => `
cat > ${HOME}/carta.txt <<EOF
cordial saludo, write con tinta del dojo 2026,
registro el hallazgo en el volumen tres: ${f}
además, un eco curioso: FLAG en minúsculas no cuenta,
y otra marca truncada por el cartero: FLAG{ sin cierre
adiós, saludos del dúo
EOF
chown agent:agent ${HOME}/carta.txt`,
    solution: `grep -oE 'FLAG\\{[^}]*\\}' ${HOME}/carta.txt`,
    hints: [
      '−o imprime la PARTE que casa, no la línea entera.',
      'El patrón debe describir: FLAG + { + todo lo que NO sea llave de cierre + }.',
      "grep -oE 'FLAG\\{[^}]*\\}' carta.txt",
    ],
    teach: 'grep -o cambia el foco: en lugar de líneas completas, extrae exactamente la coincidencia. Con -E y el patrón FLAG\\{[^}]*\\} sales las marcas en una línea limpia… y las truncadas sin cierre, descartadas.',
    cheatsheet: [
      { cmd: "grep -oE 'FLAG\\{[^}]*\\}' f", desc: 'extrae solo la marca' },
      { cmd: "grep -oE '[0-9]+' f", desc: 'extrae todos los números' },
    ],
    keywords: ['grep', '-o', 'extraer'],
  },
  {
    index: 6, title: 'Rango privado', subtitle: 'grep -E con anclas y clases',
    xp: 50, difficulty: 3,
    brief: 'Un envío interno (subred 172.31.*) filtró el hallazgo hacia una puerta impropia. Los demás rangos son de paseo.',
    goal: 'Imprime del registro de red las entradas cuyo emisor empieza por 172.31. (anclado al inicio de línea).',
    setup: (_, f) => `
cat > ${HOME}/red.log <<EOF
10.0.0.4 -> local ok, ping 200
172.16.3.9 -> depósito secundario
192.168.1.7 -> domótica del ala norte
172.31.14.3 -> entrega del hallazgo: ${f}
10.44.9.8 -> respaldo nocturno
172.31.255.1 -> balanceador sin etiqueta
192.168.0.2 -> envío externo simulado
EOF
chown agent:agent ${HOME}/red.log`,
    solution: `grep -E '^172\\.31\\.[0-9]+\\.[0-9]+' ${HOME}/red.log`,
    hints: [
      '−E activa la regex extendida: + (uno o más), clases [0-9], anclas ^.',
      'En -E el punto ANY es \\. y el punto préstamo es . literal.',
      `grep -E '^172\\.31\\.[0-9]+\\.[0-9]+' ${HOME}/red.log`,
    ],
    teach: 'grep -E abre el vocabulario regex completo: +, clases y anclas ^. Los puntos literales se escapan: \\. — sin el escape casarían «cualquier carácter». La ancla ^ evita que una IP en medio de la línea engañe.',
    cheatsheet: [
      { cmd: "grep -E '^172\\.31\\.' f", desc: 'IP anclada a inicio de línea' },
      { cmd: "grep -E '(a|b)c'", desc: 'alternancia' },
    ],
    keywords: ['grep', '-E', 'regex', 'IP'],
  },
  {
    index: 7, title: 'Reglas literales', subtitle: 'grep -F: patrón sin regex',
    xp: 50, difficulty: 3,
    brief: 'El cuaderno del taller guarda órdenes con símbolos que parecerían regex (*. ?). Los decoys escribieron variantes sin símbolos. −F toma el patrón tal cual.',
    goal: 'Encuentra en taller.txt la línea que contiene la instrucción detector.*laser escrita tal cual, con sus símbolos.',
    setup: (_, f) => `
cat > ${HOME}/taller.txt <<EOF
instrucciones: calibrar el sensor en modo calmo
órdenes: detector de láser (el rojo, siempre el rojo)
plan maestro: detector.*laser activo esta noche ${f}
regla: detectorXlaser es la variación escrita a mano
nota: el del otro taller escribió detectorlaser sin nada
EOF
chown agent:agent ${HOME}/taller.txt`,
    solution: `grep -F 'detector.*laser' ${HOME}/taller.txt`,
    hints: [
      '−F significa Fixed: el patrón es TEXTO PLANO, sin interpretación regex.',
      'Como regex, detector.*laser casaría «detectorXlaser»; con -F solo casa los caracteres exactos: detector.*laser.',
      `grep -F 'detector.*laser' ${HOME}/taller.txt`,
    ],
    teach: 'grep -F (Fixed) trata el patrón como texto: ni + ni * ni puntos mágicos. Es además el grep más rápido en ficheros grandes porque se salta el motor de regex.',
    cheatsheet: [
      { cmd: "grep -F 'a.*b' f", desc: 'coincidencia literal' },
      { cmd: 'grep -Ff lista.txt f', desc: 'múltiples patrones literal de un fichero' },
    ],
    keywords: ['grep', '-F', 'literal'],
  },
  {
    index: 8, title: 'El bosque de expedientes', subtitle: 'grep -r: búsqueda recursiva',
    xp: 55, difficulty: 3,
    brief: 'Los expedientes están repartidos en carpetas por año y mes. Solo quien mira en profundidad encuentra la entrada con la marca.',
    goal: 'Recorre todo el árbol expedientes/ y muestra la línea que contiene la palabra confirmada (con su ruta y línea).',
    setup: (_, f) => `
mkdir -p ${HOME}/expedientes/2026/enero ${HOME}/expedientes/2025/diciembre ${HOME}/expedientes/2026/febrero
echo 'otro hallazgo en la mesa: la copia sin marca' > ${HOME}/expedientes/2026/enero/h-12.txt
echo 'hallazgo confirmado con la marca: ${f}' > ${HOME}/expedientes/2026/febrero/h-31.txt
echo 'hallazgo confirmado (el disputado, sin marca)' > ${HOME}/expedientes/2025/diciembre/h-05.txt
echo 'llamada Sra. Ramírez, depositó tres paquetes' > ${HOME}/expedientes/2025/diciembre/nota.txt
chown -R agent:agent ${HOME}/expedientes`,
    solution: `grep -r 'hallazgo confirmado' ${HOME}/expedientes`,
    hints: [
      '−r baja recursivamente por los subdirectorios: grep PATRÓN DIRECTORIO.',
      'Dos líneas dicen «hallazgo confirmado»; la verdadera trae la marca.',
      `grep -r 'hallazgo confirmado' ${HOME}/expedientes`,
    ],
    teach: 'grep -r recorre el árbol: imprime cada coincidencia con su ruta de origen. Con -rn numeras las líneas del hallazgo; con -rl recibes solo los nombres de fichero.',
    cheatsheet: [
      { cmd: 'grep -r patrón dir', desc: 'recursivo: ruta + línea' },
      { cmd: 'grep -rl patrón dir', desc: 'solo ficheros con coincidencia' },
    ],
    keywords: ['grep', '-r', 'recursivo'],
  },
  {
    index: 9, title: 'Palabras, no fragmentos', subtitle: 'grep -w: palabra entera',
    xp: 60, difficulty: 4,
    brief: 'El índice de niebla trae variantes: brumario, desbrumar, brumelia… Solo el registro con literalmente la palabra bruma aislada guarda la señal.',
    goal: 'Imprime del índice ÚNICAMENTE las líneas donde aparece bruma como palabra entera (ni brumario ni desbrumar ni brumelia).',
    setup: (_, f) => `
cat > ${HOME}/indice.txt <<EOF
brumario-calendario, capítulo tres
desbrumar las ventanas del ala sur
bruma señal clara en el patio: ${f}
brumelia mascota del equipo
niebla densa, sin bruma aparente
EOF
chown agent:agent ${HOME}/indice.txt`,
    solution: `grep -w 'bruma' ${HOME}/indice.txt`,
    hints: [
      '−w exige que la coincidencia sea una PALABRA completa (delimitada por espacios, puntuación, inicio/fin de línea).',
      'Sin -w, «bruma» casaría dentro de «brumario»; con -w no.',
      `grep -w 'bruma' ${HOME}/indice.txt`,
    ],
    teach: 'grep -w garantiza palabra entera: bruma casa, brumario no. Es el antídoto contra los falsos positivos cuando el vocabulario del dojo tiene familias completas de palabras parecidas.',
    cheatsheet: [
      { cmd: "grep -w palabra f", desc: 'solo palabras completas' },
      { cmd: "grep -oE 'FLAG\\{[^}]*\\}'", desc: 'extraer la marca en cualquier contexto' },
    ],
    keywords: ['grep', '-w', 'palabra'],
  },
  {
    index: 10, title: 'Contexto del evento', subtitle: 'grep -A/-B/-C: ver alrededor',
    xp: 65, difficulty: 4,
    brief: 'El registro de tareas no esconde la marca EN la línea del suceso: la clave llega dos líneas DESPUÉS de «pinza». El contexto se lee con −A.',
    goal: 'Muestra del registro la línea pinza y las 2 líneas siguientes (la marca viaja entre ellas).',
    setup: (_, f) => `
cat > ${HOME}/tareas.txt <<EOF
tarea 01: revisar el botón de la guardia
tarea 02: pinza marcada en el tablero
tarea 03: repaso del oficial de guardia
tarea 04: hallazgo asociado a la pinza: ${f}
tarea 05: cierre del día en el tablón
tarea 06: ronda nocturna sin novedades
tarea 07: pinza mencionada en la otra hoja (sin contexto)
EOF
chown agent:agent ${HOME}/tareas.txt`,
    solution: `grep -A2 'pinza marcada' ${HOME}/tareas.txt`,
    hints: [
      '−A N muestra N líneas DESPUÉS de cada coincidencia (−B: antes, −C: ambos).',
      'El patrón punta a la línea 02: pinza marcada; el premio está en la 04.',
      `grep -A2 'pinza marcada' ${HOME}/tareas.txt`,
    ],
    teach: 'grep -A/-B/-C dan contexto alrededor del resultado: A de After (después), B de Before (antes), C de Contexto (ambos). Es la forma rápida de leer un log alrededor del evento sin abrir el fichero entero.',
    cheatsheet: [
      { cmd: 'grep -A2 patrón f', desc: '2 líneas después de cada match' },
      { cmd: 'grep -B3 patrón f', desc: '3 líneas antes' },
      { cmd: 'grep -C5 patrón f', desc: '5 líneas a ambos lados' },
    ],
    keywords: ['grep', '-A', '-B', '-C', 'contexto'],
  },
  {
    index: 11, title: 'Clases con contadores', subtitle: 'grep -E: {n} exacto y rangos',
    xp: 70, difficulty: 4,
    brief: 'El registro del laboratorio guarda muestras con identificador hex compacto. Solo una fila respeta el formato EXACTO: 16 símbolos hexadecimales minúsculas seguidos de un espacio.',
    goal: 'Imprime del registro solo la línea cuyo primer campo sea exactamente 16 hexadecimales en minúscula seguidos de un espacio.',
    setup: (_, f) => `
cat > ${HOME}/muestras.txt <<EOF
abc corto
abcdef0123456789x con salto de formato
FFFFFFFFFFFFFFFF mayúsculas fuera de rango
1f2e3d4c5b6a7980 ${f}
abcdef9 demasiado corto
1f2e3d4c5b6a7980ff demasiado largo
f0e1d2c3 con secuencia truncada
EOF
chown agent:agent ${HOME}/muestras.txt`,
    solution: `grep -E '^[a-f0-9]{16} ' ${HOME}/muestras.txt`,
    hints: [
      '[a-f0-9] es un rango: solo letras a–f y dígitos en minúscula.',
      '{16} pide EXACTAMENTE 16 repeticiones del expediente anterior; el espacio después delimita la columna.',
      `grep -E '^[a-f0-9]{16} ' ${HOME}/muestras.txt`,
    ],
    teach: 'grep -E con rangos y contadores exactos: {16} pide exactamente 16 repeticiones (ni una más). El ancla ^ fija el inicio y el espacio final delimita el campo: sin explore, casaría prefijos de líneas más largas.',
    cheatsheet: [
      { cmd: "grep -E '^[a-f0-9]{16} ' f", desc: 'ID hex exacto de 16' },
      { cmd: "grep -E '[0-9]{4}-[0-9]{2}'", desc: 'formato fecha por clases' },
    ],
    keywords: ['grep', '-E', 'clases', 'contador'],
  },
  {
    index: 12, title: 'Solo en los conf', subtitle: 'grep -r con --include',
    xp: 70, difficulty: 4,
    brief: 'El directorio servicio mezcla configuraciones .conf con logs, scripts y respaldos. La señal «chip» interesa SOLO entre los ficheros .conf vivos.',
    goal: 'Recursivamente, muestra las coincidencias con chip: solo entre ficheros *.conf (con ruta y línea).',
    setup: (_, f) => `
mkdir -p ${HOME}/servicio
for p in servidor cliente mon; do echo "chip: ${f} (config \${p})" > ${HOME}/servicio/\${p}.conf; done
echo 'chip: eco en un log de eventos' > ${HOME}/servicio/evento.log
echo '# chip mencionado en comentario de código' > ${HOME}/servicio/ajuste.py
echo 'chip en el respaldo antiguo, fuera de servicio' > ${HOME}/servicio/ajuste.conf.bak
echo 'sin rastro relevante aquí' > ${HOME}/servicio/otro.log
chown -R agent:agent ${HOME}/servicio`,
    solution: `grep -r --include='*.conf' 'chip: ' ${HOME}/servicio`,
    hints: [
      '--include="*.conf" restringe QUÉ ficheros participan en la recursiva.',
      'El patrón "chip: " (con espacio y dos puntos) deja fuera los ecos sin valor.',
      `grep -r --include='*.conf' 'chip: ' ${HOME}/servicio`,
    ],
    teach: 'grep -r --include="*.conf" filtra los ficheros por NOMBRE (no por contenido) — imprescindible cuando el árbol está lleno de logs, scripts y backups .conf.bak que no forman parte del servicio.',
    cheatsheet: [
      { cmd: 'grep -r --include="*.conf" p dir', desc: 'solo ficheros .conf' },
      { cmd: 'grep -r --exclude="*.bak" p dir', desc: 'el inverso: excluir nombres' },
    ],
    keywords: ['grep', '-r', '--include'],
  },
  {
    index: 13, title: 'La línea exacta', subtitle: 'grep -x: coincidencia de línea completa',
    xp: 75, difficulty: 4,
    brief: 'El registro de accesos guarda pares sec=valor con trampas: indentados, con cola, comentados… Solo una línea es limpia de la forma sec=valor_entero.',
    goal: 'Imprime del registro únicamente las líneas que son exactamente sec=valor (sin espacios antes o después del valor).',
    setup: (_, f) => `
cat > ${HOME}/accesos.txt <<EOF
sec=${f}
  sec=eco con indentación
sec=coeco con cola ash
# sec=comentario del auditor
clave sec=eco en el medio
sec=	eco tras tabulador
sec=
EOF
chown agent:agent ${HOME}/accesos.txt`,
    solution: `grep -xE 'sec=[^[:space:]]+' ${HOME}/accesos.txt`,
    hints: [
      '−x exige que el patrón case TODA la línea (equivale a ^patrón$).',
      '[^[:space:]]+ es «uno o más símbolos que no sean espacios»: descarta indentados, colas y tabs.',
      `grep -xE 'sec=[^[:space:]]+' ${HOME}/accesos.txt`,
    ],
    teach: 'grep -x (exact) obliga a que la coincidencia cubra la línea entera. Con la clase negada [^[:space:]] eliminan trampas de espacios; combinado -xE demuestra que las opciones se acumulan.',
    cheatsheet: [
      { cmd: "grep -x 'palabra' f", desc: 'coincidencia de línea entera' },
      { cmd: "grep -xE 'sec=[^[:space:]]+'", desc: 'exacto con clase negada' },
    ],
    keywords: ['grep', '-x', 'exacto'],
  },
  {
    index: 14, title: 'Boss: la cadena del intruso', subtitle: 'cadena de greps: -rh + -oE',
    xp: 130, difficulty: 5,
    brief: 'Un intruso escribió eventos EXFIL por todo el árbol intrusion/. En un evento real viaja la marca completa; los demás son señuelos incompletos. Dos greps encadenados la desenmascaran.',
    goal: 'Extrae del árbol intrusion/ la marca completa FLAG{…} imprimiendo ÚNICAMENTE la marca (sin rutas ni adornos).',
    setup: (_, f) => `
mkdir -p ${HOME}/intrusion/auth
echo 'EXFIL parcial: solo la cabecera FLAG viajó' > ${HOME}/intrusion/sys-A.log
echo 'EXFIL sin llaves de cierre, salto truncado FLAG{ roto' > ${HOME}/intrusion/sys-B.log
echo 'evento: EXFIL validado con la marca completa: ${f}' > ${HOME}/intrusion/auth/log-C.log
echo 'EXFIL cada 30 segundos, ritmo sin marca' > ${HOME}/intrusion/auth/log-D.log
echo 'nota local: la marca quedó antes de la cuidanimación' > ${HOME}/intrusion/nota.txt
chown -R agent:agent ${HOME}/intrusion`,
    solution: `grep -rh 'EXFIL' ${HOME}/intrusion | grep -oE 'FLAG\\{[^}]*\\}'`,
    hints: [
      'Primer grep: -r recupera las líneas EXFIL del árbol y -h oculta las rutas.',
      'Los parciales sin llaves son trampa: FLAG\\{[^}]*\\} exige cuerpo antes del cierre.',
      "grep -rh 'EXFIL' intrusion | grep -oE 'FLAG\\{[^}]*\\}'",
    ],
    teach: 'La cadena -rh + -oE es el extractor forense: primero selecciona las líneas relevantes en el árbol (−h tira el ruido de rutas), luego −o entrega solo lo casado. Es el patrón grep-sobre-grep: «dime dónde, y luego dame solo la cosa».',
    cheatsheet: [
      { cmd: 'grep -rh patrón dir', desc: 'recursivo sin rutas' },
      { cmd: "grep -oE 'FLAG\\{[^}]*\\}' f", desc: 'extraer la marca' },
    ],
    keywords: ['grep', 'boss', '-r', '-o', 'cadena'],
  },
];

/* ═══════════════════════════════════════════════════════════ AWK ══ */
const AWK = [
  {
    index: 1, title: 'El inspector de columnas', subtitle: 'awk: campos $1, $2…',
    xp: 25, difficulty: 1,
    brief: 'En cargos.txt cada línea es «alias objeto peso». Un envío viene marcado con la marca como objeto y su alias es vista.',
    goal: 'Imprime de cargos.txt el SEGUNDO campo de la línea cuyo primer campo es vista.',
    setup: (_, f) => `
cat > ${HOME}/cargos.txt <<EOF
llave reloj 3
mapa cuaderno 2
vista ${f} 1
candado teclado 4
EOF
chown agent:agent ${HOME}/cargos.txt`,
    solution: `awk '$1 == "vista" {print $2}' ${HOME}/cargos.txt`,
    hints: [
      'awk trabaja con la estructura «patrón {acción}»: el patrón selecciona líneas, la acción imprime.',
      'awk parte cada línea en campos: $1, $2, $3… y $2 es el segundo.',
      `awk '$1 == "vista" {print $2}' ${HOME}/cargos.txt`,
    ],
    teach: 'awk parte cada línea en campos separados por espacios: $1 primero, $2 segundo y $NF último. La estructura patrón {acción} es el corazón de awk: filtro y acción en una sola línea.',
    cheatsheet: [
      { cmd: "awk '{print $2}' f", desc: 'segundo campo de cada línea' },
      { cmd: "awk '$1 == \"x\" {print $2}' f", desc: 'campo 2 de las línea cuyo campo 1 es x' },
    ],
    keywords: ['awk', 'campos'],
  },
  {
    index: 2, title: 'El último campo', subtitle: 'awk $NF: la cola de la línea',
    xp: 30, difficulty: 2,
    brief: 'Los mensajes de maniobra tienen longitud variable. En los de cinco campos va la marca en el final.',
    goal: 'Imprime de mensajes.txt el ÚLTIMO campo de las líneas que empiezan por maniobra y tienen exactamente 5 campos.',
    setup: (_, f) => `
cat > ${HOME}/mensajes.txt <<EOF
maniobra despegue brisa litoral ${f}
maniobra silencio 45
periódico de manecillas sueltas
maniobra vuelo corto estela
EOF
chown agent:agent ${HOME}/mensajes.txt`,
    solution: `awk '$1 == "maniobra" && NF == 5 {print $NF}' ${HOME}/mensajes.txt`,
    hints: [
      '$NF es el ÚLTIMO campo de la línea (se ajusta a cualquier longitud) y NF es cuántos campos tiene.',
      'Filtra $1 == "maniobra" && NF == 5 y entonces imprime $NF.',
      `awk '$1 == "maniobra" && NF == 5 {print $NF}' ${HOME}/mensajes.txt`,
    ],
    teach: 'awk $NF apunta al último campo sin importar la longitud de la línea; NF es el número de campos. La pareja (NF, $NF) maneja registros de ancho variable sin bucles.',
    cheatsheet: [
      { cmd: "awk '{print $NF}' f", desc: 'último campo de cada línea' },
      { cmd: "awk 'NF == 5' f", desc: 'líneas de exactamente 5 campos' },
    ],
    keywords: ['awk', '$NF', 'NF'],
  },
  {
    index: 3, title: 'La contraseña del asistente', subtitle: 'awk -F: separador personalizado',
    xp: 35, difficulty: 2,
    brief: 'El dojo guarda cuentas como passwd, separadas por dos-puntos. La del asistente quedó escrita EN CLARO en el segundo campo.',
    goal: 'De cuentas.dat, imprime el SEGUNDO campo (la contraseña) de la cuenta cuyo primer campo es asistente.',
    setup: (_, f) => `
cat > ${HOME}/cuentas.dat <<EOF
root:x:0:0:root:/root:/bin/bash
agente:x:1000:1000::/home/agent:/bin/bash
asistente:${f}:1001:1001:asistente:/var/asist:/bin/bash
invitado:x:1002:1002::/tmp:/bin/sh
EOF
chown agent:agent ${HOME}/cuentas.dat`,
    solution: `awk -F: '$1 == "asistente" {print $2}' ${HOME}/cuentas.dat`,
    hints: [
      '-F: cambia el separador de campos a «dos-puntos».',
      'El filtro $1 == "asistente" es comparación exacta; la acción imprime $2.',
      `awk -F: '$1 == "asistente" {print $2}' ${HOME}/cuentas.dat`,
    ],
    teach: 'con -F: las líneas passwd se abren en 7 campos: usuario, contraseña, uid, gid, GECOS, home, shell. awk también acepta separadores multi-carácter o regex: -F"[, ]+".',
    cheatsheet: [
      { cmd: "awk -F: '{print $1}' f", desc: 'primera columna de passwd' },
      { cmd: "awk -F: '$3 > 1000' f", desc: 'cuentas con uid alto' },
    ],
    keywords: ['awk', '-F', 'separador'],
  },
  {
    index: 4, title: 'La fila 37', subtitle: 'awk NR: fila concreta',
    xp: 40, difficulty: 2,
    brief: 'El registro de lecturas lleva 42 filas de calma. La 37 guarda la lectura crítica: awk sabe dirigirse directo a ella con NR.',
    goal: 'Imprime únicamente la línea 37 del registro lecturas.txt.',
    setup: (_, f) => `
{ for i in $(seq 1 42); do
    if [ "$i" -eq 37 ]; then echo "lectura $i: pico ${f}"; else echo "lectura $i: calma"; fi
  done; } > ${HOME}/lecturas.txt
chown agent:agent ${HOME}/lecturas.txt`,
    solution: `awk 'NR == 37 {print}' ${HOME}/lecturas.txt`,
    hints: [
      'NR es el número de la línea que awk va procesando (empieza en 1).',
      'NR == 37 imprime la 37.ª línea y nada más.',
      `awk 'NR == 37 {print}' ${HOME}/lecturas.txt`,
    ],
    teach: 'awk cuenta líneas con NR: puedes seleccionar filas concretas (NR==37), rangos (NR>=2 && NR<=5) o pares (NR%2==0) sin tocar nada más.',
    cheatsheet: [
      { cmd: "awk 'NR <= 5' f", desc: 'las 5 primeras líneas' },
      { cmd: "awk 'NR % 2 == 0' f", desc: 'solo las filas pares' },
    ],
    keywords: ['awk', 'NR', 'línea'],
  },
  {
    index: 5, title: 'Filas de nueve', subtitle: 'awk NF como filtro',
    xp: 45, difficulty: 3,
    brief: 'El cuaderno de travesías guarda filas de distinto ancho. Solo las filas de EXACTAMENTE 9 palabras llevan la firma del capitán.',
    goal: 'Imprime de travesia.txt únicamente las filas con exactamente 9 campos.',
    setup: (_, f) => `
cat > ${HOME}/travesia.txt <<EOF
un dos tres
uno dos tres cuatro
uno dos tres cuatro cinco
uno dos tres cuatro cinco seis siete
uno dos tres cuatro cinco seis siete ocho ${f}
uno dos tres cuatro cinco seis siete ocho
uno dos tres cuatro cinco seis siete ocho nueve
uno dos tres cuatro cinco seis siete ocho nueve diez
uno dos tres cuatro cinco seis siete ocho nueve diez once
uno dos tres cuatro cinco seis siete ocho nueve diez once doce
uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece
EOF
chown agent:agent ${HOME}/travesia.txt`,
    solution: `awk 'NF == 9' ${HOME}/travesia.txt`,
    hints: [
      'NF (sin $) es el número de campos de la línea: e-aye comparar con ==, >, <.',
      '"Exactamente 9" es NF == 9 — las de 6 o 10 quedan fuera.',
      `awk 'NF == 9' ${HOME}/travesia.txt`,
    ],
    teach: 'awk permite comparar variables internas (NF, NR, $N) con operadores: filtros «por número de columnas» sin escribir bucles. Comprueba con NR en la línea de arriba cuando te cuesten.',
    cheatsheet: [
      { cmd: "awk 'NF == 9' f", desc: 'filas de exactamente 9 campos' },
      { cmd: "awk 'NF > 5 && NR > 3' f", desc: 'doble filtro' },
    ],
    keywords: ['awk', 'NF', 'filtro'],
  },
  {
    index: 6, title: 'Umbral crítico', subtitle: 'awk: comparación numérica',
    xp: 50, difficulty: 3,
    brief: 'Los famacéuticos con tonelaje superior a 120 salen con la marca REMITIDA (y a veces es su nombre).',
    goal: 'De cargamentos.txt, imprime el NOMBRE (1.er campo) de las filas cuyo TONELAJE (2.º campo) supera 120.',
    setup: (_, f) => `
cat > ${HOME}/cargamentos.txt <<EOF
tornillo 42
malla 88
${f} 140
arena 15
vigas 100
EOF
chown agent:agent ${HOME}/cargamentos.txt`,
    solution: `awk '$2 > 120 {print $1}' ${HOME}/cargamentos.txt`,
    hints: [
      '$2 > 120 es un filtro numérico: awk convierte el campo a número para comparar.',
      'La acción {print $1} imprime el primer campo (el nombre).',
      `awk '$2 > 120 {print $1}' ${HOME}/cargamentos.txt`,
    ],
    teach: 'awk es un motor de informáticos: coge una columna, aplica un umbral y Reporta otra columna. La comparación funciona con decimales también (19.5 > 19).',
    cheatsheet: [
      { cmd: "awk '$2 > 120 {print $1}' f", desc: 'nombre de filas con valor alto' },
      { cmd: "awk '$2 <= 50' f", desc: 'bajo el umbral (líneas completas)' },
    ],
    keywords: ['awk', 'comparación', 'umbral'],
  },
  {
    index: 7, title: 'El código de la antena', subtitle: 'awk: regex por campo (~)',
    xp: 55, difficulty: 3,
    brief: 'El radar de equipos registra «equipo código estado». Solo un equipo sigue el patrón H + 3 dígitos + mayúscula exacta: la marca viaja en su estado.',
    goal: 'Imprime de equipos.txt el ESTADO (tercer campo) de la fila cuyo código (2.º campo) es H seguido de 3 dígitos y una mayúscula, nada más.',
    setup: (_, f) => `
cat > ${HOME}/equipos.txt <<EOF
antena H12A ok
sonda ab90X ausente
escudo H456X ${f}
radar H456Zx ausente
gobernador 9H456Y ausente
flujo H08Q ok
EOF
chown agent:agent ${HOME}/equipos.txt`,
    solution: `awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3}' ${HOME}/equipos.txt`,
    hints: [
      'El operador ~ aplica una regex al campo: $2 ~ /^H./.',
      'Sin contadores {3} (algunos awk no los admiten): encadena [0-9][0-9][0-9].',
      `awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3}' ${HOME}/equipos.txt`,
    ],
    teach: 'awk hace regex por campo: $2 ~ /patrón/ casa SOLO el campo dos. Con el delimitador ^…$ evitas códigos parciales; y como el awk del sistema (mawk) no garantiza contadores {3}, encadenamos las clases: portable y seguro.',
    cheatsheet: [
      { cmd: "awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/' f", desc: 'regex exacta sobre campo 2' },
      { cmd: "awk '$3 !~ /ok/' f", desc: 'el !~ niega el match' },
    ],
    keywords: ['awk', 'regex', '~'],
  },
  {
    index: 8, title: 'El mejor lote', subtitle: 'awk: máximo del fichero con END',
    xp: 60, difficulty: 4,
    brief: 'lotes.txt lista «lote tonelaje». El lote mayor lleva la marca por nombre. awk mantiene al actual campeón mientras recorre y lo anuncia al FINAL.',
    goal: 'Imprime de lotes.txt el NOMBRE del lote de mayor tonelaje.',
    setup: (_, f) => `
cat > ${HOME}/lotes.txt <<EOF
granito 40
cemento 90
${f} 400
arena 75
arcilla 60
EOF
chown agent:agent ${HOME}/lotes.txt`,
    solution: `awk '$2 > max {max = $2; best = $1} END {print best}' ${HOME}/lotes.txt`,
    hints: [
      'Sin END, el "resultado" solo vive dentro de línea a línea; con una variable y comparación guardas al mejor.',
      'END se ejecuta UNA VEZ, cuando acaba el fichero: es el sitio del resultado final.',
      `awk '$2 > max {max = $2; best = $1} END {print best}' ${HOME}/lotes.txt`,
    ],
    teach: 'El esquema «comparar en cada línea, guardar al mejor, imprimir en END» es awk streaming: acumulas en variables mientras lee y cierras con la conclusión. Las variables no inicializadas valen 0: no hay que declarlas.',
    cheatsheet: [
      { cmd: "awk '$2 > max {max=$2} END {print max}' f", desc: 'máximo de la 2.ª columna' },
      { cmd: "awk 'END {print NR}' f", desc: 'total de líneas leídas' },
    ],
    keywords: ['awk', 'END', 'máximo'],
  },
  {
    index: 9, title: 'Ensamblaje del sello', subtitle: 'awk concatenación + END',
    xp: 60, difficulty: 4,
    brief: 'trozos.txt guarda la marca partido en tres líneas: «trozo n fragmento». awk los junta en orden y al final los suelta de una tacada con END.',
    goal: 'Concatena los 3.er campos de las líneas trozo de trozos.txt (en el orden del fichero) e imprime TODO en una línea.',
    setup: () => `
FLAG="$DOJO_FLAG"
echo "trozo 1 \${FLAG:0:5}" > ${HOME}/trozos.txt
echo "trozo 2 \${FLAG:5:15}" >> ${HOME}/trozos.txt
echo "trozo 3 \${FLAG:20}" >> ${HOME}/trozos.txt
chown agent:agent ${HOME}/trozos.txt`,
    solution: `awk '/^trozo/ {s = s $3} END {print s}' ${HOME}/trozos.txt`,
    hints: [
      'awk permite manipular variables: s = s $3 añade el tercer campo a lo acumulado.',
      'Pago en una línea: END {print s} al terminar, no en el patrón.',
      `awk '/^trozo/ {s = s $3} END {print s}' ${HOME}/trozos.txt`,
    ],
    teach: 'awk no necesita bucles para ensamblar: la variable s acumula campos y END los vierte. La concatenación es por yuxtación: s = s $3 (sin +) une el campo tras la variable.',
    cheatsheet: [
      { cmd: "awk '{s = s $1} END {print s}' f", desc: 'concatena los primeros campos' },
      { cmd: "awk '{s = s $2 \", \"} END {print s}' f", desc: 'concatena con separador' },
    ],
    keywords: ['awk', 'concatenar', 'END'],
  },
  {
    index: 10, title: 'La sesión del trío', subtitle: 'awk arrays asociativos: ++c[$1]',
    xp: 65, difficulty: 4,
    brief: 'sesiones.log registra ids con registros repetidos. Un id aparece TRES veces; solo en su tercera repetición viaja la marca.',
    goal: 'Imprime de sesiones.log el SEGUNDO campo de la fila cuyo id (primer campo) llega a su tercera aparición.',
    setup: (_, f) => `
cat > ${HOME}/sesiones.log <<EOF
s1 eco uno
s2 eco dos
k3 eco tres
k3 eco cuatro
s1 eco cinco
k3 ${f}
s2 eco seis
EOF
chown agent:agent ${HOME}/sesiones.log`,
    solution: `awk '++c[$1] == 3 {print $2}' ${HOME}/sesiones.log`,
    hints: [
      'c[$1] es un array asociativo: cuenta apariciones por id.',
      'Con ++c[$1] == 3 el incremento es de PREFIJO: incrementa antes de comparar — dispara justo en la tercera aparición (el postfijo c[$1]++ lo haría en la cuarta).',
      `awk '++c[$1] == 3 {print $2}' ${HOME}/sesiones.log`,
    ],
    teach:      'Los arrays asociativos de awk (c[$1]) cuentan, agrupan y deduplican sin sort ni uniq. ++c[$1]==3 usa el incremento de PREFIJO: primero incrementa, luego compara con el valor nuevo — con c[$1]++ (postfijo) dispararía en la cuarta.',
    cheatsheet: [
      { cmd: "awk '++c[$1] == 3 {print $2}' f", desc: '3.ª aparición por grupo (prefijo)' },
      { cmd: "awk '{c[$1]++} END {for (i in c) print i, c[i]}' f", desc: 'recuento por grupo' },
    ],
    keywords: ['awk', 'asociativo', 'contenido'],
  },
  {
    index: 11, title: 'Dos ficheros, una clave', subtitle: 'awk FNR==NR: joins',
    xp: 70, difficulty: 4,
    brief: 'claves.txt lista ids autorizados; valores.dat trae «id valor». Solo la fila del id que aparece en claves lleva la marca en el valor.',
    goal: 'Del par claves.txt + valores.dat: imprime el VALOR (2.º campo) de las filas cuyo id está presente en claves.txt.',
    setup: (_, f) => `
cat > ${HOME}/claves.txt <<EOF
k7
arpola
c4
EOF
cat > ${HOME}/valores.dat <<EOF
perfil dedo sin marca
otro1 eco paralelo
k7 ${f}
q5 eco extrao
EOF
chown agent:agent ${HOME}/claves.txt ${HOME}/valores.dat`,
    solution: `awk 'FNR==NR {cl[$1]; next} $1 in cl {print $2}' ${HOME}/claves.txt ${HOME}/valores.dat`,
    hints: [
      'Cuando hacka recibe dos ficheros, FNR==NR significa «estoy en el primero».',
      'En el primero: llenar el array; con next saltas sin procesar más.',
      `awk 'FNR==NR {cl[$1]; next} $1 in cl {print $2}' ${HOME}/claves.txt ${HOME}/valores.dat`,
    ],
    teach: 'FNR (contador por fichero) y NR (global) distinstinguen los ficheros: FNR==NR es el truco clásico que convierte awk en "SQL del shell": un índice en el primer fichero y consultas contra el segundo.',
    cheatsheet: [
      { cmd: "awk 'FNR==NR {k[$1]; next} $1 in k'", desc: 'join simple de dos ficheros' },
      { cmd: "awk 'FILENAME == \"b\"' a b", desc: 'elige filas por nombre de fichero' },
    ],
    keywords: ['awk', 'FNR', 'NR', 'join'],
  },
  {
    index: 12, title: 'Cadena del caudal', subtitle: 'awk acumulador con filtro',
    xp: 80, difficulty: 5,
    brief: 'El medidor de caudal escribe «estación valor token». Solo las estaciones con valor superior a 50 llevan fragmentos de la marca; el resto suelta señuelos.',
    goal: 'De caudal.txt: imprime la concatenación de los tokens (3.º campo) de las filas con valor superior a 50.',
    setup: () => `
FLAG="$DOJO_FLAG"
cat > ${HOME}/caudal.txt <<EOF
aguaje 30 se\u00f1uelo-a
colch\u00f3n 55 $(printf '%s' "\${FLAG:0:7}")
represa 62 $(printf '%s' "\${FLAG:7:12}")
confianza 45 se\u00f1uelo-b
cielo 70 $(printf '%s' "\${FLAG:19}")
EOF
chown agent:agent ${HOME}/caudal.txt`,
    solution: `awk '$2 > 50 {t = t $3} END {print t}' ${HOME}/caudal.txt`,
    hints: [
      'Filtrar $2 > 50 deja solo las filas del caudal crítico.',
      'La variable t acumula el campo 3 de cada fila válida; END lo imprime.',
      `awk '$2 > 50 {t = t $3} END {print t}' ${HOME}/caudal.txt`,
    ],
    teach: 'awk acumulando bajo una condición: filtro escalar + END. Con umbral numérico seleccionas y con la yuxtación t = t $3. ensamblas piezas repartidas por el fichero.',
    cheatsheet: [
      { cmd: "awk 'cond {t = t $n} END {print t}' f", desc: 'acumulador con filtro' },
      { cmd: "awk '{c += $2} END {print c}' f", desc: 'suma de la 2.ª columna' },
    ],
    keywords: ['awk', 'acumulador', 'END'],
  },
  {
    index: 13, title: 'Detección dinámica', subtitle: 'awk match() + RSTART/RLENGTH',
    xp: 85, difficulty: 5,
    brief: 'pistas.txt mezcla prosa con marcas enterradas: la elegante FLAG{…} está dentro de la línea, no siempre al principio. match() la revela donde quiera que esté.',
    goal: 'De pistas.txt: imprime únicamente la subcadena FLAG{…} (con match() y substr()).',
    setup: (_, f) => `
cat > ${HOME}/pistas.txt <<EOF
la marca baila dentro: hallazgo ${f} y sigue el eco
aquí solo caminos sin llaves FIN
otra línea y una falsa caseFLAG{eco min}
y una truncada FLAG{ sin cierre
EOF
chown agent:agent ${HOME}/pistas.txt`,
    solution: `awk 'match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)}' ${HOME}/pistas.txt`,
    hints: [
      'match($0, /regex/) devuelve la posición 0-base: si casó, llena RSTART (inicio) y RLENGTH (longitud).',
      'substr(texto, RSTART, RLENGTH) recorta la subcadena.',
      `awk 'match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)}' ${HOME}/pistas.txt`,
    ],
    teach: 'match(sel, regex) llena RSTART/RLENGTH con la posición del casamiento: no necesitas imprimir la línea entera. Con las llaves dentro de clases de caracteres ([{], [}]) el patrón es portable a cualquier awk (gawk, mawk).',
    cheatsheet: [
      { cmd: "awk 'match($0, /p/) {print substr($0, RSTART, RLENGTH)}'", desc: 'extraer lo que casó' },
      { cmd: "awk '{print index($0, \"x\")}' f", desc: 'posición de un texto' },
    ],
    keywords: ['awk', 'match', 'substr', 'RSTART'],
  },
  {
    index: 14, title: 'Boss: la firma del operador', subtitle: 'awk: doble filtro + acumulador + END',
    xp: 130, difficulty: 5,
    brief: 'canal.txt trae eventos «id estado señal token». Solo los eventos con estado OK y señal sig son firmas válidas: sus tokens unidos en orden componen la firma completa. El resto son trampas de caso o estado.',
    goal: 'Concatena de canal.txt los tokens (4.º campo) de las filas con estado OK (2.º campo) y señal sig exacta (3.º campo), e imprime la firma completa.',
    setup: () => `
FLAG="$DOJO_FLAG"
cat > ${HOME}/canal.txt <<EOF
t1 OK sig \${FLAG:0:8}
t2 FAI sig eco ruido
t3 OK error eco ruido
t4 OK sig \${FLAG:8:12}
t5 OK SIG eco ruido
t6 ok sig eco ruido
t7 OK sig \${FLAG:20}
EOF
chown agent:agent ${HOME}/canal.txt`,
    solution: `awk '$2 == "OK" && $3 == "sig" {t = t $4} END {print t}' ${HOME}/canal.txt`,
    hints: [
      'Filtrar $2 == "OK" deja fuera los FAI y aviso de error.',
      'El 3.º campo debe ser EXACTO "sig": ni SIG ni ok minúscula estafan el estado.',
      `awk '$2 == "OK" && $3 == "sig" {t = t $4} END {print t}' ${HOME}/canal.txt`,
    ],
    teach: 'El boss de awk es el oficio: dos filtros de campo (igualdad exacta) más acumulador y END. Con esto ensamblas cualquier salida «señal repartida por un fichero» directo del shell.',
    cheatsheet: [
      { cmd: "awk 'c1 && c2 {t = t $n} END {print t}' f", desc: 'doble filtro + acumular' },
      { cmd: "awk '$3 == \"sig\"' f", desc: 'igualdad exacta en campo' },
    ],
    keywords: ['awk', 'boss', 'filtro', 'acumulador'],
  },
];

/* ── correcciones de detalles (sustit这些问题 soñadas por un-resueltos) ── */
const FIX = {
  'grep-7': { difficulty: 3 },
};

function build(defs, trackName, trackLabel) {
  return defs.map((d) => {
    const id = `${trackName}-l${d.index}`;
    let setup = d.setup('_', '$DOJO_FLAG').replace(/^\n/, '');
    setup = `#!/bin/bash\nset -e\narena-prompt "LVL ${String(d.index).padStart(2, '0')}" "${trackLabel}"\n` + setup.trimEnd() + '\n';
    const difficulty = FIX[id]?.difficulty ?? d.difficulty;
    return {
      id,
      track: trackName,
      index: d.index,
      title: d.title,
      subtitle: d.subtitle,
      xp: d.xp,
      difficulty,
      brief: d.brief,
      goal: d.goal,
      setup,
      solution: d.solution,
      hints: d.hints,
      teach: d.teach,
      cheatsheet: d.cheatsheet,
      keywords: d.keywords,
      profile: 'default',
    };
  });
}

function emit(defs, trackName, trackLabel) {
  const dir = path.join(repoRoot, 'levels', trackName);
  fs.mkdirSync(dir, { recursive: true });
  for (const old of fs.readdirSync(dir)) fs.rmSync(path.join(dir, old), { force: true });
  const levels = build(defs, trackName, trackLabel);
  for (const lv of levels) {
    fs.writeFileSync(path.join(dir, `l${lv.index}.yaml`), YAML.stringify(lv, { lineWidth: 90 }));
  }
  console.log(`${trackName}: ${levels.length} niveles → levels/${trackName}/`);
}

emit(GREP, 'grep', 'Grep');
emit(AWK, 'awk', 'Awk');
