/**
 * Sonda cruda v2: ¿sobrevive el holder python y qué muestra lsof?
 * Usa docker.modem.demuxStream (frames correctos).
 * Uso: node scripts/probe-holder-live.mjs
 */
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
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

const setupCmd = [
  `echo "testigo: ${FLAG}" > /tmp/ocultad.sock`,
  'chown agent:agent /tmp/ocultad.sock',
  'printf \'import time\\nf = open("/tmp/ocultad.sock")\\ntime.sleep(600)\\n\' > /tmp/.arena-hold.py',
  'chown agent:agent /tmp/.arena-hold.py',
  "su agent -c 'setsid python3 /tmp/.arena-hold.py >/dev/null 2>&1 &'",
  'sleep 1',
  'rm -f /tmp/.arena-hold.py /tmp/ocultad.sock',
  'echo SETUP-OK',
].join(' && ');

const inspectCmd = [
  'exec 2>&1',
  'echo PROCS:',
  'pgrep -a python3 || true',
  'echo LSOF:',
  'lsof -w 2>&1 | grep -E "ocultad|deleted" || echo NO-MATCHES',
  'echo LSOF-FULL-HEAD:',
  'lsof -w -p 1 2>&1 | head -4 || true',
  'echo PROCFD:',
  'for p in $(pgrep python3); do ls -l /proc/$p/fd 2>&1 | grep ocultad || echo "no fd ve $p"; done',
].join('\n');

async function run(cmd, user) {
  const exec = await container.exec({
    Cmd: ['bash', '-c', cmd],
    User: user,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });
  const stdout = new PassThrough();
  let out = '';
  stdout.on('data', (d) => { out += d.toString(); });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, new PassThrough());
  await new Promise((r) => { stream.on('end', r); setTimeout(r, 10_000); });
  return out.trim();
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
  console.log('=== SETUP ===');
  console.log(await run(setupCmd, 'root'));
  console.log('=== INSPECCIÓN (root) ===');
  console.log(await run(inspectCmd, 'root'));
  console.log('=== INSPECCIÓN (agent) ===');
  console.log(await run(inspectCmd, 'agent'));
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
console.log('PROBE-DONE');
