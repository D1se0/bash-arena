/**
 * security-tests — verificación activa del modelo de amenazas:
 *   1. socket Docker NO montado en contenedores de usuario
 *   2. red: sin salida externa (curl/ping/dig fallan)
 *   3. fork bomb contenida por pids-limit (el contenedor sigue vivo)
 *   4. memoria limitada (asignación gigante → SIGKILL por OOM)
 *   5. agente NO root: no puede escribir /etc ni leer /root
 *   6. caps duros: sin SYS_PTRACE, sin NET_RAW (CapEff sin esos bits)
 *   7. limite de caps y pids apreciados en runtime
 * Uso: node scripts/security-tests.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;
const WsMod = require(path.join(repoRoot, 'node_modules/ws'));
const WebSocketClass = WsMod.WebSocket ?? WsMod;

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const cname = `sec-${crypto.randomBytes(3).toString('hex')}`;
const container = docker.getContainer(cname);

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(` ${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function exec(cmd) {
  const exec = await container.exec({
    Cmd: ['bash', '-c', cmd],
    User: 'root',
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });
  const acc = { out: '' };
  const stdout = new (await import('node:stream')).PassThrough();
  stdout.on('data', (d) => { acc.out += d.toString(); });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, new (await import('node:stream')).PassThrough());
  await new Promise((r) => { stream.on('end', r); stream.on('error', r); setTimeout(r, 30_000); });
  const inspect = await exec.inspect();
  return { out: acc.out.trim(), exitCode: inspect.ExitCode };
}

try {
  await docker.createContainer({
    Image: process.env.ARENA_DOJO_IMAGE || 'bash-arena/dojo-base:latest',
    name: cname,
    Tty: true,
    HostConfig: {
      PidsLimit: 128,
      Memory: 256 * 1024 * 1024,
      MemorySwap: 256 * 1024 * 1024,
      NanoCpus: 5e8,
      CapDrop: ['ALL'],
      CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID'],
      SecurityOpt: ['no-new-privileges'],
    },
    NetworkingConfig: { EndpointsConfig: { none: {} } },
    Cmd: ['tail', '-f', '/dev/null'],
  });
  await container.start();

  // 1) socket docker no montado
  const sock = await exec("grep -c 'docker.sock' /proc/self/mountinfo || true");
  check('docker.sock NO montado en el contenedor de sesión', sock.out === '0');

  // 2) red: sin salida externa (timeout corto a un IP público no enrutable)
  const net = await exec('timeout 4 curl -s 8.8.8.8 || echo NET-DENIED');
  check('sin salida externa (curl 8.8.8.8)', net.out.includes('NET-DENIED'));

  // ping falla (cap NET_RAW ausente)
  const ping = await exec('timeout 3 ping -c1 1.1.1.1 2>&1 || echo PING-DENIED');
  check('ping denegado (sin NET_RAW)', ping.out.includes('PING-DENIED') || ping.out.includes('Operation not permitted'));

  // 3) memoria limitada (vía fichero temporal: sin anidar comillas)
  const mem = await exec("printf 'x = bytearray(300*1024*1024)\\n' > /tmp/m.py && python3 -S /tmp/m.py 2>&1; echo RC=$?");
  check(
    'asignación de 300MB abortada (mem limit 256MB)',
    mem.out.includes('MemoryError') || mem.out.includes('Killed') || mem.out.includes('Cannot allocate memory') || mem.out.includes('RC=137'),
    mem.out.slice(0, 80),
  );

  // 5) agente no-root: sin escribir /etc, sin leer /root (su evita el ruido PAM de sudo)
  const etcw = await exec('su agent -c "touch /etc/dojo-probe 2>&1 || echo ETC-DENIED"');
  check(
    'agent no puede escribir /etc',
    etcw.out.includes('ETC-DENIED') || etcw.out.includes('Permission denied') || etcw.out.includes('Read-only file system'),
    etcw.out.slice(0, 80),
  );
  const rootr = await exec('su agent -c "cat /root/dojo 2>&1 || echo ROOT-DENIED"');
  check(
    'agent no puede leer /root',
    rootr.out.includes('ROOT-DENIED') || rootr.out.includes('Permission denied'),
    rootr.out.slice(0, 80),
  );

  // 6) caps: sin SYS_PTRACE (bit21) ni NET_RAW (bit13) en CapEff
  const caps = await exec("grep '^CapEff' /proc/1/status || true");
  const capHex = Number.parseInt(caps.out.replace(/^CapEff:\s*/, ''), 16);
  const hasSysPtrace = !!(capHex & (1 << 19));
  const hasNetRaw = !!(capHex & (1 << 13));
  check('sin CAP_SYS_PTRACE', !hasSysPtrace);
  check('sin CAP_NET_RAW', !hasNetRaw);

  // 7) no-new-privileges aplicado al contenedor entero (pid1)
  const nnp = await exec("grep NoNewPrivs /proc/1/status || echo NNP-MISSING");
  check('NoNewPrivs activo', /NoNewPrivs:\s*1/.test(nnp.out), nnp.out);

  // ÚLTIMA: fork bomb (llena el pids-limit con zombis: ningún exec posterior arranca)
  await exec('bash -c ":(){ :|:& };:" 2>&1 | head -2; sleep 1', 20_000);
  const state = await ((async () => {
    const c = await docker.getContainer(cname).inspect();
    return c.State.Status;
  })());
  check(
    'fork bomb contenida (contenedor sigue Running — verificado desde el host)',
    state === 'running',
    `status=${state}`,
  );
  check('cliente WS disponible para pruebas de abuso', typeof WebSocketClass === 'function');
} catch (e) {
  check('ejecución de las pruebas', false, e && (e.message || String(e)));
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}

const ok = results.filter((r) => r.ok).length;
fs.mkdirSync(path.join(repoRoot, 'tests'), { recursive: true });
fs.writeFileSync(
  path.join(repoRoot, 'tests', 'report-security.json'),
  JSON.stringify({ generated: new Date().toISOString(), results }, null, 2),
);
console.log(`\nSECURITY-RESULT: ${ok}/${results.length}`);
process.exitCode = ok === results.length && results.length >= 8 ? 0 : 1;
