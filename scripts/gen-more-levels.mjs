/**
 * gen-more-levels — genera los niveles de EXPANSIÓN (l6..l12; en boss) a partir
 * de una tabla declarativa. Idempotente: nunca sobreescribe un YAML que ya
 * exista. Contrato de cada nivel (validado por lint-levels + test-levels):
 *   - setup usa la literal $DOJO_FLAG (la sustituye el motor)
 *   - solution NO menciona DOJO_FLAG y debe imprimir la flag con exit 0
 *   - profile: 'default' | 'sudo'
 *
 * Uso:  node scripts/gen-more-levels.mjs [track]   (sin arg = todos)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));

/** fabrica el objeto de nivel rellenando lo común */
function mk(track, n, o) {
  return {
    id: `${track}-l${n}`,
    track,
    index: n,
    title: o.title,
    subtitle: o.subtitle ?? '',
    xp: o.xp ?? 30,
    difficulty: o.difficulty ?? 1,
    brief: o.brief,
    goal: o.goal,
    setup: o.setup,
    solution: o.solution,
    hints: o.hints,
    teach: o.teach,
    cheatsheet: o.cheatsheet,
    keywords: o.keywords,
    profile: o.profile ?? 'default',
  };
}

/* ═════════════════════ FUNDAMENTOS (l6..l12) ═════════════════════ */
const fundamentos = [
  mk('fundamentos', 6, {
    title: 'Nombres traicioneros',
    subtitle: 'espacios, paréntesis y comillas',
    xp: 30, difficulty: 2,
    brief: 'Un informe quedó guardado con un nombre casi imposible: espacios, paréntesis y una palabra final que lo delata.',
    goal: 'Muestra el contenido del fichero "informe (copia) final.txt" que está en tu home.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Fundamentos"
echo "informe de rutina, nada por aqui" > '/home/agent/informe final.txt'
echo "secreto del informe: $DOJO_FLAG" > '/home/agent/informe (copia) final.txt'
mkdir -p /home/agent/informes
echo "copia de trabajo vieja" > /home/agent/informes/copia.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat '/home/agent/informe (copia) final.txt'`,
    hints: [
      'ls /home/agent te enseña los nombres EXACTOS: los espacios y paréntesis cuentan.',
      'Un nombre con espacios debe ir entrecomillado para que la shell no lo parta.',
      'cat "/home/agent/informe (copia) final.txt"',
    ],
    teach: 'Cuando un nombre contiene espacios o paréntesis, la shell lo parte en palabras: hay que protegerlo con comillas. El tabulador (autocompletado) te salva de escribirlo mal.',
    cheatsheet: [
      { cmd: 'cat "archivo con espacios"', desc: 'lee rutas con espacios' },
      { cmd: "cat 'archivo (uno).txt'", desc: 'comillas simples evitan expansiones' },
    ],
    keywords: ['cat', 'espacios', 'comillas', 'quoting'],
  }),
  mk('fundamentos', 7, {
    title: 'El historial delator',
    subtitle: 'bash_history como pista forense',
    xp: 30, difficulty: 2,
    brief: 'El operador anterior tecleó el comando exacto que revela la sala secreta… y quedó anotado en su historial de bash.',
    goal: 'Descubre el fichero secreto a partir de /home/agent/.bash_history y muestra su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Fundamentos"
echo "$DOJO_FLAG" > /etc/arena/sala-secreta.txt
chmod 644 /etc/arena/sala-secreta.txt
printf 'ls /home/agent\nexport TERM=xterm-256color\ncat /etc/arena/sala-secreta.txt\n' > /home/agent/.bash_history
chown agent:agent /home/agent/.bash_history`,
    solution: String.raw`secret=$(grep -oE '/etc/arena/[^ ]+' /home/agent/.bash_history | head -n1); cat "$secret"`,
    hints: [
      'Los comandos del usuario anterior están en .bash_history (fichero oculto, empieza por punto).',
      'En el historial hay una ruta /etc/arena/…: extráela con grep -oE.',
      'secret=$(grep -oE "/etc/arena/[^ ]+" /home/agent/.bash_history | head -n1); cat "$secret"',
    ],
    teach: 'El historial (~/.bash_history) es memoria forense: sirve para reconstruir lo que otro hizo. Y es el motivo por el que NUNCA debes teclear secretos: quedan grabados.',
    cheatsheet: [
      { cmd: 'cat ~/.bash_history', desc: 'mira el historial de comandos' },
      { cmd: "grep -oE 'patron' f", desc: 'imprime solo lo que casa' },
    ],
    keywords: ['history', 'bash_history', 'grep -o'],
  }),
  mk('fundamentos', 8, {
    title: 'Wildcards en la fábrica',
    subtitle: 'globbing: * y ? sobre rutas',
    xp: 35, difficulty: 2,
    brief: 'En exports/ hay años y meses mezclados. Solo el CSV de octubre de 2024 lleva la clave dentro.',
    goal: 'Muestra el contenido del fichero llamado data_2024_10.csv dentro de /home/agent/exports.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Fundamentos"
mkdir -p /home/agent/exports
echo "id;concepto" > /home/agent/exports/data_2023_10.csv
echo "id;concepto" > /home/agent/exports/data_2024_09.csv
echo "export del operador" > /home/agent/exports/data_2024_11.csv
echo "clave del trimestre: $DOJO_FLAG" > /home/agent/exports/data_2024_10.csv
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /home/agent/exports/data_2024_10.csv`,
    hints: [
      'Con ls /home/agent/exports comparas los nombres letra a letra.',
      'Los comodines ahorran tecleado: * casa cualquier texto, ? casa un solo carácter.',
      'cat /home/agent/exports/data_*_10.csv (y fija la mirada en la fila de 2024)',
    ],
    teach: 'El globbing (* y ?) lo expande la shell ANTES de ejecutar el comando; sirve para filtrar por nombre sin abrir ficheros. Verifica siempre con ls qué va a casar.',
    cheatsheet: [
      { cmd: 'ls exports/data*', desc: 'previsualiza qué expande el *' },
      { cmd: 'cat data_2024_10.csv', desc: 'nombre exacto, cero sorpresas' },
    ],
    keywords: ['globbing', 'wildcards', 'ls', 'cat'],
  }),
  mk('fundamentos', 9, {
    title: 'Línea 111',
    subtitle: 'recortar líneas sin editor',
    xp: 30, difficulty: 2,
    brief: 'La agenda tiene 120 compromisos. La marca quedó caída en la línea 111: ni antes, ni después.',
    goal: 'Imprime exactamente la línea 111 de /home/agent/agenda.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Fundamentos"
i=1
while [ $i -le 120 ]; do
  if [ $i -eq 111 ]; then echo "linea 111 hallazgo clave: $DOJO_FLAG"
  else echo "linea $i evento rutinario"; fi
  i=$((i+1))
done > /home/agent/agenda.txt
chown agent:agent /home/agent/agenda.txt`,
    solution: String.raw`head -n 111 /home/agent/agenda.txt | tail -n 1`,
    hints: [
      'wc -l /home/agent/agenda.txt confirma el tamaño del fichero.',
      'Puedes cortar por el principio con head y por la cola con tail; encadenados recortan una ventana.',
      'head -n 111 agenda.txt | tail -n 1',
    ],
    teach: 'head y tail encadenados recortan cualquier ventana de líneas: primeras N y últimas M. wc -l y nl te ayudan a localizar la que buscas.',
    cheatsheet: [
      { cmd: 'head -n N f | tail -n 1', desc: 'línea N exacta' },
      { cmd: 'wc -l f', desc: 'cuenta líneas' },
    ],
    keywords: ['head', 'tail', 'wc', 'líneas'],
  }),
  mk('fundamentos', 10, {
    title: 'La bandeja de entrada',
    subtitle: 'cp: copiar sin perder el original',
    xp: 35, difficulty: 2,
    brief: 'El aviso urgente está enterrado en bandeja/entrada/2024/urgente/. El protocolo exige copia en tu home antes de leerlo.',
    goal: 'Copia aviso.txt a tu home con el nombre aviso-copia.txt y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Fundamentos"
mkdir -p /home/agent/bandeja/entrada/2024/urgente
echo "copia carbon de rutina" > /home/agent/bandeja/entrada/2024/rutina.txt
echo "aviso critico: $DOJO_FLAG" > /home/agent/bandeja/entrada/2024/urgente/aviso.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cp /home/agent/bandeja/entrada/2024/urgente/aviso.txt /home/agent/aviso-copia.txt && cat /home/agent/aviso-copia.txt`,
    hints: [
      'Navega con cd y comprueba con ls cada tramo de la ruta.',
      'cp ORIGEN DESTINO copia sin tocar el original.',
      'cp bandeja/entrada/2024/urgente/aviso.txt ~/aviso-copia.txt && cat ~/aviso-copia.txt',
    ],
    teach: 'cp copia, mv mueve (y renombra); rm borra y no tiene marcha atrás. Las rutas relativas se apoyan en tu cwd: confirma dónde estás con pwd si dudas.',
    cheatsheet: [
      { cmd: 'cp a b', desc: 'copia un fichero' },
      { cmd: 'mv a b', desc: 'mueve o renombra' },
    ],
    keywords: ['cp', 'mv', 'rutas', 'bandeja'],
  }),
  mk('fundamentos', 11, {
    title: 'Leer la leeme',
    subtitle: 'seguir una pista escrita a mano',
    xp: 35, difficulty: 2,
    brief: 'Alguien dejó instrucciones en un fichero oculto .leeme que apunta al escondite de la clave.',
    goal: 'Lee el fichero oculto .leeme de tu home, sigue la ruta que anota y muestra ese fichero.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Fundamentos"
mkdir -p /home/agent/aula/aula-01 /home/agent/aula/aula-07
echo "deja aqui una nota trampa" > /home/agent/aula/aula-01/nota.txt
echo "ve directo a /home/agent/aula/aula-07/nota.txt y no te entretengas" > /home/agent/.leeme
echo "secuencia valida: $DOJO_FLAG" > /home/agent/aula/aula-07/nota.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat "$(grep -oE '/home/agent/[^ ]+' /home/agent/.leeme | head -n1)"`,
    hints: [
      'Los ficheros que empiezan por punto no aparecen en un ls normal: usa ls -a.',
      'La nota menciona una ruta absoluta; extráela con grep -oE.',
      'cat "$(grep -oE "/home/agent/[^ ]+" .leeme | head -n1)"',
    ],
    teach: 'Los ficheros ocultos (punto inicial) guardan configuraciones y notas. La sustitución $(…) mete la salida de un comando dentro de otro: el patrón «localiza → actúa» que usarás todos los días.',
    cheatsheet: [
      { cmd: 'ls -a', desc: 'lista incluidos los ocultos' },
      { cmd: 'cat $(comando)', desc: 'salida como argumento' },
    ],
    keywords: ['ocultos', 'ls -a', 'sustitución de comandos'],
  }),
  mk('fundamentos', 12, {
    title: 'Una clave en dos mitades',
    subtitle: 'cat multiplica argumentos',
    xp: 40, difficulty: 3,
    brief: 'Por protocolo administrativo la clave se guardó partida: la primera mitad en parte_a.txt y el resto en parte_b.txt.',
    goal: 'Imprime las dos mitades en orden (primero A, luego B) formando una sola línea.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Fundamentos"
t="$DOJO_FLAG"
mitad=$(( $(echo -n "$t" | wc -c) / 2 ))
echo -n "$t" | head -c "$mitad" > /home/agent/parte_a.txt
echo -n "$t" | tail -c "+$((mitad+1))" > /home/agent/parte_b.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /home/agent/parte_a.txt /home/agent/parte_b.txt`,
    hints: [
      'cat acepta varios ficheros y los imprime en el orden que los des.',
      'Ojo: la primera mitad NO termina en salto de línea, por eso ambas mitades se pegan.',
      'cat parte_a.txt parte_b.txt',
    ],
    teach: 'cat concatena todos sus argumentos en el orden dado. Si un fichero no termina en salto de línea, la salida se pega al siguiente: así las mitades forman una sola línea.',
    cheatsheet: [
      { cmd: 'cat a b c', desc: 'une ficheros en orden' },
      { cmd: 'cat a b > unido', desc: 'redirige la unión a otro fichero' },
    ],
    keywords: ['cat', 'concatenar', 'redirección'],
  }),
];

/* ═════════════════════ FILTRADO (l6..l12) ═════════════════════ */
const filtrado = [
  mk('filtrado', 6, {
    title: 'La cola de la bitácora',
    subtitle: 'tail -n +N y recortes con head',
    xp: 35, difficulty: 2,
    brief: 'La bitácora acumula cientos de líneas de latidos. El incidente quedó anotado en la cola: desde la línea 360.',
    goal: 'Imprime las 20 primeras líneas a partir del renglón 360 de /home/agent/bitacora.log.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Filtrado"
i=1
while [ $i -le 359 ]; do echo "linea $i latido rutinario del sistema"; i=$((i+1)); done > /home/agent/bitacora.log
echo "linea 360 anomalia detectada: $DOJO_FLAG" >> /home/agent/bitacora.log
i=365
while [ $i -le 400 ]; do echo "linea $i latido"; i=$((i+1)); done >> /home/agent/bitacora.log
chown agent:agent /home/agent/bitacora.log`,
    solution: String.raw`tail -n +360 /home/agent/bitacora.log | head -n 20`,
    hints: [
      'tail -n +360 incluye la línea 360 como primera de la salida.',
      'Encadena con head -n 20 para recortar la ventana.',
      'tail -n +360 bitacora.log | head -n 20',
    ],
    teach: 'tail -n +N lee DESDE la línea N hasta el final; head -n M corta. La combinación «desde + recorte» es el patrón estándar para inspeccionar tramos de logs enormes.',
    cheatsheet: [
      { cmd: 'tail -n +N f', desc: 'desde la línea N al final' },
      { cmd: 'tail -n 20 f', desc: 'últimas 20 líneas' },
    ],
    keywords: ['tail', 'head', 'ventana', 'logs'],
  }),
  mk('filtrado', 7, {
    title: 'CSV de servidores',
    subtitle: 'grep fila + cut columna',
    xp: 35, difficulty: 2,
    brief: 'servidores.csv guarda notas por columnas: nombre, rol, comentario. Las filas de backup traen un comentario especial.',
    goal: 'De las filas cuyo ROL sea "backup", imprime solo el COMENTARIO (tercera columna).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Filtrado"
cat > /home/agent/servidores.csv <<FIN
nombre,rol,comentario
web01,frontend,balanceador principal
web02,frontend,respaldo frio
db01,backend,replicas en marcha
db02,backup,nota de boveda: $DOJO_FLAG
cache01,frontend,memoria en calentamiento
file01,backup,nas secundario
FIN
chown agent:agent /home/agent/servidores.csv`,
    solution: String.raw`grep ',backup,' /home/agent/servidores.csv | cut -d, -f3`,
    hints: [
      'Primero selecciona filas: grep backup servidores.csv.',
      'Luego corta la tercera columna: cut -d, -f3 (el delimitador es la coma).',
      'grep backup servidores.csv | cut -d, -f3',
    ],
    teach: 'cut descuartiza cada línea por un delimitador (-d) y elige campos con -f. Encadenar grep (filas) + cut (columnas) resuelve la mayoría de tablas CSV del mundo real.',
    cheatsheet: [
      { cmd: 'cut -d, -f3 f', desc: 'tercera columna separada por comas' },
      { cmd: 'grep patron f', desc: 'filtra líneas' },
    ],
    keywords: ['cut', 'csv', 'delimitador', 'grep'],
  }),
  mk('filtrado', 8, {
    title: 'Ranking de puntuaciones',
    subtitle: 'sort numérico descendente',
    xp: 35, difficulty: 2,
    brief: 'puntuaciones.txt lista jugadores y puntos desordenados. El campeón (el que más suma) lleva un premio especial en su renglón.',
    goal: 'Ordena por puntos de mayor a menor y muestra la primera línea.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Filtrado"
cat > /home/agent/puntuaciones.txt <<FIN
nova 820
fang 1290
kali 640
zap 901
miso 455
hex 1110
rune 733
campeon 1600 nota del orgullo: $DOJO_FLAG
FIN
chown agent:agent /home/agent/puntuaciones.txt`,
    solution: String.raw`sort -k2 -nr /home/agent/puntuaciones.txt | head -n 1`,
    hints: [
      'sort necesita saber que la columna 2 es numérica.',
      '-k2 elige el campo, -n lo trata por valor y -r invierte el orden.',
      'sort -k2 -nr puntuaciones.txt | head -n 1',
    ],
    teach: 'sort ordena líneas completas por defecto; -k2 -nr ordena por el segundo campo numéricamente y en descenso. head -n 1 toma el campeón.',
    cheatsheet: [
      { cmd: 'sort -k2 -nr f', desc: 'mayor a menor por columna 2' },
      { cmd: 'sort -u f', desc: 'ordena y quita repetidos' },
    ],
    keywords: ['sort', 'ranking', 'numérico'],
  }),
  mk('filtrado', 9, {
    title: 'El visitante solitario',
    subtitle: 'uniq -c: contar repetidos',
    xp: 40, difficulty: 3,
    brief: 'Un usuario accedió solo UNA vez al sistema: los demás repiten decenas de veces. El solitario dejó su marca.',
    goal: 'Encuentra la línea que aparece exactamente una vez en /home/agent/accesos.txt (tras quitar repetidos) y muéstrala.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Filtrado"
i=1
while [ $i -le 31 ]; do echo "nova"; echo "fang"; echo "kali"; i=$((i+1)); done > /home/agent/accesos.txt
echo "firma única: $DOJO_FLAG" >> /home/agent/accesos.txt
chown agent:agent /home/agent/accesos.txt`,
    solution: String.raw`sort /home/agent/accesos.txt | uniq -c | grep ' 1 '`,
    hints: [
      'uniq solo agrupa repetidos CONSECUTIVOS: antes pásalo por sort.',
      'uniq -c antepone el contador a cada línea.',
      'sort accesos.txt | uniq -c | grep " 1 "',
    ],
    teach: 'El tándem sort | uniq -c es la herramienta de frecuencias: cuenta cuántas veces aparece cada valor. El contador ocupa la primera columna: úsalo para filtrar.',
    cheatsheet: [
      { cmd: 'sort f | uniq -c', desc: 'cuenta repeticiones' },
      { cmd: "uniq -c | grep ' 1 '", desc: 'solo únicos' },
    ],
    keywords: ['uniq', 'sort', 'frecuencia'],
  }),
  mk('filtrado', 10, {
    title: 'El eco de la palabra',
    subtitle: 'rev + paste para detectar espejos',
    xp: 45, difficulty: 3,
    brief: 'En frases.txt una línea es un espejo perfecto (palíndromo). La marca no está EN el espejo: está en la línea siguiente.',
    goal: 'Encuentra la línea palíndromo de /home/agent/frases.txt e imprime la línea CONSECUTIVA (la que va después).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Filtrado"
cat > /home/agent/frases.txt <<FIN
el radar de la mañana
el pensionista pide cafe
una frase de relleno
os salta del ratón al timbre
FIN
echo "somos" >> /home/agent/frases.txt
echo "marca espejada: $DOJO_FLAG" >> /home/agent/frases.txt
echo "otro relleno final" >> /home/agent/frases.txt
chown agent:agent /home/agent/frases.txt`,
    solution: String.raw`sed -n "$(rev /home/agent/frases.txt | paste /home/agent/frases.txt - | awk -F'\t' '$1==$2{print NR+1; exit}')p" /home/agent/frases.txt`,
    hints: [
      'rev le da la vuelta a cada línea; paste une dos ficheros columna a columna (el guión es stdin).',
      'Compara la original con su invertida: solo el palíndromo coincide. awk marca el número de esa línea.',
      'n linde=$(rev frases.txt | paste frases.txt - | awk -F"\\t" "$1==$2{print NR; exit}"); sed -n "$((n+1))p" frases.txt',
    ],
    teach: 'rev invierte el texto y paste fusiona columnas (el símbolo - representa stdin). La comparación por campos de awk localiza el espejo; una vez localizado, el sigiente renglón esconde el premio: primero ENCOTRRA, luego MUEVE.',
    cheatsheet: [
      { cmd: 'rev f', desc: 'invierte cada línea' },
      { cmd: 'paste a -', desc: 'une fichero y stdin en columnas' },
    ],
    keywords: ['rev', 'paste', 'palindromo', 'awk'],
  }),
  mk('filtrado', 11, {
    title: 'La franja horaria',
    subtitle: 'grep -E con regex de hora',
    xp: 40, difficulty: 3,
    brief: 'El registro de intentos usa formato HH:MM. Todo lo salido entre las 15:00 y las 15:59 es investigación legítima.',
    goal: 'Imprime las líneas cuyo campo de hora empiece por "15:".',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Filtrado"
cat > /home/agent/intentos.log <<FIN
09:00 prueba desde la web
13:45 sincronización menor
17:10 apagar radio
22:05 comunicado final
FIN
echo "15:20 baliza registrada: $DOJO_FLAG" >> /home/agent/intentos.log
echo "15:47 segunda baliza confirmada" >> /home/agent/intentos.log
chown agent:agent /home/agent/intentos.log`,
    solution: String.raw`grep -E '^15:' /home/agent/intentos.log`,
    hints: [
      'El ancla ^ fija el patrón al principio de cada línea.',
      'grep -E activa expresiones regulares extendidas.',
      "grep -E '^15:' intentos.log",
    ],
    teach: 'grep -E abre el repertorio de regex: ^ ancla al inicio, $ al final, [] clases de caracteres. Anclar evita falsos positivos en cualquier parte del texto.',
    cheatsheet: [
      { cmd: "grep -E '^17:' f", desc: 'filtra por prefijo' },
      { cmd: 'grep -c patron f', desc: 'solo cuenta ocurrencias' },
    ],
    keywords: ['grep -E', 'regex', 'ancla', 'log'],
  }),
  mk('filtrado', 12, {
    title: 'Basura de Windows',
    subtitle: 'tr: limpiar CR y espacios repetidos',
    xp: 45, difficulty: 3,
    brief: 'Un fichero importado de Windows trae retornos de carro (\\\\r) y espacios dobles; la línea de la clave está enterrada ahí, deformada.',
    goal: 'Limpia /home/agent/importado.txt (quita \\\\r y comprime espacios múltiples a uno) y muestra la línea de la clave.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Filtrado"
printf 'clave  maestra:\x20\x20$DOJO_FLAG\r\nnota  normal del sistema\r\nespacios   y   mas   espacios\r\n' > /home/agent/importado.txt
chown agent:agent /home/agent/importado.txt`,
    solution: String.raw`tr -d '\r' < /home/agent/importado.txt | tr -s ' ' | grep 'clave'`,
    hints: [
      "La \\\\r (retorno de carro de Windows) se borra con tr -d '\\\\r'.",
      "tr -s ' ' aprieta las repeticiones del espacio a una sola.",
      "tr -d '\\\\r' < importado.txt | tr -s ' ' | grep clave",
    ],
    teach: 'tr traduce o borra caracteres de stdin: -d borra, -s comprime repeticiones. Normalizar la entrada (CRLF, espacios, mayúsculas) antes de filtrar evita falsos negativos.',
    cheatsheet: [
      { cmd: "tr -d '\\\\r'", desc: 'borra retorno de carro' },
      { cmd: "tr -s ' '", desc: 'aprieta espacios repetidos' },
    ],
    keywords: ['tr', 'CRLF', 'normalizar'],
  }),
];

