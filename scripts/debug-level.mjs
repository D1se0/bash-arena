/**
 * debug-level — ejecuta un nivel concreto con salida COMPLETA para depurar:
 *   node scripts/debug-level.mjs filtrado/l3.yaml
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;
const tar = require(path.join(repoRoot, 'node_modules/tar-stream'));

const rel = process.argv[2];
if (!rel) { console.error('uso: node scripts/debug-level.mjs <track/nivel.yaml>'); process.exit(2); }
const full = path.join(repoRoot, 'levels', rel);
const def = YAML.parse(fs.readFileSync(full, 'utf8'));
const flag = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
const setupScript = def.setup.split('$DOJO_FLAG').join(flag);

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const cname = `dbg-${path.basename(rel, '.yaml')}-${crypto.randomBytes(3).toString('hex')}`;
const container = docker.getContainer(cname);

async function execCapture(opts, timeoutMs = 120_000) {
  const exec = await container.exec({ ...opts, AttachStdout: true, AttachStderr: true });
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  let out = '', err = '';
  stdout.on('data', (d) => { out += d.toString(); });
  stderr.on('data', (d) => { err += d.toString(); });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, stderr);
  await Promise.race([
    new Promise((res, rej) => { stream.on('end', res); stream.on('error', rej); }),
    new Promise((res) => setTimeout(() => res('timeout'), timeoutMs)),
  ]);
  const inspect = await exec.inspect();
  return { out, err, exitCode: inspect.ExitCode };
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
      SecurityOpt: def.profile === 'sudo' ? [] : ['no-new-privileges'],
    },
    NetworkingConfig: { EndpointsConfig: { none: {} } },
    Cmd: ['tail', '-f', '/dev/null'],
  });
  await container.start();

  const pack = tar.pack();
  pack.entry({ name: '.setup.sh', mode: 0o700 }, setupScript);
  pack.finalize();
  await container.putArchive(pack, { path: '/root' });

  console.log('===== SETUP (exit + salida completa) =====');
  const s = await execCapture({ Cmd: ['bash', '-c', 'bash /root/.setup.sh && rm -f /root/.setup.sh'], User: 'root', Tty: false });
  console.log(`setup exit=${s.exitCode}`);
  console.log(s.out);
  console.log(s.err);

  console.log('===== SOLUCIÓN =====');
  const solEnv = ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOME=/home/agent', 'TERM=dumb', 'LANG=C.UTF-8'];
  const r = await execCapture({ Cmd: ['bash', '-c', def.solution], User: 'agent', Tty: false, Env: solEnv });
  console.log(`solución exit=${r.exitCode}`);
  console.log(r.out);
  console.log(r.err);
  console.log(`¿la salida contiene la flag? ${r.out.includes(flag) ? 'SÍ' : 'NO'}`);
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
