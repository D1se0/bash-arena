#!/usr/bin/env node
/**
 * gen-levels4 — escribe l19.yaml y l20.yaml en cada track (22 niveles nuevos).
 * Igual que los generadores anteriores: no necesita ejecutarse en runtime;
 * los YAML quedan en levels/ y se cargan desde disco.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const levels = [];

const lv = (track, num, title, subtitle, xp, diff, brief, goal, hints, teach, setup, solution, cheatsheet, profile) => {
  levels.push({ track, num, title, subtitle, xp, diff, brief, goal, hints, teach, setup, solution, cheatsheet, profile });
};

/* ── fundamentos ─────────────────────────────────────────────── */

lv('fundamentos', 19, 'Vecindad sin nombre', 'find por nombre (n Go a buscar sin extensión)', 30, 2,
`> El barrio "barrio" está lleno de vecinos con apellidos (extensiones).
> Pero el contrabando viaja en el único vecino SIN apellido: un fichero
> cuyo nombre no lleva ningún punto. Encuéntralo y lee su contenido.`,
`Muestra el contenido del único fichero del árbol ~/barrio cuyo nombre NO contiene punto (los demás son señuelos con extensiones).`,
[
  'find recorre árboles: find ~/barrio -type f lista todos los ficheros.',
  'El patrón ! -name \'*.*\' niega nombres con punto.',
  'find permite ejecutar sobre los resultados: -exec cat {} +',
],
`find busca ficheros en un árbol. Con \`-name '*.*'\` fichas los que llevan punto
(una "extensión"); el \`!\` delante niega la condición. Los múltiples {}\` de
\`-exec ... {}\` se llenan con cada resultado y el \`+\` agrupa en un solo cat.

    find ~/barrio -type f ! -name '*.*' -exec cat {} +`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Fundamentos"
rm -rf /home/agent/barrio
mkdir -p /home/agent/barrio/{casa1,casa2}
echo "propina: compra más pan" > /home/agent/barrio/pan.txt
echo "propina: volver tarde" > /home/agent/barrio/casa1/copa.txt
echo "recado: sin Keys" > /home/agent/barrio/casa2/nota.md
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /home/agent/barrio/entrega
chown -R agent:agent /home/agent/barrio`,
`find ~/barrio -type f ! -name '*.*' -exec cat {} +`,
[
  { cmd: 'find DIR -name PATRÓN', desc: 'busca por nombre dentro de DIR' },
  { cmd: '! -name ...', desc: 'niega el patrón (lo que NO coincide)' },
  { cmd: '-exec cmd {} +', desc: 'ejecuta cmd con los resultados' },
]);

lv('fundamentos', 20, 'La guía invertida', 'tac + rev: leer al revés', 30, 2,
`> Un vendedor callejero te entrega su libreta de contactos, pero está
> escrita al revés: las líneas van de abajo a arriba y cada línea está
> volteada letra a letra. La única línea con :FLAGVEZ: al secundar
> (con su contenido también volteado) es la que buscas.`,
`Muestra la flag del fichero ~/guia.txt tal como se escribió originalmente (deshaz el orden de líneas y el de letras de cada línea).`,
[
  'tac imprime las líneas en orden inverso (cat al revés).',
  'rev invierte los caracteres de cada línea.',
  'Encadena ambos: tac fichero | rev — y observa qué línea queda limpia.',
],
`tac es cat con las líneas en orden inverso; rev voltea los caracteres de cada
línea. Combinados deshacen cualquier "escritura al revés":

    tac ~/guia.txt | rev

La línea que contiene el texto de la flag quedará legible en la salida.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Fundamentos"
printf '%s\\n' "$(printf 'señuelo del tejado' | rev)" > /home/agent/guia.txt
printf '%s\\n' "$(printf '%s' "$DOJO_FLAG" | rev)" >> /home/agent/guia.txt
printf '%s\\n' "$(printf 'señuelo del sótano' | rev)" >> /home/agent/guia.txt
chown agent:agent /home/agent/guia.txt`,
`tac ~/guia.txt | rev`,
[
  { cmd: 'tac', desc: 'imprime el fichero con las líneas invertidas' },
  { cmd: 'rev', desc: 'invierte los caracteres de cada línea' },
]);

/* ── filtrado ────────────────────────────────────────────────── */

lv('filtrado', 19, 'El evento único', 'sort + uniq: cazar lo no repetido', 35, 2,
`> El radar del dojo registró cientos de eventos... y todos se repiten
> salvo uno. Regla del dojo: lo que ocurre una sola vez es lo que
> importa. Y esa única aparición es la flag.`,
`Extrae de ~/eventos.txt la única línea que NO está repetida (todas las demás aparecen 2 o más veces).`,
[
  'sort necesita ordenar antes de uniq: uniq solo agrupa líneas adyacentes.',
  'uniq -d deja las REPETIDAS; uniq -u se queda con las ÚNICAS.',
  'sort ~/eventos.txt | uniq -u',
],
`uniq compara solo con la línea anterior, así que antes se ordena con sort.
-u (unique) imprime únicamente las líneas que no se repiten (descarta copias).

    sort ~/eventos.txt | uniq -u

La línea del evento exclusivo —conteniendo la flag— es la que sobrevive.`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Filtrado"
printf 'ping nodo-1\\nping nodo-2\\nping nodo-3\\nping nodo-4\\nping nodo-1\\nping nodo-2\\nping nodo-5\\nping nodo-3\\nping nodo-6\\n%s\\nping nodo-1\\nping nodo-4\\nping nodo-5\\nping nodo-6\\n' "$DOJO_FLAG" > /home/agent/eventos.txt
chown agent:agent /home/agent/eventos.txt`,
`sort ~/eventos.txt | uniq -u`,
[
  { cmd: 'sort fich', desc: 'ordena líneas' },
  { cmd: 'uniq -u', desc: 'muestra solo líneas sin repetición' },
  { cmd: 'uniq -c', desc: 'cuenta cuántas veces aparece cada línea' },
]);

