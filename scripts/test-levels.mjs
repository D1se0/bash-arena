/**
 * test-levels — verificación automática de CADA nivel:
 *  1) genera una flag única (como el motor)
 *  2) crea contenedor hardened con la imagen dojo-base
 *  3) sube y ejecuta el setup del nivel (como root)
 *  4) ejecuta la solución de referencia (como agent), SIN acceso a la flag/env
 *  5) exige exit 0 y que la flag aparezca en la salida
 *  6) cleanup; resumen; exit != 0 si algún nivel falla
 *
 * Uso: node scripts/test-levels.mjs [track-ídem]  (desde la raíz del repo)
 */
import fs from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const levelRoot = path.join(repoRoot, 'levels');
const YAML = require(path.join(repoRoot, 'node_modules/yaml')).default ?? require(path.join(repoRoot, 'node_modules/yaml'));
const DockerMod = require(path.join(repoRoot, 'node_modules/dockerode'));
const Docker = DockerMod.default ?? DockerMod;
const tar = require(path.join(repoRoot, 'node_modules/tar-stream'));

const docker = new Docker({ socketPath: process.env.ARENA_DOCKER_SOCKET || '/var/run/docker.sock' });
const IMAGE = process.env.ARENA_DOJO_IMAGE || 'bash-arena/dojo-base:latest';

const TRACKS = ['fundamentos', 'filtrado', 'busqueda', 'procesado', 'permisos', 'procesos', 'redes', 'archivos', 'scripting', 'forense', 'boss'];

function listLevelFiles(filter) {
  const out = [];
  for (const track of TRACKS) {
    const dir = path.join(levelRoot, track);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.yaml')) continue;
      if (filter && !`${track}/${f}`.includes(filter) && !track.includes(filter)) continue;
      out.push({ track, file: path.join(dir, f), name: `${track}/${f}` });
    }
  }
  return out;
}

function makeFlag() {
  return `FLAG{${crypto.randomBytes(12).toString('hex')}}`;
}

async function execCapture(container, opts, timeoutMs = 60_000) {
  const exec = await container.exec({
    ...opts,
    AttachStdout: true,
    AttachStderr: true,
  });
  const acc = { out: '' };
  const stdout = new PassThrough();
  stdout.on('data', (d) => { acc.out += d.toString(); });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, new PassThrough());
  const res = await Promise.race([
    new Promise((res, rej) => {
      stream.on('end', res);
      stream.on('error', rej);
    }),
    new Promise((res) => setTimeout(() => res('timeout'), timeoutMs)),
  ]);
  const inspect = await exec.inspect();
  return { out: acc.out, exitCode: inspect.ExitCode, timedOut: res === 'timeout' };
}