/* ═════════════════════ BUSQUEDA (l6..l12) ═════════════════════ */
const busqueda = [
  mk('busqueda', 6, {
    title: 'Recorrer el árbol',
    subtitle: 'grep -r recursivo',
    xp: 35, difficulty: 2,
    brief: 'En proyecto/ hay subcarpetas y subcarpetas de subcarpetas. La clave está en UN fichero cualquiera del árbol.',
    goal: 'Encuentra y muestra la línea que contiene la clave en todo /home/agent/proyecto.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Búsqueda"
mkdir -p /home/agent/proyecto/src/lib /home/agent/proyecto/docs/dev /home/agent/proyecto/tests
echo "codigo fuente sufriente" > /home/agent/proyecto/src/main.c
echo "documentacion obsoleta" > /home/agent/proyecto/docs/oficial.md
echo "pruebas de humo" > /home/agent/proyecto/tests/smoke.sh
echo "-> $DOJO_FLAG" > /home/agent/proyecto/docs/dev/secretos.md
echo "libreria abandonada" > /home/agent/proyecto/src/lib/inutil.c
chown -R agent:agent /home/agent/proyecto`,
    solution: String.raw`grep -r 'FLAG{' /home/agent/proyecto`,
    hints: [
      'Una búsqueda en una sola carpeta NO basta: el tesoro está en un subnivel.',
      'grep -r desciende por todo el árbol de directorios.',
      "grep -r 'FLAG{' /home/agent/proyecto",
    ],
    teach: 'grep -r busca recursivamente en todos los ficheros de un árbol; combinado con -n indica fichero y línea del hallazgo. Es la linterna para cuando no sabes dónde está.',
    cheatsheet: [
      { cmd: "grep -rn 'x' dir/", desc: 'busca e indica línea' },
      { cmd: "grep -r --include='*.md' x dir", desc: 'restringe por extensión' },
    ],
    keywords: ['grep -r', 'recursivo', 'arbol'],
  }),
  mk('busqueda', 7, {
    title: 'Sospechosos de root',
    subtitle: 'find -user (y su negación)',
    xp: 40, difficulty: 3,
    brief: 'En vault/ casi todo es del agente, pero alguien dejó objetos propiedad de root. El propietario delata el escondite.',
    goal: 'Hallar los ficheros de /home/agent/vault que NO pertenecen a agent y mostrar su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Búsqueda"
mkdir -p /home/agent/vault
echo "nota propia del agente" > /home/agent/vault/mi-nota.txt
echo "etiqueta cambiada" > /home/agent/vault/etiqueta.txt
echo "tesoro de root: $DOJO_FLAG" > /home/agent/vault/.raiz-secreto.txt
chown -R agent:agent /home/agent/vault
chown root:root /home/agent/vault/.raiz-secreto.txt /home/agent/vault/etiqueta.txt
chmod 644 /home/agent/vault/.raiz-secreto.txt /home/agent/vault/etiqueta.txt`,
    solution: String.raw`find /home/agent/vault ! -user agent -type f -exec cat {} \;`,
    hints: [
      'find -user agent lista lo suyo; con ! lo inviertes.',
      '-type f limita a ficheros; -exec cat {} \\\\; imprime cada hallazgo.',
      'find vault ! -user agent -type f -exec cat {} \\\\;',
    ],
    teach: 'find filtra por usuario (-user), tipo, tamaño, tiempo… y ejecuta acciones con -exec. La negación ! invierte cualquier criterio: aquí, porque el testigo es lo que NO es tuyo.',
    cheatsheet: [
      { cmd: 'find dir ! -user agent', desc: 'ficheros de otros dueños' },
      { cmd: 'find dir -type f -exec cat {} \\\\;', desc: 'imprime todos' },
    ],
    keywords: ['find', '-user', '-exec', 'propietario'],
  }),
  mk('busqueda', 8, {
    title: 'Purga de basura',
    subtitle: 'find -name + -delete',
    xp: 35, difficulty: 2,
    brief: 'work/ está lleno de ficheros .tmp que ocultan los reales a simple vista. Limpia primero, busca después.',
    goal: 'Borra todos los .tmp de /home/agent/work y muestra la línea de la clave que queda.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Búsqueda"
mkdir -p /home/agent/work
i=1
while [ $i -le 12 ]; do echo "ruido temporal $i" > /home/agent/work/sesion-$i.tmp; i=$((i+1)); done
echo "el resto no es basura: $DOJO_FLAG" > /home/agent/work/nota-real-01.txt
echo "otra nota real de trabajo" > /home/agent/work/nota-real-02.txt
chown -R agent:agent /home/agent/work`,
    solution: String.raw`find /home/agent/work -name '*.tmp' -delete; grep -r 'FLAG{' /home/agent/work`,
    hints: [
      'find -name "*.tmp" selecciona por patrón de nombre.',
      'La acción -delete elimina lo que casa (haz un ls antes para confirmar).',
      "find work -name '*.tmp' -delete && grep -r FLAG work",
    ],
    teach: 'find + -delete es la escoba quirúrgica: muy potente, así que previsualiza el listado sin ella antes. Tras la limpieza, los nombres verdaderos emergen.',
    cheatsheet: [
      { cmd: "find d -name '*.tmp'", desc: 'previsualiza qué borrarás' },
      { cmd: "find d -name '*.tmp' -delete", desc: 'borra lo casado' },
    ],
    keywords: ['find -delete', 'limpieza', 'xargs'],
  }),
  mk('busqueda', 9, {
    title: 'Contraseña sospechosa',
    subtitle: 'grep -E con prefijos compuestos',
    xp: 40, difficulty: 3,
    brief: 'logins.txt anota intentos con formato user=… pass=…. Solo las passwords que empiezan por el prefijo s3cr3t delatan al intruso.',
    goal: 'Muestra las líneas cuya contraseña empiece por s3cr3t.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Búsqueda"
cat > /home/agent/logins.txt <<FIN
user=beto pass=hola123 desde=web
user=ana pass=letmein2 desde=lan
user=zoe pass=superclaves desde=web
user=marc pass=qwerty9 desde=api
user=gua pass=estonosirve desde=lan
FIN
echo "user=intruso pass=s3cr3t-clave: $DOJO_FLAG desde=tor" >> /home/agent/logins.txt
chown agent:agent /home/agent/logins.txt`,
    solution: String.raw`grep -E 'pass=s3cr3t' /home/agent/logins.txt`,
    hints: [
      'El patrón debe fijarse al literal pass= para no casar nada más.',
      'grep -E soporta prefijos textuales y clases a la vez.',
      "grep -E 'pass=s3cr3t' logins.txt",
    ],
    teach: 'Incluir contexto en la regex (pass=s3cr3t) evita sacar coincidencias sueltas: la fuerza de grep -E está en describir la ESTRUCTURA de la línea, no solo un trozo.',
    cheatsheet: [
      { cmd: "grep -E 'k=v' f", desc: 'casa campo=valor' },
      { cmd: "grep -v 'descarto' f", desc: 'excluye líneas' },
    ],
    keywords: ['grep -E', 'logins', 'prefijo'],
  }),
  mk('busqueda', 10, {
    title: 'Mindepth: el pozo',
    subtitle: 'solo ficheros en niveles profundos',
    xp: 45, difficulty: 3,
    brief: 'El maze/ reparte ficheros en todos los niveles, pero el tesoro está solo en la capa 3 o más profunda.',
    goal: 'Muestra los ficheros que están a profundidad 3 o más dentro de /home/agent/maze.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Búsqueda"
mkdir -p /home/agent/maze/a/b/c/d /home/agent/maze/a/b2 /home/agent/maze/nivel1
echo "nivel intermedio" > /home/agent/maze/a/b/c/medio.txt
echo "sombra de nivel 1" > /home/agent/maze/nivel1/trampa.txt
echo "en el fondo del pozo: $DOJO_FLAG" > /home/agent/maze/a/b/c/d/fondo.txt
echo "otra sombra" > /home/agent/maze/a/b2/decoy.txt
chown -R agent:agent /home/agent/maze`,
    solution: String.raw`find /home/agent/maze -mindepth 3 -type f -exec cat {} \;`,
    hints: [
      'find gradúa la profundidad con -mindepth N (la carpeta raíz cuenta con el nivel 0).',
      '-type f deja solo ficheros, no directorios.',
      'find maze -mindepth 3 -type f -exec cat {} \\\\;',
    ],
    teach: '-mindepth/-maxdepth acotan la profundidad de la búsqueda: imprescindible cuando el árbol tiene capas de señuelos. La raíz cuenta como nivel 0.',
    cheatsheet: [
      { cmd: 'find d -mindepth 2 -name x', desc: 'desde el nivel 2 hacia abajo' },
      { cmd: 'find d -maxdepth 1 -type d', desc: 'solo capas directas' },
    ],
    keywords: ['find', 'mindepth', 'profundidad'],
  }),
  mk('busqueda', 11, {
    title: 'Pesados con escondite',
    subtitle: 'find -size + la cola del fichero',
    xp: 45, difficulty: 3,
    brief: 'En block/ hay ficheros gordos de relleno; en la cola de uno de ellos se guarda la clave.',
    goal: 'Localiza los ficheros de más de 100 KB y muestra los últimos 90 bytes de cada uno.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Búsqueda"
mkdir -p /home/agent/block
head -c 200000 /dev/zero | tr '\0' 'x' > /home/agent/block/relleno-a.dat
head -c 150000 /dev/zero | tr '\0' 'y' > /home/agent/block/relleno-b.dat
head -c 120000 /dev/zero | tr '\0' 'z' > /home/agent/block/relleno-c.dat
echo "escondite de 100k" > /home/agent/block/gordo-d.dat
head -c 130000 /dev/zero | tr '\0' 'w' >> /home/agent/block/gordo-d.dat
printf '\nclave final: %s\n' "$DOJO_FLAG" >> /home/agent/block/gordo-d.dat
echo "pequenio e inofensivo" > /home/agent/block/chico.dat
chown -R agent:agent /home/agent/block`,
    solution: String.raw`for f in $(find /home/agent/block -size +100k); do tail -c 90 "$f"; echo; done`,
    hints: [
      'find -size +100k filtra por tamaño (k=kilobytes) y descarta lotes menores.',
      'La cola del fichero se lee con tail -c N (número de bytes).',
      'for f in $(find block -size +100k); do tail -c 90 "$f"; echo; done',
    ],
    teach: 'find -size clasifica por tamaño real (c, k, M…); tail -c lee bytes, no líneas. Muchos troyanos anexan su carga al final de ficheros legítimos: mirar la cola es rutina forense.',
    cheatsheet: [
      { cmd: 'find d -size +100k', desc: 'ficheros de más de 100 KB' },
      { cmd: 'tail -c 90 f', desc: 'últimos 90 bytes' },
    ],
    keywords: ['find -size', 'tail -c', 'bytes'],
  }),
  mk('busqueda', 12, {
    title: 'Configuración filtrada',
    subtitle: 'grep -r --include',
    xp: 50, difficulty: 4,
    brief: 'En /etc/arena/ hay ficheros .conf, .log y .bak mezclados. Solo los .conf cuentan para la validación.',
    goal: 'Busca la clave SOLO dentro de los ficheros *.conf de /etc/arena.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Búsqueda"
mkdir -p /etc/arena
echo "puerto 4040" > /etc/arena/servicio.conf
echo "cache false" > /etc/arena/perf.conf
echo "registro de ruido FLAG{decoy-01}" > /etc/arena/servicio.log
echo "historial innecesario" > /etc/arena/historico.bak
echo "nitro = $DOJO_FLAG" > /etc/arena/llave.conf
chmod -R a+r /etc/arena
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -rn 'FLAG{' /etc/arena --include='*.conf'`,
    hints: [
      'grep -r recorre el árbol; --include="*.conf" acota los nombres que inspecciona.',
      'La marca puede estar en cualquier fichero: el include evita confusiones.',
      "grep -rn 'FLAG{' /etc/arena --include='*.conf'",
    ],
    teach: '--include (y su contrario --exclude) en grep -r filtra POR NOMBRE de fichero mientras el -r recorre el árbol: la pareja ideal para auditorías de configuración.',
    cheatsheet: [
      { cmd: "grep -rn x d --include='*.conf'", desc: 'solo .conf, indicando línea' },
      { cmd: "grep -rn x d --exclude='*.log'", desc: 'descarta ruido' },
    ],
    keywords: ['grep', 'include', 'exclude', 'conf'],
  }),
];

/* ═════════════════════ PROCESADO (l6..l12) ═════════════════════ */
const procesado = [
  mk('procesado', 6, {
    title: 'Campos exactos',
    subtitle: 'awk NF: contar columnas',
    xp: 40, difficulty: 3,
    brief: 'En inventario.txt casi todas las filas están mal formadas; solo las filas de 7 campos son válidas y UNA de ellas trae la marca.',
    goal: 'Imprime las filas de inventario.txt que tienen exactamente 7 campos.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Procesado"
cat > /home/agent/inventario.txt <<FIN
caja tornillo hierro
estante madera hierro roble pintura
estante puente hierro roble pintura barniz
cofre llave marca especial $DOJO_FLAG zinc cobre yodo
armario madera tornillo hierro pintura zinc
FIN
chown agent:agent /home/agent/inventario.txt`,
    solution: String.raw`awk 'NF == 7' /home/agent/inventario.txt`,
    hints: [
      'awk cuenta los campos de cada línea en la variable NF.',
      'El patrón se escribe sin / /: NF == 7 es una comparación numérica.',
      "awk 'NF == 7' inventario.txt",
    ],
    teach: 'awk evalúa un patrón por línea y ejecuta la acción por defecto (imprimir la línea) si casa. NF, NR, $1… son variables internas que hacen del awk un mini-lenguaje de relatórios.',
    cheatsheet: [
      { cmd: "awk 'NF == 7' f", desc: 'líneas de 7 campos' },
      { cmd: "awk '{print $1}' f", desc: 'primera columna' },
    ],
    keywords: ['awk', 'NF', 'campos'],
  }),
  mk('procesado', 7, {
    title: 'Movimientos gordos',
    subtitle: 'awk -F, con filtro numérico',
    xp: 40, difficulty: 3,
    brief: 'movs.txt anota conceptos e importes separados por comas. Los movimientos mayores de 900 llevan una nota en la primera columna.',
    goal: 'Imprime el CONCEPTO (columna 1) de las filas cuyo IMPORTE (columna 2) supere 900.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Procesado"
cat > /home/agent/movs.txt <<FIN
compra-papel,320
salida-fibra,870
entrada-liquidos,1450
reparacion,600
auditoria-junio,120
FIN
echo "nota-especial: $DOJO_FLAG,1499" >> /home/agent/movs.txt
chown agent:agent /home/agent/movs.txt`,
    solution: String.raw`awk -F, '$2 > 900 {print $1}' /home/agent/movs.txt`,
    hints: [
      'awk -F, define la coma como separador de campos.',
      'El patrón compara $2 con un número; la acción imprime $1.',
      "awk -F, '$2 > 900 {print $1}' movs.txt",
    ],
    teach: 'El bloque patrón→acción de awk (patrón { acción }) filtra y transforma en un solo paso: filas con -F, campos con $n, salida con print. Es el sustituto ligero de mil scripts.',
    cheatsheet: [
      { cmd: "awk -F, '$2>900 {print $1}'", desc: 'concepto de filas caras' },
      { cmd: "awk '{s+=$2} END{print s}'", desc: 'suma de una columna' },
    ],
    keywords: ['awk', 'campo', 'filtro numérico'],
  }),
  mk('procesado', 8, {
    title: 'Captura de grupo',
    subtitle: 'sed -n s/…/\\\\1/p',
    xp: 45, difficulty: 3,
    brief: 'datos.txt mezcla frases normales con pares clave=VALOR. El válido es único y está en mitad de una línea cualquiera.',
    goal: 'Imprime únicamente el valor del par que empieza por clave= (sin el prefijo), solo de la marca real.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Procesado"
cat > /home/agent/datos.txt <<FIN
el operador dos reviso la sala a las 9
esto es relleno de calidad media: clave=nada-importa-1
auditoria pendiente de aprobacion
la marca final != clave=$DOJO_FLAG y sigue la frase
FIN
echo "temporada cerrada" >> /home/agent/datos.txt
chown agent:agent /home/agent/datos.txt`,
    solution: String.raw`grep -oE 'clave=FLAG\{[^}]*\}' /home/agent/datos.txt | grep -oE 'FLAG\{[^}]*\}'`,
    hints: [
      'grep -o imprime solo la parte casada, no la línea entera.',
      'El patrón clave=FLAG con la clase [^}]* acota la marca de principio a fin.',
      "grep -oE 'clave=FLAG\\{[^}]*\\}' datos.txt | grep -oE 'FLAG\\{[^}]*\\}'",
    ],
    teach: 'La extracción en dos pasos (casa el CONTEXTO, luego casa solo el TROZO) es la alternativa sin sed a la captura de grupos: primero delimita, luego purifica. práctica forense de cada día.',
    cheatsheet: [
      { cmd: "grep -oE 'k=v' f", desc: 'extrae pares campo=valor' },
      { cmd: "sed 's/viejo/nuevo/g' f", desc: 'sustitución global' },
    ],
    keywords: ['grep -o', 'captura', 'par clave'],
  }),
  mk('procesado', 9, {
    title: 'Dos ficheros emparejados',
    subtitle: 'paste + grep',
    xp: 45, difficulty: 3,
    brief: 'ids.txt y secretos.txt están alineados línea a línea. La ficha «0042» guarda una relación con el donante.',
    goal: 'Junta ambas fichas por líneas y muestra la fila cuyo ID es 0042 (ID y su secreto).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Procesado"
printf '0001\n0002\n0042\n0007\n0011\n' > /home/agent/ids.txt
printf 'cero-calce\ndos-calce\nficha especial: $DOJO_FLAG\ncuatro-calce\nocho-calce\n' > /home/agent/secretos.txt
chown agent:agent /home/agent/ids.txt /home/agent/secretos.txt`,
    solution: String.raw`paste /home/agent/ids.txt /home/agent/secretos.txt | grep '^0042'`,
    hints: [
      'paste coloca fichero 1 y fichero 2 en columnas separadas por tabulador.',
      'El ancla ^0042 evita casar el 042 de otra ficha.',
      "paste ids.txt secretos.txt | grep '^0042'",
    ],
    teach: 'paste une ficheros en columnas; cuando dos ficheros están alineados por filas, el índice de una línea ES la clave. El grep con ancla evita hallazgos falsos.',
    cheatsheet: [
      { cmd: 'paste a b', desc: 'une ficheros por líneas' },
      { cmd: "paste a b | awk '$1==42'", desc: 'elige por columna' },
    ],
    keywords: ['paste', 'alinear', 'join'],
  }),
  mk('procesado', 10, {
    title: 'Servicios por puerto',
    subtitle: 'awk -F: con cadena',
    xp: 45, difficulty: 3,
    brief: 'servicios.conf usa formato svc:puerto:dueño. La fila del puerto 8081 guarda el alias y su marca.',
    goal: 'Imprime la línea completa cuya segunda columna sea exactamente 8081.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Procesado"
cat > /home/agent/servicios.conf <<FIN
http:80:root
ssh:22:root
dns:53:bind
proxy:3128:squid
FIN
echo "puente-defensa:8081:$DOJO_FLAG" >> /home/agent/servicios.conf
echo "cache:11211:memcached" >> /home/agent/servicios.conf
chown agent:agent /home/agent/servicios.conf`,
    solution: String.raw`awk -F: '$2 == 8081' /home/agent/servicios.conf`,
    hints: [
      'El separador aquí son los DOS PUNTOS.',
      'Con awk puedes comparar cadenas: $2 == "8081" (o por número, sin comillas).',
      "awk -F: '$2 == 8081' servicios.conf",
    ],
    teach: 'awk funciona igual de bien con : , ; o espacios como separador: -F define tu mundo tabular. La comparación == funciona con números y cadenas sin drama.',
    cheatsheet: [
      { cmd: "awk -F: '$2==22' f", desc: 'fila cuyo campo 2 es 22' },
      { cmd: "awk -F: '{print $2,$3}' f", desc: 'dos columnas' },
    ],
    keywords: ['awk', 'F:', 'puerto'],
  }),
  mk('procesado', 11, {
    title: 'Partición de un gigante',
    subtitle: 'split + grep en trozos',
    xp: 50, difficulty: 4,
    brief: 'grande.log es demasiado para editores: dividir por trozos y filtrar es más rápido que abrirlo entero.',
    goal: 'Divide grande.log en 5 trozos por líneas con prefijo trozo_ y muestra las líneas de la clave entre todos.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Procesado"
i=1
while [ $i -le 500 ]; do
  if [ $i -eq 333 ]; then echo "linea 333 ancla: $DOJO_FLAG"; else echo "linea $i ruido de relleno"; fi
  i=$((i+1))
done > /home/agent/grande.log
chown agent:agent /home/agent/grande.log`,
    solution: String.raw`split -n l/5 /home/agent/grande.log trozo_ && grep -h 'FLAG{' trozo_*`,
    hints: [
      'Hazlo en tu home: cd ~ antes de dividir (los trozos se quedan junto a ti).',
      'split -n l/5 divide en 5 trozos por líneas (sin romper líneas).',
      'grep -h busca en los trozos sin mostrar el nombre de fichero.',
    ],
    teach: 'split trocea ficheros gigantes por tamaño (-b) o por líneas (-n l/K). Filtrar en trozos es lo que hacen las herramientas de streaming: menos memoria, más paralelismo.',
    cheatsheet: [
      { cmd: 'split -n l/5 f pre_', desc: 'cinco trozos por líneas' },
      { cmd: 'grep -h x pre_*', desc: 'busca sin nombres de fichero' },
    ],
    keywords: ['split', 'grande.log', 'trozo'],
  }),
  mk('procesado', 12, {
    title: 'Solo lo nuevo',
    subtitle: 'comm: diferencia de listas ordenadas',
    xp: 50, difficulty: 4,
    brief: 'v1.sorted y v2.sorted son inventarios ordenados. Todo lo que añadimos en v2 merece revisión, y una de esas altas es la marca.',
    goal: 'Muestra las líneas presentes SOLO en v2.sorted (que no están en v1.sorted).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Procesado"
printf 'anillo\nbotas\ncandado\nsombrero\n' > /home/agent/v1.sorted
printf 'anillo\nbotas\ncandado\nmartillo\nreloj\nsombrero\n' > /home/agent/v2.sorted
printf 'insignia nueva con marca: $DOJO_FLAG\n' >> /home/agent/v2.sorted
LC_ALL=C sort -o /home/agent/v1.sorted /home/agent/v1.sorted
LC_ALL=C sort -o /home/agent/v2.sorted /home/agent/v2.sorted
chown agent:agent /home/agent/v1.sorted /home/agent/v2.sorted`,
    solution: String.raw`comm -13 /home/agent/v1.sorted /home/agent/v2.sorted`,
    hints: [
      'comm compara DOS ficheros ya ordenados y saca 3 columnas: solo-1, solo-2, ambos.',
      'Las banderas -1 -2 -3 ocultan columnas: -13 deja solo la 2.',
      'comm -13 v1.sorted v2.sorted',
    ],
    teach: 'comm es el hermano fino de diff para LISTAS: sus columnas son solo-A, solo-B y común, y cada una se suprime con -1/-2/-3. Requiere ficheros ordenados con el mismo orden.',
    cheatsheet: [
      { cmd: 'comm -12 a b', desc: 'elementos comunes' },
      { cmd: 'comm -13 a b', desc: 'solo en el segundo' },
    ],
    keywords: ['comm', 'diferencia', 'orden', 'sets'],
  }),
];