lv('filtrado', 20, 'La fracción exacta', 'head + tail apilados', 35, 2,
`> La coral del dojo ensaya una canción de 12 trenzas. El maestro dice:
> "El secreto está en el compás final, pero solo en su primer verso".
> Si sabes cortar por el final y luego por el principio, lo tendrás.`,
`Muestra la única línea que contiene la flag: es la 10.ª línea del fichero ~/cancion.txt (cuenta desde el final: la tercera contando desde atrás, pero la primera del tramo final).`,
[
  'tail -n N fichero entrega las N últimas líneas.',
  'alto ahí: con head -n 1 te quedas con la primera de ese tramo.',
  'tail -n 3 ~/cancion.txt | head -n 1',
],
`Se combinan dos "tijeras": tail corta por el final y head por el principio.

    tail -n 3 fichero     # el tramo de las 3 últimas líneas
    | head -n 1           # de ese tramo, la primera

Ese es el verso escondido —donde vive la flag—.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Filtrado"
printf 'verso 01\\nverso 02\\nverso 03\\nverso 04\\nverso 05\\nverso 06\\nverso 07\\nverso 08\\nverso 09\\n%s\\nverso 11\\nverso 12\\n' "$DOJO_FLAG" > /home/agent/cancion.txt
chown agent:agent /home/agent/cancion.txt`,
`tail -n 3 ~/cancion.txt | head -n 1`,
[
  { cmd: 'tail -n N', desc: 'últimas N líneas' },
  { cmd: 'head -n M', desc: 'primeras M líneas' },
]);

/* ── busqueda ────────────────────────────────────────────────── */

lv('busqueda', 19, 'La talla exacta', 'find -size con bytes', 40, 3,
`> Los archivos del armario "medidas" son todos de tallas sospechosas
> (2 KiB, 4 KiB...) porque el chapucero que los creó los rellenó con
> basura. Solo uno escapó a la hinchazón: ocupa JUSTO 512 bytes.
> Ese es el contrabando.`,
`Encuentra dentro de ~/medidas el fichero cuyo tamaño es EXACTAMENTE 512 bytes (los demás son más grandes) y muestra su contenido.`,
[
  'find acepta tamaños: -size Nc interpreta N como bytes ("c" de chars).',
  'Los señuelos ocupan más (relleno con head -c y /dev/zero).',
  'find ~/medidas -type f -size 512c',
],
`Con \`-size\` find filtra por tamaño. El sufijo importa: \`c\` = bytes exactos,
\`k\` = kibibytes, \`M\` = mebibytes (y sin sufijo redondea a bloques de 512).

    find ~/medidas -type f -size 512c

Y con -exec se lee al vuelo:

    find ~/medidas -type f -size 512c -exec cat {} +`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Búsqueda"
rm -rf /home/agent/medidas
mkdir -p /home/agent/medidas/{g1,g2,g3}
head -c 2048 /dev/zero | tr '\\0' 'a' > /home/agent/medidas/relleno_a.dat
head -c 4096 /dev/zero | tr '\\0' 'b' > /home/agent/medidas/g1/relleno_b.dat
head -c 1024 /dev/zero | tr '\\0' 'c' > /home/agent/medidas/g3/relleno_c.dat
{ printf 'la joya del gabinete: %s\\n' "$DOJO_FLAG"; head -c 700 /dev/zero | tr '\\0' 'd'; } > /home/agent/medidas/g2/joya.txt
truncate -s 512 /home/agent/medidas/g2/joya.txt
chown -R agent:agent /home/agent/medidas`,
`find ~/medidas -type f -size 512c -exec cat {} +`,
[
  { cmd: '-size 512c', desc: 'tamaño exacto en bytes' },
  { cmd: '-size +2k', desc: 'mayor que 2 KiB' },
  { cmd: '-size -1M', desc: 'menor que 1 MiB' },
]);

lv('busqueda', 20, 'La colmena silenciosa', 'find por mtime: el fichero más reciente', 40, 3,
`> La colmena guarda panales con fechas de fabricación distintas (algunas
> desde hace meses). La abeja reina dejó su mensaje en el panal MÁS
> NOVEDOSO: el único marcado con fecha de hoy.`,
`Encuentra en ~/colmena el fichero modificado más recientemente (los demás tienenfechas antiguas) y muestra su contenido.`,
[
  'ls -t ordena por fecha de modificación (la más nueva primero).',
  'find permite probar antigüedad: -mmin -1 son los tocados hace menos de 1 minuto.',
  'jj: ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}',
],
`ls -t reordena por mtime (modificación): el primero es el más reciente.
Combinando con head/xargs se lee directamente:

    ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}

O con find, para árboles grandes:

    find ~/colmena -mmin -1 -type f -exec cat {} +

(-mmin -1 = modificado hace menos de 1 minuto).`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Búsqueda"
rm -rf /home/agent/colmena
mkdir -p /home/agent/colmena
for i in 1 2 3 4 5; do
  printf 'panal %d: miel estándar\\n' "$i" > /home/agent/colmena/panal$i.txt
  touch -d "2000-0$((i+1))-01 00:00" /home/agent/colmena/panal$i.txt
done
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /home/agent/colmena/reina.txt
chown -R agent:agent /home/agent/colmena`,
`ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}`,
[
  { cmd: 'ls -t', desc: 'ordena por fecha de modificación' },
  { cmd: 'find -mmin -N', desc: 'modificado hace menos de N minutos' },
  { cmd: 'find -newer FICHERO', desc: 'modificado después que otro fichero' },
]);

