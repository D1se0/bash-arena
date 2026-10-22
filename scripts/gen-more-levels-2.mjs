/**
 * gen-more-levels-2 — segunda mitad de la expansión:
 *   redes l5..l12 (8) · archivos l6..l12 (7) · scripting l6..l12 (7)
 *   forense l6..l12 (7) · boss l5..l10 (6)   → 35 niveles nuevos
 * Misma disciplina que gen-more-levels: idempotente, texto correcto.
 * Uso:  node scripts/gen-more-levels-2.mjs [track]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));

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

/* ═════════════════════ REDES (l5..l12) ═════════════════════ */
const redes = [
  mk('redes', 5, {
    title: 'Primer saludo HTTP',
    subtitle: 'curl contra un servidor local',
    xp: 35, difficulty: 2,
    brief: 'La máquina no tiene salida a internet, pero un servidor web corre en el puerto 8000 (solo local). Su página de bandera lleva la clave.',
    goal: 'Descarga con curl la página http://127.0.0.1:8000/flag.html y muéstrala.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 05" "Redes"
mkdir -p /etc/arena
mkdir -p /var/www/flag
echo "<html><body><h1>Area clasificada</h1><p>clave de acceso: $DOJO_FLAG</p></body></html>" > /var/www/flag/flag.html
nohup python3 -m http.server 8000 --directory /var/www/flag >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s http://127.0.0.1:8000/flag.html`,
    hints: [
      'El servidor solo atiende en localhost: la máquina no tiene internet, no busques fuera.',
      'curl -s descarga sin barra de progreso.',
      'curl -s http://127.0.0.1:8000/flag.html',
    ],
    teach: 'curl es el cuchillo suizo de HTTP. En contenedores de práctica sin red externa, 127.0.0.1 (loopback) sigue siendo el terreno de juego: ideal para simular servicios internos.',
    cheatsheet: [
      { cmd: 'curl -s URL', desc: 'GET silencioso' },
      { cmd: 'curl -i URL', desc: 'incluye cabeceras' },
    ],
    keywords: ['curl', 'http', 'localhost'],
  }),
  mk('redes', 6, {
    title: 'Tres puertos, un secreto',
    subtitle: 'recorrer puertos con curl',
    xp: 40, difficulty: 3,
    brief: 'Hay tres servicios asomados en los puertos 9000, 9001 y 9002. Solo uno devuelve la clave; el resto da señuelos.',
    goal: 'Consulta los tres puertos y muestra la respuesta que contiene la clave.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Redes"
mkdir -p /etc/arena
mkdir -p /var/www/p9000 /var/www/p9001 /var/www/p9002
echo "<html>señuelo prudente del puerto 9000</html>" > /var/www/p9000/index.html
echo "<html>respuesta de sobra: $DOJO_FLAG</html>" > /var/www/p9001/index.html
echo "<html>otro señuelo del puerto 9002</html>" > /var/www/p9002/index.html
nohup python3 -m http.server 9000 --directory /var/www/p9000 >/dev/null 2>&1 &
nohup python3 -m http.server 9001 --directory /var/www/p9001 >/dev/null 2>&1 &
nohup python3 -m http.server 9002 --directory /var/www/p9002 >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`for p in 9000 9001 9002; do curl -s http://127.0.0.1:$p/; echo; done`,
    hints: [
      'ss -tln te enseña qué puertos están a la escucha (y confirma los tres).',
      'Un bucle for sobre los puertos nos ahorra tres comandos iguales.',
      'for p in 9000 9001 9002; do curl -s http://127.0.0.1:$p/; echo; done',
    ],
    teach: 'ss -tln lista sockets TCP a la escucha: la foto del lado servidor. Cuando hay varios puertos, un bucle for con curl barre la fábrica sin repetir código.',
    cheatsheet: [
      { cmd: 'ss -tln', desc: 'puertos a la escucha' },
      { cmd: 'curl -s http://127.0.0.1:PORT/', desc: 'consulta un puerto' },
    ],
    keywords: ['ss', 'puertos', 'curl', 'for'],
  }),
  mk('redes', 7, {
    title: 'Nombre que no existe',
    subtitle: '/etc/hosts como DNS local',
    xp: 45, difficulty: 3,
    brief: 'El dominio tesoro.interno no existe en ninguna DNS: el administrador lo ruteó a localhost en /etc/hosts. El servidor ya escucha en el 80.',
    goal: 'Muestra la entrada de /etc/hosts de tesoro.interno y descarga http://tesoro.interno/',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Redes"
mkdir -p /etc/arena
echo "127.0.0.1 tesoro.interno" >> /etc/hosts
mkdir -p /var/www/tesoro
echo "bandera del dominio interno: $DOJO_FLAG" > /var/www/tesoro/index.html
nohup python3 -m http.server 80 --directory /var/www/tesoro >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`grep tesoro.interno /etc/hosts; curl -s http://tesoro.interno/`,
    hints: [
      'grep tesoro.interno /etc/hosts te enseña a qué IP responde el nombre.',
      'curl acepta el nombre de dominio igual que una IP (usa la resolución del sistema).',
      'curl -s http://tesoro.interno/',
    ],
    teach: '/etc/hosts es la resolución local que se consulta ANTES que la DNS: la técnica clásica para entornos de laboratorio (y para secuestrar dominios, ojo).',
    cheatsheet: [
      { cmd: 'cat /etc/hosts', desc: 'mapeo local de nombres' },
      { cmd: 'curl -s http://nombre/', desc: 'consulta por nombre' },
    ],
    keywords: ['hosts', 'dns', 'curl'],
  }),
  mk('redes', 8, {
    title: 'Conversación de un solo sentido',
    subtitle: 'nc: hablar con un servicio TCP',
    xp: 45, difficulty: 3,
    brief: 'Un oráculo escucha en el TCP 9999: al conectarte, te susurra la clave y cierra.',
    goal: 'Conéctate al servicio del puerto 9999 con netcat y recoge la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Redes"
mkdir -p /etc/arena
cat > /etc/arena/oraculo.py <<FIN
import socket
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("127.0.0.1", 9999))
s.listen(5)
FLAG = "__BANDERA__"
while True:
    c, a = s.accept()
    try:
        c.sendall((FLAG + "\n").encode())
    finally:
        c.close()
FIN
sed -i "s/__BANDERA__/$DOJO_FLAG/" /etc/arena/oraculo.py
nohup python3 /etc/arena/oraculo.py >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`nc -w 2 127.0.0.1 9999 </dev/null`,
    hints: [
      'netcat es el cliente TCP mínimo: nc HOST PUERTO.',
      'Sin stdin abierto nc esperaría prohibido el cierre: redirige /dev/null',
      'nc -w 2 127.0.0.1 9999 </dev/null',
    ],
    teach: 'nc habla TCP crudo: ni HTTP ni protocolos, bytes. Es la herramienta para sondear servicios a mano (banners SMTP, SSH…) y suele despejar dudas en la fase de reconocimiento.',
    cheatsheet: [
      { cmd: 'nc HOST PUERTO', desc: 'conexión TCP simple' },
      { cmd: 'nc -w 5 HOST PUERTO', desc: 'con timeout de 5 s' },
    ],
    keywords: ['nc', 'netcat', 'tcp', 'socket'],
  }),
  mk('redes', 9, {
    title: 'La cabecera reveladora',
    subtitle: 'curl -i: ver también los headers',
    xp: 40, difficulty: 3,
    brief: 'El auditor añadió una cabecera HTTP personalizada con la clave; el cuerpo de la respuesta esta limpio.',
    goal: 'Descarga http://127.0.0.1:7080/auditoria mostrando TAMBIÉN las cabeceras y localiza la cabecera X-Arena-Flag.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Redes"
mkdir -p /etc/arena
cat > /etc/arena/auditServer.py <<FIN
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("X-Arena-Flag", "__BANDERA__")
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"auditoria ejecutada: todo limpio\n")
    def log_message(self, *a):
        pass
HTTPServer(("127.0.0.1", 7080), H).serve_forever()
FIN
sed -i "s/__BANDERA__/$DOJO_FLAG/" /etc/arena/auditServer.py
nohup python3 /etc/arena/auditServer.py >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s -i http://127.0.0.1:7080/auditoria`,
    hints: [
      'La cabecera NO aparece en el cuerpo: hay que ver la respuesta cruda.',
      'curl -i (o -I) imprime también los headers.',
      'curl -s -i http://127.0.0.1:7080/auditoria',
    ],
    teach: 'Los headers HTTP son metadata donde se esconde casi todo (rate-limits, versiones, tokens de sesión): curl -i los destapa junto al cuerpo. Curl -I solo los cabecera.',
    cheatsheet: [
      { cmd: 'curl -i URL', desc: 'cuerpo + cabeceras' },
      { cmd: 'curl -s -D - URL', desc: 'cabeceras a disco/stdout' },
    ],
    keywords: ['curl', 'headers', 'cabecera'],
  }),
  mk('redes', 10, {
    title: 'El guardián del POST',
    subtitle: 'curl -d: enviar datos',
    xp: 50, difficulty: 3,
    brief: 'Un endpoint del API pide autenticación por POST con el parámetro token=arena (sin documentar). El GET se queda con las ganas.',
    goal: 'Envía un POST con token=arena a http://127.0.0.1:6060/validar y muestra la respuesta con la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Redes"
mkdir -p /etc/arena
cat > /etc/arena/validador.py <<FIN
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(403)
        self.end_headers()
        self.wfile.write(b"solo se atiende por POST\n")
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode()
        data = parse_qs(body)
        if data.get("token", [""])[0] == "arena":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(("acceso concedido: " + "__BANDERA__" + "\n").encode())
        else:
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"token incorrecto\n")
    def log_message(self, *a):
        pass
HTTPServer(("127.0.0.1", 6060), H).serve_forever()
FIN
sed -i "s/__BANDERA__/$DOJO_FLAG/" /etc/arena/validador.py
nohup python3 /etc/arena/validador.py >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s -d 'token=arena' http://127.0.0.1:6060/validar`,
    hints: [
      'El método GET te responde 403: el endpoint quiere POST.',
      'curl -d "campo=valor" hace un POST automáticamente.',
      "curl -s -d 'token=arena' http://127.0.0.1:6060/validar",
    ],
    teach: 'curl -d (o --data) cambia el verbo HTTP a POST y manda el cuerpo form-enconded. Es la moneda para hablar con APIs internas sin cliente gráfico.',
    cheatsheet: [
      { cmd: 'curl -d k=v URL', desc: 'POST con form-data' },
      { cmd: 'curl -X POST URL', desc: 'forza el verbo' },
    ],
    keywords: ['curl', 'POST', 'endpoints'],
  }),
  mk('redes', 11, {
    title: 'Puerto en /etc/services',
    subtitle: 'el fichero del mapa de servicios',
    xp: 50, difficulty: 4,
    brief: 'El administrador registró un servicio con nombre arena-tesoro y un puerto asomado; el mapa está en /etc/services.',
    goal: 'Saca el puerto del servicio arena-tesoro desde /etc/services y consulta curl http://127.0.0.1:PUERTO/',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Redes"
mkdir -p /etc/arena
mkdir -p /var/www/tesoro77
echo "puerto dinamico: $DOJO_FLAG" > /var/www/tesoro77/index.html
echo "arena-tesoro 7777/tcp # servicio interno del dojo" >> /etc/services
nohup python3 -m http.server 7777 --directory /var/www/tesoro77 >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep '^arena-tesoro' /etc/services | awk '{print $2}' | cut -d/ -f1); curl -s http://127.0.0.1:$p/`,
    hints: [
      '/etc/services mapea nombre de servicio → puerto/protocolo.',
      'grep la línea y aísla la columna del puerto con awk.',
      'p=$(grep "^arena-tesoro" /etc/services | awk "{print $2}" | cut -d/ -f1); curl -s http://127.0.0.1:$p/',
    ],
    teach: '/etc/services es el mapa clásico de puertos (80 http, 22 ssh…). Leerlo evita los memorizar: el catálogo vive en el fichero donde empieza toda la revisión de un servidor.',
    cheatsheet: [
      { cmd: 'grep ssh /etc/services', desc: 'puerto de un servicio' },
      { cmd: 'ss -tlnp', desc: 'qué está escuchando' },
    ],
    keywords: ['etc/services', 'puertos', 'awk'],
  }),
  mk('redes', 12, {
    title: 'Auditoría de escucha',
    subtitle: 'ss + json + curl a medida',
    xp: 55, difficulty: 4,
    brief: 'Un API en 7700 solo responde con la cabecera correcta: Accept: application/arena-json. Ojo también al puerto, que puede caminar.',
    goal: 'Consulta http://127.0.0.1:7700/api con la cabecera Accept: application/arena-json y muéstrala (el puerto correcto lo delata ss).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Redes"
mkdir -p /etc/arena
cat > /etc/arena/api7.py <<FIN
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.headers.get("Accept", "") == "application/arena-json":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(("secreto del api: " + "__BANDERA__" + "\n").encode())
        else:
            self.send_response(406)
            self.end_headers()
            self.wfile.write(b"accept header no aceptable\n")
    def log_message(self, *a):
        pass
HTTPServer(("127.0.0.1", 7700), H).serve_forever()
FIN
sed -i "s/__BANDERA__/$DOJO_FLAG/" /etc/arena/api7.py
nohup python3 /etc/arena/api7.py >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s -H 'Accept: application/arena-json' http://127.0.0.1:7700/api`,
    hints: [
      'ss -tln te confirma que el puerto escucha.',
      'La cabecera se manda con curl -H "Accept: application/arena-json" (el GET 406 se arregla exactamente así).',
      "curl -s -H 'Accept: application/arena-json' http://127.0.0.1:7700/api",
    ],
    teach: 'Las cabeceras de PETICIÓN son la mitad de la conversación HTTP: Accept, Authorization, Content-Type… curl -H las teclea por ti. Los errores 406 normalmente delatan una cabecera ausente.',
    cheatsheet: [
      { cmd: 'curl -H "X: y" URL', desc: 'mandar cabecera a medida' },
      { cmd: 'ss -tlnp', desc: 'mapa de escucha' },
    ],
    keywords: ['ss', 'curl -H', 'accept', 'api'],
  }),
];