/* ═════════════════════ PERMISOS (l6..l12) ═════════════════════ */
const permisos = [
  mk('permisos', 6, {
    title: 'El script dormido',
    subtitle: 'chmod +x: dar permiso de ejecución',
    xp: 35, difficulty: 2,
    brief: 'llave.sh tiene la ejecución prohibida. Sin el bit de ejecución, ./llave.sh se niega a arrancar.',
    goal: 'Dale permiso de ejecución al propietario y ejecútalo con ./llave.sh.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Permisos"
cat > /home/agent/llave.sh <<FIN
#!/bin/bash
echo "la llave gira y revela: $DOJO_FLAG"
FIN
chmod 644 /home/agent/llave.sh
chown agent:agent /home/agent/llave.sh`,
    solution: String.raw`chmod u+x /home/agent/llave.sh && /home/agent/llave.sh`,
    hints: [
      'El error esperado es Permission denied y el diagnóstico está en ls -l (falta la x).',
      'chmod u+x da ejecución solo al dueño.',
      'chmod u+x llave.sh && ./llave.sh',
    ],
    teach: 'El bit x convierte un fichero en ejecutable: sin él el núcleo no lo lanza directamente. u/g/o definen a quién se toca el permiso; ls -l es tu espejo.',
    cheatsheet: [
      { cmd: 'chmod +x script.sh', desc: 'ejecutable para todos' },
      { cmd: './script.sh', desc: 'ejecuta el local' },
    ],
    keywords: ['chmod', 'ejecución', '+x'],
  }),
  mk('permisos', 7, {
    title: 'Copias contenidas',
    subtitle: 'umask: permisos por defecto al crear',
    xp: 45, difficulty: 3,
    brief: 'El protocolo interno exige que TODO lo copiado en tu home sea privado (600). El secreto está en la umask del proceso.',
    goal: 'Copia credencial.txt a tu home con umask 077 y muéstrala (la copia debe quedar como -rw-------).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Permisos"
echo "credencial del operador: $DOJO_FLAG" > /home/agent/credencial.txt
chmod 644 /home/agent/credencial.txt
chown agent:agent /home/agent/credencial.txt`,
    solution: String.raw`umask 077; cp /home/agent/credencial.txt /home/agent/credencial-copia.txt; cat /home/agent/credencial-copia.txt; stat -c '%a' /home/agent/credencial-copia.txt`,
    hints: [
      'umask define qué permisos se QUITAN al crear ficheros.',
      'Con umask 077 los ficheros nuevos quedan 600.',
      'umask 077; cp credencial.txt ~/ ; cat ~/credencial.txt',
    ],
    teach: 'umask ENMASCARA los permisos de creación (0666 & ~umask en ficheros). En un subshell (paréntesis) la cambia solo para ese comando: el entorno decide la herencia de permisos.',
    cheatsheet: [
      { cmd: 'umask 077', desc: 'creación privada' },
      { cmd: 'umask', desc: 'muestra la actual' },
    ],
    keywords: ['umask', 'cp', 'permisos privados'],
  }),
  mk('permisos', 8, {
    title: 'Bóveda cerrada a cal y canto',
    subtitle: 'recuperar un directorio con chmod',
    xp: 45, difficulty: 3,
    brief: 'vault/ quedó sin ningún permiso (000): ni listar, ni entrar. Eres el dueño; el remedio está en tus manos.',
    goal: 'Recupera el acceso a /home/agent/vault (permisos 700) y muestra llave.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Permisos"
mkdir -p /home/agent/vault
echo "la boveda se abre: $DOJO_FLAG" > /home/agent/vault/llave.txt
chown agent:agent /home/agent/vault /home/agent/vault/llave.txt
chmod 000 /home/agent/vault
chmod 000 /home/agent/vault/llave.txt`,
    solution: String.raw`chmod 700 /home/agent/vault && chmod 600 /home/agent/vault/llave.txt && cat /home/agent/vault/llave.txt`,
    hints: [
      'Aun con permisos 000, el DUEÑO puede cambiarlos (chmod es del propietario).',
      'Los directorios necesitan x para ENTRAR y r para LISTAR; 700 cubre ambos.',
      'chmod 700 vault && chmod 600 vault/llave.txt && cat vault/llave.txt',
    ],
    teach: 'Un directorio sin x no se puede recorrer aunque los ficheros dentro sean legibles. El dueño puede SIEMPRE cambiar permisos: por eso los fallos de permisos propios no necesitan sudo.',
    cheatsheet: [
      { cmd: 'chmod 700 dir', desc: 'solo el dueño entra' },
      { cmd: 'chmod 600 f', desc: 'privado total' },
    ],
    keywords: ['chmod', 'directorio', 'x', '700'],
  }),
  mk('permisos', 9, {
    title: 'Escalada honrada',
    subtitle: 'sudo: actuar como root cuando toca',
    xp: 50, difficulty: 3,
    profile: 'sudo',
    brief: 'En este dojo el agente tiene sudo. El tesoro está en /root/tesoro.txt, inaccesible para el agente normal.',
    goal: 'Lee /root/tesoro.txt usando sudo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Permisos"
echo "tesoro real: $DOJO_FLAG" > /root/tesoro.txt
chmod 600 /root/tesoro.txt
chown root:root /root/tesoro.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sudo cat /root/tesoro.txt`,
    hints: [
      'cat /root/tesoro.txt devuelve Permission denied: es del root.',
      'El sudo concede privilegios elevados para UN comando.',
      'sudo cat /root/tesoro.txt',
    ],
    teach: 'sudo ejecuta un comando como root validando contra /etc/sudoers. Potencia enorme, responsabilidad idéntica: mínimo privilegio, comando a comando.',
    cheatsheet: [
      { cmd: 'sudo cat /root/x', desc: 'lee fichero de root' },
      { cmd: 'sudo -l', desc: 'qué te permite el sudoers' },
    ],
    keywords: ['sudo', 'root', 'escalada'],
  }),
  mk('permisos', 10, {
    title: 'Mundo escribible',
    subtitle: 'find -perm: cazar ficheros expuestos',
    xp: 50, difficulty: 3,
    brief: 'Alguien dejó ficheros con permiso de escritura para TODOS (666): una de esas exposiciones esconde la marca.',
    goal: 'Encuentra los ficheros world-writable de /home/agent/reinado y muestra su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Permisos"
mkdir -p /home/agent/reinado
echo "nota normal 644" > /home/agent/reinado/normal1.txt
echo "mas notas normales 644" > /home/agent/reinado/normal2.txt
echo "exposicion: $DOJO_FLAG" > /home/agent/reinado/partida.txt
chmod 644 /home/agent/reinado/*.txt
chown -R agent:agent /home/agent/reinado
chmod 666 /home/agent/reinado/partida.txt`,
    solution: String.raw`find /home/agent/reinado -perm -o+w -type f -exec cat {} \;`,
    hints: [
      'find -perm -o+w casa ficheros que al menos tienen escritura para otros.',
      'La acción pueden combinarse: ! -perm daría lo contrario.',
      'find dir -perm -o+w -type f -exec cat {} \\\\;',
    ],
    teach: 'Los ficheros escribibles por el mundo son una vulnerabilidad clásica: cualquiera puede modificarlos. find -perm te los caza sin abrirlos uno a uno.',
    cheatsheet: [
      { cmd: 'find d -perm -o+w', desc: 'world-writable' },
      { cmd: 'find d -perm -u+s', desc: 'SUID (aviso de riesgo)' },
    ],
    keywords: ['find -perm', 'world writable', 'auditoría'],
  }),
  mk('permisos', 11, {
    title: 'El escritor sin permiso',
    subtitle: 'copiar requiere permisos del directorio',
    xp: 50, difficulty: 3,
    brief: 'salida/ existe pero es de solo lectura (555): ni cp ni touch pueden escribir en ella. La salvación es devolverle la w al dueño.',
    goal: 'Recupera permisos de salida/, copia hito.txt dentro y muestra la copia.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Permisos"
mkdir -p /home/agent/salida
echo "hito de auditoria: $DOJO_FLAG" > /home/agent/hito.txt
chown agent:agent /home/agent/salida /home/agent/hito.txt
chmod 555 /home/agent/salida
chmod 644 /home/agent/hito.txt`,
    solution: String.raw`chmod u+w /home/agent/salida && cp /home/agent/hito.txt /home/agent/salida/ && cat /home/agent/salida/hito.txt`,
    hints: [
      'El Permission denied al copiar sale del DIRECTORIO, no del fichero.',
      'La creación dentro de un directorio requiere w en el propio directorio.',
      'chmod u+w salida && cp hito.txt salida/',
    ],
    teach: 'Los permisos que importan al COPIAR son los del DIRECTORIO destino (w) y los del FICHERO origen (r). Si cp falla escribiendo, mira el directorio, no el fichero.',
    cheatsheet: [
      { cmd: 'chmod u+w dir', desc: 'permite crear dentro' },
      { cmd: 'ls -ld dir', desc: 'permisos del directorio' },
    ],
    keywords: ['permisos', 'directorio', 'cp'],
  }),
  mk('permisos', 12, {
    title: 'Corrección masiva',
    subtitle: 'chmod -R y la X mayúscula',
    xp: 55, difficulty: 4,
    brief: 'cadena/ es un árbol de scripts donde TODOS perdieron el permiso de ejecución. La restauración es recursiva.',
    goal: 'Devuelve ejecución al dueño en TODO el árbol de /home/agent/cadena y ejecuta el último paso.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Permisos"
mkdir -p /home/agent/cadena/paso1/paso2/paso3
echo "cadena completa: $DOJO_FLAG" > /home/agent/cadena/paso1/paso2/paso3/final.sh
cat > /home/agent/cadena/paso1/a.sh <<FIN
#!/bin/bash
echo "eslabon 1 ok"
FIN
cat > /home/agent/cadena/paso1/paso2/b.sh <<FIN
#!/bin/bash
echo "eslabon 2 ok"
FIN
cat > /home/agent/cadena/paso1/paso2/paso3/final.sh <<FIN
#!/bin/bash
echo "eslabon 3"
FIN
echo "fin realmente: $DOJO_FLAG" > /home/agent/cadena/paso1/paso2/paso3/realfinal.txt
chown -R agent:agent /home/agent/cadena
chmod -R u-x /home/agent/cadena`,
    solution: String.raw`chmod -R u+x /home/agent/cadena && /home/agent/cadena/paso1/paso2/paso3/final.sh; cat /home/agent/cadena/paso1/paso2/paso3/realfinal.txt`,
    hints: [
      'chmod -R recorre el árbol entero.',
      'Distingue: +x lo da a TODO fichero; +X (mayúscula) solo a directorios y ficheros ya ejecutables.',
      'chmod -R u+x cadena && ./cadena/paso1/paso2/paso3/final.sh',
    ],
    teach: 'chmod -R es la restauración en bloque de un árbol maltratado. +X (mayúscula) es la variante fina: x solo en directorios y en los ficheros que YA la tenían.',
    cheatsheet: [
      { cmd: 'chmod -R u+x d', desc: 'recursivo para el dueño' },
      { cmd: 'chmod u+X -R d', desc: 'x solo a directorios' },
    ],
    keywords: ['chmod -R', 'arbol', 'script'],
  }),
];

/* ═════════════════════ PROCESOS (l6..l12) ═════════════════════ */
const procesos = [
  mk('procesos', 6, {
    title: 'El intruso visible',
    subtitle: 'ps: la línea de comandos delata',
    xp: 40, difficulty: 3,
    brief: 'Un proceso estrafalario quedó ARRANCADO y su línea de argumentos lleva la marca. No hay ficheros: solo la tabla de procesos.',
    goal: 'Localiza la marca que aparece en los argumentos de algún proceso en ejecución.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Procesos"
nohup bash -c 'sleep 1000' demonio-sospechoso "secreto-sophos-$DOJO_FLAG" >/dev/null 2>&1 &
nohup bash -c 'sleep 1000' receptor-normal a b c >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`ps ax -o args | grep -oE 'FLAG\{[^}]*\}' | tail -n 1`,
    hints: [
      'ps ax lista procesos con su línea de comandos completa.',
      'Los argumentos con los que nació un proceso se ven en ps (no confundir con el env).',
      "ps ax -o args | grep -oE 'FLAG\\{[^}]*\\}'",
    ],
    teach: 'ps no solo muestra nombres: la columna args revela TODOS los argumentos con que un proceso nació. Auditar ps regularmente saca a la luz procesos intrusos.',
    cheatsheet: [
      { cmd: 'ps ax -o args', desc: 'argumentos de cada proceso' },
      { cmd: 'pgrep -f patron', desc: 'PID de lo que casa el comando' },
    ],
    keywords: ['ps', 'args', 'argumentos'],
  }),
  mk('procesos', 7, {
    title: 'El obediente delator',
    subtitle: 'kill TERM + trap en bash',
    xp: 45, difficulty: 3,
    brief: 'Un vigilante debe morir CORTESMENTE (SIGTERM): esa señal dispara su confesión escrita en el disco.',
    goal: 'Termina el proceso vigilante con SIGTERM y muestra la marca que deja en /tmp/marca-vigilante.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Procesos"
cat > /tmp/vigilante.sh <<FIN
#!/bin/bash
trap 'echo "confesion del vigilante: $DOJO_FLAG" > /tmp/marca-vigilante.txt' TERM
while true; do sleep 1; done
FIN
chmod 755 /tmp/vigilante.sh
nohup /tmp/vigilante.sh >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`kill $(pgrep -f vigilante); sleep 1; cat /tmp/marca-vigilante.txt`,
    hints: [
      'Obtén el PID: pgrep -f vigilante devuelve el identificador.',
      'kill PID manda SIGTERM (la señal por defecto NO es -9).',
      'kill $(pgrep -f vigilante); sleep 1; cat /tmp/marca-vigilante.txt',
    ],
    teach: 'SIGTERM es la señal educada: da al proceso la oportunidad de cerrar bien (trap la intercepta). kill -9 (SIGKILL) mata sin ninguna última palabra: úsala solo como último recurso.',
    cheatsheet: [
      { cmd: 'kill PID', desc: 'pide cierre correcto' },
      { cmd: 'pgrep -f x', desc: 'PIDs que casan' },
    ],
    keywords: ['kill', 'trap', 'SIGTERM', 'pgrep'],
  }),
  mk('procesos', 8, {
    title: 'El que come la memoria',
    subtitle: 'ps --sort=-rss: el más pesado',
    xp: 45, difficulty: 3,
    brief: 'Un proceso está bebiendo la RAM: es el más pesado de la máquina y quedó bautizado con la marca en sus argumentos.',
    goal: 'Lista los procesos ordenados por consumo de memoria y extrae la marca del más pesado.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Procesos"
nohup python3 -c "d=[0]*15000000; import time; time.sleep(1000)" "gloton-memoria" "$DOJO_FLAG" >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`ps aux --sort=-rss | head -n 5 | grep -oE 'FLAG\{[^}]*\}' | head -n 1`,
    hints: [
      'ps aux --sort=<campo> ordena por RSS (memoria residente).',
      'Con -rss y el modo descendente, el primero de la lista es el más gordo.',
      "ps aux --sort=-rss | grep -oE 'FLAG\\{[^}]*\\}' | head -n 1",
    ],
    teach: 'ps aux --sort=-rss expone a los devoradores de memoria. Ordenar procesos por consumo es lo que hacen los sysadmins antes de matar nada: medir primero, actuar después.',
    cheatsheet: [
      { cmd: 'ps aux --sort=-rss | head', desc: 'top en consumo de RAM' },
      { cmd: 'ps -eo pid,comm,%mem', desc: 'tabla compacta' },
    ],
    keywords: ['ps', 'sort', 'rss', 'memoria'],
  }),
  mk('procesos', 9, {
    title: 'El descriptor abierto',
    subtitle: 'lsof: quién tiene abierto qué',
    xp: 50, difficulty: 3,
    brief: 'Un guardián (corriendo como tu usuario) mantiene un fichero legado abierto… visible con lsof.',
    goal: 'Descubre con lsof el fichero que el guardián tiene abierto y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Procesos"
mkdir -p /etc/arena
echo "caso guardado: $DOJO_FLAG" > /etc/arena/vault.txt
chmod 644 /etc/arena/vault.txt
cat > /tmp/guardian.sh <<FIN
#!/bin/bash
exec 3< /etc/arena/vault.txt
while true; do sleep 1; done
FIN
chmod 755 /tmp/guardian.sh
runuser -u agent -- bash -c 'nohup /tmp/guardian.sh >/dev/null 2>&1 &'
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`cat $(lsof -p $(pgrep -f guardian) 2>/dev/null | grep -oE '/etc/arena/[^ ]+' | head -n1)`,
    hints: [
      'lsof lista ficheros abiertos por cada proceso (como agente solo ves los tuyos).',
      'Localiza el PID con pgrep -f guardian y pregunta solo a ese: lsof -p PID.',
      'cat $(lsof -p $(pgrep -f guardian) | grep -oE "/etc/arena/[^ ]+" | head -n1)',
    ],
    teach: 'lsof responde «quién tiene abierto qué»: ficheros borrados a medias, sockets, descriptores… La combinación pgrep → lsof -p PID es un diagnóstico mínimo eficaz.',
    cheatsheet: [
      { cmd: 'lsof -p PID', desc: 'ficheros abiertos de un PID' },
      { cmd: 'lsof +D dir', desc: 'todo lo abierto bajo un árbol' },
    ],
    keywords: ['lsof', 'fd', 'proceso', 'pgrep'],
  }),
  mk('procesos', 10, {
    title: 'La lectura del disco',
    subtitle: 'df: espacios y su registro',
    xp: 40, difficulty: 2,
    brief: 'Antes de la limpieza conviene medir. El registro del uso del disco (var/log/arena) guarda una nota con la marca.',
    goal: 'Comprueba el espacio libre de / con df y después muestra /var/log/arena/uso.log.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Procesos"
mkdir -p /var/log/arena
echo "mediciones del dia: espacio sano, disco estable: $DOJO_FLAG" > /var/log/arena/uso.log
chmod 644 /var/log/arena/uso.log
chown -R agent:agent /home/agent`,
    solution: String.raw`df -h / && cat /var/log/arena/uso.log`,
    hints: [
      'df -h muestra uso y espacio libre por sistema de ficheros (h=humanos).',
      'El fichero del registro es legible para todos (644).',
      'df -h /; cat /var/log/arena/uso.log',
    ],
    teach: 'df mide PARTICIONES y du mide CARPETAS. Antes de cualquier limpieza: df para saber dónde aprieta y du para saber a quién culpar.',
    cheatsheet: [
      { cmd: 'df -h', desc: 'espacio por partición' },
      { cmd: 'du -sh dir', desc: 'tamaño total de un directorio' },
    ],
    keywords: ['df', 'disco', 'espacio'],
  }),
  mk('procesos', 11, {
    title: 'El alijo del pesado',
    subtitle: 'du: encontrar la carpeta que pesa',
    xp: 55, difficulty: 4,
    brief: 'En workspace/ hay varios contenedores; uno pesa más que todos por su relleno y guardó la clave dentro.',
    goal: 'Localiza el CONTENEDOR más pesado con du y muestra su fichero clave.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Procesos"
mkdir -p /workspace/lite /workspace/media
dd if=/dev/zero of=/workspace/lite/relleno bs=1024 count=60 2>/dev/null
dd if=/dev/zero of=/workspace/media/relleno bs=1024 count=180 2>/dev/null
mkdir -p /workspace/grueso
echo "aqui estoy: $DOJO_FLAG" > /workspace/grueso/clave.txt
dd if=/dev/zero of=/workspace/grueso/relleno bs=1024 count=400 2>/dev/null
chown -R agent:agent /workspace`,
    solution: String.raw`m=$(du -sk /workspace/* | sort -rn | head -n1 | cut -f2); cat "$m/clave.txt"`,
    hints: [
      'du -sk lista cada contenedor con su tamaño EN KILOBYTES (k).',
      'Ordenando por el número, el primero es el más pesado; la ruta queda en la 2ª columna.',
      'm=$(du -sk /workspace/* | sort -rn | head -n1 | cut -f2); cat "$m/clave.txt"',
    ],
    teach: 'du -sk + sort -rn es la rutina clásica de «quién llena el disco». El -k normaliza unidades para que el orden numérico no traicione nada mezclando Mega y Kilo.',
    cheatsheet: [
      { cmd: 'du -sk dir/* | sort -rn | head', desc: 'mayores por KB' },
      { cmd: 'cut -f2', desc: 'columna 2 (tabulado)' },
    ],
    keywords: ['du', 'sort', 'espacio'],
  }),
  mk('procesos', 12, {
    title: 'El portero y su llave',
    subtitle: '/proc/PID/cmdline: leer el comando del proceso',
    xp: 55, difficulty: 4,
    brief: 'Un portero dejó pasada su llave en la línea de comandos con la que arrancó. La carpeta /proc lo cuenta todo.',
    goal: 'Lee /proc/<PID>/cmdline del portero, extrae la ruta /etc/arena/... y muestra ese fichero.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Procesos"
mkdir -p /etc/arena/final
echo "la llave del portero: $DOJO_FLAG" > /etc/arena/final/llave.txt
chmod 644 /etc/arena/final/llave.txt
nohup bash -c 'sleep 1000' portero-guardian /etc/arena/final/llave.txt >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`r=$(tr '\0' ' ' < /proc/$(pgrep -f portero-guardian | head -n1)/cmdline | grep -oE '/etc/arena/[^ ]+' | head -n1); cat "$r"`,
    hints: [
      'Cada proceso tiene /proc/PID/cmdline separado por bytes NUL (\\\\0).',
      'tr "\\0" " " convierte los separadores en espacios para poder extraer rutas.',
      'r=$(tr "\\0" " " < /proc/PID/cmdline | grep -oE "/etc/arena/[^ ]+"); cat "$r"',
    ],
    teach: '/proc es un espejo del kernel: cmdline, environ, status, fd… todo proceso vive ahí. Leer cmdline de otros procesos revela con qué fueron arrancados.',
    cheatsheet: [
      { cmd: 'tr "\\0" " " < /proc/PID/cmdline', desc: 'comando del proceso' },
      { cmd: 'pgrep -f x', desc: 'PID de lo buscado' },
    ],
    keywords: ['/proc', 'cmdline', 'tr'],
  }),
];

export function allExpansion() {
  return [
    ['fundamentos', fundamentos],
    ['filtrado', filtrado],
    ['busqueda', busqueda],
    ['procesado', procesado],
    ['permisos', permisos],
    ['procesos', procesos],
  ];
}

/* ═══ modo CLI ═══ */
if (import.meta.url === `file://${process.argv[1]}`) {
  const filter = process.argv[2] ?? '';
  let created = 0; let skipped = 0;
  for (const [track, levels] of allExpansion()) {
    if (filter && track !== filter) continue;
    const dir = path.join(repoRoot, 'levels', track);
    fs.mkdirSync(dir, { recursive: true });
    for (const lvl of levels) {
      const file = path.join(dir, `l${lvl.index}.yaml`);
      if (fs.existsSync(file)) { skipped++; continue; }
      fs.writeFileSync(file, YAML.stringify(lvl, { lineWidth: 100 }));
      created++;
      console.log(`  + ${lvl.id}`);
    }
  }
  console.log(`total: ${created} creados, ${skipped} ya existían`);
}
