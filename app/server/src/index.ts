import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import { logger } from './log.js';
import { buildApi } from './http/api.js';
import { attachGateway, bindLevelsService } from './ws/gateway.js';
import { createLevelsService } from './levels/service.js';
import { cleanupAllSessions } from './docker/session.js';
import { sessionManager } from './docker/manager.js';
import { closeDb } from './progress/db.js';

async function main(): Promise<void> {
  // levelsDir debe existir (montado por compose o repo en dev)
  const levelsDir = fs.existsSync(config.levelsDir)
    ? config.levelsDir
    : path.resolve(process.cwd(), 'levels');
  logger.info({ levelsDir }, 'using levels dir');

  const service = createLevelsService(levelsDir);
  if (service.ordered.length === 0) {
    logger.error({ levelsDir }, 'no levels found; aborting');
    process.exit(1);
  }
  bindLevelsService(service);

  // limpieza de contenedores huérfanos de ejecuciones previas
  const cleaned = await cleanupAllSessions();
  logger.info({ cleaned }, 'orphan containers removed on boot');

  const app = buildApi(service);
  const server = http.createServer(app as unknown as http.RequestListener);
  const wss = new WebSocketServer({ server, path: '/ws' });
  attachGateway(wss, service);

  const port = config.port;
  server.listen(port, '0.0.0.0', () => {
    logger.info({ port, levels: service.ordered.length }, 'bash-arena server ready');
  });

  const shutdown = async (why: string) => {
    logger.info({ why }, 'shutting down');
    for (const c of wss.clients) c.close(1001, 'server shutdown');
    await sessionManager.dropAll();
    closeDb();
    server.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'uncaught exception');
  });
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'unhandled rejection');
  });
}

void main();
