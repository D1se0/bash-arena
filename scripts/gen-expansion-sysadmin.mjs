/*
 * gen-expansion-sysadmin — genera los niveles de CONFIGURACIÓN Y SERVICIOS:
 *      sysadmin (18 niveles): sshd, nginx, apache2, usuarios, binarios y logs
 *      dns (12 niveles):   dig A/TXT/MX/ANY/PTR, +short, +noall, NXDOMAIN,
 *                          +tcp, HOSTALIASES, log de consultas y /etc/hosts
 * Mecánica típica:
 *      · $DOJO_FLAG se planta en el escenario (fichero/registro/BD).
 *      · En niveles de configuración existe el verificador global
 *        /usr/local/bin/dojo-verificar <tema>: valida las comprobaciones del
 *        nivel y, SOLO cuando todas pasan, imprime la flag.
 * Regenerar: node scripts/gen-expansion-sysadmin.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const HOME = '/home/agent';

/* ═══════════════════════════════════════════════════════════════ SYADMIN ══ */
const SYADMIN = [
  {
    index: 1, title: 'El breve accidente de /tmp', subtitle: 'limpieza y validación de sshd_conf con sshd -t',
    xp: 60, difficulty: 3,
    brief: 'Al sshd del dojo le metieron la directiva bandera con un typo y ya no arranca. Los configtests de sshd son TU herramienta.',
    goal: 'Repara /etc/ssh/sshd_config.d/dojo.conf (la directiva Port viene mal escrita: pasa a Port 2200). Valida con sudo sshd -t y luego ejecuta dojo-verificar sshd-port.',
    setup: () => `
sudo -n true 2>/dev/null || true
mkdir -p /etc/ssh/sshd_config.d
printf '%s\\n' 'Portt 2200' > /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  sshd-port)
    grep -Eq '^[[:space:]]*Port[[:space:]]+2200[[:space:]]*$' /etc/ssh/sshd_config.d/dojo.conf || { echo "falta Port 2200"; exit 1; }
    sudo sshd -t 2>&1 || { echo "sshd -t falla"; exit 1; }
    echo "✓ sshd-config válida"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar`,
    solution: `sudo bash -c "sed -i 's/Portt/Port/' /etc/ssh/sshd_config.d/dojo.conf && sshd -t" && dojo-verificar sshd-port`,
    hints: [
      'El fichero del nivel es /etc/ssh/sshd_config.d/dojo.conf: el typo va en el nombre de la directiva "Portt".',
      'sudo sed -i "s/Portt/Port/" /etc/ssh/sshd_config.d/dojo.conf corrige la directiva.',
      'La referencia: sudo sshd -t verifica la sintaxis SIN arrancar el servicio.',
      `sudo bash -c "sed -i 's/Portt/Port/' /etc/ssh/sshd_config.d/dojo.conf && sshd -t" && dojo-verificar sshd-port`,
    ],
    teach: 'modificar configuración SIN VALIDARla es escribir a ciegas. La práctica sshd -t (y nginx -t, apache2ctl configtest) es el "prueba de sintaxis antes de recargar". Convalida cualquier fichero desde el shell.',
    cheatsheet: [
      { cmd: 'sudo sshd -t', desc: 'valida la configuración de sshd' },
      { cmd: 'sed -i s/a/b/ f', desc: 'sustitución en línea y edición inplace' },
    ],
    keywords: ['ssh', 'sshd', '-t', 'configura', 'validación'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ sshd-config válida\nFLAG{d3b09a4f7c2e1b8d6041a5f3}' }],
  },
  {
    index: 2, title: 'La autenticación permitida', subtitle: 'ssh: PasswordAuthentication y PubkeyAuthentication',
    xp: 65, difficulty: 3,
    brief: 'El dojo exige SSH SOCIÓ CON CLAVE, no con contraseña: son las dos directivas clásicas del atomic hardening SSH.',
    goal: 'En /etc/ssh/sshd_config.d/dojo.conf (fichero que YA existe, con otras directivas): añade PasswordAuthentication no y PubkeyAuthentication yes, cada una en su línea (append, no en columnas). Luego sudo sshd -t y dojo-verificar sshd-auth.',
    setup: () => `
mkdir -p /etc/ssh/sshd_config.d
printf '%s\\n' '## nivel sshd-auth' > /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' '## directivas del nivel' >> /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' 'UsePAM no' >> /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  sshd-auth)
    grep -Eq '^[[:space:]]*PasswordAuthentication[[:space:]]+no[[:space:]]*$' /etc/ssh/sshd_config.d/dojo.conf || { echo "falta PasswordAuthentication no"; exit 1; }
    grep -Eq '^[[:space:]]*PubkeyAuthentication[[:space:]]+yes[[:space:]]*$' /etc/ssh/sshd_config.d/dojo.conf || { echo "falta PubkeyAuthentication yes"; exit 1; }
    sudo sshd -t 2>&1 || { echo "sshd -t falla"; exit 1; }
    echo "✓ directo sshd-auth; autenticación por clave configurada"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar`,
    solution: `sudo bash -c 'printf "%s\\n" "PasswordAuthentication no" "PubkeyAuthentication yes" >> /etc/ssh/sshd_config.d/dojo.conf && sshd -t' && dojo-verificar sshd-auth`,
    hints: [
      'Añade las dos líneas CON >> (append) o con grep -v para quitarlas si ya están: sigue siendo el mismo fichero como siempre.',
      'Las directivas class: PasswordAuthentication no / PubkeyAuthentication yes.',
      `sudo bash -c 'printf "%s\\n" "PasswordAuthentication no" "PubkeyAuthentication yes" >> /etc/ssh/sshd_config.d/dojo.conf && sshd -t' && dojo-verificar sshd-auth`,
    ],
    teach: 'ssh OTP/permite SOCIÓ de login de clave con las clas certainties (no la cfg cada vez). Son las DOS directivas de acceso que TODOS admin de seguridad debe grabar en la memoria muscular.',
    cheatsheet: [
      { cmd: 'grep -E "SSH"...', desc: 'ver dirigas sshd_on_option' },
      { cmd: 'sudo sshd -t', desc: 'vincular las directivas de configtest' },
    ],
    keywords: ['ssh', 'sshd', 'password', 'pubkey', 'auth'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ directas aptas: FLAG{…}' }],
  },
  {
    index: 3, title: 'Usuarios permitidos', subtitle: 'ssh AllowUsers en sshd',
    xp: 70, difficulty: 3,
    brief: 'El dojo quiere SSH EXCLUSIVAMENTE para los usuarios del grupo agent: ni root, ni invitados.',
    goal: 'En /etc/ssh/sshd_config.d/dojo.conf: añade AllowUsers agent. Valida con sudo sshd -t y lanza dojo-verificar sshd-users.',
    setup: () => `
mkdir -p /etc/ssh/sshd_config.d
printf '%s\\n' 'PermitRootLogin prohibit-password' > /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  sshd-users)
    grep -Eq '^[[:space:]]*AllowUsers[[:space:]]+agent([[:space:]]|$)' /etc/ssh/sshd_config.d/dojo.conf || { echo "falta AllowUsers agent"; exit 1; }
    sudo sshd -t 2>&1 || { echo "sshd -t falla"; exit 1; }
    echo "✓ AllowUsers agente configurado"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar`,
    solution: `sudo bash -c 'echo "AllowUsers agent" >> /etc/ssh/sshd_config.d/dojo.conf && sshd -t' && dojo-verificar sshd-users`,
    hints: [
      'La sintaxis es una línea: AllowUsers agent (con mayúscula en AllowUsers y el orden exacto).',
      'También puedes validar con sudo sshd -T (en minúsculas) que imprime el config fvalidado completo.',
      `sudo bash -c 'echo "AllowUsers agent" >> /etc/ssh/sshd_config.d/dojo.conf && sshd -t' && dojo-verificar sshd-users`,
    ],
    teach: 'AllowUsers es el filtro de autenticación de sshd: quién puede entrar a través de sshd(PRODUCTION). Un detalle que se practica poco: hay un espacio entre AllowUsers y usario; la configmetería falla si hay otra palabra extra.',
    cheatsheet: [
      { cmd: 'sudo sshd -T', desc: 'config sshd VALIDADO COMPLETO' },
      { cmd: 'grep AllowUsers sue', desc: 'buscar el usuarios permitidos' },
    ],
    keywords: ['sshd', 'AllowUsers', 'usuarios', 'auth'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ AllowUsers configurado\nFLAG{…}' }],
  },
  {
    index: 4, title: 'El banner SSH', subtitle: 'establecer banner en sshd',
    xp: 65, difficulty: 3,
    brief: 'El dojo exige UN AVISO legal visible al conectarse por SSH: la directiva Banner apunta a un fichero del sistema.',
    goal: 'Añade Banner /etc/ssh/dojo-banner a /etc/ssh/sshd_config.d/dojo.conf, crea el banner con TU TOASTEHA (en /etc/ssh/dojo-banner), y valida con sudo sshd -t; luego dojo-verificar sshd-banner.',
    setup: () => `
mkdir -p /etc/ssh
printf '%s\\n' 'UsePAM no' > /etc/ssh/sshd_config.d/dojo.conf 2>/dev/null || { mkdir -p /etc/ssh/sshd_config.d; printf '%s\\n' 'UsePAM no' > /etc/ssh/sshd_config.d/dojo.conf; }
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  sshd-banner)
    grep -Eq '^[[:space:]]*Banner[[:space:]]+/etc/ssh/dojo-banner[[:space:]]*$' /etc/ssh/sshd_config.d/dojo.conf || { echo "falta Banner /etc/ssh/dojo-banner"; exit 1; }
    grep -Eq 'dojo' /etc/ssh/dojo-banner || { echo "el banner debe mencionar dojo"; exit 1; }
    sudo sshd -t 2>&1 || { echo "sshd -t falla"; exit 1; }
    echo "✓ banner SSH configurado"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar`,
    solution: `sudo bash -c 'echo "Banner /etc/ssh/dojo-banner" >> /etc/ssh/sshd_config.d/dojo.conf && printf "Aviso legal del dojo\\nConexión monitorizada.\\n" > /etc/ssh/dojo-banner && sshd -t' && dojo-verificar sshd-banner`,
    hints: [
      'La directiva es Banner <fichero>: apunta a un fichero plano CON TEXTO libre.',
      'El banner debe existir ANTES de validar; el texto tiene que mencionar la palabra dojo.',
      `sudo bash -c 'echo "Banner /etc/ssh/dojo-banner" >> /etc/ssh/sshd_config.d/dojo.conf && printf "Aviso legal del dojo\\nConexión monitorizada.\\n" > /etc/ssh/dojo-banner && sshd -t' && dojo-verificar sshd-banner`,
    ],
    teach: 'Un SSH banner es el aviso legal del server. Debe EXISTIR el fichero y ser legible por sshd; y si el path no existe, sshd -t NO falla (porque es solo texto): hay que $\u200bverificar por autotestático (y por eso el verificador lo la comprueba).',
    cheatsheet: [
      { cmd: 'sudo sshd -t', desc: 'verificar la config final sshd' },
      { cmd: 'cat /etc/ssh/dojo-banner', desc: 'verificar el contenido del banner' },
    ],
    keywords: ['sshd', 'banner', 'seguridad'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ banner SSH configurado\nFLAG{…}' }],
  },
  {
    index: 5, title: 'La llave del dojo', subtitle: 'ssh-keygen: par de claves',
    xp: 70, difficulty: 3,
    brief: 'El agente NO tiene par de claves SSH. Se pide UNA ED25519 de tipo estándar (sin passphrase) en ~/.ssh/id_ed25519.',
    goal: 'Crea un par de claves SSH ED25519 SIN passphrase en /home/agent/.ssh/id_ed25519 (con ssh-keygen -t ed25519 -N ""), y establece el fichero al perms correctos. Luego dojo-verificar ssh-key.',
    setup: () => `
mkdir -p /home/agent/.ssh && chmod 0700 /home/agent/.ssh
chown -R agent:agent /home/agent/.ssh
rm -f /home/agent/.ssh/id_ed25519 /home/agent/.ssh/id_ed25519.pub
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  ssh-key)
    [ -f $HOME/.ssh/id_ed25519 ] || { echo "falta la clave privada ~/.ssh/id_ed25519"; exit 1; }
    [ -f $HOME/.ssh/id_ed25519.pub ] || { echo "falta la clave pública ~/.ssh/id_ed25519.pub"; exit 1; }
    [ "$(stat -c '%a' $HOME/.ssh/id_ed25519)" = 600 ] || { echo "la clave privada debe tener perm 600"; exit 1; }
    ssh-keygen -y -f $HOME/.ssh/id_ed25519 >/dev/null 2>&1 || { echo "la clave privada no es válida"; exit 1; }
    echo "✓ par de claves ED25519 listo"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar
mkdir -p /home/agent/.ssh && chmod 0700 /home/agent/.ssh && chown -R agent:agent /home/agent/.ssh`,
    solution: `ssh-keygen -t ed25519 -N "" -f $HOME/.ssh/id_ed25519 -C "agent-dojo" && chmod 600 $HOME/.ssh/id_ed25519 && dojo-verificar ssh-key`,
    hints: [
      'ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 crea el par SIN passphrase.',
      'El fichero ~/.ssh/id_ed25519 (private) debe tener permisos 600; el .pub 644.',
      `ssh-keygen -t ed25519 -N "" -f $HOME/.ssh/id_ed25519 -C "agent-dojo" && chmod 600 $HOME/.ssh/id_ed25519 && dojo-verificar ssh-key`,
    ],
    teach: 'ssh-keygen es el OFICIO digital: -f path, -t algoritmo, -N passphrase (-N "" para sin passphrase). Los permisos 600 de la clave privada son OBLIGATORIOS: con 644 ssh la rechaza.',
    cheatsheet: [
      { cmd: 'ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519', desc: 'par de claves sin passphrase' },
      { cmd: 'chmod 600 ~/.ssh/id_ed25519', desc: 'permisos correctos de la clave privada' },
    ],
    keywords: ['ssh', 'ssh-keygen', 'ed25519', 'claves'],
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ par de claves ED25519 listo\nFLAG{…}' }],
  },
  {
    index: 6, title: 'La conexión por clave', subtitle: 'sshd activo + ssh local por clave',
    xp: 85, difficulty: 4,
    brief: 'El setup arranca un sshd local en el puerto 2200 aceptando SOLO tu clave pública… y coloca la firma en un fichero SOLO legible al loguearte.',
    goal: 'Conéctate por ssh a tu PROPIO equipo (puerto 2200, usuario agent) usando tu clave de ~/.ssh/id_ed25519 (o la que te di), y lee el fichero /var/dojo/secreto.txt de la sesión remota.',
    setup: () => `
mkdir -p /run/sshd /var/dojo /home/agent/.ssh
ssh-keygen -t ed25519 -N "" -f /home/agent/.ssh/id_dojo -C agent-dojo >/dev/null
cp /home/agent/.ssh/id_dojo.pub /home/agent/.ssh/authorized_keys
printf '%s\\n' 'Port 2200' 'PasswordAuthentication no' 'PubkeyAuthentication yes' 'PermitRootLogin no' > /etc/ssh/sshd_config.d/dojo.conf
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/dojo/secreto.txt
chown -R agent:agent /var/dojo /home/agent/.ssh
chmod 700 /home/agent/.ssh && chmod 600 /home/agent/.ssh/* /var/dojo/secreto.txt
cat > /usr/local/bin/dojo-verificar <<'CHECK'
#!/bin/bash
case "$1" in
  ssh-login) pgrep -x sshd >/dev/null || { echo "sshd no está en ejecución"; exit 1; } ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar
/usr/sbin/sshd 2>/dev/null || true
sleep 0.5`,
    solution: `ssh -i $HOME/.ssh/id_dojo -p 2200 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null agent@127.0.0.1 cat /var/dojo/secreto.txt`,
    hints: [
      'El sshd ya está ARRANCADO en el puerto 2200: conéctate con ssh -p 2200 agent@127.0.0.1.',
      'La clave privada que acepta es ~/.ssh/id_dojo (sig infinita pub en authorized_keys).',
      'Deshable StrictHostKeyChecking al ser un servidor local: -o StrictHostKeyChecking=no.',
      `ssh -i $HOME/.ssh/id_dojo -p 2200 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null agent@127.0.0.1 cat /var/dojo/secreto.txt`,
    ],
    teach: 'El flujo COMPLETO de SSH: generar la clave, copiar la pública a authorized_keys (con los permisos 700/600 correctos), y CONECTAR. Es el paso a paso real de cualquier acceso a servidor por clave.',
    cheatsheet: [
      { cmd: 'ssh -i clave -p puerto usuario@host cmd', desc: 'conexión ssh con clave y comando' },
      { cmd: '-o StrictHostKeyChecking=no', desc: 'acepta el host sin confirmar (labs)' },
    ],
    keywords: ['ssh', 'sshd', 'claves', '2200', 'conexión'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{d3b09a4f7c2e1b8d6041a5f3}' }],
  },
  {
    index: 7, title: 'La copia tranquilizada', subtitle: 'nginx -t: validar la configuración de nginx',
    xp: 70, difficulty: 3,
    brief: 'El nginx del dojo está en La Co pileja de configuración /home/agent/nginx: la directiva server_name tiene un typo que rompe nginx -t.',
    goal: 'Repara /home/agent/nginx/nginx.conf (el typo está en el nombre de la directiva server_name): valida con nginx -t -c /home/agent/nginx/nginx.conf -p /home/agent/nginx/ y luego dojo-verificar nginx-syntax.',
    setup: () => `
mkdir -p ${HOME}/nginx/logs ${HOME}/nginx/html ${HOME}/nginx/tmp/body ${HOME}/nginx/tmp/proxy ${HOME}/nginx/tmp/fastcgi ${HOME}/nginx/tmp/uwsgi ${HOME}/nginx/tmp/scgi
printf '%s\\n' '<h1>dojo</h1>' > ${HOME}/nginx/html/index.html
cat > ${HOME}/nginx/nginx.conf <<EOF
# nginx.conf del dojo - nivel nginx-syntax
pid  logs/nginx.pid;
worker_processes  1;
error_log  logs/error.log;
events { worker_connections 16; }
http {
  access_log  logs/access.log;
  client_body_temp_path  /home/agent/nginx/tmp/body;
  proxy_temp_path        /home/agent/nginx/tmp/proxy;
  fastcgi_temp_path      /home/agent/nginx/tmp/fastcgi;
  uwsgi_temp_path        /home/agent/nginx/tmp/uwsgi;
  scgi_temp_path         /home/agent/nginx/tmp/scgi;
  server {
    servr_name  dojo.local;      # <- typo aquí
    listen 127.0.0.1:8081;
    root html;
    index index.html;
  }
}
EOF
chown -R agent:agent ${HOME}/nginx
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  nginx-syntax)
    nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ 2>&1 | grep -q 'syntax is ok' || { echo "nginx -t falla"; exit 1; }
    grep -Eq '^\\s*server_name\\s+dojo.local;' ${HOME}/nginx/nginx.conf || { echo "server_name mal formado"; exit 1; }
    echo "✓ nginx -t OK"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 nginx-syntax`,
    hints: [
      'El typo es "servr_name" donde debería ser "server_name".',
      'nginx -t -c fichero -p prefix valida el fichero SIN arrancar; el out dice "syntax is ok" / "test is successful".',
      `sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 nginx-syntax`,
    ],
    teach: 'nginx -t valida la config SIN arrancar (y NUNCA baila si el puerto está ocupado). Es la primera ética de sysadmin: configtest antes de recarga.',
    cheatsheet: [
      { cmd: 'nginx -t -c fichero -p prefix', desc: 'valida la configuración con prefijo' },
      { cmd: 'sed -i s/a/b/ f', desc: 'corrige el typo en línea' },
    ],
    keywords: ['nginx', '-t', 'configura', 'validación'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'nginx: syntax is ok\nnginx: test is successful\n✓ nginx -t OK\nFLAG{…}' }],
  },
  {
    index: 8, title: 'El servicio en el puerto', subtitle: 'nginx: cambia el listen del server',
    xp: 75, difficulty: 4,
    brief: 'El nginx del dojo escucha en el 8081; el DEPLOY dicta el 8099. Cambia el listen del bloque server.',
    goal: 'En /home/agent/nginx/nginx.conf (nivel nginx-port): cambia la línea listen 127.0.0.1:8081; por listen 127.0.0.1:8099; y valida con nginx -t. Luego dojo-verificar2 nginx-port.',
    setup: () => `
mkdir -p ${HOME}/nginx/logs ${HOME}/nginx/html ${HOME}/nginx/tmp/body ${HOME}/nginx/tmp/proxy ${HOME}/nginx/tmp/fastcgi ${HOME}/nginx/tmp/uwsgi ${HOME}/nginx/tmp/scgi
printf '%s\\n' '<h1>dojo</h1>' > ${HOME}/nginx/html/index.html
cat > ${HOME}/nginx/nginx.conf <<EOF
pid  logs/nginx.pid;
worker_processes  1;
error_log  logs/error.log;
events { worker_connections 16; }
http {
  access_log  logs/access.log;
  client_body_temp_path  /home/agent/nginx/tmp/body;
  proxy_temp_path        /home/agent/nginx/tmp/proxy;
  fastcgi_temp_path      /home/agent/nginx/tmp/fastcgi;
  uwsgi_temp_path        /home/agent/nginx/tmp/uwsgi;
  scgi_temp_path         /home/agent/nginx/tmp/scgi;
  server {
    server_name dojo.local;
    listen 127.0.0.1:8081;
    root html;
    index index.html;
  }
}
EOF
chown -R agent:agent ${HOME}/nginx
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
CHECK=$(cat <<'CHECK'
#!/bin/bash
case "$1" in
  nginx-port)
    grep -Eq '^\\s*listen\\s+127\\.0\\.0\\.1:8099;' ${HOME}/nginx/nginx.conf || { echo "falta listen 127.0.0.1:8099"; exit 1; }
    nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ 2>&1 | grep -q 'syntax is ok' || { echo "nginx -t falla"; exit 1; }
    echo "✓ puerto 8099 configurado"; cat /var/.dojo-hit ;;
esac
CHECK
)
echo "$CHECK" > /usr/local/bin/dojo-verificar2 && chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `sed -i "s/127.0.0.1:8081/127.0.0.1:8099/" ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 nginx-port`,
    hints: [
      'La directiva está en el bloque server: listen 127.0.0.1:8081; → listen 127.0.0.1:8099;',
      'Con sed -i + regex con la sustitución y nginx -t + salida verífica.',
      `sed -i "s/127.0.0.1:8081/127.0.0.1:8099/" ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 nginx-port`,
    ],
    teach: 'listen define la tupla IP:PUERTO en la que el server PCIecepta conexiones. Practicar el CAMBIO de puerto + validación es la coreografía real de los deployments.',
    cheatsheet: [
      { cmd: 'nginx -t -c fichero -p prefix', desc: 'validar después del cambio' },
      { cmd: 'sed -i s/vieja/nueva/ f', desc: 'sustitución en línea' },
    ],
    keywords: ['nginx', 'listen', 'puerto', 'validación'],
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ puerto 8099 configurado\nFLAG{…}' }],
  },
  {
    index: 9, title: 'La validación de Apache2', subtitle: 'apache2ctl configtest',
    xp: 70, difficulty: 3,
    brief: 'El Apache del dojo retiró una directiva de un vhost en /etc/apache2/sites-available/dojo.conf: la sintaxis rota. configtest cuenta la verdad.',
    goal: 'Repara /etc/apache2/sites-available/dojo.conf (la directiva DocumentRoot empieza con "DocumentRtl") y valida con sudo apache2ctl configtest; luego ejecuta dojo-verificar2 apache-docroot.',
    setup: () => `
mkdir -p /etc/apache2/sites-available
cat > /etc/apache2/sites-available/dojo.conf <<EOF
<VirtualHost *:8080>
  DocumentRtl /home/agent/site
</VirtualHost>
EOF
sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
mkdir -p ${HOME}/site && printf '%s\\n' '<h1>dojo</h1>' > ${HOME}/site/index.html
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  apache-docroot)
    grep -Eq '^\\s*DocumentRoot\\s+/home/agent/site' /etc/apache2/sites-available/dojo.conf || { echo "falta DocumentRoot"; exit 1; }
    sudo apache2ctl configtest 2>&1 | grep -qi 'Syntax OK' || { echo "configtest falla"; exit 1; }
    echo "✓ apache2 config OK"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `sudo sed -i 's/DocumentRtl/DocumentRoot/' /etc/apache2/sites-available/dojo.conf && sudo apache2ctl configtest && dojo-verificar2 apache-docroot`,
    hints: [
      'El typo: "DocumentRtl" debería ser "DocumentRoot".',
      'La validación: sudo apache2ctl configtest y debería imprimir "Syntax OK".',
      `sudo sed -i 's/DocumentRtl/DocumentRoot/' /etc/apache2/sites-available/dojo.conf && sudo apache2ctl configtest && dojo-verificar2 apache-docroot`,
    ],
    teach: 'apache2ctl configtest (o apachectl -t) valida TODA la config del apache: los vhosts, los módulos y los DocumentRoot. Si falla, el out muestra LÍNEA Y FICHERO exactos.',
    cheatsheet: [
      { cmd: 'sudo apache2ctl configtest', desc: 'valida toda la config del apache' },
      { cmd: 'ls /etc/apache2/sites-available/', desc: 'lista de vhosts disponibles' },
    ],
    keywords: ['apache2', 'configtest', 'DocumentRoot', 'vhost'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: 'Syntax OK\n✓ apache2 config OK\nFLAG{…}' }],
  },
  {
    index: 10, title: 'El usuario del sistema', subtitle: 'useradd, usermod y /etc/passwd',
    xp: 65, difficulty: 3,
    brief: 'El dojo tiene un NUEVO LIMPIEZA (cuidados de casa) login: el usuario instructor debe EXISTIR, con home y shell /bin/bash.',
    goal: 'Crea el usuario instructor con home /home/instructor y shell /bin/bash (sudo useradd -m -s /bin/bash instructor); luego dojo-verificar2 useradd.',
    setup: () => `
id instructor &>/dev/null && sudo userdel -r instructor 2>/dev/null || true
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  useradd)
    id instructor &>/dev/null || { echo "el usuario instructor no existe"; exit 1; }
    grep -E '^instructor:' /etc/passwd | grep -q /home/instructor || { echo "falta -m (home)"; exit 1; }
    grep -E '^instructor:' /etc/passwd | grep -q '/bin/bash' || { echo "falta -s /bin/bash"; exit 1; }
    echo "✓ usuario instructor listado"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `sudo useradd -m -s /bin/bash instructor && dojo-verificar2 useradd`,
    hints: [
      'useradd -m crea la HOME, -s asigna el shell.',
      'El verificador busca instructor en /etc/passwd CON /home/instructor y /bin/bash.',
      `sudo useradd -m -s /bin/bash instructor && dojo-verificar2 useradd`,
    ],
    teach: 'useradd -m -s maneja usuarios del sistema sin interacción (la alternativa interactiva es adduser). /etc/passwd es la fuente de la verdad: el final deler: la HOME en /home/NAME y el shell /bin/bash apuntados por la fila.',
    cheatsheet: [
      { cmd: 'sudo useradd -m -s /bin/bash nombre', desc: 'usuario con home y shell' },
      { cmd: 'id nombre', desc: 'verificar que existe el usuario' },
      { cmd: 'grep nombre /etc/passwd', desc: 'fila exacta del usuario' },
    ],
    keywords: ['useradd', 'usuarios', '/bin/bash', 'sysadmin'],
    profile: 'sudo',
    examples: [{ title: 'salida esperada (flag demo)', content: '✓ usuario instructor listo\nFLAG{…}' }],
  },
  {
    index: 11, title: 'El binario en tus manos', subtitle: 'file, ldd y sha256sum',
    xp: 70, difficulty: 3,
    brief: 'El MAESTRO quiere que reconozcas un binario SIN abrirlo: que tipo es, qué librerías usa y qué SHA256 tiene. La tríada real.',
    goal: 'Ejecuta: file /bin/cat; ldd /bin/cat; sha256sum /bin/cat (en SERIIE, sin filtros) y luego dojo-verificar2 binary.',
    setup: () => `
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  binary)
    echo "✓ inspected los datos del binario /bin/cat"
    cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `file /bin/cat; ldd /bin/cat; sha256sum /bin/cat; dojo-verificar2 binary`,
    hints: [
      'file imprime el TIPO de fichero (ELF 64-bit LSB executable, dynamically linked…).',
      'ldd imprime las LIBRERÍAS compartidadas que el binario va a necesitar.',
      'sha256sum imprime un HASH ÚNICO: la "firma digital" del binario.',
      `file /bin/cat; ldd /bin/cat; sha256sum /bin/cat; dojo-verificar2 binary`,
    ],
    teach: 'La tríada file + ldd + sha256sum responde: QUÉ ES, QUÉ NECESITA y SI ES EL MISMO (hash). Es el pre-check del DOJO ante un binario desconocido y la validación primero de los paquetes sin cambiar nada.',
    cheatsheet: [
      { cmd: 'file binario', desc: 'qué tipo de binario es' },
      { cmd: 'ldd binario', desc: 'librerías compartidas que usa' },
      { cmd: 'sha256sum binario', desc: 'hash SHA del binario' },
    ],
    keywords: ['binario', 'file', 'ldd', 'sha256sum'],
    examples: [{ title: 'salida esperada (flag demo)', content: '/bin/cat: ELF 64-bit…\n    libc.so.6 => /lib…\nabc…  /bin/cat\nFLAG{…}' }],
  },
  {
    index: 12, title: 'El espejo de los procesos', subtitle: 'ps aux y filtrado de PID',
    xp: 70, difficulty: 4,
    brief: 'El dojo quiere VER SUS PROCESOS in caestel: que realmenTE WATCHES sudo sshd estén en ejecución y descubrir el PID.',
    goal: 'Busca los procesos sshd con ps aux; el PID debería ser el DE SPOTTER del pid de sshd: ejecuta DOJO pid file: cat /var/dojo/sshd.pid. EL PID SIEMPRE SE Muestra en la salida (con ps aux).',
    setup: () => `
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  ps-aux) echo "✓ proceso sshd listado"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2
/usr/sbin/sshd -o "Port 2207" 2>/dev/null || true
echo $(pgrep -x sshd | head -n 1) > /var/dojo/sshd.pid
chown agent:agent /var/dojo/sshd.pid`,
    solution: `ps aux | grep -w sshd; cat /var/dojo/sshd.pid; dojo-verificar2 ps-aux`,
    hints: [
      'ps aux lista TODOS los procesos con el USER, el PID y el COMANDO completos.',
      'Con pgrep -x sshd verificas el PID real; no es necesario para el nivel, pero valida el PID por cat.',
      `ps aux | grep -w sshd; cat /var/dojo/sshd.pid; dojo-verificar2 ps-aux`,
    ],
    teach: 'ps aux es la VENTANA donde ipramos qué procesos están vivos: getpid: UID, PID, %CPU, memoria, CMD. Combinado con grep, es la base de todo el diagnóstico del cansancio de los sistemas.',
    cheatsheet: [
      { cmd: 'ps aux | grep proceso', desc: 'procesos con nombre concisos' },
      { cmd: 'pgrep -x sshd', desc: 'PID por nombre exacto' },
    ],
    keywords: ['ps', 'sshd', 'procesos', 'PID'],
    examples: [{ title: 'salida esperada (flag demo)', content: '…root … sshd ...\n1234\n✓ proceso sshd listado\nFLAG{…}' }],
  },
  {
    index: 13, title: 'El depurador del log', subtitle: 'archivo de LOG de sshd (journalctl simulado)',
    xp: 70, difficulty: 4,
    brief: 'El dojo guarda UN COPY del log del sshd en /var/log/dojo-ssh.log. Hay UNA línea con UNA dirección IP del atacante… y también la firma.',
    goal: 'Del fichero /var/log/dojo-ssh.log, escribe la LÍNEA que contiene la palabra ALERTA (una sola; usas grep). Después dojo-verificar2 log-ssh.',
    setup: () => `
mkdir -p /var/log
cat > /var/log/dojo-ssh.log <<EOF
2026-10-24 09:00 sshd: server started on port 2200
2026-10-24 09:05 sshd: auth OK agent
2026-10-24 09:10 ALERTA sshd: intento de login desde la IP extraña, la firma: ${'$'}DOJO_FLAG
2026-10-24 09:15 sshd: nic sp ese
EOF
chmod 0644 /var/log/dojo-ssh.log
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  log-ssh) echo "✓ log leído"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `grep 'ALERTA' /var/log/dojo-ssh.log; dojo-verificar2 log-ssh`,
    hints: [
      'grep ALERTA /var/log/dojo-ssh.log es el SEGURO.',
      'Para leer el log (y no SÓLO la última línea) el comando cat, se usa tail -f... pero el nivel solo pide UNA línea exacta.',
      `grep 'ALERTA' /var/log/dojo-ssh.log; dojo-verificar2 log-ssh`,
    ],
    teach: 'Los logs de servicio son LA fuente de la verdad cuando algo falla (journald log en Ubuntu / más primitivo: ficheros /var/log/*). Buscar un patrón exacto es la primera pasada: grep y leer de la salida.',
    cheatsheet: [
      { cmd: 'grep ERROR /var/log/...log', desc: 'las líneas del ERROR' },
      { cmd: 'tail -f /var/log/...log', desc: 'el fichero en vivo' },
    ],
    keywords: ['log', 'ssh', 'grep', 'diagnóstico'],
    examples: [{ title: 'salida esperada (flag demo)', content: '2026-10-24 09:10 ALERTA … FLAG{…}\n✓ log leído\nFLAG{…}' }],
  },
  {
    index: 14, title: 'El paquete que falta', subtitle: 'dpkg y comando which',
    xp: 65, difficulty: 3,
    brief: 'El usuario pregunta si una herramienta determinada INSTALADA es del sistema: which entrega el binario y dpkg -S el paquete que lo trajo.',
    goal: 'Ejecuta: which curl; dpkg -S $(which curl) (el paquete Debian que instaló el binario curl) y luego dojo-verificar2 package.',
    setup: () => `
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  package) echo "✓ herramientas de sistema CNAB"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `which curl; dpkg -S $(which curl); dojo-verificar2 package`,
    hints: [
      'which CMD imprime el PATH AL binario que se ejecutaría al poner CMD.',
      'dpkg -S /ruta/al/binario revela el PAQUETE npm propietario del fichero.',
      `which curl; dpkg -S $(which curl); dojo-verificar2 package`,
    ],
    teach: 'which + dpkg -S es el (quién es este) paquete del binario. La cadena de comandos $(...) alimenta dpkg -S con la RUTA que which descubrió: idiom de shell puro.',
    cheatsheet: [
      { cmd: 'which cmd', desc: 'ruta del binario' },
      { cmd: 'dpkg -S /usr/bin/cmd', desc: 'a qué paquete pertenece' },
    ],
    keywords: ['dpkg', 'which', 'paquete', 'binario'],
    examples: [{ title: 'salida esperada (flag demo)', content: '/usr/bin/curl\ncurl: /usr/bin/curl\n✓ …\nFLAG{…}' }],
  },
  {
    index: 15, title: 'El espacio en disco', subtitle: 'df + du: medida del espacio',
    xp: 65, difficulty: 3,
    brief: 'El espacio del CONTAINER se mide: df muestra las particiones y du el PESO de un tree. La salida del free no es la misma que la del df (con esta limp__)',
    goal: 'Ejecuta: df -h; du -sh /home/agent; luego dojo-verificar2 diskspace.',
    setup: () => `
mkdir -p ${HOME}/big && echo 'x' > ${HOME}/big/a && dd if=/dev/zero of=${HOME}/big/b bs=1K count=256 2>/dev/null
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  diskspace) echo "✓ espacio medido"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `df -h; du -sh ${HOME}; dojo-verificar2 diskspace`,
    hints: [
      'df -h resume las particiones montadas: df /var/log muestra el uso de UNA partición.',
      'du -sh /path resume el PESO de un árbol ( -s para el total, -h para formato "legible").',
      `df -h; du -sh ${HOME}; dojo-verificar2 diskspace`,
    ],
    teach: 'df (disk free) y du (disk usage) trabajan juntos: df mira el estado del filesystem; du caza el árbol CONSUME. El du -sh PATH es el idiom universal para "¿qué pesa esto?"',
    cheatsheet: [
      { cmd: 'df -h', desc: 'espacio por partición' },
      { cmd: 'du -sh /path', desc: 'peso total de un árbol' },
    ],
    keywords: ['df', 'du', 'disco', 'espacio'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'Filesystem … Used …\n20K /home/agent/big\n✓ …\nFLAG{…}' }],
  },
  {
    index: 16, title: 'El vigía del puerto', subtitle: 'ss: puertos en escucha de sshd',
    xp: 75, difficulty: 4,
    brief: 'El sshd del dojo escucha en un PUERTO NO ESTÁNDAR. Quien quiere accoger, PRIMERO lo dice ss -tln (y ss -tln para la details).',
    goal: 'Con ss -tln, localiza el puerto donde sshd escucha de la guardia (el setup lo pone). Después cat /var/dojo/puerto.txt para confirmar el puerto Y ejecutar dojo-verificar2 port-watch.',
    setup: () => `
true; set +e; pgrep -x sshd | xargs -r kill 2>/dev/null; set -e
p=2207
/usr/sbin/sshd -o "Port $p" 2>/dev/null || true
printf '%s' "$p" > /etc/dojo-port
printf '%s\\n' 'nivel: el puerto de sshd' > /var/dojo/README 2>/dev/null || { mkdir -p /var/dojo; printf '%s\\n' 'nivel sshd-port' > /var/dojo/README; }
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  port-watch)
    pgrep -x sshd || { echo "sshd no está"; exit 1; }
    ss -tln | grep -q "$(cat /etc/dojo-port)" || { echo "sshd NO escucha en el puerto que el setup definió"; exit 1; }
    echo "✓ puerto sshd a la espera"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2
printf '%s\\n' "$(cat /etc/dojo-port)" > /var/dojo/puerto.txt
chmod 0644 /var/dojo/puerto.txt`,
    solution: `ss -tln; cat /var/dojo/puerto.txt; dojo-verificar2 port-watch`,
    hints: [
      'ss -tln muestra los puertos TCP TCP a la escucha: LOCAL ADDRESS:PORT y proceso (con p) y pid.',
      'El puerto es un 2XXX non estándar: cat /var/dojo/puerto.txt lo confirma.',
      `ss -tln; cat /var/dojo/puerto.txt; dojo-verificar2 port-watch`,
    ],
    teach: 'La cadena ss -tln | grep puerto es el JUNTADOR de los nuevos administradores: revisar QUÉ ESCUCHA, EN QUÉ PUERTO, ANTES DE ABRIR CUALQUIER COSA. El puerto exacto se suele documentar a la par.',
    cheatsheet: [
      { cmd: 'ss -tln', desc: 'puntos de escucha TCP' },
      { cmd: 'ss -tlnp', desc: 'idem MÁS el proceso (root)' },
    ],
    keywords: ['ss', 'puerto', 'escucha', 'sshd'],
    examples: [{ title: 'salida esperada (flag demo)', content: '…LISTEN 0 … xxx:2207 …' }],
  },
  {
    index: 17, title: 'El cerrado correcto', subtitle: 'systemctl status / procps',
    xp: 75, difficulty: 4,
    brief: 'En este dojo NO hay systemd ejecutable, pero PROCPS registra el estado de un proceso en /proc/<pid>: leerlo es ver el servicio de verdad.',
    goal: 'Encuentra el PID de sshd con pgrep -x sshd (LUEGO cat /proc/PID/comm). Después cat /var/dojo/pid.txt para CONFIRMAR EL PID Ydojo-verificar2 comm-check.',
    setup: () => `
mkdir -p /var/dojo
pid=$(pgrep -x sshd | head -n 1)
[ -n "$pid" ] || { /usr/sbin/sshd 2>/dev/null || true; pid=$(pgrep -x sshd | head -n 1); }
printf '%s\\n' "$pid" > /var/dojo/pid.txt
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
chown agent:agent /var/dojo/pid.txt
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  comm-check)
    p=$(cat /var/dojo/pid.txt)
    read -r comm < /proc/$p/comm 2>/dev/null
    [ "$comm" == "sshd" ] || { echo "el proceso $p NO es sshd"; exit 1; }
    echo "✓ PID $p es sshd"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2`,
    solution: `pid=$(pgrep -x sshd | head -n 1); cat /proc/$pid/comm; cat /var/dojo/pid.txt; dojo-verificar2 comm-check`,
    hints: [
      'pgrep -x sshd entrega el PID (solo uno).',
      '/proc/PID/comm es el NOMBRE COURSO del proceso (sin path): cat /proc/1234/comm imprime sshd.',
      `pid=$(pgrep -x sshd | head -n 1); cat /proc/$pid/comm; cat /var/dojo/pid.txt; dojo-verificar2 comm-check`,
    ],
    teach: '/proc es el sistema de ficheros VIVO del kernel: /proc/PID/comm, status, cmdline… son el instrumento óseo de cualquier introspección de procesos. systemctl solo es la CARA PRETTY de lo mismo.',
    cheatsheet: [
      { cmd: 'pgrep -x sshd', desc: 'PID del proceso sshd' },
      { cmd: 'cat /proc/PID/comm', desc: 'nombre del proceso en el cnt' },
    ],
    keywords: ['proc', 'pid', 'sshd', 'proceso'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'sshd\n1234\n✓ PID 1234 es sshd\nFLAG{…}' }],
  },
  {
    index: 18, title: 'Boss final sysadmin', subtitle: 'ssh key + copy nginx -t + apache2ctl + log',
    xp: 170, difficulty: 5,
    brief: 'El acumulado: generar CLAVE, validar SSHD, configurar NGINX, revisar APACHE y BUscar en el log del servicio. La graduación sysadmin.',
    goal: 'Crea un par SSH ED25519 en ~/.ssh/id_ed25519, REPARA el typo de nginx.conf (servr_name) en /home/agent/nginx/nginx.conf, VALIDA nginx con nginx -t y ejecuta (en orden) dojo-verificar2 sysadmin-boss.',
    setup: () => `
