/**
 * datos del CHEATSHEET — fuente única, escrita a mano con rigor:
 * cada comando que aparece en las soluciones/setup de los 406 niveles,
 * cada flag que se usa (con su significado exacto) y ejemplos ejecutables.
 * Lo consume la página /cheatsheet (buscar → sección → fichas).
 */

export interface CsFlag {
  flag: string;
  detail: string;
}

export interface CsExample {
  cmd: string;
  explain: string;
  out?: string;
}

export interface CsCmd {
  cat: string;            // id de sección (SECTIONS.cat)
  name: string;
  tag: string;            // una frase de identidad
  what: string;           // qué hace y cuándo usarlo
  syntax: string;         // forma canónica
  flags: CsFlag[];
  examples: CsExample[];
  tips?: string[];
}

export interface CsSection {
  cat: string;            // id de categoría
  icon: string;
  title: string;
  blurb: string;
}

export const SECTIONS: CsSection[] = [
  { cat: 'files',   icon: '🧭', title: 'Navegación y ficheros',  blurb: 'moverse, copiar, inspeccionar metadatos y enlaces: la base de todo nivel' },
  { cat: 'read',    icon: '📖', title: 'Lectura y filtrado de texto', blurb: 'lo que entra por la terminal es texto: estas herramientas lo leen, cuentan, cortan y ordenan' },
  { cat: 'filter',  icon: '🧲', title: 'grep y la regex',        blurb: 'la herramienta más usada del dojo (169 apariciones): patrones, contextos y extracción' },
  { cat: 'sed',     icon: '✂️', title: 'sed: edición de streams', blurb: 'sustituir, borrar y transformar líneas sin abrir un editor' },
  { cat: 'awk',     icon: '📐', title: 'awk: campos y semántica', blurb: 'el mini-lenguaje de las columnas: filtros, totales, asociativos y END' },
  { cat: 'search',  icon: '🔎', title: 'find, xargs y tuberías', blurb: 'localizar ficheros y convertir salidas en acciones' },
  { cat: 'archive', icon: '📦', title: 'Empaquetar y comprimir', blurb: 'tar, gzip, zip y sus primos; y cómo remendar con diff/patch' },
  { cat: 'encode',  icon: '🔐', title: 'Hashes y codificación',  blurb: 'base64, hex, MD5/SHA-256 y cadenas dentro de binarios: capítulo forense' },
  { cat: 'perms',   icon: '🗝️', title: 'Permisos y usuarios',    blurb: 'chmod, chown, umask, sudo y cuentas: quién puede tocar qué' },
  { cat: 'proc',    icon: '⚙️', title: 'Procesos y sistema',     blurb: 'ps, kill, estados, límites y el disco: lo que vive en la máquina' },
  { cat: 'net',     icon: '🌐', title: 'Red y sockets',          blurb: 'ss, nc, curl y wget: hablar con puertos y HTTP sin salir del localhost' },
  { cat: 'dns',     icon: '📡', title: 'DNS real',               blurb: 'dig a fondo contra un dnsmasq local: tipos de registro, +short, PTR y resolución del sistema' },
  { cat: 'svc',     icon: '🛠️', title: 'Servicios y paquetería', blurb: 'sshd, nginx, apache2ctl, dpkg y librerías: configurar y validar como un sysadmin' },
  { cat: 'sql',     icon: '🗃️', title: 'SQLite y SQL',           blurb: 'sqlite3 y el lenguaje SQL: consultas, agregados, joins, fechas y transacciones' },
  { cat: 'shell',   icon: '📜', title: 'El shell: bash y sus builtins', blurb: 'variables, condicionales, bucles, funciones, traps y salida: escribir programas en una línea' },
  { cat: 'dojo',    icon: '⚔️', title: 'Comandos del propio dojo', blurb: 'las piezas que el bash-arena añade: submit, hint, goal y verificadores' },
];
export const RAW: CsCmd[] = [
/* ══════════════ files ══════════════ */
  {
    cat: 'files', name: 'cat', tag: 'vuelca ficheros al stdout',
    what: 'Lee uno o varios ficheros (o el stdin si no le das ninguno) y los imprime tal cual. Es el «abrir» por excelencia del shell: para inspeccionar, para alimentar una tubería o para concatenar ficheros (de ahí el nombre: conCATenar).',
    syntax: 'cat [opciones] [fichero…]',
    flags: [
      { flag: '-n', detail: 'numera TODAS las líneas de salida (incluidas las en blanco); ideal para citar «la línea 12»' },
      { flag: '-b', detail: 'como -n pero solo numera las líneas con contenido' },
      { flag: '-A', detail: 'muestra caracteres invisibles: $ al final de línea, ^I en cada tabulador' },
      { flag: '-s', detail: 'comprime ráfagas de líneas en blanco en una sola' },
    ],
    examples: [
      { cmd: 'cat /etc/hostname', explain: 'leer un fichero corto entero; la forma más directa de ver su contenido' },
      { cmd: 'cat -n auth.log | grep -i "failed"', explain: 'numerar antes de filtrar conserva los números originales de línea cuando citar una línea concreta' },
      { cmd: 'cat parte1.txt parte2.txt > completo.txt', explain: 'concatenación clásica: junta varios ficheros con redirección' },
      { cmd: 'cat', explain: 'sin argumentos lee el stdin: lo que escribes se re-eco al pulsar Enter; Ctrl+D para terminar (así se fabrican ficheros de golpe)' },
    ],
    tips: ['para ficheros GRANDES usa less o head/tail: cat a porrazo llena la pantalla sin control', 'cat no trata bien ficheros binarios: para eso mira xxd o strings'],
  },
  {
    cat: 'files', name: 'tac', tag: 'cat del revés, línea a línea',
    what: 'Imprime el fichero con las líneas en ORDEN INVERSO (la última primero). No confundir con rev, que invierte los caracteres DENTRO de cada línea. Útil para ver los eventos más recientes de un log sin tail.',
    syntax: 'tac [fichero]',
    flags: [
      { flag: '-s', detail: 'usa otra cadena como separador de registros en vez de \\n' },
    ],
    examples: [
      { cmd: 'tac access.log | head -n 20', explain: 'los últimos 20 registros del log, ordenados de más antiguo a más nuevo dentro de ese bloque' },
      { cmd: 'tac notas.txt', explain: 'leer al revés un texto corto para detectar la última línea añadida' },
    ],
  },
  {
    cat: 'files', name: 'rev', tag: 'invierte los caracteres de cada línea',
    what: 'Da la vuelta al CONTENIDO de cada línea («hola» → «aloh») pero deja el orden de las líneas intacto. Clásico de CTF para decodificar textos guardados a la inversa.',
    syntax: 'rev [fichero…]',
    flags: [
      { flag: '-0', detail: 'separa «líneas» por NUL en vez de \\n (para flujos binarios seguros)' },
    ],
    examples: [
      { cmd: 'echo "secreto" | rev', explain: 'invierte una cadena suelta', out: 'otercer' },
      { cmd: 'rev cifrado.txt', explain: 'un mensaje guardado al revés se lee directamente con rev' },
      { cmd: 'tac cifrado.txt | rev', explain: 'combo CTF: primero el orden de líneas, luego los caracteres; cada herramienta deshace su mitad' },
    ],
  },
  {
    cat: 'files', name: 'nl', tag: 'numera líneas como less -N',
    what: 'Escribe el fichero con sus líneas numeradas (por defecto solo las NO vacías). Es «cat -b» con formato: controla el ancho del número y el separador.',
    syntax: 'nl [opciones] [fichero]',
    flags: [
      { flag: '-b a', detail: 'numera también las líneas vacías' },
      { flag: '-w N', detail: 'ancho fijo del campo número (relleno con espacios)' },
      { flag: '-s SEP', detail: 'cadena entre el número y el contenido (por defecto un TAB)' },
    ],
    examples: [
      { cmd: 'nl script.sh', explain: 'ver un script con números para discutir «la línea 7» en un error de sintaxis' },
      { cmd: 'nl -ba conf.txt | tail -n 5', explain: 'las 5 últimas líneas conservando la numeración global del fichero' },
    ],
  },
  {
    cat: 'files', name: 'ls', tag: 'lista directorios',
    what: 'Muestra el contenido de un directorio. Con -l ves los METADATOS: permisos, enlaces duros, dueño, tamaño y fecha. Es el primer comando de casi cualquier sesión y también el primer examen de permisos.',
    syntax: 'ls [opciones] [ruta…]',
    flags: [
      { flag: '-l', detail: 'formato largo: permisos, nº de enlaces duros, dueño, grupo, tamaño y fecha por fichero' },
      { flag: '-a', detail: 'incluye los ocultos (.nombre): el .bashrc, el .git…' },
      { flag: '-h', detail: 'tamaños humanamente legibles (K, M, G) junto a -l' },
      { flag: '-S', detail: 'ordena por TAMAÑO descendentemente' },
      { flag: '-t', detail: 'ordena por fecha de modificación, lo más nuevo primero' },
      { flag: '-r', detail: 'invierte CUALQUIER orden activado (con -S o -t da el menor primero)' },
      { flag: '-R', detail: 'recursivo: entra y lista subdirectorios' },
      { flag: '-i', detail: 'añade el inode: dos ficheros con MISMO inode son el mismo dato (enlace duro)' },
    ],
    examples: [
      { cmd: 'ls -lah', explain: 'la combinación diaria: largo, con ocultos y tamaños legibles' },
      { cmd: 'ls -lt | head -n 4', explain: 'los 3 ficheros modificados más recientemente' },
      { cmd: 'ls -li es1 es2', explain: 'compara inodes para saber si dos rutas son el mismo fichero físico; si sale el mismo hash de inode: enlaces duros' },
      { cmd: 'ls -l | grep "^d"', explain: 'solo directorios: su línea larga empieza por d' },
    ],
  },
  {
    cat: 'files', name: 'cd', tag: 'cambia de directorio (builtin)',
    what: 'Comando INTERNO de bash (no es un binario): cambia tu directorio de trabajo actual. La ruta absoluta empieza por /, la relativa desde donde estés; ~ es tu home, .. el nivel superior, - el anterior.',
    syntax: 'cd [ruta]',
    flags: [
      { flag: '-', detail: 'vuelve al directorio ANTERIOR y lo imprime (exporta PWD y OLDPWD)' },
      { flag: '~', detail: 'atajo a tu home (/root para root, /home/agent para agent)' },
    ],
    examples: [
      { cmd: 'cd /var/log && pwd', explain: 'entra y verifica en el mismo paso; pwd imprime la ruta absoluta actual' },
      { cmd: 'cd -', explain: 'saltar entre dos directorios como un ping-pong' },
    ],
    tips: ['cd solo (sin argumentos) también va a home'],
  },
  {
    cat: 'files', name: 'pwd', tag: 'imprime tu ruta actual',
    what: 'Print Working Directory: te dice la ruta absoluta en la que estás. Pequeño pero vital: mucho error de «fichero no encontrado» es estar donde no crees estar.',
    syntax: 'pwd [-P]',
    flags: [
      { flag: '-P', detail: 'resuelve enlaces simbólicos: te da la ruta FÍSICA real, no la simbólica de la variable PWD' },
    ],
    examples: [
      { cmd: 'pwd', explain: 'saber exactamente dónde estás antes de crear/borrar nada' },
      { cmd: 'cd /tmp/lanzadera && pwd && ls', explain: 'el trío de comprobación: dónde estoy, qué hay' },
    ],
  },
  {
    cat: 'files', name: 'cp', tag: 'copia ficheros y directorios',
    what: 'Copia ficheros (cp origen destino) o varios orígenes a un directorio. Para directorios completos NECESITA -r/-a: sin ello se queja de que «omitiendo directorios».',
    syntax: 'cp [opciones] origen… destino',
    flags: [
      { flag: '-r', detail: 'recursivo: copia directorios y su contenido' },
      { flag: '-p', detail: 'preserva permisos, dueño y timestamps (probar sin -p: pierdes los mtime originales)' },
      { flag: '-a', detail: 'archivo: -r + -p + conservar enlaces simbólicos tal cual; la mejor copia fiel' },
      { flag: '-i', detail: 'pregunta antes de sobrescribir; -f (por defecto no) sobrescribe sin preguntar' },
      { flag: '-n', detail: 'nunca sobrescribe: si el destino existe, se pasa' },
      { flag: '-v', detail: 'imprime lo que copia, útil para auditar' },
    ],
    examples: [
      { cmd: 'cp /etc/ssh/sshd_config /tmp/backup_sshd.conf', explain: 'copia de seguridad antes de tocar una config del sistema' },
      { cmd: 'cp -a /var/dojo/. /tmp/dojo-clone/', explain: 'clonado fiel de un directorio con sus permisos y enlaces' },
      { cmd: 'cp -ni mis-datos.txt /tmp/', explain: 'copia sin riesgo de pisar un fichero que ya exista' },
    ],
  },
  {
    cat: 'files', name: 'mv', tag: 'mueve o renombra',
    what: 'Mueve ficheros entre directorios o les cambia el nombre: en la misma partición es instantáneo (solo renombra la entrada del directorio). No requiere -r para directorios: mueve el bloque entero por definición.',
    syntax: 'mv [opciones] origen… destino',
    flags: [
      { flag: '-i', detail: 'pregunta antes de sobrescribir' },
      { flag: '-n', detail: 'nunca sobrescribe' },
      { flag: '-v', detail: 'muestra cada movimiento' },
      { flag: '-f', detail: 'sobrescribe sin preguntar ni avisar' },
    ],
    examples: [
      { cmd: 'mv informe.txt final.txt', explain: 'renombrar: mismo directorio, otro nombre' },
      { cmd: 'mv *.log /var/archivo/', explain: 'mover un glob (todos los .log) a otro lugar' },
      { cmd: 'mv -n datos.tsv backup/datos.tsv', explain: 'mover solo si el destino está libre' },
    ],
    tips: ['mv no borra el origen: lo saca de ahí. Es el mismo dato en otra ruta'],
  },
  {
    cat: 'files', name: 'rm', tag: 'borra ficheros (¡irrecuperable!)',
    what: 'Elimina ficheros y, con -r, directorios enteros. NO pasa por la papelera: lo borrado se ha ido. El clásico rm -rf es el comando más peligroso del shell: comprueba dos veces la ruta.',
    syntax: 'rm [opciones] fichero…',
    flags: [
      { flag: '-r', detail: 'recursivo: borra directorios con TODO su contenido, incluidos los niveles anidados' },
      { flag: '-f', detail: 'fuerza: ignora ficheros inexistentes y no pregunta' },
      { flag: '-i', detail: 'pide confirmación por fichero' },
      { flag: '-d', detail: 'borra directorios VACÍOS (sin necesitar -r)' },
    ],
    examples: [
      { cmd: 'rm tmp/*.tmp', explain: 'borrar por patrón de nombre' },
      { cmd: 'rm -frv /tmp/sesion-kali', explain: 'borrar un directorio con contenido, verificando en verboso lo que se va' },
      { cmd: 'rm -- -archivo-raro', explain: 'borra un fichero que empieza por guion: el -- corta la lectura de opciones' },
    ],
  },
  {
    cat: 'files', name: 'mkdir', tag: 'crea directorios',
    what: 'Crea uno o varios directorios. Sin -p solo crea el último nivel y falla si el padre no existe; con -p crea TODA la cadena de un tirón y no se queja si ya existe (idempotente: ideal en scripts de setup).',
    syntax: 'mkdir [opciones] dir…',
    flags: [
      { flag: '-p', detail: 'crea los niveles intermedios que falten y NO da error si ya existe — siempre en scripts' },
      { flag: '-m MODE', detail: 'asigna permisos al crearlo (p. ej. -m 0755)' },
      { flag: '-v', detail: 'imprime cada creación' },
    ],
    examples: [
      { cmd: 'mkdir -pv cache/logs/2026', explain: 'crea la jerarquía entera mostrando lo creado' },
      { cmd: 'mkdir -p /var/dojo && chmod 755 /var/dojo', explain: 'patrón setup: asegurar el directorio y luego ajustar permisos' },
    ],
  },
  {
    cat: 'files', name: 'touch', tag: 'crea ficheros vacíos o actualiza timestamps',
    what: 'Si el fichero no existe, lo crea vacío. Si existe, actualiza su fecha de modificación (mtime) — útil para forzar reconstrucciones en make o para los CTF de «¿cuándo se tocó este fichero?».',
    syntax: 'touch [opciones] fichero…',
    flags: [
      { flag: '-c', detail: 'NO crea el fichero si no existe (solo toca timestamps de los existentes)' },
      { flag: '-t', detail: 'fija la fecha explícitamente (formato AAAAmmddhhmm.ss)' },
      { flag: '-r REF', detail: 'copia los timestamps de OTRO fichero de referencia' },
    ],
    examples: [
      { cmd: 'touch notas.txt', explain: 'el fichero más rápido que se puede crear' },
      { cmd: 'touch -r original.txt copia.txt', explain: 'haz que la copia parezca tan vieja como el original (reloj forense)' },
    ],
  },
  {
    cat: 'files', name: 'ln', tag: 'enlaces duros y simbólicos',
    what: 'Crea enlaces. El DURO (por defecto) apunta al INODE: es otro nombre para el mismo dato, sobrevive si se borra el original y no cruza particiones. El SIMBÓLICO (-s) es un fichero que guarda una RUTA: cruza todo lo que quieras pero se rompe si la ruta desaparece.',
    syntax: 'ln [-s] objetivo nombre_del_enlace',
    flags: [
      { flag: '-s', detail: 'enlace simbólico (atajo que guarda la RUTA, no los datos)' },
      { flag: '-f', detail: 'sobrescribe el enlace si ya existe' },
      { flag: '-v', detail: 'imprime lo que enlaza' },
    ],
    examples: [
      { cmd: 'ln -s /var/log/auth.log atajo.log', explain: 'atajo simbólico: si le borran el original, es dangling — te dice «fichero o directorio inexistente»' },
      { cmd: 'ln /data/oro.txt oro_h.txt', explain: 'enlace duro: mismo inode; si borras uno, los datos viven en el otro' },
      { cmd: 'ls -li oro.txt oro_h.txt', explain: 'verificación: mismo número de inode ⇒ mismo fichero físico' },
    ],
  },
  {
    cat: 'files', name: 'stat', tag: 'metadatos de un fichero',
    what: 'Muestra TODO lo que el kernel sabe de un fichero: permisos octal y simbólico, inode, dueño/grupo, las tres fechas (acceso, modificación, cambio) y tamaño. Más riguroso que ls -l.',
    syntax: 'stat [opciones] fichero…',
    flags: [
      { flag: '-c %a', detail: 'imprime SOLO los permisos en octal (755, 644…): perfecto para comparar en scripts' },
      { flag: '-c %U %G', detail: 'dueño y grupo del fichero' },
      { flag: '-c %s', detail: 'solo el tamaño en bytes' },
      { flag: '-c %y', detail: 'solo el mtime legible por humanos' },
    ],
    examples: [
      { cmd: 'stat -c "%a %U:%G %n" /usr/local/bin/*', explain: 'tabla de permisos/dueño de todos los binarios locales — clásico de auditoría' },
      { cmd: 'stat notas.txt', explain: 'vistazo completo: las tres fechas (atime, mtime, ctime) cuentan una historia forense' },
      { cmd: 'test "$(stat -c %a run.sh)" = 755', explain: 'condición de script: «¿son 755 sus permisos?»' },
    ],
  },
  {
    cat: 'files', name: 'file', tag: 'adivina el TIPO real de un fichero',
    what: 'Mirando su cabecera mágica (no la extensión) dice qué ES: texto, PNG, fichero tar, ejecutable ELF que enlaza dinámicamente… Si alguien renombra un zip a .txt, file lo delata.',
    syntax: 'file fichero…',
    flags: [
      { flag: '-b', detail: 'breve: sin el nombre delante de la descripción' },
      { flag: '-i', detail: 'formato MIME (text/plain, image/png…)' },
      { flag: '-z', detail: 'entra también en los ficheros COMPRIMIDOS y dice su contenido' },
    ],
    examples: [
      { cmd: 'file desconocido.bin', explain: 'descubrir el tipo real antes de decidir cómo abrirlo' },
      { cmd: 'file -z oculto.gz', explain: 'el .gz puede contener otro formato; file -z mira dentro y lo dice' },
      { cmd: 'file *', explain: 'clasificar TODO el directorio de golpe (buen panorama forense)' },
    ],
  },
  {
    cat: 'files', name: 'which', tag: 'dónde está el binario de un comando',
    what: 'Recorre tu PATH y te dice la PRIMERA ruta del ejecutable que se lanzará al escribir ese comando. Para saber si un comando existe, dónde está, o por qué se ejecuta «el otro» ffmpeg.',
    syntax: 'which comando…',
    flags: [
      { flag: '-a', detail: 'todas las coincidencias del PATH, no solo la primera' },
    ],
    examples: [
      { cmd: 'which python3', explain: 'comprueba el intérprete concreto que se usará' },
      { cmd: 'which -a node', explain: 'enumera TODOS los node visibles en el PATH (depurar conflictos de instalaciones)' },
    ],
  },
/* ══════════════ read ══════════════ */
  {
    cat: 'read', name: 'head', tag: 'las primeras líneas',
    what: 'Imprime los primeros N registros de un fichero o flujo (10 por defecto). Con varios ficheros imprime una cabecera «==> fichero <==» por cada uno y sigue en orden.',
    syntax: 'head [-n N] [fichero…]',
    flags: [
      { flag: '-n N', detail: 'exactamente N LÍNEAS (admite números negativos: todas salvo las últimas N)' },
      { flag: '-c N', detail: 'los primeros N BYTES, no líneas (útil con datos binarios o líneas larguísimas)' },
      { flag: '-q', detail: 'silencia las cabeceras ==> fichero <== cuando hay varios ficheros' },
    ],
    examples: [
      { cmd: 'head access.log', explain: 'los 10 primeros registros: el arranque del acontecimiento' },
      { cmd: 'head -n 50 script.sh', explain: 'leer solo el comienzo de un fichero largo' },
      { cmd: 'who | head -n 1', explain: 'toma de tubería: primera línea de una salida viva' },
      { cmd: 'ps aux | head -n -1', explain: 'truco negativo: toda la salida salvo la línea de cabecera de ps' },
    ],
  },
  {
    cat: 'read', name: 'tail', tag: 'las últimas líneas (sigue ficheros en vivo)',
    what: 'Los últimos N registros de un fichero o flujo — y, con -f («follow»), SIGUE creciendo: la herramienta definitiva de logs. Con -F reabre el fichero si lo rotan (auth.log → auth.log.1).',
    syntax: 'tail [-n N | -f] [fichero]',
    flags: [
      { flag: '-n N', detail: 'las últimas N líneas (igual que head: admite +N, desde la línea N en adelante)' },
      { flag: '-f', detail: 'follow: imprime y no termina; SIGUE el fichero más allá del final línea a línea. ¡Ctrl+C para salir!' },
      { flag: '-F', detail: 'como -f pero además REABRE si el fichero es reemplazado por rotación (logrotate)' },
      { flag: '-c N', detail: 'últimos N bytes' },
    ],
    examples: [
      { cmd: 'tail -n 20 auth.log', explain: 'lo ÚLTIMO que pasó en el sistema — el final es lo que suele importar' },
      { cmd: 'tail -f /var/log/auth.log', explain: 'stream en vivo del log: escribe el comando y, en otra terminal, provoca eventos para verlos aparecer' },
      { cmd: 'command | tail -n 1', explain: 'clásico de pipelines: quedarse con la ÚLTIMA línea (el resultado total de un sumador)' },
    ],
  },
  {
    cat: 'read', name: 'wc', tag: 'cuenta: líneas, palabras y bytes',
    what: 'Word Count: con un fichero imprime «líneas palabras bytes». Para preguntar «¿cuántas?» a cualquier flujo es el estándar: cuántas líneas matchea un grep, cuántos ficheros hay en un listado, cuánto pesa una respuesta curl.',
    syntax: 'wc [-lwc] [fichero…]',
    flags: [
      { flag: '-l', detail: 'solo LÍNEAS (lo más pedido: «¿cuántos logins fallidos hay?»)' },
      { flag: '-w', detail: 'solo PALABRAS (contenido separado por blancos)' },
      { flag: '-c', detail: 'solo BYTES; -m en su lugar cuenta caracteres según la codificación' },
    ],
    examples: [
      { cmd: 'grep -c root /etc/passwd', explain: 'contar directo en el grep; wc -l a continuación sería la otra vía, pasando por pipeline' },
      { cmd: 'wc -l access.log', explain: 'tamaño del log en líneas (chequeo de volumen)' },
      { cmd: 'cat promedio | wc -w', explain: 'en tubería: palabras de un texto, sin ficheros intermedios' },
    ],
  },
  {
    cat: 'read', name: 'cut', tag: 'corta columnas de texto',
    what: 'De cada línea selecciona por DELIMITADOR (-d + -f campos) o por POSICIÓN/RANGO de caracteres y bytes (-c y -b). Es el abrelatas básico de CSV simples, /etc/passwd y columnas fijas.',
    syntax: 'cut [-d DELIM -f LISTA | -c LISTA] [fichero…]',
    flags: [
      { flag: '-d X', detail: 'delimitador de campo: -d: para dos puntos, -d, para coma, -d" " para espacio…; por defecto es TAB' },
      { flag: '-f N', detail: 'campo(s) a conservar: -f1 el primero, -f2,4 varios, -f2-5 un rango, -f3- desde el 3.º hasta el final' },
      { flag: '-c R', detail: 'por CARACTERES: -c1-8 los primeros 8; -c10-15 un rango; -c-5 los cinco primeros' },
      { flag: '-b R', detail: 'por BYTES (con UTF-8 difieren de -c si hay acentos/emojis)' },
      { flag: '-s', detail: 'suprime las líneas que NO contienen el delimitador (por defecto las pasa intactas)' },
      { flag: '--output-delimiter=X', detail: 'imprime los campos separados por X en vez del delimitador de entrada' },
    ],
    examples: [
      { cmd: 'cut -d: -f1 /etc/passwd', explain: 'solo los USUARIOS (1.º campo junto a los dos puntos): la lista limpia de cuentas del sistema', out: 'root\nagent\n...' },
      { cmd: 'cut -d: -f1,7 /etc/passwd', explain: 'usuario Y shell: f2 es el campo de la contraseña (x — vive cifrada en /etc/shadow)' },
      { cmd: 'echo "hola mundo cruel" | cut -d" " -f2', explain: 'segunda palabra de una frase', out: 'mundo' },
      { cmd: 'cut -c1-10 access.log | sort | uniq -c', explain: 'histograma de IPs (si están al frente) — patrón clásico de top de direcciones' },
    ],
    tips: ['para campos de ancho VARIABLE usa awk (los espacios múltiples le dan igual); cut se lleva mejor con separadores estables como : o ,'],
  },
  {
    cat: 'read', name: 'paste', tag: 'une líneas en columnas',
    what: 'Herramienta inversa de cut: toma líneas de uno o varios ficheros y las INTERCALA lado a lado separadas por TAB (o por el delimitador que digas). Con - lee del stdin en lugar de un fichero.',
    syntax: 'paste [-d LISTA] [-] [fichero…]',
    flags: [
      { flag: '-d X', detail: 'delimitador entre columnas; con múltiples caracteres, itera uno por línea' },
      { flag: '-s', detail: 'seriado: une TODAS las líneas de un fichero en UNA sola, en secuencia' },
    ],
    examples: [
      { cmd: 'paste usuarios.txt uids.txt', explain: 'dos listas que van emparejadas, en dos columnas' },
      { cmd: 'paste -d, <(echo l1) <(echo c1)', explain: 'process substitution como ficheros: columnas fabricadas al vuelo' },
      { cmd: 'paste -sd+ nums.txt | bc', explain: 'SUMAR una columna: «paste -sd+» convierte una columna de números en «1+2+3» y bc hace la suma — idiom del shell' },
    ],
  },
  {
    cat: 'read', name: 'sort', tag: 'ordena líneas',
    what: 'Ordena lexicográficamente por defecto. Con -n ordena NUMÉRICAMENTE (¡sin esto, 20 sale antes que 3!), con -k eliges por qué columna, y sus combinaciones son la mitad del arsenal de rankings.',
    syntax: 'sort [opciones] [fichero…]',
    flags: [
      { flag: '-n', detail: 'orden NUMÉRICO: interpreta el campo como número (imprescindible para cifras)' },
      { flag: '-r', detail: 'inverso (descendente): «los 10 más grandes» ⇒ sort -nr con uniq -c' },
      { flag: '-k N', detail: 'ordena por la columna N (campos separados por blancos; -k2,2 delimita el campo exacto)' },
      { flag: '-t X', detail: 'carácter delimitador de campos (como el -d de cut)' },
      { flag: '-u', detail: 'únicos: elimina duplicados tras ordenar (sort -u = sort | uniq)' },
      { flag: '-h', detail: 'orden HUMANAMENTE legible: entiende K, M, G desde du -h / df -h' },
      { flag: '-f', detail: 'ignora mayúsculas/minúsculas al comparar' },
    ],
    examples: [
      { cmd: 'sort nombres.txt', explain: 'orden alfabético simple' },
      { cmd: 'sort -k2 -n stats.tsv', explain: 'ordenar por la 2.ª columna numéricamente' },
      { cmd: 'sort -h du.txt', explain: 'ordenar tamaños "1.5G", "300M", "8K" — sin -h sale desordenado alfabéticamente' },
      { cmd: 'cut -d: -f3 /etc/passwd | sort -n | tail -1', explain: 'el UID más grande del sistema: columna extraída, orden numérico, máximo' },
    ],
  },
  {
    cat: 'read', name: 'uniq', tag: 'comprime duplicados adyacentes',
    what: 'Recorre las líneas y las IGUALES a la anterior las colapsa en una (con -c las cuenta). Por eso la alianza eterna sort | uniq: uniq NO ve duplicados que no están seguidos.',
    syntax: 'uniq [opciones] [entrada] [salida]',
    flags: [
      { flag: '-c', detail: 'prefija cada línea con el NÚMERO de repeticiones: la gran ganancia junto a sort' },
      { flag: '-d', detail: 'imprime SOLO las que se repiten (una vez por grupo)' },
      { flag: '-u', detail: 'imprime SOLO las que NO se repiten nunca' },
      { flag: '-i', detail: 'compara sin distinguir mayúsculas' },
      { flag: '-w N', detail: 'solo compara los N primeros caracteres de cada línea' },
    ],
    examples: [
      { cmd: 'sort access.log | uniq -c | sort -nr | head -3', explain: 'top 3 de líneas MÁS repetidas: sort → agrupa → cuenta → reordena numerado — el bigram de rankings', out: '   2103 10.0.0.1 ...\n    990 10.0.0.7 ...\n    120 10.0.0.2 ...' },
      { cmd: 'uniq -d palabras.txt', explain: 'solo las palabras que aparecen 2+ veces CONSECUTIVAS (precede un sort si NO son contiguas)' },
      { cmd: 'grep root /etc/passwd | cut -d: -f7 | sort -u', explain: '«¿qué shells usan las cuentas root?»: shells distintas, sin duplicados' },
    ],
    tips: ['uniq -c antepone ESPACIOS antes del número; para ordenar bien numéricamente usa sort -nr (el -n ignora espacios)'],
  },
  {
    cat: 'read', name: 'comm', tag: 'compara DOS ficheros ordenados',
    what: 'Con las dos entradas YA ORDENADAS, imprime en 3 columnas: solo del fichero 1, solo del fichero 2, y en ambos. Es la «diferencia de conjuntos» del shell: quién falta en la nueva versión de la lista.',
    syntax: 'comm [-123] fichero1 fichero2',
    flags: [
      { flag: '-1', detail: 'esconde la columna 1 (solo fichero 1)' },
      { flag: '-2', detail: 'esconde la columna 2 (solo fichero 2)' },
      { flag: '-3', detail: 'esconde la columna 3 (común a ambos)' },
      { flag: '-23', detail: 'combo habitual: SOLO LO COMÚN, las líneas que están en los dos' },
    ],
    examples: [
      { cmd: 'comm -23 viejos.txt nuevos.txt', explain: 'lo que estaba en viejos pero ya NO en nuevos: bajas' },
      { cmd: 'comm -12 aorden.txt borderden.txt', explain: 'intersección: lo presente en ambos' },
      { cmd: 'diff <(sort a.txt) <(sort b.txt)', explain: 'si NO tienes los ficheros ordenados, usa diff + process substitution para comparar y ver DÓNDE difieren' },
    ],
  },
  {
    cat: 'read', name: 'tr', tag: 'traduce o borra caracteres',
    what: 'Character translate: lee del stdin y reemplaza/borra/compacta CARACTERES (no cadenas ni regex). Clásicos: ROT13, borrar el \\r de Windows, comprimir espacios repetidos.',
    syntax: 'tr [opciones] CONJUNTO1 [CONJUNTO2]',
    flags: [
      { flag: "'a-z' 'A-Z'", detail: 'rangos: la sintaxis de conjuntos traduce todas las minúsculas a mayúsculas' },
      { flag: '-d', detail: 'BORRA los caracteres del conjunto (tr -d "\\n" quita TODOS los saltos de línea)' },
      { flag: '-s', detail: 'squeeze: compacta repeticiones CONSECUTIVAS del último conjunto en una sola' },
      { flag: '-c', detail: 'complemento: actúa sobre los caracteres NO incluidos en el conjunto' },
    ],
    examples: [
      { cmd: 'echo hola | tr a-z A-Z', explain: 'a mayúsculas: rango completo de la minúscula', out: 'HOLA' },
      { cmd: 'echo URYYB | tr A-Za-z N-ZA-Mn-za-m', explain: 'ROT13: el turno de 13 letras clásico de CTF — se le aplica de nuevo y se descifra', out: 'HELLO' },
      { cmd: 'tr -d "\\r" < windows.txt > unix.txt', explain: 'quita los \\r de los ficheros con finales CRLF de Windows' },
      { cmd: 'tr -s "\\n" < texto.txt', explain: 'comprime BLANCOS repetidos: aquí, varios saltos de línea consecutivos se quedan en uno' },
    ],
    tips: ['tr trabaja SOLO con stdin (no acepta fichero como argumento: usa < fichero)'],
  },
/* ══════════════ filter (grep) ══════════════ */
  {
    cat: 'filter', name: 'grep', tag: 'busca patrones en texto',
    what: 'Imprime las líneas que COINCIDEN con un patrón (BRE por defecto; -E para regex extendida, -F para literal). Es EL comando del dojo y del mundo: filtrar logs, encontrar código, contar coincidencias, extraer solo lo que interesa con -o.',
    syntax: 'grep [opciones] PATRÓN [fichero…]',
    flags: [
      { flag: '-i', detail: 'IGNORE case: insensible a mayúsculas/minúsculas (FAIL, Fail y fail son lo mismo)' },
      { flag: '-v', detail: 'INVERTIR: imprime las líneas que NO coinciden (excluir, filtrar ruido)' },
      { flag: '-n', detail: 'numera las líneas: saber DÓNDE está la coincidencia dentro del fichero o flujo' },
      { flag: '-o', detail: 'solo la PARTE coincidente, una por línea: extraer IPs, tokens, emails de un texto libre' },
      { flag: '-E', detail: 'regex extendida (ERE): habilita +, ?, |, (…) sin backslashes (egrep histórico)' },
      { flag: '-F', detail: 'patrón LITERAL: nada de regex; rápido y seguro para cadenas con puntos/guiones raros' },
      { flag: '-r', detail: 'recursivo: entra en directorios buscando por todos los ficheros' },
      { flag: '-w', detail: 'palabra completa: el match debe estar rodeado de límites de palabra (grep -w ok: no pescará dentro de "token")' },
      { flag: '-x', detail: 'exhaustivo: la línea ENTERA tiene que ser el patrón (equivale a anclar ^…$)' },
      { flag: '-c', detail: 'no imprime líneas: dice CUÁNTAS coincidencias hay (por fichero)' },
      { flag: '-q', detail: 'quiet: no imprime NADA, solo pone el exit (0 hubo, 1 no hubo) — perfecto para IF de scripts' },
      { flag: '-l', detail: 'imprime solo los NOMBRES de fichero con coincidencia (uno por línea, una vez por fichero)' },
      { flag: '-L', detail: 'lo contrario de -l: los nombres de fichero que NO tienen ninguna coincidencia' },
      { flag: '-A N', detail: 'After: imprime N líneas DESPUÉS de cada match (contexto posterior)' },
      { flag: '-B N', detail: 'Before: N líneas ANTES de cada match' },
      { flag: '-C N', detail: 'Context: N líneas antes y después (equivalente a -A N -B N juntos)' },
      { flag: '-m N', detail: 'MAX MATCH: para tras N coincidencias (las PRIMERAS N, luego corta)' },
      { flag: '-f FICH', detail: 'lee los patrones de FICH, uno por línea (bombardear un texto con una lista de IPs)' },
      { flag: '--include=GLOB', detail: 'en modo recursivo, examina solo ficheros cuyo nombre encaje (p. ej. --include="*.conf")' },
      { flag: '--exclude=GLOB', detail: 'en recursivo, salta los ficheros cuyo nombre encaje con el patrón dado' },
      { flag: '--color=always', detail: 'pinta los matches; en tuberías suele perderse el color: la opción de terminal es alias grep="grep --color=auto"' },
    ],
    examples: [
      { cmd: 'grep -i "failed password" /var/log/auth.log', explain: 'el clásico: intentos de acceso fallidos, mayúsculas dan igual' },
      { cmd: 'grep -oE "([0-9]{1,3}\\.){3}[0-9]{1,3}" access.log | sort | uniq -c | sort -nr | head -5', explain: 'extracción de IPs ERE + ranking: la receta top-autores de logs', out: '   2103 10.0.0.1\n    990 10.0.0.7\n    450 10.0.0.2\n    120 10.0.0.9\n     87 10.0.0.4' },
      { cmd: 'grep -v "^#" -e "^$" conf.txt', explain: 'config limpia: sin comentarios Y sin líneas en blanco (dos -e o un -v por pipeline)' },
      { cmd: 'grep -rn --include="*.conf" "Listen 80" /etc/', explain: 'búsqueda recursiva de una directiva solo en *.conf — el método del auditor' },
      { cmd: 'grep -A2 "hora: inicio" cronologia.txt', explain: 'contexto: el match y las 2 líneas siguientes (el bloque posterior)' },
      { cmd: 'grep -q "sig" canal.txt && echo "firmado"', explain: 'grep -q como condición del bash: exit 0/1 sin ensuciar la salida' },
      { cmd: 'grep -x "T501" claves.txt', explain: 'solo líneas EXACTAMENTE "T501", no «T501X» ni derivados' },
    ],
    tips: ['con regex, cuanta menos ambigüedad mejor: en BRE \\{ y otros significan otra cosa — usa grep -E para + ? | y grupos', 'grep sobre un flujo binario (gzip, tar, /bin/…) dice «Binary file matches»; para ver las líneas usa -a o pásalo antes por zcat'],
  },
  {
    cat: 'filter', name: 'egrep / fgrep', tag: 'nombres históricos',
    what: 'egrep era «grep -E» (regex extendida) y fgrep «grep -F» (literal). Hoy existen como alias deprecated: usa grep -E / grep -F, que funcionan igual en todas partes y no dan avisos.',
    syntax: '(usar grep -E / grep -F)',
    flags: [],
    examples: [
      { cmd: 'grep -E "cat|dog|bird" animales.txt', explain: 'la forma moderna de alternancia — era el main show de egrep' },
    ],
  },

  {
    cat: 'filter', name: 'grep: auditoría y catálogo', tag: 'contar, localizar y regresar (ronda 6)',
    what: 'El segundo idioma de grep: métrica (-c por fichero + ranking), localización (-l) y REGRESO (cat del fichero ganador), listas de patrones (-f) en modo literal (-Ff), barrido de árboles filtrado (-r --include) y contextos asimétricos. Del «dónde está» al «qué contiene».',
    syntax: 'grep [-cwlF] [-A N] [-B M] [-f lista] [--include glob] [ficheros…] ',
    flags: [
      { flag: '-c', detail: 'por VARIOS ficheros imprime "fichero:conteo": la base del ranking con sort -t: -k2 -nr | head -1' },
      { flag: '-l', detail: 'solo el NOMBRE del fichero que casa: f=$(grep -l p dir/*); cat "$f" localiza y muestra el fichero — el «regreso»' },
      { flag: '-f LISTA', detail: 'patrones desde un FICHERO (uno por línea): lista negra/marcas en el instante; con -F los patrones son LITERALES' },
      { flag: '-Ff', detail: 'frases con metacaracteres ([ ], (*), $) como patrones LITERALES desde fichero: la plantilla EXACTA de la auditoria' },
      { flag: '-r --include', detail: 'barrido recursivo limitado a los ficheros que encajen en el glob (solo *.log, yaml…)' },
      { flag: '-h', detail: 'en multi-fichero SUPRIME el prefijo "fichero:" → un único stream limpio para pipes' },
      { flag: '-w', detail: 'coincidencia de PALABRA COMPLETA: «fallo» no casa ni «fallos» ni «fallo2026» (sin regex ruidosa)' },
      { flag: '-x', detail: 'el patrón debe EQUALDAR la línea ENTERA: recorta a la línea única entre variantes' },
      { flag: '-B N -A M', detail: 'contexto ASIMÉTRICO (N antes, M después): el mapa real del incidente, no la simetría de -C' },
      { flag: '-oE', detail: 'extracción de tokens: IP/domain/referencia como fragmento suelto + sort | uniq -c para el dominante' },
    ],
    examples: [
      { cmd: 'grep -c FALLA logs/* | sort -t: -k2 -nr | head -1', explain: 'BALANZA entre ficheros: ¿cuál acumula más fallos? (grep-l68 boss, paso 1)' },
      { cmd: 'grep FAIL "$f" | grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" | sort | uniq -c | sort -nr | head -1', explain: 'IP DOMINANTE dentro del fichero ganador: extracción + conteo (paso 2)' },
      { cmd: 'grep "ip $ip" "$f" | grep OK', explain: 'REGRESO: la única conexón OK del atacante — ahí viaja la flag (paso 3)' },
      { cmd: 'f=$(grep -l sello sombras/*); cat "$f"', explain: 'el fichero ÚNICO marcado: -l localiza, cat devuelve el contenido' },
      { cmd: 'grep -Ff plantilla.txt flujo.log', explain: 'LITERAL + LISTA: las frases de la plantilla chocan tal cual, sin que la regex destroce [ ] (*), $' },
      { cmd: 'grep -r --include "*.log" sello pool/', explain: 'árbol entero pero SOLO los .log: el TXT/YAML queda fuera de la pasada' },
      { cmd: 'grep -E "^[0-9]+.*cierre de sesión$" bitacora.log', explain: 'DOBLE ANCLA: empieza por dígitos Y termina en el texto — validación de esquema por línea' },
      { cmd: 'grep -w fallo acciones.txt', explain: 'la palabra completa: ni fallos ni fallo2026', },
    ],
    tips: ['-c sobre MÚLTIPLES ficheros produce «fichero:conteo»: ese formato ES el input del ranking; sobre un solo fichero solo imprime el número', '-oE es SELECTIVo: lo que imprime es solo el fragmento casado, no la línea — perfecto para uniq -c'],
  },

/* ══════════════ sed ══════════════ */
  {
    cat: 'sed', name: 'sed', tag: 'editor de streams en línea',
    what: 'Stream EDitor: recorre el texto LÍNEA A LÍNEA aplicando comandos (s sustituir, d borrar, p imprimir…). No toca el fichero original salvo con -i. Para reemplazos en config, CSV masivo y transcodificaciones rápidas.',
    syntax: 'sed [-e CMD…] [-i] [EXPRESIÓN] [fichero…]',
    flags: [
      { flag: 's/ANTES/DESPUÉS/', detail: 'sustitución: el comando REY; solo sustituye la PRIMERA aparición de cada línea salvo con la g' },
      { flag: 'g', detail: 'flag de la sustitución s/x/y/g: TODAS las apariciones en cada línea, no solo la primera' },
      { flag: '-i', detail: 'in-place: reescribe el fichero CON el resultado (¡destruye el original! haz antes un backup o usa -i.bak)' },
      { flag: '-i.bak', detail: 'variante segura: reescribe y guarda el original como fichero.bak' },
      { flag: '-n', detail: 'suprime la impresión automática; se usa con el comando p para imprimir SOLO lo que interesa' },
      { flag: 'p', detail: 'print con -n: «sed -n /patrón/p» imprime solo las líneas que encajan' },
      { flag: 'd', detail: 'delete: descarta las líneas seleccionadas (d sin selector borra TODO)' },
      { flag: '/PATRÓN/d', detail: 'borra las líneas que ENTRAN en el patrón — futuro: /^#/d elimina comentarios' },
      { flag: '-E', detail: 'usa regex EXTENDIDA en los patrones (ERE: +, ?, |, grupos sin backslash)' },
      { flag: 'y/A/B/', detail: 'traduce 1:1 los caracteres (equivalente de un tr dentro de sed)' },
      { flag: 'NUM', detail: 'número de línea como selector: 5d borra la 5.ª línea; $d borra la última' },
      { flag: '!', detail: 'niega el selector: sed /pat/!d borra TODO lo que NO tenga el patrón' },
    ],
    examples: [
      { cmd: 'sed s/apple/manzana/g frutas.txt', explain: 'reemplazo global de TODOS los apple de cada línea (sin la g solo cae la 1.ª)' },
      { cmd: 'sed -i "s/SELinux=enforcing/SELinux=permissive/" /etc/selinux/config', explain: 'editar UNA config en el sitio, con el valor exacto entre comillas' },
      { cmd: 'sed -n 8,12p log.txt', explain: 'imprime el rango de líneas 8-12 y nada más' },
      { cmd: 'sed /^#\\|^$/d conf.txt', explain: 'config limpia: fuera comentarios (^#) y fuera vacíos (^$) — el d con doble selector' },
      { cmd: 'sed s/x/y/2', explain: 'solo la SEGUNDA aparición por línea; la n.ª + g combina: s/x/y/3g' },
      { cmd: 'sed -n /err/p fich.txt', explain: 'con -n y /regex/p imprime solo las líneas que matchean: un grep vía sed' },
    ],
    tips: ['sed NO hace multilíneas de gratis (cada línea es un registro); para editar varias líneas de golpe usa awk o python', 'la barra / puede reemplazarse por otro carácter: sed "s|/usr/bin|/opt/bin|g" — comodín cuando editas RUTAS'],
  },

/* ══════════════ awk ══════════════ */
  {
    cat: 'awk', name: 'awk', tag: 'procesa texto campo a campo',
    what: 'Un mini-lenguaje completo: divide cada línea en CAMPOS ($1, $2… $0 la línea entera) según FS, aplica condiciones {acciones} y tiene BEGIN/END, arrays asociativos, funciones de cadena, printf… Es EL procesador de columnas del shell.',
    syntax: "awk [opciones] 'condiciones {acciones}' [fichero…]",
    flags: [
      { flag: '-F SEP', detail: 'fija el separador de CAMPOS para todo el programa (p. ej. -F: con /etc/passwd; -F"," para CSV); es la abreviatura de BEGIN { FS = ":" }' },
      { flag: '-f FICH', detail: 'lee el PROGRAMA awk de un fichero (programas largos editables)' },
      { flag: '-v VAR=VAL', detail: 'inicializa variables DESDE la shell hacia el programa: awk -v kw="$1"' },
      { flag: '$0', detail: 'la LÍNEA completa; $1..$NF los campos; NF el NÚMERO de campos de esta línea' },
      { flag: 'NR', detail: 'número global de LÍNEA: awk NR==2 imprime la 2.ª línea de todo el stream' },
      { flag: 'FNR', detail: 'número de línea DENTRO del fichero actual: la comparación FNR==NR distingue dos ficheros en un join' },
      { flag: 'FS / OFS', detail: 'separador de ENTRADA / SALIDA de campos (OFS redibuja $0 cuando reasignas un campo antes de print)' },
      { flag: 'BEGIN / END', detail: 'bloques: BEGIN corre ANTES de leer líneas (headers, acumuladores a cero); END al terminar (los resultados)' },
      { flag: 'printf', detail: 'formato al estilo C: %s cadena, %d entero, %.2f 2 decimales, \\n salto' },
      { flag: 'match($0, /re/)', detail: 'encuentra el primer match de la regex y rellena RSTART y RLENGTH — se corta luego con substr' },
      { flag: 'sub/gsub', detail: 'reemplaza (sub: la 1.ª; gsub: todas) y devuelve cuántas hizo; in-place sobre $0 o un campo' },
      { flag: 'length($0)', detail: 'longitud de la línea (o de la cadena que le pases); compárala > N para filtrar por tamaño' },
      { flag: 'index($0, "sub")', detail: 'posición de la primera aparición de la subcadena, 0 si no está' },
      { flag: 'substr($0, ini, len)', detail: 'corte de $0: desde la posición ini, longitud len (omitiendo len = hasta el final)' },
      { flag: 'split($0, arr, /re/)', detail: 'parte la cadena en el ARRAY arr por la regex; devuelve el Nº de elementos' },
      { flag: 'arr[clave]', detail: 'array ASOCIATIVO: índices arbitrarios (números de estado, IPs) — el histograma de awk' },
      { flag: 'getline', detail: 'lee la SIGUIENTE línea manualmente: para pares de líneas o adelantar registros sin bucle' },
    ],
    examples: [
      { cmd: "awk '{print $1, $3}' eventos.txt", explain: 'el idiom básico: columnas 1 y 3 de cada línea, separadas por espacio (OFS)' },
      { cmd: "awk -F: '$3 > 1000 {print $1}' /etc/passwd", explain: 'usuarios «normales» (uid > 1000): un filtro numérico + print — el patrón básico del sysadmin' },
      { cmd: "awk '$3 == \"OK\" && $4 == \"sig\" {t = t $5} END {print t}' canal.txt", explain: 'filtro doble + ACUMULADOR + RESUMEN en END: el boss de awk', out: 'FLAG{AB12CD...}' },
      { cmd: "awk '{s += $2} END {print \"total\", s}' compras.tsv", explain: 'SUMA una columna: += acumula y END estampa el total' },
      { cmd: "awk '/err/{print NR\": \"$0}' log.txt", explain: 'líneas de error con su N.º global: el número concatena con la línea usando ":" como separador' },
      { cmd: "awk 'BEGIN{FS=OFS=\":\"} {$1=\"agente\"; print}' /etc/passwd > fake-passwd", explain: 'modifica UN campo y re-imprime la línea con OFS: la asignación $1=… resincroniza el $0' },
      { cmd: "awk '{c[$1]++} END {for (k in c) print c[k], k}' palabras.txt | sort -nr | head", explain: 'HISTOGRAMA: el array asociativo cuenta por clave, END lo vuelca, sort lo ordena' },
      { cmd: "awk 'FNR==NR {a[$1]=$2; next} $1 in a {print $1, a[$1]}' precios.txt compras.txt", explain: 'JOIN en awk: carga el 1.º fichero en un array asociativo y luego anota con él el 2.º' },
      { cmd: "awk 'match($0, /[0-9]{3}/) {print substr($0, RSTART, RLENGTH)}'", explain: 'extrae el 1.º número de 3 dígitos de cada línea: match() sabe dónde empieza y cuánto mide' },
      { cmd: "awk '{print length($0), $0}' texto.txt | sort -nr | head", explain: 'las líneas MÁS LARGAS primero: la métrica de longitud es la clave del ranking' },
    ],
    tips: ['los PROGRAMAS awk van íntegros en comillas SIMPLES: \'{print $1}\' — para meter variables shell usa -v kw="$valor"', 'awk es indiferente a los espacios múltiples: $1 es el primer campo AUNQUE haya varios espacios entre columnas'],
  },
  {
    cat: 'awk', name: 'awk: estado y ranking', tag: 'máquinas de estado y campeones por grupo (ronda 6)',
    what: 'Idiomas de awk para escenarios reales: memoria del registro ANTERIOR (máquina de estados con prev), campeón POR GRUPO (dos arrays en paralelo), selección por FICHERO (FILENAME vs ARGV), párrafos con RS="", ranking invertido y anotaciones con ternario.',
    syntax: "awk 'patrón {acción} {prev = $0}' [ficheros…]",
    flags: [
      { flag: 'FILENAME', detail: 'el fichero que awk está leyendo AHORA; compárralo con ARGV[1..N] para reglas distintas por fichero' },
      { flag: 'ARGV', detail: 'el VECTOR de argumentos: ARGV[1] = primer fichero, así que FILENAME == ARGV[2] procesa SOLO el 2.' },
      { flag: 'RS = ""', detail: 'un PÁRRAFO por registro (separa por líneas en blanco): /patrón/ busca en todo el bloque y print lo emite entero' },
      { flag: 'prev = $0', detail: 'memoria del REGISTRO ANTERIOR: prev ~ / OK / && $2 == "KO" detecta la TRANSICIÓN en una sola pasada' },
      { flag: 'getline', detail: 'lee la línea SIGUIENTE dentro del bloque: prev mira atrás, getline mira adelante; juntos cubren evento → consecuencia' },
      { flag: 'next', detail: 'SALTA al siguiente registro sin ejecutar el resto de acciones: clasificadores (&lsof comentarios con ^#) sin if/else anidado' },
    ],
    examples: [
      { cmd: "awk 'prev ~ / OK / && $2 == \"KO\" {print; getline; print} {prev=$0}' servicio.log", explain: 'BOSS: detecta la transición OK→KO, imprime esa fila y la CONSECUENCIA (donde viaja la evidencia)' },
      { cmd: "awk '!($1 in mx) || $2+0 > mx[$1] {mx[$1]=$2+0; best[$1]=$0} END {for (k in best) print best[k]}' scores.txt", explain: 'CAMPEÓN POR GRUPO: dos arrays paralelos (métrica y fila completa) — el ranking sin sort' },
      { cmd: "awk 'FILENAME == ARGV[2] && NF < 3 {print}' par.txt rota.txt", explain: 'MULTI-FICHERO con reglas por fichero: solo las filas ROTAS del 2.' },
      { cmd: "awk 'BEGIN{RS=\"\"} /sello/ {print}' informe.txt", explain: 'PÁRRAFOS: emite el bloque ENTIRE que contiene el patrón — correos, mensajes multi-línea, configs' },
      { cmd: "awk '{a[NR]=$0} END {for (i=NR; i>=1; i--) print a[i]}' bitacora.txt", explain: 'REVERSA manual (anti-tac): array indexado por NR y recorrido descendente en END — control total del orden' },
      { cmd: "awk '{print $0, ($2 >= 0 ? \"ganancia\" : \"pérdida\")}' balance.txt", explain: 'TERNARIO etiqueta cada fila sin if/else; $0 conserva la línea intacta y añade la clase al final' },
      { cmd: "awk '/^#/ {print; next} {n++; last=$0} END {print n, last}' config.txt", explain: 'CLASIFICA en una pasada: comentarios se emiten con next, los datos se cuentan y se recuerda el ÚLTIMO' },
    ],
    tips: ['el guard de prev se evalúa ANTES de {prev = $0}: por eso el bloque de memoria va ÚLTIMO en el programa', 'getline con variable (getline var) no sobreescribe $0 — elígelas si no quieres machacar los campos'],
  },
  {
    cat: 'awk', name: 'perl', tag: 'regex de vertederos (one-liners)',
    what: 'Intérprete de propósito general, usado en un par de niveles avanzados como awk «con esteroides» para resolver con una regex potente. En este proyecto solo se usa en línea: perl -ne/, perl -pe/ y variantes del one-liner.',
    syntax: 'perl [opciones] [-e PROGRAMA] [fichero…]',
    flags: [
      { flag: '-e', detail: 'ejecuta el PROGRAMA desde la línea de comando' },
      { flag: '-n', detail: 'envuelve el programa en un while (<>) por cada línea SIN imprimirla — tú decides el print' },
      { flag: '-p', detail: 'como -n pero IMPRIME cada línea al final (sustituciones s///g sobre la marcha)' },
      { flag: '-Mutf8', detail: 'carga el módulo utf8: acentos y emojis se entienden bien dentro de las cadenas' },
      { flag: '-w', detail: 'warn: activa advertencias (el -Wall de perl)' },
    ],
    examples: [
      { cmd: "perl -ne 'print if /error/' log.txt", explain: 'el primo flexible de grep: imprime la línea si encaja la regex perl — mismo papel que grep -E, con sintaxis de perl' },
      { cmd: "perl -pe 's/\\d{3}/[X]/g' datos.txt", explain: 'reemplaza todo número de 3 dígitos por [X] — el s///g global es la especialidad de perl' },
      { cmd: 'perl -Mutf8 -e \'print "añejo UTF8 sin líos\\n"\'', explain: '-Mutf8 para que el á se entienda bien dentro del literal' },
    ],
    tips: ['perl no es «otro awk»: es un lenguaje entero. En el dojo solo toca los one-liners del estilo de arriba, en niveles PRO'],
  },

/* ══════════════ search ══════════════ */
  {
    cat: 'search', name: 'find', tag: 'busca ficheros jerárquicamente',
    what: 'Baja desde una ruta evaluando PREDICADOS: nombre, tipo, tamaño, tiempo, permisos, dueño… y (con -exec) EJECUTA un comando por cada resultado. Es el «grep» de los FICHEROS: el detective del filesystem.',
    syntax: 'find [ruta…] [predicados] [-exec cmd {} +]',
    flags: [
      { flag: '-name "*.log"', detail: 'coincidencia del NOMBRE por glob (¡siempre entre comillas para que no lo expanda la shell!)' },
      { flag: '-iname', detail: 'como -name pero insensible a mayúsculas' },
      { flag: '-type f', detail: 'solo ficheros REGULARES; d directorios, l enlaces simbólicos' },
      { flag: '-size +100k', detail: 'MÁS GRANDE de 100 KiB; 5k exacto, -100k menor (sufijos b, c, M, G)' },
      { flag: '-mmin -5', detail: 'modificado en los últimos 5 MINUTOS; -mmin +10 = hace más de 10' },
      { flag: '-mtime -7', detail: 'análogo por días: modificados en la última semana' },
      { flag: '-perm 644', detail: 'permisos EXACTAMENTE 644; -perm /g+w = al menos escritura de grupo (sintaxis simbólica)' },
      { flag: '-user root', detail: 'perteneciente al usuario root; -group grupo hace lo propio con el grupo' },
      { flag: '-exec CMD {} \\;', detail: 'ejecuta CMD por cada resultado: {} es el fichero sustituido; termina en \\; (o + para agrupar varios)' },
      { flag: '-delete', detail: 'borra lo que encaja (¡sin confirmar! pruébalo antes con print)' },
      { flag: '-ls', detail: 'salida como ls -dils (tamaño, inode, permisos por match)' },
    ],
    examples: [
      { cmd: 'find / -name "*.conf" 2>/dev/null', explain: 'rastreo global: el 2>/dev/null mata los «Permission denied» de zonas prohibidas' },
      { cmd: 'find /var/log -type f -size +10M -ls', explain: 'logs que ya ocupan mucho — los candidatos a rotar' },
      { cmd: 'find /tmp -mmin -30 -type f', explain: 'tocados en la última media hora (pregunta forense: ¿qué se creó/modificó recientemente?)' },
      { cmd: 'find . -name "*.bak" -delete', explain: 'limpieza de .bak por el directorio actual, RECURSIVA y sin preguntar' },
      { cmd: 'find . -type f -exec grep -H "flag" {} \\;', explain: 'grep en cada fichero que find entrega: -H para incluir el nombre en la salida (como grep -r hecho a mano)' },
    ],
    tips: ['find no ordena por sí mismo: find . -type f | wc -l cuenta ficheros; encauza la salida por sort si quieres orden'],
  },
  {
    cat: 'search', name: 'xargs', tag: 'convierte stdin en argumentos',
    what: 'El puente stdin→argv: lee líneas de la salida del comando anterior y las pega como ARGUMENTOS del comando que le das. Menos flexible que find -exec en general, pero encaja perfecto tras ls, cat, grep -l, cut…',
    syntax: 'comando… | xargs [opciones] CMD [marcador]',
    flags: [
      { flag: '-I {}', detail: 'marcador de sustitución: {} ocupa el lugar de la línea actual (cuando NO puede ir al final: cp {} /backup/)' },
      { flag: '-n N', detail: 'invoca CMD con como máximo N argumentos por vez (uno a uno con -n 1)' },
      { flag: '-P 4', detail: 'PARALELISMO: hasta 4 procesos a la vez; -P 0 sin límite (¡cuidado con lo que paralelizas!)' },
      { flag: '-d "\\n"', detail: 'delimitador: usa el SALTO de línea (por defecto partiende de espacios y comillas); más seguro con nombres raros' },
      { flag: '-r', detail: 'no ejecuta CMD si el stdin viene vacío (GNU xargs extra limpio)' },
      { flag: '--', detail: 'terminador de opciones para CMD — defiende contra nombres de fichero que empiecen por -' },
    ],
    examples: [
      { cmd: 'cat ficheros.txt | xargs rm -f', explain: 'la lista alimenta al rm: borra cada fichero nombrado — cuidado, irreversible' },
      { cmd: 'grep -rl "pass" /etc | xargs -r grep -c "root"', explain: 'cadena de dos grep: -rl lista los ficheros con «pass», el segundo cuenta «root» EN CADA uno' },
      { cmd: 'find . -name "*.jpg" | xargs -I{} cp {} /media/backup/', explain: '{} en MEDIO del comando destino: el formato del copia-por-find' },
      { cmd: 'ls *.conf | xargs -n1 sha256sum', explain: 'hash uno por uno con -n1 (evita la línea de comandos máxima) para todos' },
    ],
    tips: ['con nombres con espacios es problemático: usa xargs -d "\\n" o find -print0 | xargs -0 — la pareja segura'],
  },
/* ══════════════ archive ══════════════ */
  {
    cat: 'archive', name: 'tar', tag: 'el archivero de UNIX',
    what: 'Empaqueta ficheros en UNO (tar = tape archive) y, con las letras compuestas, los DESEMPAQUETA: tar -xzf = eXtract + gZip + File. No comprime por sí mismo (con -z lo delega en gzip).',
    syntax: 'tar [-c|-x|-t] [-z|-j] [-f ARCHIVO] [ficheros…]',
    flags: [
      { flag: '-c', detail: 'CRea el archivo' },
      { flag: '-x', detail: 'eXtract: desempacar' },
      { flag: '-t', detail: 'lisTado: ver el CONTENIDO sin extraer (auditoría previa)' },
      { flag: '-z', detail: 'filtro gzip: crea o lee .tar.gz (llamado también .tgz)' },
      { flag: '-j', detail: 'filtro bzip2: .tar.bz2' },
      { flag: '-f F', detail: 'File: el nombre del archivo tar; para stdin/stdout es el guion «-»' },
      { flag: '-v', detail: 'verbose: lista cada fichero que entra/sale' },
      { flag: '-C DIR', detail: 'Change dir: hace el trabajo desde DIR (ideal para desempacar en una carpeta concreta)' },
      { flag: '-J', detail: 'filtro xz: .tar.xz' },
    ],
    examples: [
      { cmd: 'tar -czf backup.tgz /var/dojo', explain: 'Create + gzip + File: tres letras, un backup comprimido (añade -v para verlo)' },
      { cmd: 'tar -xzf backup.tgz -C /tmp/restaurado', explain: 'extraer a una carpeta concreta: la -C define el DESTINO al desempacar' },
      { cmd: 'tar -tvf backup.tgz', explain: 'auditar sin desempacar: qué hay y cuánto pesa cada fichero' },
      { cmd: 'tar -xf muygrande.tar --wildcards "*.txt"', explain: 'extraer SOLAMENTE ciertos ficheros del archivo (con -t antes lo validas)' },
    ],
  },
  {
    cat: 'archive', name: 'gzip / gunzip', tag: 'compresión estándar',
    what: 'gzip COMPRIME un fichero in-place (lo sustituye por su .gz); gunzip o gzip -d lo devuelven. gzip no agrupa VARIOS ficheros (para eso está tar), y zcat te deja leer el contenido sin descomprimirlo.',
    syntax: 'gzip [-d|-k] fichero… · gunzip fichero.gz · zcat fichero.gz',
    flags: [
      { flag: '-d', detail: 'decompress (lo mismo que gunzip)' },
      { flag: '-k', detail: 'keep: conserva el original al crear el .gz (no lo borra)' },
      { flag: '-9', detail: 'máxima compresión (1 = rápido, 9 = más denso; por defecto 6)' },
      { flag: '-l', detail: 'lista info de compresión (tamaño original, ratio) sin descomprimir' },
    ],
    examples: [
      { cmd: 'gzip -k grande.log', explain: 'comprime SIN destruir el original (keep)' },
      { cmd: 'gunzip backup.log.gz', explain: 'devuelve el fichero original borrando el .gz' },
      { cmd: 'zcat kern.log.gz | grep -c error', explain: 'grep directo sobre el comprimido: zcat lo descomprime al vuelo y lo manda a la tubería — nunca toca el disco' },
    ],
  },
  {
    cat: 'archive', name: 'xz', tag: 'compresión de alta densidad',
    what: 'Formato moderno más eficiente que gzip (y más lento): ficheros .xz. xz -d descomprime; xz -l lista. Se usa igual que gzip.',
    syntax: 'xz [-d|-k] fichero',
    flags: [
      { flag: '-d', detail: 'decomprimir (equivale xzcat)' },
      { flag: '-k', detail: 'keep: conserva el original' },
      { flag: '-9', detail: 'fuerza máxima (xz llega a ser más denso que gzip en el mismo escenario)' },
    ],
    examples: [
      { cmd: 'xz -k datos.tsv', explain: 'comprime sin borrar el original' },
      { cmd: 'xzcat drip.jsonl.xz | head', explain: 'leer ficheros .xz en tubería sin descomprimir al disco' },
    ],
  },
  {
    cat: 'archive', name: 'zip / unzip', tag: 'el formato del intercambio',
    what: 'zip crea archivos .zip (AGRUAN varios ficheros DE NATIVO, a diferencia de gzip), y unzip los extrae. Compatibilidad universal: win/mac/linux lo entienden todos.',
    syntax: 'zip [-r] archivo.zip ficheros… · unzip [opciones] archivo.zip',
    flags: [
      { flag: '-r', detail: '(zip) recursivo: el directorio ENTERO y lo que cuelga de él' },
      { flag: '-9', detail: '(zip) máxima compresión' },
      { flag: '-l', detail: '(unzip) lista el contenido sin extraer' },
      { flag: '-d DIR', detail: '(unzip) el directorio destino de la extracción' },
    ],
    examples: [
      { cmd: 'zip -r visita.zip visitacasa/', explain: 'empaqueta un directorio entero desde su raíz' },
      { cmd: 'unzip -l entrega.zip', explain: 'inspecciona antes de descomprimir: nombres y rutas al descubierto' },
      { cmd: 'unzip entrega.zip -d /tmp/inbox', explain: 'extrae con BÚSQUEDA controlada (nunca desempacar ciego en /)' },
    ],
  },
  {
    cat: 'archive', name: '7z', tag: 'el fuerte universal',
    what: 'Herramienta 7-Zip: lee casi todo (.7z, .zip, .tar, .rar de lectura…). Aparece en los retos de forense; su sintaxis es propia (a add, x extract, e extraer plano).',
    syntax: '7z [a|x|e|l] [archivo] [ficheros…]',
    flags: [
      { flag: 'a', detail: 'add: crear/añadir al archivo' },
      { flag: 'x', detail: 'extrae CON la estructura de directorios original' },
      { flag: 'e', detail: 'extrae PLANO: todo al dir actual (¡cuidado con colisiones de nombre!)' },
      { flag: 'l', detail: 'lista el contenido' },
    ],
    examples: [
      { cmd: '7z x tesoro.7z', explain: 'extracción preservando la jerarquía (la x es la buena en la mayoría de los casos)' },
      { cmd: '7z l tesoro.7z', explain: 'ver qué trae antes de extraer — el forense siempre audita primero' },
    ],
  },
  {
    cat: 'archive', name: 'diff', tag: 'compara dos ficheros línea a línea',
    what: 'Compara ficheros (o directorios con -r) y muestra las DIFERENCIAS, en formato unificado con -u: las líneas quitadas (prefijo -), añadidas (+) y las sin cambios de contexto. Es el antecedente legible de los commits de git.',
    syntax: 'diff [-u] [-r] fichero1 fichero2',
    flags: [
      { flag: '-u', detail: 'contexto unificado: el formato con ---/+++ que generan git y patch — SIEMPRE se usa este' },
      { flag: '-r', detail: 'recursivo para directorios' },
      { flag: '-q', detail: 'solo dice SI difieren, sin detalle' },
      { flag: '--color', detail: 'pinta las diferencias (verde/rojo) — lectura de un vistazo' },
      { flag: '-y', detail: 'lado a lado (side by side)' },
    ],
    examples: [
      { cmd: 'diff -u viejo.conf nuevo.conf', explain: 'qué cambió exactamente entre dos versiones de la config' },
      { cmd: 'diff -r /tmp/origen /tmp/twin', explain: 'dos árboles enteros: fichero por fichero' },
    ],
  },
  {
    cat: 'archive', name: 'patch', tag: 'aplica el diff que te digieron',
    what: 'Aplica a un fichero (o a un árbol) el diff generado con diff -u. La pareja diff+patch es la aritmética reversible del texto: entre dos versiones y su diff, siempre puedes ir de A a B y de B de vuelta a A.',
    syntax: 'patch [-p N] [-R] [-i fichero.diff] [origen]',
    flags: [
      { flag: '-p N', detail: 'recorta N componentes de la RUTA del diff (-p1 quita la primera — típico en los diffs de git)' },
      { flag: '-i', detail: 'lee el remiendo desde un fichero (si no llega por stdin)' },
      { flag: '-R', detail: 'REVERSIÓN: aplica el remiendo AL REVÉS (deshacer)' },
      { flag: '--dry-run', detail: 'simula sin tocar: audita fallos de contexto — la prueba antes del salto' },
    ],
    examples: [
      { cmd: 'patch -p1 < cambios.diff', explain: 'aplica un remiendo estándar en el árbol actual (el -p1 clásico de git)' },
      { cmd: 'patch -R -p1 < cambios.diff', explain: 'deshace el remiendo: la reversibilidad de diff+patch' },
    ],
  },

/* ══════════════ encode ══════════════ */
  {
    cat: 'encode', name: 'base64', tag: 'texto binario de bolsillo',
    what: 'Codifica/descodifica a base64: 64 caracteres seguros que le van bien hasta a los correos y a JSON. CTF por todas partes: el flag o el payload escondido en una sopa de A-Z0-9+/ terminada en ==.',
    syntax: 'base64 [-d|-w 0] [fichero]',
    flags: [
      { flag: '-d', detail: 'decode: de base64 al binario/texto original' },
      { flag: '-w 0', detail: 'wrap 0: NO corta por líneas — la salida en UNA sola línea (esencial para comparar y pegar)' },
      { flag: '--decode', detail: 'sinónimo largo de -d' },
    ],
    examples: [
      { cmd: 'echo "bash-arena" | base64', explain: 'codificar', out: 'YmFzaC1hcmVuYQo=' },
      { cmd: 'echo YmFzaC1hcmVuYQo= | base64 -d', explain: 'decodificar de vuelta', out: 'bash-arena' },
      { cmd: 'base64 -w0 imagen.png', explain: 'un PNG entero a texto para pegarlo en un JSON o en un data: URI' },
    ],
    tips: ['si el descodificado no se ve bien pero TERMINA en == y solo tiene A-Za-z0-9+/… es base64 seguro; si no, prueba base32/base85 — mira file', 'los == finales son relleno: un payload válido puede acabar en = o directo sin ellas'],
  },
  {
    cat: 'encode', name: 'sha256sum', tag: 'hash SHA-256 por fichero',
    what: 'Calcula el digest SHA-256 de cada fichero. Integridad clásica: dos ficheros idénticos ⇒ MISMO hash; se usa para checksums de paquetes, verificación de descargas y detección de alteraciones (tampering).',
    syntax: 'sha256sum fichero…',
    flags: [
      { flag: '-c', detail: 'check: verifica contra un fichero de sumas previas (dice OK/FALLÓ por línea)' },
      { flag: '-b', detail: 'binario (marca b en el formato generado)' },
    ],
    examples: [
      { cmd: 'sha256sum paquete.deb', explain: 'firma digital del fichero: compárala con la publicada' },
      { cmd: 'sha256sum *.log > sums.txt && sha256sum -c sums.txt', explain: 'suma + verificación posterior: patrón de auditoría en dos pasos' },
    ],
  },
  {
    cat: 'encode', name: 'md5sum', tag: 'hash MD5 (histórico)',
    what: 'Calcula el digest MD5 por fichero. Criptográficamente ROTO (colisiones fáciles) pero se sigue usando para comparar ficheros y en CTFs. Para verificar autenticidad de verdad usa SHA-256.',
    syntax: 'md5sum fichero…',
    flags: [
      { flag: '-c', detail: 'check contra un fichero de sumas previas' },
    ],
    examples: [
      { cmd: 'md5sum imagen.iso', explain: 'digest MD5 (rápido pero inseguro) — para ISO y descargas históricas' },
      { cmd: 'md5sum -c sums.txt', explain: 'verificación contra una lista previa de MD5' },
    ],
  },
  {
    cat: 'encode', name: 'xxd', tag: 'hexdump byte a byte',
    what: 'Volca el fichero en HEXADECIMAL con su representación ASCII al lado: los offsets, los bytes y los caracteres legibles. El microscopio forense de ficheros binarios; con -r traduce de vuelta.',
    syntax: 'xxd [fichero] | xxd -r',
    flags: [
      { flag: '-r', detail: 'REVERTIR: de hexdump de vuelta a bytes (un fichero .hex en datos)' },
      { flag: '-p', detail: 'plain hex: sin offsets ni columna ASCII — el hex como «33 73 61…» limpio' },
      { flag: '-l N', detail: 'solo los primeros N bytes' },
      { flag: '-s N', detail: 'empieza desde el byte N (offset desde el inicio)' },
      { flag: '-c N', detail: 'N bytes por línea (por defecto 16)' },
    ],
    examples: [
      { cmd: 'xxd fichero.bin | head', explain: 'cabecera de un binario: los «magic bytes» dicen el formato real (PNG, ELF…)' },
      { cmd: 'xxd -p mensaje.txt | tr -d "\\n"', explain: 'hex continuo sin espacios: formato muy usado por las CTFs' },
      { cmd: 'echo "48656c6c6f" | xxd -r -p', explain: 'hex a texto: cada par de dígitos es un código ASCII', out: 'Hello' },
    ],
  },
  {
    cat: 'encode', name: 'strings', tag: 'extrae las cadenas legibles',
    what: 'Pesca las secuencias de PRINTABLES (ASCII/UTF-8, ≥4 por defecto) dentro de un fichero binario: los mensajes del programa, URLs, nombres de variables… y sí, también las FLAGS ocultas por los desarrolladores.',
    syntax: 'strings [opciones] fichero',
    flags: [
      { flag: '-n N', detail: 'longitud mínima de cadena (por defecto 4)' },
      { flag: '-e l', detail: 'cadenas de 16 bits (little-endian): para binarios de Windows o Java' },
    ],
    examples: [
      { cmd: 'strings /bin/grep | grep -i gnu', explain: 'retrato rápido: qué cadenas/librerías GNU hay dentro del binario' },
      { cmd: 'strings fichero.bin | grep -iE "flag|pass"', explain: 'CTF clásico: los binarios sueltan sus constantes al volcado — solo filtrar' },
    ],
  },

/* ══════════════ perms ══════════════ */
  {
    cat: 'perms', name: 'chmod', tag: 'cambia los bit de permisos',
    what: 'Modifica los permisos de un fichero: en OCTAL (755 = rwxr-xr-x) o simbólico (u=usuario, g=grupo, o=otros; + añadir, - quitar, = fijar). Base ternaria: r=4, w=2, x=1 — por eso 755 y 644 son los valores que hay que grabarse.',
    syntax: 'chmod [opciones] MODE fichero…',
    flags: [
      { flag: '755', detail: 'octal directo: dueño rwx (4+2+1), grupo y otros r-x (4+1) — el permiso típico de DIRECTORIOS y ejecutables' },
      { flag: '644', detail: 'dueño rw, grupo y otros r — la corriente de ficheros de datos/configs' },
      { flag: 'u+x', detail: 'simbólico: al dueño le AÑADE ejecución (el antídoto de «¡no es ejecutable…!»)' },
      { flag: 'go-w', detail: 'a grupo y otros les QUITA escritura (ateriza una tmp que alguien abrió de par en par)' },
      { flag: '-R', detail: 'recursivo: cambia el árbol entero (con cuidado de cuidado en /system: -R 777 es un accidente que algo grave)' },
      { flag: 'a+r', detail: 'all: dueño+grupo+otros (gana en lectura)' },
    ],
    examples: [
      { cmd: 'chmod +x script.sh', explain: 'hazlo ejecutable: se usa a la hora de instalar herramientas' },
      { cmd: 'chmod 644 notas.txt', explain: 'permisos de lectura clásico de datos: dueño rw, todos los demás r' },
      { cmd: 'chmod -R g+w /srv/releases', explain: 'recursivo: escritura de grupo por el filesystem entero' },
      { cmd: 'chmod 400 id_rsa', explain: 'SSH exige permiso SOLO al dueño: una clave privada en 644 es rechazada por ssh' },
    ],
    tips: ['para comprender «755»: dueño puede leer/escribir/ejecutar; el RESTO solo lee y entre en el dir, nunca escribe: convención práctica de casi todo lo del sistema'],
  },
  {
    cat: 'perms', name: 'chown', tag: 'cambia dueño/grupo de un fichero',
    what: 'Formato usuario:grupo (p. ej. chown agent:agent f.txt). Requiere root para cambiar el dueño (para el grupo propio, sudo libre si perteneces); esencial en servicios e instalaciones. La clave: el dueño MANDA en el fichero, no el CREADOR.',
    syntax: 'chown [opciones] dueño[:grupo] fichero…',
    flags: [
      { flag: 'dueño', detail: 'solo cambia el usuario dueño' },
      { flag: 'dueño:grupo', detail: 'dueño Y grupo en la misma invocación' },
      { flag: ':grupo', detail: 'solo cambia el grupo (manteniendo dueño)' },
      { flag: '-R', detail: 'recursivo: árbol entero' },
      { flag: '--reference=F', detail: 'copia dueño/grupe DE OTRO fichero (clónica a F)' },
    ],
    examples: [
      { cmd: 'sudo chown agent:agent /home/agent/canal.txt', explain: 'recuperación típica: si el setup escribió como root, el agent lo necesita ENTREGADO' },
      { cmd: 'sudo chown -R www-data:www-data /var/www', explain: 'entregar un directorio COMPLETO al servicio web — el clásico de despliegues' },
      { cmd: 'sudo chown :developers fichero', explain: 'solo el grupo: del root al rol del team' },
    ],
  },
  {
    cat: 'perms', name: 'umask', tag: 'la MÁSCARA de permisos por defecto',
    what: 'Define qué bits de permisos se les QUITA a los ficheros NUEVOS (creados con touch/mkdir/etc). Sin umask, crearías 666/777; con 022 quedan 644/755: (bits de mask: 0 = no se quita, 2 = quitar w, 7 = quitar rwx).',
    syntax: 'umask [máscara]',
    flags: [
      { flag: '-S', detail: 'formato simbólico (u=rwx,g=rx,o=rx) legible' },
      { flag: '022', detail: 'la clásica: ficheros nuevos 644 y directorios 755' },
      { flag: '077', detail: 'privada: solo el dueño ve todo (7 quita TODO a grupo y otros)' },
    ],
    examples: [
      { cmd: 'umask', explain: 'ver la máscara actual en octal (se muestra como 0022 por compatibilidad)' },
      { cmd: 'umask 077 && touch secreto.txt', explain: 'trabajas en privado dentro del mismo shell: los nuevos ficheros saldrán 600' },
      { cmd: 'umask -S', explain: 'formato simbólico: u=rwx,g+rw,o+r (el equivalente de 027)' },
    ],
  },
  {
    cat: 'perms', name: 'sudo', tag: 'ejecutar como otro usuario (típicamente root)',
    what: 'Substitute User DO: lanza el comando SIGUIENTE con privilegios del usuario que digas (root por defecto). Las credenciales vienen de sudoers; hay -u para cambios de usuario no-root, y -s/-i para shells.',
    syntax: 'sudo [opciones] comando',
    flags: [
      { flag: '-u USER', detail: 'como OTRO usuario (sudo -u agent cat f.txt: para ver como alguien CON MENOS derechos, no solo para más)' },
      { flag: '-s', detail: 'shell: abre una bash como root sin cambiar el HOME' },
      { flag: '-i', detail: 'login shell de root: carga el entorno, HOME y PATH como si fueras root de verdad' },
      { flag: '!!', detail: 'truco de bash: ¡repite el ÚLTIMO comando con sudo! sudo !! (salvavidas cuando el comando falló por permisos)' },
      { flag: '-l', detail: 'list: qué comandos puedes ejecutar con sudo' },
    ],
    examples: [
      { cmd: 'sudo systemctl restart nginx', explain: 'actiones del sistema: reiniciar servicios' },
      { cmd: 'sudo -u www-data ls /var/www', explain: '«ver como el usuario del servicio»: no es root, es el rol del worker' },
      { cmd: 'sudo sshd -t', explain: 'validación de config: si sshd -t sale sin mensaje, tu configuración sshd está bien' },
    ],
  },
  {
    cat: 'perms', name: 'useradd / usermod', tag: 'crear y ajustar cuentas',
    what: 'useradd crea un usuario NUEVO; usermod MODIFICA uno ya existente (grupos, home, shell…). Suelen acompañarse de passwd (contraseña), mkdir del home correcto y chown. Por defecto useradd no crea home ni da shell de verdad.',
    syntax: 'useradd [-m] [-s SHELL] user · usermod [-aG grupo] user',
    flags: [
      { flag: '-m', detail: '(useradd) crear el HOME del usuario — sin -m el usuario nace SIN casa' },
      { flag: '-s /bin/bash', detail: '(useradd) la shell por defecto del usuario (a veces las distros ponen /bin/sh o un «nologin»)' },
      { flag: '-G grupo1,grupo2', detail: '(useradd) grupoS SUPLEMENTARIOS (además de su grupo primario)' },
      { flag: '-a', detail: '(usermod) APPEND: no sobrescribe la lista de grupos suplementarios — se usa siempre junto con -G' },
      { flag: '-g', detail: '(usermod) cambia el grupo PRIMARIO (ojo: la -g minúscula ES distinta de la -G mayúscula)' },
      { flag: '-L / -U', detail: '(usermod) lock/unlock del login (contraseña deshabilitada)' },
    ],
    examples: [
      { cmd: 'sudo useradd -m -s /bin/bash ana', explain: 'usuario Ana con su casa y su bash — el setup aceptable' },
      { cmd: 'sudo usermod -aG audio,video luisa', explain: 'mete a Luisa en dos grupos SIN perder los que ya tenía (el -a es lo que lo evita)' },
      { cmd: 'groups ana', explain: 'verificación posterior de la partida de grupos (o «id ana» = uid + grupos)' },
    ],
  },
  {
    cat: 'perms', name: 'id / groups', tag: '¿quién soy y qué grupos tengo?',
    what: 'id: uid, gid y LISTA de grupos del usuario. groups (a secas, o con otro usuario): los nombres de grupos — para el diagnóstico rápido de «¿por qué no puedo escribir en /var/www?».',
    syntax: 'id [usuario] · groups [usuario]',
    flags: [
      { flag: '-u', detail: '(id) solo el UID' },
      { flag: '-g', detail: '(id) solo el GID primario' },
      { flag: '-n', detail: '(id) imprime nombres en vez de números (con -u -n el USUARIO, no el número)' },
    ],
    examples: [
      { cmd: 'id', explain: 'todo lo que SEIS: uid, gid y grupos suplementarios de un golpe' },
      { cmd: 'id -nG luisa', explain: 'los nombres de grupos que TIENE Luisa (se combinan con xargs para pruebas de permisos en scripts)' },
      { cmd: 'groups', explain: 'tus grupos, en una línea limpia' },
    ],
  },

/* ══════════════ proc ══════════════ */
  {
    cat: 'proc', name: 'ps', tag: 'lista procesos vivos',
    what: 'Instantánea del estado de los procesos (no es vivo como top). Las dos escuelas: «ps aux» (estilo BSD) y «ps -ef» (System V): todos los procesos más dueño/CPU/estado — se filtra con grep.',
    syntax: 'ps [aux | -ef] [opciones]',
    flags: [
      { flag: 'aux', detail: 'combo clásico BSD: a = todos, u = con dueño/CPU/memoria, x = sin terminal (demonios incluidos)' },
      { flag: '-ef', detail: 'combinación System V: todos, formato largo: PPID (padre) incluido — el árbol de ascendencia con -f' },
      { flag: '-p PID', detail: 'por process ID exacto (el detalle de un solo proceso)' },
      { flag: '--forest', detail: 'indenta el árbol padre-hijo (combinable con aux: ps auxf)' },
    ],
    examples: [
      { cmd: 'ps aux | grep nginx', explain: '¿está nginx y con QUÉ argumentos? (excluye el propio grep con grep -v grep si el ruido molesta)' },
      { cmd: 'ps -eo pid,comm --sort=pid', explain: 'listado de procesos ordenado por PID, solo con las columnas que quieres' },
      { cmd: 'ps -u root f', explain: 'solo procesos de root, formato árbol, un clásico en dojos' },
    ],
  },
  {
    cat: 'proc', name: 'kill', tag: 'envía una señal a un proceso',
    what: 'No «mata» necesariamente: ENVÍA SEÑALES. Por defecto SIGTERM (15): termina con decoro, dando margen de limpieza. SIGKILL (9) es muerte inmediata sin aviso; SIGSTOP (19) / SIGCONT (18) pausan y reanudan. Los PIDs salen de ps o de jobs.',
    syntax: 'kill [-SEÑAL] PID…',
    flags: [
      { flag: '-TERM', detail: '«cierra como persona»: puede limpiar y terminar con gracia (el default del kill)' },
      { flag: '-9', detail: 'SIGKILL: muerte INMEDIATA sin limpieza — último recurso cuando el -TERM no surte' },
      { flag: '-STOP / -CONT', detail: 'SIGSTOP congela (suspende) y SIGCONT reanuda — útil para pausar un proceso sin matarlo' },
      { flag: '-HUP', detail: 'recarga config en varios servicios (es el reload que nginx -s reload hace por dentro en muchos casos)' },
      { flag: '-l', detail: 'lista las señales y sus números ( consulta rápida del catálogo)' },
    ],
    examples: [
      { cmd: 'kill 12345', explain: 'señal suave: TERM, el proceso puede limpiar y cortar con decoro' },
      { cmd: 'kill -9 12345', explain: 'carga instantánea: mata de inmediato (si TERM no funcionó y el proceso está colgado)' },
      { cmd: 'kill -l', explain: 'el catálogo completo de señales (32 estándar)' },
    ],
  },
  {
    cat: 'proc', name: 'pkill', tag: 'kill por NOMBRE/patrón',
    what: 'kill pero por PATRÓN: manda señal a los procesos cuyo nombre coincide con lo que le des. Con -f atraviesa hasta los ARGUMENTOS (la línea de comando completa).',
    syntax: 'pkill [-9] [-f] [-u USER] PATRÓN',
    flags: [
      { flag: '-9', detail: 'SIGKILL literal (por defecto envía TERM)' },
      { flag: '-f', detail: 'FULL: matchea contra la LÍNEA DE COMANDO COMPLETA (path + argumentos), no solo el nombre del binario' },
      { flag: '-u USER', detail: 'solo procesos de ESTE usuario' },
      { flag: '-l', detail: 'lista (en vez de matar) los procesos que ENCAJAN — probar ANTES de matar' },
    ],
    examples: [
      { cmd: 'pkill -f "tail -f /var/log/app.log"', explain: 'caza por línea de comando, no por pid: limpia los watchers huérfanos de un setup' },
      { cmd: 'pkill -u agent -f sleep', explain: 'mata solo TUS procesos sleep — sin tocar procesos de otros usuarios' },
    ],
    tips: ['regla de dedo del dojo: SIEMPRE pkill -l patrón antes de pkill -9 -f: podrías matar los procesos equivocados'],
  },
  {
    cat: 'proc', name: 'jobs / bg / fg', tag: 'gestión de trabajos del shell',
    what: 'Los procesos que lanzas CON & quedan «trabajos» de ESTE shell: jobs los lista, fg los trae al frente, bg los reanuda en fondo (tras Ctrl+Z), disown los libera del shell.',
    syntax: 'jobs · fg %n · bg %n · %n &',
    flags: [
      { flag: '%1', detail: 'el trabajo n.º 1 (como lo lista jobs)' },
      { flag: 'Ctrl+Z', detail: 'STOP a un proceso en primer plano: queda pausado y el shell lo etiqueta «[1]+ Stopped» — después bg o fg' },
    ],
    examples: [
      { cmd: 'sleep 60 &', explain: 'al fondo: te devuelve el prompt inmediatamente y te marca el trabajo [1]' },
      { cmd: 'jobs -l', explain: 'jobs con PID incluido — útil para luego kill %1 o el PID directamente' },
      { cmd: 'fg %1', explain: 'trae al primer plano el trabajo 1 (Ctrl+Z tras eso lo PAUSA y puedo meterlo con bg %1 a fondo)' },
    ],
  },
  {
    cat: 'proc', name: 'nice', tag: 'prioridad de CPU ajustada',
    what: 'Lanza el comando con una «amabilidad» distinta (por defecto +10, que es MENOS prioridad). El «nice» positivo es educado (cede CPU); el negativo exige ser root. Perfecto para batch en producción sin mover lo interactivo.',
    syntax: 'nice [-n N] comando',
    flags: [
      { flag: '-n N', detail: 'incremento exacto del niceness: -n 15 es MUY amable, -n -5 (requiere root) es lo contrario' },
      { flag: 'renice', detail: 'cambia la prioridad de un proceso YA en marcha: renice -n 10 -p PID' },
    ],
    examples: [
      { cmd: 'nice -n 19 python3 pesado.py', explain: 'el sistema atiende primero lo interactivo y deja madurar lo batch' },
      { cmd: 'sudo renice -n -5 -p 1234', explain: 'sube la prioridad (negativo = menos nice) de un proceso crítico, con root' },
    ],
  },
  {
    cat: 'proc', name: 'df', tag: 'espacio en los FILESYSTEMS montados',
    what: 'Disco Libre por filesystem: capacidad, usado, libre y % de uso, con el punto de montaje. El du responde «cuánto pesa esta CARPETA»; el df responde «cuánto queda en este VOLUMEN».',
    syntax: 'df [-h] [ruta]',
    flags: [
      { flag: '-h', detail: 'human: tamaños en K/M/G con sufijo, no en bloques de 1K' },
      { flag: '-i', detail: 'INODES: un filesystem puede estar «lleno» aunque los bytes digan lo contrario (un flood de ficheros pequeñitos)' },
      { flag: '-T', detail: 'muestra el TIPO de fs (ext4, tmpfs, overlay…)' },
    ],
    examples: [
      { cmd: 'df -h', explain: 'panorama del disco: todos los mounts con sus medidas legibles' },
      { cmd: 'df -h /var/log', explain: 'solo el filesystem de /var/log: el volumen que interesa para pensar en logrotate' },
    ],
  },
  {
    cat: 'proc', name: 'du', tag: 'cuánto ocupa una carpeta',
    what: 'Disk Usage: recorre directorios y suma tamaños de los ficheros (no le interesa el volumen ni los mounts: mide el contenido). Su combo habitual con sort y head es el «¿qué se está comiendo el disco?».',
    syntax: 'du [-sh] [-a] [ruta…]',
    flags: [
      { flag: '-s', detail: 'solo el TOTAL del directorio, sin desglose interno' },
      { flag: '-h', detail: 'human-readable (K, M, G)' },
      { flag: '-a', detail: 'cuenta también los ficheros (árbol completo, no solo carpetas)' },
    ],
    examples: [
      { cmd: 'du -sh /var/log', explain: 'el total de UNA carpeta en una línea' },
      { cmd: 'du -h /var | sort -rh | head -10', explain: 'top 10 de subdirectorios más pesados bajo /var: la receta clásica de limpieza' },
      { cmd: 'du -ah | sort -rh | head', explain: 'con -a, fichero a fichero y no solo directorios' },
    ],
  },
  {
    cat: 'proc', name: 'systemctl', tag: 'el mando de los servicios SYSTEMD',
    what: 'Control por unidad (servicios, timers): start/stop/restart/reload, enable/disable al boot, status con los últimos logs. En el dojo el «simulado» del sistema aparece en los niveles de procesos/sistema.',
    syntax: 'systemctl ACCIÓN unidad…',
    flags: [
      { flag: 'start / stop', detail: 'arranca / detiene el servicio AHORA' },
      { flag: 'restart', detail: 'para + arranca (se pierden las sesiones internas del servicio)' },
      { flag: 'reload', detail: 'recarga la CONFIG sin cortar el servicio (solo si el programa lo ofrece: nginx y sshd lo hacen)' },
      { flag: 'status', detail: 'estado + los últimos logs + la línea de estado; la mira del «por qué está en failed»' },
      { flag: 'enable / disable', detail: 'afecta AL BOOT: arrancará (o no) de nuevo con la máquina' },
      { flag: 'is-active', detail: 'solo dice ACTIVE/INACTIVE/FAILED y pone exit apropiado — perfecto para scripts' },
      { flag: 'list-units', detail: 'listado de lo cargado; con --type=service filtras' },
    ],
    examples: [
      { cmd: 'systemctl status sshd', explain: 'estado activo/dead, PID, memoria y las últimas líneas del journal del servicio' },
      { cmd: 'sudo systemctl restart sshd && systemctl is-active sshd', explain: 'restart y verificación al vuelo' },
      { cmd: 'systemctl is-enabled sshd', explain: 'la pregunta del arranque: ¿se irá con la máquina? (enabled/disabled)' },
    ],
  },
  {
    cat: 'proc', name: 'uptime / hostname / whoami', tag: 'el «quién es quién» al instante',
    what: 'Tres identidades rápidas: uptime (tiempo encendido + carga media 1/5/15 min), hostname (nombre del host; -I da IPs) y whoami (el USUARIO ACTIVO, no el dueño del terminal).',
    syntax: 'uptime · hostname [-I] · whoami',
    flags: [
      { flag: '-I', detail: '(hostname) las IPs del host — la salida sin -I es el nombre, que muchas veces también basta' },
    ],
    examples: [
      { cmd: 'uptime && whoami', explain: 'carga media y usuario de la sesión, en dos comandos de un latido' },
      { cmd: 'hostname -I', explain: 'la dirección IP (en contenedor con red «none»: lo que interesa es localhost)' },
    ],
  },

/* ══════════════ net ══════════════ */
  {
    cat: 'net', name: 'ss', tag: 'estado de sockets y puertos',
    what: 'Socket Statistics: el sustituto moderno de netstat. Muestra qué PUERTOS están abiertos (con -l), qué proceso los escucha (-p, requiere permisos) y las conexiones ESTABLECIDAS con el resto de estados.',
    syntax: 'ss [-tlnp] [opciones]',
    flags: [
      { flag: '-t', detail: 'solo TCP (con -u ves UDP)' },
      { flag: '-l', detail: 'LISTENING: los puertos EN ESCUCHA (los «puertos abiertos» del servidor)' },
      { flag: '-n', detail: 'numérico: NO resuelve nombres de host ni servicios (más rápido y fiable en scripts)' },
      { flag: '-p', detail: 'procesos: muestra el PID/nombre del proceso dueño del socket (requiere los derechos necesarios)' },
      { flag: '-a', detail: 'todos los estados, no solo LISTEN (incluye ESTAB, etc.)' },
    ],
    examples: [
      { cmd: 'ss -tln', explain: 'los puertos TCP EN ESCUCHA del host: el primer examen de cualquier config' },
      { cmd: 'ss -tlnp | grep 5353', explain: 'un port concreto en detalle: PID y nombre del proceso (aquí: dnsmasq) que lo atiende' },
      { cmd: 'ss -tn state established', explain: 'conexiones ESTABLECIDAS («¿quién se conecta a mí ahora mismo?»)' },
    ],
  },
  {
    cat: 'net', name: 'nc', tag: 'TCP/UDP a mano (el «cuchillo suizo» de la red)',
    what: 'netcat: cliente/servidor TCP-UDP blazing-fast. Conecta a cualquier puerto para enviar bytes (HTTP a mano, SMTP a mano, pruebas de sugerencia), o ESCUCHA con -l para recibir. En el dojo es «el cliente de red» básico.',
    syntax: 'nc [opciones] host puerto',
    flags: [
      { flag: '-l', detail: 'listen: modo servidor, espera conexiones (nc -l 9999 es una casita escuchando el 9999)' },
      { flag: '-z', detail: 'scan: COMPRUEBA el puerto SIN mandar datos (exit 0 si está abierto) — «¿hay algo ahí?»' },
      { flag: '-u', detail: 'UDP en vez de TCP' },
      { flag: '-v', detail: 'verbose: imprime la conexión/éxito' },
      { flag: '-w N', detail: 'timeout de N segundos para conexiones y lecturas' },
    ],
    examples: [
      { cmd: 'nc -zv 127.0.0.1 80', explain: 'ver si el puerto 80 está abierto: -z y -v en la misma frase' },
      { cmd: 'echo "GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n" | nc 127.0.0.1 8080', explain: 'HTTP A MANO: pides la página a pelo y el servidor responde con cabeceras + cuerpo' },
      { cmd: 'nc -l 9000', explain: 'SERVIDOR mínimo: todo lo que envíe un nc cliente host:9000 aparece aquí' },
    ],
  },
  {
    cat: 'net', name: 'curl', tag: 'HTTP desde la terminal',
    what: 'client URL: pide URLs (HTTP/HTTPS y otros protocolos) e imprime la respuesta al stdout. La navaja suiza: cabeceras (-I), POST (-d), seguir redireccionamientos (-L), guardar (-o). En el dojo solo habla al host local (ninguna red externa).',
    syntax: 'curl [opciones] URL',
    flags: [
      { flag: '-s', detail: 'silent: sin barras de progreso ni errores a la terminal (ideal en pipelines)' },
      { flag: '-S', detail: 'con -s, muestra errores igual (silent + show errors = la combo perfecta de script)' },
      { flag: '-I', detail: 'HEAD: solo las CABECERAS de respuesta (el estado HTTP 200 OK, Location, etc.)' },
      { flag: '-L', detail: 'SIGUE los redireccionamientos (301/302) hasta el destino final' },
      { flag: '-d "..."', detail: 'POST con body (form-urlencoded por defecto; -H "Content-Type: application/json" para JSON)' },
      { flag: '-o FICH', detail: 'escribe la respuesta a un FICHERO; -O usa el nombre remoto' },
      { flag: '-w "%{http_code}"', detail: 'format value tras la transferencia (el código HTTP de la respuesta, p. ej. 200)' },
      { flag: '-H "Cabecera: valor"', detail: 'añade/graba cabeceras de la petición (auth, content-type, custom)' },
      { flag: '-X METHOD', detail: 'fuerza el método HTTP (GET/POST/PUT/DELETE) — para POST con -d ya no es necesario' },
      { flag: '-u user:pass', detail: 'credenciales (basic auth)' },
    ],
    examples: [
      { cmd: 'curl -s 127.0.0.1:8080', explain: 'descarga la página y la imprime: el «fetch» de la terminal' },
      { cmd: 'curl -sI 127.0.0.1:8080 | head -n 1', explain: 'solo la primera línea (HTTP/1.1 200 OK): el «¿está vivo?» de una línea' },
      { cmd: 'curl -s -o items.json -w "%{http_code}\\n" 127.0.0.1:8080/api/items', explain: 'guardar a fichero Y sacar el código de estado: dato + comprobación de golpe' },
      { cmd: 'curl -s -H "Content-Type: application/json" -d \'{"id":7}\' -X POST 127.0.0.1:8080/api', explain: 'POST de JSON al API local: cabecera + body + método = testing de API sin navegador' },
    ],
  },
  {
    cat: 'net', name: 'wget', tag: 'descarga de ficheros HTTP',
    what: 'El downloader por excelencia: ideal para UNA descarga de archivo o un espejo recursivo (-r). Menos versátil que curl y más obstinado (reintentos, mirrors).',
    syntax: 'wget [-O salida] URL',
    flags: [
      { flag: '-O FICH', detail: 'output, guarda con ESTE nombre' },
      { flag: '-c', detail: 'continue: reanuda una descarga interrumpida' },
      { flag: '-q', detail: 'quiet: sin barras ni mensajes' },
    ],
    examples: [
      { cmd: 'wget -q -O paquete.deb 127.0.0.1:8080/paquete.deb', explain: 'descarga silenciosa a un nombre concreto' },
      { cmd: 'wget -c http://127.0.0.1:8080/big.zip', explain: 'reanuda la descarga si se cortó (la -c de continue)' },
    ],
  },
  {
    cat: 'net', name: 'ping', tag: '¿responde el host?',
    what: 'Envía paquetes ICMP ECHO y mide el tiempo de respuesta y el porcentaje perdido. La prueba BRUTA de conectividad (no chequea puertos ni servicios, solo «se ve la máquina»). Sin -c jama acaba:',
    syntax: 'ping [-c N] host',
    flags: [
      { flag: '-c N', detail: 'manda N paquetes y termina (por defecto es INFINITO: -c SIEMPRE en scripts)' },
      { flag: '-i N', detail: 'segundos entre pings (por defecto 1)' },
    ],
    examples: [
      { cmd: 'ping -c 3 127.0.0.1', explain: 'comprobación de bucle: la propia máquina responde siempre (el sanity check de la red local)' },
      { cmd: 'ping -c 1 -W 1 host-loco', explain: 'un único intento con timeout: ideal para scripts de detección' },
    ],
  },
/* ══════════════ dns ══════════════ */
  {
    cat: 'dns', name: 'dig', tag: 'consulta DNS a fondo',
    what: 'Domain Information Groper: pregunta a un servidor DNS por CUALQUIER tipo de registro de UN dominio y muestra la respuesta completa (cabeceras, QUESTION/ANSWER/AUTHORITY…). Con @SERVIDOR eliges QUIÉN responde; con +short te quedas con la sustancia.',
    syntax: 'dig [@servidor] [-p PUERTO] [tipo] dominio [+short]',
    flags: [
      { flag: '@8.8.8.8', detail: 'va A OTRO servidor DNS: el que digas, no el de /etc/resolv.conf (clave para probar un dnsmasq local alternativo)' },
      { flag: '-p 5353', detail: 'por otro PUERTO (los dnsmasq de test no escuchan, por lo general, en el estándar 53)' },
      { flag: '+short', detail: 'solo la RESPUESTA, una por línea: perfecto para scripts (parser de la zona ANSWER limpio)' },
      { flag: '+noall +answer', detail: 'suprime todos los bloques menos ANSWER: la salida intermedia entre el crudo y el +short (aún se ve el nombre y el TTL)' },
      { flag: 'ANY', detail: 'pregunta TODOS los tipos de registro del dominio (A, MX, TXT,…)' },
      { flag: '+tcp', detail: 'usa TCP en vez de UDP (respuestas grandes o casos donde el UDP no pasa)' },
      { flag: '+time=N +tries=1', detail: 'timeout de N segundos y un intento (ideal ante servidores que no responden)' },
      { flag: '-x IP', detail: 'resolución INVERSA: pregunta por la PTR de la IP dada (dig -x 1.2.3.4 == dig 4.3.2.1.in-addr.arpa PTR)' },
    ],
    examples: [
      { cmd: 'dig dojo.local', explain: 'consulta estándar (tipo A del dominio): bloque QUESTION, ANSWER con el registro y TTL' },
      { cmd: 'dig +short dojo.local', explain: 'solo la IP (la manera script-friendly)', out: '10.20.30.40' },
      { cmd: 'dig @127.0.0.1 -p 5353 +short TXT firma.dojo.local', explain: 'el patrón de los niveles dns: servidor local en puerto custom + tipo TXT + short. Las TXT llegan entre comillas' },
      { cmd: 'dig +noall +answer dojo.local MX', explain: 'el bloque ANSWER limpio: nombre, TTL, clase, TIPO y valor (y prioridad del MX)' },
      { cmd: 'dig -x 10.20.30.40 +short', explain: 'reverso: la PTR (nombre) de esa IP', out: 'lanza.dojo.local.' },
      { cmd: 'dig +tcp @127.0.0.1 -p 5353 firma.dojo.local TXT', explain: 'misma consulta FORZADA por TCP (el dojo tiene nivel dedicado a este twist)' },
    ],
    tips: ['dnsmasq y bind responden TXT entre COMILLAS: «"flag{…}"» — quítalas con sed/tr si comparas al detalle', 'el nombre con punto FINAL (dojo.local.) es el FQDN: no es un bug'],
  },
  {
    cat: 'dns', name: 'getent', tag: 'consulta como lo hace el C',
    what: 'Interroga las bases de datos del sistema DETRÁS de las librerías C (passwd, group, hosts, services…). No es un simple grep de /etc/passwd: respeta NSS (módulos, LDAP, mdns si los hay). Con hosts resuelve por DNS o /etc/hosts según la config.',
    syntax: 'getent BD clave',
    flags: [
      { flag: 'passwd user', detail: 'el registro DEL usuario como lo resolvería el sistema (uid, gid, home, shell)' },
      { flag: 'hosts nombre', detail: 'resolución de HOST por la vía entera del sistema (getent hosts dojo.local)' },
      { flag: 'services 80', detail: 'el nombre de servicio asociado al puerto 80 (http)' },
    ],
    examples: [
      { cmd: 'getent hosts dojo.local', explain: 'resolución COMPLETA del sistema (no solo dig): puede venir de /etc/hosts o de las DNS de resolv.conf' },
      { cmd: 'getent passwd agent', explain: 'la línea del usuario entera (o «cut -d: -f3» encima para extraer el uid)', out: 'agent:x:1000:1000::/home/agent:/bin/bash' },
    ],
  },

/* ══════════════ svc ══════════════ */
  {
    cat: 'svc', name: 'sshd', tag: 'el daemon de SSH (y su -t)',
    what: 'El SERVIDOR SSH. Directamente NO se arranca en los niveles: lo que se usa es sshd -t, que parsea la CONFIG en memoria y reporta problemas de sintaxis/valores SIN tocar el servicio — el «make check» de sshd_config.',
    syntax: 'sshd -t [-f fichero] [-p puerto-test]',
    flags: [
      { flag: '-t', detail: 'test mode: VALIDA la configuración y sale (salida vacía + exit 0 = correctamente montada)' },
      { flag: '-f FICH', detail: 'config alternativa (p. ej. -f /tmp/testconf para probar un sshd_config borrador)' },
      { flag: '-T', detail: 'test + DUMP de la config EFECTIVA: imprime todas las directivas TRAS los include/defaults (ver influenced de overrides)' },
    ],
    examples: [
      { cmd: 'sudo sshd -t', explain: '¿mi config sshd es válida?: silencio ➜ sí, error → el mensaje lo señala (¡con número de línea!)' },
      { cmd: 'sudo sshd -T | grep -i passwordauthentication', explain: 'la directiva EFECTIVA: comprueba que tu «PasswordAuthentication no» no pisa con otro fichero include' },
    ],
    tips: ['sshd_config.d/*.conf: las directivas del ÚLTIMO include ganan — usa sshd -T y verás la config EFECTIVA de todas'],
  },
  {
    cat: 'svc', name: 'nginx', tag: 'servidor web/proxy y su -t',
    what: 'nginx: el web server/reverse proxy estrella. En terminal, valida SU configuración con nginx -t: parsea TODOS los ficheros de los include, valida y dice «syntax ok / test is successful». Nunca edites nginx.conf sin un -t después.',
    syntax: 'nginx -t [-c fichero] [-p prefix]',
    flags: [
      { flag: '-t', detail: 'test configuration: valida TODO el árbol de includes y sale (exit 0 ok, exit 1 error con mensaje)' },
      { flag: '-c FICH', detail: 'config alternativa (por defecto /etc/nginx/nginx.conf)' },
      { flag: '-s reload', detail: 'recarga MODERNA: relee la config sin cortar conexiones (con un -t previo en el ritual sano)' },
    ],
    examples: [
      { cmd: 'sudo nginx -t', explain: 'valida nginx.conf + todos los site/conf.d incluidos: «syntax is ok» + «test is successful»' },
      { cmd: 'sudo nginx -s reload', explain: 'recarga en caliente tras una edición que ya pasó el -t: sin downtime' },
    ],
  },
  {
    cat: 'svc', name: 'apache2ctl', tag: 'el mando de Apache',
    what: 'Control de apache2: -M lista módulos, configtest (-t) valida la configuración, -S muestra los vhost/puertos. El equivalente funcional de nginx -t cuando el proyecto realmente corre Apache.',
    syntax: 'apache2ctl [-t | configtest | -M | -S]',
    flags: [
      { flag: 'configtest / -t', detail: 'valida la config de apache: «Syntax OK» + exit 0 = listo' },
      { flag: '-M', detail: 'lista los módulos cargados (con los que instaló a2enmod)' },
      { flag: '-S', detail: 'esquema de vhosts y sus puertos (qué escucha cada «NameVirtualHost»)' },
    ],
    examples: [
      { cmd: 'sudo apache2ctl configtest && echo ok', explain: 'valida la configuración completa de apache2' },
      { cmd: 'apache2ctl -M | grep ssl', explain: '¿está cargado el módulo SSL? (mod_ssl si ha sido cargado)' },
    ],
  },
  {
    cat: 'svc', name: 'dpkg', tag: 'el gestor de paquetes .deb',
    what: 'El nivel BAJO de la pila Debian (apt usa dpkg debajo). Consultas típicas: dpkg -l lista instalados, dpkg -L paquete lista los ficheros instalados de UN paquete, dpkg -S fichero dice qué paquete lo trae.',
    syntax: 'dpkg [-l|-L|-S] [paquete|fichero]',
    flags: [
      { flag: '-l', detail: 'lista los paquetes INSTALADOS (con la columna de estado: ii = installed ok)' },
      { flag: '-L PAQUETE', detail: 'los FICHEROS que instaló un paquete (rutas incluidas las de configuración)' },
      { flag: '-S /ruta/fichero', detail: 'a QUÉ paquete pertenece el fichero (la tabla inversa de -L)' },
      { flag: '-i fich.deb', detail: 'instala manualmente un .deb (en distros suele usarse apt, que resuelve dependencias)' },
    ],
    examples: [
      { cmd: 'dpkg -l | grep -i cron', explain: '¿está instalado cron? la -l + grep es la consulta moderna' },
      { cmd: 'dpkg -L rdnssd | grep bin', explain: 'qué binarios aportó ese paquete: directo del inventario' },
    ],
  },
  {
    cat: 'svc', name: 'ldd', tag: '¿qué librerías necesita este binario?',
    what: 'Imprime las librerías COMPARTIDAS (.so) que un ejecutable ENLAZA al arrancar, con la RUTA resuelta. Diagnóstico del «¿por qué no arranca?»: librería que falta, o el binario es estático («not a dynamic executable»).',
    syntax: 'ldd binario',
    flags: [
      { flag: '-r', detail: 'también chequea los símbolos (funciones) que faltan' },
    ],
    examples: [
      { cmd: 'ldd /bin/ls', explain: 'la lista de libs libc/libacl del ls: lo que bash cargaría al arrancarlo' },
      { cmd: 'ldd /usr/bin/somebin 2>&1 | grep "not found"', explain: 'la receta del comando que no arranca: «not found» en una librería es la pista' },
    ],
  },

/* ══════════════ sql ══════════════ */
  {
    cat: 'sql', name: 'sqlite3', tag: 'la BD embebida del shell',
    what: 'sqlite3: UN FICHERO que ES una base de datos. El cli abre/crea ese fichero, corre SQL (por argumento, stdin o heredoc) y puede devolver en modos CSV/JSON/columnas. En el dojo es la herramienta del track sql.',
    syntax: 'sqlite3 [-header] [-column] bd.sqlite ["SQL"]',
    flags: [
      { flag: 'bd.sqlite', detail: 'el fichero ES la BD: si no existe, sqlite3 lo crea vacío (ojo: un typo te crea una BD nueva y te quedas mirando la equivocada)' },
      { flag: '"SQL"', detail: 'SQL en una línea: sqlite3 datos.db "SELECT * FROM t;" — pide el ; dentro de las comillas' },
      { flag: '-header', detail: 'imprime los NOMBRES de columna como primera fila (legibilidad de tabla)' },
      { flag: '-column', detail: 'columnas alineadas con espacios (el modo por defecto separa con |)' },
      { flag: '-csv / -json', detail: 'salida CSV / JSON (import/export a otras tools sin esfuerzo)' },
      { flag: '.tables', detail: 'comando PUNTO del cli: lista las tablas de la BD (lo primero que se pregunta)' },
      { flag: '.schema tabla', detail: 'el CREATE TABLE REAL de una tabla (tipos, PK, NOT NULL)' },
      { flag: '.read fichero.sql', detail: 'ejecuta un script .sql dentro de la sesión' },
      { flag: '.quit / .exit', detail: 'salir de la consola interactiva' },
    ],
    examples: [
      { cmd: 'sqlite3 datos.db "SELECT nombre FROM alumnos WHERE nota >= 5;"', explain: 'SQL en línea: los alumnos aprobados' },
      { cmd: 'sqlite3 datos.db ".tables"', explain: '¿qué tablas hay? (el primer paso antes de SELECTeear a ciegas)' },
      { cmd: 'sqlite3 datos.db <<SQL\nSELECT COUNT(*), tipo FROM items GROUP BY tipo;\nSQL', explain: 'heredoc para un SQL multilínea: el shell le pasa TODO el bloque como stdin' },
    ],
    tips: ['PRAGMA table_info(taba) te cuenta las columnas — así nunca adivinas nombres', 'la BD es un fichero más: se copia/mueve/comprime como cualquier otro, sin servidor'],
  },
/* ══════════════ shell ══════════════ */
  {
    cat: 'shell', name: 'echo', tag: 'imprime texto',
    what: 'Escribe sus argumentos a stdout con un salto final. Con -e interpreta escapes (\\n, \\t, \\r). Para valores con formato, printf es más fiable (echo varía entre shells).',
    syntax: 'echo [-e] [-n] texto…',
    flags: [
      { flag: '-e', detail: 'interpreta SECUENCIAS de escape: \\n salto, \\t tabulador, \\r carriage return' },
      { flag: '-n', detail: 'SIN salto de línea final (para construir salidas en línea)' },
    ],
    examples: [
      { cmd: 'echo "hola $USER"', explain: 'interpolación de variable dentro de DOBLE comillas (con comillas simples NO se expande)' },
      { cmd: 'echo -e "a\\nb"', explain: 'dos líneas con un solo echo' },
      { cmd: 'echo "ok" > status.txt', explain: 'redirección: crea/sobrescribe; con >> AÑADE en vez de reescribir' },
    ],
  },
  {
    cat: 'shell', name: 'printf', tag: 'formato estilo C',
    what: 'printf FORMATO args: la forma PRECISA de escribir texto: %s cadena, %d entero, %f flotante, %.2f con decimales, \\n salto, \\t tab. NO añade salto de línea si no lo pides, y reutiliza el formato si le das más argumentos que conversiones.',
    syntax: 'printf FORMAT [args…]',
    flags: [
      { flag: '%s', detail: 'cadena' },
      { flag: '%d', detail: 'entero (decimal)' },
      { flag: '%-10s', detail: 'justificado IZQUIERDA en campo de 10 (para tablas de terminal)' },
      { flag: '%.2f', detail: 'flotante con 2 decimales' },
      { flag: '\\n', detail: 'salto de línea (printf NO lo añade solo, a diferencia del echo)' },
    ],
    examples: [
      { cmd: 'printf "%s: %d\\n" errores 42', explain: 'salida SIN ambigüedad (sin depender del -e ni de las costumbres del echo)', out: 'errores: 42' },
      { cmd: 'printf "%-10s %5d\\n" cpu 90 memoria 66', explain: 'columnas alineadas: %-10s fija el ancho del texto, %5d el del número', out: 'cpu            90\nmemoria        66' },
    ],
  },
  {
    cat: 'shell', name: 'builtins: export / source / env / exit', tag: 'el entorno y el estado del shell',
    what: 'export marca variables como VISIBLES para los procesos hijos; source (o «.») ejecuta un script DENTRO del shell ACTUAL (no en un hijo: sus variables SÍ sobreviven); env imprime (o lanza con) el entorno; exit termina con el código dado (¿$? es el último exit).',
    syntax: 'export VAR=valor · source fichero · env · exit N',
    flags: [
      { flag: 'VAR="${...}"', detail: 'INTERPOLACIÓN con $var entre dobles comillas: var=$(cmd) ALMACENA el STDOUT del comando' },
      { flag: 'source / .', detail: 'source (alias «.») NO crea proceso hijo: lo que el script toque (variables, cd) queda en TU shell' },
    ],
    examples: [
      { cmd: 'export PATH="$HOME/.local/bin:$PATH"', explain: 'agregar mi bin delante: el clásico de .bashrc' },
      { cmd: 'source ~/.bashrc', explain: 'recargar la config SIN cerrar la terminal (re-source en el shell vivo)' },
      { cmd: 'env | grep -i flag', explain: 'variables de entorno filtradas (el dojo prohíbe inyectar la flag vía inventario: la validación es en servidor)' },
    ],
  },
  {
    cat: 'shell', name: 'test / [[ ]] y if/case/for/while', tag: 'condicionales y bucles: la «lógica» del shell',
    what: '[ expresión ] y [[ expresión ]] evalúan condiciones (-eq/-lt numéricas, = para cadenas, -f/-d ficheros, -z vacío); if/elif/else bucles; case; for x in …; while/until; y comandos como seq. Presta atención: los ESPACIOS entre corchetes son obligatorios.',
    syntax: 'if [[ cond ]]; then …; fi · for x in a b c; do …; done · while read -r line; do …; done < fichero',
    flags: [
      { flag: '-eq -ne -lt -le -gt -ge', detail: 'comparaciones NUMÉRICAS de test (¡no se usa < > con números en los test clásicos!)' },
      { flag: '= / == / !=', detail: 'comparaciones de CADENAS (en test único es =)' },
      { flag: '-f / -d / -e', detail: 'existe el FICHERO / el DIRECTORIO / (cualquier cosa) — la tríada test de ficheros' },
      { flag: '-z / -n', detail: 'cadena VACÍA (-z) / NO vacía (-n) — comparar variables opcionales' },
      { flag: '&& / ||', detail: 'AND / OR del shell: cmd1 && cmd2 (si 1 sale ok ejecuta 2); cmd1 || cmd2 (si 1 FALLA, ejecuta 2) — el idiom «cmd || fallback»' },
    ],
    examples: [
      { cmd: 'if [[ -f config.ini ]]; then echo "existe"; fi', explain: 'la forma moderna (doble corchete, sin word-splitting) del test de fichero' },
      { cmd: '[[ "$n" -gt 10 ]] && echo grande || echo pequeño', explain: 'el if EN UNA LÍNEA: && y || hacen de then/else' },
      { cmd: 'for f in *.log; do echo "== $f =="; done', explain: 'BUCLE sobre un glob: el patrón de «procesar todos los ficheros»' },
      { cmd: 'while read -r line; do echo "$line"; done < lista.txt', explain: 'leer un fichero LÍNEA a LÍNEA robustamente (el -r evita que bash des-escape los \\)' },
      { cmd: 'case "$op" in add) echo "+" ;; sub) echo "-" ;; *) echo "?" ;; esac', explain: 'switch del bash: cada patrón ANTES, la acción DESPUÉS con ;;, y el * es el catch-all' },
    ],
  },
  {
    cat: 'shell', name: 'getopts / trap / set', tag: 'banderas de scripts y señales limpias',
    what: 'getopts parsea OPCIONES cortas de tu script (while getopts "a:f:"); trap EJECUTA una acción al recibir señal (limpieza sobre SIGINT/EXIT); set -e abandona al FALLAR una instrucción, set -u error ante variable NO declarada, set -x traza de cada comando.',
    syntax: 'while getopts "f:n" opt; do …; done · trap cleanup EXIT · set -euo pipefail',
    flags: [
      { flag: '"a:f:"', detail: 'opciones SIN valor (a) o CON valor (f — los dos puntos después del f son lo que lo marca)' },
      { flag: 'trap cmd EXIT', detail: 'al salir (Ctrl+C incluido si cachas las SIG): el EXIT corre SIEMPRE al terminar el script' },
      { flag: 'set -e', detail: 'abandonar si falla algo (con las casuísticas de contexto que puede que parezcan entornos někdy raras) — el gold standard de los setups' },
      { flag: 'set -u', detail: 'error al usar variable NO declarada (unset flag: cazarse con un typo de golpe)' },
      { flag: 'set -x', detail: 'traza de TODA la ejecución (muestra los comandos tal como el shell los expandió) — debug interactivo' },
      { flag: 'set -o pipefail', detail: 'un pipeline devuelve el código del PRIMER comando que falla (sin esto, el exit es SOLO el del último y un grep del medio «falló» no se enteraría)' },
    ],
    examples: [
      { cmd: 'set -euo pipefail', explain: 'la cláusula STRICT del bash moderno: abandona al fallo, no acepta variables inexistentes y los tuberías propagan el fallo de verdad' },
      { cmd: 'trap "rm -f /tmp/lock" EXIT', explain: 'limpieza GARANTIZADA: como salga (éxito, error, Ctrl+C), /tmp/lock se borra' },
    ],
  },
  {
    cat: 'shell', name: 'timeout', tag: 'da límite de tiempo a un comando',
    what: 'Ejecuta el comando dado y lo MATA si no ha terminado en N segundos (SIGTERM; con -k K manda KILL K segundos después). Anti-atascos en scripts y «¿responde o no?» medible.',
    syntax: 'timeout [opciones] DURACIÓN comando…',
    flags: [
      { flag: '10s / 2m / 1h', detail: 'formato flexible de la DURACIÓN: segundos, minutos, horas; el default es segundos si pones solo número' },
      { flag: '-k 5', detail: 'después del TERM, a los 5 segundos más MANDA SIGKILL (para procesos que ignoran los TERM) — soporta alcuni terminadores PERESOSOS' },
      { flag: '--preserve-status', detail: 'devuelve el EXIT del comando (si muere por timeout sale con 124 — algo que puedes VERIFICAR)' },
    ],
    examples: [
      { cmd: 'timeout 5 curl -s 127.0.0.1:8080 || echo "no respondió en 5s"', explain: 'medidor de servicio lento: si no contesta a los 5, pasa al || del error' },
      { cmd: 'timeout 10s tail -f log.txt', explain: '«monta un tail» durante 10 segundos y corta: el patrón de checkout de logs pasajero' },
    ],
  },
  {
    cat: 'shell', name: 'bc', tag: 'la calculadora de precisión arbitraria',
    what: 'Calcula operaciones por stdin o fichero: suma, resta, multiplicación, división CON DECIMALES, potencias, módulo y variables. La forma estándar de hacer aritmética «fiable» en bash ($((...)) solo entiende enteros).',
    syntax: 'echo "2 + 2" | bc · bc -l',
    flags: [
      { flag: '-l', detail: 'carga la math-library: sqrt, exponencial, log, y 20 decimales por defecto' },
      { flag: 'scale=N', detail: 'fija el n.º de decimales (por defecto 0: la división «7/2» con scale 0 = «3»!)' },
    ],
    examples: [
      { cmd: 'echo "7/2" | bc', explain: 'por defecto da entero (el scale por defecto es 0)', out: '3' },
      { cmd: 'echo "scale=4; 7/2" | bc', explain: 'con scale: 4 decimales', out: '3.5000' },
      { cmd: 'paste -sd+ nums.txt | bc', explain: 'SUMA de una lista: convierte «1\\n2\\n3» en «1+2+3» y bc la evalúa de golpe' },
    ],
  },
  {
    cat: 'shell', name: 'python3', tag: 'el as de espadas de última instancia',
    what: 'El intérprete Python, útil cuando grep/sed/awk no dan el paso o la lógica es compleja. -c ejecuta código inline; los heredocs «python3 <<EOF» construyen scripts completos SIN ficheros intermedios.',
    syntax: 'python3 [-c CODE] [script.py] · python3 <<EOF',
    flags: [
      { flag: '-c', detail: 'código EN LÍNEA: python3 -c "print(2+2)" — el one-liner por excelencia' },
      { flag: '<<EOF', detail: 'heredoc: el shell inyecta el BLOQUE COMPLETO como stdin del python (script sin fichero)' },
      { flag: '-i / -u', detail: 'modo interactivo; -u unbuffered (imprime al instante en pipes — favorito de logs de containers)' },
    ],
    examples: [
      { cmd: "python3 -c \"print(open('fich.txt').read().count('lala'))\"", explain: 'un conteo que en grep -o se llevaría tres tuberías: en python es una línea' },
      { cmd: 'python3 <<PY\nimport json,sys\nprint(json.dumps({"ok": True}))\nPY', explain: 'heredoc: código COMPLETO sin fichero intermedio — el dojo lo usa mucho en setup/soluciones' },
    ],
  },

/* ══════════════ dojo ══════════════ */
  {
    cat: 'dojo', name: 'submit', tag: 'el comando QB de todo el dojo',
    what: 'Comando del DOJO (no del sistema): envía la flag que acabas de conseguir para que el servidor la valide. La flag cambia en cada sesión (FLAG{…} con hex aleatorio) — es «tu» flag, no la que aparece en los documentos.',
    syntax: 'submit FLAG{tu-flag}',
    flags: [
      { flag: '-h', detail: 'ayuda del comando interno' },
      { flag: 'FLAG{…}', detail: 'el hex entre las llaves es LO IMPORTANTE: cópialo EXACTO de la salida del nivel (incluido el FLAG{ del inicio)' },
    ],
    examples: [
      { cmd: 'submit FLAG{a1b2c3d4e5f6…}', explain: 'la entrega: si es correcta, +XP, rango actualizado, y el motor libera el siguiente nivel' },
      { cmd: 'submit flag(sin-llaves)', explain: 'formato erróneo: el validador exige EXACTAMENTE «FLAG{…}» — sin las llaves no pasa' },
    ],
  },
  {
    cat: 'dojo', name: 'hint / solution / goal / status / reset', tag: 'los apoyos del dojo',
    what: 'hint pide la siguiente PISTA progresiva (cada una cuesta -10 XP); solution REVELA la solución completa (queda registrada, y el XP del nivel se resiente); goal reimprime EL OBJETIVO del nivel; status muestra tu XP/rango/progreso; reset devuelve el entorno del nivel a su estado original (para replantear limpio).',
    syntax: 'hint · solution · goal · status · reset',
    flags: [
      { flag: 'hint', detail: 'la próxima pista SIN regalar la solución: -10 XP por uso, suelo del 30 % del valor del nivel' },
      { flag: 'solution', detail: 'el modo «se la doy resuelta»: reimprime TODO el nivel con su solución (gran pérdida de XP en un intento)' },
      { flag: 'goal', detail: 'reimpresión del objetivo con el contexto de la flag (por si te perdiste)' },
      { flag: 'status', detail: 'una línea de XP, rango, niveles resueltos y el nivel actual' },
      { flag: 'reset', detail: 'devuelve el nivel al papel en blanco: ideal cuando rompes algo a mitad y quieres empezar de cero' },
    ],
    examples: [
      { cmd: 'hint', explain: 'pide la pista n.º 1: textual y cuesta -10 XP, úsala solo si el nivel está bloqueado de verdad' },
      { cmd: 'reset', explain: '«esta escena está hecha un lío: empecemos» — el estado vuelve limpio, como al abrir la sesión' },
    ],
  },
  {
    cat: 'dojo', name: 'dojo-verificar', tag: 'el verificador de los niveles sysadmin',
    what: 'Comando que INSTALAN los niveles específicos (sysadmin y dns/sql): comprueba paso a paso que tu estado del sistema está CORRECTO (config funcionando, datos en su sitio, permisos) y, si todo va bien, DESCUBRE la flag en la salida. Es el «checker» del nivel con criterio técnico.',
    syntax: 'dojo-verificar ID-de-nivel',
    flags: [
      { flag: 'sshd-auth', detail: '(sysadmin) test oficial: directivas del PasswordAuthentication/PubkeyAuthentication + sshd -t' },
      { flag: 'dns-zone / dns-tcp / dns-log', detail: '(dns) revisa los registros o el comportamiento del resolver del nivel' },
      { flag: 'sql-crud / sql-agg', detail: '(sql) revisa el estado de la base de datos y los resultados esperados' },
    ],
    examples: [
      { cmd: 'dojo-verificar sshd-auth', explain: 'si tu sshd está bien configurado, la flag llega IMPRESA al stdout al final' },
    ],
  },
];

/** RAW ya viaja con la 'cat' en cada ficha. */
export const COMMANDS: CsCmd[] = RAW;

export const CHEATSHEET_META = {
  total: COMMANDS.length,
  sections: SECTIONS.length,
  flags: COMMANDS.reduce((n, c) => n + c.flags.length, 0),
  examples: COMMANDS.reduce((n, c) => n + c.examples.length, 0),
};
