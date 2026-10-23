import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import Docker from 'dockerode';
import tar from 'tar-stream';
import { config } from '../config.js';
import { logger } from '../log.js';
import type { LevelDefinition } from '../levels/tracks.js';

const docker = new Docker({ socketPath: config.dockerSocket });

export const ARENA_LABEL = 'bash-arena.session';

function wordEntropy(n: number): string {
  return crypto.randomBytes(n).toString('base64url');
}

export interface SessionCallbacks {
  /** Datos crudos del shell (out). */
  onData: (chunk: string) => void;
  /** El shell terminó (contenedor muerto). */
  onExit: () => void;
  /** Mensajes de arranque/setup (no parte del shell). */
  onSetupLog?: (line: string) => void;
}

/**
 * Sesión de terminal de un jugador para un nivel concreto:
 * contenedor efímero + hardening + setup del nivel + shell interactivo.
 */
export class ArenaSession {
  readonly id: string;
  readonly playerId: string;
  readonly level: LevelDefinition;
  container: Docker.Container | null = null;
  exec: Docker.Exec | null = null;
  private stream: NodeJS.ReadWriteStream | null = null;
  private raw: NodeJS.ReadWriteStream | null = null; // stream crudo del exec (stdin)

  /** casteo seguro para destroy/close de dockerode (stream/exec con firma imperfecta en las defs) */
  private tidyUpStream(): void {
    const unix = this.stream as unknown as { destroy?: () => void };
    if (typeof unix?.destroy === 'function') unix.destroy();
  }

  private tidyUpExec(): void {
    const unix = this.exec as unknown as { close?: () => void };
    if (typeof unix?.close === 'function') unix.close();
  }
  private callbacks: SessionCallbacks;
  private lastActivity = Date.now();
  private createdAt = Date.now();
  private killed = false;
  private flagValue: string;

  constructor(playerId: string, level: LevelDefinition, flagValue: string, callbacks: SessionCallbacks) {
    this.id = `arena-${playerId.slice(0, 8)}-${level.id}-${wordEntropy(4)}`;
    this.playerId = playerId;
    this.level = level;
    this.flagValue = flagValue;
    this.callbacks = callbacks;
  }

  get idleMs(): number {
    return Date.now() - this.lastActivity;
  }

  get ageMs(): number {
    return Date.now() - this.createdAt;
  }

  touch(): void {
    this.lastActivity = Date.now();
  }

  ageSeconds(): number {
    return Math.floor((Date.now() - this.createdAt) / 1000);
  }

  async start(): Promise<void> {
    const profile = this.level.profile;
    const securityOpt: string[] = ['no-new-privileges'];
    if (profile === 'sudo') {
      // niveles de permisos necesitan sudo (setuid); se desactiva explícitamente y se documenta
      securityOpt.length = 0;
    }
    const containerOptions: Docker.ContainerCreateOptions = {
      Image: config.dojoImage,
      name: this.id,
      Tty: true,
      OpenStdin: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Labels: { [ARENA_LABEL]: '1', level: this.level.id, player: this.playerId.slice(0, 12) },
      Cmd: ['tail', '-f', '/dev/null'],
      HostConfig: {
        PidsLimit: config.containerPids,
        Memory: config.containerMemMb * 1024 * 1024,
        MemorySwap: config.containerMemMb * 1024 * 1024,
        NanoCpus: Math.round(config.containerCpu * 1e9),
        CapDrop: [...config.hardening.capDrop],
        CapAdd: [...config.hardening.capAdd],
        SecurityOpt: securityOpt,
        ReadonlyRootfs: config.hardening.readOnlyRootfs,
      },
      NetworkingConfig: {
        EndpointsConfig: {
          none: {}, // sin red externa ni interna: solo loopback simulado
        },
      },
    };
    this.container = docker.getContainer(this.id);
    await this.container.remove({ force: true }).catch(() => undefined);
    await docker.createContainer(containerOptions);
    await this.container.start();
    await this.runSetup();
    await this.attachUserShell();
  }

