/*
 * gen-pro-runs — genera las pistas de EXPERTO del dojo, un comando único:
 *   · grep-pro (24 niveles): grep maestro — extracción -oE, contadores
 *     -c/-l/-L, límite -m, patrones desde fichero -f, contexto -A/-B/-C
 *     asimétrico, alternancia -E anclada, recursiva + --include/--exclude,
 *     extracción de IPs/fechas con clases y contadores, cadenas de greps
 *     y boss triple-filtro.
 *   · awk-pro (24 niveles): awk maestro — -F, roles/roles.dat, umbrales
 *     numéricos, suma/acumulador, máximo, NR y rangos, regex por campo,
 *     length/substr/index/split, sub/gsub, printf/sprintf, BEGIN/FS,
 *     OFS + reordenación, arrays e histograma for..in, dedup idiom,
 *     join FNR==NR, match()+RSTART/RLENGTH y boss de exclusión+suma.
 * Contrato del motor (scripts/test-levels.mjs):
 *   · setup contiene $DOJO_FLAG (se sustituye por la flag del test).
 *   · la solución NO menciona $DOJO_FLAG y la imprime en stdout (exit 0).
 *   · hints ≥ 2 · cheatsheet · teach · keywords · profile.
 * Regenerar: node scripts/gen-pro-runs.mjs  (determinista)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const HOME = '/home/agent';

/* ════════════════════════════════════════════════════════════════════ GREP-PRO ══ */
const GREP_PRO = [
  {
    index: 1, title: 'El ladrón de direcciones', subtitle: "grep -oE: extracción con clases y cuantificadores",
    xp: 60, difficulty: 4,
    brief: 'El registro de contactos está lleno de nombres, notas y aprender tanto como se pueda: solo las direcciones de correo son la señal.',
    goal: 'Extrae de emails.log ÚNICAMENTE las direcciones de correo (una por línea, sin el resto del texto de la línea).',
    setup: (_, f) => `
cat > ${HOME}/emails.log <<EOF
 contacto: agente.snorkel@dojo.example confirma tipo<data>
 nota: revisar el /var/log cada mediodia
 ref: soporte@dojo.example responde en 48h
${f}
 escudo: relay@spam-farm.es NO es confiable
EOF
chown agent:agent ${HOME}/emails.log`,
    solution: `grep -oE '[a-z0-9._-]+@[a-z0-9.-]+\\\\.[a-z]{2,4}' ${HOME}/emails.log`,
    hints: [
      "-o imprime solo la parte que casa; con -E tienes cuantificadores: +, {n,m}, alternancia |.",
      "El patrón canonical del correo: usuario@dominio.tld, con plantillas [a-z0-9._-]+ y dominio hasta 4 letras.",
      `grep -oE '[a-z0-9._-]+@[a-z0-9.-]+\\\\.[a-z]{2,4}' ${HOME}/emails.log`,
    ],
    teach: "grep -oE convierte grep en extractor: cada coincidencia sale limpia en su propia línea. Con -E tienes {n,m}, clases por letra y punto; extrae el dato sin sed ni cut.",
    cheatsheet: [
      { cmd: "grep -oE 'patr\\\\.' f", desc: "extrae solo lo que casa" },
      { cmd: "grep -oE '[a-z0-9]+@\\\\S+' f", desc: "otra forma de email" },
    ],
    keywords: ['grep', '-oE', 'extraer', 'correo'],
  },
  {
    index: 2, title: 'El contador de errores', subtitle: 'grep -c: cuenta, no liste',
    xp: 60, difficulty: 4,
    brief: 'Tres servidores tributes a un solo log; el turno pide la cifra de errores, no la lista entera.',
    goal: 'De accidente.log imprime CUÁNTAS líneas contienen la palabra ERROR (como número, no listas).',
    setup: (_, f) => `
cat > ${HOME}/accidente.log <<EOF
ERROR disco lleno en /var
INFO snapshot semanal completado
WARN reloj retrasa 2s
ERROR señal abortou en sda
titulo informativo: ${f}
INFO hoy opera correcto
EOF
chown agent:agent ${HOME}/accidente.log`,
    solution: `grep -c 'ERROR' ${HOME}/accidente.log`,
    hints: [
      "-c es el CONTADOR de líneas que casan: emite un número, no el listado.",
      "No confundir -C con contexto y -c con contador: -C (mayúscula) es de contexto, -c (minúscula) de conteo.",
      `grep -c 'ERROR' ${HOME}/accidente.log`,
    ],
    teach: "grep -c es el «wc -l del filtro»: la primera pregunta en diagnósticos siempre es «¿cuántas veces pasó?» antes de ver detalles.",
    cheatsheet: [
      { cmd: 'grep -c patrón f', desc: 'cuántas líneas casan' },
      { cmd: 'grep -cv patrón f', desc: 'cuántas NO casan' },
    ],
    keywords: ['grep', '-c', 'contador'],
  },
  {
    index: 3, title: 'Mayúsculas rebeldes, cuenta igual', subtitle: 'grep -ic: caso insensible + contador',
    xp: 65, difficulty: 4,
    brief: 'El registro usa error/Error/ERROR indistintamente. El informe de incidencias exige el total sin carecer del formato.',
    goal: 'De visitas.log imprime el NÚMERO de líneas que contienen error sea cual sea el formato de las letras (2 números, no la lista).',
    setup: (_, f) => `
cat > ${HOME}/visitas.log <<EOF
ERROR nivel 1
error nivel 2
Error nivel 3
eRRoR nivel 4
ERROR nivel 5
${f}
EOF
chown agent:agent ${HOME}/visitas.log`,
    solution: `grep -ic 'error' ${HOME}/visitas.log`,
    hints: [
      "Las opciones de grep se APILAN: -i (insensible) + -c (contador), en una sola: -ic.",
      'El resultado es un único número (el total de líneas casadas).',
      `grep -ic 'error' ${HOME}/visitas.log`,
    ],
    teach: "Combinar opciones cortas -ic (o -i -c) suma efectos. La apilación es la razón por la que grep sigue útil en árboles grandes.",
    cheatsheet: [
      { cmd: 'grep -ic pat f', desc: 'conteo sin mirar mayúsculas' },
      { cmd: 'grep -in pat f', desc: 'listado insensible numerado' },
    ],
    keywords: ['grep', '-ic', 'insensible', 'contador'],
  },
  {
    index: 4, title: 'El despertador del ruido', subtitle: 'grep -v: excluir comentarios y líneas vacías',
    xp: 65, difficulty: 4,
    brief: 'El fichero tomcat.conf es 80% comentarios y líneas en blanco. Se lee bien cuando limpías.',
    goal: 'Imprime del fichero tomcat.conf únicamente las líneas de configuración real: quita los comentarios (# al principio) y las líneas vacías, EN DOS PASADAS.',
    setup: (_, f) => `
cat > ${HOME}/tomcat.conf <<EOF
# titulo del conf
# ajustes del buffer
buffer = 16

modo = estricto
EOF
echo "usuario = agent" >> ${HOME}/tomcat.conf
echo "# fin" >> ${HOME}/tomcat.conf
echo "puerto = 8080 ${f}" >> ${HOME}/tomcat.conf
echo "" >> ${HOME}/tomcat.conf
chown agent:agent ${HOME}/tomcat.conf`,
    solution: `grep -v '^#' ${HOME}/tomcat.conf | grep -v '^[[:space:]]*$'`,
    hints: [
      "Primera pasada: -v '^#' quita los comentarios.",
      "Las líneas vacías son '^$' (ancla inicio + ancla fin, nada en medio). Con espacios antes puede usar '\\s*' o [[:space:]]*.",
      `grep -v '^#' ${HOME}/tomcat.conf | grep -v '^[[:space:]]*$'`,
    ],
    teach: "Los greps -v encadenados son el patrón clásico de limpieza. El ^ y el $ son impacrables: ^# solo casa SI la línea ARRANCA con #, y ^$ solo si está vacía.",
    cheatsheet: [
      { cmd: "grep -v '^#' f", desc: 'descarta comentarios de línea' },
      { cmd: "grep -v '^[[:space:]]*$' f", desc: 'descarta vacías/blancas' },
      { cmd: "grep -E -v '^(#|$)' f", desc: 'ambas en una regex' },
    ],
    keywords: ['grep', '-v', 'limpieza', 'conf'],
  },
  {
    index: 5, title: 'Solo los nombres de ficheros con señal', subtitle: 'grep -rl: nombres, no contenido',
    xp: 65, difficulty: 4,
    brief: 'La auditoría sobre el árbol de negocio no quiere el detalle, solo SABER EN QUÉ ficheros aparece la señal.',
    goal: 'Del árbol negocio/, da la lista de ficheros que contienen la palabra confidencial (solo nombres, ninguna línea).',
    setup: (_, f) => `
mkdir -p ${HOME}/negocio/clientes ${HOME}/negocio/proveedores
echo "factura común" > ${HOME}/negocio/facturas.txt
echo "el testigo: ${f}" > ${HOME}/negocio/secretos.txt
echo "nada relevante aquí" > ${HOME}/negocio/clientes/lista.txt
echo "confidencial en acta de consejo" > ${HOME}/negocio/clientes/nota.txt
echo "memorando confidencial de http" > ${HOME}/negocio/proveedores/suministro.csv
echo "sin rastro" > ${HOME}/negocio/proveedores/vacio.csv
chown -R agent:agent ${HOME}/negocio`,
    solution: `grep -rl 'confidencial' ${HOME}/negocio`,
    hints: [
      "-l cambia la salida: en vez de líneas muestra SOLO los nombres de los ficheros donde hubo coincidencia.",
      'Para árboles necesitas -r: la combinación -rl es de las más usadas.',
      `grep -rl 'confidencial' ${HOME}/negocio`,
    ],
    teach: "grep -l es la herramienta del «¿qué ficheros toca?» antes de entrar. Tras ella, alimenta un for/xargs con los nombres.",
    cheatsheet: [
      { cmd: 'grep -rl patrón dir', desc: 'recursivo: solo nombres' },
      { cmd: 'grep -l patrón f1 f2', desc: 'solo ficheros con match' },
    ],
    keywords: ['grep', '-l', '-r', 'ficheros'],
  },
  {
    index: 6, title: 'Los ficheros SIN señal', subtitle: 'grep -L: el inverso de -l',
    xp: 70, difficulty: 4,
    brief: 'La auditoría legal pide la lista de ficheros que NUNCA citan el término «comprometido». Es lo contrario de -l.',
    goal: 'Del árbol auditoria/, imprime los NOMBRES de los ficheros que NO contienen la palabra comprometido.',
    setup: (_, f) => `
mkdir -p ${HOME}/auditoria
echo "informe comprometido de octubre" > ${HOME}/auditoria/oct.txt
echo "resumen del trimestre, sin señal" > ${HOME}/auditoria/resumen.txt
echo "acta comprometida del consejo" > ${HOME}/auditoria/acta.txt
echo "bitácora de copias de seguridad" > ${HOME}/auditoria/bitacora.txt
echo "malargue asunto: ${f}" > ${HOME}/auditoria/testigo.txt
chown -R agent:agent ${HOME}/auditoria`,
    solution: `grep -L 'comprometido' ${HOME}/auditoria/*`,
    hints: [
      "-L (MAYÚSCULA) muestra los ficheros SIN ninguna coincidencia; -l minúscula los CON.",
      'Con el globo nativo del shell: audit/* expande a办理 todos los ficheros de la dir.',
      `grep -L 'comprometido' ${HOME}/auditoria/*`,
    ],
    teach: "grep -L es la luz reversa: te parla los ficheros donde NO hubo señal. En auditorías de fuga, cualquier fichero en esa lista es sospechoso.",
    cheatsheet: [
      { cmd: 'grep -L patrón *.txt', desc: 'ficheros que NO casan' },
      { cmd: 'grep -L patrón dir/*', desc: 'idem sobre la dir' },
    ],
    keywords: ['grep', '-L', 'inverso'],
  },
  {
    index: 7, title: 'Solo la primera', subtitle: 'grep -m 1: para tras el primer match',
    xp: 65, difficulty: 4,
    brief: 'El beacon.log repite la misma señal cada segundo. Para diagnóstico, la PRIMERA es la que interes',
    goal: 'De beacon.log, imprime únicamente la PRIMERA línea que contenga BEACON.',
    setup: (_, f) => `
cat > ${HOME}/beacon.log <<EOF
t=001 BEACON latido irá
t=002 BEACON latido irá
t=003 silencio dextral
t=004 conexión estimada: ${f}
EOF
chown agent:agent ${HOME}/beacon.log`,
    solution: `grep -m 1 'BEACON' ${HOME}/beacon.log`,
    hints: [
      '-m 1 detiene la lectura del fichero tras el primer match (u -m N para N máximo).',
      'En ficheros grandes es una ganancia de rendimiento brutal: no escanea lo demás.',
      `grep -m 1 'BEACON' ${HOME}/beacon.log`,
    ],
    teach: '-m N limita el nº de matches POR FICHERO. Con -m 1 pides el primer hallazgo y#----------------------------------------------------------------# para; en modo recursivo, cada fichero aportará su primera copia.',
    cheatsheet: [
      { cmd: 'grep -m 1 pat f', desc: 'solo el primer match' },
      { cmd: 'grep -m 3 pat f', desc: 'hasta 3 matches' },
    ],
    keywords: ['grep', '-m', 'límite'],
  },
  {
    index: 8, title: 'El diccionario del operador', subtitle: 'grep -f: patrones desde fichero',
    xp: 70, difficulty: 5,
    brief: 'El equipo de filtrado tiene una lista de 3 palabras (patterns.txt) y un correo largo. Cargarlas una a una sería tontería.',
    goal: 'Usando patterns.txt como lista de patrones, imprime de carta.txt las líneas que contengan CUALQUIERA de esos patrones.',
    setup: (_, f) => `
cat > ${HOME}/patterns.txt <<EOF
urgente
crisis
confidencial
EOF
cat > ${HOME}/carta.txt <<EOF
hola, es una nota amable
comunicado URGENTE del guardia
informe CONFIDENCIAL adjuntado: ${f}
asuntos de crisis cerrando a tiempo
nada relevante aquí
EOF
chown agent:agent ${HOME}/patterns.txt ${HOME}/carta.txt`,
    solution: `grep -f ${HOME}/patterns.txt -i ${HOME}/carta.txt`,
    hints: [
      "-f fichero lee UN patrón POR LÍNEA del fichero dado; busca TODOS.",
      'Puedes combinar con -i, -E, -r, -n como cualquier otro grep.',
      `grep -if ${HOME}/patterns.txt ${HOME}/carta.txt`,
    ],
    teach: "grep -f fich-lista fich-destino construye una red de detección. Es clásico en filtrado de contenido: listas negras de IP, dominios de spam, etc.",
    cheatsheet: [
      { cmd: 'grep -f patrones.txt f', desc: 'múltiples patrones desde fichero' },
      { cmd: 'grep -Ff patrones.txt f', desc: 'idéntico pero patrón literal' },
    ],
    keywords: ['grep', '-f', 'patrones', 'lista'],
  },
  {
    index: 9, title: 'Pasado el hallazgo', subtitle: 'grep -A 2: contexto después',
    xp: 65, difficulty: 4,
    brief: 'El log de despliegue enraiza el trigger GO y, DESPUÉS, la salida. Necesitas ver lo que sigue.',
    goal: 'De deploy.log imprime la línea que contiene GO y las DOS SIGUIENTES (así estado está en esa zona).',
    setup: (_, f) => `
cat > ${HOME}/deploy.log <<EOF
paso 1: guardar el repo
paso 2: compilar módulo A
GO activación de despliegue
config aplicada: ${f}
retora ciclos 2-3
EOF
chown agent:agent ${HOME}/deploy.log`,
    solution: `grep -A 2 'GO' ${HOME}/deploy.log`,
    hints: [
      '-A 2 imprime cada match y las DÚO líneas QUE SIGUEN.',
      'Cuando dos matches se superponen, el contexto puede incluir separadores --.',
      `grep -A 2 'GO' ${HOME}/deploy.log`,
    ],
    teach: "A de after: incluye el contexto posterior. En logs de deploy es la vía rápida de leer «qué pasó tras el evento» sin abrir el fichero entero.",
    cheatsheet: [
      { cmd: 'grep -A 2 pat f', desc: 'match + 2 siguientes' },
      { cmd: 'grep -B 3 pat f', desc: '3 ANTIERIORES (B de before)' },
    ],
    keywords: ['grep', '-A', 'contexto'],
  },
  {
    index: 10, title: 'El culpable anterior', subtitle: 'grep -B 2: contexto antes',
    xp: 65, difficulty: 4,
    brief: 'El fallo crítico se entiende SOLO con lo anterior: los dos pasos ANTERIORES al abort.',
    goal: 'De pipeline.log imprime la línea ABORT y las DÚO ANTERIORES (ahí está la causa).',
    setup: (_, f) => `
cat > ${HOME}/pipeline.log <<EOF
descargar fuentes (ok)
compilar módulo B (ok)
ABORT pub-sub no responde
causa: señal falsa enganchó
${f}
reiniciamos el pipeline
EOF
chown agent:agent ${HOME}/pipeline.log`,
    solution: `grep -B 2 'ABORT' ${HOME}/pipeline.log`,
    hints: [
      "-B 2 imprime cada match y las 2 líneas que lo PRECEDEN.",
      'B es de before: la contraparte de -A.',
      `grep -B 2 'ABORT' ${HOME}/pipeline.log`,
    ],
    teach: "El diagnóstico de logs casi siempre mira atrás: -B N da el «qué produjo esto». Con -A N en el mismo grep (o -C) ves la banda completa.",
    cheatsheet: [
      { cmd: 'grep -B 2 pat f', desc: '2 líneas antes + match' },
      { cmd: 'grep -A 3 -B 2 pat f', desc: 'asimétrica: 3 después, 2 antes' },
    ],
    keywords: ['grep', '-B', 'contexto'],
  },
  {
    index: 11, title: 'La banda alrededor', subtitle: 'grep -C 2: ambos lados',
    xp: 70, difficulty: 5,
    brief: 'El bloque de SIGNAL (baliza) solo tiene su significado con 2 líneas de contexto a BOTH direcciones.',
    goal: 'De baliza.log imprime la línea de la señal BALIZA y DOS líneas de contexto en ambas direcciones.',
    setup: (_, f) => `
cat > ${HOME}/baliza.log <<EOF
inicio de la ceremonia
stress bajo en el generador 1
>>> BALIZA encendida <<<
stress alto en el generador 2
restaus del ciclo
stress bajo de regreso
>>> BALIZA encendida: ${f}
EOF
chown agent:agent ${HOME}/baliza.log`,
    solution: `grep -C 2 'BALIZA' ${HOME}/baliza.log`,
    hints: [
      '-C 2 = -A 2 + -B 2: contexto completo alrededor del match.',
      'Si el match llega al INICIO del fichero, no habría líneas anteriores que mostrar.',
      `grep -C 2 'BALIZA' ${HOME}/baliza.log`,
    ],
    teach: "C de context: la herramienta del «muéstrame la escena completa». Con -A y -C combinadas puedes personalizar la banda.",
    cheatsheet: [
      { cmd: 'grep -C 3 pat f', desc: '3 antes y 3 después' },
      { cmd: 'grep -A 4 -B 1 pat f', desc: 'asimétrica expresa' },
    ],
    keywords: ['grep', '-C', 'contexto'],
  },
  {
    index: 12, title: 'Soporte de multiplicidad', subtitle: "grep -E con |: alternancia",
    xp: 65, difficulty: 4,
    brief: 'Las líneas de interés viven en dos variantes: confirmada o declined. Ambas importan idénticamente.',
    goal: 'De respuestas.log imprime solo las líneas que contengan confirmada o declined (en una sola pasada).',
    setup: (_, f) => `
cat > ${HOME}/respuestas.log <<EOF
ticket-1 pending revisión inicial
ticket-2 confirmada por operador
ticket-3 vencida sin respuesta
ticket-4 declined por el cliente
ticket-5 confirmada seguida de ${f}
ticket-6 dummy para relleno
EOF
chown agent:agent ${HOME}/respuestas.log`,
    solution: `grep -E 'confirmada|declined' ${HOME}/respuestas.log`,
    hints: [
      '-E activa la regex extendida, donde el | significa ALTERNANCIA.',
      'Sin -E, el | se interpreta literalmente y tendrías que escaparlo: \\|.',
      `grep -E 'confirmada|declined' ${HOME}/respuestas.log`,
    ],
    teach: "La alternancia en -E (a|b) es el «Y/O» de grep: da igual la rama que case. Con más variantes: (confirmad[oa]|declined).",
    cheatsheet: [
      { cmd: "grep -E 'a|b' f", desc: 'acepta una u otra' },
      { cmd: "grep -E '(foo|bar)baz' f", desc: 'alternancia dentro del patrón' },
    ],
    keywords: ['grep', '-E', 'alternancia'],
  },
  {
    index: 13, title: 'Anclado por el domingo', subtitle: 'grep -E con ^: el principio de línea',
    xp: 65, difficulty: 4,
    brief: 'El diario de la semana mezcla arranques de línea con menciones a mitad de texto: solo las que ARRANCAN son válidas.',
    goal: 'De chicas.log muestra las líneas que EMPIEZAN por la palabra domingo (y solo ellas).',
    setup: (_, f) => `
cat > ${HOME}/chicas.log <<EOF
domingo desayuno tardío
lunes preparación de semana
martes reunión de equipo
hoy toca el domingo de devolución
domingo a mitad de texto no vale
domingo-marketin es otro caso
domingo correspondo real: ${f}
EOF
chown agent:agent ${HOME}/chicas.log`,
    solution: `grep -E '^domingo ' ${HOME}/chicas.log`,
    hints: [
      '^ ancla al INICIO DE LÍNEA: ^domingo casa solo si la línea empieza por esa palabra.',
      'El espacio tras domingo evita que casa el domingode otro texto siguiente.',
      `grep -E '^domingo ' ${HOME}/chicas.log`,
    ],
    teach: "Las ANCLAS en -E (^ y $) fijan el punto de inicio/fin de línea. En registros con timestamps, ^ es la base del filtrado por hora.",
    cheatsheet: [
      { cmd: "grep -E '^ERROR' f", desc: 'líneas que empiezan por ERROR' },
      { cmd: "grep -E 'done$' f", desc: 'líneas que terminan en done' },
    ],
    keywords: ['grep', '-E', 'ancla', 'inicio'],
  },
  {
    index: 14, title: 'La IP del incidente', subtitle: 'grep -oE de IPs IPv4',
    xp: 70, difficulty: 5,
    brief: 'El registro guarda muchas IPs, pero solo una es de la subred 10.0. Extraela LIMPIA (solo la IP, sin el resto del texto).',
    goal: 'Del registro conexión.log, extrae TODAS las IPs que empiecen con 10.0. (formato D.D.D.D).',
    setup: (_, f) => `
cat > ${HOME}/connexion.log <<EOF
conn desde 192.168.1.1 puerto 443
pin externo 10.0.4.23 port 22
intento de admin en 127.0.0.1 local
${f}
pin 10.0d.4.23 MAL FORMADO
host con texto 10.0.255.200 sobresaliente
EOF
chown agent:agent ${HOME}/connexion.log`,
    solution: `grep -oE '\\b10\\.0\\.[0-9]+\\.[0-9]+\\b' ${HOME}/connexion.log`,
    hints: [
      'Para extraer LIMPIO usa -oE; el punto es regex y casa cualquier carácter: escápalo con \\.',
      '\\b es frontera de palabra y evita casar subcadenas parciales',
      `grep -oE '\\b10\\\\.0\\\\.[0-9]+\\\\.[0-9]+\\\\b' ${HOME}/connexion.log`,
    ],
    teach: "Extraccion de IPs: \\b10\\.[0-9]+\\.[0-9]+\\b con -oE es el patrón más solicitado. No necesitas validar el rango 0-255 en logs normales.",
    cheatsheet: [
      { cmd: "grep -oE 'IP_pattern' f", desc: 'extrae IPs limpias' },
      { cmd: "grep -oE '\\\\b(\\\\d{1,3}\\\\.){3}\\\\d{1,3}\\\\b' f", desc: 'todas las IP IPv4' },
    ],
    keywords: ['grep', '-oE', 'IP'],
  },
  {
    index: 15, title: 'Rangos dentro de línea', subtitle: 'grep -E con {n} y clases',
    xp: 70, difficulty: 5,
    brief: 'El fichero de fichas tiene muchos formatos, pero solo un formato pasa el test: un ID de SEIS dígitos exactos (aunque vaya rodeado de texto).',
    goal: 'De registros.txt imprime las líneas que contengan un número de EXACTAMENTE 6 dígitos (aunque el número forme parte de otro mayor).',
    setup: (_, f) => `
cat > ${HOME}/registros.txt <<EOF
operación con código 12345 corto (-5 dígitos)
el ticket 234 de soporte: demasiado corto
referencia de pago: 990210 correcto
código largo 1234567: incluso 7 dígitos
línea con nómina 050499 ${f}
dos candidata: 112233 y 445566
EOF
chown agent:agent ${HOME}/registros.txt`,
    solution: `grep -E '[0-9]{6}' ${HOME}/registros.txt`,
    hints: [
      "[0-9]{6} casa cualquier SECUENCIA de 6 dígitos consecutivos ( incluso como parte de un número más largo).",
      "Con -o verías solo el NUMERO extraído: pero aquí hay que imprimir la LÍNEA completa.",
      `grep -E '[0-9]{6}' ${HOME}/registros.txt`,
    ],
    teach: "Las llaves {n} en -E son contadores exactos. Con {n,m} fluctúa: {6} = exactamente 6, {6,} = 6 o más, {2,5} = entre 2 y 5.",
    cheatsheet: [
      { cmd: "grep -E '[0-9]{4}' f", desc: 'números de 4 cifras' },
      { cmd: "grep -oE '[0-9]{6}' f", desc: 'extrae solo la secuencia de 6' },
    ],
    keywords: ['grep', '-E', 'contadores', 'clases'],
  },
  {
    index: 16, title: 'Profundo, con filtro', subtitle: 'grep -r --include',
    xp: 70, difficulty: 5,
    brief: 'En árboles de muchos tipos de fichero, solo interesa CON los .log. Filtrálo por el NOMBRE del fichero (no por contenido).',
    goal: 'Del árbol incidentes/, muestra las líneas que contengan intrusión pero UNICAMENTE entre los ficheros .log (a cualquier profundidad).',
    setup: (_, f) => `
mkdir -p ${HOME}/incidentes/2026/10
echo "intrusión detectada en oct" > ${HOME}/incidentes/oct.log
echo "intrusión en la sub carpeta" > ${HOME}/incidentes/2026/10/evento.log
echo "intrusión en el README" > ${HOME}/incidentes/README.md
echo "intrusión en el respaldo" > ${HOME}/incidentes/oct.log.bak
echo "intrusión en el py" > ${HOME}/incidentes/dev.py
echo "el testigo: ${f}" > ${HOME}/incidentes/2026/10/tip.log
chown -R agent:agent ${HOME}/incidentes`,
    solution: `grep -r --include='*.log' 'intrusión' ${HOME}/incidentes`,
    hints: [
      '--include="*.log" restringe la búsqueda recursiva a ese patrón de NOMBRE de fichero.',
      '--exclude="*.log.bak" descarta patrones específicos (excluye).',
      `grep -r --include='*.log' 'intrusión' ${HOME}/incidentes`,
    ],
    teach: "En árboles grandes, --include/--exclude acotan por TIPO de fichero sin recurrir a find. Trabajan sobre el NOMBRE, no el contenido.",
    cheatsheet: [
      { cmd: 'grep -r --include="*.log" p dir', desc: 'solo ficheros .log' },
      { cmd: 'grep -r --exclude="*.bak" p dir', desc: 'sin respaldos' },
    ],
    keywords: ['grep', 'recursivo', '--include', '-r'],
  },
  {
    index: 17, title: 'El puerto de la conexión', subtitle: 'grep -oE + cut: dos herramientas al servicio',
    xp: 70, difficulty: 5,
    brief: 'El fichero describe conexiones ip:port. Necesitas aislar el PUERTO pero SOLO en IPs que empiecen por 10.4.',
    goal: 'De conexiones.log, extrae SOLAMENTE el PUERTO (el número tras el último :) de las conexiones hacia IPs del rango 10.4.X.X.',
    setup: (_, f) => `
cat > ${HOME}/conexiones.log <<EOF
10.4.0.1:9999 rechazada
10.4.32.5:22 arrancando ssh
10.5.0.1:4321 subred equivocada
10.4.9.99:8999 puerto alternativa
10.0.0.3:11111 fuera del rango
10.4.22.4:4444 el puerto a coger: ${f}
EOF
chown agent:agent ${HOME}/conexiones.log`,
    solution: `grep -oE '\\\\b10\\\\.4\\\\.[0-9]+\\\\.[0-9]+:[0-9]+' ${HOME}/conexiones.log | cut -d: -f2`,
    hints: [
      'grep -oE ya te saca una línea del tipo 10.4.X.X:PETO.',
      '| alimenta a cut; con -d: -f2 separas por : y COGES el campo 2 (el puerto).',
      `grep -oE '\\b10\\\\.4\\\\.[0-9]+\\\\.[0-9]+:[0-9]+' ${HOME}/conexiones.log | cut -d: -f2`,
    ],
    teach: "grep + cut es el pipeline típico para piezas de un match más largo. -oE limita la línea de partida; corte acompaña el array; ext menjadi más fácil de aplicar el campo correcto.",
    cheatsheet: [
      { cmd: "grep -oE 'IP_pattern' f", desc: 'extrae el match como texto' },
      { cmd: 'cut -d: -f2', desc: 'segundo campo separado por :' },
    ],
    keywords: ['grep', '-oE', 'cut', 'puerto'],
  },
  {
    index: 18, title: 'El detector de dos etapa', subtitle: 'grep | grep: filtrado en cadena',
    xp: 70, difficulty: 5,
    brief: 'El fichero ficha.txt repleta de patrones. Dos filtros en cadena son la opción más segura: primero el formato, luego la señal.',
    goal: 'De ficha.txt imprime las líneas con patrón uid: TENGAN cuatro dígitos y CONTÉNGAN la marca (tenga FLAG).',
    setup: (_, f) => `
cat > ${HOME}/ficha.txt <<EOF
uid: 12345 demasiado corto
uid: 123456 correcto campo sin marca
uid: abc12 sin números suficientes
uid: 654321 correcto tanpoco
uid: "12345 con comillas no vale"
uid: 432198 correcto: ${f}
EOF
chown agent:agent ${HOME}/ficha.txt`,
    solution: `grep -E 'uid: [0-9]{6}' ${HOME}/ficha.txt | grep 'FLAG'`,
    hints: [
      'grep uid:[0-9]{6} lista las líneas con formato correcto.',
      'El segundo grep (FLAG) filtra la línea con la marca.',
      `grep -E 'uid: [0-9]{6}' ${HOME}/ficha.txt | grep 'FLAG'`,
    ],
    teach: 'Un pipeline con 2 greps simplifica. El primero reduce espectro, el segundo afina: nunca resuelvas en una sola línea si no llega.',
    cheatsheet: [
      { cmd: 'grep 1 | grep 2', desc: 'filtro lógico AND' },
      { cmd: "grep -E 'a.*b' f", desc: 'a y b en la misma línea' },
    ],
    keywords: ['grep', 'pipeline', 'AND'],
  },
  {
    index: 19, title: 'La línea exacta', subtitle: 'grep -xF: exactitud de línea completa',
    xp: 75, difficulty: 5,
    brief: 'El fichero acceso.txt miles de variantes. SOLO la línea EXACTA password:secreto es válida (ni indentada, ni con texto extra).',
    goal: 'De acceso.txt imprime SOLO la línea que es EXACTAMENTE password:secreto (línea completa, sin nada antes o después).',
    setup: (_, f) => `
cat > ${HOME}/acceso.txt <<EOF
password:secreto
password:secretito
 password:secreto
password:secreto extra
password: secreto con espacio tras :
password:correcto ${f}
EOF
chown agent:agent ${HOME}/acceso.txt`,
    solution: `grep -xF 'password:secreto' ${HOME}/acceso.txt`,
    hints: [
      '-x casa TODO el patrón con la LÍNEA COMPLETA.',
      '-F hace el patrón LITERAL (sin interpretar regex).',
      `grep -xF 'password:secreto' ${HOME}/acceso.txt`,
    ],
    teach: "-x es exacto sobre una línea completa. -F convierte el patrón en literal. La fórmula -xF es la herramienta definitiva para «buscar esta cadena exacta como línea».",
    cheatsheet: [
      { cmd: 'grep -Ff lista.txt f', desc: 'patrones literales desde fichero' },
      { cmd: 'grep -xF cadena f', desc: 'solo si la línea ES LA CADENA' },
    ],
    keywords: ['grep', '-x', '-F', 'exacto'],
  },
  {
    index: 20, title: 'El tablero de rangos', subtitle: 'grep + sed: líneas con número en rango',
    xp: 75, difficulty: 5,
    brief: 'En el log, la marca PROFUNDO vive entre las líneas 4 y 8 (y solo hay).',
    goal: 'De marcas.txt imprime las líneas que contengan DEEP pero EXCLUSIVAMENTE entre las líneas 4 a 8 (incluyendo los extremos).',
    setup: (_, f) => `
cat > ${HOME}/marcas.txt <<EOF
uno simple con DEEP fuera de rango
dos vacío
tres el término DEEP en la mitad inicial
cuatro DEEP en medio de todo
cinco marca DEEP
seis el resilient DEEP
siete DEEP profundo: ${f}
ocho DEEP en el final
nueve fuera DEEP del rango
EOF
chown agent:agent ${HOME}/marcas.txt`,
    solution: `head -n 8 ${HOME}/marcas.txt | tail -n +4 | grep 'DEEP'`,
    hints: [
      'Goala en la línea 4-8: head -n 8 da las primeras 8; tail -n +4 salta las 3 primeras.',
      "El último grep 'DEEP' filtra de ese bloque.",
      `head -n 8 ${HOME}/marcas.txt | tail -n +4 | grep 'DEEP'`,
    ],
    teach: "No todas las subtareas son solo greps. Puedes combinar greps con head/tail/sed cut. Recuerda: la ventana de líneas 4-8 (head -n 8 | tail -n +4) tras un grep es una técnica común.",
    cheatsheet: [
      { cmd: 'head -n 8 f | tail -n +4', desc: 'líneas 4 a 8' },
      { cmd: 'sed -n 4,8p f', desc: 'idem: imprime las líneas 4 a 8' },
    ],
    keywords: ['grep', 'head', 'tail', 'rango'],
  },
  {
    index: 21, title: 'El corte asimétrico', subtitle: 'grep -B 3 -A 1: contexto distinto a cada lado',
    xp: 75, difficulty: 5,
    brief: 'El corte del log quiere 3 líneas ANTES y UNA después del evento MARCAR (distinto a cada lado).',
    goal: 'De flujo.log imprime el evento MARCAR con TRES líneas ANTERIORES y UNA línea POSTERIOR (la señal va en el posterior).',
    setup: (_, f) => `
cat > ${HOME}/flujo.log <<EOF
preludio 1
preludio 2
preludio 3
MARCAR evento en el medio
postludio única: ${f}
EOF
chown agent:agent ${HOME}/flujo.log`,
    solution: `grep -B 3 -A 1 'MARCAR' ${HOME}/flujo.log`,
    hints: [
      '-B 3 -A 1 es UNA orden con dos opciones, contexto distinto a cada lado.',
      'El orden de las opciones da igual: -A 1 -B 3 funciona igual.',
      `grep -B 3 -A 1 'MARCAR' ${HOME}/flujo.log`,
    ],
    teach: 'Combinar -A y -B en el mismo comando da la banda de interés personalizada; cuando necesitas uno ≠ otro, evita la -C simétrica.',
    cheatsheet: [
      { cmd: 'grep -B 3 -A 1 pat f', desc: 'asymétrica personalizada' },
      { cmd: 'grep -A 1 -B 3 pat f', desc: 'el mismo resultado' },
    ],
    keywords: ['grep', '-A', '-B', 'contexto'],
  },
  {
    index: 22, title: 'El contador de matched', subtitle: 'grep -o | wc: ratios de aparición vs líneas',
    xp: 75, difficulty: 5,
    brief: 'El log no quiere la LISTA ni el número de líneas: quiere el TOTAL TOKEN que aparece (incluso múltiples en una línea están).',
    goal: 'Del fichero testigos.log imprime el NÚMERO TOTAL de veces que aparece el token secret (en minúsculas).',
    setup: (_, f) => `
cat > ${HOME}/testigos.log <<EOF
secret aquí
dos secret en la misma línea secret de nuevo
tres al fin secret confiesa secret y secret
el final SECRET
${f}
EOF
chown agent:agent ${HOME}/testigos.log`,
    solution: `grep -o 'secret' ${HOME}/testigos.log | wc -l`,
    hints: [
      'El -c da el número de LÍNEAS, no el total de tokens; cuando hay múltiples matches en una línea, -c cuenta la línea UNA sola vez.',
      'Con -o, CADA aparición imprime una línea; contar el total con wc -l.',
      `grep -o 'secret' ${HOME}/testigos.log | wc -l`,
    ],
    teach: 'grep -o patrón | wc -l es el conteo TOTAL de coincidencias (distinto de -c, que cuenta LÍNEAS). Es la diferencia crucial entre "cuántas líneas" y "cuántas veces".',
    cheatsheet: [
      { cmd: 'grep -o pat f | wc -l', desc: 'total de ocurrencias' },
      { cmd: 'grep -c pat f', desc: 'nº de líneas con match' },
    ],
    keywords: ['grep', '-o', 'wc', 'total'],
  },
  {
    index: 23, title: 'ISO extraction', subtitle: 'grep -oE de fechas AAAA-MM-DD',
    xp: 75, difficulty: 5,
    brief: 'El log guarda las fechas en varias formas (ISO y texto) y en distintas posiciones.',
    goal: 'Del fichero tiempos.log, extrae SOLAMENTE las fechas en formato AAAA-MM-DD (una por línea).',
    setup: (_, f) => `
cat > ${HOME}/tiempos.log <<EOF
el ejercicio comenzó el 2022-04-15 a medio día
la marca fue el 2019-02-01 (término debió)
${f}
por la falta 2023-04 incompleta invalida
con hora también ok: 2024-11-20T13:45:02
EOF
chown agent:agent ${HOME}/tiempos.log`,
    solution: `grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' ${HOME}/tiempos.log`,
    hints: [
      '{n} pide n dígitos consecutivos; sirve para fechas o fecha + hora.',
      'Con -oE cada coincidencia completa sale en su línea.',
      `grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' ${HOME}/tiempos.log`,
    ],
    teach: "El patrón [0-9]{4}-[0-9]{2}-[0-9]{2} extrae las fechas ISO. La gracia -o + {n} es reemplazar el «recortar con cut/awk» por directamente un regex experto.",
    cheatsheet: [
      { cmd: "grep -oE '[0-9]{4}-[0-9]{2}' f", desc: "AAAA-MM" },
      { cmd: "grep -oE '[0-9]{2}:[0-9]{2}' f", desc: 'hh:mm' },
    ],
    keywords: ['grep', '-oE', 'fechas'],
  },
  {
    index: 24, title: 'Boss: triple filtro encadenado', subtitle: '3 greps en tubería',
    xp: 175, difficulty: 5,
    brief: 'El log de tuna.log tiene eventos de 4 tipos: trig, span, offs y noise. Se quiere algo estricto.',
    goal: 'De tuna.log imprime SOLO las líneas que contengas trig PERO no noise Y QUE EMPIECE CON el timestamp 2026-10-25.',
    setup: (_, f) => `
cat > ${HOME}/tuna.log <<EOF
2026-10-25 08:01 trig sin más
2026-10-25 08:02 span sin acierto
2026-10-25 08:03 trig con ruido noise
ruido span offs por el medio
2026-10-25 09:01 offs solitario
2026-10-25 09:02 trig limpio
${f}
2026-10-25 10:00 trig música de fondo
EOF
chown agent:agent ${HOME}/tuna.log`,
    solution: `grep 'trig' ${HOME}/tuna.log | grep -v 'noise' | grep -E '^2026-10-25'`,
    hints: [
      'Encadenas tuberías: filtrar trig; excluir noise; conservar los timestamps ISO que empiezan por el año 2026.',
      'Un grep puede tanto INCLUIR (default) como EXCLUIR con -v, y ANCLA con ^',
      `grep 'trig' ${HOME}/tuna.log | grep -v 'noise' | grep -E '^2026-10-25'`,
    ],
    teach: "El triple-encadenado es el trabajo diario de los ingenieros de logs: filtra, excluye el ruido, y añade una ancla de fecha. El resultado final limpio.",
    cheatsheet: [
      { cmd: 'grep a f | grep -v b', desc: 'filtra + excluye' },
      { cmd: 'grep -E \'^2026\' f', desc: 'ancla año inicio' },
    ],
    keywords: ['grep', 'boss', 'cadena', 'filtro'],
  },
];