/* ── procesado ───────────────────────────────────────────────── */

lv('procesado', 19, 'El titular del día', 'awk: estadística de máximos', 45, 3,
`> La redacción del dojo midió cuántas veces sonó el teléfono de cada
> periodista... perdón, de cada "fuente". El que más SONÓ es el que
> guarda la carta: su nombre es,a la vez, el nombre de un fichero .log
> en el mismo armario.`,
`Lee resumen.txt (columnas: nombre y recuento) y muestra el contenido del fichero <nOMBRE>.log del压力大 número de llamadas.`,
[
  'awk recorre línea a línea guardando el máximo: $2>m{m=$2;n=$1}',
  'En el bloque END{} se imprime lo acumulado: print n',
  'Ese texto es un nombre de fichero: pasa por xargs -I{}.',
],
`awk guarda estado entre líneas. Este patrón busca el máximo:

    awk '$2>m{m=$2;n=$1} END{print n}' resumen.txt

Cada vez que la columna 2 supera el máximo guardado, el nombre ($1) pasa a
ser "el líder". En END se imprime. Como el líder es el nombre de un fichero:

    awk '$2>m{m=$2;n=$1} END{print n}' resumen.txt | xargs -I{} cat ~/prensa/{}.log`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Procesado"
rm -rf /home/agent/prensa
mkdir -p /home/agent/prensa
printf 'liz 12\\nmateo 41\\nraudel 9\\nsheila 27\\nbobel 33\\n' > /home/agent/prensa/resumen.txt
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /home/agent/prensa/mateo.log
printf 'assunto trivial 1\\n' > /home/agent/prensa/bobel.log
printf 'assunto trivial 2\\n' > /home/agent/prensa/sheila.log
chown -R agent:agent /home/agent/prensa`,
`awk '$2>m{m=$2;n=$1} END{print n}' ~/prensa/resumen.txt | xargs -I{} cat ~/prensa/{}.log`,
[
  { cmd: "awk '$2>m{m=$2;n=$1} END{print n}'", desc: 'nombre de la fila con la columna 2 máxima' },
  { cmd: 'xargs -I{} CMD {}', desc: 'incrusta la salida en el comando (el {} es el hueco)' },
]);

lv('procesado', 20, 'La carta desenmascarada', 'sed con varias sustituciones', 45, 3,
`> El espía disfrazó la flag en ~/carta.txt: puso ( y ) donde iban las
> llaves { } y guiones donde iban los subrayados. Un solo sed con tres
> sustituciones la recompone tal como se escribió originalmente.`,
`Transforma ~/carta.txt para que la flag vuelva a su formato (llaves { } y subrayados _ sustituyendo los paréntesis y guiones actuales). La salida debe mostrar FLAG{...} con el interior correcto.`,
[
  'sed admite varias expresiones separadas por ; dentro de las mismas comillas.',
  'El patrón s/(/{/g cambia TODOS los paréntesis abiertos por llaves.',
  'Tres pasos en una invocación: sed "s/(/{/g;s/)/}/g;s/-/_/g" ~/carta.txt',
],
`sed acepta varios comandos en cadena (separados por ;) en una sola pasada:

    sed 's/(/{/g;s/)/}/g;s/-/_/g' ~/carta.txt

Cada s/a/b/g sustituye TODAS las apariciones de a por b:
- ( → {  ·  ) → }  ·  - → _

La salida desvela la flag con su formato correcto.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Procesado"
flag=$(printf '%s' "$DOJO_FLAG" | tr '{}' '()' | tr '_' '-')
printf 'Estimado agente: la clave es %s. Sigue así.\\n' "$flag" > /home/agent/carta.txt
chown agent:agent /home/agent/carta.txt`,
`sed 's/(/{/g;s/)/}/g;s/-/_/g' ~/carta.txt`,
[
  { cmd: "sed 's/a/b/g'", desc: 'sustituye todas las apariciones de a por b' },
  { cmd: "sed -e '…' -e '…'", desc: 'encadena varias expresiones' },
]);

/* ── permisos ────────────────────────────────────────────────── */

lv('permisos', 19, 'El sello del grupo', 'chmod con sudo para el dueño root', 50, 4,
`> El acta del consejo (/var/dojo/acta.txt) es de root y su grupo
> "auditores" —del que tú formas parte, pero no es tu grupo primario.
> Con los permisos 640 actuales, el grupo debería poder leerla... y
> aunque ERES miembro del grupo, el fichero está sellado: faltan los
> bits correctos. Solo un superpoder la abrirá.`,
`Haz legible el acta para el grupo (o para todos) con sudo y muestra la flag.`,
[
  'sudo ejecuta el comando como root: sudo chmod …',
  'El 6 en 640 son lectura+escritura del DUEÑO; el grupo tiene un 4 (leer)… ¿o no?',
  'Los bits se pueden dar numéricos (644) o simbólicos (g+r / a+r).',
],
`Un fichero root:auditores con -rw-r----- debería dejar leer al grupo… pero
si el sello se puso en 600 (grupo sin permisos), el miembro del grupo no lee.
Como agente (miembro del grupo pero SIN ser root), no puedes chmod; para
ello está sudo:

    sudo chmod 644 /var/dojo/acta.txt
    cat /var/dojo/acta.txt

644 = dueño lee/escribe, grupo y otros leen.`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Permisos"
mkdir -p /var/dojo
groupadd -f auditores
usermod -aG auditores agent
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /var/dojo/acta.txt
chown root:auditores /var/dojo/acta.txt
chmod 600 /var/dojo/acta.txt`,
`sudo chmod 644 /var/dojo/acta.txt && cat /var/dojo/acta.txt`,
[
  { cmd: 'sudo chmod 644 F', desc: 'da permisos de lectura a todos' },
  { cmd: 'chmod g+r F', desc: 'variante simbólica: grupo puede leer' },
  { cmd: 'id', desc: 'revisa a qué grupos perteneces' },
], 'sudo');

