/**
 * gen-levels3-d — tanda 3 (parte D): archivos l13..l18 · scripting l13..l18 · forense l13..l18.
 * Misiones NUEVAS, sin duplicar tanda 1-2 (sin getopts, source, rot13, tar -O…).
 */
import { mk } from './lib-levels.mjs';

const archivos = [
  mk('archivos', 13, {
    title: 'Pieza en cuatro trozos',
    subtitle: 'split + cat de reunición',
    xp: 45, difficulty: 3,
    brief: 'El tar quedó dividido en trozos de 200 bytes por split. Reune los fragmentos en orden y descomprime al vuelo.',
    goal: 'Une los trozos de /home/agent/partes/ con cat y extrae el tar.gz resultante leyendo su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Archivos"
mkdir -p /home/agent/partes /tmp/pieza13
printf 'la pieza trozada: %s\n' "$DOJO_FLAG" > /tmp/pieza13/marca.txt
tar -czf /tmp/pieza13/paquete.tgz -C /tmp/pieza13 marca.txt
split -b 200 /tmp/pieza13/paquete.tgz /home/agent/partes/trozo-
rm -rf /tmp/pieza13
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /home/agent/partes/trozo-* | tar -xzOf - | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'Los trozos de split nombran con sufijo ordenado (trozo-aa, trozo-ab…): por orden alfabético ya están en orden.',
      'cat trozo-* reconstruye el original; tar -xzOf - lee el catenado sin tocar disco.',
      "cat /home/agent/partes/trozo-* | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'split parte a bytes fijos (-b) o por líneas (-l); cat * los regresa. El estándar de envíos por fichero pequeño (cuota de tamaño de mail/FTP) es este par siempre alfligido.',
    cheatsheet: [
      { cmd: 'split -b 1M f trozo-', desc: 'divide por megabytes' },
      { cmd: 'cat trozo-*', desc: 'reunir en orden' },
    ],
    keywords: ['split', 'cat', 'tar'],
  }),
  mk('archivos', 14, {
    title: 'Cofre con clave',
    subtitle: 'zip + unzip -P',
    xp: 45, difficulty: 3,
    brief: 'El cofre.zip está cifrado con unzip: la contraseña está impresa en la nota de al lado.',
    goal: 'Lee la contraseña de /home/agent/nota.txt y muestra el contenido de cofre.zip al stdout (unzip -p).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Archivos"
mkdir -p /tmp/cofre14
echo "guardada: $DOJO_FLAG" > /tmp/cofre14/interior.txt
( cd /tmp/cofre14 && zip -P dojocofre cofre.zip interior.txt >/dev/null )
mv /tmp/cofre14/cofre.zip /home/agent/cofre.zip
printf 'la clave del cofre ES: dojocofre\n' > /home/agent/nota.txt
rm -rf /tmp/cofre14
chown agent:agent /home/agent/cofre.zip /home/agent/nota.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep -oE 'dojocofre' /home/agent/nota.txt | head -n1); unzip -p -P "$p" /home/agent/cofre.zip`,
    hints: [
      'unzip -p imprime el contenido SIN extraerlo al disco (a difference of unzip normal).',
      'La clave está en nota.txt; usa grep -oE para casi es crunch.',
      'unzip -p -P CLAVE /home/agent/cofre.zip',
    ],
    teach: 'zip/unzip con cifrado Clásico (ZipCrypto) o AES según versión. unzip -p es el "cat" de los zips: manda a stdout y manejable en pipelines.',
    cheatsheet: [
      { cmd: 'zip -P clave cofre.zip f', desc: 'cifrar al crear' },
      { cmd: 'unzip -p -P clave f.zip', desc: 'cat del interior cifrado' },
    ],
    keywords: ['zip', 'unzip', 'password'],
  }),
  mk('archivos', 15, {
    title: 'El tercer compresor',
    subtitle: 'xz: el de ratio más alto',
    xp: 45, difficulty: 3,
    brief: 'xiles.txt.xz usa xz (extension .xz) — no gzip ni zip. xz -dc lo decodifica al stdout.',
    goal: 'Decodifica /home/agent/xiles.txt.xz y extrae la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Archivos"
printf 'ka la marca en xz: %s\n' "$DOJO_FLAG" | xz > /home/agent/xiles.txt.xz
chown agent:agent /home/agent/xiles.txt.xz
chown -R agent:agent /home/agent`,
    solution: String.raw`xz -dc /home/agent/xiles.txt.xz | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'xz -d descomprime; añade -c para mandar el resultado al stdout (xz -dc).',
      'La forma de la marca con grep -oE escribes poco que filtrar.',
      "xz -dc f.xz | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'gzip (rápido), bzip2 (mejor ratio), xz (lo mejor ratio, más lento) y zstd (el equilibrado moderno). El sufijo .xz señala realmente Adventisten del juego; -c manda salida al stdout.',
    cheatsheet: [
      { cmd: 'xz -dc f.xz', desc: 'al stdout' },
      { cmd: 'zstd -d f.zst', desc: 'el moderno' },
    ],
    keywords: ['xz', 'compresion', 'stdout'],
  }),
  mk('archivos', 16, {
    title: 'El salto del faro',
    subtitle: 'readlink -f: resolver cadenas de symlinks',
    xp: 45, difficulty: 3,
    brief: 'En ~/faro cuatro enlaces simbólicos se recogen como bengalas lazos: lazo1 → lazo2 → lazo3 → … hasta la pieza.',
    goal: 'Resuelve la cadena de symlinks desde /home/agent/faro/lazo1 y muestra el fichero final.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Archivos"
mkdir -p /home/agent/faro/piedra
echo "la masa del faro: $DOJO_FLAG" > /home/agent/faro/piedra/nucleo.txt
ln -s /home/agent/faro/lazo2 /home/agent/faro/lazo1
ln -s /home/agent/faro/lazo3 /home/agent/faro/lazo2
ln -s /home/agent/faro/piedra/nucleo.txt /home/agent/faro/lazo3
chown -R agent:agent /home/agent`,
    solution: String.raw`cat "$(readlink -f /home/agent/faro/lazo1)"`,
    hints: [
      'readlink -p resuelve UN salto; readlink -f resuelve TODA la cadena hasta el fichero real.',
      'readlink -f lazo1 imprime el destino real; cat $(readlink -f lazo1) lo muestra.',
      'cat "$(readlink -f /home/agent/faro/lazo1)"',
    ],
    teach: 'Un symlink es un puntero: readlink -f lo data el destino ABSOLUTO final a(disfraz de infinite loops). Comprobar enlaces rotos es find -L -type l.',
    cheatsheet: [
      { cmd: 'readlink -f f', desc: 'destino absoluto final' },
      { cmd: 'ls -l', desc: 'flecchas de los links' },
    ],
    keywords: ['symlink', 'readlink', 'cadena'],
  }),
  mk('archivos', 17, {
    title: 'Remiendo aplicado',
    subtitle: 'patch < fix.diff',
    xp: 45, difficulty: 3,
    brief: 'La pieza es invisible hasta que alguien APLIQUé el remiendo fix.diff sobre pieza.txt — revela la línea oculta.',
    goal: 'Aplica /home/agent/fix.diff sobre /home/agent/pieza.txt (cd + patch) y muestra el resultado.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Archivos"
mkdir -p /home/agent/taller
printf 'linea uno\n GuiA pendiente de remiendo\nlinea tres\n' > /home/agent/taller/pieza.txt
cat > /home/agent/taller/fix.diff <<DIFF
--- pieza.txt
+++ pieza.txt
@@ -1,3 +1,4 @@
 linea uno
- GuiA pendiente de remiendo
+la pieza remendada: $DOJO_FLAG
+fecha del remiendo: tanda tres
 linea tres
DIFF
chown -R agent:agent /home/agent`,
    solution: String.raw`cd /home/agent/taller && patch pieza.txt < /home/agent/taller/fix.diff && cat /home/agent/taller/pieza.txt`,
    hints: [
      'Herramienta: cd al taller; patch fichero < remiendo.diff.',
      'Si el remiendo queja por los paths del header, prueba -p0 o -p1.',
      'cd /home/agent/taller && patch pieza.txt < fix.diff; cat pieza.txt',
    ],
    teach: 'diff COMPARA y patch APLICA: el par que rige el flujo de parcheos (kernel, git apply). Saber generar (diff -u a b > f.diff) y aplicar (patch < f.diff) es lengüeta de mantenedor.',
    cheatsheet: [
      { cmd: 'diff -u a b > rem.diff', desc: 'generar remiendo' },
      { cmd: 'patch f < rem.diff', desc: 'aplicar' },
    ],
    keywords: ['patch', 'diff', 'remiendo'],
  }),
  mk('archivos', 18, {
    title: 'Nombres sin lazar',
    subtitle: 'find + nombres con espacios',
    xp: 45, difficulty: 3,
    brief: 'En ~/desorden los ficheros parecen tesoros de traslación: espacios, guiones, puntos raros. Solo un "salida" (con espacios y guiones) guarda la pieza.',
    goal: 'Localiza con find el fichero con "salida" en su nombre dentro de /home/agent/desorden y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Archivos"
mkdir -p /home/agent/desorden
echo "no importante" > "/home/agent/desorden/nota con  espacios.txt"
echo "falso 1" > "/home/agent/desorden/prueba -- salida falsa.txt"
echo "falso 2" > "/home/agent/desorden/out.txt"
echo "falso 3" > "/home/agent/desorden/salida  falso.txt"
echo "guardada con espacios: $DOJO_FLAG" > "/home/agent/desorden/salida -- final (ok).txt"
chown -R agent:agent /home/agent`,
    solution: String.raw`cat "$(find /home/agent/desorden -name '*salida*' | grep 'final' | head -n1)"`,
    hints: [
      'find -name "*salida*" es con COMILLAS: sin ellas, el glob explota en tu shell.',
      'Del resultado filtra el que va de "final" (solo él es el buen camino), con grep.',
      'cat "$(find /home/agent/desorden -name "*salida*" | grep final)"',
    ],
    teach: 'Nombres con espacios son el pecado de un 50% de los scripts: SIEMPRE entre comillas "$(...)". Con find -print0 | xargs -0 nulos separan sin ambigüedad.',
    cheatsheet: [
      { cmd: "find d -name '*salida*'", desc: 'por nombre con comillas' },
      { cmd: 'find -print0 | xargs -0 cmd', desc: 'nombres raros a prueba de cañas' },
    ],
    keywords: ['find', 'espacios', 'quoting'],
  }),
];