/* ════════════════════════════════════════════════════════════════════ AWK-PRO ══ */
const AWK_PRO = [
  {
    index: 1, title: 'Campos con delimitador custom', subtitle: 'awk -F con split por los dos puntos',
    xp: 60, difficulty: 4,
    brief: 'El fichero roles.txt usa delimitador ":". La 1.ª columna es el usuario, la 2.ª el rol. El dato relevante sólo es el ROL.',
    goal: 'De roles.txt imprime la SEGUNDA columna (el rol) respetando su delimitador del fichero.',
    setup: (_, f) => `
cat > ${HOME}/roles.txt <<EOF
root:admin
agent:viewer:${f}
invitado:lector
backup:admin
EOF
chown agent:agent ${HOME}/roles.txt`,
    solution: `awk -F: '{print $2}' ${HOME}/roles.txt`,
    hints: [
      "awk separa por espacios cuando no le dices nada: -F: cambia el separador a «dos puntos».",
      "Con -F: el campo $2 es la columna delimitada por :.",
      `awk -F: '{print $2}' ${HOME}/roles.txt`,
    ],
    teach: "-F es la FLAG de DELIMITADOR: sin él, awk asume espacios y tabs. Si tu data no va separada por espacios, este es el PRIMER paso. El $2 apunta SIEMPRE al segundo campo.",
    cheatsheet: [
      { cmd: "awk -F: '{print $2}' f", desc: 'segundo campo separado por :' },
      { cmd: "awk -F, '{print $1}' f", desc: 'primera columna de un CSV simple' },
    ],
    keywords: ['awk', '-F', 'delimitador', 'campos'],
  },
  {
    index: 2, title: 'Umbral sobre columna', subtitle: 'awk $2 > N: filtro numérico',
    xp: 60, difficulty: 4,
    brief: 'El fichero procesos.dat trae usuario, memoria (MB), cpu. Son procesos de la columna memoria los CRÍTICOS.',
    goal: 'De procesos.dat, imprime las líneas cuya segunda columna (memoria) supere 500.',
    setup: (_, f) => `
cat > ${HOME}/procesos.dat <<EOF
nginx 120 3
mysql 800 15
python 620 22
cron 45 1
memcached 499 8
java 1500 2 ${f}
redis 300 9
EOF
chown agent:agent ${HOME}/procesos.dat`,
    solution: `awk '$2 > 500' ${HOME}/procesos.dat`,
    hints: [
      "awk compara NUMÉRICAMENTE si ambos operandos son numéricos: $2 > 500.",
      "No necesitas un if: la CONDICIÓN sola (sin acción) imprime la LÍNEA COMPLETA.",
      `awk '$2 > 500' ${HOME}/procesos.dat`,
    ],
    teach: "El caso clásico de awk: comparación numérica de columnas sin cut/while. La ACCIÓN por defecto ({ print $0 }) hace el trabajo de print total si no la processes.",
    cheatsheet: [
      { cmd: "awk '$2 > 500' f", desc: 'líneas con col. 2 > 500' },
      { cmd: "awk '$2 >= 100 && $2 <= 1000' f", desc: 'rango numérico con &&' },
    ],
    keywords: ['awk', 'umbral', 'numérico', 'filtro'],
  },
  {
    index: 3, title: 'Suma acumulada', subtitle: 'awk suma de columna + END',
    xp: 65, difficulty: 4,
    brief: 'El fichero ventas.dat trae producto, importe. El reporte necesita la SUMA de la segunda columna.',
    goal: 'De ventas.dat imprime ÚNICAMENTE el TOTAL (suma de la segunda columna).',
    setup: (_, f) => `
cat > ${HOME}/ventas.dat <<EOF
docs 100
night 50
nights 250
air 1250
notas 0 ${f}
EOF
chown agent:agent ${HOME}/ventas.dat`,
    solution: `awk '{s += $2} END {print s}' ${HOME}/ventas.dat`,
    hints: [
      "El {s += $2} se ejecuta para cada línea; END una sola vez al final.",
      'La variable s empieza en 0 (vacía por defecto).',
      'Las «notas» con importe 0 no mueven el total: solo son ruido decorativo.',
      `awk '{s += $2} END {print s}' ${HOME}/ventas.dat`,
    ],
    teach: "El patrón {acumular} + END {imprimir} es el «streaming» de awk: procesas líneas en caché y inv'mas un sólo resultado. Tu código va HEAD (procesoMedia,NR) + TAIL (END).",
    cheatsheet: [
      { cmd: "awk '{s += $2} END {print s}' f", desc: 'suma de la col. 2' },
      { cmd: "awk 'END {print NR}' f", desc: 'nº de líneas leídas' },
    ],
    keywords: ['awk', 'suma', 'END', 'acumulador'],
  },
  {
    index: 4, title: 'El máximo de la columna', subtitle: 'awk $2 > max + END con dos variables',
    xp: 65, difficulty: 4,
    brief: "El fichero medias.dat trae «id valor». Necesitas el id del VALOR MÁXIMO: la clave que encabeza al campeón es la señal.",
    goal: 'De medias.dat imprime el id (PRIMERA columna) de la fila con el valor MÁXIMO en la segunda columna.',
    setup: (_, f) => `
cat > ${HOME}/medias.dat <<EOF
a 10
b 40
${f} 90
c 35
d 22
EOF
chown agent:agent ${HOME}/medias.dat`,
    solution: `awk '$2 > max {max = $2; id = $1} END {print id}' ${HOME}/medias.dat`,
    hints: [
      'max partierer sin declarar en 0: si el valor de la fila supera al máximo, guárdalo y guarda su id.',
      'END imprimi el id cuando todo el fichero ha sido procesado.',
      `awk '$2 > max {max = $2; id = $1} END {print id}' ${HOME}/medias.dat`,
    ],
    teach: "Patrón «compara-guarda-imprime» de awk: una variable max y una id, y el campeón se anuncia en END. Sin sort y sin bucles: el streaming atiende por ti.",
    cheatsheet: [
      { cmd: "awk '$2 > max {max=$2; id=$1} END {print id}' f", desc: 'el id con el valor máximo' },
      { cmd: "awk '$2 > max {max=$2} END {print max}' f", desc: 'el valor máximo en sí' },
    ],
    keywords: ['awk', 'máximo', 'END', 'variables'],
  },
  {
    index: 5, title: 'La línea n exacta', subtitle: 'awk NR == N',
    xp: 60, difficulty: 4,
    brief: "El fichero lineas.log tiene la marca en la LÍNEA 7 (y SOLO esa).",
    goal: 'De lineas.log imprime EXACTAMENTE la línea 7.',
    setup: (_, f) => `
{ for i in $(seq 1 10); do
    if [ "$i" -eq 7 ]; then echo "línea-7 al adicion: ${f}"; else echo "línea $i: ruido"; fi
  done; } > ${HOME}/lineas.log
chown agent:agent ${HOME}/lineas.log`,
    solution: `awk 'NR == 7' ${HOME}/lineas.log`,
    hints: [
      "NR es el contador de línea leídas (1-based): NR == 7 selecciona esa.",
      'Con solo la condición, awk imprime la LÍNEA entera por defecto.',
      `awk 'NR == 7' ${HOME}/lineas.log`,
    ],
    teach: "awk NR cuenta las líneas procesadas: NR == 7 es un selector directo. Ante archivos enormes, es más rápido que sed -n 7p.",
    cheatsheet: [
      { cmd: "awk 'NR == 7' f", desc: 'solo la línea 7' },
      { cmd: "awk 'NR % 2 == 0' f", desc: 'solo las líneas pares' },
    ],
    keywords: ['awk', 'NR', 'línea'],
  },
  {
    index: 6, title: 'Ventana de líneas', subtitle: 'awk con doble condición en NR',
    xp: 65, difficulty: 4,
    brief: 'El fichero escenas.log guarda la sección crítica entre las líneas 4 y 6 (inclusiva).',
    goal: 'De escenas.log, imprime SOLAMENTE las líneas 4 a 6 (INCLUIDAS).',
    setup: (_, f) => `
{ for i in $(seq 1 10); do
    if [ "$i" -eq 5 ]; then echo "línea-5: el dato ${f}"; else echo "línea $i: humo"; fi
  done; } > ${HOME}/escenas.log
chown agent:agent ${HOME}/escenas.log`,
    solution: `awk 'NR >= 4 && NR <= 6' ${HOME}/escenas.log`,
    hints: [
      "DOBLE condición con el operador && sobre NR.",
      'NR es 1-based.',
      `awk 'NR >= 4 && NR <= 6' ${HOME}/escenas.log`,
    ],
    teach: "Con la doble condición en NR puedes reproducir el «sed -n 4,6p» con awk. Nota que el RANGO INCLUIVE ambos extremos (>= y <=).",
    cheatsheet: [
      { cmd: "awk 'NR >= 4 && NR <= 6' f", desc: 'líneas 4 a 6' },
      { cmd: "awk 'NR % 2 == 0' f", desc: 'solo las líneas pares' },
    ],
    keywords: ['awk', 'NR', 'rango'],
  },
  {
    index: 7, title: 'El hash perfecto', subtitle: 'awk longitud + regex de campo',
    xp: 70, difficulty: 5,
    brief: 'El fichero hashes.log tiene usuario + hash (sin espacios). Necesitas las líneas cuyo campo SI y SÓLO SI es un hash hex de 32 dígitos EXACTOS.',
    goal: 'De hashes.log imprime las líneas cuyo SEGUNDO campo es un hash hex de 32 caracteres EXACTOS (uso la facil length + regex).',
    setup: (_, f) => `
cat > ${HOME}/hashes.log <<EOF
user-a 5f4dcc3b5aa765d61d8327deb882cf99
user-b algo corto
user-c 1234567890abcdef1234567890abcd ${f}
user-d 987szy fuera de tio
EOF
chown agent:agent ${HOME}/hashes.log`,
    solution: `awk 'length($2) == 32 && $2 ~ /^[0-9a-f]+$/' ${HOME}/hashes.log`,
    hints: [
      'length($2) == 32 es la COMPROBACIÓN de longitud EXACTA (hex 32 simbolos md5).',
      '$2 ~ /^[0-9a-f]+$/'+" es el REGEX de la forma exclusivamente hex.",
      `awk 'length($2) == 32 && $2 ~ /^[0-9a-f]+$/' ${HOME}/hashes.log`,
    ],
    teach: "Confundir length($x) con la función length(). La combinación de length() + un regex con clases y ^$ es la forma robusta de validar un formato de CAMPO en awk (incluye mawk que no garantiza {32}).",
    cheatsheet: [
      { cmd: "awk 'length($2) == 32' f", desc: 'campo 2 con TAM 32' },
      { cmd: "awk '$2 ~ /^[0-9a-f]+$/' f", desc: 'regex hex en campo 2' },
    ],
    keywords: ['awk', 'length', 'regex', 'campo'],
  },
  {
    index: 8, title: 'El rey de la longitud', subtitle: 'awk length($0) + guardado del máximo',
    xp: 65, difficulty: 4,
    brief: 'En dumpe.log, hay una línea anómala MUY LARGA. À veces tiene la marca, a veces no.',
    goal: 'De dumpe.log imprime la línea MÁS LARGA (contenido, no la longitud).',
    setup: (_, f) => `
cat > ${HOME}/dumpe.log <<EOF
línea corta
${f}
una línea de longitud media, casi tan larga como la bandera
otra línea, más corta
EOF
chown agent:agent ${HOME}/dumpe.log`,
    solution: `awk '{ if (length($0) > max) { max = length($0); line = $0 } } END { print line }' ${HOME}/dumpe.log`,
    hints: [
      'length($0) da el TAM de la línea ACTUAL.',
      'Guarda la línea si supera al máximo; al final imprímela con END.',
      `awk '{ if (length($0) > max) { max = length($0); line = $0 } } END { print line }' ${HOME}/dumpe.log`,
    ],
    teach: "En awk, if dentro de una acción con llaves acumula el «tope» y guarda una copia de la línea todas las vezes que mejora. END imprime al final.",
    cheatsheet: [
      { cmd: "awk '{ print length($0) }' f", desc: 'longitud de cada línea' },
      { cmd: "awk '{ if (length($0) > max) max = length($0) } END { print max }' f", desc: 'la MAYOR longitud' },
    ],
    keywords: ['awk', 'length', 'if', 'máximo'],
  },
  {
    index: 9, title: 'El recortador de campos', subtitle: 'awk substr()',
    xp: 65, difficulty: 4,
    brief: 'El fichero tokens.log trae alias + token. Necesitas SOLO los ULTIMOS 8 caracteres del token.',
    goal: 'De tokens.log imprime los últimos 8 caracteres del TOKEN (2.ª columna) por línea.',
    setup: (_, f) => `
cat > ${HOME}/tokens.log <<EOF
ana 1f2e3d4c5b6a7980
boris kkfeed WIN
carlos 1234567890abcdef
dani ${f}
EOF
chown agent:agent ${HOME}/tokens.log`,
    solution: `awk '{ print substr($2, length($2) - 7) }' ${HOME}/tokens.log`,
    hints: [
      'substr(texto, inicio) devuelve desde esa posición HASTA el final (sin 3er argumento).',
      'Para obtener los últimos 8: substr(s, length(s) - 7).',
      `awk '{ print substr($2, length($2) - 7) }' ${HOME}/tokens.log`,
    ],
    teach: "substr(texto, inicio, longitud) corta CUALQUIER texto, por posición y tamaño. Combinando con length() puedes extraer «el final» solar de cualquier longitud.",
    cheatsheet: [
      { cmd: "awk '{ print substr($1, 1, 3) }' f", desc: 'primeras 3 letras del campo 1' },
      { cmd: "awk '{ print substr($2, length($2) - 7) }' f", desc: 'últimos 8 chars del campo 2' },
    ],
    keywords: ['awk', 'substr', 'recortar', 'length'],
  },
  {
    index: 10, title: 'La posición del token', subtitle: 'awk index()',
    xp: 65, difficulty: 4,
    brief: 'El fichero posiciones.txt tiene textos largos con posibles FICHAS.',
    goal: 'De posiciones.txt imprime la posición (1-based) donde aparece el token MARK en cada línea (0 si no está).',
    setup: (_, f) => `
cat > ${HOME}/posiciones.txt <<EOF
un texto con MARK al medio
MARK al principio directamente
sin el token aquí
la marca del fin es: ${f}
EOF
chown agent:agent ${HOME}/posiciones.txt`,
    solution: `awk '{ print index($0, "MARK") }' ${HOME}/posiciones.txt`,
    hints: [
      'index(cadena, subcadena) devuelve posición 1-based (0 si no aparece).',
      'No necesites regex ni trabajo previo: index() busca la posición.',
      `awk '{ print index($0, "MARK") }' ${HOME}/posiciones.txt`,
    ],
    teach: "index(texto, subc) busca la posición 1-based de subc dentro de texto. Devuelve 0 si no aparece. Es la herramienta que awk da para «¿dónde está?» sin regex.",
    cheatsheet: [
      { cmd: 'awk \'{ print index($0, "sub") }\' f', desc: 'posición de la subcadena' },
      { cmd: 'awk \'index($0, "x") > 0\' f', desc: 'solo las líneas que la contengan' },
    ],
    keywords: ['awk', 'index', 'posición'],
  },
  {
    index: 11, title: 'La partida manual', subtitle: 'awk split()',
    xp: 70, difficulty: 5,
    brief: 'El fichero rutas.dat trae catalogo/sección/item separados por :. Necesitas TERCER elemento (item).',
    goal: 'De rutas.dat, imprime el TERCER elemento de cada línea después de split por : (NO con $3).',
    setup: (_, f) => `
cat > ${HOME}/rutas.dat <<EOF
catalogo:sección-1:item-a
catalogo:sección-2:item-b: ${f}
catalogo:sección-3:item-c
EOF
chown agent:agent ${HOME}/rutas.dat`,
    solution: `awk '{ split($0, a, ":"); print a[3] }' ${HOME}/rutas.dat`,
    hints: [
      'split(cadena, array, sep) separa por el sep y LLENA el array con a[1], a[2]…',
      'El acceso a a[3] es la tercera parte (1-based).',
      `awk '{ split($0, a, ":"); print a[3] }' ${HOME}/rutas.dat`,
    ],
    teach: "split() separa una cadena en elementos ARRAY. Es útil cuando el delimitador varía por línea. Sin embargo, awk ya lo haga con $N… split y la ruta manual son m's comunes en el contexto actual.",
    cheatsheet: [
      { cmd: "awk '{ split($0, a, \":\"); print a[2] }' f", desc: 'split manual y elemento 2' },
      { cmd: "awk '{ n = split($0, a, \":\"); print n }' f", desc: 'split devuelve nº de piezas' },
    ],
    keywords: ['awk', 'split', 'array'],
  },
  {
    index: 12, title: 'Primera sustitución', subtitle: 'awk sub()',
    xp: 70, difficulty: 5,
    brief: 'El fichero dominios.txt tiene una inicial OCULTA que se libera SOLO al sustituir el PRIMER punto por guion bajo.',
    goal: 'De dominios.txt imprime cada línea con su PRIMER punto sustituido por guion bajo (solo la PRIMERA ocurrencia).',
    setup: (_, f) => `
cat > ${HOME}/dominios.txt <<EOF
mail.dominio.presto.es
web.dominio.secundaria.es
otro.reto.la.marca: ${f}
EOF
chown agent:agent ${HOME}/dominios.txt`,
    solution: `awk '{ sub(/\\\\./, "_"); print }' ${HOME}/dominios.txt`,
    hints: [
      'sub(regex, reemplazo) sustituye SOLO la primera aparición en la línea ACTUAL; imprime luego.',
      'El punto hay que escaparlo porque en regex es «cualquier carácter».',
      `awk '{ sub(/\\\\./, "_"); print }' ${HOME}/dominios.txt`,
    ],
    teach: 'sub(regex, valor) cambia la PRIMERA coincidencia. Es la awk-equivalencia de sed s/…/…/ (1 vez). Usela cuando ya hay awk: así evitas una tubería adicional.',
    cheatsheet: [
      { cmd: 'awk \'{ sub(/a/, "b"); print }\' f', desc: 'sustituye la PRIMERA a por b' },
      { cmd: 'awk \'{ x = sub(/a/, "b"); print x }\' f', desc: '1 si hizo sustituciones, 0 si no' },
    ],
    keywords: ['awk', 'sub', 'sustitución'],
  },
  {
    index: 13, title: 'Todas las apariciones', subtitle: 'awk gsub()',
    xp: 70, difficulty: 5,
    brief: 'El fichero normalizado.txt tiene líneas con múltiples espacios seguidos. Necesitas de DOBLE-ESPACIO a UNO SOLO.',
    goal: 'De normalizado.txt imprime cada línea con TODOS los espacios consecutivos reducidos a UNO SOLO.',
    setup: (_, f) => `
cat > ${HOME}/ruido.txt <<EOF
palabra con     varios   espacios
otra  línea  con  dos separaciones
la marca: ${f}   con espacios después
EOF
chown agent:agent ${HOME}/ruido.txt`,
    solution: `awk '{ gsub(/[ ]+/, " "); print }' ${HOME}/ruido.txt`,
    hints: [
      "gsub(regex, valor) sustituye TODAS las apariciones de la línea.",
      'El regex [ ]+ casa UNO O MÁS espacios consecutivos (y se sustituye por UNO).',
      `awk '{ gsub(/[ ]+/, " "); print }' ${HOME}/ruido.txt`,
    ],
    teach: 'gsub(regex, valor) es la sustitución GLOBAL: cambia TODAS las coincidencias. Puedes usar la situación para formatear la línea entera $0 sin extra print (sólo el print default).',
    cheatsheet: [
      { cmd: 'awk \'{ gsub(/[ ]+/, " "); print }\' f', desc: 'normaliza espacios' },
      { cmd: 'awk \'{ n = gsub(/a/, "b"); print n }\' f', desc: 'gium cuántas sustituciones hizo' },
    ],
    keywords: ['awk', 'gsub', 'sustitución', 'espacios'],
  },
  {
    index: 14, title: 'Formato C-style en la salida', subtitle: 'awk printf()',
    xp: 70, difficulty: 5,
    brief: 'El fichero metrica.dat trae clave y valor. Necesitas la salida con FORMA ESTRICTA: la clave en 6 caracteres alineada izquierda, espacio, el valor flotante con DOS decimales.',
    goal: 'De metrica.dat imprime cada línea con printf: clave alineada a la izquierda en 6 espacios y el valor flotante con 2 decimales, y salto de línea.',
    setup: (_, f) => `
cat > ${HOME}/metrica.dat <<EOF
lat 12.345
lon -70.42
alt 0.5
temp 23.0
xco ${f}
EOF
chown agent:agent ${HOME}/metrica.dat`,
    solution: `awk '{ printf "%-6s %.2f\\\\n", $1, $2 }' ${HOME}/metrica.dat`,
    hints: [
      "printf de awk imprime con un FORMATO C-style: %-6s es campo de 6 alineado a la izquierda; %.2f es float de 2 decimales; \\n es SALTO MANUAL.",
      "awk echo en print añade newline: printf NO lo hace automáticamente.",
      `awk '{ printf "%-6s %.2f\\\\n", $1, $2 }' ${HOME}/metrica.dat`,
    ],
    teach: "printf es C-style: imprime con formato; cada %obras substituye un argumento. Es la salida del awk, SIN salto automático (necesita \\n). Uso disponible para formatear la tabla ( %-6s, %.2f, %-8s etc).",
    cheatsheet: [
      { cmd: 'awk \'{ printf "%s\\\\n", $1 }\' f', desc: 'printf del campo 1' },
      { cmd: 'awk \'{ printf "%.2f\\\\n", $1 }\' f', desc: '2 decimales de la col. 1' },
    ],
    keywords: ['awk', 'printf', 'formato'],
  },
  {
    index: 15, title: 'Acumulación con sprintf', subtitle: 'awk sprintf + variable',
    xp: 70, difficulty: 5,
    brief: "El fichero informe.lst trae filas «id valor». Necesitas que la VARIABLE acumule la salida con el formato id=valor; manejado por sprintf.",
    goal: 'De informe.lst construye una ÚNICA cadena con todas las líneas en formato "id=valor" separadas por ";" y imprímela al FINAL.',
    setup: (_, f) => `
cat > ${HOME}/informe.lst <<EOF
alpha ${f}
beta 2
gamma 3
alpha 10
EOF
chown agent:agent ${HOME}/informe.lst`,
    solution: `awk '{ t = t sprintf("%s=%s;", $1, $2) } END { print t }' ${HOME}/informe.lst`,
    hints: [
      'sprintf devuelve el STRING formateado (NO lo imprime).',
      't = t sprintf(...) CONCATE con el acumulador de cada vez; END imprime una vez.',
      `awk '{ t = t sprintf("%s=%s;", $1, $2) } END { print t }' ${HOME}/informe.lst`,
    ],
    teach: 'sprintf es printf pero en texto: devuelve el valor en lugar de imprimir. Cumple con el patrón AWK-FORMATO-ACUMULAR-PRINTAR.',
    cheatsheet: [
      { cmd: "awk '{ a = sprintf(\"%03d\", $1); print a }' f", desc: 'variable de formato' },
      { cmd: "awk '{ t = t $1 \"=\" $2 \";\" } END { print t }' f", desc: 'sin formato: acumular' },
    ],
    keywords: ['awk', 'sprintf', 'variables'],
  },
  {
    index: 16, title: 'El valor inicial: BEGIN', subtitle: 'awk BEGIN { FS = ";" }',
    xp: 70, difficulty: 5,
    brief: "Si no quieres usar -F, define el separador dentro del BEGIN.",
    goal: 'De datos.dat (delimitado por ;) imprime la SEGUNDA columna usando el BEGIN para declarar el separador FS (SIN usar -F).',
    setup: (_, f) => `
cat > ${HOME}/datos.dat <<EOF
a;1;X
b;2;Y: ${f}
c;3;Z
EOF
chown agent:agent ${HOME}/datos.dat`,
    solution: `awk 'BEGIN { FS = ";" } { print $2 }' ${HOME}/datos.dat`,
    hints: [
      'BEGIN { FS = ";" } establece el separador ANTES de leer la primera línea.',
      'Equivale a -F; pero lo declaras en el SCRIPT, no en el thunk',
      `awk 'BEGIN { FS = ";" } { print $2 }' ${HOME}/datos.dat`,
    ],
    teach: "El bloque BEGIN se ejecuta UNA VEZ antes de processar líneas: ahí se inicializa FS (separador), OFS, variables, etc. Es la manera correcta cuando el separador es fijo.",
    cheatsheet: [
      { cmd: 'awk \'BEGIN { FS=";" } { print $2 }\' f', desc: 'el separador creado por BEGIN' },
      { cmd: 'awk \'BEGIN { print "inicio" } { print $0 }\' f', desc: 'BEGIN como banner' },
    ],
    keywords: ['awk', 'BEGIN', 'FS'],
  },
  {
    index: 17, title: 'Constructor de columnas', subtitle: 'awk OFS + reordenación',
    xp: 70, difficulty: 5,
    brief: 'El fichero amplio.dat usa espacios entre campos. Necesitas REORDENAR: TERCERO, PRIMERO y QUINTO, separados por |.',
    goal: 'De amplio.dat imprime en cada línea: campo 3, campo 1 y campo 5 (separados por |).',
    setup: (_, f) => `
cat > ${HOME}/amplio.dat <<EOF
uno dos tres cuatro cinco
uno dos tres cuatro cinco seis
uno dos tres cuatro cinco ${f}
EOF
chown agent:agent ${HOME}/amplio.dat`,
    solution: `awk '{ print $3 "|" $1 "|" $5 }' ${HOME}/amplio.dat`,
    hints: [
      'Puedes printáAR campos en el ORDEN que quieras: $3, $1, $5.',
      'Puedes usar OFS: BEGIN { OFS = "|" } y luego print $3, $1, $5 (con comas).',
      `awk '{ print $3 "|" $1 "|" $5 }' ${HOME}/amplio.dat`,
    ],
    teach: "En awk los campos $N se pueden impresar en CUALQUIER orden: no hay que reordenar el fichero. El separador de cada WORKING fue el que manualmente se case: si print con comas, awk separa con OFS (por defecto, espacio).",
    cheatsheet: [
      { cmd: "awk '{ print $3, $1 }' f", desc: 'reordena campos (OFS pred.)' },
      { cmd: 'awk \'BEGIN { OFS="|" } { $1 = $1; print }\' f', desc: 'reconstruye con OFS=' },
    ],
    keywords: ['awk', 'OFS', 'reordenar', 'campos'],
  },
  {
    index: 18, title: 'Cuenta con arrays', subtitle: "awk a[$1]++ + for (k in a)",
    xp: 75, difficulty: 5,
    brief: 'El fichero hits.log trae IPs (una por línea). Necesitas el HISTOGRAMA: IP cuenta de hits (sin sort).',
    goal: 'De hits.log imprime la lista "IP cuenta" (una por línea) al saturar el bucle.',
    setup: (_, f) => `
cat > ${HOME}/hits.log <<EOF
10.0.0.1
10.0.0.2
10.0.0.1
10.0.0.3
10.0.0.1
10.0.0.2 ${f}
EOF
chown agent:agent ${HOME}/hits.log`,
    solution: `awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' ${HOME}/hits.log`,
    hints: [
      'a[$1]++ INCREMENTA la cuenta por IP.',
      'En END, for (k in a) recorre todas las CLAVES e imprimo k y a[k].',
      `awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' ${HOME}/hits.log`,
    ],
    teach: 'Los ARRAYS de awk (a[$1]++) mapean arbitrary (numéricos o strings). El bucle for (k in arr) itera TODAS las CLAVES. Es el histograma más corto de escribir.',
    cheatsheet: [
      { cmd: "awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' f", desc: 'histograma por la col. 1' },
      { cmd: "awk '{ a[$1]++ } END { for (k in a) print k }' f", desc: 'solo las claves únicas' },
    ],
    keywords: ['awk', 'array', 'histograma', 'END'],
  },
  {
    index: 19, title: 'Sólo los únicos', subtitle: 'awk idiom !a[$0]++',
    xp: 75, difficulty: 5,
    brief: 'El fichero revisados.lst tiene valores repetidos. Necesitas SOLO la PRIMERA aparición de cada valor.',
    goal: 'De revisados.lst imprime cada valor UNA VEZ (PRIMERA aparición; en el orden de llegada).',
    setup: (_, f) => `
cat > ${HOME}/revisados.lst <<EOF
a
b
a
c
b
d
${f}
a
EOF
chown agent:agent ${HOME}/revisados.lst`,
    solution: `awk '!a[$0]++' ${HOME}/revisados.lst`,
    hints: [
      '!a[$0]++ es el deduplicador famoso: la PRIMERA vez que se ve un valor imprime, ya que a[valor] era 0 (undefined→false), y las siguientes ya no.',
      'Con la negación !, awk hace "si NO estaba presente, imprime" y luego marca presente.',
      `awk '!a[$0]++' ${HOME}/revisados.lst`,
    ],
    teach: 'El idiom !a[k]++ es el revisor universal de duplicados: sin sort -u ni awk for-loop. Mantiene el ORDEN de llegada (a diferencia de sort -u).',
    cheatsheet: [
      { cmd: 'awk \'!a[$0]++\' f', desc: 'dedup por línea com.aleta' },
      { cmd: 'awk \'!a[$1]++\' f', desc: 'dedup por la col. 1' },
    ],
    keywords: ['awk', 'dedup', 'array', 'idioma'],
  },
  {
    index: 20, title: 'Dos ficheros, una clave', subtitle: 'awk FNR==NR + next',
    xp: 75, difficulty: 5,
    brief: 'El fichero ids.txt lista los IDs permitidos; el fichero eventos.log trae líneas con id. Necesitas las líneas de eventos.log cuyo ID APARECE EN ids.txt.',
    goal: 'Con ambos ficheros (awk ficheroA ficheroB), imprime de eventos.log solo las líneas cuyo primer campo ESTÉ en ids.txt.',
    setup: (_, f) => `
cat > ${HOME}/ids.txt <<EOF
101
103
105
EOF
cat > ${HOME}/eventos.log <<EOF
101 evento del agent
102 evento del clon
103 evento del usuario ${f}
104 evento del host
EOF
chown agent:agent ${HOME}/ids.txt ${HOME}/eventos.log`,
    solution: `awk 'FNR == NR { a[$1]; next } $1 in a' ${HOME}/ids.txt ${HOME}/eventos.log`,
    hints: [
      'FNR == NR es "estoy en el PRIMER fichero": ahí llenas el array y haces NEXT.',
      'En el segundo fichero, $1 in a es el chequeo de membresía.',
      `awk 'FNR == NR { a[$1]; next } $1 in a' ${HOME}/ids.txt ${HOME}/eventos.log`,
    ],
    teach: 'Cuando awk recibe DOS ficheros, FNR == NR es el patrón deIGNORE "estoy en el primero". En NEXT hay que saltar el procesos restos. El patrón: primero llenar un índice y en el segundo, consultar.',
    cheatsheet: [
      { cmd: "awk 'FNR==NR { a[$1]; next } $1 in a' f1 f2", desc: 'join de 2 ficheros por clave' },
      { cmd: "awk 'FNR==NR { a[$1]; next } !($1 in a)' f1 f2", desc: 'el inverso: los NO en f1' },
    ],
    keywords: ['awk', 'FNR', 'NR', 'join'],
  },
  {
    index: 21, title: 'El extracted match()', subtitle: 'awk match() + substr + RSTART/RLENGTH',
    xp: 75, difficulty: 5,
    brief: 'El fichero fragments.dat tiene líneas con texto ESENCIAL: hay un token FLAG con forma FLAG{abc}. Extrae SOLO ese token.',
    goal: 'De fragments.dat imprime SOLAMENTE la subcadena FLAG{…} de cada línea que la contenga.',
    setup: (_, f) => `
cat > ${HOME}/fragments.dat <<EOF
inicio de la línea, FLAG{abc123} al medio
primer hallazgo FLAG{zz} corto sin cola
nada en esta línea
la señal al final: ${f}
EOF
chown agent:agent ${HOME}/fragments.dat`,
    solution: `awk 'match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) }' ${HOME}/fragments.dat`,
    hints: [
      'match(s, /regex/) busca el regex en s y LLENA RSTART y RLENGTH.',
      'awk extra con substr($0, RSTART, RLENGTH) obtiene el texto casado.',
      `awk 'match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) }' ${HOME}/fragments.dat`,
    ],
    teach: 'match(s, /regex/) llena RSTART/RLENGTH. Es lo que awk hace comparable a grep -o. Especificar las llaves ([{], [}]) ARGUMENTES para no escape it inside class char.',
    cheatsheet: [
      { cmd: "awk 'match($0, /pat/) { print substr($0, RSTART, RLENGTH) }' f", desc: 'extrae el match (como grep -o)' },
      { cmd: "awk 'match($0, /pat/) { print RSTART }' f", desc: 'solo la POSICIÓN' },
    ],
    keywords: ['awk', 'match', 'RSTART', 'RLENGTH'],
  },
  {
    index: 22, title: 'Suma condicional', subtitle: 'awk \u0027$1 == "x" { total += $2 } + END',
    xp: 75, difficulty: 5,
    brief: 'El fichero entregas.dat trae acción y cantidad. Solo las líneas con ACCIÓN guardo acumulan en el total.',
    goal: 'De entregas.dat imprime el TOTAL (suma de la segunda columna) de las líneas cuyo PRIMER campo es "guardo".',
    setup: (_, f) => `
cat > ${HOME}/entregas.dat <<EOF
guardo 10
salto 20
guardo 30
vuelo 40
guardo 50 ${f}
EOF
chown agent:agent ${HOME}/entregas.dat`,
    solution: `awk '$1 == "guardo" { total += $2 } END { print total }' ${HOME}/entregas.dat`,
    hints: [
      'La condición $1 == "guardo" y la ACCIÓN { total += $2 } en un solo comando.',
      'En END imprime el total acumulado.',
      `awk '$1 == "guardo" { total += $2 } END { print total }' ${HOME}/entregas.dat`,
    ],
    teach: "La ACCIÓN de awk solo correr cuando el PATRÓN de la condición casar. Es como un \"if\" + \"for\" en una única expressión, como un total + filtro + END en UNA LÍNEA.",
    cheatsheet: [
      { cmd: 'awk \'$1 == "x" { s += $2 } END { print s }\' f', desc: 'suma condicional' },
      { cmd: 'awk \'{ tot += $2 } END { print tot/NR }\' f', desc: 'promedio de la col. 2' },
    ],
    keywords: ['awk', 'condicional', 'suma', 'END'],
  },
  {
    index: 23, title: 'El promedio contabilizado', subtitle: "awk suma + END (promedio)",
    xp: 75, difficulty: 5,
    brief: "El fichero puntajes.lst trae «id puntaje». Se necesita el PROMEDIO de la columna puntaje.",
    goal: 'De puntajes.lst imprime el PROMEDIO de la SEGUNDA columna (2 decimales).',
    setup: (_, f) => `
cat > ${HOME}/puntajes.lst <<EOF
a 4
b 8
c 6
d ${f}
EOF
chown agent:agent ${HOME}/puntajes.lst`,
    solution: `awk '{ tot += $2 } END { printf "%.2f\\\\n", tot/NR }' ${HOME}/puntajes.lst`,
    hints: [
      "tot += $2 acumula la base; NR es el número de líneas vistas.",
      "Con printf \"%.2f\\\\n\" redondeas a dos decimales.",
      `awk '{ tot += $2 } END {  printf "%.2f\\\\n", tot/NR }' ${HOME}/puntajes.lst`,
    ],
    teach: 'Promedio = acumular + contar + dividir en END. awk yprintf están. YOUR atajo aquí son las variables NR (contadores) y tot (sum).',
    cheatsheet: [
      { cmd: 'awk \'{ tot += $2 } END { print tot/NR }\' f', desc: 'promedio col. 2 con NR' },
      { cmd: 'awk \'END { print NR }\' f', desc: 'nº de líneas vistas' },
    ],
    keywords: ['awk', 'promedio', 'NR', 'END'],
  },
  {
    index: 24, title: 'Boss: cayó en la lista negra', subtitle: 'awk join + exclusión + total',
    xp: 175, difficulty: 5,
    brief: 'Se necesitan dos ficheros: pagos.dat (usuario, monto) y blacklist.txt (usuario). El reporte pide el TOTAL de los usuarios que NO están en blacklist.',
    goal: 'Con ambos ficheros, imprime el TOTAL salarial de los usuarios que NO están en blacklist.txt.',
    setup: (_, f) => `
cat > ${HOME}/blacklist.txt <<EOF
developer
intern
EOF
cat > ${HOME}/pagos.dat <<EOF
admin 5000
developer 4000
manager 6000 ${f}
intern 1000
EOF
chown agent:agent ${HOME}/blacklist.txt ${HOME}/pagos.dat`,
    solution: `awk 'FNR == NR { a[$1]; next } !($1 in a) { total += $2 } END { print total }' ${HOME}/blacklist.txt ${HOME}/pagos.dat`,
    hints: [
      'En el primer fichero, llena el array (FNR==NR y next).',
      'En el segundo, si el usuario NO este en la lista, sumar el monto ($2).',
      `awk 'FNR == NR { a[$1]; next } !($1 in a) { total += $2 } END { print total }' ${HOME}/blacklist.txt ${HOME}/pagos.dat`,
    ],
    teach: 'El boss de awk envuelve el "SQL del shell": un join (fichero de índices + consulta), un FILTRO NEGADO (NO está en la lista) y la SUMA con END. Es el patrón más potente en awk en un único comando.',
    cheatsheet: [
      { cmd: "awk 'FNR==NR { a[$1]; next } $1 in a { ... }' f1 f2", desc: 'f1 index → f2 filter' },
      { cmd: "awk 'FNR==NR { a[$1]; next } !($1 in a) { ... } END { print total }' f1 f2", desc: 'excluye + suma + END' },
    ],
    keywords: ['awk', 'boss', 'join', 'acumulador', 'END'],
  },
];