lv('permisos', 20, 'La maleta del inspector', 'chown con sudo', 50, 4,
`> El inspector invitado dejó su maletín en tu cueva… pero lo cerró con
> llave: el fichero es DE ÉL (propietario inspector) y tú no puedes
> leerlo. Tienes sudo: recupera la propiedad y la lee.`,
`Cambia el propietario de ~/cueva/maletin.txt para que seas tú y muestra su contenido.`,
[
  'ls -l muestra el propietario en la 3.ª columna.',
  'sudo chown agent FICHERO transfiere la propiedad.',
  'Después de apropiarte, cat ya funciona.',
],
`chown cambia el dueño; solo root (o sudo) puede dárselo a otro. Después de
apropiarte del maletín, leer es trivial:

    ls -l ~/cueva/maletin.txt          # quien es el dueño
    sudo chown agent ~/cueva/maletin.txt
    cat ~/cueva/maletin.txt`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Permisos"
mkdir -p /home/agent/cueva
useradd -M inspector 2>/dev/null || true
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /home/agent/cueva/maletin.txt
chown inspector:inspector /home/agent/cueva/maletin.txt
chmod 600 /home/agent/cueva/maletin.txt`,
`ls -l ~/cueva/maletin.txt && sudo chown agent ~/cueva/maletin.txt && cat ~/cueva/maletin.txt`,
[
  { cmd: 'sudo chown user F', desc: 'transfiere la propiedad a user' },
  { cmd: 'ls -l', desc: 've quién es el dueño y los permisos' },
], 'sudo');

/* ── procesos ────────────────────────────────────────────────── */

lv('procesos', 19, 'El candado de la señal', 'usr1 a un proceso en espera', 55, 4,
`> Un "celador" del dojo duerme agarrado a un candado. Solo si le envías
> la señal USR1 depositará la llave (la flag) en ~/candado.listo.
> Encuéntralo con pgrep y despíertalo con la señal correcta.`,
`El proceso que contiene "celador" en su línea de comando aún duerme; envíale la señal SIGUSR1 y lee ~/candado.listo (se crea al recibir la señal).`,
[
  'pgrep -f PATRÓN lista los PID cuyo comando completo encaja con PATRÓN.',
  'kill -USR1 PID envía SIGUSR1 (las señales USR1/USR2 son "de usuario").',
  'kill -USR1 $(pgrep -f "[c]elador") && sleep 2 && cat ~/candado.listo',
],
`pgrep -f busca en TODA la línea de comando (no solo el nombre):

    pgrep -f '[c]elador'    # imprime el PID (el corchete evita auto-coincidir)

Con kill -USR1 se le avisa; el proceso tiene un trap que, al recibir la señal,
escribe la llave en disco. Después solo hay que leerla:

    kill -USR1 $(pgrep -f '[c]elador') && sleep 2 && cat ~/candado.listo

El corchete importa: pgrep -f busca en TODA la línea de comando —
incluida la de tu propia invocación, que contiene la palabra — y sin el
[ c ] te matarías a ti mismo con la señal. (sleep 2 deja tiempo al trap).`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Procesos"
cat > /tmp/celador.sh <<'CEL'
#!/bin/bash
trap 'echo "$DOJO_FLAG" > /home/agent/candado.listo' USR1
while :; do sleep 1; done
CEL
chmod +x /tmp/celador.sh
(su -s /bin/bash agent -c 'setsid /tmp/celador.sh' &) 
for i in 1 2 3 4 5 6 7 8 9 10; do pgrep -f 'celador' >/dev/null && break; sleep 0.3; done`,
`kill -USR1 $(pgrep -f '[c]elador') && sleep 2 && cat ~/candado.listo`,
[
  { cmd: 'pgrep -f texto', desc: 'PIDs whose command line matches' },
  { cmd: "pgrep -f '[c]lave'", desc: 'truco: el corchete evita auto-coincidir con tu propia cmdline' },
  { cmd: 'kill -USR1 PID', desc: 'envía la señal de usuario 1' },
  { cmd: 'trap CMD SIto', desc: 'en un script: qué hacer al recibir una señal' },
]);

lv('procesos', 20, 'Nombre en la lista', 'ps -eo args', 55, 4,
`> Un doberman del dojo circula con un disfraz obsesivo: su línea de
> comando (los "args") lleva escondida la flag en texto plano. /proc
> tiene poco espacio, así que quien esconde cosas ahí es porque confía
> en que nadie mire las columnas.`,
`Lista las líneas de comando completas de todos los procesos con ps -eo args y usa grep con el patrón FLAG{…} para incautar la flag.`,
[
  'ps -eo args imprime la última columna de los procesos: su comando completo.',
  'Un grep -o patrón extrae CADA coincidencia (no la línea entera).',
  'El patrón FLAG{…} sirve para localizarla sin exponer la entrada completa.',
],
`ps -eo args muestra el COMANDO COMPLETO con argumentos de cada proceso; es
otra forma de leer /proc/*/cmdline. Con grep se incauta:

    ps -eo args | grep -o 'FLAG{[^}]*}'

grep -o imprime solo la parte que encaja con el patrón —la flag, entera.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Procesos"
printf '#!/bin/bash\\nwhile sleep 7; do :; done\\n' > /tmp/doberman.sh
chmod +x /tmp/doberman.sh
(setsid /tmp/doberman.sh "$DOJO_FLAG" &)
for i in 1 2 3 4 5 6 7 8 9 10; do pgrep -f 'doberman' >/dev/null && break; sleep 0.3; done`,
`ps -eo args | grep -o 'FLAG{[^}]*}'`,
[
  { cmd: 'ps -eo args', desc: 'lista los comandos completos de los procesos' },
  { cmd: 'pgrep -f', desc: 'versión reducida: solo PIDs' },
  { cmd: "grep -o PATRÓN", desc: 'muestra solo la parte que encaja' },
]);

