/**
 * gen-levels3-f — tanda 3 (parte A): fundamentos l13..l18 · filtrado l13..l18.
 * Reglas verificadas: la solución corre como agent, nunca usa $DOJO_FLAG y
 * termina imprimiendo la flag en la salida.
 */
import { mk } from './lib-levels.mjs';

const fundamentos = [
  mk('fundamentos', 13, {
    title: 'El más reciente',
    subtitle: 'ordenar por fecha con ls -t',
    xp: 30, difficulty: 2,
    brief: 'En ~/registro hay fichas con fechas distintas. Solo la ficha modificada más recientemente lleva la marca del dojo.',
    goal: 'Descubre qué ficha de ~/registro se tocó por última vez y muéstrala.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Fundamentos"
mkdir -p /home/agent/registro
echo "ficha antigua del lunes: sin novedades" > /home/agent/registro/lunes.txt
echo "ficha del martes: nada que ver" > /home/agent/registro/martes.txt
echo "última entrada: $DOJO_FLAG" > /home/agent/registro/hoy.txt
touch -d "3 days ago" /home/agent/registro/lunes.txt
touch -d "2 days ago" /home/agent/registro/martes.txt
touch -d "1 hour ago" /home/agent/registro/hoy.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /home/agent/registro/$(ls -t /home/agent/registro | head -n1)`,
    hints: [
      'ls -t ordena por fecha de modificación (la más nueva primero).',
      'Combina: cat $(ls -t | head -n1) dentro del directorio.',
      'cat /home/agent/registro/$(ls -t /home/agent/registro | head -n1)',
    ],
    teach: 'ls -t es el modo cronológico de ls; con -t | head tienes el último fichero tocado en una sola tubería. Perfecto para "¿qué cambió aquí hace un rato?".',
    cheatsheet: [
      { cmd: 'ls -t', desc: 'ordena por fecha (nuevo→viejo)' },
      { cmd: 'ls -rt', desc: 'orden cronológico inverso' },
    ],
    keywords: ['ls', 'touch', 'orden'],
  }),
  mk('fundamentos', 14, {
    title: 'La séptima marca',
    subtitle: 'dirigirse a una línea exacta',
    xp: 30, difficulty: 2,
    brief: 'salas.txt tiene una marca por línea, tantas como salas. La de la séptima línea es la buena; el resto son señuelos.',
    goal: 'Muestra únicamente la séptima línea de /home/agent/salas.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Fundamentos"
{ echo "sala 1: cerrada"; echo "sala 2: cerrada"; echo "sala 3: cerrada"
  echo "sala 4: cerrada"; echo "sala 5: cerrada"; echo "sala 6: cerrada"
  echo "sala 7: $DOJO_FLAG"
  echo "sala 8: cerrada"; echo "sala 9: cerrada"; } > /home/agent/salas.txt
chown agent:agent /home/agent/salas.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sed -n 7p /home/agent/salas.txt`,
    hints: [
      'sed -n Np fichero imprime exactamente la línea N.',
      'También vale: head -n7 | tail -n1.',
      'sed -n 7p /home/agent/salas.txt',
    ],
    teach: 'Dirigirse a una línea exacta evita imprimir ficheros enormes: sed -n 12p, head | tail o NR==7 de awk son tres caminos al mismo punto.',
    cheatsheet: [
      { cmd: 'sed -n 7p f', desc: 'imprime la línea 7' },
      { cmd: 'head -n7 f | tail -n1', desc: 'lo mismo con head/tail' },
    ],
    keywords: ['sed', 'lineas', 'wc'],
  }),
  mk('fundamentos', 15, {
    title: 'Variable heredada',
    subtitle: 'source y variables de entorno',
    xp: 35, difficulty: 2,
    brief: 'Un fichero de entorno guarda la ruta de la bóveda en la variable DOJO_PATH. Cárgalo en tu shell y usa la variable.',
    goal: 'Carga /home/agent/.login_env y usa $DOJO_PATH para mostrar el contenido de la bóveda.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Fundamentos"
mkdir -p /etc/arena /home/agent/boveda
echo "export DOJO_PATH=/home/agent/boveda/clave.txt" > /home/agent/.login_env
echo "clave de la bóveda: $DOJO_FLAG" > /home/agent/boveda/clave.txt
chmod 644 /home/agent/.login_env /home/agent/boveda/clave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`source /home/agent/.login_env; cat "$DOJO_PATH"`,
    hints: [
      'source (o el punto .) ejecuta un fichero en TU shell actual: las variables quedan cargadas.',
      'Después, la ruta vive en $DOJO_PATH: cat "$DOJO_PATH".',
      'source /home/agent/.login_env; cat "$DOJO_PATH"',
    ],
    teach: 'source NO abre un subshell: las variables quedan en tu sesión. Es la diferencia entre "ejecutar" (fork: variables efímeras) y "cargar" (dot). Clásico de .bashrc y .env.',
    cheatsheet: [
      { cmd: 'source f', desc: 'carga variables en el shell' },
      { cmd: '. f', desc: 'equivalente corto' },
    ],
    keywords: ['source', 'env', 'variables'],
  }),
  mk('fundamentos', 16, {
    title: 'Cara o cruz',
    subtitle: 'file: el tipo verdadero',
    xp: 35, difficulty: 2,
    brief: 'En ~/cofre hay tres ficheros .txt, pero uno miente: internamente es otro formato. file revela la verdad.',
    goal: 'Identifica el fichero de ~/cofre cuyo contenido REAL es gzip y muestralo descomprimido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Fundamentos"
mkdir -p /home/agent/cofre
echo "nota normal: todo en orden" > /home/agent/cofre/a.txt
echo "otra nota aburrida" > /home/agent/cofre/b.txt
printf 'la pieza real: %s\n' "$DOJO_FLAG" | gzip > /home/agent/cofre/c.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`f=$(file /home/agent/cofre/* | grep gzip | cut -d: -f1); zcat "$f"`,
    hints: [
      'file fichero dice el tipo por su contenido, no por su nombre.',
      'Filtra los que salgan como gzip y descomprímelos al stdout con zcat.',
      "f=$(file /home/agent/cofre/* | grep gzip | cut -d: -f1); zcat \"$f\"",
    ],
    teach: 'file Lee los "magic bytes" del principio del fichero: la extensión se puede fingir, los primeros bytes no. Útil cuando algo "debería ser X" y no abre.',
    cheatsheet: [
      { cmd: 'file *', desc: 'tipo real de cada fichero' },
      { cmd: 'zcat f.gz', desc: 'gzip al stdout sin descomprimir a disco' },
    ],
    keywords: ['file', 'gzip', 'magic'],
  }),
  mk('fundamentos', 17, {
    title: 'La letra pequeña',
    subtitle: 'leer instrucciones y seguirlas',
    xp: 40, difficulty: 3,
    brief: 'El README del dojo da una ruta absoluta "-donde está la pieza". Leer y OBEDECER: la ruta está impresa en el propio fichero.',
    goal: 'Lee /home/agent/README, extrae la ruta que menciona y muestra ese fichero.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Fundamentos"
mkdir -p /etc/arena
echo "README del dojo" > /home/agent/README
echo "la pieza del nivel está archivada en /etc/arena/letra-pequena.txt" >> /home/agent/README
echo "recuerda: no hay accesos rápidos, solo lectura atenta" >> /home/agent/README
echo "$DOJO_FLAG" > /etc/arena/letra-pequena.txt
chmod 644 /etc/arena/letra-pequena.txt /home/agent/README
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep -oE '/etc/arena/[a-z.-]+' /home/agent/README | head -n1); cat "$p"`,
    hints: [
      'grep -oE con una regex de ruta saca la ruta sin el resto del texto.',
      'Las rutas absolutas del README empiezan por /etc/arena/.',
      "p=$(grep -oE '/etc/arena/[a-z.-]+' /home/agent/README); cat \"$p\"",
    ],
    teach: 'Leer documentación ES una habilidad de terminal: grep -oE "\\w+\\.\\w+|/ruta" sobre README y man página el salto de "se que existo" a "hago lo que pide".',
    cheatsheet: [
      { cmd: "grep -oE '/ruta/[a-z.-]+' f", desc: 'extrae rutas de un texto' },
      { cmd: 'cat README', desc: 'obvio, pero se olvida' },
    ],
    keywords: ['cat', 'grep', 'rutas'],
  }),
  mk('fundamentos', 18, {
    title: 'Historia reciente',
    subtitle: 'bash_history como pista forense',
    xp: 40, difficulty: 3,
    brief: 'Alguien dejó su .bash_history sin limpiar: entre comandos rutinarios quedó impresa la ruta del fichero con la pieza.',
    goal: 'Encuentra en /home/agent/.bash_history la única ruta bajo /var que aparece y muestra ese fichero.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Fundamentos"
mkdir -p /var/local/notas
rm -f /home/agent/.bash_history
printf 'ls /home/agent\nexport TERM=xterm-256color\ncat /var/local/notas/salida.txt\ncd /tmp\n' > /home/agent/.bash_history
echo "$DOJO_FLAG" > /var/local/notas/salida.txt
chmod 644 /var/local/notas/salida.txt /home/agent/.bash_history
chown agent:agent /home/agent/.bash_history
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep -oE '/var/[a-z/.]+' /home/agent/.bash_history | sort -u | head -n1); cat "$p"`,
    hints: [
      'history y cat ~/.bash_history muestran lo mismo; el fichero es lo greppable.',
      'grep -oE con regex de ruta deja solo la ruta; sort -u la desduplica.',
      "p=$(grep -oE '/var/[a-z/.]+' ~/.bash_history); cat \"$p\"",
    ],
    teach: '.bash_history es oro forense: comandos, rutas y hasta errores revelan lo que pasó. grep -oE sobre history es una receta de incident response de verdad.',
    cheatsheet: [
      { cmd: 'history', desc: 'comandos de la sesión' },
      { cmd: "grep -oE 'patrón' ~/.bash_history", desc: 'extraer datos del history' },
    ],
    keywords: ['history', 'grep', 'forense'],
  }),
];

