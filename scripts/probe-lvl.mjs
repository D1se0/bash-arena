/** probe-lvl — ejecuta setup+solución de UN nivel como lo haría test-levels,
 *  pero muestra stdout/stderr completos para depurar.  Uso: node scripts/probe-lvl.mjs track/lN */
import fs from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;
const tar = require(path.join(repoRoot, 'node_modules/tar-stream'));
const docker = new Docker({ socketPath: process.env.ARENA_DOCKER_SOCKET || '/var/run/docker.sock' });
const IMAGE = process.env.ARENA_DOJO_IMAGE || 'bash-arena/dojo-base:latest';

const target = process.argv[2];
const [track, file] = String(target).split('/');
const def = YAML.parse(fs.readFileSync(path.join(repoRoot, 'levels', track, file), 'utf8'));
const flag = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
const setup = def.setup.split('$DOJO_FLAG').join(flag);

const cname = `probe-${track}-${crypto.randomBytes(3).toString('hex')}`;
const container = docker.getContainer(cname);
try {
  await docker.createContainer({
    Image: IMAGE, name: cname, Tty: true,
    HostConfig: { PidsLimit: 256, Memory: 256 * 1024 * 1024, MemorySwap: 256 * 1024 * 1024, NanoCpus: 5e8, CapDrop: ['ALL'], CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID', 'SYS_CHROOT'], SecurityOpt: def.profile === 'sudo' ? [] : ['no-new-privileges'] },
    NetworkingConfig: { EndpointsConfig: { none: {} } },
    Cmd: ['tail', '-f', '/dev/null'],
  });
  await container.start();
  const pack = tar.pack();
  pack.entry({ name: '.setup.sh', mode: 0o700 }, setup);
  pack.finalize();
  await container.putArchive(pack, { path: '/root' });

  async function exec(cmd, user) {
    const ex = await container.exec({ Cmd: ['bash', '-c', cmd], User: user, AttachStdout: true, AttachStderr: true });
    const so = new PassThrough(), se = new PassThrough();
    let out = '', err = '';
    so.on('data', (d) => (out += d.toString()));
    se.on('data', (d) => (err += d.toString()));
    const st = await ex.start({ hijack: true, stdin: false });
    docker.modem.demuxStream(st, so, se);
    const t0 = Date.now();
    let code = null;
    while (Date.now() - t0 < 90000) {
      const ins = await ex.inspect();
      if (ins.ExitCode !== null && ins.ExitCode !== undefined) { code = ins.ExitCode; break; }
      await new Promise((r) => setTimeout(r, 300));
    }
    await new Promise((r) => setTimeout(r, 200));
    console.log(`── [${user}] exit=${code} cmd: ${cmd.slice(0, 90)}…`);
    console.log('STDOUT:', JSON.stringify(out));
    console.log('STDERR:', JSON.stringify(err));
    return code;
  }

  await exec('bash /root/.setup.sh && rm -f /root/.setup.sh', 'root');
  await exec(def.solution.trim(), 'agent');
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