/* ── redes ───────────────────────────────────────────────────── */

lv('redes', 19, 'Estación 512', 'números de puerto: aritmética + ss', 60, 4,
`> El dojo despliega mini-servidores locales en puertos altos. La regla
> de la casa: solo el canal de DATOS (ESTADO "UNIQUE") merece leerse, y
> su puerto es el PRIMERO que ss reporte COMO ESCUCHA por encima de 5000.`,
`Usa ss -tln para listar los puertos locales en escucha, identifica el primero cuya columna "Local Address:Port" tenga un puerto > 5000 y haz una petición con curl a http://127.0.0.1:PUERTO/tarjeta.txt para incautar la flag.`,
[
  'ss -tln lista los sockets TCP en escucha (listening).',
  'la columna "Local Address:Port" muestra el puerto, ej. 127.0.0.1:5127.',
  'curl -s http://127.0.0.1:PUERTO/tarjeta.txt',
],
`ss -tln lista los puertos en escucha del host. Identifica el puerto "anormal"
(> 5000) en la columna Local Address:Port y consulta el pequeño servidor:

    ss -tln
    curl -s http://127.0.0.1:5127/tarjeta.txt

(sustituye 5127 por el puerto que hayas visto en tu ss).`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Redes"
mkdir -p /srv/estacion
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /srv/estacion/tarjeta.txt
printf 'canal espejo: nada que ver\\n' > /srv/estacion/.info
(setsid python3 -m http.server 5127 --directory /srv/estacion --bind 127.0.0.1 &)
for i in 1 2 3 4 5 6 7 8 9 10; do ss -tln | grep -q ':5127' && break; sleep 0.3; done`,
`ss -tln | grep -oE '127\\.0\\.0\\.1:[0-9]+' | awk -F: '$2>5000{print $2}' | head -n 1 | xargs -I{} curl -s http://127.0.0.1:{}/tarjeta.txt`,
[
  { cmd: 'ss -tln', desc: 'lista puertos TCP en escucha' },
  { cmd: 'curl -s URL', desc: 'petición HTTP silenciosa a un servidor local' },
]);

lv('redes', 20, 'La llave del puerto', 'leer un valor JSON y montar una URL', 60, 4,
`> La estación sur del dojo abre un canal web OSCURO: nadie recuerda el
> número de puerto… pero quedó grabado en /var/dojo/canal.json. Localiza
> la llave (el número) y consúltala a mano con curl en el localhost.`,
`Lee el número de puerto que está dentro de /var/dojo/canal.json y usa curl para pedir http://127.0.0.1:PUERTO/tarjeta.txt, donde viaja la flag.`,
[
  'cat /var/dojo/canal.json muestra el fichero con el campo "puerto".',
  "grep -oE '[0-9]+' canal.json | head -n 1 extrae el número.",
  'curl -s http://127.0.0.1:PUERTO/tarjeta.txt se lo come.',
],
`Un mini-parse de un JSON plano: localiza el valor del campo y úsalo en la URL.

    cat /var/dojo/canal.json        → {"instancia": "sur", "puerto": 9341}
    port=$(grep -oE '[0-9]+' /var/dojo/canal.json | head -n 1)
    curl -s http://127.0.0.1:$port/tarjeta.txt

Con la variable de shell $port la URL se compone al vuelo.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Redes"
mkdir -p /srv/estacion /var/dojo
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /srv/estacion/tarjeta.txt
printf '{"instancia": "estacion-sur", "puerto": 9341}\\n' > /var/dojo/canal.json
(setsid python3 -m http.server 9341 --directory /srv/estacion --bind 127.0.0.1 &)
for i in 1 2 3 4 5 6 7 8 9 10; do ss -tln | grep -q ':9341' && break; sleep 0.3; done`,
`port=$(grep -oE '[0-9]+' /var/dojo/canal.json | head -n 1); curl -s http://127.0.0.1:$port/tarjeta.txt`,
[
  { cmd: 'grep -oE PATRÓN fich', desc: 'extrae solo el texto que encaja' },
  { cmd: 'var=$(CMD)', desc: 'captura la salida de un comando en una variable' },
  { cmd: 'curl -s http://127.0.0.1:$port/…', desc: 'petición HTTP al puerto guardado' },
]);

/* ── archivos ────────────────────────────────────────────────── */