const filtrado = [
  mk('filtrado', 13, {
    title: 'Veinte bytes',
    subtitle: 'head -c: cortar por bytes',
    xp: 35, difficulty: 2,
    brief: 'data.bin empieza exactamente con la pieza (y luego basura de relleno). El flag completo cabe en los primeros 40 bytes.',
    goal: 'Muestra los primeros 40 bytes de /home/agent/data.bin.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Filtrado"
printf '%s RELLENO RELLENO RELLENO RELLENO RELLENO\n' "$DOJO_FLAG" > /home/agent/data.bin
chown agent:agent /home/agent/data.bin
chown -R agent:agent /home/agent`,
    solution: String.raw`head -c 40 /home/agent/data.bin`,
    hints: [
      '-n cuenta LÍNEAS; -c cuenta BYTES: para binarios usa -c.',
      'La pieza (30 caracteres) más relleno: 40 bytes bastan.',
      'head -c 40 /home/agent/data.bin',
    ],
    teach: 'head -c es la navaja para binarios y logs binarios mezclados: cortas por bytes sin cortar líneas imposibles. Combinado con tail -c +S lees "ventanas" de ficheros gigantes.',
    cheatsheet: [
      { cmd: 'head -c 40 f', desc: 'primeros 40 bytes' },
      { cmd: 'tail -c +10 f', desc: 'desde el byte 10 al final' },
    ],
    keywords: ['head', 'bytes', 'binario'],
  }),
  mk('filtrado', 14, {
    title: 'Desde la línea doce',
    subtitle: 'tail -n +N: leer desde una línea',
    xp: 35, difficulty: 2,
    brief: 'bitacora.txt tiene una cabecera de once líneas de rutina. La primera línea ÚTIL (la doce) lleva la marca.',
    goal: 'Muestra únicamente la línea 12 de /home/agent/bitacora.txt (desde la 12, una sola).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Filtrado"
{
  echo "bitácora del dojo · versión 3"
  for i in $(seq 2 11); do echo "entrada de rutina $i: nada destacable"; done
  echo "entrada útil: $DOJO_FLAG"
  echo "entrada 13: rutina"; echo "entrada 14: rutina"
} > /home/agent/bitacora.txt
chown agent:agent /home/agent/bitacora.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`tail -n +12 /home/agent/bitacora.txt | head -n1`,
    hints: [
      'tail -n +12 imprime DESDE la línea 12 hasta el final (¡el + cambia el significado!).',
      'Encadena con head -n1 para quedarte solo la primera.',
      'tail -n +12 /home/agent/bitacora.txt | head -n1',
    ],
    teach: 'tail -n +N es "desde la línea N": el + invierte el papel de tail. La pareja tail -n +N | head -nM es la ventana de lectura clásica de logs gigantes.',
    cheatsheet: [
      { cmd: 'tail -n +12 f', desc: 'desde la línea 12' },
      { cmd: 'sed -n 12p f', desc: 'exactamente la 12' },
    ],
    keywords: ['tail', 'head', 'lineas'],
  }),
  mk('filtrado', 15, {
    title: 'El menor de todos',
    subtitle: 'sort -n sobre números',
    xp: 35, difficulty: 2,
    brief: 'cuenta.csv lista codigosnuméricos desordenados. La fila con el número más pequeño lleva la pieza.',
    goal: 'Ordena numéricamente /home/agent/cuenta.csv y muestra la primera fila (el menor).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Filtrado"
{
  echo "412 nota: nada aquí"
  echo "87 nota: nada aquí"
  echo "3 nota: $DOJO_FLAG"
  echo "1500 nota: nada aquí"
  echo "56 nota: nada aquí"
} > /home/agent/cuenta.csv
chown agent:agent /home/agent/cuenta.csv
chown -R agent:agent /home/agent`,
    solution: String.raw`sort -n /home/agent/cuenta.csv | head -n1`,
    hints: [
      'sort sin flags ordena LEXICOGRÁFICAMENTE: 1500 quedará antes que 87.',
      'sort -n compara la cabecera numérica de cada línea.',
      'sort -n /home/agent/cuenta.csv | head -n1',
    ],
    teach: 'sort -n ordena por valor numérico (sort -h entiende sufijos 2K/3M). Sin -n, "10" < "9": el bug clásico de los informes mal ordenados.',
    cheatsheet: [
      { cmd: 'sort -n f', desc: 'orden numérico' },
      { cmd: 'sort -u f', desc: 'ordenado y sin duplicados' },
    ],
    keywords: ['sort', 'numericos', 'head'],
  }),
  mk('filtrado', 16, {
    title: 'El eco repetido',
    subtitle: 'uniq -d: solo las repetidas',
    xp: 40, difficulty: 3,
    brief: 'visitas.log registra líneas sueltas. Una sola línea aparece repetida (dos veces) y esa esconde la pieza; todas las demás son únicas.',
    goal: 'Extrae la ÚNICA línea repetida de /home/agent/visitas.log.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Filtrado"
{
  echo "GET /inicio"
  echo "GET /mapa"
  echo "marca $DOJO_FLAG"
  echo "GET /contacto"
  echo "GET /torneo"
  echo "GET /docs"
  echo "GET /salida"
} > /home/agent/visitas.log
chown agent:agent /home/agent/visitas.log
chown -R agent:agent /home/agent`,
    solution: String.raw`sort /home/agent/visitas.log | uniq -d`,
    hints: [
      'uniq solo compara LÍNEAS ADYACENTES: primero sort, después uniq.',
      'uniq -d muestra únicamente las líneas que aparecen más de una vez.',
      'sort /home/agent/visitas.log | uniq -d',
    ],
    teach: 'uniq exige adyacencia: sort | uniq es la pareja inseparable. -d (duplicadas), -u (únicas) y -c (contar) cubren el 90 % de los análisis de logs rápidos.',
    cheatsheet: [
      { cmd: 'sort f | uniq -d', desc: 'líneas repetidas' },
      { cmd: 'sort f | uniq -c', desc: 'cuenta de cada línea' },
    ],
    keywords: ['uniq', 'sort', 'duplicados'],
  }),
  mk('filtrado', 17, {
    title: 'El dominio único',
    subtitle: 'cut -d@ + sort -u',
    xp: 40, difficulty: 3,
    brief: 'correo.txt lista direcciones del mismo proveedor… salvo una. Ese dominio único lleva la pieza en la propia dirección.',
    goal: 'Extrae los dominios (lo que va tras @) de /home/agent/correo.txt y muestra el que solo aparece una vez.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Filtrado"
{
  echo "ana@dojo-interno.test"
  echo "bruno@dojo-interno.test"
  echo "pieza@$DOJO_FLAG"
  echo "carla@dojo-interno.test"
  echo "diego@dojo-interno.test"
} > /home/agent/correo.txt
chown agent:agent /home/agent/correo.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cut -d@ -f2 /home/agent/correo.txt | sort -u | head -n1`,
    hints: [
      'cut -d@ -f2 corta por el separador @ y se queda con el segundo campo.',
      'sort -u deja solo los valores únicos; habrá exactamente uno.',
      'cut -d@ -f2 /home/agent/correo.txt | sort -u',
    ],
    teach: 'cut es el cortador de columnas por delimitador (-d) y por campo (-f); awk $2 hace lo mismo con más músculo. Para listas enormes, cut es más barato que awk.',
    cheatsheet: [
      { cmd: 'cut -d@ -f2 f', desc: 'campo tras el @' },
      { cmd: 'sort -u', desc: 'desduplicar' },
    ],
    keywords: ['cut', 'dominios', 'sort'],
  }),
  mk('filtrado', 18, {
    title: 'Espacios dobles',
    subtitle: 'tr -s: exprimir espacios',
    xp: 40, difficulty: 3,
    brief: 'folleto.txt tiene la pieza pixelada por espacios múltiples entre palabra y palabra. Al exprimirlos, la marca reaparece.',
    goal: 'Exprime los espacios (tr -s (squeeze) repetidos) de /home/agent/folleto.txt y extrae la marca con grep.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Filtrado"
printf 'El    folleto   del    dojo\ndeclara   que  la   pieza\nesta   marcada   como:   %s\nimporta   leer   con   calma\n' "$DOJO_FLAG" > /home/agent/folleto.txt
chown agent:agent /home/agent/folleto.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`tr -s ' ' < /home/agent/folleto.txt | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'tr -s " " sustituye cada racha de espacios por UNO solo (squeeze).',
      'Después grep -oE con la forma de la marca extrae solo el trozo importante.',
      "tr -s ' ' < /home/agent/folleto.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'tr -s exprime repeticiones (espacios, tabs, saltos): limpiar columnas desalineadas antes de cut/awk es su hora de gloria. tr NO acepta ficheros como argumento: redirige con <.',
    cheatsheet: [
      { cmd: "tr -s ' ' < f", desc: 'un espacio por racha' },
      { cmd: "tr 'a-z' 'A-Z' < f", desc: 'mayúsculas' },
    ],
    keywords: ['tr', 'squeeze', 'grep'],
  }),
];

export default [...fundamentos, ...filtrado];