  /** Ejecuta el script de setup del nivel (como root, en /root/.arena-setup.sh). */
  private async runSetup(): Promise<void> {
    if (!this.container) throw new Error('container missing');
    const setupScript = fillFlagTemplate(this.level.setup, this.flagValue);
    await putSetupScript(this.container, setupScript);
    const execOpts: Docker.ExecCreateOptions = {
      Cmd: ['bash', '-c', 'bash /root/.arena-setup.sh && rm -f /root/.arena-setup.sh'],
      User: 'root',
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    };
    const exec = await this.container.exec(execOpts);
    const buffer: string[] = [];
    const stream = await exec.start({ hijack: true, stdin: false });
    const collector = new PassThrough();
    collector.on('data', (chunk: Buffer) => buffer.push(chunk.toString('utf8')));
    stream.pipe(collector);
    const ok = await waitExecExit(exec, 30_000);
    if (!ok) {
      logger.error({ level: this.level.id, tail: buffer.slice(-5).join('') }, 'setup timeout');
      throw new Error('setup timeout');
    }
    const inspect = await exec.inspect();
    if (inspect.ExitCode !== 0) {
      logger.error({ level: this.level.id, tail: buffer.slice(-5).join('') }, 'setup failed');
      throw new Error('setup failed');
    }
    for (const line of buffer.join('').split('\n').filter(Boolean)) {
      this.callbacks.onSetupLog?.(line);
    }
  }

  /** Fichero con el PID del shell interactivo del agente (cd /proc/PID/cwd para el cwd real). */
  private static readonly SHELL_PID_FILE = '/tmp/.arena-bash.pid';