lv('archivos', 19, 'La caja del tren', 'tar: crear y listar', 55, 4,
`> El equipaje viaja en formato .tar.gz y los bultos se identifican por
> su etiqueta (el nombre de cada fichero dentro del paquete). La caja
> "maleta.tar.gz" tiene 3 bultos: solo el llamado "j Rusia ligero"
> (joya.txt) lleva la contrapartida. Descomprímela en el sitio seguro.`,
`Lista el contenido de ~/maleta.tar.gz, extrae su contenido en el directorio actual y muestra la flag del fichero joya.txt.`,
[
  'tar -czf destino.tar.gz ficheros — c: crear, z: gzip, f: fichero.',
  'tar -tzf paquete.tar.gz lista el contenido (t: "tocar sin extraer").',
  'tar -xzf paquete.tar.gz extrae (x: extraer).',
],
`El flujo tar clásico:

    tar -tzf ~/maleta.tar.gz      # ver qué lleva dentro (sin extraer)
    tar -xzf ~/maleta.tar.gz -C ~ # extraer en tu home
    cat ~/joya.txt                # la flag está en joya.txt

z significa que el paquete va comprimido con gzip (por lo tanto usa z tanto
al listar como al extraer, igual que al crear).`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Archivos"
rm -f /home/agent/maleta.tar.gz /home/agent/joya.txt /home/agent/ropa1 /home/agent/ropa2
printf 'camisa doblada 1\\n' > /tmp/ropa1
printf 'camisa doblada 2\\n' > /tmp/ropa2
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /tmp/joya.txt
tar -czf /home/agent/maleta.tar.gz -C /tmp ropa1 ropa2 joya.txt
rm /tmp/ropa1 /tmp/ropa2 /tmp/joya.txt
chown agent:agent /home/agent/maleta.tar.gz`,
`tar -xzf ~/maleta.tar.gz -C ~ && cat ~/joya.txt`,
[
  { cmd: 'tar -czf paquete.tar.gz ficheros', desc: 'crear un paquete comprimido' },
  { cmd: 'tar -tzf paquete.tar.gz', desc: 'listar su contenido' },
  { cmd: 'tar -xzf paquete.tar.gz -C DIR', desc: 'extraer el paquete en DIR' },
]);

lv('archivos', 20, 'Los gemelos del estante', 'md5sum + uniq: invariantes', 55, 4,
`> En el estante "estante" hay pila de ficheros; dos son IDÉNTICOS byte a
> byte (mismo contenido), y solo uno de LOS DOS lleva la contrapartida
> dentro. Regla de la casa: los gemelos comparten huella MD5; una vez
> detectados, "el de la izquierda" (alfabéticamente primero) es el bueno.`,
`Detecta la huella md5 duplicada en ~/estante usando md5sum + sort + uniq, y muestra el contenido del fichero duplicado (que es el que lleva la flag).`,
[
  'md5sum fichero imprime "hash fichero".',
  'md5sum ~/estante/* | sort | uniq -D -w32 agrupa por los 32 primeros caracteres (el hash).',
  'La línea duplicada contiene el nombre del fichero con la flag: cat ese fichero.',
],
`Los ficheros idénticos comparten hash MD5. Se listan las huellas y se agrupan:

    md5sum ~/estante/*           # "hash  fichero" por fichero
    | sort                       # adyacentes las iguales
    | uniq -D -w32               # muestra TODAS las filas con igual hash (32 chars)

extract: los nombres duplicados; el que contiene la flag es el alfabético
primero de los gemelos:

    md5sum ~/estante/* | sort | uniq -D -w32 | sort | head -n 1 | awk '{print $2}' | xargs cat`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Archivos"
rm -rf /home/agent/estante
mkdir -p /home/agent/estante
printf 'titulo cualquiera 1\\n' > /home/agent/estante/a_libro.txt
printf 'titulo cualquiera 2\\n' > /home/agent/estante/b_libro.txt
printf 'titulo cualquiera 3\\n' > /home/agent/estante/c_libro.txt
flag=$(printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG")
printf '%s' "$flag" > /home/agent/estante/j_joya_temprana.txt
printf '%s' "$flag" > /home/agent/estante/k_joya_tardia.txt
chown -R agent:agent /home/agent/estante`,
`md5sum ~/estante/* | sort | uniq -D -w32 | sort | head -n 1 | awk '{print $2}' | xargs cat`,
[
  { cmd: 'md5sum FICHEROS', desc: 'huella MD5 de cada fichero' },
  { cmd: 'uniq -D -w32', desc: 'agrupa por los 32 primeros caracteres' },
]);

/* ── scripting ───────────────────────────────────────────────── */

lv('scripting', 19, 'El caso del argumento', 'case + $1 en un script', 60, 4,
`> El conserje ha dejado un script "caja.sh" en tu home. Se maneja con
> una ÚNICA palabra-clave como argumento; si la aciertas, la caja
> suelta el contrabando. Míralo primero: con head verás el case y qué
> palabra espera.`,
`Lee ~/caja.sh para descubrir el argumento que acepta y ejecútalo con la palabra correcta para que imprima la flag.`,
[
  'En un script, $1 es su primer argumento: caja.sh palabra',
  'case "$1" in patrón) comando;; esac elige por coincidencia.',
  'head ~/caja.sh te muestra qué patrón imprime la flag.',
],
`Los scripts reciben argumentos por posición: $1 es el primero. case los
compara con patrones:

    case "$1" in
      desbloquear) echo "..." ;;
      *) echo "uso: caja.sh desconocido" ;;
    esac

procedimiento: mira el script (head ~/caja.sh), detecta qué palabra encaja con
la rama que imprime la flag, y ejecuta:

    bash ~/caja.sh desbloquear`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Scripting"
cat > /home/agent/caja.sh <<'CASEEOF'
#!/bin/bash
case "$1" in
  desbloquear)
    echo "$DOJO_FLAG"
    ;;
  *)
    echo "uso: caja.sh <palabra>" >&2
    exit 1
    ;;