/* ═════════════════════ ARCHIVOS (l6..l12) ═════════════════════ */
const archivos = [
  mk('archivos', 6, {
    title: 'Reunion del compresor',
    subtitle: 'gzip/zcat: descomprimir en el pipe',
    xp: 35, difficulty: 1,
    brief: 'comprimido.gz contiene una nota importante en texto plano, comprimida. Solo falta leerla sin archivo intermedio.',
    goal: 'Descomprime /home/agent/comprimido.gz en el flujo (sin borrar el fichero) y muestra su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Archivos"
mkdir -p /etc/arena
echo "nota comprimida: $DOJO_FLAG" | gzip > /home/agent/comprimido.gz
echo "decoy suelto sin relevancia" > /home/agent/decoy.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`zcat /home/agent/comprimido.gz`,
    hints: [
      'gzip -d reemplazaría el fichero: no es lo que se pide.',
      'zcat (o gzip -dc) descomprime AL PIPE sin tocar el fichero.',
      'zcat comprimido.gz',
    ],
    teach: 'zcat/gzip -dc descomprime a stdout manteniendo el original: el flujo se puede encadenar directamente con grafiteo o filtrado. Sustituye descentralizar pistas sin ensuciar el disco.',
    cheatsheet: [
      { cmd: 'zcat f.gz', desc: 'descomprime a stdout' },
      { cmd: 'gzip -d f.gz', desc: 'descomprime en sitio' },
    ],
    keywords: ['gzip', 'zcat', 'compresión'],
  }),
  mk('archivos', 7, {
    title: 'El paquete tar',
    subtitle: 'tar -xzf: unpack en una cartella distinta',
    xp: 40, difficulty: 2,
    brief: 'paquete.tar.gz trae un árbol de ficheros con la marca en el fondo. La firma ya empacó y se fue.',
    goal: 'Extrae /home/agent/paquete.tar.gz en /tmp y muestra las líneas de la clave que quedan dentro.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Archivos"
mkdir -p /etc/arena
mkdir -p /tmp/lvl-N7/raiz/carpeta-interna
echo "cabra sin abre" > /tmp/lvl-N7/raiz/leeme.txt
echo "nota profunda: $DOJO_FLAG" > /tmp/lvl-N7/raiz/carpeta-interna/llave.txt
tar -czf /home/agent/paquete.tar.gz -C /tmp/lvl-N7 raiz
rm -rf /tmp/lvl-N7
chown agent:agent /home/agent/paquete.tar.gz`,
    solution: String.raw`tar -xzf /home/agent/paquete.tar.gz -C /tmp && grep -r 'FLAG{' /tmp`,
    hints: [
      'Las opciones tar: x = extraer, z = gzip, f = fichero.',
      '-C DIR decide el DESTINO de la extracción (el origen se pasa separadamente).',
      'tar -xzf paquete.tar.gz -C /tmp && grep -r FLAG /tmp',
    ],
    teach: 'tar es el archivador por excelencia de UNIX. Siempre: -x extragir(C)/-c crear, -z/--gzip y -f fichero. La extracción con -C evita la dispersión de ficheros en el cwd.',
    cheatsheet: [
      { cmd: 'tar -tzf f.tar.gz', desc: '¿qué hay dentro?' },
      { cmd: 'tar -xzf f.tar.gz -C destino', desc: 'extrae en destino' },
    ],
    keywords: ['tar', 'compresión', 'extracción'],
  }),
  mk('archivos', 8, {
    title: 'El zip del corredor',
    subtitle: 'unzip -p: mostrar ficheros del zip',
    xp: 35, difficulty: 2,
    brief: 'paquete.zip firma el paso final del corredor; dentro trae una nota.txt que interesa al equipo.',
    goal: 'Muestra el contenido de nota.txt DENTRO de /home/agent/paquete.zip sin extraerlo al disco.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Archivos"
mkdir -p /etc/arena
mkdir -p /tmp/lvl-N8
cd /tmp/lvl-N8
echo "decoy del zip" > decoy.txt
echo "nota del corredor: $DOJO_FLAG" > nota.txt
zip -q paquete2.zip nota.txt decoy.txt
mv paquete2.zip /home/agent/paquete.zip
cd /
rm -rf /tmp/lvl-N8
chown agent:agent /home/agent/paquete.zip`,
    solution: String.raw`unzip -p /home/agent/paquete.zip nota.txt`,
    hints: [
      'unzip sin opciones extraería todo en el cwd: no es lo que se pide.',
      'unzip -p FICHERO miembro escribe ese miembro en stdout.',
      'unzip -p paquete.zip nota.txt',
    ],
    teach: 'unzip -p desplaza contenido al stdout sin escribir ficheros: el zcat del mundo zip. Lista con -l antes para saber qué hay dentro del paquete.',
    cheatsheet: [
      { cmd: 'unzip -l f.zip', desc: 'lista de contenido' },
      { cmd: 'unzip -p f.zip miembro', desc: 'muestra un miembro' },
    ],
    keywords: ['zip', 'unzip', 'compresión'],
  }),
  mk('archivos', 9, {
    title: 'Diferencias validadas',
    subtitle: 'diff: comparar dos versiones',
    xp: 40, difficulty: 2,
    brief: 'nuevo.txt es la revisión del viejo.txt; además de corregir la broma que venía arrastrando, la revisión incluye una línea marcada.',
    goal: 'Muestra las DIFERENCIAS entre /home/agent/viejo.txt y /home/agent/nuevo.txt y extrae de allí la clase con la marca (empieza con >).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Archivos"
mkdir -p /etc/arena
printf 'linea uno\nlinea dos con typo\nlinea tres\n' > /home/agent/viejo.txt
printf 'linea uno\nlinea dos corregida\nlinea tres\nlinea nueva tabulada: $DOJO_FLAG\n' > /home/agent/nuevo.txt
chown agent:agent /home/agent/viejo.txt /home/agent/nuevo.txt`,
    solution: String.raw`diff /home/agent/viejo.txt /home/agent/nuevo.txt`,
    hints: [
      'diff A B lista las diferencias con prefijos < y >.',
      'Las líneas que SOLO están en el segundo fichero van con >.',
      'diff viejo.txt nuevo.txt',
    ],
    teach: 'diff es la base de wits parecidas a `patch`. Recuerda < = fichero A, > = fichero B. La salida está a la orden de wc, sort y filtered: el beam de comparaciones.',
    cheatsheet: [
      { cmd: 'diff a b', desc: 'compara línea a línea' },
      { cmd: 'diff -u a b', desc: 'formato unificado (git-ish)' },
    ],
    keywords: ['diff', 'comparar', 'versiones'],
  }),
  mk('archivos', 10, {
    title: 'La cadena de enlaces',
    subtitle: 'readlink -f: llegar al real',
    xp: 40, difficulty: 2,
    brief: 'acceso es un enlace simbólico que conduce (a través de otro enlace) al fichero real con la clave. Los decoys pululan.',
    goal: 'Resuelve la cadena de enlaces de /home/agent/acceso (real f) y muestra el fichero REAL.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Archivos"
mkdir -p /etc/arena
mkdir -p /home/agent/caja/real /home/agent/caja/decoy
echo "decoy primera" > /home/agent/caja/decoy/a.txt
echo "desvio 1" > /home/agent/caja/decoy/llave-b.txt
echo "el auténtico: $DOJO_FLAG" > /home/agent/caja/real/llave.txt
ln -s /home/agent/caja/decoy/a.txt /home/agent/acceso-trampa
ln -s /home/agent/caja/decoy/llave-b.txt /home/agent/acceso-directo
ln -s /home/agent/caja/real/llave.txt /home/agent/acceso
chown -R agent:agent /home/agent`,
    solution: String.raw`cat "$(readlink -f /home/agent/acceso)"`,
    hints: [
      'ls -l muestra las flechas -> de cada enlace.',
      'readlink -f RUTA resuelve TODA la cadena hasta el fichero real.',
      'cat $(readlink -f acceso)',
    ],
    teach: 'Un enlace simbólico es un puntero textual que se resuelve al abrir. readlink -f desmonta la cadena entera: útil para scripts (no te fies del nombre del fichero que recibes).',
    cheatsheet: [
      { cmd: 'readlink -f ruta', desc: 'ruta real del enlace' },
      { cmd: 'ln -s objetivo nombre', desc: 'crea enlace simbólico' },
    ],
    keywords: ['enlaces', 'symlink', 'readlink'],
  }),
  mk('archivos', 11, {
    title: 'Compresión moderna',
    subtitle: 'xz: descomprimir con -d -c',
    xp: 40, difficulty: 3,
    brief: 'volcado.xz es un fichero comprimido con el algoritmo moderno de alto ratio. Su contenido lleva la marca.',
    goal: 'Descomprime /home/agent/volcado.xz en el flujo y muestra su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Archivos"
mkdir -p /etc/arena
echo "papel volcado con marca: $DOJO_FLAG" | xz > /home/agent/volcado.xz
chown agent:agent /home/agent/volcado.xz`,
    solution: String.raw`xz -dc /home/agent/volcado.xz`,
    hints: [
      'xz comprime con mucho mejor ratio que gzip: una opción -d descomprime.',
      'Para NO perder el original, -c escribe la salida en stdout.',
      'xz -dc volcado.xz',
    ],
    teach: 'xz supera a gzip en ratio al precio de más CPU. La trilogía -x/-d/-c funciona igual en gzip, bzip2 y xz: una sola sintaxis para tres compresores.',
    cheatsheet: [
      { cmd: 'xz -dc f.xz', desc: 'descomprime a stdout' },
      { cmd: 'xz -l f.xz', desc: 'muestra estadísticas' },
    ],
    keywords: ['xz', 'compresión', 'fluxo'],
  }),
  mk('archivos', 12, {
    title: 'El paquete de 7',
    subtitle: '7z: el multi-formato',
    xp: 45, difficulty: 3,
    brief: 'paquete.7z viene del equipo de backup con gran compresión. Dentro hay una nota.txt que trae la marca',
    goal: 'Extrae /home/agent/paquete.7z en /tmp/7z-salida y muestra nota.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Archivos"
mkdir -p /etc/arena
mkdir -p /tmp/lvl-N12
cd /tmp/lvl-N12
echo "decoy de cama" > decoy.txt
echo "marca empacada: $DOJO_FLAG" > nota.txt
7z a -t7z paquete7.7z nota.txt decoy.txt >/dev/null
mv paquete7.7z /home/agent/paquete.7z
cd /
rm -rf /tmp/lvl-N12
chown agent:agent /home/agent/paquete.7z`,
    solution: String.raw`7z x -y -o/tmp/7z-salida /home/agent/paquete.7z >/dev/null && cat /tmp/7z-salida/nota.txt`,
    hints: [
      '7z a comprime; 7z x extrae.',
      'La carpeta destino se define con -oRUTA (sin espacio tras -o) (y evita el ok con -y).',
      '7z x -y -o/tmp/7z-salida paquete.7z',
    ],
    teach: '7z acepta docenas de formatos (tar, zip, gz, iso…) con el mismo interfazo: a/extracto, -o destino, -l listar. Para archivos raros, 7z casi siempre tiene la respuesta.',
    cheatsheet: [
      { cmd: '7z l f.7z', desc: 'lista el paquete' },
      { cmd: '7z x -oDIR f.7z', desc: 'extrae en DIR' },
    ],
    keywords: ['7z', 'p7zip', 'compresión'],
  }),
];

