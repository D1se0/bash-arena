/**
 * Probe end-to-end del ciclo de sesión dockerode:
 * 1) contenedor hardened 2) putArchive setup 3) exec root setup
 * 4) exec agent solución 5) kill+remove 6) cleanup idempotente.
 * Ejecutar con: node scripts/dojo-probe.mjs (dependencias de app/server)
 */
import Docker from 'dockerode';
import { PassThrough } from 'node:stream';
import tar from 'tar-stream';
import crypto from 'node:crypto';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const name = `arena-probe-${crypto.randomBytes(4).toString('hex')}`;
const FLAG = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;

function fail(why) {
  console.error(`PROBE-FAIL: ${why}`);
  docker.getContainer(name).remove({ force: true }).catch(() => {});
  process.exit(1);
}

const setup = `
set -e
echo "Flag: ${FLAG}" > /home/agent/.secreto
chown agent:agent /home/agent/.secreto
`;

const solution = 'cat /home/agent/.secreto';

const container = docker.getContainer(name);

/** exec no-TTY multiplexa stdout/stderr con cabeceras de 8 bytes: demux. */
async function captureExec(exec) {
  const stdout = new PassThrough();
  let acc = '';
  stdout.on('data', (d) => {
    acc += d.toString();
  });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, new PassThrough());
  await new Promise((res, rej) => {
    stream.on('end', res);
    stream.on('error', rej);
  });
  return acc;
}

try {
  await container.remove({ force: true }).catch(() => {});
  await docker.createContainer({
    Image: 'bash-arena/dojo-base:latest',
    name,
    Tty: true,
    HostConfig: {
      PidsLimit: 128,
      Memory: 256 * 1024 * 1024,
      MemorySwap: 256 * 1024 * 1024,
      NanoCpus: 0.5e9,
      CapDrop: ['ALL'],
      CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID'],
      SecurityOpt: ['no-new-privileges'],
      ReadonlyRootfs: false,
    },
    NetworkingConfig: { EndpointsConfig: { none: {} } },
    Cmd: ['tail', '-f', '/dev/null'],
    Labels: { 'bash-arena.probe': '1' },
  });
  await container.start();
  console.log('1) contenedor creado y arrancado');

  const pack = tar.pack();
  pack.entry({ name: '.probe-setup.sh', mode: 0o700 }, setup);
  pack.finalize();
  await container.putArchive(pack, { path: '/root' });
  console.log('2) setup.sh subido a /root');

  const setupExec = await container.exec({
    Cmd: ['bash', '-c', 'bash /root/.probe-setup.sh && rm -f /root/.probe-setup.sh'],
    User: 'root',
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });
  const setupOut = await captureExec(setupExec);
  const setupInspect = await setupExec.inspect();
  if (setupInspect.ExitCode !== 0) fail(`setup exit=${setupInspect.ExitCode}: ${setupOut}`);
  console.log('3) setup ejecutado como root, exit 0');

  const shellExec = await container.exec({
    Cmd: ['bash', '-c', solution],
    User: 'agent',
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });
  const out = await captureExec(shellExec);
  if (!out.includes(FLAG)) fail(`la salida no contenía la flag: [${out.trim()}]`);
  console.log('4) exec agent devolvió la flag ✓');

  const probeExec = await container.exec({
    Cmd: ['bash', '-c', '[ ! -e /root/.probe-setup.sh ] && echo CLEANED || echo LEAKED'],
    User: 'agent',
    AttachStdout: true,
    Tty: false,
  });
  const probe = (await captureExec(probeExec)).trim();
  if (probe !== 'CLEANED') fail(`restos del setup detectados: ${probe}`);
  console.log('4b) no quedan restos del setup accesibles ✓');

  await container.kill();
  await container.remove({ force: true });
  console.log('5) contenedor eliminado');
  await container.remove({ force: true }).catch(() => {});
  console.log('6) limpieza idempotente ✓');

  console.log('PROBE-OK');
  process.exit(0);
} catch (e) {
  fail(e && (e.message || String(e)));
}