async function runLevel({ track, file, name }) {
  const def = YAML.parse(fs.readFileSync(file, 'utf8'));
  const problems = [];
  for (const key of ['id', 'track', 'title', 'goal', 'setup', 'solution', 'teach', 'hints']) {
    if (def[key] === undefined || def[key] === null) problems.push(`falta ${key}`);
  }
  if (def.track !== track) problems.push(`track YAML (${def.track}) != carpeta (${track})`);
  if (problems.length) {
    return { name, ok: false, exitCode: null, abs: problems.join(' | '), secs: 0 };
  }
  const flag = makeFlag();
  const setupScript = def.setup.split('$DOJO_FLAG').join(flag);
  if (!setupScript.includes(flag)) problems.push('setup no usa $DOJO_FLAG');
  if (/\bDOJO_FLAG\b/.test(def.solution)) problems.push('la solución hace alusión a $DOJO_FLAG');
  if (problems.length) {
    return { name, ok: false, exitCode: null, abs: problems.join(' | '), secs: 0 };
  }

  const cname = `lvl-${track}-${path.basename(file, '.yaml')}-${crypto.randomBytes(3).toString('hex')}`;
  const container = docker.getContainer(cname);
  const t0 = Date.now();
  try {
    await docker.createContainer({
      Image: IMAGE,
      name: cname,
      Tty: true,
      HostConfig: {
        PidsLimit: 256,
        Memory: 256 * 1024 * 1024,
        MemorySwap: 256 * 1024 * 1024,
        NanoCpus: 5e8,
        CapDrop: ['ALL'],
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

    const setupRun = await execCapture(container, {
      Cmd: ['bash', '-c', 'bash /root/.setup.sh && rm -f /root/.setup.sh'],
      User: 'root',
      Tty: false,
    }, 90_000);
    if (setupRun.exitCode !== 0) {
      return { name, ok: false, exitCode: setupRun.exitCode, abs: `setup falló: ${setupRun.out.slice(-400)}`, secs: 0 };
    }
    if (setupRun.timedOut) {
      return { name, ok: false, exitCode: null, abs: 'setup agotó el tiempo (90s)', secs: 0 };
    }

    const solRun = await execCapture(container, {
      Cmd: ['bash', '-c', def.solution.trim()],
      User: 'agent',
      Tty: false,
      Env: ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOME=/home/agent', 'TERM=dumb', 'LANG=C.UTF-8'],
    }, 90_000);
    const secs = Math.round((Date.now() - t0) / 1000);
    if (solRun.exitCode !== 0) {
      return { name, ok: false, exitCode: solRun.exitCode, abs: `solución exit!=0: ${solRun.out.slice(-400)}`, secs };
    }
    if (!solRun.out.includes(flag)) {
      return { name, ok: false, exitCode: solRun.exitCode, abs: `la solución NO reveló la flag (${def.id}): ${solRun.out.trimEnd().slice(-300)}`, secs };
    }
    // anti-atajo elemental: la flag no debe estar disponible como variable de entorno
    const envRun = await execCapture(container, { Cmd: ['env'], User: 'agent', Tty: false }, 15_000);
    if (envRun.out.includes(flag)) {
      return { name, ok: false, exitCode: 0, abs: 'la flag está en el env del agent (fuga)', secs };
    }
    return { name, ok: true, exitCode: 0, abs: '', secs };
  } catch (e) {
    return { name, ok: false, exitCode: null, abs: `docker: ${e && (e.message || String(e))}`, secs: Math.round((Date.now() - t0) / 1000) };
  } finally {
    await container.kill().catch(() => {});
    await container.remove({ force: true }).catch(() => {});
  }
}

async function main() {
  const filter = process.argv[2] || '';
  const files = listLevelFiles(filter);
  if (files.length === 0) {
    console.error('no hay niveles encontrados (filtro: ' + filter + ')');
    process.exit(2);
  }
  console.log(`verificando ${files.length} nivel(es)…`);
  const results = [];
  for (const f of files) {
    const r = await runLevel(f);
    results.push(r);
    const label = r.ok ? ' ✓' : '✗';
    console.log(` ${label} ${r.name} ${r.ok ? `${r.secs}s` : '| ' + r.abs.split('\n')[0]}`);
  }
  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;
  const report = {
    generated: new Date().toISOString(),
    total: results.length,
    ok: okCount,
    fail: failCount,
    results,
  };
  fs.mkdirSync(path.join(repoRoot, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, 'tests', 'report-levels.json'), JSON.stringify(report, null, 2));
  const md = ['# Informe de niveles', '', `generado: ${report.generated}`, '', '| nivel | estado | tiempo |', '|---|---|---|']
    .concat(results.map((r) => `| ${r.name} | ${r.ok ? '✅' : '❌ ' + r.abs.split('|')[0]} | ${r.secs}s |`));
  fs.writeFileSync(path.join(repoRoot, 'tests', 'report-levels.md'), md.join('\n') + '\n');
  console.log(`\nRESULTADO: ${okCount}/${results.length} niveles verificados`);
  if (failCount) {
    console.error('niveles fallidos: ' + results.filter((r) => !r.ok).map((r) => r.name).join(', '));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
