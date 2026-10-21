/**
 * Sonda procesos/l4 con execs desacoplados (docker exec -d equivalente):
 * instalación del escenario, solución paso a paso y reporte, SIN streams colgados.
 */
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;

const FLAG = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
const cname = `probe4-${crypto.randomBytes(3).toString('hex')}`;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const container = docker.getContainer(cname);

const setup = [
  'exec 2>&1',
  `echo "testigo: ${FLAG}" > /tmp/ocultad.sock`,
  'chown agent:agent /tmp/ocultad.sock',
  "printf 'import time\\nf = open(\"/tmp/ocultad.sock\")\\ntime.sleep(600)\\n' > /tmp/.arena-hold.py",
  'chown agent:agent /tmp/.arena-hold.py',
  "su agent -c 'setsid python3 /tmp/.arena-hold.py >/dev/null 2>&1 &'",
  'sleep 1',
  'rm -f /tmp/.arena-hold.py /tmp/ocultad.sock',
  'echo SETUP-OK',
].join('\n');

const solution = [
  'exec 2>&1',
  "pid=$(lsof -w 2>/dev/null | grep 'ocultad.*deleted' | awk '{print $2}' | head -1)",
  'echo "pid=[$pid]"',
  'ls -l /proc/$pid/fd 2>&1 | grep ocultad',
  "fd=$(ls -l /proc/$pid/fd 2>/dev/null | grep 'ocultad' | awk '{print $9}' | head -1)",
  'echo "fd=[$fd]"',
  'cat /proc/$pid/fd/$fd; echo CAT-RC=$?',
  'pgrep -a python3',
].join('\n');

const readLog = async (tag) => {
  const exec = await container.exec({ Cmd: ['cat', `/tmp/${tag}.log`], User: 'root', AttachStdout: true, Tty: false });
  const stream = await exec.start({ hijack: true, stdin: false });
  let out = '';
  stream.on('data', (d) => { out += d.toString().replace(/^.?.?.?.?.?.?.?.?/, ''); });
  await new Promise((r) => { stream.on('end', r); stream.on('error', r); setTimeout(r, 5000); });
  return out.slice(0, 1200);
};

async function runDetached(cmd, tag) {
  const exec = await container.exec({
    Cmd: ['bash', '-c', `(${cmd}) > /tmp/${tag}.log 2>&1`],
    User: 'root',
    Tty: false,
  });
  await exec.start({ hijack: true, stdin: false });
}

try {
  await docker.createContainer({
    Image: 'bash-arena/dojo-base:latest',
    name: cname,
    Tty: true,
    HostConfig: {
      PidsLimit: 256, Memory: 256 * 1024 * 1024, MemorySwap: 256 * 1024 * 1024,
      NanoCpus: 5e8, CapDrop: ['ALL'],
      CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID'],
      SecurityOpt: ['no-new-privileges'],
    },
    NetworkingConfig: { EndpointsConfig: { none: {} } },
    Cmd: ['tail', '-f', '/dev/null'],
  });
  await container.start();
  await runDetached(setup, 'setup');
  await new Promise((r) => setTimeout(r, 4000));
  console.log('--- setup ---\n', await readLog('setup'));
  await runDetached(solution, 'solution');
  await new Promise((r) => setTimeout(r, 5000));
  console.log('--- solution ---\n', await readLog('solution'));
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
console.log('PROBE-DONE');