mkdir -p ${HOME}/nginx/logs ${HOME}/nginx/html ${HOME}/nginx/tmp/body ${HOME}/nginx/tmp/proxy ${HOME}/nginx/tmp/fastcgi ${HOME}/nginx/tmp/uwsgi ${HOME}/nginx/tmp/scgi /home/agent/.ssh
printf '%s\\n' '<h1>dojo</h1>' > ${HOME}/nginx/html/index.html
cat > ${HOME}/nginx/nginx.conf <<EOF
pid  logs/nginx.pid;
worker_processes  1;
error_log  logs/error.log;
events { worker_connections 16; }
http {
  access_log  logs/access.log;
  client_body_temp_path  /home/agent/nginx/tmp/body;
  proxy_temp_path        /home/agent/nginx/tmp/proxy;
  fastcgi_temp_path      /home/agent/nginx/tmp/fastcgi;
  uwsgi_temp_path        /home/agent/nginx/tmp/uwsgi;
  scgi_temp_path         /home/agent/nginx/tmp/scgi;
  server {
    servr_name  dojo.local;
    listen 127.0.0.1:8081;
    root html;
    index index.html;
  }
}
EOF
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit
cat > /usr/local/bin/dojo-verificar2 <<'CHECK'
#!/bin/bash
case "$1" in
  sysadmin-boss)
    [ -f $HOME/.ssh/id_ed25519 ] || { echo "falta la clave privada"; exit 1; }
    ssh-keygen -y -f $HOME/.ssh/id_ed25519 >/dev/null 2>&1 || { echo "la clave no es válida"; exit 1; }
    grep -Eq '^\\s*server_name\\s+' ${HOME}/nginx/nginx.conf || { echo "nginx.conf sin server_name"; exit 1; }
    nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ 2>&1 | grep -q 'syntax is ok' || { echo "nginx -t falla"; exit 1; }
    echo "✓ ssh-key y nginx OK (boss superado)"; cat /var/.dojo-hit ;;
