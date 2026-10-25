/*
 * debug-level — ejecuta UN setup + lista de comandos del agente en el mismo
 * contenedor hardened que test-levels, mostrando out+err COMPLETOS.
 * Uso:
 *   node scripts/debug-level.mjs <track>/<archivo.yaml> [cmd1 ;; cmd2 ...]
 *   DBG_SETUP='#!/bin/bash…' DBG_PROFILE=sudo node scripts/debug-level.mjs custom cmd…
 */
import fs from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;
const tar = require(path.join(repoRoot, 'node_modules/tar-stream'));

const docker = new Docker({ socketPath: process.env.ARENA_DOCKER_SOCKET || '/var/run/docker.sock' });
const IMAGE = process.env.ARENA_DOJO_IMAGE || 'bash-arena/dojo-base:latest';

async function execCapture(container, opts, timeoutMs = 60_000) {
  const exec = await container.exec({ ...opts, AttachStdout: true, AttachStderr: true });
  const acc = { out: '', err: '' };
  const stdout = new PassThrough(); stdout.on('data', (d) => (acc.out += d.toString()));
  const stderr = new PassThrough(); stderr.on('data', (d) => (acc.err += d.toString()));
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, stderr);
  const t0 = Date.now();
  let exitCode = null;
  while (Date.now() - t0 < timeoutMs) {
    const ins = await exec.inspect();
    if (ins.ExitCode !== null && ins.ExitCode !== undefined) { exitCode = ins.ExitCode; break; }
    await new Promise((r) => setTimeout(r, 400));
  }
  return { out: acc.out, err: acc.err, exitCode: exitCode ?? -1 };
}

const [, , levelArg, ...cmds] = process.argv;
let def = { profile: process.env.DBG_PROFILE || 'default' };
let setupScript = process.env.DBG_SETUP || '';
if (levelArg !== 'custom') {
  def = YAML.parse(fs.readFileSync(path.join(repoRoot, 'levels', levelArg), 'utf8'));
  const flag = `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
  setupScript = process.env.DBG_SETUP || def.setup.split('$DOJO_FLAG').join(flag);
}

const cname = `dbg-${crypto.randomBytes(3).toString('hex')}`;
const container = docker.getContainer(cname);
try {
  await docker.createContainer({
    Image: IMAGE, name: cname, Tty: true,
    HostConfig: {
      PidsLimit: 256, Memory: 256 * 1024 * 1024, MemorySwap: 256 * 1024 * 1024, NanoCpus: 5e8,
      CapDrop: ['ALL'], CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETUID', 'SETGID', 'SYS_CHROOT'],
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
  const s = await execCapture(container, { Cmd: ['bash', '-c', 'bash /root/.setup.sh'], User: 'root', Tty: false }, 90_000);
  console.log('== setup ==\n' + s.out + (s.err ? '\n[setup-err] ' + s.err : ''), 'exit:', s.exitCode);
  const list = cmds.length ? cmds.join(' && ') : (def.solution || '').trim();
  const env = ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOME=/home/agent', 'TERM=dumb', 'LANG=C.UTF-8'];
  const r = await execCapture(container, { Cmd: ['bash', '-c', list], User: 'agent', Tty: false, Env: env }, 90_000);
  console.log('== agente cmd ==\n$ ' + list);
  console.log('OUT:\n' + r.out);
  console.log('ERR:\n' + r.err);
  console.log('exit:', r.exitCode);
} finally {
  await container.kill().catch(() => {});
  await container.remove({ force: true }).catch(() => {});
}