esac
CASEEOF
chmod +x /home/agent/caja.sh
chown agent:agent /home/agent/caja.sh`,
`head ~/caja.sh; bash ~/caja.sh desbloquear`,
[
  { cmd: 'case "$1" in … esac', desc: 'elige una rama según el primer argumento' },
  { cmd: '$1, $2, $#', desc: 'argumentos y número de argumentos' },
  { cmd: 'bash script.sh arg', desc: 'ejecuta un script con argumento' },
]);

lv('scripting', 20, 'El bucle de la tropa', 'for + globbing', 60, 4,
`> El sargento repartió la contrapartida entre la tropa: fragmentos
> pequeños en ~/tropa/*.txt. Ninguno lleva la flag entera. Para
> recomponer el mensaje hay que UNIR todos los fragmentos: el bucle for
> con tilde-glob es la herramienta del sargento.`,
`Concatena en orden TODOS los ficheros ~/tropa/*.txt (usa for f in … con cat "$f") y muestra el mensaje completo con la flag.`,
[
  'for f in ~/tropa/*.txt; do … done itera los ficheros del patrón.',
  'cat "$f" imprime cada fichero: al concatenar todos sale el mensaje.',
  'El globbing (*.txt) se expande en orden alfabético.',
],
`Un for con glob recorre ficheros:

    for f in ~/tropa/*.txt; do
      cat "$f"
    done

Cada iteración imprime un fragmento; en conjunto la flag completa queda
reconstruida (y ordenada, porque el globbing ordena alfabéticamente).`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Scripting"
rm -rf /home/agent/tropa
mkdir -p /home/agent/tropa
flag="$DOJO_FLAG"
half=$(( \${#flag} / 2 ))
printf '%s' "\${flag:0:half}"     > /home/agent/tropa/01_parte.txt
printf '%s' "\${flag:half}"       > /home/agent/tropa/02_parte.txt
printf 'fin de la contrapartida\\n' > /home/agent/tropa/03_fin.txt
chown -R agent:agent /home/agent/tropa`,
`for f in ~/tropa/*.txt; do cat "$f"; done; echo`,
[
  { cmd: 'for f in FILES; do …; done', desc: 'bucle sobre un patrón de ficheros' },
  { cmd: '*.txt', desc: 'globbing: se expande a la lista ordenada' },
]);

/* ── forense ─────────────────────────────────────────────────── */

lv('forense', 19, 'El paquete sellado', 'base64 en un log', 65, 5,
`> En el sucio registro ~/registro.log un "paquete" viaja codificado en
> base64 en la línea que empieza por PAYLOAD. Al decodificarlo, la flag
> asoma. Los logs del dojo guardan todo; incluso lo que no deberían.`,
`Extrae el segmento base64 de la línea PAYLOAD de ~/registro.log y decodifícalo para mostrar la flag.`,
[
  'grep PAYLOAD fichero encuentra la línea; con awk \'{print $3}\' se saca el 3.º campo.',
  'base64 -d decodifica en el otro sentido.',
  'grep -F … | awk "{print \\$2}" | base64 -d',
],
`El flujo forense minero: localizar la línea, recortar el campo, decodificar:

    grep 'PAYLOAD' registro.log      → "PAYLOAD cod BxOx…"
    awk '{print $4}'                 → solo el bloque base64
    base64 -d                        → texto en claro

encadenado:

    grep 'PAYLOAD' /home/agent/registro.log | awk '{print $4}' | base64 -d`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Forense"
{ printf '2024-01-01 08:00 INFO  arranque normal\\n';
  printf '2024-01-01 08:01 DEBUG ruido de fondo\\n';
  printf '2024-01-01 08:02 PAYLOAD %s\\n' "$(printf '%s' "$DOJO_FLAG" | base64 -w 0)";
  printf '2024-01-01 08:03 INFO  cierre de turno\\n'; } > /home/agent/registro.log
chown agent:agent /home/agent/registro.log`,
`grep 'PAYLOAD' ~/registro.log | awk '{print $4}' | base64 -d; echo`,
[
  { cmd: 'grep TEXTO fich', desc: 'localiza la línea clave' },
  { cmd: "awk '{print $N}'", desc: 'extrae el campo N de la línea' },
  { cmd: 'base64 -d', desc: 'decodifica un bloque base64' },
]);

lv('forense', 20, 'Hexagonal', 'xxd: bytes a texto', 65, 5,
`> El técnico volcó un intercambio en forma hexadecimal en ~/rastro.hex:
> cada byte son dos caracteres hex. Laっても flag viaja ahí dentro en
> plano... pero no lo verás con cat. Los hex tienen que Volver a bytes.`,
`Convierte ~/rastro.hex con xxd -r -p (reverse + plain hex) y verifica que la flag asoma en la salida.`,
[
  'xxd -p convierte a hex; xxd -r -p hace lo inverso (hex → bytes).',
  'El fichero .hex puede llevar saltos de línea: xxd -r -p los tolera.',
  'echo $(cat rastro.hex) | xxd -r -p',
],
`xxd trabaja con "hexdumps". Para invertir un fichero de hex plano:

    echo $(cat ~/rastro.hex) | xxd -r -p

-p interpreta entrada/salida como hex plano y -r revierte al binario.
El grep final confirma que la flag está dentro:

    ... | grep -o 'FLAG{[^}]*}'`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Forense"
printf 'día 2024-01-01: volcado de la sesión\\n' > /tmp/cx_header
printf 'día 2024-01-01: fin\\n' >> /tmp/cx_header
# cuerpo: la flag + relleno, todo en hex con saltos de línea
payload=$(printf 'sesión abierta. %s fin de sesión\\n' "$DOJO_FLAG" | xxd -p | tr -d '\\n')
echo "$payload" > /home/agent/rastro.hex
chown agent:agent /home/agent/rastro.hex`,
`echo $(cat ~/rastro.hex) | xxd -r -p | grep -o 'FLAG{[^}]*}'`,
[
  { cmd: 'xxd -p fich', desc: 'vuelca el fichero en hex plano' },
  { cmd: 'xxd -r -p', desc: 'convierte hex plano de nuevo a bytes' },
  { cmd: 'strings fich', desc: 'alternativa: extrae texto de un binario' },
]);

/* ── boss ────────────────────────────────────────────────────── */