esac
CHECK
chmod 0755 /usr/local/bin/dojo-verificar2
chmod 700 ${HOME}/.ssh && chown -R agent:agent ${HOME}/nginx ${HOME}/.ssh`,
    solution: `ssh-keygen -t ed25519 -N "" -f $HOME/.ssh/id_ed25519 >/dev/null && chmod 600 $HOME/.ssh/id_ed25519 && sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 sysadmin-boss`,
    hints: [
      'Clave: ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 ; permisos 600.',
      'nginx: sed -i s/typo y luego nginx -t -c … -p … con na predicción "syntax is ok".',
      `ssh-keygen -t ed25519 -N "" -f $HOME/.ssh/id_ed25519 >/dev/null && chmod 600 $HOME/.ssh/id_ed25519 && sed -i 's/servr_name/server_name/' ${HOME}/nginx/nginx.conf && nginx -t -c ${HOME}/nginx/nginx.conf -p ${HOME}/nginx/ && dojo-verificar2 sysadmin-boss`,
    ],
    teach: 'El cierre de sysadmin asienta EL FLUJO DE TRABAJO REAL: generar credenciales → tocar la config → valid测评 (configtest) → servir. Nada de arrancar a ciegas: prima el VALIDAR > probar.',
    cheatsheet: [
      { cmd: 'ssh-keygen -t ed25519 ... && chmod 600', desc: 'claves SSH del cero' },
      { cmd: 'nginx -t -c fich -p dir', desc: 'validación nginx en dir' },
    ],
    keywords: ['boss', 'ssh', 'nginx', 'configtest'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'nginx: syntax is ok\n✓ ssh-key y nginx OK (boss superado)\nFLAG{…}' }],
  },
];

/* ════════════════════════════════════════════════════════════════════ DNS ══ */
const DNS = [
  {
    index: 1, title: 'La primera consulta', subtitle: 'dig: consulta A básica',
    xp: 55, difficulty: 2,
    brief: 'El dojo tiene un servidor DNS excluísta en 127.0.0.1:53535 (dnsmasq). La PRIMERA consulta de cualquier sysadmin es simple: "¿qué símbolo tiene este nombre?"',
    goal: 'Consulta el registro A del dominio app.dojo contra 127.0.0.1 -p 53535 y "lee" la respuesta. Después, consulta TXT del dominio secreto.dojo (el mismo servidor): ahí está la firma.',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --address=/app.dojo/10.20.30.40 \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG \\
  --txt-record=marcador.dojo,un-valor-de-relleno >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53535 app.dojo A; dig +short TXT secreto.dojo @127.0.0.1 -p 53535`,
    hints: [
      'dig @servidor -p puerto nombre TIPO. Con @127.0.0.1 -p 53535 consultas a este servidor local.',
      'La primera parte: dig @127.0.0.1 -p 53535 app.dojo A (el ANSWER dice 10.20.30.40).',
      'La firma va en un registro TXT del dominio secreto.dojo: dig +short TXT secreto.dojo @127.0.0.1 -p 53535.',
      `dig @127.0.0.1 -p 53535 app.dojo A; dig +short TXT secreto.dojo @127.0.0.1 -p 53535`,
    ],
    teach: 'dig es EL cliente DNS de diagnóstico: @servidor consulta a UNA servidor concreto y TIPO el tipo de registro (A, TXT, MX…). +short te lo mete en modo uno por línea (y es perfecto para pipelines).',
    cheatsheet: [
      { cmd: 'dig @serv -p pu nombre TIPO', desc: 'consulta DNS a un servidor/puerto' },
      { cmd: 'dig +short name tipo', desc: 'respuesta SOLO en texto delineado' },
    ],
    keywords: ['dns', 'dig', 'A', 'TXT', 'dnsmasq'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'app.dojo. 0 IN A 10.20.30.40\nFLAG{d3b09a4f7c2e1b8d6041a5f3}' }],
  },
  {
    index: 2, title: 'El registro del correo', subtitle: 'dig MX: los intercambiadores',
    xp: 60, difficulty: 3,
    brief: 'Un dominio de correo realmente responde con los MX (los servidores de correo) y la prioridad (el número más pequeño es el PRIMERO).',
    goal: 'Consulta el registro MX del dominio correo.dojo (servidor 127.0.0.1 -p 53535) Y luego consulta el TXT del dominio secreto.dojo (la firma del nivel).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --mx-host=correo.dojo,mail.correo.dojo,10 \\
  --txt-record=mail.correo.dojo,MX-bueno-y-activo \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53535 correo.dojo MX; dig @127.0.0.1 -p 53535 TXT secreto.dojo +short`,
    hints: [
      'dig @… -p 53535 correo.dojo MX la respuesta dice mail.correo.dojo (priority 10).',
      'Después el TXT de secreto.dojo (mismo servidor) para la firma.',
      `dig @127.0.0.1 -p 53535 correo.dojo MX; dig @127.0.0.1 -p 53535 TXT secreto.dojo +short`,
    ],
    teach: 'el registro MX apunta a los MAIL EXCHANGERS: el nombre del host y la PRIORIDAD (la menor gana). Son la mitad del correo: el envío es un look-up MX antes de la conexión SMTP.',
    cheatsheet: [
      { cmd: 'dig dominio.com MX', desc: 'registro MX de un dominio' },
      { cmd: 'dig +short MX dominio', desc: 'respuesta MX en corto' },
    ],
    keywords: ['dns', 'dig', 'MX', 'correo'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'correo.dojo. 0 IN MX 10 mail.correo.dojo.\nFLAG{…}' }],
  },
  {
    index: 3, title: 'El reverso del espejo', subtitle: 'dig -x: consulta inversa (PTR)',
    xp: 65, difficulty: 4,
    brief: 'La consulta INVERSA hace el revés: le das UNA IP y el DNS te devuelve el NOMBRE. Después, si el NOMBRE tiene un TXT… la firma reaparece.',
    goal: 'Con dig -x, resuelve la IP 10.20.30.40 contra el servidor local (reverse=PTR). Ya que tienes el NOMBRE que devuelve, consulta el TXT DE ESE NOMBRE (la firma va en ese TXT del nombre).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --host-record=secreto-dojo,10.20.30.40 \\
  --txt-record=secreto-dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `nombre=$(dig +short -x 10.20.30.40 @127.0.0.1 -p 53535 | grep -v '^$' | head -n 1); dig +short TXT $nombre @127.0.0.1 -p 53535`,
    hints: [
      'dig +short -x IP consulta el PTR (la respuesta es el NOMBRE propietario de esa IP).',
      'El nombre devuelto es el que lleva el TXT: guárdalo con $(dig +short -x …) y lanza el TXT.',
      `nombre=\$(dig +short -x 10.20.30.40 @127.0.0.1 -p 53535 | grep -v '^$' | head -n 1); dig +short TXT \$nombre @127.0.0.1 -p 53535`,
    ],
    teach: 'dig -x HOSTREV: consulta INVERSA de DNS; sirve para identificar a los hostnames de las máquinas que apuntan a la IP (son los famosos rDNS de producción). El patrón comandante: primer PTR, luego TXT/A del nombre que sale.',
    cheatsheet: [
      { cmd: 'dig +short -x IP', desc: 'el nombre de una IP (PTR)' },
      { cmd: 'dig TXT nombre', desc: 'el TXT de ese nombre' },
    ],
    keywords: ['dns', 'dig', '-x', 'PTR', 'reverso'],
    examples: [{ title: 'salida esperada (flag demo)', content: '40.30.20.10.in-addr.arpa domain name pointer secreto-dojo.\nFLAG{…}' }],
  },
  {
    index: 4, title: 'Lo que no existe', subtitle: 'dig y NXDOMAIN: interpretación del的状态',
    xp: 60, difficulty: 3,
    brief: 'El DNS no solo devuelve datos: también dice cuando ALGO NO existe (NXDOMAIN y auth=). Saber leer la sección STATUS es EMATAR al diagnóstico.',
    goal: 'Consulta el TXT de a-nombre-que-NO-EXIXTE.dojo (verás el estado NXDOMAIN), luego consulta el TXT de sec betrachtet.dojo (el ANSIKA has la firma).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --txt-record=secreto-dojo.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53535 fantasma.dojo TXT; dig +short TXT secreto-dojo.dojo @127.0.0.1 -p 53535`,
    hints: [
      'La NO-EXISTENCIA: el status section dice NXDOMAIN; el dominio fantasma.dojo NO está en la zona.',
      'El dominio real (con la firma) es secreto-dojo.dojo (¡nofollows OJO al nombre!).',
      `dig @127.0.0.1 -p 53535 fantasma.dojo TXT; dig +short TXT secreto-dojo.dojo @127.0.0.1 -p 53535`,
    ],
    teach: 'La sección de ESTADO de dig (NXDOMAIN, NOERROR, SERVFAULT) es la más importante al diagnosticar. La lectura de "status: status: NXDOMAIN" es la señal clásica de un typo en el dominio.',
    cheatsheet: [
      { cmd: 'dig name TIPO', desc: 'el ESTADO responde en la sección' },
      { cmd: 'dig +noall +comments', desc: 'solo la parte de estado' },
    ],
    keywords: ['dns', 'dig', 'NXDOMAIN', 'estado'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'status: NXDOMAIN\n\nFLAG{…}' }],
  },
  {
    index: 5, title: 'El TXT con TCP', subtitle: 'dig +tcp: forzar el transporte TCP',
    xp: 70, difficulty: 4,
    brief: 'El DNS por defecto usa UDP; el +tcp lo fuerza a TCP (utilísimo para las respuestas grandes y para testear firewalls).',
    goal: 'Consulta el TXT de secreto.dojo contra el servidor local, FORZANDO el uso de TCP (+tcp en dig). Después, repite la consulta SIN +tcp (transporte UDP) para VER que el resultado ES EL MISMO (la misma firma).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig +tcp @127.0.0.1 -p 53535 TXT secreto.dojo +short; dig @127.0.0.1 -p 53535 TXT secreto.dojo +short`,
    hints: [
      'dig +tcp hace la query por TCP (aunque acepta todas las respuestas de UDP, el unico trasporte conjugado es TCP).',
      'Ambas consultas ([TCP] y la [UDP] normal) deben devolver la MISMA firma.',
      `dig +tcp @127.0.0.1 -p 53535 TXT secreto.dojo +short; dig @127.0.0.1 -p 53535 TXT secreto.dojo +short`,
    ],
    teach: 'El DNS nativo es UDP con TCP para las respuestas/port >512 BYTES. dig +tcp simula la cap de los FIML\'S firewalls que cortan UDP→53: la consulta debe responder IGUAL.',
    cheatsheet: [
      { cmd: 'dig +tcp name tipo', desc: 'consulta sobre TCP' },
      { cmd: 'dig +udp name tipo', desc: 'consulta UDP (el default)' },
    ],
    keywords: ['dns', 'dig', '+tcp', 'udp'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}\nFLAG{…} (mismo resultado que por TCP)' }],
  },
  {
    index: 6, title: 'El fichero de resolutores', subtitle: '/etc/resolv.conf + getent hosts',
    xp: 70, difficulty: 4,
    brief: 'Cuando un programa resuelve un nombre (getent, ssh, curl...) consulta el PRIMER nameserver de /etc/resolv.conf. El setup ya arranca un dnsmasq en el PUERTO 53 y apunta resolv.conf hacia él: tu máquina ahora tiene DNS local.',
    goal: 'Muestra cat /etc/resolv.conf (el nameserver configurado), resuelve el A de app.dojo con getent hosts app.dojo (viaja por el resolver local) y trae el TXT de app.dojo con dig +short TXT app.dojo (sin @: dig usa /etc/resolv.conf).',
    setup: () => `
true; set +e; pgrep dnsmasq | xargs -r kill 2>/dev/null; set -e
dnsmasq --port=53 --no-hosts --no-resolv --bind-interfaces \\
  --address=/app.dojo/10.20.30.40 \\
  --address=/api.dojo/10.20.30.41 \\
  --txt-record=app.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1
printf '%s\\n' '# nivel dns-l6: resolver local del dojo' 'nameserver 127.0.0.1' > /etc/resolv.conf`,
    solution: `cat /etc/resolv.conf; getent hosts app.dojo; dig +short TXT app.dojo`,
    hints: [
      'getent hosts app.dojo pregunta al nameserver de /etc/resolv.conf (127.0.0.1:53) y devuelve la IP del ANSWER.',
      'dig SIN @ consulta el mismo resolver: dig +short TXT app.dojo imprime la firma.',
      `cat /etc/resolv.conf; getent hosts app.dojo; dig +short TXT app.dojo`,
    ],
    teach: '/etc/resolv.conf es el mapa de resolutores de tu máquina: SIN él, el resolver no sabe a quién preguntar. getent hosts es la llamada C que hacen curl/ssh/ping; dig sin @ usa el mismo fichero. Cambiar nameserver = cambiar quién resuelve.',
    cheatsheet: [
      { cmd: 'cat /etc/resolv.conf', desc: 'ver tus nameservers' },
      { cmd: 'getent hosts dominio', desc: 'resolución vía nsswitch' },
      { cmd: 'dig +short TXT dominio', desc: 'TXT vía el resolver por defecto' },
    ],
    keywords: ['dns', 'resolv.conf', 'getent', 'dig', 'resolver'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'nameserver 127.0.0.1\n10.20.30.40    app.dojo\nFLAG{…}' }],
  },
  {
    index: 7, title: 'El selector de secciones', subtitle: 'dig +noall +answer: solo la respuesta',
    xp: 65, difficulty: 3,
    brief: 'La salida dig es un DESPEJE (secciones: status, ANSWER, AUTHORITY). Con +noall +answer solo la ANSWERSe JOINS.',
    goal: 'Get the TXT of secreto.dojo (o el nombre del servidor DNS del dojo) con +noall +answer (SOLO la sección ANSWER, SIN otras). El ANSWER lleva la firma.',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53535 TXT secreto.dojo +noall +answer`,
    hints: [
      '+noall apaga TODAS las secciones; +answer re-encierra SOLO la ANSWER.',
      'El TXT está en la primera +answer (con todo el resto encerrado).',
      `dig @127.0.0.1 -p 53535 TXT secreto.dojo +noall +answer`,
    ],
    teach: '+noall +answer es LA forma de escribir la salida de dig en un modo limpio una línea (scripts, monitors, completas). Cualquier señal "meanwhile"OA= quese o se JOINS se ve de la sección pipe.',
    cheatsheet: [
      { cmd: 'dig +noall +answer nombre tipo', desc: 'clara: SOLO answer' },
      { cmd: 'dig +noall +stats', desc: 'solo el ESTADO (stats)' },
    ],
    keywords: ['dns', 'dig', 'noall', 'answer'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'secreto.dojo. 0 IN TXT "FLAG{…}"' }],
  },
  {
    index: 8, title: 'El archivo de host', subtitle: 'dig sobre el /etc/hosts (nsswitch files)',
    xp: 70, difficulty: 4,
    brief: 'ANTES de DNS, la libc consulta /etc/hosts (nsswitch: files). El dojo HACE una entrada específica (la firma de la línea 2).',
    goal: 'De /home/agent/hosts-extra (la COPIA del /etc/hosts, ya preparada por el setup), saca la dirección IP del dominio secreto-dojo (un A record) Y luego ejecuta getent hosts secreto-dojo para VER que la libc la resuelve por HOSTS.',
    setup: () => `
cat > ${HOME}/hosts-extra <<EOF
127.0.0.1 localhost
10.30.40.50 secreto-dojo
10.30.40.51 decoy-host
EOF
chmod 0644 ${HOME}/hosts-extra
cat ${HOME}/hosts-extra > /etc/hosts
printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit
chmod 0644 /var/.dojo-hit`,
    solution: `grep 'secreto-dojo' ${HOME}/hosts-extra; getent hosts secreto-dojo; cat /var/.dojo-hit`,
    hints: [
      'grep secreto-dojo $HOME/hosts-extra muestra la entrada y la marca que dejó el dojo.',
      'getent hosts secreto-dojo mira /etc/hosts (nsswitch: files) ANTES de cualquier DNS.',
      `grep 'secreto-dojo' ${HOME}/hosts-extra; getent hosts secreto-dojo; cat /var/.dojo-hit`,
    ],
    teach: 'La RESOLUCIÓN de nombres sigue un ORDEN (nsswitch): primero files (/etc/hosts), luego dns. /etc/hosts es el DNS BAJAR del proceso local, y por eso debe procesarse antes que cualquier consulta por red.',
    cheatsheet: [
      { cmd: 'getent hosts dominio', desc: 'resuelve por hosts → dns' },
      { cmd: 'grep dominio /etc/hosts', desc: 'el contenido del archivo hosts' },
    ],
    keywords: ['hosts', 'getent', 'resolución', 'nsswitch'],
    examples: [{ title: 'salida esperada (flag demo)', content: '10.30.40.50    secreto-dojo\nFLAG{…} (si el usuario es root)' }],
  },
  {
    index: 9, title: 'El registro del DNS forense', subtitle: 'log de dnsmasq con los queries',
    xp: 75, difficulty: 4,
    brief: 'El servidor del dojo LOGEA TODAS las queries. Hay UNA línea con la firma del ataque en /var/log/dns-log-marca.log.',
    goal: 'Lanzar UNA consulta por DNS hacia el servidor local (dig @… -p 53535 app.dojo) Y luego extraer del /var/log/dns-log-marca.log (con grep) la línea que menciona app.dojo (la marcará la firma).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces --log-queries --log-facility=/var/log/dns-log-marca.log \\
  --address=/app.dojo/10.20.30.40 \\
  --txt-record=app.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1
chmod 0664 /var/log/dns-log-marca.log 2>/dev/null || true`,
    solution: `dig @127.0.0.1 -p 53535 app.dojo; dig @127.0.0.1 -p 53535 TXT app.dojo +short; grep 'app.dojo' /var/log/dns-log-marca.log | head -n 6`,
    hints: [
      'La consulta: dig @127.0.0.1 -p 53535 app.dojo. Después, grep app.dojo en el log.',
      'La firma viaja en un TXT: dig @127.0.0.1 -p 53535 TXT app.dojo +short la imprime.',
      `dig @127.0.0.1 -p 53535 app.dojo; dig @127.0.0.1 -p 53535 TXT app.dojo +short; grep 'app.dojo' /var/log/dns-log-marca.log | head -n 6`,
    ],
    teach: 'dnsmasq --log-queries guarda TODAS las queries al log: es el modo de AUDIT del DNS de una red pequeña. Al revisarlo, detectas dominios raros exfiltrando datos por DNS (el clásico C2 de 101).',
    cheatsheet: [
      { cmd: 'dig @serv name', desc: 'hago la consulta que quedará en el log' },
      { cmd: 'grep dominio /var/log/dns.log', desc: 'el query del log' },
    ],
    keywords: ['dns', 'log', 'dnsmasq', 'forense', 'audit'],
    examples: [{ title: 'salida esperada (flag demo)', content: '…[127.0.0.1] query[A] app.dojo from 127.0.0.1 (incluye la respuesta del TXT con la flag)' }],
  },
  {
    index: 10, title: 'El peso del nombre', subtitle: 'dig ANY: los registros JUNTOS',
    xp: 70, difficulty: 4,
    brief: 'La consulta ANY intenta AGARRAR todos los tipo de registro de un nombre. En dnsmasq-es, la respuesta devuelve TODOS los tipos que conozca.',
    goal: 'Consulta el registro ANY de secreto.dojo (o del nombre del servidor local). ALL las respuestas incluyen la TXT con la FIRMA y el resto de los registros (A/AAAA) de decoración.',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --host-record=secreto.dojo,10.20.30.42 \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53535 ANY secreto.dojo`,
    hints: [
      'dig ANY secreto.dojo (o ALL en elock) pide TODOS los registro de la zona para el nmombre.',
      'dnsmasq devolverá A + TXT juntitos; la firma va en el TXT.',
      `dig @127.0.0.1 -p 53535 ANY secreto.dojo`,
    ],
    teach: 'ANY es una instrucción que quiere TODOS los registros de un dominio en una sóla respuesta. útil para el registro completo (con EXCEPción de datos sensibles).',
    cheatsheet: [
      { cmd: 'dig ANY name', desc: 'todos los tipos conocidos' },
      { cmd: 'dig ANY +short name', desc: 'respuesta de ANY en una pasada' },
    ],
    keywords: ['dns', 'dig', 'ANY', 'registro'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'secreto.dojo. 0 IN A 10.20.30.42\nsecreto.dojo. 0 IN TXT "FLAG{…}"' }],
  },
  {
    index: 11, title: 'El puerto libre', subtitle: 'dig a un SERVIDOR de otra puerta',
    xp: 70, difficulty: 4,
    brief: 'En el dojo hay UN server DNS en 127.0.0.1:53537 EN otro puerto no estándar (la firma viaja en un TXT pero SOLO en el server de ESE puerto).',
    goal: 'Consulta el TXT de secreto.dojo EIXTENTEN el servidor 127.0.0.1 -p 53537 (dig a otro puerto).',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*5353' 2>/dev/null; set -e
dnsmasq --port=53537 --no-resolv --bind-interface \\
  --txt-record=secreto.dojo,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `dig @127.0.0.1 -p 53537 TXT secreto.dojo +short`,
    hints: [
      'Es el patrón EXACTO del nivel 1 de este canal, pero con un puerto DIFERENTE (53537 en vez de 53535).',
      'recuerda: dig @HOST -p PUERTO TXT nombre +short.',
      `dig @127.0.0.1 -p 53537 TXT secreto.dojo +short`,
    ],
    teach: 'El páuis de dig es @HOST -p PUERTO nombre TIPO: cambia el servidor, cambia el puerto, cambia el tipo. La repetición de las CUATRO puestas es lo que hace el flujo meticulos.',
    cheatsheet: [
      { cmd: 'dig @host -p puerto TXT name', desc: 'consulta a un puerto no estándar' },
      { cmd: 'dig +short …', desc: 'el out ni canal de sort' },
    ],
    keywords: ['dns', 'dig', 'puerto', 'TXT'],
    examples: [{ title: 'salida esperada (flag demo)', content: '"FLAG{…}"' }],
  },
  {
    index: 12, title: 'Boss DNS', subtitle: 'la cadena completa de DNS',
    xp: 160, difficulty: 5,
    brief: 'El combo ENTRE el reverse-lookup (dig -x), el TXT del nombre (dig +short TXT) y la conversión del DOMINIO a la IP (dance getent). La graduación del DNS de comandos.',
    goal: 'Paso 1: dig +short -x 10.20.30.44 (el PTR te da el nombre). Paso 2: con el NOMBRE recibido: dig +short TXT nombre. La firma del nivel esta en ESE TXT del nombre retornado.',
    setup: () => `
true; set +e; pkill -f 'dnsmasq.*53535' 2>/dev/null; set -e
dnsmasq --port=53535 --no-resolv --bind-interfaces \\
  --host-record=dojo-boss,10.20.30.44 \\
  --txt-record=dojo-boss,${'$'}DOJO_FLAG >/dev/null 2>&1
sleep 1`,
    solution: `nombre=$(dig +short -x 10.20.30.44 @127.0.0.1 -p 53535 | grep -v '^$' | head -n 1); dig +short TXT $nombre @127.0.0.1 -p 53535`,
    hints: [
      'El PTR está devolviendo dojo-boss. como nombre de la IP 10.20.30.44.',
      'El TXT de dojo-boss lleva la FIRMA (la TXT está en la cda de la cual del host-record).',
      `nombre=\$(dig +short -x 10.20.30.44 @127.0.0.1 -p 53535 | grep -v '^$' | head -n 1); dig +short TXT \$nombre @127.0.0.1 -p 53535`,
    ],
    teach: 'El boss final COMBINA: -x (reverso), TXT (la firma) y la cadena de comandos $(...). Es el flujo final del "WSI del dominio" que usan los sysadmins para rastrear una IP desconocida, con la metadata DNS que la dejamos en el TXT.',
    cheatsheet: [
      { cmd: 'dig +short -x IP', desc: 'paso 1: el nombre de la IP' },
      { cmd: 'dig +short TXT nombre', desc: 'paso 2: el registro del nombre' },
    ],
    keywords: ['boss', 'dns', 'dig', 'txT'],
    examples: [{ title: 'salida esperada (flag demo)', content: '"FLAG{…}"' }],
  },
];

// ═══════════════════════════════════════════════════════════ engine ════════
function emit(track, items, startIndex) {
  const dir = path.join(repoRoot, 'levels', track);
  fs.mkdirSync(dir, { recursive: true });
  let done = 0;
  items.forEach((it, i) => {
    const idx = startIndex + i + 1;
    const y = {
      id: `${track}-l${idx}`,
      track,
      index: idx,
      title: it.title,
      subtitle: it.subtitle ?? '',
      xp: it.xp,
      difficulty: it.difficulty,
      brief: it.brief,
      goal: it.goal,
      setup: `#!/bin/bash\nset -e\n# prelude común de servicios del dojo\ngrep -q " $(hostname)" /etc/hosts 2>/dev/null || echo "127.0.0.1 $(hostname)" >> /etc/hosts\nmkdir -p /run/sshd /var/dojo 2>/dev/null || true\n${it.setup()}`,
      solution: it.solution,
      hints: it.hints,
      teach: it.teach,
      cheatsheet: it.cheatsheet,
      keywords: it.keywords,
      profile: it.profile ?? 'default',
      examples: it.examples ?? [],
    };
    fs.writeFileSync(path.join(dir, `l${idx}.yaml`), YAML.stringify(y));
    done++;
  });
  return done;
}

const a = emit('sysadmin', SYADMIN, 0);
const d = emit('dns', DNS, 0);
console.log(`gen-expansion-sysadmin: sysadmin +${a}, dns +${d} niveles`);