  /**
   * Completado de Tab vía exec en el contenedor: primer token = comandos del
   * PATH (compgen -A command), resto = ficheros del cwd ACTUAL del shell
   * interactivo (su cwd se lee de /proc/<pid>/cwd, PID marcado al arrancar).
   */
  async complete(word: string, firstWord: boolean): Promise<string[]> {
    if (!this.container) return [];
    const pidFile = ArenaSession.SHELL_PID_FILE;
    const shq = (s: string): string => `'${s.replaceAll("'", `'\\''`)}'`;
    const script = firstWord
      ? `compgen -A command -- ${shq(word)} 2>/dev/null`
      : `p=$(cat ${pidFile} 2>/dev/null); cd /proc/"$p"/cwd 2>/dev/null && compgen -f -- ${shq(word)} 2>/dev/null`;
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', script],
      User: 'agent',
      AttachStdout: true,
      AttachStderr: false,
      Tty: false,
    });
    try {
      const stream = await exec.start({ hijack: true, stdin: false });
      const out = await this.drainExecStream(exec, stream, 2000);
      const lines = out
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l.startsWith(word));
      logger.debug({ session: this.id, word, firstWord, n: lines.length }, 'tab complete');
      return lines;
    } catch (e) {
      logger.debug({ err: (e as Error).message, word }, 'tab exec failed');
      return [];
    } finally {
      try {
        (exec as unknown as { close?: () => void }).close?.();
      } catch { /* ignora */ }
    }
  }

  /**
   * Lee la salida de un exec con deadline y settle por inactividad. Con exec
   * hijack el stream NO dispara 'end' al morir el proceso (la conexión HTTP
   * queda abierta): esperamos (a) silencio de 80 ms tras el último dato o
   * (b) el hard timeout. Todo el path resuelve SIEMPRE con lo acumulado.
   */
  private drainExecStream(exec: Docker.Exec, stream: NodeJS.ReadableStream, timeoutMs: number): Promise<string> {
    return new Promise((resolve) => {
      const parts: Buffer[] = [];
      const done = (why: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        clearTimeout(quiet);
        stream.unpipe(demux);
        (stream as unknown as { destroy?: () => void }).destroy?.();
        resolve(Buffer.concat(parts).toString('utf8'));
        logger.debug({ session: this.id, why }, 'complete exec done');
      };
      let settled = false;
      let quiet: NodeJS.Timeout | undefined;
      const timer = setTimeout(() => done('timeout'), timeoutMs);
      const demux = new PassThrough();
      const stderrSink = new PassThrough();
      docker.modem.demuxStream(stream, demux, stderrSink);
      demux.on('data', (c: Buffer) => {
        parts.push(c);
        // settle: tras 80 ms sin datos nuevos damos por terminado el exec
        clearTimeout(quiet);
        quiet = setTimeout(() => void this.execDone(exec).then(() => done('settle')), 80);
      });
      demux.on('error', () => done('error'));
      stream.resume(); // nada escucha el stream crudo: evita backpressure
    });
  }

  /** TRUE si el exec ya terminó (Running=false). */
  private async execDone(exec: Docker.Exec): Promise<boolean> {
    try {
      const st = await exec.inspect();
      return typeof st.Running === 'boolean' && !st.Running;
    } catch {
      return true; // exec muerto: no sigue esperando
    }
  }

  /** Conecta el shell del agente (bash login + TTY). */
  private async attachUserShell(): Promise<void> {
    if (!this.container) throw new Error('container missing');
    // wrapper: marca el PID del shell interactivo (exec NO cambia el PID) para
    // que el completado de Tab pueda hacer cd al cwd real del agente
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', `echo $$ > ${ArenaSession.SHELL_PID_FILE} && exec bash --login`],
      User: 'agent',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    });
    this.exec = exec;
    const raw = await exec.start({ hijack: true, stdin: true });
    // exec.start devuelve el stream multiplexado de Docker (frames de 8 bytes)
    // aunque Tty sea true: pasamos stdout/stderr por demuxStream.
    const decoded = new PassThrough();
    docker.modem.demuxStream(raw, decoded, decoded);
    this.stream = decoded as unknown as NodeJS.ReadWriteStream;
    this.raw = raw as unknown as NodeJS.ReadWriteStream;
    raw.on('end', () => {
      this.callbacks.onExit();
    });
    raw.on('error', (err) => {
      logger.error({ err, session: this.id }, 'shell stream error');
      this.callbacks.onExit();
    });
    decoded.on('data', (chunk: Buffer) => {
      this.touch();
      this.callbacks.onData(chunk.toString('utf8'));
    });
  }

  resize(cols: number, rows: number): void {
    if (!this.exec) return;
    const c = Math.max(20, Math.min(500, Math.round(cols)));
    const r = Math.max(5, Math.min(200, Math.round(rows)));
    this.exec.resize({ Width: c, Height: r }).catch(() => undefined);
  }

  /** Envia datos crudos al stdin del shell (por el stream crudo). */
  write(data: string): void {
    if (this.killed) return;
    this.touch();
    this.raw?.write(data);
  }

  /** Termina la sesión: exec close + container remove. */
  async kill(why = 'explicit'): Promise<void> {
    if (this.killed) return;
    this.killed = true;
    logger.info({ session: this.id, why }, 'session kill()');
    try {
      (this.raw as unknown as { destroy?: () => void })?.destroy?.();
    } catch { /* ignore */ }
    try {
      (this.stream as unknown as { destroy?: () => void })?.destroy?.();
    } catch { /* ignore */ }
    if (this.container) {
      try {
        this.tidyUpExec();
      } catch { /* ignore */ }
      try {
        await this.container.kill();
      } catch { /* ignore */ }
      try {
        await this.container.remove({ force: true });
      } catch { /* ignore */ }
      this.container = null;
    }
  }

  isAlive(): boolean {
    return !this.killed && Boolean(this.container);
  }
}

/** Sustituye el placeholder de flag en el template del nivel por el valor generado.
 *  La flag es FLAG{hex} — segura sin comillas en contextos bash de doble cita. */
export function fillFlagTemplate(setup: string, flag: string): string {
  return setup.split('$DOJO_FLAG').join(flag);
}

/** Empaqueta y sube el setup script del nivel a /root del contenedor. */
async function putSetupScript(container: Docker.Container, contents: string): Promise<void> {
  const pack = tar.pack();
  pack.entry({ name: '.arena-setup.sh', mode: 0o700 }, contents);
  pack.finalize();
  await container.putArchive(pack, { path: '/root' });
}

/** Espera a que un exec termine (timeout). */
async function waitExecExit(exec: Docker.Exec, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const found = await exec.inspect();
    if (typeof found.Running === 'boolean' && !found.Running) return true;
    if (Date.now() > deadline) return false;
    await new Promise((r) => setTimeout(r, 100));
  }
}

/** Limpieza: elimina todos los contenedores de sesión bash-arena activos. */
export async function cleanupAllSessions(): Promise<number> {
  const opts = { all: true, filters: JSON.stringify({ label: [ARENA_LABEL] }) };
  const containers = (await docker.listContainers(opts)) as { Id: string }[];
  for (const info of containers) {
    const c = docker.getContainer(info.Id);
    await c.kill().catch(() => undefined);
    await c.remove({ force: true }).catch(() => undefined);
  }
  return containers.length;
}