const scripting = [
  mk('scripting', 13, {
    title: 'Índice triangular',
    subtitle: 'arrays de bash',
    xp: 45, difficulty: 3,
    brief: 'El monstruo de ~/almenas ordena sus marcas por posición: la del índice 2 (el tercero de la lista ordenada) es la buena.',
    goal: 'Carga el contenido de /home/agent/almenas en un array ordenado y muestra el elemento de índice 2 con su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Scripting"
mkdir -p /home/agent/almenas
echo "marca alfa: nada" > /home/agent/almenas/1-alfa.txt
echo "marca beta: nada" > /home/agent/almenas/2-beta.txt
echo "marca gamma: $DOJO_FLAG" > /home/agent/almenas/3-gamma.txt
echo "marca delta: nada" > /home/agent/almenas/4-delta.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`arr=($(ls /home/agent/almenas)); echo "${'$'}{arr[2]}"; cat "/home/agent/almenas/${'$'}{arr[2]}"`,
    hints: [
      'Los arrays en bash empiezan en 0: arr[2] es el TERCER miembro de la lista.',
      'Con ls ordenado alfabético 1-alfa…4-delta, el tercero es 3-gamma.',
      'arr=($(ls /home/agent/almenas)); echo "${arr[2]}"',
    ],
    teach: 'Bash nace de Savoy arrays: arr=(...) crea, ${arr[0]} lee el PRIMER elemento y ${#arr[@]} cuenta. Los índices empiezan si en 0, y la expansión entre comillas evita split por espacios.',
    cheatsheet: [
      { cmd: 'arr=(a b c)', desc: 'constructor de array' },
      { cmd: '"${arr[2]}"', desc: 'tercer elemento' },
    ],
    keywords: ['arrays', 'bash', 'indice'],
  }),
  mk('scripting', 14, {
    title: 'Línea a línea',
    subtitle: 'while read en un bucle',
    xp: 45, difficulty: 3,
    brief: 'El manifiesto lista exactamente UNA ruta "es bueno". Con un while read línea a línea puedes inspeccionar cada fichero sin recorrer a mano.',
    goal: 'Recorre /home/agent/manifiesto.txt con while read y muesta la primera ficha cuyo contenido menciona la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Scripting"
mkdir -p /home/agent/plataformas
for n in 1 2 3 4; do echo "ficha $n: rutina del dojo" > /home/agent/plataformas/f$n.txt; done
printf 'marca: %s\n' "$DOJO_FLAG" > /home/agent/plataformas/f3.txt
{ echo "/home/agent/plataformas/f1.txt"
  echo "/home/agent/plataformas/f2.txt"
  echo "/home/agent/plataformas/f3.txt"
  echo "/home/agent/plataformas/f4.txt"; } > /home/agent/manifiesto.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`while read -r f; do if grep -qE 'FLAG\{[a-f0-9]+\}' "$f" 2>/dev/null; then grep -oE 'FLAG\{[a-f0-9]+\}' "$f"; break; fi; done < /home/agent/manifiesto.txt`,
    hints: [
      'while read -r línea lee un fichero línea a línea con redirección < fichero.',
      'La condición de grep -q: si uno matchea, imprime la marca y break detiene el bucle.',
      "while read -r f; do grep -oE 'FLAG\\{[a-f0-9]+\\}' \"$f\" && break; done < manifiesto.txt",
    ],
    teach: 'while read -r es EL bucle de líneas en bash (xargs -I es el primo). La -r cuesta nada y evita que el backslash se coma los datos. Con < fichero al final, el bucle lee del fichero.',
    cheatsheet: [
      { cmd: 'while read -r f; do …; done < f', desc: 'línea a línea' },
      { cmd: 'grep -q patrón f', desc: 'silencioso para ifs' },
    ],
    keywords: ['while', 'read', 'bucle'],
  }),
  mk('scripting', 15, {
    title: 'La taquilla numérica',
    subtitle: 'aritmética $(( ))',
    xp: 45, difficulty: 3,
    brief: 'Dos ficheros de la taquilla, dos números. La SUMA de ambos es el número de la celda que guarda la pieza.',
    goal: 'Suma el contenido de a.num y b.num de /home/agent/taquilla y muestra la celda ~/taquilla/N.txt que sea el resultado.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Scripting"
mkdir -p /home/agent/taquilla
echo 39 > /home/agent/taquilla/a.num
echo 41 > /home/agent/taquilla/b.num
echo "vacias" > /home/agent/taquilla/78.txt
echo "celda acertada: $DOJO_FLAG" > /home/agent/taquilla/80.txt
echo "vacía" > /home/agent/taquilla/84.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`a=$(cat /home/agent/taquilla/a.num); b=$(cat /home/agent/taquilla/b.num); cat "/home/agent/taquilla/$((a+b)).txt"`,
    hints: [
      '$((expr)) hace matemáticas en bash (y no creche chamuscados).',
      'La celda correcta se llama con el RESULTADO de la suma.',
      'cat "$((a+b))"',
    ],
    teach: 'La aritmética de bash es nativa con $(( )): no necesitas expr ni bc para enteras (bc sí para decimales). Asignaciones también van dentro: s=$((s+1)).',
    cheatsheet: [
      { cmd: "echo $((3*7))", desc: '21' },
      { cmd: 's=$((s+1))', desc: 'contador' },
    ],
    keywords: ['aritmetica', 'contar', 'bash'],
  }),
  mk('scripting', 16, {
    title: 'Dos mitades, un todo',
    subtitle: 'paste -d\x27\x27 + printf',
    xp: 45, difficulty: 3,
    brief: 'La marca está partida: la mitad izquierda en parteA.txt, la derecha en parteB.txt. Sin espacios entre ellas, el todo ES la marca.',
    goal: 'Concatena la primera línea de ambas partes (paste sin delimitador) y muéstrala como una sola cadena.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Scripting"
F="$DOJO_FLAG"
printf '%s\n' "${'$'}{F:0:17}" > /home/agent/parteA.txt
printf '%s\n' "${'$'}{F:17}" > /home/agent/parteB.txt
chown agent:agent /home/agent/parteA.txt /home/agent/parteB.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`cat /home/agent/parteA.txt /home/agent/parteB.txt | tr -d '\n'`,
    hints: [
      'paste -d"" une líneas lado a lado SIN delimitador.',
      'La primera línea de cada parte forma una cadena única.',
      "paste -d'' /home/agent/parteA.txt /home/agent/parteB.txt",
    ],
    teach: 'paste une ficheros línea a línea (el opuesto de cut). Con -d"" queda pegado sin nada. También sufipe como procesador de par axes de columnas.',
    cheatsheet: [
      { cmd: "paste -d'' a b", desc: 'uñir sin separador' },
      { cmd: 'paste a b', desc: 'unidos con TAB' },
    ],
    keywords: ['paste', 'concatenar', 'printf'],
  }),
  mk('scripting', 17, {
    title: 'El invocador',
    subtitle: 'expansiones ${var^^} y ${var:0:n}',
    xp: 45, difficulty: 3,
    brief: 'La pista fichada llegó en minúsculas: la expansión de parámetros la arregla en el propio shell, con MAYÚSCULAS y sin sed.',
    goal: 'Pon en MAYÚSCULAS el contenido de /home/agent/id_doc.txt y muéstralo (expansión ${v^^}).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Scripting"
V="$DOJO_FLAG"
printf 'código bajo y en minúscula: %s\n' "$V" | tr 'A-Z' 'a-z' > /home/agent/id_doc.txt
chown agent:agent /home/agent/id_doc.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`v=$(grep -ioE 'flag\{[a-f0-9]+\}' /home/agent/id_doc.txt | head -n1); echo "${'$'}{v^^}"`,
    hints: [
      '${v^^} pone en MAYÚSCULAS toda la variable; ${v,,} en minúsculas.',
      'Extrae primero la forma en minúscula con grep -oE (y la -i).',
      "v=$(grep -ioE 'flag\\{[a-f0-9]+\\}' f); echo \"${v^^}\"",
    ],
    teach: 'Las expansiones de parámetros son el "pozo" de bash: ${v^^} (MAYÚSCULAS), ${v:0:5} (substring), ${v%.txt} (quitar sufijo). Sin sed ni tr manipulas cadenas en la misma línea.',
    cheatsheet: [
      { cmd: 'echo "${v^^}"', desc: 'MAYÚSCULAS' },
      { cmd: 'echo "${v:0:5}"', desc: 'primeros 5' },
    ],
    keywords: ['expansion', 'bash', 'mayusculas'],
  }),
  mk('scripting', 18, {
    title: 'La cadena de pasos',
    subtitle: '&&, || y códigos de salida',
    xp: 50, difficulty: 3,
    brief: 'Los pasos corren en orden: solo si el paso1 pasa (exit 0), el paso2 corre y entrega la pieza; si no, el ruido.',
    goal: 'Ejecuta en cadena: si /home/agent/paso1.sh pasa, corre paso2.sh y muestra la marca querena escrita en /tmp/corredor.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Scripting"
cat > /home/agent/paso1.sh <<FIN
#!/bin/bash
# paso 1 del corredor: válido +' exit 0 siempre'
exit 0
FIN
cat > /home/agent/paso2.sh <<FIN
#!/bin/bash
echo "corredor en su muelle: $DOJO_FLAG" > /tmp/corredor.txt
FIN
chmod 755 /home/agent/paso1.sh /home/agent/paso2.sh
chown -R agent:agent /home/agent`,
    solution: String.raw`/home/agent/paso1.sh && /home/agent/paso2.sh && cat /tmp/corredor.txt`,
    hints: [
      'cmd1 && cmd2 ejecuta cmd2 solo si cmd1 salió con 0.',
      'A la inversa, || corre SOLO si el anterior falla.',
      'paso1.sh && paso2.sh && cat /tmp/corredor.txt',
    ],
    teach: '&& y || son los "and / or" de comandos encasquetados: exit 0 = TRUE, resto = FALSE. La cadena cmd1 && cmd2 && cmd3 es un flujo de puerta: falla al primero, para. Escondido en todos los CI.',
    cheatsheet: [
      { cmd: 'cmd1 && cmd2', desc: 'si pasa, si no, no' },
      { cmd: 'cmd1 || cmd2', desc: 'si falla, el plan B' },
    ],
    keywords: ['exit', 'cadena', 'codigos'],
  }),
];

const forense = [
  mk('forense', 13, {
    title: 'Hexdump invertido',
    subtitle: 'xxd -r: reconstituir desde hex',
    xp: 45, difficulty: 3,
    brief: 'volcado.hex guarda la pieza como volcado hexadecimal. xxd -r es su inverso EXACTO.',
    goal: 'Reconstruye /home/agent/volcado.hex con xxd -r y muestra la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Forense"
printf 'la pieza en hex: %s\n' "$DOJO_FLAG" | xxd > /home/agent/volcado.hex
chown agent:agent /home/agent/volcado.hex
chown -R agent:agent /home/agent`,
    solution: String.raw`xxd -r /home/agent/volcado.hex | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'xxd fichero produce el volcado hex; xxd -r fichero.hex hace lo inverso: bytes desde hex.',
      'La marea de texto uxxd lleva offsets y ASCII: -r reconstruye SOLO desde la columna hex.',
      "xxd -r /home/agent/volcado.hex | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'xxd y xxd -r son par par (hex ↔ bytes). Es la forma de desempacar trozos binarios que solo existen como texto en otra capa (datos de un log, chat…).',
    cheatsheet: [
      { cmd: 'xxd f | head', desc: 'volcado hex' },
      { cmd: 'xxd -r f.hex', desc: 'hex → bytes' },
    ],
    keywords: ['xxd', 'hex', 'reverso'],
  }),
  mk('forense', 14, {
    title: 'strings reveladoras',
    subtitle: 'binario con texto enterrado',
    xp: 45, difficulty: 3,
    brief: 'mechero.bin es un binario auténtico con los stamp de la marca enterreado entre bytes que no son texto.',
    goal: 'Extrae con strings las cadenas legibles de /home/agent/mechero.bin y pescar la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Forense"
{ printf '\x00\x01\x02\x03'
  printf 'segmento de pais\n'
  printf '\x04\x05\x06'
  printf 'la marca de fondo: %s\n' "$DOJO_FLAG"
  printf '\x07\x08\x09\x00'
  printf 'relleno final del mechero\n'
  printf '\x00\x0a'; } > /home/agent/mechero.bin
chown agent:agent /home/agent/mechero.bin
chown -R agent:agent /home/agent`,
    solution: String.raw`strings -n 6 /home/agent/mechero.bin | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'strings -n 6 imprime las cadenas de AL MENOS 6 caracteres (sin $0 forma extraña).',
      'En binarios con NUL y bytes raros, strings filtra "lo que parece texto".',
      "strings /home/agent/mechero.bin | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'binutils strings es LA herramienta forense de "¿qué texto escondían los bytes?": antivirus, CTFs y data recovery parten de aquí. grep -a hace lo mismo en un flujo, strings lo normaliza.',
    cheatsheet: [
      { cmd: 'strings f.bin', desc: 'textos del binario' },
      { cmd: 'strings -n 4 f.bin', desc: 'mínimo 4 chars' },
    ],
    keywords: ['strings', 'binario', 'forense'],
  }),
  mk('forense', 15, {
    title: 'El turno de las 09:42',
    subtitle: 'grep por marca horaria',
    xp: 45, difficulty: 3,
    brief: 'turno.log lista millones de líneas por HH:MM. Solo las del minuto 09:42 reportan el hallazgo.',
    goal: 'Filtra de /home/agent/turno.log solo las líneas de la hora 09:42 y extrae la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Forense"
{
  echo "09:40 nota: rutina la observación"
  echo "09:41 nota: rutina"
  echo "09:42 hallazgo del turno: $DOJO_FLAG"
  echo "09:42 nota: rutina secundaria"
  echo "09:43 nota: rutina"
  echo "10:00 cierre del turno"
} > /home/agent/turno.log
chown agent:agent /home/agent/turno.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep '^09:42' /home/agent/turno.log | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'El ancla ^ obliga a que el patrón esté al INICIO de línea (la marca horaria).',
      'grep "^09:42" fichero filtra el minuto; el segundo grep extrae la marca.',
      "grep '^09:42' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'Los logs estructurados se filtran mejor que se buscan: si la fecha es el primer campo, grep "^HH:MM" y awk $1=="HH:MM" son equivalentes. Elige el que dé menos falsos positivos en cada log.',
    cheatsheet: [
      { cmd: "grep '^09:42' f", desc: 'por hora al inicio' },
      { cmd: "awk '$1==\"09:42\"' f", desc: 'por campo' },
    ],
    keywords: ['logs', 'timestamp', 'grep'],
  }),
  mk('forense', 16, {
    title: 'Detalle sin débiles',
    subtitle: 'file + zcat: el compresor mudo',
    xp: 45, difficulty: 3,
    brief: 'algo_sin_nombre es un fichero sin extensión con PAPEL que contiene la pieza comprimida. file lo identifica.',
    goal: 'Identifica el tipo de /home/agent/algo_sin_nombre con file, y si es gzip muéstralo descomprimido (zcat) con su marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Forense"
printf 'la pieza muda: %s\n' "$DOJO_FLAG" | gzip -c > /home/agent/algo_sin_nombre
chmod 644 /home/agent/algo_sin_nombre
chown agent:agent /home/agent/algo_sin_nombre
chown -R agent:agent /home/agent`,
    solution: String.raw`zcat /home/agent/algo_sin_nombre | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'file fichero dice el tipo; "gzip compressed data" a la fuga la campana.',
      'zcat fichero imprime el contenido descomprimido al stdout, sin crear fichero.',
      "zcat /home/agent/algo_sin_nombre | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'La extención ES mentira; los PRIMEROS BYTES no: 1f 8b = gzip. file da el tipo real. No confiar en el nombre = primer paso forense.',
    cheatsheet: [
      { cmd: 'file f', desc: 'clase real' },
      { cmd: 'zcat f | grep x', desc: 'si es gzip…' },
    ],
    keywords: ['file', 'gzip', 'forense'],
  }),
  mk('forense', 17, {
    title: 'Fragmentos en el canal',
    subtitle: 'base64 troceado por el log',
    xp: 50, difficulty: 4,
    brief: 'Un exfiltrado partió la marca en bloques base64 de línea suelta, mezclados con líneas normales del canal. Recoge TODO, une y decodifica una vez.',
    goal: 'Extrae las líneas que parezcan base64 (solo para A-Z a-z 0-9 +/=) de /home/agent/canal.log, cóncatenas sin saltos y decodifica.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Forense"
F="$DOJO_FLAG"
B="$(printf '%s' "$F" | base64 -w0)"
n=1
while [ -n "$B" ]; do
  echo "chip $n: ${'$'}{B:0:10}"
  B="${'$'}{B:10}"
  n=$((n+1))
done > /home/agent/canal.log
echo "fin del canal: normal" >> /home/agent/canal.log
chown agent:agent /home/agent/canal.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -oE 'chip [0-9]+: [A-Za-z0-9+/=]+' /home/agent/canal.log | sed 's/.*: //' | tr -d '\n' | base64 -d`,
    hints: [
      'Los bloques van como "chip N: BLOQUE": grep -oE "chip [0-9]+: [A-Za-z0-9+/=]+" piesa el patrón.',
      'sed "s/.*: //" quita el label; tr -d "\n" une; base64 -d decodifica una sola vez.',
      "grep -oE 'chip [0-9]+: [A-Za-z0-9+/=]+' canal.log | sed 's/.*: //' | tr -d '\\n' | base64 -d",
    ],
    teach: "Exfiltrar es trocear: base64 troceado por líneas sueltas de un log es una canal clásico. La receta del analista: extraer los candidatos con regex, unir (tr -d '\\n') y decodificar UNA VEZ al final.",
    cheatsheet: [
      { cmd: "grep -oE '[A-Za-z0-9+/=]{8,}' f", desc: 'candidatos b64' },
      { cmd: "tr -d '\\n'", desc: 'unir líneas' },
    ],
    keywords: ['base64', 'trazos', 'exfiltracion'],
  }),
  mk('forense', 18, {
    title: 'Acta de embudo',
    subtitle: 'filtering combinado grep -vE',
    xp: 50, difficulty: 4,
    brief: 'La marca está en mix.log, en una línea SIN palabras trampa (falso, test, spacer) y con la forma de la marca. Doble trébol.',
    goal: 'De /home/agent/mix.log quita las líneas que contengan "falso|test|spacer" y de resto extrae la marca que encaje la regex.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Forense"
{
  echo "FALSO: prueba1: FLAG{000000000000000000000000}"
  echo "falso: prueba2 FLAG{111111111111111111111111}"
  echo "test: FLAG{222222222222222222222222} ruido"
  echo "ok: marca correcta: $DOJO_FLAG"
  echo "spacer line: FLAG{333333333333333333333333} menos"
} > /home/agent/mix.log
chown agent:agent /home/agent/mix.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -viE 'falso|test|spacer' /home/agent/mix.log | grep -oE 'FLAG\{[a-f0-9]{24}\}'`,
    hints: [
      'grep -v es de "todo lo que NO encaje"; añade -i para cualquier casa (falso, FALSO, False).',
      'La excluta con 24 hex exactos discrimeña los señuelos.',
      "grep -vE 'falso|test|spacer' f | grep -oE 'FLAG\\{[a-f0-9]{24}\\}'",
    ],
    teach: 'La inversión de log (exclusiones) es el 90% del filtrado auditable: ruido de FALLOS, ARGS DE TEST, líneas de train. -v + -E es el dúo rápido en vez del cut — de esos todos sons',
    cheatsheet: [
      { cmd: "grep -vE 'ruido|ruido2' f", desc: 'exclusión múltiple' },
      { cmd: "grep -viE 'p1|p2' f", desc: 'todo sin case' },
    ],
    keywords: ['grep', 'excluir', 'ruido'],
  }),
];

export default [...archivos, ...scripting, ...forense];
