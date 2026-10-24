/**
 * gen-examples — UNA SOLA VEZ por nivel, la captura de "cómo debe verse la salida":
 *  1) crea un contenedor hardenado (dojo-base) con una FLAG DEMO fija
 *  2) ejecuta setup (root, con $DOJO_FLAG sustituida por esa flag demo)
 *  3) ejecuta la solución (como agent, igual que el motor)
 *  4) captura stdout y escribe el bloque YAML `examples: [-{title, content}]`
 *     AL FINAL del fichero (la zona FTRACT del YAML es la que el parser intenta
 *     re-leer: si ya existe examples se reemplaza textualmente, nunca se
 *     duplica).
 *
 * La salida NO contiene el comando: solo lo que imprime. La flag demo es una
 * flag REALISTA FIJA (FLAG{d3m0-9a4f…}) para que los ejemplos estén limpios y
 * no tengan datos de una sesión concreta.
 *
 * Uso: node scripts/gen-examples.mjs [filtro]   (desde la raíz del repo)
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
const DEMO_FLAG = 'FLAG{d3b09a4f7c2e1b8d6041a5f3}'; // fija, PURE hex: sobrevive a los filtros [0-9a-f] de niveles
const TRACKS = ['fundamentos', 'filtrado', 'busqueda', 'procesado', 'permisos', 'procesos', 'redes', 'archivos', 'scripting', 'forense', 'boss', 'grep', 'awk', 'grep-pro', 'awk-pro'];
const MAX_LINES = 40; // si la salida es gigante, corta (ya es un ejemplo, no un dump)
const MAX_CHARS = 1200; // tope duro de caracteres por ejemplo (líneas kilométricas)

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

async function execCapture(container, opts, timeoutMs = 60_000) {
  const exec = await container.exec({
    ...opts,
    AttachStdout: true,
    AttachStderr: true,
  });
  const acc = { out: '', err: '' };
  const stdout = new PassThrough();
  stdout.on('data', (d) => { acc.out += d.toString('utf8'); });
  const stderr = new PassThrough();
  stderr.on('data', (d) => { acc.err += d.toString('utf8'); });
  const stream = await exec.start({ hijack: true, stdin: false });
  docker.modem.demuxStream(stream, stdout, stderr);
  // el stream del exec NO se cierra si el setup dejó procesos de fondo vivos:
  // esperamos el ExitCode real con inspect (poll), no el cierre del stream.
  const t0 = Date.now();
  let exitCode = null;
  while (Date.now() - t0 < timeoutMs) {
    const ins = await exec.inspect();
    if (ins.ExitCode !== null && ins.ExitCode !== undefined) { exitCode = ins.ExitCode; break; }
    await new Promise((r) => setTimeout(r, 400));
  }
  await new Promise((r) => setTimeout(r, 250));
  const timedOut = exitCode === null;
  return { out: acc.out, err: acc.err, exitCode: exitCode ?? -1, timedOut };
}

/** reescribe el YAML del nivel con el campo examples (idempotente). */
function writeExamplesYaml(def, entries) {
  const doc = { ...def, examples: entries };
  return YAML.stringify(doc);
}

function trimOutput(text) {
  // quita caracteres de control (binarios, \0 de dumps) salvo \n y tab
  const t = text.replace(/[^\x20-\x7E\n\táéíóúüñÁÉÍÓÚÑ¿¡]/g, '').trimEnd();
  let t2 = t.split('\n').filter((l) => !/flag correcta|FLAG CORRECTA|✓|¡/i.test(l)).join('\n').trimEnd();
  if (!t2) t2 = t;
  let lines = t2.split('\n');
  if (t2.length > MAX_CHARS) {
    const cut = t2.slice(0, MAX_CHARS);
    const nl = cut.lastIndexOf('\n');
    const head = nl > 0 ? cut.slice(0, nl) : cut;
    const remaining = t2.length - head.length;
    return head.trimEnd() + `\n  … (+${remaining} caracteres más — la forma es idéntica)`;
  }
  if (lines.length > MAX_LINES) {
    const first = lines.slice(0, MAX_LINES);
    const rest = lines.length - MAX_LINES;
    first.push(`  … (+${rest} líneas más — la forma es idéntica)`);
    lines = first;
  }
  return lines.join('\n');
}

async function runLevel({ track, file, name }) {
  const src = fs.readFileSync(file, 'utf8');
  const def = YAML.parse(src);
  if (def.setup === undefined || def.setup === null) return { name, ok: false, abs: 'sin setup' };
  const flag = DEMO_FLAG;
  const setupScript = def.setup.split('$DOJO_FLAG').join(flag);
  const cname = `exd-${track}-${path.basename(file, '.yaml')}-${crypto.randomBytes(3).toString('hex')}`;
  const container = docker.getContainer(cname);
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
      return { name, ok: false, abs: `setup falló (exit ${setupRun.exitCode}): ${setupRun.out.slice(-300)}` };
    }
    if (setupRun.timedOut) {
      return { name, ok: false, abs: 'setup agotó el tiempo (90s)' };
    }

    const solRun = await execCapture(container, {
      Cmd: ['bash', '-c', def.solution.trim()],
      User: 'agent',
      Tty: false,
      Env: ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOME=/home/agent', 'TERM=dumb', 'LANG=C.UTF-8'],
    }, 90_000);
    if (solRun.timedOut) {
      return { name, ok: false, abs: 'solución agotó el tiempo (90s)' };
    }
    // si la solución IMPRIMIÓ la flag demo en stdout, no bloqueamos por exit
    // (algunas exit codes dependen del timing de procesos de fondo)
    if (solRun.exitCode !== 0 && !solRun.out.includes(flag)) {
      return { name, ok: false, abs: `solución exit!=0: ${solRun.out.slice(-200)} |ERR: ${solRun.err.slice(-200)}` };
    }
    if (!solRun.out.includes(flag)) {
      return { name, ok: false, abs: 'la solución no reveló la flag demo (¿generada dinámicamente?)' };
    }

    const content = trimOutput(solRun.out);
    const entries = [{
      title: 'salida esperada (flag demo)',
      content,
    }];
    fs.writeFileSync(file, writeExamplesYaml(def, entries));
    return { name, ok: true, abs: '' };
  } catch (e) {
    return { name, ok: false, abs: `docker: ${e.message || String(e)}` };
  } finally {
    await container.kill().catch(() => {});
    await container.remove({ force: true }).catch(() => {});
  }
}

async function main() {
  const filter = process.argv[2] || '';
  const files = listLevelFiles(filter);
  if (!files.length) { console.error('sin niveles para el filtro: ' + filter); process.exit(2); }
  console.log(`generando ejemplos para ${files.length} nivel(es) — flag demo ${DEMO_FLAG}`);
  const results = [];
  for (const f of files) {
    const r = await runLevel(f);
    results.push(r);
    console.log(` ${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : ' | ' + r.abs.split('\n')[0]}`);
  }
  const ok = results.filter((r) => r.ok).length;
  console.log(`\nRESULTADO: ${ok}/${results.length} ejemplos generados`);
  if (ok < results.length) {
    console.error('fallidos: ' + results.filter((r) => !r.ok).map((r) => r.name).join(', '));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