/* ═════════════════════ SCRIPTING (l6..l12) ═════════════════════ */
const scripting = [
  mk('scripting', 6, {
    title: 'Conf en el entorno',
    subtitle: 'source: cargar un fichero de variables',
    xp: 35, difficulty: 2,
    brief: 'config.env define la ruta del depósito con una variable. Las variables del shell NO están cargadas por defecto.',
    goal: 'Carga /home/agent/config.env en el shell y con la variable que define úsala para mostrar /home/agent/buzon/<DEPOSITO>/clave.txt',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Scripting"
mkdir -p /etc/arena
mkdir -p /home/agent/buzon/lateral-3 /home/agent/buzon/lateral-4
echo "decoy del buzon 4" > /home/agent/buzon/lateral-4/clave.txt
echo "buzón confirmado: $DOJO_FLAG" > /home/agent/buzon/lateral-3/clave.txt
printf "DEPOSITO=lateral-3\nZONA=agreste\n" > /home/agent/config.env
chown -R agent:agent /home/agent`,
    solution: String.raw`. /home/agent/config.env && cat /home/agent/buzon/$DEPOSITO/clave.txt`,
    hints: [
      'El fichero config.env tiene líneas variable=valor.',
      'source (o .) ejecuta un fichero EN el shell actual: las variables quedan cargadas.',
      '. config.env && cat buzon/$DEPOSITO/clave.txt',
    ],
    teach: 'source (o el punto) ejecuta un script SIN crear subshell: las variables que define quedan en TU shell. Es el mecanismo con el que TODO el mundo carga configuraciones (.bashrc incluido).',
    cheatsheet: [
      { cmd: '. fichero.env', desc: 'carga variables en el shell' },
      { cmd: 'env | sort', desc: 'lista el entorno actual' },
    ],
    keywords: ['source', 'variables', 'env'],
  }),
  mk('scripting', 7, {
    title: 'La edad y la puerta',
    subtitle: 'if/condiciones numericas',
    xp: 35, difficulty: 2,
    brief: 'El sistema decide con la edad del fichero edad.txt qué fichero entregar: adulto o menor.',
    goal: 'Con tee logic: si edad.txt >= 18, muestra adulto/clave.txt; si no, muestra menor/broma.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Scripting"
mkdir -p /etc/arena
echo "21" > /home/agent/edad.txt
mkdir -p /home/agent/adulto /home/agent/menor
echo "broma del menor: dulzura gratis" > /home/agent/menor/broma.txt
echo "puerta del adulto: $DOJO_FLAG" > /home/agent/adulto/clave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`if [ "$(cat /home/agent/edad.txt)" -ge 18 ]; then cat /home/agent/adulto/clave.txt; else cat /home/agent/menor/broma.txt; fi`,
    hints: [
      'La condición numérica en bash usa test: [ valor -ge 18 ].',
      'Sacar el valor del fichero con $(cat edad.txt) evita que quede con salto de línea.',
      'if [ "$(cat edad.txt)" -ge 18 ]; then cat adulto/clave.txt; fi',
    ],
    teach: 'El test [ ] compara: -eq, -ne, -gt, -ge, -lt, -le para números; = para cadenas. Si el if no entra, else (o elif) dan la alternativa.',
    cheatsheet: [
      { cmd: '[ x -ge 18 ] && a || b', desc: 'if corto en una línea' },
      { cmd: 'if [ cond ]; then ... fi', desc: 'estructura clásica' },
    ],
    keywords: ['if', 'test', 'condicional'],
  }),
  mk('scripting', 8, {
    title: 'El menú por parámetros',
    subtitle: 'posicionales $1 $2 y case',
    xp: 40, difficulty: 3,
    brief: 'menu.sh acepta un ACCION y una CLAVE: hay que invocarlo correctamente para que lea el fichero que interesa.',
    goal: 'Invoca /home/agent/menu.sh (con bash) con acción "mostrar" y clave "centro-2" para leer la ficha correcta.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Scripting"
mkdir -p /etc/arena
mkdir -p /home/agent/menus
echo "decoy del lado 1" > /home/agent/menus/izquierda-1.txt
echo "ficha correcta: $DOJO_FLAG" > /home/agent/menus/centro-2.txt
echo "decoy del lado 3" > /home/agent/menus/derecha-3.txt
cat > /home/agent/menu.sh <<FIN
#!/bin/bash
case $1 in
  mostrar) cat "/home/agent/menus/$2.txt"; ;;
  lista) ls /home/agent/menus; ;;
  *) echo "accion desconocida"; ;;
esac
FIN
chmod 755 /home/agent/menu.sh
chown -R agent:agent /home/agent`,
    solution: String.raw`bash /home/agent/menu.sh mostrar centro-2`,
    hints: [
      'Dentro del script, $1 y $2 son el primer y segundo parámetro que le pasas.',
      'El case $1 ejecuta la rama cuyo patrón case la acción.',
      'bash menu.sh mostrar centro-2',
    ],
    teach: '$0 $1 $2… son los argumentos posicionales de un script (como argv de C). case sobre $1 es el switch de bash: la forma idiomática de depender del parámetro a ser.',
    cheatsheet: [
      { cmd: './script a b', desc: 'invoca con parámetros' },
      { cmd: 'case $1 in a) ...;; esac', desc: 'switch bash' },
    ],
    keywords: ['case', 'posicionales', '$1', 'script'],
  }),
  mk('scripting', 9, {
    title: 'Lee tu itinerario',
    subtitle: 'while read + campos al vuelo',
    xp: 45, difficulty: 3,
    brief: 'itinerario lista pares host puerto. Solo la fila localhost 4242 corresponde a un fichero real en rutas/.',
    goal: 'Recorre itinerario.txt línea a línea (while read) y cuando la fila sea localhost 4242, muestra /home/agent/rutas/4242.txt',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Scripting"
mkdir -p /etc/arena
printf 'gateway 3000\nlocalhost 4242\nforaneo 5000\n' > /home/agent/itinerario.txt
mkdir -p /home/agent/rutas
echo "ruta foranea inexistente" > /home/agent/rutas/5000.txt
echo "ruta local exacta: $DOJO_FLAG" > /home/agent/rutas/4242.txt
echo "ruta del gateway relleno" > /home/agent/rutas/3000.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`while read -r h p; do if [ "$h" = "localhost" ] && [ "$p" = "4242" ]; then cat /home/agent/rutas/4242.txt; fi; done < /home/agent/itinerario.txt`,
    hints: [
      'while read -r a b; do ...; done < fichero lee campo a campo.',
      'Es la forma idiomática de procesar líneas con campos: NO uses for sobre la salida de cat.',
      'while read -r h p; do echo "$h"; done < itinerario.txt',
    ],
    teach: 'while read parsea cada línea en variables: para procesar ficheros columna a columna es EL patrón. for sobre $() rompe en espacios y come los saltos: read es la vía fiel.',
    cheatsheet: [
      { cmd: 'while read -r a b; do …; done < f', desc: 'lee dos campos por línea' },
      { cmd: 'wc -l itinerario.txt', desc: 'verifica el recorrido' },
    ],
    keywords: ['while read', 'bucle', 'campos'],
  }),
  mk('scripting', 10, {
    title: 'Solo los ejecutables',
    subtitle: 'funciones + test -x',
    xp: 45, difficulty: 3,
    brief: 'En caja/ hay ficheros mixtos: la mayoría ni siquiera es ejecutable. El que sí, guarda la marca.',
    goal: 'Define una función (o usa test -x) para recorrer /home/agent/caja/* y imprimir SOLO los ficheros con permiso de ejecución.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Scripting"
mkdir -p /etc/arena
mkdir -p /home/agent/caja
echo "uno apagado" > /home/agent/caja/a.txt
chmod 644 /home/agent/caja/a.txt
echo "dos apagado" > /home/agent/caja/b.txt
chmod 644 /home/agent/caja/b.txt
echo "ejecutable: $DOJO_FLAG" > /home/agent/caja/dinamo.sh
chmod 755 /home/agent/caja/dinamo.sh
echo "tres apagado" > /home/agent/caja/c.txt
chmod 644 /home/agent/caja/c.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`for f in /home/agent/caja/*; do if [ -x "$f" ]; then cat "$f"; fi; done`,
    hints: [
      'test -x FICHERO responde ¿es ejecutable?',
      'Un bucle for sobre caja/* te recorre los ficheros de a uno.',
      'for f in caja/*; do [ -x "$f" ] && cat "$f"; done',
    ],
    teach: 'Las funciones en bash (nombre() { … }) reutilizan lógica en el mismo shell. El test -x/-r/-f/-d responde propiedades de ficheros: la combinación script = filtro perfectro para lotes.',
    cheatsheet: [
      { cmd: 'mi_fn() { …; }; mi_fn', desc: 'definir y llamar' },
      { cmd: '[ -x f ] && a', desc: 'if corto si ejecutable' },
    ],
    keywords: ['funciones', 'test -x', 'bucle'],
  }),
  mk('scripting', 11, {
    title: 'El script cojo',
    subtitle: 'sed -i: editar ficheros en sitio',
    xp: 50, difficulty: 4,
    brief: 'repara.sh debería ejecutar el echo de la flag, pero SU ecos línea perfilalı quedó comentada. Medicina: quitar el # avant de ejecutar.',
    goal: 'Descomenta la línea ejecutable de /home/agent/repara.sh (sed -i), ejecútalo y muestra lo que imprime.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Scripting"
mkdir -p /etc/arena
cat > /home/agent/repara.sh <<FIN
#!/bin/bash
echo "primero la calibración"
# echo "la marca del parche: $DOJO_FLAG"
echo "fin del fichero"
FIN
chmod 755 /home/agent/repara.sh
chown agent:agent /home/agent/repara.sh`,
    solution: String.raw`sed -i 's|^# ||' /home/agent/repara.sh && bash /home/agent/repara.sh`,
    hints: [
      'sed -i edita el fichero directamente (sin volcar a otro).',
      'El patrón ^# (comentario al inicio) seguido de espacio es lo que dejó la línea comentada.',
      "sed -i 's/^# //' repara.sh && bash repara.sh",
    ],
    teach: 'sed -i es la edición en el sitio (in-place) que usan los scripters para toques quirúrgicos. La / la puedes depender: s|a|b| con cualquier carácter evita fugas con la propia ele.',
    cheatsheet: [
      { cmd: "sed -i 's/a/b/' f", desc: 'sustituye y guarda' },
      { cmd: "sed -i 's|^#!|#!' f", desc: 'con delimitador alterno' },
    ],
    keywords: ['sed -i', 'in-place', 'descomentar'],
  }),
  mk('scripting', 12, {
    title: 'La caja según el estado',
    subtitle: 'case + fichero de estado',
    xp: 50, difficulty: 4,
    brief: 'estado.txt indica el MODO activo. caja.sh sabe contestar con la rama adecuada… si le pasas el modo correcto como argumento.',
    goal: 'Lee /home/agent/estado.txt e invoca /home/agent/caja.sh con ese modo. Caja.sh imprimirá la ficha del modo correcto (una de ellas lleva la marca).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Scripting"
mkdir -p /etc/arena
echo "modo-fantasma" > /home/agent/estado.txt
cat > /home/agent/caja.sh <<FIN
#!/bin/bash
case $1 in
  modo-fantasma) echo "ficha fantasma: $DOJO_FLAG"; ;;
  modo-normal) echo "ficha normal sin nada"; ;;
  modo-guardia) echo "ficha de guardia"; ;;
  *) echo "modo desconocido"; ;;
esac
FIN
chmod 755 /home/agent/caja.sh
chown -R agent:agent /home/agent`,
    solution: String.raw`bash /home/agent/caja.sh "$(cat /home/agent/estado.txt)"`,
    hints: [
      'Primero lee el estado: cat estado.txt.',
      'Luego invoca caja.sh con ese valor como $1.',
      'bash caja.sh "$(cat estado.txt)"',
    ],
    teach: 'Combinar $(…) dentro de los argumentos es la forma de pasarle a un script dinámicas reales: la salida de un comando (estado) alimenta el siguiente (caja). así viven los scripts de un administrador.',
    cheatsheet: [
      { cmd: 'script "$(cat f)"', desc: 'argumento leído de fichero' },
      { cmd: 'cat estado.txt', desc: 'primero mira el estado' },
    ],
    keywords: ['case', 'estado', 'sustitución'],
  }),
];

