/**
 * gen-levels3-c — tanda 3 (parte C): procesos l13..l18 · redes l13..l18.
 * Patrones verificados en tanda 1-2: sudo -u agent para fondos, pidfile con
 * echo \$\$ (escapado en heredoc), exec -a para argv0, nc one-shot y dnsmasq
 * en puerto dedicado.
 */
import { mk } from './lib-levels.mjs';

const procesos = [
  mk('procesos', 13, {
    title: 'El renombrado',
    subtitle: 'exec -a: el argv0 manda en ps',
    xp: 45, difficulty: 3,
    brief: 'Un proceso camina disfrazado: su argv0 ES la marca. ps la revela, pgrep no te dice nada útil aquí.',
    goal: 'Encuentra el proceso cuyo nombre (argv0) es la marca y muéstralo con ps.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Procesos"
sudo -u agent bash -c "exec -a '$DOJO_FLAG' sleep 600" >/dev/null 2>&1 </dev/null &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`ps -eo args | grep -F 'FLAG{' | grep -v grep | head -n1`,
    hints: [
      'ps -eo args imprime SOLO la línea de argumentos de cada proceso (sin cabecera).',
      'El primer grep -F no se auto-pillar porque pgrep no está de por medio; el grep -v grep limpia al propio ps.',
      "ps -eo args | grep -F 'FLAG{' | grep -v grep",
    ],
    teach: 'exec -a reescribe argv[0]: es el truco de cambiapieles de los procesos (y de los rootkits). ps -eo args — y en kernels modernos /proc/PID/cmdline — son la contramedida.',
    cheatsheet: [
      { cmd: 'ps -eo args', desc: 'linea de comando de todos' },
      { cmd: 'ps -o args= -p PID', desc: "argv de un PID" },
    ],
    keywords: ['ps', 'argv', 'exec'],
  }),
  mk('procesos', 14, {
    title: 'El tozudo',
    subtitle: 'kill -9 cuando TERM no llega',
    xp: 45, difficulty: 3,
    brief: 'Un proceso se protege del SIGTERM con trap "". La educacion aquí es inútl: hay que cortar por lo sanos.KILL.',
    goal: 'Termina con SIGKILL el proceso cuyo PID está en /tmp/quisquilla.pid y confirma leyendo /tmp/manifesto.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Procesos"
cat > /tmp/quisquilla.sh <<FIN
#!/bin/bash
echo \$\$ > /tmp/quisquilla.pid
trap '' TERM
while true; do sleep 1; done
FIN
chmod 755 /tmp/quisquilla.sh
echo "manifesto del tozudo: $DOJO_FLAG" > /tmp/manifesto.txt
chmod 644 /tmp/manifesto.txt
sudo -u agent /tmp/quisquilla.sh >/dev/null 2>&1 </dev/null &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`kill -9 $(cat /tmp/quisquilla.pid); cat /tmp/manifesto.txt`,
    hints: [
      'trap "TERM" hace al proceso inmune al SIGTERM; hasta un SIGKILL (kill -9) no refunfuna.',
      'kill -9 $(cat /tmp/quisquilla.pid) — el pidfile es la forma limpia de apuntar.',
      'kill -9 $(cat /tmp/quisquilla.pid); cat /tmp/manifesto.txt',
    ],
    teach: 'SIGTERM es negociable (trap); SIGKILL es judicial: el kernel saca el proceso y TERMINA. Nunca uses -9 de primeras: "a veces el trap es el que hace el backup".',
    cheatsheet: [
      { cmd: 'kill -9 PID', desc: 'SIGKILL, indetectable por trap' },
      { cmd: 'kill -TERM PID', desc: 'la educada (trap-compatible)' },
    ],
    keywords: ['kill', 'SIGKILL', 'term'],
  }),
  mk('procesos', 15, {
    title: 'La señal de usuario',
    subtitle: 'kill -USR1 y trap personalizado',
    xp: 45, difficulty: 3,
    brief: "El cubridor solo contesta a una señal de usuario (USR1): su trap escribe la confesión en fichero.",
    goal: 'Envía SIGUSR1 al proceso con PID en /tmp/cubridor.pid y muestra su confesión en /tmp/confesion-usr.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Procesos"
cat > /tmp/cubridor.sh <<FIN
#!/bin/bash
echo \$\$ > /tmp/cubridor.pid
trap 'echo "confesion USR1: $DOJO_FLAG" > /tmp/confesion-usr.txt; exit 0' USR1
while true; do sleep 1; done
FIN
chmod 755 /tmp/cubridor.sh
sudo -u agent /tmp/cubridor.sh >/dev/null 2>&1 </dev/null &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`kill -USR1 $(cat /tmp/cubridor.pid); sleep 1; cat /tmp/confesion-usr.txt`,
    hints: [
      'SIGUSR1 es una señal definida por el usuario: kill -USR1 PID la envía sin teclado.',
      'El trap USR1 del proceso escribe al fichero antes de salir; dale 1 segundo.',
      'kill -USR1 $(cat /tmp/cubridor.pid); sleep 1; cat /tmp/confesion-usr.txt',
    ],
    teach: 'Señales trappables: TERM (la educada), INT (Ctrl+C) y las de usuario USR1/USR2. kill SIN sufijo es TERM; KILL no es trappable.',
    cheatsheet: [
      { cmd: 'kill -INT PID', desc: 'Ctrl+C por señal' },
      { cmd: 'kill -USR1 PID', desc: 'señal de usuario 1' },
    ],
    keywords: ['kill', 'usr1', 'trap'],
  }),
  mk('procesos', 16, {
    title: 'Quién manda',
    subtitle: 'PPID: el padre de un proceso',
    xp: 45, difficulty: 3,
    brief: 'El proceso cubierto SIDF está en /tmp/pantalla.pid. Su PADRE (el PID que lo engendro) esconde la marca en su argv0.',
    goal: 'Descubre el PADRE del proceso /tmp/pantalla.pid y muestra su línea de comando con ps.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Procesos"  sudo -u agent bash -c "exec -a 'pantalla-$DOJO_FLAG' sleep 600" >/dev/null 2>&1 </dev/null &
  sudo -u agent sleep 600 >/dev/null 2>&1 </dev/null &
  sleep 1
  PRIMARY=$(pgrep -u agent -f '^pantalla-' | head -n1)
  echo "$PRIMARY" > /tmp/pantalla.pid
  chown -R agent:agent /home/agent`,
    solution: String.raw`pp=$(ps -o ppid= -p $(cat /tmp/pantalla.pid) | tr -d ' '); ps -o args= -p "$pp"`,
    hints: [
      'ps -o ppid= -p PID imprime solo el PID del padre (el = quita la cabecera).',
      'Con ese PPID, ps -o args= -p PADRE muestra el argv0 del padre: allí está la marca.',
      "pp=$(ps -o ppid= -p $(cat /tmp/pantalla.pid)); ps -o args= -p $pp",
    ],
    teach: 'Cada proceso tiene PPID: usarlo es el modo de "¿quién lanzó esto?" — parentage forense básico. ps -o ppid= y ps -o args= van de la mano.',
    cheatsheet: [
      { cmd: 'ps -o ppid= -p PID', desc: 'PID del padre' },
      { cmd: 'ps -ef --forest', desc: 'árbol de procesos' },
    ],
    keywords: ['ps', 'ppid', 'padre'],
  }),
  mk('procesos', 17, {
    title: 'El escolta que confiesa',
    subtitle: 'pidfiles numerados + trap',
    xp: 50, difficulty: 3,
    brief: 'Tres escoltas esperan con sus pidfiles. Solo el Nº3 deja un despacho al licenciarse (SIGTERM): los otros dos ratones de campo.',
    goal: 'Manda SIGTERM al escolta Nº3 (pidfile /tmp/escolta.3.pid) y muestra su /tmp/despacho.txt.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Procesos"
cat > /tmp/escolta.sh <<FIN
#!/bin/bash
n=\$1
echo \$\$ > /tmp/escolta.\$n.pid
if [ "\$n" = "3" ]; then
  trap 'echo "despacho del escolta: $DOJO_FLAG" > /tmp/despacho.txt; exit 0' TERM
else
  trap '' TERM
fi
while true; do sleep 1; done
FIN
chmod 755 /tmp/escolta.sh
sudo -u agent /tmp/escolta.sh 1 >/dev/null 2>&1 </dev/null &
sudo -u agent /tmp/escolta.sh 2 >/dev/null 2>&1 </dev/null &
sudo -u agent /tmp/escolta.sh 3 >/dev/null 2>&1 </dev/null &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`kill $(cat /tmp/escolta.3.pid); sleep 2; cat /tmp/despacho.txt`,
    hints: [
      'Los tres ficheros /tmp/escolta.N.pid discriminan a cada escolta; solo el 3 tiene trap de escritura.',
      'kill TERM al PID del pidfile Nº3; el trap escribe el fichero y sale.',
      'kill $(cat /tmp/escolta.3.pid); sleep 2; cat /tmp/despacho.txt',
    ],
    teach: 'Los pidfiles numerados son un patrón aún útil (systemd generó el patrón). Cuando hay procesos homónimos, apuntar su PID te salvan de la matanza indiscriminada de pkill.',
    cheatsheet: [
      { cmd: 'kill $(cat f.pid)', desc: 'pidfile: apunta y dispara' },
      { cmd: 'for f in *.pid; do kill $(cat $f); done', desc: 'varios a la vez' },
    ],
    keywords: ['pidfile', 'term', 'kill'],
  }),
  mk('procesos', 18, {
    title: 'El esmirriado',
    subtitle: 'nice y ni en ps',
    xp: 50, difficulty: 3,
    brief: 'Un proceso camina ofendido con ni=19 (la menor prioridad). Es distinguido por la marca en su argv0 — enciona por nice.',
    goal: 'Encuentra con ps el proceso cuya prioridad (ni) es 19 y muestra su argv0, donde va la marca.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Procesos"
sudo -u agent nice -n 19 bash -c "exec -a '$DOJO_FLAG' sleep 600" >/dev/null 2>&1 </dev/null &
sudo -u agent bash -c "sleep 600" >/dev/null 2>&1 </dev/null &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`ps -eo ni,args | awk '$1 == 19' | head -n1`,
    hints: [
      'ps -eo ni,args imprime prioridad y argv de todos; ni es 0 para lo normal, negativo para lo urgente y 19 el pisoteado.',
      'awk "$1 == 19" filtra por prioridad: solo uno encaja.',
      "ps -eo ni,args | awk '$1 == 19'",
    ],
    teach: 'nice -n 19 baja la prioridad al mínimo (ni = 19). ps la muestra con la columna ni. Un proceso ofendido sigue corriendo — solo corre cuando nadie más quiere la CPU.',
    cheatsheet: [
      { cmd: 'ps -eo ni,args', desc: 'prioridad + argv' },
      { cmd: 'renice -n 5 -p PID', desc: 'cambiar prioridad' },
    ],
    keywords: ['nice', 'ni', 'ps'],
  }),
];

const redes = [
  mk('redes', 13, {
    title: 'Ese nombre no existe',
    subtitle: '/etc/hosts: DNS casero',
    xp: 40, difficulty: 2,
    brief: 'El dojo sirve una web en el 8000, pero solo la alcanza por IP…oten. Su alias dojo.local mapea en /etc/hosts.',
    goal: 'Resuelve el alias de /etc/hosts y descarga http://dojo.local:8000/pieza.html.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 13" "Redes"
mkdir -p /etc/arena /var/www/locale
echo "127.0.0.1 dojo.local" >> /etc/hosts
echo "<html>Desde el alias: $DOJO_FLAG</html>" > /var/www/locale/pieza.html
nohup python3 -m http.server 8000 --directory /var/www/locale >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s http://dojo.local:8000/pieza.html`,
    hints: [
      './etc/hosts es la tabla de resolución local: se consulta ANTES que el DNS.',
      'grep dojo.local /etc/hosts te enseña el alias; curl por nombre en lugar de 127.0.0.1.',
      'curl -s http://dojo.local:8000/pieza.html',
    ],
    teach: '/etc/hosts es el DNS de bolsillo: alias internos, docker-compose sobrescribe IPs, machines frente a entornos. curl por hostname ya no va por IP: pasing de DNS a nombre.',
    cheatsheet: [
      { cmd: 'grep nombre /etc/hosts', desc: 'alias local' },
      { cmd: 'curl http://alias:puerto/', desc: 'descarga por nombre' },
    ],
    keywords: ['hosts', 'alias', 'curl'],
  }),
  mk('redes', 14, {
    title: 'El fichero sin nombre',
    subtitle: 'listing HTTP y URL-encoding',
    xp: 40, difficulty: 2,
    brief: 'Un directorio web lista su contenido. Un fichero lleva en su NOMBRE la marca… nacelados símbolos se viajan como %7B y %7D.',
    goal: 'Mira el listado de http://127.0.0.1:8000/ y decodifica el nombre del fichero que escapa los llaves.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 14" "Redes"
mkdir -p /etc/arena /var/www/baul
touch "/var/www/baul/$DOJO_FLAG"
echo "solo mirando: el nombre ES el secreto" > /var/www/baul/lectures.txt
nohup python3 -m http.server 8000 --directory /var/www/baul >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`curl -s http://127.0.0.1:8000/ | sed 's/%7B/{/g; s/%7D/}/g' | grep -oE 'FLAG\{[a-f0-9]+\}'`,
    hints: [
      'python -m http.server lista el directorio en HTML con los ficheros.',
      'En URLs los llaves escapar: %7B es { y %7D es }; sed los devuelve.',
      "curl -s http://127.0.0.1:8000/ | sed 's/%7B/{/g; s/%7D/}/g' | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
    ],
    teach: 'El URL-encoding transforma todo lo "raro" para que viaje en una URL: { → %7B. Saber decodificar (y encodear con --data-urlencode) es lectura básica de URLs.',
    cheatsheet: [
      { cmd: "sed 's/%7B/{/g'", desc: 'descodificar llaves' },
      { cmd: 'curl --data-urlencode', desc: 'encodear al enviar' },
    ],
    keywords: ['listing', 'url', 'encode'],
  }),
  mk('redes', 15, {
    title: 'Recogida física',
    subtitle: 'wget como cliente de descarga',
    xp: 40, difficulty: 2,
    brief: 'La web del dojo reparte un fichero. wget salva un fichero local (a diferencia de curl, que por defecto lo imprime).',
    goal: 'Descarga http://127.0.0.1:8000/reparto.txt con wget y muestra su contenido.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 15" "Redes"
mkdir -p /etc/arena /var/www/reparto
echo "entrega directa: $DOJO_FLAG" > /var/www/reparto/reparto.txt
nohup python3 -m http.server 8000 --directory /var/www/reparto >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`wget -q -O /tmp/recogida.txt http://127.0.0.1:8000/reparto.txt; cat /tmp/recogida.txt`,
    hints: [
      'wget URL guarda el fichero con su nombre. -O ruta llama distinto al resultado. -q silencia por completo.',
      'Después de descargar, el cat es tuyo.',
      'wget -q -O f http://127.0.0.1:8000/reparto.txt; cat f',
    ],
    teach: 'wget es el capataz de descargas: reintentos, recursividad (--mirror). curl es de copiar al stdout, wget de ir a cacharrar fichero. Dos sabores del mismo café.',
    cheatsheet: [
      { cmd: 'wget URL', desc: 'descarga al nombre igual' },
      { cmd: 'wget -qO- URL', desc: 'al stdout, como curl' },
    ],
    keywords: ['wget', 'descarga', 'http'],
  }),
  mk('redes', 16, {
    title: 'Un saludo y fuera',
    subtitle: 'nc -l servidor de una sóla línea',
    xp: 45, difficulty: 3,
    brief: 'Un mini servidor netcat espera UNA única conexión en el puerto 7077 y suelta la pieza al puerta.',
    goal: 'Conéctate una vez con nc al puerto 7077 de localhost y lee lo que envía.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 16" "Redes"
mkdir -p /etc/arena
echo "saludado por nc: $DOJO_FLAG" > /tmp/mandato.txt
nohup bash -c 'nc -l -p 7077 -q0 < /tmp/mandato.txt' >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`timeout 5 nc 127.0.0.1 7077`,
    hints: [
      'nc HOST PUERTO abierto conexión y baraja lo que llega al stdout hasta cerrar.',
      'Con timeout evistas quedarte colgado si el servidor ya cerró.',
      'nc 127.0.0.1 7077',
    ],
    teach: 'nc -l -p N es un servidor mínimo: una línea de TCP sin HTTP. Para probar servicios custom, juniors y pipelines: es EL petardazo de las redes del shell.',
    cheatsheet: [
      { cmd: 'nc -l -p 7077 -q0 < f', desc: 'un envío y cierra' },
      { cmd: 'nc host puerto', desc: 'conectar y leer' },
    ],
    keywords: ['nc', 'netcat', 'tcp'],
  }),
  mk('redes', 17, {
    title: 'Mira por el puerto',
    subtitle: '/proc/net/tcp: puertos en hexadecimal',
    xp: 45, difficulty: 3,
    brief: 'Un servicio corre en el 9009. En /proc/net/tcp los puertos viajan en hexadecimal — 9009 se convierte en 2339. Recherche y confirma descargando la web.',
    goal: 'Comprueba en /proc/net/tcp el puerto 9009 en hexadecimal (2339) y descarga http://127.0.0.1:9009/.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 17" "Redes"
mkdir -p /etc/arena /var/www/p9009
echo "a la vista del 9009: $DOJO_FLAG" > /var/www/p9009/index.html
nohup python3 -m http.server 9009 --directory /var/www/p9009 >/dev/null 2>&1 &
sleep 2
chown -R agent:agent /home/agent`,
    solution: String.raw`grep -i ':2339 ' /proc/net/tcp | head -n1; curl -s http://127.0.0.1:9009/`,
    hints: [
      '/proc/net/tcp muestra local_address como ip:PUERTO en hexadecimal (9009 = 2339).',
      'grep con los espacios alrededor de 2339: :2339 (y ojo de mayúsculas con -i).',
      "grep -i ':2339 ' /proc/net/tcp",
    ],
    teach: '/proc/net/tcp es la mine de oro de TCP (ss/lo lee de ahí). Puertos/file states en hexadecimal: 1F90=8080, 2339=9009. ¿Parser portátil sin tools? /proc/net/tcp.',
    cheatsheet: [
      { cmd: 'grep :2339 /proc/net/tcp', desc: 'port en hex 0x23399009' },
      { cmd: 'ss -tln', desc: 'lo mismo, humano' },
    ],
    keywords: ['proc', 'tcp', 'hex'],
  }),
  mk('redes', 18, {
    title: 'El registro TXT',
    subtitle: 'dnsmasq + dig TXT en puerto propio',
    xp: 45, difficulty: 3,
    brief: 'Un DNS minúsculo lleva la pieza como registro TXT en el dominio marca.dojo, en 127.0.0.1:5354.',
    goal: 'Consulta el TXT de marca.dojo al DNS del puerto 5354.',
    setup: String.raw`#!/bin/bash
set -e
arena-prompt "LVL 18" "Redes"
mkdir -p /etc/arena
printf 'txt-record=marca.dojo,"%s"\n' "$DOJO_FLAG" > /etc/arena/dns18.conf
setsid /usr/sbin/dnsmasq --no-daemon --port=5354 --listen-address=127.0.0.1 \
  --conf-file=/etc/arena/dns18.conf --no-hosts --no-resolv \
  --log-facility=/tmp/dns18.log >/dev/null 2>&1 &
sleep 1
chown -R agent:agent /home/agent`,
    solution: String.raw`dig @127.0.0.1 -p 5354 +short TXT marca.dojo`,
    hints: [
      'Los TXT llevan texto suelto entre comillas: la marca entera viaja en el registro.',
      'dig @127.0.0.1 -p 5354 +short TXT marca.dojo — el +short deja la respuesta pelada.',
      'dig @127.0.0.1 -p 5354 +short TXT marca.dojo',
    ],
    teach: 'Los registros TXT cargan texto libre (DKIM, verificación dominio…). dig -p habla a un puerto NO estándar: la manera de testear DNS no en el 53 de siempre.',
    cheatsheet: [
      { cmd: 'dig @host -p puerto TXT dom', desc: 'TXT a puerto custom' },
      { cmd: 'dig +short', desc: 'solo la respuesta' },
    ],
    keywords: ['dig', 'txt', 'dns'],
  }),
];

export default [...procesos, ...redes];
