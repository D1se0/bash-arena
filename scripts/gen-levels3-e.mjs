/**
 * gen-levels3-e — tanda 3 (parte E): boss l11..l14 (capas combinadas, dificultad alta).
 */
import { mk } from './lib-levels.mjs';

const boss = [
  mk('boss', 11, {
    title: 'Caza mayor V — tricaposa',
    subtitle: 'hex → rot13 → base64, EN ESE ORDEN',
    xp: 90, difficulty: 5,
    brief: 'indomable.dat está cerrado tres veces: primero la codificación a hex, luego rotación +13 de las letras del texto hex… y por encima, base64. Deshacer las capas EN ORDER: base64, rot13, xxd -r.',
    goal: 'Deshaz /home/agent/indomable.dat capas EN ORDEN (base64 -d → tr rot13 → xxd -r) y muéstralo.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Boss"
mkdir -p /etc/arena
printf 'resultado del reto 11: %s\n' "$DOJO_FLAG" \
  | xxd -p \
  | tr 'A-Za-z' 'N-ZA-Mn-za-m' \
  | base64 -w0 > /home/agent/indomable.dat
echo >> /home/agent/indomable.dat
chown agent:agent /home/agent/indomable.dat
chown -R agent:agent /home/agent`,
    solution: String.raw`base64 -d /home/agent/indomable.dat | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'El orden DE CIERRE es el inverso del de apertura: base64 -d, luego tr rot13, luego xxd -r -p.',
      'El texto tras las dos primeras capas es UN volcado hex puro (xxd -p): xxd -r -p lo vuelve a bytes.',
      "base64 -d f | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p",
    ],
    teach: 'Los ofuscadores encadenan transformaciones y el analista las deshace IN VERSO. Aquí el truco es darte cuenta de que el texto "rotado" es hex: 1f 8b…: análisis de primer byte = decidir la próxima capa.',
    cheatsheet: [
      { cmd: 'xxd -p f | xxd -r -p', desc: 'hex puro ida y vuelta' },
      { cmd: "tr 'A-Za-z' 'N-ZA-Mn-za-m'", desc: 'rot13 simétrico' },
    ],
    keywords: ['boss', 'capas', 'xxd', 'rot13'],
  }),
  mk('boss', 12, {
    title: 'Caza mayor VI — el cofre cifrado',
    subtitle: 'contraseña en pista + unzip + tar',
    xp: 90, difficulty: 5,
    brief: 'fortin.zip pide clave; la pista par a la izquierda da su valor exacto (no la adivines: léela). Dentro hay un tar.gz con la marca.',
    goal: 'Extrae la clave de /home/agent/fortin.clave, abre fortin.zip con ella (unzip -p) y de ahí extrae el tar.gz embebido con la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Boss"
mkdir -p /tmp/fortin12/interior /etc/arena
printf 'rota del fortin: %s\n' "$DOJO_FLAG" > /tmp/fortin12/interior/marca.txt
tar -czf /tmp/fortin12/fortin.tgz -C /tmp/fortin12/interior marca.txt
( cd /tmp/fortin12 && zip -P claveDelFortin12 fortin.zip fortin.tgz >/dev/null )
mv /tmp/fortin12/fortin.zip /home/agent/fortin.zip
printf 'la clave EXACTA del fortin es: claveDelFortin12\n' > /home/agent/fortin.clave
rm -rf /tmp/fortin12
chown agent:agent /home/agent/fortin.zip /home/agent/fortin.clave
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep -oE 'claveDelFortin12' /home/agent/fortin.clave | head -n1); unzip -p -P "$p" /home/agent/fortin.zip | tar -xzOf - | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'La clave completa es una cadena impresa en fortin.clave: grep para sacarla limpia.',
      'unzip -p -P CLAVE imprime el tar.gz al stdout; tar -xzOf - lo lee de ahí.',
      "unzip -p -P KEY fortin.zip | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'flujos sin tocar disco: unzip -p manda el BINARIO interior al stdout y tar -xzOf - lo consume: la cadena de compresores se descuelga sin ficheros temporales. Limpio y auditable.',
    cheatsheet: [
      { cmd: 'unzip -p -P K f.zip', desc: 'el interior al stdout' },
      { cmd: 'tar -xzOf -', desc: 'tar de stdin al stdout' },
    ],
    keywords: ['boss', 'zip', 'tar', 'clave'],
  }),
  mk('boss', 13, {
    title: 'Caza mayor VII — el log del traidor',
    subtitle: 'exclusiones + strings + rot13',
    xp: 90, difficulty: 5,
    brief: 'traidor.log mezcla líneas de señuelo, líneas de test y UNA línea legible con texto rotado (rot13) que esconde la marca.',
    goal: 'Filtra /home/agent/traidor.log quitando las líneas con señuelo o test, extrae su texto con rot13 y pescá la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Boss"
printf 'la confesion del traidor: %s\n' "$DOJO_FLAG" | tr 'A-Za-z' 'N-ZA-Mn-za-m' > /tmp/traidor13.txt
{
  echo "señuelo: FLAG{aaaaaaaaaaaaaaaaaaaaaaaa} ruido de distracción"
  echo "test: FLAG{bbbbbbbbbbbbbbbbbbbbbbbb} resultado de test"
  cat /tmp/traidor13.txt
  echo "señuelo final: basura sin marca"
} > /home/agent/traidor.log
rm -f /tmp/traidor13.txt
chown agent:agent /home/agent/traidor.log
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -viE 'señuelo|test' /home/agent/traidor.log | tr 'A-Za-z' 'N-ZA-Mn-za-m' | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      "Primero grep -viE 'señuelo|test' para excluir las trampas por nombre.",
      'La línea restante está rotada +13: tr A-Za-z N-ZA-Mn-za-m la deshace (es simétrica).',
      "grep -vE 'señuelo|test' traidor.log | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
    ],
    teach: '"rot13 el log" es el truco de ofuscación núm 1 de logs mal protegidos: simétrico, sin clave, sin software. Tu contramedida es generar texto limpio + auditoría por anomalías de frecuencias.',
    cheatsheet: [
      { cmd: "tr 'A-Za-z' 'N-ZA-Mn-za-m'", desc: 'rot13 ida y vuelta' },
      { cmd: "grep -viE 'a|b' f", desc: 'excluir por case-insensitive' },
    ],
    keywords: ['boss', 'rot13', 'log', 'excluir'],
  }),
  mk('boss', 14, {
    title: 'Caza mayor VIII — nido de comprimidos',
    subtitle: 'file → zcat → tar flujo al stdout',
    xp: 100, difficulty: 5,
    brief: 'En /home/agent/nido hay tres ficheros SIN extensión; SOLO uno es un tar.gz (los otros son gzip planos y texto). En el tar.gz vive la marca.',
    goal: 'Identifica el único tar.gz de /home/agent/nido con file y extrae su contenido al vuelo (tar -xzOf) hasta la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Boss"
mkdir -p /home/agent/nido /tmp/nido14
printf 'habita texto: nada por aquí\n' > /home/agent/nido/uno
printf 'gz sin marca: filler del depósito\n' | gzip -c > /home/agent/nido/dos
printf 'gz tambien falseo: nada\n' | gzip -c > /home/agent/nido/cinco
printf 'la joya del nido: %s\n' "$DOJO_FLAG" > /tmp/nido14/tmpf
tar -czf /home/agent/nido/tres -C /tmp/nido14 tmpf
rm -rf /tmp/nido14
chown -R agent:agent /home/agent`,
    solution: String.raw`f=$(file /home/agent/nido/* | grep 'tar archive' | cut -d: -f1); tar -xzOf "$f" | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      "file /home/agent/nido/* dice la verdad de cada fichero: solo uno sale como 'tar archive'.",
      'cut -d: -f1 isola el nombre; tar -xzOf FICHERO imprime su contenu al stdout.',
      "f=$(file /home/agent/nido/* | grep 'tar archive' | cut -d: -f1); tar -xzOf \"$f\"",
    ],
    teach: 'file + tar -O es el par mágico forense: identificar el recipiente y verterlo sin intermediar disco. Cuando hay recipiente dentro de recipiente, SEGUIR la file cadenas de comprimido hasta el resultado.',
    cheatsheet: [
      { cmd: 'file * | grep tst', desc: 'identifica entre nombres mudos' },
      { cmd: 'tar -xzOf f.tgz', desc: 'contents al stdout' },
    ],
    keywords: ['boss', 'tar', 'file', 'nido'],
  }),
];

export default [...boss];