/* ═════════════════════ FORENSE (l6..l12) ═════════════════════ */
const forense = [
  mk('forense', 6, {
    title: 'Caza en el binario',
    subtitle: 'grep -a: buscar texto dentro de bytes',
    xp: 40, difficulty: 3,
    brief: 'blob.bin es un fichero binario (basura aleatoria). Entre los bytes, la cadena de la marca sobrevive.',
    goal: 'Extrae TODAS las ocurrencias de la marca (patrón FLAG{...}) dentro del binario /home/agent/blob.bin.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Forense"
mkdir -p /etc/arena
head -c 10000 /dev/urandom > /home/agent/blob.bin
printf 'coincidencia embebida: %s\n' "$DOJO_FLAG" >> /home/agent/blob.bin
head -c 8000 /dev/urandom >> /home/agent/blob.bin
chown agent:agent /home/agent/blob.bin`,
    solution: String.raw`grep -a -oE 'FLAG\{[^}]*\}' /home/agent/blob.bin`,
    hints: [
      'grep sin -a te dirá Binary file matches: -a proporciona el modo texto.',
      '-o imprime solo el trozo casado, muy útil en binarios.',
      "grep -a -oE 'FLAG\\{[^}]*\\}' blob.bin",
    ],
    teach: 'grep -a trata los ficheros binarios como texto (binary→text). La pareja -a -o es el kit forense para extraer cadenas sin instolar strings:',
    cheatsheet: [
      { cmd: "grep -a -oE 'x' f.bin", desc: 'extrae cadenas de un binario' },
      { cmd: 'xxd f | head', desc: 'mira los bytes crudos' },
    ],
    keywords: ['grep -a', 'binario', 'strings'],
  }),
  mk('forense', 7, {
    title: 'Mensaje blindado en b64',
    subtitle: 'base64 -d: decodificar',
    xp: 40, difficulty: 2,
    brief: 'adjunto.b64 es texto base64: un formato clásico de correo para eludir filtros. Decodifícalo en el flujo para recuperar el origen.',
    goal: 'Decodifica /home/agent/adjunto.b64 y muestra el mensaje original (que trae la marca).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Forense"
mkdir -p /etc/arena
echo "adjunto normal: $DOJO_FLAG" | base64 -w0 > /home/agent/adjunto.b64
echo >> /home/agent/adjunto.b64
chown agent:agent /home/agent/adjunto.b64`,
    solution: String.raw`base64 -d /home/agent/adjunto.b64`,
    hints: [
      'base64 -d decodifica en el flujo (stdout).',
      'También puedes cat fichero | base64 -d si prefieres.',
      'base64 -d adjunto.b64',
    ],
    teach: 'base64 codifica a 64 caracteres binarios seguros; -d deshace. Appears en logs, adjuntos, tokens JWT (la parte media) y exfiltraciones: reconocerla es obligatorio en forense.',
    cheatsheet: [
      { cmd: 'base64 -d f', desc: 'decodifica' },
      { cmd: 'base64 -w0 f', desc: 'codifica en una línea' },
    ],
    keywords: ['base64', 'codificar', 'decodificar'],
  }),
  mk('forense', 8, {
    title: 'Volcado hexadecimal',
    subtitle: 'xxd -r: reconstruir del hex',
    xp: 45, difficulty: 3,
    brief: 'volcado.hex proviene de un volcado xxd del fichero original. Los bytes están ahí, solo hay que re-ensamblar.',
    goal: 'Reconstruye /home/agent/volcado.hex con xxd -r y muestra el texto original (que contiene la marca).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Forense"
mkdir -p /etc/arena
echo "volcado real de la sala: $DOJO_FLAG" > /tmp/reveal.txt
xxd /tmp/reveal.txt > /home/agent/volcado.hex
rm -f /tmp/reveal.txt
chown agent:agent /home/agent/volcado.hex`,
    solution: String.raw`xxd -r /home/agent/volcado.hex`,
    hints: [
      'xxd muestra bytes en hex; la opción -r hace la máscara inversa.',
      'La salida vuelve al stdout: puedes encadenerla con grep.',
      'xxd -r volcado.hex',
    ],
    teach: 'xxd -r revierte un volcado hex a bytes: la forensic reconstrucción de ficheros que ya no existen. Grabar claves hexa es exactamente lo mismo que las marcas hexa frecuentes en el foro.',
    cheatsheet: [
      { cmd: 'xxd -r f.hex', desc: 'hex → bytes' },
      { cmd: 'xxd f', desc: 'bytes → hex' },
    ],
    keywords: ['xxd', 'hex', 'reversa'],
  }),
  mk('forense', 9, {
    title: 'Cifrado por desplazamiento',
    subtitle: 'tr con abecedario rotado (césar +7)',
    xp: 50, difficulty: 3,
    brief: 'El mensaje de cifrado.txt está levantado con un desplazamiento CÉSAR de +7 en las letras (los dígitos y la puntuación intactos). Le recuperación es aplicar desplazamiento INVERSERTE.',
    goal: 'Recupera el texto original de /home/agent/cifrado.txt aplicando el desplazamiento inverso (las letras vuelven a su sitio).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Forense"
mkdir -p /etc/arena
printf 'mensagem cifrada con cesar: %s\n' "$DOJO_FLAG" | tr 'A-Za-z' 'hijklmnopqrstuvwxyzabcdefgHIJKLMNOPQRSTUVWXYZABCDEFG' > /home/agent/cifrado.txt
chown agent:agent /home/agent/cifrado.txt`,
    solution: String.raw`tr 'A-Za-z' 'tuvwxyzabcdefghijklmnopqrsTUVWXYZABCDEFGHIJKLMNOPQRS' < /home/agent/cifrado.txt`,
    hints: [
      'El cifrado avanzó las letras +7 posiciones: recupera restándole 7 (o sumando 19).',
      'tr set1 set2 mapea letra a letra: puedes definir TU propio abecedario destino.',
      "tr 'A-Za-z' 'tuvwxyz…' < cifrado.txt",
    ],
    teach: 'tr es el cifrado césar sencillo: defines el abecedario destino rotado. Para descifrar, aplica el desplazamiento COMPLEMENTARIO (para +7, es +19 sobre 26 letras).',
    cheatsheet: [
      { cmd: "tr 'a-z' 'n-za-m'", desc: 'rot13 (desplaza 13)' },
      { cmd: "tr 'A-Za-z' 'H-Za-g…' f", desc: 'cifra con desplazamiento +7' },
    ],
    keywords: ['tr', 'cifrado', 'césar', 'rotación'],
  }),
  mk('forense', 10, {
    title: 'El intruso en el log',
    subtitle: 'grep en sucesos.log',
    xp: 45, difficulty: 3,
    brief: 'un caso: en sucesos.log se registra un "intruso" con su clave entre colegas legales y ruido administrativo.',
    goal: 'Localiza en /home/agent/sucesos.log la línea del intruso y extrae de ella solo la FLAG que aparece.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Forense"
mkdir -p /etc/arena
cat > /home/agent/sucesos.log <<FIN
01:02:03 admin reviso el panel
01:05:11 rotacion de claves programada
02:11:33 login aceptado: usuario intruso clave= $DOJO_FLAG
02:12:01 escaneo de puertos desde la web
03:00:00 rotación de turnos
FIN
chown agent:agent /home/agent/sucesos.log`,
    solution: String.raw`grep -oE 'FLAG\{[^}]*\}' /home/agent/sucesos.log`,
    hints: [
      'Primero grep intruso sucesos.log para leer el contexto.',
      'Luego te queda SOLO la flag: grep -oE FLAG con la clase [^}]*',
      "grep intruso sucesos.log | grep -oE 'FLAG\\{[^}]*\\}'",
    ],
    teach: 'La revisión de logs con grep en dos fases: primero identifica al actor sospechoso, después extrae el trozo exacto con la clase [^}]*. Leer primero y extraer después reduce el ruido a cero.',
    cheatsheet: [
      { cmd: "grep 'actor' f | grep -oE 'x'", desc: 'actor + extraer' },
      { cmd: 'tail -n 20 sucesos.log', desc: 'últimos sucesos' },
    ],
    keywords: ['grep', 'log', 'intruso', 'sucesos'],
  }),
  mk('forense', 11, {
    title: 'Cola del exfiltrado',
    subtitle: 'tail -c: los últimos bytes de un binario',
    xp: 45, difficulty: 3,
    brief: 'cargo.bin es un binario de exportación (relleno a decenas de KB). La exfiltración anexó la marca justo al final del fichero.',
    goal: 'Muestra los últimos 90 bytes de /home/agent/cargo.bin para recoger la marca anexada.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 11" "Forense"
mkdir -p /etc/arena
head -c 150000 /dev/urandom > /home/agent/cargo.bin
printf '\nmarca exfiltrada: %s\n' "$DOJO_FLAG" >> /home/agent/cargo.bin
chown agent:agent /home/agent/cargo.bin`,
    solution: String.raw`tail -c 90 /home/agent/cargo.bin`,
    hints: [
      'tail -c N imprime los últimos N BYTES (no líneas).',
      'El relleno binario puede romper la pantalla: -c es la forma acotada de mirar.',
      'tail -c 90 cargo.bin',
    ],
    teach: 'El patrón «relleno + carga útil al final» es una técnica de steganografía trivial: los ficheros siguen siendo válidos pero la cola lleva secretos. tail -c es el bisturí.',
    cheatsheet: [
      { cmd: 'tail -c 100 f', desc: 'últimos 100 bytes' },
      { cmd: 'head -c 100 f', desc: 'primeros 100 bytes' },
    ],
    keywords: ['tail -c', 'bytes', 'exfiltración'],
  }),
  mk('forense', 12, {
    title: 'Señuelos y la marca pura',
    subtitle: 'regex que discrimina falsos vestigios',
    xp: 55, difficulty: 4,
    brief: 'rastro.txt está sembrado de FAKE {FLAG{decoy-XX}} para no permitir los filtros: la marca REAL es la única de 24 caracteres hexadecimales MAYUSCULASNO dentro.',
    goal: 'Extrae de /home/agent/rastro.txt únicamente la marca real (24 hex lowercase) descartando los señuelos.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 12" "Forense"
mkdir -p /etc/arena
i=1
while [ $i -le 14 ]; do echo "señuelo $i FLAG{decoy-$i}" >> /home/agent/rastro.txt; i=$((i+1)); done
echo "registro limpio: $DOJO_FLAG" >> /home/agent/rastro.txt
i=15
while [ $i -le 28 ]; do echo "señuelo $i FLAG{decoy-$i}" >> /home/agent/rastro.txt; i=$((i+1)); done
chown agent:agent /home/agent/rastro.txt`,
    solution: String.raw`grep -oE 'FLAG\{[0-9a-f]{24}\}' /home/agent/rastro.txt`,
    hints: [
      'Los señuelos llevan letras y guiones: la clase [0-9a-f] NO casa guiones.',
      'El cuantificador {24} exige EXACTAMENTE 24 caracteres.',
      "grep -oE 'FLAG\\{[0-9a-f]{24}\\}' rastro.txt",
    ],
    teach: 'Las regex con clases y cuantificadores EXACTOS ({24}, [0-9a-f]) son cómo se descarta la basura: el patrón codifica la estructura REAL de lo legítimo. Arma afilada contra los señuelos.',
    cheatsheet: [
      { cmd: "grep -oE 'p\\{24\\}' f", desc: 'cuantificador exacto' },
      { cmd: "grep -c 'decoy' f", desc: 'cuenta los señuelos' },
    ],
    keywords: ['regex', 'decoy', 'cuantificador'],
  }),
];

/* ═════════════════════ BOSS (l5..l10) ═════════════════════ */
const boss = [
  mk('boss', 5, {
    title: 'El rey del error',
    subtitle: 'grep -c + bucle + cat selectivo',
    xp: 80, difficulty: 4,
    brief: 'Cinco logs grandes en logs/. Solo el loberrimo tiene MÁS de 50 líneas ERROR; su cabecera lleva el avanzado trofeo.',
    goal: 'Encuenposition el .log de /home/agent/logs con más de 50 líneas ERROR y MUESTRA su contenido (los errores Y su cabecera con el trofeo).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 05" "Boss"
mkdir -p /etc/arena
mkdir -p /home/agent/logs
i=1
while [ $i -le 5 ]; do
  name=$i
  case $i in
    1) f=a; num=20; ;;
    2) f=b; num=35; ;;
    3) f=c; num=48; ;;
    4) f=d; num=60; ;;
    5) f=e; num=25; ;;
  esac
  log=/home/agent/logs/runner-$f.log
  echo "inicio del lote $name formato ESTANDAR" > "$log"
  if [ $num -eq 60 ]; then echo "trofeo del causante: $DOJO_FLAG" >> "$log"; fi
  j=1
  while [ $j -le $num ]; do echo "ERROR en componente $j" >> "$log"; j=$((j+1)); done
  i=$((i+1))
done
chown -R agent:agent /home/agent`,
    solution: String.raw`for f in /home/agent/logs/*.log; do if [ "$(grep -c ERROR "$f")" -gt 50 ]; then cat "$f"; fi; done`,
    hints: [
      'grep -c ERROR f cuenta las líneas ERROR de cada log.',
      'El número lo decide el bucle: compara la cuenta con -gt 50.',
      'for f in logs/*.log; do [ "$(grep -c ERROR "$f")" -gt 50 ] && cat "$f"; done',
    ],
    teach: 'El combo «señuelo + grep -c + test» es el patrón estándar de auditoría por lotes. Encadenarlo con head/tail te enseña las cabeceras de CADA log sospechoso sin abrir el editor.',
    cheatsheet: [
      { cmd: 'grep -c ERROR f', desc: 'cuenta ERRORS' },
      { cmd: '[ n -gt 50 ] && a', desc: 'condición del trofeo' },
    ],
    keywords: ['grep -c', 'bucle', 'logs'],
  }),
  mk('boss', 6, {
    title: 'Agregación de ventas',
    subtitle: 'awk con acumulador por grupo',
    xp: 85, difficulty: 4,
    brief: 'ventas.csv reparte montos por regiones (varias filas por region). Una region esconde su nombre la marca; la ganadora es la que MÁS acuminula.',
    goal: 'Suma por region con awk y muestra el par importe-region de la region que más acumula (su nombre trae la marca).',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 06" "Boss"
mkdir -p /etc/arena
cat > /home/agent/ventas.csv <<FIN
norte,320
sur,180
torreon-$DOJO_FLAG,500
este,240
norte,430
torreon-$DOJO_FLAG,450
sur,200
torreon-$DOJO_FLAG,300
este,860
FIN
chown agent:agent /home/agent/ventas.csv`,
    solution: String.raw`awk -F, '{s[$1]+=$2} END {for (r in s) print s[r], r}' /home/agent/ventas.csv | sort -nr | head -n 1`,
    hints: [
      'awk puede ACRECER un array asociativo: s[r] += monto por salida de cada fila.',
      'El bloque END corre una vez al terminar: recorre el array con un for.',
      "awk -F, '{s[$1]+=$2} END {for (r in s) print s[r], r}' ventas.csv | sort -nr | head -1",
    ],
    teach: 'Awk con arrays asociativos + bloque END es SQL de bolsillo (GROUP BY + SUM). El for (r in s) recorre las claves y el print saca el relatório. Ordena con sort -nr para ver al ganador.',
    cheatsheet: [
      { cmd: "awk '{s[$1]+=$2} END…'", desc: 'suma por grupo' },
      { cmd: 'sort -nr', desc: 'numérico descendente' },
    ],
    keywords: ['awk', 'arrays', 'END', 'agregación'],
  }),
  mk('boss', 7, {
    title: 'Caza en los comprimidos',
    subtitle: 'find + xargs zcat/gunzip',
    xp: 85, difficulty: 4,
    brief: 'En caja/ hay un árbol de ficheros .gz y decoys sueltos. Todas las marcas interesantes están DENTRO de los comprimidos.',
    goal: 'Encuentra candidatos .gz en /home/agent/caja con find, descomprímelos de una pasada (xargs zcat) y extrae la marca real.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 07" "Boss"
mkdir -p /etc/arena
mkdir -p /home/agent/caja/sala1 /home/agent/caja/sala2/sala3
echo "decoy suelto con FLAG{decoy-cero}" > /home/agent/caja/suelto.txt
echo "nota blandita sin relevancia" | gzip > /home/agent/caja/sala1/una.gz
echo "más mullido" | gzip > /home/agent/caja/sala2/dos.gz
echo "última pieza: $DOJO_FLAG" | gzip > /home/agent/caja/sala2/sala3/tres.gz
echo "lleno de vacío" > /home/agent/caja/blanco.txt
chown -R agent:agent /home/agent/caja`,
    solution: String.raw`find /home/agent/caja -name '*.gz' -exec zcat {} \; | grep -oE 'FLAG\{[^}]*\}'`,
    hints: [
      'find -name "*.gz" localiza TODOS los comprimidos del árbol.',
      'zcat no acepta múltiples slots? sí: puedes lanzarlo con xargs o por -exec.',
      "find caja -name '*.gz' -exec zcat {} \\;… con grep -oE extraes SOLO la marca.",
    ],
    teach: 'find + xargs/-exec es la dupla clásica de bash para procesar hallazgos en lote. Descomprimir en el flujo (zcat) permite encadenar pipes sin ensuciar disco: caza de la marca sin archivos intermedios.',
    cheatsheet: [
      { cmd: "find d -name '*.gz' | xargs zcat", desc: 'descomprimir lote' },
      { cmd: 'zcat f | grep -oE x', desc: 'marca en el flujo' },
    ],
    keywords: ['find', 'zcat', 'xargs', 'lote'],
  }),
  mk('boss', 8, {
    title: 'La persistencia del planificador',
    subtitle: 'infiltración en /etc/cron.d',
    xp: 90, difficulty: 4,
    brief: 'Un atacante inyectó persistencia en /etc/cron.d: la tarea apunta a un script que a su vez señala un destinario final.',
    goal: 'Sigue sendera ficheros: /etc/cron.d (el fichero del planificador) → el script apuntado → el destinario que él señala. Muestra ese último con la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 08" "Boss"
mkdir -p /etc/arena
mkdir -p /etc/cron.d /var/lib/tam /home/agent/.tam
echo "# man/scripts legítima de backups del sistema" > /etc/cron.d/limpieza
echo "15 3 * * * root find /tmp -mtime +7 -delete" >> /etc/cron.d/limpieza
echo "# nota del operador: segura" > /etc/cron.d/backup
echo "45 * * * * root path=/var/lib/tam/accion.sh" >> /etc/cron.d/backup
printf 'run.success\n' > /var/lib/tam/accion.sh
echo "destino=/home/agent/.tam/llave.txt" >> /var/lib/tam/accion.sh
echo "la marca de la persistedencia: $DOJO_FLAG" > /home/agent/.tam/llave.txt
chmod 644 /etc/cron.d/* /var/lib/tam/accion.sh /home/agent/.tam/llave.txt
chown -R agent:agent /home/agent`,
    solution: String.raw`p=$(grep -oE 'path=[^ ]+' /etc/cron.d/backup | head -n1 | cut -d= -f2); q=$(grep -oE 'destino=[^ ]+' "$p" | head -n1 | cut -d= -f2); cat "$q"`,
    hints: [
      'Los ficheros de /etc/cron.d apuntan a un script: le el fichero del planificador primero.',
      'Extrae el path= del FICHERO script y después el destino= de jóin script.',
      'p=$(grep -oE "path=[^ ]+" /etc/cron.d/backup | cut -d= -f2); q=$(grep -oE "destino=[^ ]+" "$p" | cut -d= -f2); cat "$q"',
    ],
    teach: 'La persistencia vía cron es una técnica clásica de los atacantes: SIEMPRE revisa /etc/cron.d en una investigación. Seguir la cadena fichero→script→destino flujo es la forma de reconstruir el plan del atacante.',
    cheatsheet: [
      { cmd: 'ls /etc/cron.d', desc: 'persistencia programada' },
      { cmd: 'cut -d= -f2', desc: 'extrae el valor k=v' },
    ],
    keywords: ['cron.d', 'persistencia', 'cadena'],
  }),
  mk('boss', 9, {
    title: 'El tar sin tocar disco',
    subtitle: 'tar -O: contenido del comprimido al stdout',
    xp: 90, difficulty: 4,
    brief: 'archivo.tar.gz guarda un fichero NOTA.txt con la marca. La directiva del dojo: la marca debe sacarse SIN extraer nada al disco.',
    goal: 'Muestra el contenido del fichero guardado dentro de /home/agent/archivo.tar.gz SIN extraer al disco (lee el tar en el copia) y extrae la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 09" "Boss"
mkdir -p /etc/arena
mkdir -p /tmp/lvl-B9/paquete
echo "la marca viaja en el bulto: $DOJO_FLAG" > /tmp/lvl-B9/paquete/NOTA.txt
echo "rellena falzar" > /tmp/lvl-B9/paquete/relleno.txt
tar -czf /home/agent/archivo.tar.gz -C /tmp/lvl-B9 paquete
rm -rf /tmp/lvl-B9
chown agent:agent /home/agent/archivo.tar.gz`,
    solution: String.raw`tar -xzOf /home/agent/archivo.tar.gz | grep -oE 'FLAG\{[^}]*\}'`,
    hints: [
      'tar -f es el fichero; añade x, z y -O (O mayúscula = escribir al stdout, no disco).',
      'La salida tar va a stdout: encadénala con grep.',
      'tar -xzOf archivo.tar.gz | grep -oE "FLAG\\{[^}]*\\}"',
    ],
    teach: 'tar -O (mayúscula) escribe TODO el contenido AL stdout: el modo «cat del tar» sin extraer al disco. Es la forma forense de analizar un archivo sin contaminar la evidencia.',
    cheatsheet: [
      { cmd: 'tar -tzf f.tar.gz', desc: 'lista sin extraer' },
      { cmd: 'tar -xzOf f.tar.gz', desc: 'todo el contenido al stdout' },
    ],
    keywords: ['tar -O', 'stdout', 'forense'],
  }),
  mk('boss', 10, {
    title: 'La caja de seguridad final',
    subtitle: 'dos capas: base64 + tr rotación',
    xp: 100, difficulty: 5,
    brief: 'ultimis.b64 guarda (pista: rotación +13 de las letras dentro de una base64) la marca final. Ambas capas deben deshacerse EN ORDEN.',
    goal: 'Decodifica /home/agent/ultimis.b64 con base64 y DESPUÉS deshaz la rotación +13 (rot13) de las letras ya extraídas.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 10" "Boss"
mkdir -p /etc/arena
printf 'la hospitalaria terminal: %s\n' "$DOJO_FLAG" | tr 'A-Za-z' 'N-ZA-Mn-za-m' | base64 -w0 > /home/agent/ultimis.b64
echo >> /home/agent/ultimis.b64
chown agent:agent /home/agent/ultimis.b64`,
    solution: String.raw`base64 -d /home/agent/ultimis.b64 | tr 'A-Za-z' 'N-ZA-Mn-za-m'`,
    hints: [
      'Primero quita la codificación: base64 -d trae la cadena rotada.',
      'La rotación +13 es simétrica: la misma tr la deshace.',
      "base64 -d ultimis.b64 | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
    ],
    teach: 'Los encadenamientos (rot13+base64, hex+rot…) son una evasión típica de DLP. Deshacer CAPAS EN ORDEN es la disciplina del oficio: primero transforma la capa de transporte, luego recupera el texto original.',
    cheatsheet: [
      { cmd: "base64 -d f | tr 'A-Za-z' 'N-ZA-Mn-za-m'", desc: 'decodifica + rot13' },
      { cmd: 'xxd -r f.hex', desc: 'otro imposible reversible' },
    ],
    keywords: ['base64', 'rot13', 'capas', 'boss'],
  }),
];

export function allExpansion2() {
  return [
    ['redes', redes],
    ['archivos', archivos],
    ['scripting', scripting],
    ['forense', forense],
    ['boss', boss],
  ];
}

/* ═══ modo CLI ═══ */
if (import.meta.url === `file://${process.argv[1]}`) {
  const filter = process.argv[2] ?? '';
  let created = 0; let skipped = 0;
  for (const [track, levels] of allExpansion2()) {
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
