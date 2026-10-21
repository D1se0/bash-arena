/**
 * Sonda mínima del exec TTY: crea contenedor, bash --login TTY y lee 3s.
 * Imprime en VIVO cada chunk que llega, para aislar el mecanismo de dockerode.
 */
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;

const cname = `probe-tty-${crypto.randomBytes(3).toString('hex')}`;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const container = docker.getContainer(cname);

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

  const exec = await container.exec({
    Cmd: ['bash', '--login'],
    User: 'agent',
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  });
  console.log('exec creado, id:', exec.id.slice(0, 12));
  const stream = await exec.start({ hijack: true, stdin: true });

  let sawData = 0;
  stream.on('data', (d) => {
    sawData++;
    console.log(`[chunk ${sawData}] len=${d.length}:`, JSON.stringify(d.toString().slice(0, 200)));
  });
  console.log('esperando 3s de output del shell…');
  await new Promise((r) => setTimeout(r, 3000));
  if (sawData === 0) {
    console.log('NO HUBO NINGÚN chunk: el stream TTY no emite. Probando write…');
    stream.write('echo hola-desde-stdin\r');
    await new Promise((r) => setTimeout(r, 1500));
    console.log(`chunks tras write: ${sawData}`);
    if (sawData === 0) {
      console.log('STILL 0: el stream de exec.start(hijack) NO emite data — probablemente el modem de dockerode requiere pipe a un socket');
      // plan B: peek del modem raw: stream.socket?
      console.log('stream instanceof duplex? keys:', Object.keys(stream).slice(0, 12).join(','));
    }
  }
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
console.log('PROBE-DONE');
