/**
 * gen-levels3-b2 — tanda 3 (parte B): busqueda l13..l18 · procesado l13..l18 · permisos l13..l18.
 * La solución corre como agent, no usa $DOJO_FLAG y acaba imprisión la marca.
 */
import { mk } from './lib-levels.mjs';

const busqueda = [
  mk('busqueda', 13, {
    title: 'Recorrido recursivo',
    subtitle: 'grep -r en un árbol',
    xp: 40, difficulty: 3,
    brief: 'El árbol ~/proyecto tiene archivos .js, .md y .txt anidados en profundidad. La pieza está en UNO, en cualquier nivel.',
    goal: 'Busca recursivamente la marca en todo /home/agent/proyecto y extráela.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Busqueda"
mkdir -p /home/agent/proyecto/src/lib/legacy /home/agent/proyecto/docs/old
echo "const version = 3;" > /home/agent/proyecto/src/app.js
echo "utilidad de sitio: sin novedades" > /home/agent/proyecto/src/lib/legacy/util.txt
echo "docs antiguos del dojo" > /home/agent/proyecto/docs/old/README.md
printf 'init(): carga modulo\nmarca: %s\n' "$DOJO_FLAG" > /home/agent/proyecto/src/lib/legacy/core.js
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -r -oE 'FLAG\{[a-f0-9]+\}' /home/agent/proyecto | head -n1`,
    hints: [
      'grep -r recorre directorios en profundidad sin que tengas que listarlos.',
      'Añade -oE con la forma de la marca para quedarte solo el trozo útil.',
      "grep -r -oE 'FLAG\\{[a-f0-9]+\\}' /home/agent/proyecto",
    ],
    teach: 'grep -r es el "buscar en todo el árbol" de un repo: con -nñades números de línea y con -E patrones. En proyectos reales es la primera pasada del code review forense.',
    cheatsheet: [
      { cmd: 'grep -r patrón dir', desc: 'busca recursiva' },
      { cmd: 'grep -rn patrón dir', desc: "con línea y fichero" },
    ],
    keywords: ['grep', 'find', 'recursivo'],
  }),
  mk('busqueda', 14, {
    title: 'Caso y forma',
    subtitle: 'grep -i contra el ruido',
    xp: 40, difficulty: 3,
    brief: 'auditoria.log escribe el rastreador con mayúsculas y minúsculas dentro de la marca a lo bestia: el grep sensible a la caja se le pierde.',
    goal: 'Encuentra en /home/agent/auditoria.log la marca aunque su caja sea desordenada.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Busqueda"
{
  echo "10:01 login copa"
  echo "10:02 tentativa fallida wscan"
  echo "10:03 alarma del monitor: FlAg{A9B} ruido ruido" 
  echo "10:04 keeper normal"
  echo "10:05 alarma del monitor: fLaG{A99B} ruido"
  echo "10:06 tentativa fallida wscan"
  echo "10:07 keeper normal"
  echo "final: $DOJO_FLAG"
} > /home/agent/auditoria.log
chown agent:agent /home/agent/auditoria.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -ioE 'FLAG\{[a-f0-9]{24}\}' /home/agent/auditoria.log`,
    hints: [
      'grep -i ignora el caso de las letras.',
      'La marca correcta lleva 24 caracteres hex exactos; los señuelos (A9B) se quedan fuera con {24}.',
      "grep -ioE 'FLAG\\{[a-f0-9]{24}\\}' /home/agent/auditoria.log",
    ],
    teach: '-i cuesta algo de rendimiento pero salva la vida en logs donde el emisor escribe a capricho. La regex con {24} exactos discrimina señuelos de verdad sin grep -v.',
    cheatsheet: [
      { cmd: 'grep -i p f', desc: 'sin distinción de caja' },
      { cmd: "grep -ioE 'pat.{3}' f", desc: 'extrae por forma' },
    ],
    keywords: ['grep', 'logs', 'ruido'],
  }),
  mk('busqueda', 15, {
    title: 'Tocado el mismo día',
    subtitle: 'find -mtime: buscar por fecha',
    xp: 40, difficulty: 3,
    brief: 'En ~/archivo hay decenas de fichas. Solo UNA se tocó en las últimas 24 horas — y esa, la fresca, es la que importa.',
    goal: 'Localiza con find los ficheros de /home/agent/archivo modificados hoy y muestra el .txt de entre ellos.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Busqueda"
mkdir -p /home/agent/archivo
for i in 1 2 3 4 5 6 7 8; do echo "ficha $i: archivo tranquilo" > /home/agent/archivo/f$i.txt; done
touch -d "40 days ago" /home/agent/archivo/f1.txt /home/agent/archivo/f2.txt /home/agent/archivo/f3.txt
touch -d "10 days ago" /home/agent/archivo/f4.txt /home/agent/archivo/f5.txt
touch -d "3 days ago" /home/agent/archivo/f6.txt /home/agent/archivo/f7.txt
echo "ficha fresca: $DOJO_FLAG" > /home/agent/archivo/f8.txt
touch -d "1 hour ago" /home/agent/archivo/f8.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat $(find /home/agent/archivo -name '*.txt' -mtime -1)`,
    hints: [
      'find -mtime -1 = modificado hace MENOS de 1 día; -mtime +1 en cambio es hace más de 1 día.',
      'Solo un .txt pasará el filtro.',
      'cat $(find /home/agent/archivo -name "*.txt" -mtime -1)',
    ],
    teach: 'find opera por fecha real del fingerprint: -mtime (días), -mmin (minutos) y -newer (frente a otro fichero). Útil para "¿qué cambió desde el backup?" de verdad.',
    cheatsheet: [
      { cmd: 'find dir -mtime -1', desc: 'modificado hoy' },
      { cmd: 'find dir -mmin -60', desc: 'última hora' },
    ],
    keywords: ['find', 'mtime', 'fecha'],
  }),
  mk('busqueda', 16, {
    title: 'Mi rastro en /srv',
    subtitle: 'find -user: ficheros por dueño',
    xp: 40, difficulty: 3,
    brief: '/srv/repo mezcla ficheros tuyos y de otros usuarios. La tuya de entre todas lleva la pieza — el resto está sin permiso.',
    goal: 'Encuentra en /srv/repo los ficheros propiedad del usuario agent y muestra el que sea legible.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Busqueda"
mkdir -p /srv/repo
echo "de root: nada que ver" > /srv/repo/a.txt
echo "de root: nada" > /srv/repo/b.txt
echo "del agent: $DOJO_FLAG" > /srv/repo/c.txt
echo "de root: nada" > /srv/repo/d.txt
chown root:root /srv/repo/a.txt /srv/repo/b.txt /srv/repo/d.txt
chown agent:agent /srv/repo/c.txt
chmod 640 /srv/repo/a.txt /srv/repo/b.txt /srv/repo/d.txt
chmod 644 /srv/repo/c.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /srv/repo/$(find /srv/repo -user agent | head -n1 | xargs basename)`,
    hints: [
      'find -user agent devuelve solo lo tuyo.',
      'El nombre del fichero está limpio: cat $(find ... ) lo muestra después.',
      'cat $(find /srv/repo -user agent)',
    ],
    teach: 'find -user/-group filtran por titular: el "quién tocó esto" del audit forense. Los permisos de los demás te acusan también: el sistema te guía hacia lo correcto.',
    cheatsheet: [
      { cmd: 'find dir -user agent', desc: 'por titular' },
      { cmd: 'find dir -user agent -ls', desc: 'con detalles' },
    ],
    keywords: ['find', 'user', 'duenos'],
  }),
  mk('busqueda', 17, {
    title: 'Después del aviso',
    subtitle: 'grep -A: contexto tras la línea',
    xp: 40, difficulty: 3,
    brief: 'enlace.txt tiene una marca escondida justo tras el aviso "-AVERIA: cobre-7-" y dos líneas más abajo. El contexto es el selectret.',
    goal: 'Extrae de /home/agent/enlace.txt la marca que está a 2 líneas de distancia ABAJO del aviso "AVERIA: cobre-7".',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Busqueda"
{
  echo "TL pers: cobre fisico OK"
  echo "AVERIA: cobre-7"
  echo "reparacion pendiente"
  echo "cod de contacto: $DOJO_FLAG"
  echo "TL noun: normalidad"
} > /home/agent/enlace.txt
chown agent:agent /home/agent/enlace.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -A2 'AVERIA: cobre-7' /home/agent/enlace.txt | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'grep -A2 muestra las 2 líneas siguientes (After); -B son las previas y -C el contexto por ambas partes.',
      'A la salida puedes re-grepear la forma de la marca para limpiar el aviso.',
      "grep -A2 'AVERIA' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'Contexto (-A/-B/-C) sustituye "leerte el log entero": los sistemas de alerta te llevan a la línea exacta y -A/B te dáan el resto gratis.',
    cheatsheet: [
      { cmd: 'grep -A2 p f', desc: '2 línas después' },
      { cmd: 'grep -C2 p f', desc: 'por ambos lados' },
    ],
    keywords: ['grep', 'contexto', 'A'],
  }),
  mk('busqueda', 18, {
    title: 'Configuraciones escondidas',
    subtitle: 'find -name + -exec',
    xp: 45, difficulty: 3,
    brief: 'El árbol /etc/dojo está lleno de subdirectorios con ficheros .conf. Uno de ellos lleva la pieza en una línea de comentario.',
    goal: 'Recorre los .conf de /etc/dojo con find y muestra la marca que hay en alguno de ellos.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Busqueda"
mkdir -p /etc/dojo/d1 /etc/dojo/d2/nested
rm -f /etc/dojo/*.conf /etc/dojo/d1/*.conf /etc/dojo/d2/*.conf /etc/dojo/d2/nested/*.conf
echo "servicio=base" > /etc/dojo/base.conf
echo "medida=mordaza" > /etc/dojo/d1/regla.conf
printf '# rastro del dojo\n# marca: %s\n' "$DOJO_FLAG" > /etc/dojo/d2/nested/legado.conf
echo "otro=salio" > /etc/dojo/d2/test.conf
chmod -R a+rX /etc/dojo
chown -R agent:agent /home/agent`,
    solution: String.raw`find /etc/dojo -name '*.conf' -exec grep -hoE 'FLAG\{[a-f0-9]+\}' {} \;`,
    hints: [
      'find -exec corre un comando por cada fichero que pasa el filtro: {} es el nombre del fichero.',
      'grep -h NO imprime el nombre del fichero, solo la línea con la marca.',
      "find /etc/dojo -name '*.conf' -exec grep -hoE 'FLAG\\{[a-f0-9]+\\}' {} \\;",
    ],
    teach: 'find -exec te ahorra el bucle for: cada hallazgo es un {} al cimiento del comando. Con \\; ejecuta por fichero y con + los agrupa: ambos son legítimos, el + es más barato.',
    cheatsheet: [
      { cmd: 'find d -name "*.conf" -exec cmd {} \\;', desc: 'por fichero' },
      { cmd: 'find d -type f -exec cat {} +', desc: 'agrupado' },
    ],
    keywords: ['find', 'exec', 'conf'],
  }),
];

const procesado = [
  mk('procesado', 13, {
    title: 'El máximo con awk',
    subtitle: 'acumulador con if >',
    xp: 45, difficulty: 3,
    brief: 'ventas.csv tiene zona,importe. La fila con el importe más alto esconde la pieza en su primera columna.',
    goal: 'Encuentra la fila con mayor importe en /home/agent/ventas.csv y muéstrala entera.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Procesado"
{
  echo "zona-norte,412"
  echo "zona-sur,87"
  echo "la clave: $DOJO_FLAG,3111"
  echo "zona-leste,1500"
  echo "zona-oeste,560"
} > /home/agent/ventas.csv
chown agent:agent /home/agent/ventas.csv
chown -R agent:agent /home/agent`,
    solution: String.raw`awk -F, '{if ($2+0 > max) {max=$2+0; line=$0}} END {print line}' /home/agent/ventas.csv`,
    hints: [
      'awk con -F, separa por comas: $1 es la zona y $2 el importe.',
      'El truco del acumulador: if ($2 > max) {max = $2; line = $0}, luego en END print line.',
      "awk -F, '{if ($2 > max) {max=$2; line=$0}} END {print line}' /home/agent/ventas.csv",
    ],
    teach: 'awk mantiene variables entre líneas: el patrón "if ($n > max) {max=$n; line=$0} END {print line}" es el modo awk canónica de "máximo con su contexto" — sin sort de por medio.',
    cheatsheet: [
      { cmd: "awk -F, '$2>max{max=$2; li=$0} END{print li}' f", desc: 'máximo con contexto' },
      { cmd: 'sort -t, -k2 -r f | head -1', desc: 'lo mismo con sort' },
    ],
    keywords: ['awk', 'max', 'csv'],
  }),
  mk('procesado', 14, {
    title: 'Informe censurado',
    subtitle: 'sed de sustitución',
    xp: 45, difficulty: 3,
    brief: 'El censor pasó por informe.txt y tachó lo que importa con la palabra REDACTADO justo delante. Quita los tachones.',
    goal: 'Elimina todas las ocurrencias de REDACTADO (con sus espacios) de /home/agent/informe.txt y extrae la marca que reaparece.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Procesado"
{
  echo "informe mensual del dojo"
  echo "actividad normal en zona A REDACTADO sigue en calma"
  echo "hallazgo: REDACTADO $DOJO_FLAG"
  echo "recomendaciones: REDACTADO vigilancia de rutina"
} > /home/agent/informe.txt
chown agent:agent /home/agent/informe.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sed 's/REDACTADO //g' /home/agent/informe.txt | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'sed s/viejo/nuevo/ cambia la 1ª ocurrencia por línea; /g lo hace en todas.',
      'Cambia REDACTADO+espacio por vacío, luego grep -oE con la forma de la marca.',
      "sed 's/REDACTADO //g' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'sed s/viejo/nuevo/g es el reemplazo de texto por excelencia. Para informes censurados, quitar la máscara revela lo que quedó detrás: el censor borra palabras, no datos.',
    cheatsheet: [
      { cmd: "sed 's/viejo/nuevo/g' f", desc: 'reemplaza todas' },
      { cmd: "sed -i 's/v/n/g' f", desc: 'edita en sitio' },
    ],
    keywords: ['sed', 'censura', 'sustitucion'],
  }),
  mk('procesado', 15, {
    title: 'El último campo',
    subtitle: 'awk NF y $(NF)',
    xp: 45, difficulty: 3,
    brief: 'registro.log tiene líneas con NÚMERO de campos variable. La marca está en el ÚLTIMO campo de la línea del envío.',
    goal: 'Filtra las líneas con "envio" en /home/agent/registro.log e imprime su último campo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Procesado"
{
  echo "09:01 login user=ana"
  echo "09:02 envio depot=odega-2 ruta=listo destino=1F"
  echo "09:03 envio confidencial completado: $DOJO_FLAG"
  echo "09:04 envio depot=odega-3 ruta=res retardo=no detalle= WrestleStudio"
  echo "09:05 login user=bruno"
} > /home/agent/registro.log
chown agent:agent /home/agent/registro.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep 'envio confidencial' /home/agent/registro.log | awk '{print $NF}' | head -n1`,
    hints: [
      'awk NF es el número de campos de la línea actual; $NF es el último.',
      'Primero grep "envio", luego awk "{print $NF}".',
      "grep 'envio' f | awk '{print $NF}'",
    ],
    teach: '$NF es la joya de awk para logs con anchura variable: da igual que mida 3 o 13 campos; el último es SIEMPRE el último. awk NR es el número de línea, NF es el de campos.',
    cheatsheet: [
      { cmd: "awk '{print $NF}' f", desc: 'último campo' },
      { cmd: "awk '{print $(NF-1)}' f", desc: 'penúltimo' },
    ],
    keywords: ['awk', 'NF', 'logs'],
  }),
  mk('procesado', 16, {
    title: 'El bloque de la copia',
    subtitle: 'sed -n con rango de patrones',
    xp: 45, difficulty: 3,
    brief: 'inventario.txt es un registro largo. Entre las líneas del inciso COPIA-INTERNA y FIN-COPIA escondió la marca.',
    goal: 'Imprime solo el bloque entre COPIA-INTERNA y FIN-COPIA de /home/agent/inventario.txt y extrae la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Procesado"
{
  echo " libro 001: rutina"
  echo "COPIA-INTERNA desde aquí"
  echo " interna: $DOJO_FLAG"
  echo " protégelo: frente al ruido"
  echo "FIN-COPIA hasta aquí"
  echo " libro 002: rutina"
} > /home/agent/inventario.txt
chown agent:agent /home/agent/inventario.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sed -n '/COPIA-INTERNA/,/FIN-COPIA/p' /home/agent/inventario.txt | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      "sed -n '/inicio/,/fin/p' imprime el rango entre ambos patrones (el -n silencia el resto).",
      'El bloque incluye las delimitadoras; grep -oE con la forma de la marca limpia todo.',
      "sed -n '/COPIA/,/FIN/p' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'El rango de patrones de sed es la "zona de interés en extracto":/logs de configuración con bloques BEGIN/END son su habitat natural. awk entre triviales /pat/,/pat/ hace lo mismo con gsub…',
    cheatsheet: [
      { cmd: "sed -n '/a/,/b/p' f", desc: 'rango a→b' },
      { cmd: "awk '/a/,/b/' f", desc: 'rango con awk' },
    ],
    keywords: ['sed', 'rango', 'bloque'],
  }),
  mk('procesado', 17, {
    title: 'Coincidencia awk',
    subtitle: 'regex con ~ en awk',
    xp: 45, difficulty: 3,
    brief: 'schemas.txt lista esquemas con su versión. El registro cuyo segundo campo empieza por 9 esconde la pieza.',
    goal: 'Encuentra en /home/agent/schemas.txt la línea cuyo segundo campo empieza por 9 y muéstrala.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Procesado"
{
  echo "dns     105 v3"
  echo "kem     8.2 v2"
  echo "subtotal 9-esquema: $DOJO_FLAG"
  echo "kda     7.0 v1"
  echo "kig     2.1 v4"
} > /home/agent/schemas.txt
chown agent:agent /home/agent/schemas.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`awk '$2 ~ /^9/ {print}' /home/agent/schemas.txt`,
    hints: [
      'El operador ~ de awk es "encaje de patrón": $2 ~ /^9/ significa "el 2º campo empieza por 9".',
      'El ^ ancla al inicio del campo.',
      "awk '$2 ~ /^9/ {print}' /home/agent/schemas.txt",
    ],
    teach: 'awk permite regex per columna: \'/pat/\' filtra por la línea completa pero $n ~ /pat/ es selectivo por field: precisión quirúrgica en logs anchos.',
    cheatsheet: [
      { cmd: "awk '$1 ~ /^9/ {print}' f", desc: 'regex sobre campo' },
      { cmd: "awk '$2 !~ /b/ {print}' f", desc: 'negación con !~' },
    ],
    keywords: ['awk', 'regex', 'campo'],
  }),
  mk('procesado', 18, {
    title: 'Solo en la segunda',
    subtitle: 'comm -13 sin sort visible',
    xp: 45, difficulty: 3,
    brief: 'Dos listas casi idénticas: listas.txt y firmadas.txt. La única línea que está SOLO en la segunda esconde la pieza.',
    goal: 'Compara /home/agent/listas.txt y /home/agent/firmadas.txt y muestra la línea que aparece solo en la segunda (comm -13).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Procesado"
{
  echo " teammate-1"; echo " teammate-2"; echo " teammate-3"; echo " teammate-4"
} > /home/agent/listas.txt
{
  echo " teammate-1"; echo " teammate-2"; echo " teammate-3"; echo " comun4: $DOJO_FLAG"
} > /home/agent/firmadas.txt
chown agent:agent /home/agent/listas.txt /home/agent/firmadas.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`comm -13 <(sort /home/agent/listas.txt) <(sort /home/agent/firmadas.txt)`,
    hints: [
      'comm exige ambos ficheros ordenados: pasa por sort si hace falta.',
      'comm -13 oculta la 1ª y la 3ª columna: deja las líneas exclusivas de la 2ª.',
      'comm -13 <(sort a) <(sort b)',
    ],
    teach: 'comm es el comparador de SETS con columnas: -1, -2 y -3 esconden columnas; -13 = "solo en la 2ª". diff muestra diferencias CONTEXTUALES; comm muestra diferencias de PERTENENCIA.',
    cheatsheet: [
      { cmd: 'comm -12 a b', desc: 'intersección' },
      { cmd: 'comm -13 a b', desc: 'solo en b' },
    ],
    keywords: ['comm', 'diff', 'sets'],
  }),
];

const permisos = [
  mk('permisos', 13, {
    title: 'El despacho cerrado',
    subtitle: 'chmod +x para ejecutar',
    xp: 40, difficulty: 2,
    brief: 'El run del despacho está congelado (sin permiso de ejecución). Reapuningo con el bit x y córrelo.',
    goal: 'Da permiso de ejecución a /home/agent/despacho.sh y ejecútalo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Permisos"
cat > /home/agent/despacho.sh <<FIN
#!/bin/bash
echo "el despacho confirma: $DOJO_FLAG"
FIN
chmod 644 /home/agent/despacho.sh
chown agent:agent /home/agent/despacho.sh
chown -R agent:agent /home/agent`,
    solution: String.raw`chmod u+x /home/agent/despacho.sh && /home/agent/despacho.sh`,
    hints: [
      'chmod u+x añade el bit de ejecución al propietario; chmod +x lo añade a todos.',
      'Es un script de shell: bash despacho.sh también correría… pero el nivel pide ejecutarlo como program.',
      'chmod +x /home/agent/despacho.sh && /home/agent/despacho.sh',
    ],
    teach: 'Sin x, un script es texto (así lo trata bash y el kernel). El bit x + el shebang lo convierten en comando utilizable. Diferencia entre "bash script" (interénte del corazón de bash) y "./script" (proceso propio).',
    cheatsheet: [
      { cmd: 'chmod u+x f', desc: 'ejecución del dueño' },
      { cmd: 'chmod +x f', desc: 'todos: dueño/grupo/otros' },
    ],
    keywords: ['chmod', 'ejecutar', 'script'],
  }),
  mk('permisos', 14, {
    title: 'El 777 del dojo',
    subtitle: 'find -perm: buscar por permisos',
    xp: 40, difficulty: 2,
    brief: 'En ~/caja hay ficheros con permisos tripatas. Solo uno tiene modo 777 — y es ejecutable por cualquiera… como tú (es tuyo).',
    goal: 'Encuentra el fichero 777 de /home/agent/caja y ejecútalo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Permisos"
mkdir -p /home/agent/caja
echo "toast-A: nada" > /home/agent/caja/A.txt; chmod 644 /home/agent/caja/A.txt
echo "toast-B: nada" > /home/agent/caja/B.txt; chmod 600 /home/agent/caja/B.txt
cat > /home/agent/caja/llamada.sh <<FIN
#!/bin/bash
echo "la llamada: $DOJO_FLAG"
FIN
cat > /home/agent/caja/exec.sh <<FIN
#!/bin/bash
echo "lo ejecutable: $DOJO_FLAG"
FIN
chmod 777 /home/agent/caja/exec.sh
chmod 700 /home/agent/caja/llamada.sh
chown -R agent:agent /home/agent`,
    solution: String.raw`f=$(find /home/agent/caja -perm 777 | head -n1); "$f"`,
    hints: [
      'find -perm 777 casco exacto con todos los bits rwx para todos.',
      'Ejecutalo llamándolo con su ruta tal cual.',
      'f=$(find /home/agent/caja -perm 777 | head -n1); "$f"',
    ],
    teach: 'find -perm busca por bits de permisos te los ordena: /777 (cualquiera de los bits), -777 (al menos los bits) y 777 (exacto). Útil en auditoría: "¿qué es 777 por ahí?"',
    cheatsheet: [
      { cmd: 'find d -perm 777', desc: 'modo exacto' },
      { cmd: 'find d -perm -777', desc: 'al menos' },
    ],
    keywords: ['find', 'perm', '777'],
  }),
  mk('permisos', 15, {
    title: 'Gremio con llave',
    subtitle: 'usermod -aG: entrar en el grupo',
    xp: 45, difficulty: 3,
    brief: 'Un fichero es rw para el grupo solegado (ronda) y root le pertenece. Ya Formisteas pero no activó tu afiliación.',
    goal: 'Apunta al usuario agent al grupo ronda y muestra /var/local/gremio/llave.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Permisos"
groupadd -f ronda
mkdir -p /var/local/gremio
echo "la llave del gremio: $DOJO_FLAG" > /var/local/gremio/llave.txt
chown root:ronda /var/local/gremio/llave.txt
chmod 640 /var/local/gremio/llave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sudo usermod -aG ronda agent; sudo -g ronda cat /var/local/gremio/llave.txt`,
    hints: [
      'El sudo del dojo está sin contraseña: usermod -aG ronda agent.',
      'La lectura del fichero solo exige que el grupo sea ronda: usa sudo -g ronda para el cat.',
      'sudo usermod -aG ronda agent; sudo -g ronda cat /var/local/gremio/llave.txt',
    ],
    teach: 'El grupo segundo de acceso parte del usuario: /etc/group manda; en ejecución (proc eco), el agente solo pega si su sesida tiene RONDA en el libro: newgrp re-arrastré la sesión con el GRUPO nuevo sin cerrar la terminal.',
    cheatsheet: [
      { cmd: 'usermod -aG grupo u', desc: 'añadir usuario al grupo' },
      { cmd: 'groups', desc: 'tus grupos de esta sesión' },
    ],
    keywords: ['groupadd', 'usermod', 'grupo'],
    profile: 'sudo',
  }),
  mk('permisos', 16, {
    title: 'El espejo sin ventana',
    subtitle: 'chmod u+r: escribir sin leer',
    xp: 45, difficulty: 3,
    brief: 'llave.txt es -w- para ti: puedes escribir, no leer (raro, pero es el buen test de bits). Dá por transferérse la lectura y místralo.',
    goal: 'Restaura los permisos de /home/agent/caja-negra/llave.txt (dueño puede leer) y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Permisos"
mkdir -p /home/agent/caja-negra
echo "la llave de espejo: $DOJO_FLAG" > /home/agent/caja-negra/llave.txt
chmod 200 /home/agent/caja-negra/llave.txt
chown agent:agent /home/agent/caja-negra/llave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`chmod 644 /home/agent/caja-negra/llave.txt && cat /home/agent/caja-negra/llave.txt`,
    hints: [
      'chmod 644 = dueño r+w (4+2), grupo y otros r (4).',
      'Es tu fichero: puedes cambiar los permisos libremente.',
      'chmod 644 f && cat f',
    ],
    teach: 'w sin r es un modo aníritu: como dueño puedes autocorregirte. chown SIEMPRE requiere root — chmod no. La cuadrícula octal: 4=r, 2=w, 1=x.',
    cheatsheet: [
      { cmd: 'stat -c %a f', desc: 'permisos en octal' },
      { cmd: 'chmod 644 f', desc: 'estándar legible' },
    ],
    keywords: ['chmod', 'octal', 'dueño'],
  }),
  mk('permisos', 17, {
    title: 'La pila congelada',
    subtitle: 'find -perm 000: ficheros muertos',
    xp: 45, difficulty: 3,
    brief: 'En ~/redactar todos los ficheros menos uno tienen por cerrado (000). Dáles lectura a los muertos y extrae la pieza del que hasta ahora estaba blanco.',
    goal: 'Encuentra en /home/agent/redactar el fichero con permisos 000, restáura su lectura para el dueño y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Permisos"
mkdir -p /home/agent/redactar
for i in 1 2 3 4 5; do echo "acta $i: normal" > /home/agent/redactar/a$i.txt; chmod 600 /home/agent/redactar/a$i.txt; done
echo "acta 6: $DOJO_FLAG" > /home/agent/redactar/a6.txt
chmod 000 /home/agent/redactar/a6.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`f=$(find /home/agent/redactar -perm 000 -type f); chmod 600 "$f"; cat "$f"`,
    hints: [
      'find -perm 000 encuentra exactamente los ficheros sin ningún permiso.',
      'chmod 600 los deja r+w para el dueño (o 644).',
      'f=$(find d -perm 000); chmod 600 "$f"; cat "$f"',
    ],
    teach: 'Un 000 es un fichero invisible para el contenido y visible por nombre. find -perm 000 es su buscador idóneo — igual que -perm 400 desenmáscara esos "solo lectura" que confunden.',
    cheatsheet: [
      { cmd: 'find d -perm 000', desc: 'ficheros soldados' },
      { cmd: 'chmod 600 f', desc: 'dueño r+w' },
    ],
    keywords: ['perm', '000', 'chmod'],
  }),
  mk('permisos', 18, {
    title: 'El par prohibido',
    subtitle: 'sudo: escalamiento básico',
    xp: 50, difficulty: 4,
    brief: 'En /root vive un fichero al que un usuario normal no llega. El dojo confía en ti: sube un peldaño con sudo.',
    goal: 'Lee /root/paneles/llave.txt con el sudo que tiene el agent habilitado.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Permisos"
mkdir -p /root/paneles
echo "acceso al panel: $DOJO_FLAG" > /root/paneles/llave.txt
chmod 600 /root/paneles/llave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`sudo cat /root/paneles/llave.txt`,
    hints: [
      'El agent del dojo tiene sudo sin contraseña (sudoers.d_pending): sudo comando corre como root.',
      'sudo cat fichero basta; no uses sudo -i (abre otra shell entera).',
      'sudo cat /root/paneles/llave.txt',
    ],
    teach: 'sudo es la franquicia contemplada de elevación: comando a comando, sin sesión completa. ¿Por qué "sudo cat" y no "sudo sh"? Menos superficie, auditoría línea a línea.',
    cheatsheet: [
      { cmd: 'sudo -l', desc: 'qué te permiten' },
      { cmd: 'sudo cmd', desc: 'comando como root' },
    ],
    keywords: ['sudo', 'root', 'escalada'],
    profile: 'sudo',
  }),
];

export default [...busqueda, ...procesado, ...permisos];