lv('boss', 19, 'El mayor del caso', 'pipeline: uniq + sort -n + xargs', 90, 5,
`> El archivo de cierre del caso (diario.txt) registra a quién se llamó
> por canal: la ÚLTIMA palabra de cada línea es el "ciudadano". El
> ciudadano que más repite es el jefe de la banda; guarda su expediente
> en ~/casos/<ciudadano>.txt… con la flag dentro.`,
`Analiza diario.txt, descubre qué ciudadano (última columna) aparece MÁS veces y muestra su expediente ~/casos/<ciudadano>.txt.`,
[
  "awk '{print $NF}' toma la ÚLTIMA columna de cada línea.",
  'sort | uniq -c cuenta repeticiones; sort -n ordena por ese conteo numérico.',
  'tail -n 1 se queda con el mayor; el campo 2.º es el nombre.',
],
`Pipeline de análisis (el clásico de "word count"):

    awk '{print $NF}' ~/diario.txt   # la última palabra de cada línea
    | sort | uniq -c                 # cuenta repeticiones
    | sort -n                        # de menor a mayor frecuencia
    | tail -n 1                      # el ganador: "  N ciudadano"
    | awk '{print $2}'               # el nombre del ganador
    | xargs -I{} cat ~/casos/{}.txt  # lee SU expediente`,
`#!/bin/bash
set -e
arena-prompt "LVL 19" "Boss"
rm -rf /home/agent/diario.txt /home/agent/casos
{ printf 'ch1 lobo\\nch2 lobo\\nch3 lobo\\nch4 zorro\\nch5 zorro\\nch6 lobo\\n'; } > /home/agent/diario.txt
mkdir -p /home/agent/casos
printf 'FLAGVEZ=%s\\n' "$DOJO_FLAG" > /home/agent/casos/lobo.txt
printf 'expediente zorro: vacío\\n' > /home/agent/casos/zorro.txt
printf 'expediente tejón: vacío\\n' > /home/agent/casos/tejon.txt
chown -R agent:agent /home/agent/diario.txt /home/agent/casos`,
`awk '{print $NF}' ~/diario.txt | sort | uniq -c | sort -n | tail -n 1 | awk '{print $2}' | xargs -I{} cat ~/casos/{}.txt`,
[
  { cmd: "awk '{print $NF}'", desc: 'última columna (NF = nº de campos)' },
  { cmd: 'sort -n | uniq -c | sort -n', desc: 'frecuencia par línea: lo clásico' },
  { cmd: 'xargs -I{} CMD {}', desc: 'COLÓN la salida en un marcador de posición' },
]);

lv('boss', 20, 'La rotación doble', 'rev + tr: rot13 al rescate', 90, 5,
`> La chapa del boss está en ~/enigma.txt pero se ROizó con dos capas:
> primero rot13 (letras desplazadas 13) y luego invertida letra a letra.
> Solo se puede deshacer en orden inverso a como se construyó.`,
`Deshace la doble transformación de ~/enigma.txt (primero rev, luego un tr de rot13) para imprimir la flag. Recordar: si se aplicó "rev | tr", para deshacer se aplica "tr | rev".`,
[
  "tr 'A-Za-z' 'N-ZA-Mn-za-m' es el rot13 (desplaza 13 posiciones y da la vuelta al abecedario).",
  'Para deshacer: primero VOLTEA LOS CARACTERES con rev, después el rot13 tr.',
  'rev fichero | tr A-Za-z N-ZA-Mn-za-m',
],
`La transformación original fue: rot13 → luego invertir. Para deshacer se
desmonta al revés (como los calcetines):

    rev ~/enigma.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'

rev arregla el orden de letras; tr re-desplaza el alfabeto 13 posiciones.
rot13 es auto-inverso (rot13 de rot13 es identidad): el mismo tr sirve
para cifrar y descifrar.`,
`#!/bin/bash
set -e
arena-prompt "LVL 20" "Boss"
rot=$(printf '%s' "$DOJO_FLAG" | tr 'A-Za-z' 'N-ZA-Mn-za-m')
printf '%s' "$rot" | rev > /home/agent/enigma.txt
chown agent:agent /home/agent/enigma.txt`,
`rev ~/enigma.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'`,
[
  { cmd: "tr 'A-Za-z' 'N-ZA-Mn-za-m'", desc: 'rot13: cifra y descifra (es auto-inverso)' },
  { cmd: 'rev', desc: 'invierte los caracteres' },
]);

/* ── escribir los ficheros ───────────────────────────────────── */

let written = 0;
for (const t of levels) {
  const dir = path.join(root, 'levels', t.track);
  const kw = [...new Set((t.cheatsheet || []).map((c) => c.cmd.split(/\s+/)[0]).filter(Boolean).map((w) => w.replace(/["'`*]/g, '')))].map((w) => `  - ${JSON.stringify(w)}`).join('\n') || '  - bash';
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `l${t.num}.yaml`);
  const che = (t.cheatsheet || []).map((c) => `  - {cmd: ${JSON.stringify(c.cmd)}, desc: ${JSON.stringify(c.desc)}}`).join('\n');
  const body = `id: ${t.track}-l${t.num}
track: ${t.track}
index: ${t.num}
title: ${JSON.stringify(t.title)}
subtitle: ${JSON.stringify(t.subtitle)}
xp: ${t.xp}
difficulty: ${t.diff}
brief: >
${t.brief.split('\n').map((l) => `  ${l}`).join('\n')}
goal: >
${t.goal.split('\n').map((l) => `  ${l}`).join('\n')}
hints:
${t.hints.map((h) => `  - ${JSON.stringify(h)}`).join('\n')}
teach: >
${t.teach.split('\n').map((l) => `  ${l}`).join('\n')}
setup: |
${t.setup.split('\n').map((l) => `  ${l}`).join('\n')}
solution: |
${t.solution.split('\n').map((l) => `  ${l}`).join('\n')}
cheatsheet:
${che}
keywords:
${kw}
profile: ${t.profile || 'default'}`;
  fs.writeFileSync(file, body.replace(/\n{3,}/g, '\n\n'));
  written++;
  console.log(`✓ ${t.track}/l${t.num}.yaml`);
}
console.log(`— ${written} niveles escritos —`);