/* ════════════════════════════════════════════════════════════════════ EMISIÓN ══ */
/* ══════ PATCHES por nivel: garantiza que la solución deje la marca en stdout ══════ */
const PATCHES = {
  // El -oE solo extrae el match: la línea del testigo (sin email) sale aparte con grep.
  // Nota: [.] evita el escape del punto (punto dentro de clase es literal).
  'grep-pro-l1': {
    goal: "Extrae de emails.log ÚNICAMENTE las direcciones de correo (una por línea); la línea del testigo lleva la marca y se lista aparte.",
    solution: `grep -oE '[a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4}' ${HOME}/emails.log ; grep 'FLAG{' ${HOME}/emails.log`,
    hints: [
      "-o imprime solo la parte que casa; con -E tienes cuantificadores: +, {n,m}, alternancia |.",
      "El patrón canonical del correo: usuario@dominio.tld, con clases [a-z0-9._-]+ y el punto como [.].",
      "El testigo no tiene email: su línea completa sale aparte con grep 'FLAG{'.",
      `grep -oE '[a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4}' ${HOME}/emails.log ; grep 'FLAG{' ${HOME}/emails.log`,
    ],
  },

  // El contador solo emite un número: la línea del testigo (también de ERROR) sale aparte.
  'grep-pro-l2': {
    setup: (_, f) => `
cat > ${HOME}/accidente.log <<EOF
ERROR disco lleno en /var
INFO snapshot semanal completado
WARN reloj retrasa 2s
ERROR señal taborada en sda
ERROR testigo de la marca: ${f}
INFO hoy opera correcto
EOF
chown agent:agent ${HOME}/accidente.log`,
    goal: "De accidente.log imprime CUÁNTAS líneas contienen la palabra ERROR (número) y, aparte, la línea del testigo con la marca.",
    solution: `grep -c 'ERROR' ${HOME}/accidente.log ; grep 'FLAG{' ${HOME}/accidente.log`,
    hints: [
      "-c es el CONTADOR de líneas casadas: emite un número, no el listado.",
      "No confundir -C (mayúscula, contexto) con -c (minúscula, contador).",
      "El testigo también es de ERROR: su línea completa sale aparte con grep 'FLAG{'.",
      `grep -c 'ERROR' ${HOME}/accidente.log ; grep 'FLAG{' ${HOME}/accidente.log`,
    ],
  },

  // -ic también solo emite número: combo contador + línea del testigo.
  'grep-pro-l3': {
    setup: (_, f) => `
cat > ${HOME}/visitas.log <<EOF
ERROR nivel 1
error nivel 2
Error nivel 3
eRRoR nivel 4
ERROR nivel 5
errOr testigo: ${f}
EOF
chown agent:agent ${HOME}/visitas.log`,
    goal: "De visitas.log imprime el NÚMERO de líneas con error en cualquier formato de letras y, aparte, la línea del testigo con la marca.",
    solution: `grep -ic 'error' ${HOME}/visitas.log ; grep 'FLAG{' ${HOME}/visitas.log`,
    hints: [
      "Las opciones de grep se APILAN: -i (insensible) + -c (contador).",
      "El resultado del contador es un único número.",
      "El testigo también se cuenta (formato errOr): su línea sale aparte con grep 'FLAG{'.",
      `grep -ic 'error' ${HOME}/visitas.log ; grep 'FLAG{' ${HOME}/visitas.log`,
    ],
  },

  // -rl solo da nombres: la línea del testigo va aparte con grep -r.
  'grep-pro-l5': {
    setup: (_, f) => `
mkdir -p ${HOME}/negocio/clientes ${HOME}/negocio/proveedores
echo "factura común" > ${HOME}/negocio/facturas.txt
echo "confidencial: el testigo ${f}" > ${HOME}/negocio/secretos.txt
echo "nada relevante aquí" > ${HOME}/negocio/clientes/lista.txt
echo "confidencial en acta de consejo" > ${HOME}/negocio/clientes/nota.txt
echo "memorando confidencial de compras" > ${HOME}/negocio/proveedores/suministro.csv
echo "sin rastro" > ${HOME}/negocio/proveedores/vacio.csv
chown -R agent:agent ${HOME}/negocio`,
    goal: "Del árbol negocio/, da la lista de ficheros que contienen «confidencial» (solo nombres) y deja a la vista la línea del testigo que lleva la marca.",
    solution: `grep -rl 'confidencial' ${HOME}/negocio ; grep -r 'FLAG{' ${HOME}/negocio`,
    hints: [
      "-l cambia la salida: muestra SOLO nombres de ficheros; con -r lo haces recursivo.",
      "La línea del testigo con la marca sale a la vista con un grep aparte.",
      `grep -rl 'confidencial' ${HOME}/negocio ; grep -r 'FLAG{' ${HOME}/negocio`,
    ],
  },

  // -L solo da nombres de ficheros SIN match: la línea del testigo va aparte.
  'grep-pro-l6': {
    goal: "Del árbol auditoria/, imprime los NOMBRES de los ficheros que NO contienen «comprometido» y, aparte, la línea del testigo con la marca.",
    solution: `grep -L 'comprometido' ${HOME}/auditoria/* ; grep 'FLAG{' ${HOME}/auditoria/testigo.txt`,
    hints: [
      "-L (MAYÚSCULA) muestra los ficheros SIN ninguna coincidencia; -l minúscula los CON.",
      "La línea del testigo con la marca se enseña aparte con grep.",
      `grep -L 'comprometido' ${HOME}/auditoria/* ; grep 'FLAG{' ${HOME}/auditoria/testigo.txt`,
    ],
  },

  // El testigo de tip.log debe decir «intrusión» para que el grep --include lo pille.
  'grep-pro-l16': {
    setup: (_, f) => `
mkdir -p ${HOME}/incidentes/2026/10
echo "intrusión detectada en oct" > ${HOME}/incidentes/oct.log
echo "intrusión en la sub carpeta" > ${HOME}/incidentes/2026/10/evento.log
echo "intrusión en el README" > ${HOME}/incidentes/README.md
echo "intrusión en el respaldo" > ${HOME}/incidentes/oct.log.bak
echo "intrusión en el py" > ${HOME}/incidentes/dev.py
echo "intrusión registrada: ${f}" > ${HOME}/incidentes/2026/10/tip.log
chown -R agent:agent ${HOME}/incidentes`,
  },

  // La PRIMERA línea con BEACON es ahora la del testigo.
  'grep-pro-l7': {
    setup: (_, f) => `
cat > ${HOME}/beacon.log <<EOF
t=001 BEACON primer latido: ${f}
t=002 BEACON latido de control
t=003 silencio dextral
t=004 conexión estimada normal
EOF
chown agent:agent ${HOME}/beacon.log`,
  },

  // La marca viaja en la línea ANTERIOR al ABORT (entra en la ventana -B 2).
  'grep-pro-l10': {
    setup: (_, f) => `
cat > ${HOME}/pipeline.log <<EOF
descargar fuentes (ok)
compilar módulo B con la marca: ${f}
ABORT pub-sub no responde
causa: señal falsa enganchó
reiniciamos el pipeline
EOF
chown agent:agent ${HOME}/pipeline.log`,
  },

  // -oE solo extrae la IP: clases [.] evitan escapes y el testigo sale aparte.
  'grep-pro-l14': {
    goal: "Del registro connexion.log, extrae TODAS las IPs de la subred 10.0.X.X (formato D.D.D.D, una por línea); la línea del testigo (sin IP) sale aparte con su marca.",
    solution: `grep -oE '10[.]0[.][0-9]+[.][0-9]+' ${HOME}/connexion.log ; grep 'FLAG{' ${HOME}/connexion.log`,
    hints: [
      "Para extraer LIMPIO usa -oE; con clases 10[.]0[...[0-9]+ evitas escapar el punto.",
      "El patrón casa solo la subred 10.0 y deja fuera la IP mal formada 10.0d...",
      "La línea del testigo (sin IP) sale aparte con grep 'FLAG{'.",
      `grep -oE '10[.]0[.][0-9]+[.][0-9]+' ${HOME}/connexion.log ; grep 'FLAG{' ${HOME}/connexion.log`,
    ],
  },

  // -oE + cut solo dan el puerto: la línea del testigo sale aparte.
  'grep-pro-l17': {
    goal: "De conexiones.log extrae el PUERTO (segundo campo tras :) de las conexiones hacia IPs 10.4.X.X, y deja a la vista la línea del testigo con la marca.",
    solution: `grep -oE '10[.]4[.][0-9]+[.][0-9]+:[0-9]+' ${HOME}/conexiones.log | cut -d: -f2 ; grep 'FLAG{' ${HOME}/conexiones.log`,
    hints: [
      "grep -oE con 10[.]4[...[0-9]+:[0-9]+ saca líneas «IP:PUERTO» solo de la subred 10.4.",
      "La tubería alimenta a cut; con -d: y -f2 coges el campo 2 (el puerto).",
      "La línea del testigo sale aparte con grep 'FLAG{'.",
      `grep -oE '10[.]4[.][0-9]+[.][0-9]+:[0-9]+' ${HOME}/conexiones.log | cut -d: -f2 ; grep 'FLAG{' ${HOME}/conexiones.log`,
    ],
  },

  // La línea exacta no lleva la marca: el testigo sale aparte.
  'grep-pro-l19': {
    goal: "De acceso.txt imprime SOLO la línea EXACTA password:secreto (línea completa, sin nada antes o después) y, aparte, la línea del testigo con la marca.",
    solution: `grep -xF 'password:secreto' ${HOME}/acceso.txt ; grep 'FLAG{' ${HOME}/acceso.txt`,
    hints: [
      "-x casa TODO el patrón con la LÍNEA COMPLETA; -F hace el patrón LITERAL.",
      "La línea del testigo (password:correcto con la marca) NO es exacta: sale aparte con grep 'FLAG{'.",
      `grep -xF 'password:secreto' ${HOME}/acceso.txt ; grep 'FLAG{' ${HOME}/acceso.txt`,
    ],
  },

  // El total es un número: la línea del testigo sale aparte.
  'grep-pro-l22': {
    goal: "De testigos.log imprime el NÚMERO TOTAL de apariciones del token secret y, aparte, la línea del testigo con la marca.",
    solution: `grep -o 'secret' ${HOME}/testigos.log | wc -l ; grep 'FLAG{' ${HOME}/testigos.log`,
    hints: [
      "-c cuenta LÍNEAS; -o con wc -l cuenta el TOTAL de tokens.",
      "La línea del testigo con la marca sale aparte con grep.",
      `grep -o 'secret' ${HOME}/testigos.log | wc -l ; grep 'FLAG{' ${HOME}/testigos.log`,
    ],
  },

  // -oE extrae solo fechas: la línea del testigo sale aparte.
  'grep-pro-l23': {
    goal: "De tiempos.log extrae SOLAMENTE las fechas AAAA-MM-DD (una por línea) y deja a la vista la línea del testigo con la marca.",
    solution: `grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' ${HOME}/tiempos.log ; grep 'FLAG{' ${HOME}/tiempos.log`,
    hints: [
      "{n} pide n dígitos consecutivos; con -oE cada fecha sale limpia en su línea.",
      "La línea del testigo con la marca sale aparte con grep.",
      `grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' ${HOME}/tiempos.log ; grep 'FLAG{' ${HOME}/tiempos.log`,
    ],
  },

  // La línea suelta con la marca no sobrevive a los tres greps: viaja en una línea trig.
  'grep-pro-l24': {
    setup: (_, f) => `
cat > ${HOME}/tuna.log <<EOF
2026-10-25 08:01 trig sin más
2026-10-25 08:02 span sin acierto
2026-10-25 08:03 trig con ruido noise
ruido span offs por el medio
2026-10-25 09:01 offs solitario
2026-10-25 09:02 trig limpio
2026-10-25 10:00 trig música de fondo
2026-10-25 11:07 trig con la marca: ${f}
EOF
chown agent:agent ${HOME}/tuna.log`,
  },

  // El rol del agente ES la marca: awk -F: '{print $2}' la imprime.
  'awk-pro-l1': {
    setup: (_, f) => `
cat > ${HOME}/roles.txt <<EOF
root:admin
agent:${f}
invitado:lector
backup:admin
EOF
chown agent:agent ${HOME}/roles.txt`,
  },

  // El solo print en END esconde la marca: las líneas quedan a la vista y END suelta el total.
  'awk-pro-l3': {
    goal: 'De ventas.dat imprime cada línea tal cual (la nota suma 0) y al final el TOTAL de la 2.ª columna con formato «total: N».',
    solution: `awk '{ s += $2; print $0 } END { print "total:", s }' ${HOME}/ventas.dat`,
    hints: [
      "El bloque { s += $2; print $0 } se ejecuta para cada línea; END una sola vez al final.",
      "La variable s empieza en 0 (vacía por defecto); las notas con importe 0 no mueven el total.",
      "print $0 deja cada línea a la vista: la de la nota lleva la marca.",
      `awk '{ s += $2; print $0 } END { print "total:", s }' ${HOME}/ventas.dat`,
    ],
  },

  // El hash del testigo debe medir EXACTAMENTE 32 hex para pasar el filtro length+regex.
  'awk-pro-l7': {
    setup: (_, f) => `
cat > ${HOME}/hashes.log <<EOF
user-a 5f4dcc3b5aa765d61d8327deb882cf99
user-b algo corto
user-c 1234567890abcdef1234567890abcdef ${f}
user-d 987szy fuera de patrón
EOF
chown agent:agent ${HOME}/hashes.log`,
  },

  // La línea rival era más larga que la marca: now el testigo ES la más larga.
  'awk-pro-l8': {
    setup: (_, f) => `
cat > ${HOME}/dumpe.log <<EOF
corta
línea de media longitud
${f}
breve
EOF
chown agent:agent ${HOME}/dumpe.log`,
  },

  'awk-pro-l9': {
    brief: "El fichero tokens.log trae alias + token. Necesitas los ÚLTIMOS 8 caracteres de cada token y, aparte, la LÍNEA que lleva la marca.",
    goal: "De tokens.log imprime, por línea, los últimos 8 caracteres del TOKEN (2.ª columna) con substr; después imprime la línea completa que contiene la marca.",
    solution: `awk '{ print substr($2, length($2) - 7) }' ${HOME}/tokens.log ; grep 'FLAG{' ${HOME}/tokens.log`,
    hints: [
      "substr(texto, inicio) devuelve desde esa posición HASTA el final (sin 3er argumento).",
      "Para obtener los últimos 8: substr(s, length(s) - 7).",
      "El token del testigo es la marca entera: su línea se enseña aparte con grep.",
      `awk '{ print substr($2, length($2) - 7) }' ${HOME}/tokens.log ; grep 'FLAG{' ${HOME}/tokens.log`,
    ],
  },

  // index() como condición de línea: las líneas con el token MARK pasan (una lleva la marca).
  'awk-pro-l10': {
    goal: "De posiciones.txt imprime las LÍNEAS donde aparece el token MARK (usa index() como condición de línea).",
    setup: (_, f) => `
cat > ${HOME}/posiciones.txt <<EOF
un texto con MARK al medio
MARK al principio directamente
sin el token aquí
el token MARK esconde: ${f}
EOF
chown agent:agent ${HOME}/posiciones.txt`,
    solution: `awk 'index($0, "MARK")' ${HOME}/posiciones.txt`,
    hints: [
      "index(cadena, subcadena) devuelve posición 1-based (0 si no aparece).",
      "Como condición de línea, index($0, \"MARK\") es verdad SOLO en las líneas que lo contienen; awk imprime la línea entera.",
      `awk 'index($0, "MARK")' ${HOME}/posiciones.txt`,
    ],
  },

  // La marca debe caer en la TERCERA pieza del split para que a[3] la imprima.
  'awk-pro-l11': {
    setup: (_, f) => `
cat > ${HOME}/rutas.dat <<EOF
catalogo:sección-1:item-a
catalogo:sección-2:${f}
catalogo:sección-3:item-c
EOF
chown agent:agent ${HOME}/rutas.dat`,
  },

  // El fichero con espacios en el nombre rompía chown y awk; además faltaba escapar el punto.
  'awk-pro-l12': {
    brief: "Sus líneas mezclan dominios con puntos. La clave: sub() con el punto escapado y una sola sustitución. Una de las líneas lleva la marca.",
    setup: (_, f) => `
cat > ${HOME}/dominios.txt <<EOF
mail.dominio.presto.es
web.dominio.secundaria.es
otro.dato.con.puntos: ${f}
EOF
chown agent:agent ${HOME}/dominios.txt`,
    goal: "De dominios.txt imprime cada línea con su PRIMER punto sustituido por guion bajo (solo la PRIMERA ocurrencia).",
    solution: `awk '{ sub(/\\./, "_"); print }' ${HOME}/dominios.txt`,
    hints: [
      "sub(regex, reemplazo) sustituye SOLO la primera aparición del regex en la línea actual.",
      "El punto hay que escaparlo: en regex casa cualquier carácter ( /\\./ ).",
      `awk '{ sub(/\\./, "_"); print }' ${HOME}/dominios.txt`,
    ],
  },

  'awk-pro-l14': {
    goal: "De metrica.dat imprime cada línea formateada con printf: clave alineada a la izquierda en 6 espacios y valor con 2 decimales. La fila del testigo (no numérica) la muestras aparte tal cual.",
    solution: `awk '{ printf "%-6s %.2f\\n", $1, $2 }' ${HOME}/metrica.dat ; grep 'FLAG{' ${HOME}/metrica.dat`,
    hints: [
      "printf de awk imprime con formato C-style: %-6s es campo de 6 alineado a la izquierda; %.2f es float de 2 decimales.",
      "printf NO añade salto automático: cierra el formato con \\n dentro del string del formato.",
      "La fila del testigo no es numérica (su «valor» da 0.00): muéstrala aparte con grep.",
      `awk '{ printf "%-6s %.2f\\n", $1, $2 }' ${HOME}/metrica.dat ; grep 'FLAG{' ${HOME}/metrica.dat`,
    ],
  },

  // La marca debe ocupar el CAMPO 2 (con ; como separador) para que print $2 la suelte.
  'awk-pro-l16': {
    setup: (_, f) => `
cat > ${HOME}/datos.dat <<EOF
a;1;X
b;${f};Y
c;3;Z
EOF
chown agent:agent ${HOME}/datos.dat`,
  },

  // La marca debe caer en el CAMPO 5 para que $5 la traiga en la salida.
  'awk-pro-l17': {
    setup: (_, f) => `
cat > ${HOME}/amplio.dat <<EOF
uno dos tres cuatro cinco
uno dos tres cuatro cinco seis
uno dos tres cuatro ${f}
EOF
chown agent:agent ${HOME}/amplio.dat`,
  },

  'awk-pro-l18': {
    goal: "De hits.log imprime el histograma «IP cuenta» (una por línea) y deja a la vista la línea del testigo que lleva la marca.",
    solution: `awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' ${HOME}/hits.log ; grep 'FLAG{' ${HOME}/hits.log`,
    hints: [
      "a[$1]++ incrementa la cuenta por IP.",
      "En END, for (k in a) recorre las CLAVES y imprime indicator k y a[k].",
      "La línea del testigo con la marca se enseña aparte con grep.",
      `awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' ${HOME}/hits.log ; grep 'FLAG{' ${HOME}/hits.log`,
    ],
  },

  'awk-pro-l22': {
    goal: "De entregas.dat imprime las líneas cuyo PRIMER campo es \"guardo\" y al final el TOTAL (suma de la 2.ª columna) de esas líneas.",
    solution: `awk '$1 == "guardo" { print $0; total += $2 } END { print "total:", total }' ${HOME}/entregas.dat`,
    hints: [
      "La condición $1 == \"guardo\" filtra; la ACCIÓN imprime la línea Y acumula $2.",
      "En END imprime el total acumulado.",
      `awk '$1 == "guardo" { print $0; total += $2 } END { print "total:", total }' ${HOME}/entregas.dat`,
    ],
    teach: "La condición de awk solo deja pasar las líneas que casan; la ACCIÓN puede hacer varias cosas (imprimir + acumular) y END cierra con el total. Filtro y cálculo en una línea.",
  },

  'awk-pro-l23': {
    goal: "De puntajes.lst imprime cada línea tal cual y al final el PROMEDIO de la 2.ª columna con printf (2 decimales).",
    solution: `awk '{ tot += $2; print $0 } END { printf "media: %.2f\\n", tot/NR }' ${HOME}/puntajes.lst`,
    hints: [
      "tot += $2 acumula la base; NR es el número de líneas vistas.",
      "printf \"%.2f\\n\" redondea a dos decimales; el print intermedio deja a la vista la línea del testigo.",
      `awk '{ tot += $2; print $0 } END { printf "media: %.2f\\n", tot/NR }' ${HOME}/puntajes.lst`,
    ],
  },

  'awk-pro-l24': {
    goal: "Con ambos ficheros, imprime las líneas de pagos.dat cuyo usuario NO está en blacklist.txt y al final el TOTAL de sus montos (suma de la 2.ª columna).",
    solution: `awk 'FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print "total:", total }' ${HOME}/blacklist.txt ${HOME}/pagos.dat`,
    hints: [
      "En el primer fichero, llena el array (FNR==NR y next).",
      "En el segundo, si el usuario NO está en la lista: imprime la línea y suma el monto ($2).",
      "En END imprime el total. La línea del manager lleva la marca y pasa el filtro (no está en la lista).",
      `awk 'FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print "total:", total }' ${HOME}/blacklist.txt ${HOME}/pagos.dat`,
    ],
  },
};

function build(defs, trackName, trackLabel) {
  return defs.map((d) => {
    const id = `${trackName}-l${d.index}`;
    const d2 = { ...d, ...(PATCHES[id] ?? {}) };
    let setup = d2.setup('_', '$DOJO_FLAG').replace(/^\n/, '');
    setup = `#!/bin/bash\nset -e\narena-prompt "LVL ${String(d.index).padStart(2, '0')}" "${trackLabel}"\n` + setup.trimEnd() + '\n';
    return {
      id,
      track: trackName,
      index: d2.index,
      title: d2.title,
      subtitle: d2.subtitle,
      xp: d2.xp,
      difficulty: d2.difficulty,
      brief: d2.brief,
      goal: d2.goal,
      setup,
      solution: d2.solution,
      hints: d2.hints,
      teach: d2.teach,
      cheatsheet: d2.cheatsheet,
      keywords: d2.keywords,
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

emit(GREP_PRO, 'grep-pro', 'Grep-Pro');
emit(AWK_PRO, 'awk-pro', 'Awk-Pro');
