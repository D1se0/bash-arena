/**
 * Sonda mínima write→output: crear exec TTY, escribir 'echo hola\r' al stream crudo
 * y ver si el shell responde. Aclara la dirección input de dockerode hijack.
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

const cname = `probe-w-${crypto.randomBytes(3).toString('hex')}`;
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
  const raw = await exec.start({ hijack: true, stdin: true });

  const decoded = new PassThrough();
  docker.modem.demuxStream(raw, decoded, decoded);
  decoded.on('data', (d) => console.log('[out]', JSON.stringify(d.toString().slice(0, 160))));

  console.log('espera inicial de prompt…');
  await new Promise((r) => setTimeout(r, 2000));
  console.log('→ escribiendo "echo hola\\r"');
  raw.write('echo hola\r');
  await new Promise((r) => setTimeout(r, 1500));
  console.log('→ escribiendo "cat /etc/hostname\\r"');
  raw.write('cat /etc/hostname\r');
  await new Promise((r) => setTimeout(r, 1500));
  console.log('FIN probe');
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
