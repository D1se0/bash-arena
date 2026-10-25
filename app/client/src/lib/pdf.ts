/**
 * lib/pdf — informe de progreso del dojo en PDF (jsPDF puro, sin canvas).
 *
 * Estructura del documento A4:
 *  · Portada con panel oscuro estilo Nord: jugador visible, rango, fecha.
 *  · Tarjetas de resumen (XP, rango, resueltos, tiempo, pistas, intentos).
 *  · Progreso por sección con barras de color del track.
 *  · Tabla de niveles resueltos (paginada).
 *  · Logros y código de verificación (checksum del propio JSON del progreso).
 *  · Diploma: certificado decorado con sello dibujado a mano y firma.
 */

import { jsPDF } from 'jspdf';
import { checksum8, fetchProgress, type ProgressPortFile } from './port';

export interface PdfWelcomeTrack {
  id: string;
  name: string;
  icon: string;
  color: string;
  levels: number;
  solved: number;
}

export interface PdfProfileInput {
  playerId: string;
  playerName: string;
  xp: number;
  rank: string;
  nextRankAt: number | null;
  tracks: PdfWelcomeTrack[];
  currentLevelTitle?: string | null;
}

/* ── paleta Nord (igual que la UI) ── */
const C = {
  base: [46, 52, 64] as const,      // #2E3440
  panel: [59, 66, 82] as const,     // #3B4252
  ice: [136, 192, 208] as const,    // #88C0D0
  frost: [129, 161, 193] as const,  // #81A1C1
  verde: [163, 190, 140] as const,  // #A3BE8C
  arena: [235, 203, 139] as const,  // #EBCB8B
  morado: [180, 142, 173] as const, // #B48EAD
  coral: [191, 97, 106] as const,   // #BF616A
  texto: [59, 66, 82] as const,     // texto sobre blanco
  texto2: [92, 102, 124] as const,  // texto secundario
  linea: [207, 214, 226] as const,  // bordes sobre blanco
};

const PAGE_W = 210;
const PAGE_H = 297;
const M = 16; // margen mm

type Doc = jsPDF;

function phase(doc: Doc, next: boolean = true): void {
  if (next) doc.addPage();
}

function bandHeader(doc: Doc): void {
  doc.setFillColor(...C.base);
  doc.rect(0, 0, PAGE_W, 14, 'F');
  doc.setTextColor(...C.ice);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('[bash-arena] informe de progreso', M, 8.8);
  doc.setTextColor(230, 233, 238);
  doc.setFont('helvetica', 'normal');
  doc.text(`/player/${safeId(doc)}`, PAGE_W - M, 8.8, { align: 'right' });
}

function safeId(doc: Doc): string {
  // el id del jugador viaja en el doc; lo leemos del campo de estado interno
  const meta = (doc as unknown as { __arenaId?: string }).__arenaId ?? '';
  return meta.slice(0, 12) + (meta.length > 12 ? '…' : '');
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 6 ? h : '88c0d0', 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function fmtTime(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

/** RANGOS: espejo de engine/gamification.ts (min XP). */
const RANK_STEPS = [0, 150, 400, 800, 1400, 2200];

function mainContent(doc: Doc, input: PdfProfileInput, state: ProgressPortFile | null, checksum: string): void {
  const progress = state?.progress ?? [];
  const solved = progress.filter((p) => p.solved === 1);
  const totalHints = solved.reduce((n, p) => n + (p.hints_used ?? 0), 0);
  const attempts = progress.reduce((n, p) => n + (p.attempts ?? 0), 0);
  const totalTime = solved.reduce((n, p) => n + (p.time_s ?? 0), 0);
  const totalLevels = input.tracks.reduce((n, t) => n + t.levels, 0);
  const earned = solved.reduce((n, p) => n + (p.xp_earned ?? 0), 0);
  const achievements = state?.achievements ?? [];

  /* ── portada ── */
  doc.setFillColor(...C.base);
  doc.rect(0, 0, PAGE_W, 132, 'F');
  // deco: líneas de "código" en la cabecera
  doc.setTextColor(...C.frost);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  const codeLines = ['agent@dojo:~$ cat ~/.informe', '    └── generando perfil /export/pdf … ok', '    └── flag verificada en servidor ✓'];
  codeLines.forEach((l, i) => doc.text(l, M, 12 + i * 4.4));

  doc.setTextColor(...C.arena);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('bash-arena', M, 42);
  doc.setTextColor(...C.ice);
  doc.setFontSize(17);
  doc.text('Informe de progreso del jugador', M, 52);

  // tarjeta del jugador
  doc.setFillColor(...C.panel);
  doc.roundedRect(M, 62, PAGE_W - 2 * M, 44, 3, 3, 'F');
  doc.setTextColor(236, 239, 244);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('JUGADOR', M + 8, 74);
  doc.setTextColor(...C.arena);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(input.playerName.slice(0, 28) || 'agente', M + 8, 86);
  doc.setTextColor(...C.frost);
  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  doc.text(`id: ${input.playerId}`, M + 8, 96);
  doc.text(`rango: ${input.rank}`, M + 8, 103);

  // escudo XP a la derecha de la tarjeta
  doc.setDrawColor(...C.ice);
  doc.setLineWidth(0.8);
  doc.circle(PAGE_W - 34, 84, 12, 'S');
  doc.setTextColor(...C.ice);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(String(input.xp), PAGE_W - 34, 87, { align: 'center' });
  doc.setFontSize(7);
  doc.text('XP', PAGE_W - 34, 92, { align: 'center' });

  doc.setTextColor(...C.texto2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`emitido el ${fecha} · verificación ${checksum.slice(0, 8)}`, M, 124);

  /* ── página de resumen ── */
  phase(doc);
  bandHeader(doc);
  let y = 34;
  doc.setTextColor(...C.texto);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Resumen de la travesía', M, y);
  y += 12;

  const cards: [string, string][] = [
    ['XP totales', String(input.xp)],
    ['Rango', input.rank],
    ['Niveles resueltos', `${solved.length} / ${totalLevels}`],
    ['XP ganados en niveles', String(earned)],
    ['Intentos registrados', String(attempts)],
    ['Pistas usadas (total)', String(totalHints)],
    ['Tiempo resolviendo', fmtTime(totalTime)],
    ['Logros desbloqueados', String(achievements.length)],
  ];
  const cw = (PAGE_W - 2 * M - 8) / 2;
  cards.forEach(([k, v], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (cw + 8);
    const yy = y + row * 26;
    doc.setFillColor(246, 248, 250);
    doc.setDrawColor(...C.linea);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, yy, cw, 20, 2.5, 2.5, 'FD');
    doc.setTextColor(...C.texto2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(k.toUpperCase(), x + 5, yy + 7);
    doc.setTextColor(...C.texto);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(String(v), x + 5, yy + 15);
  });
  y += Math.ceil(cards.length / 2) * 26 + 10;

  /* progreso por sección, con barras */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...C.texto);
  doc.text('Progreso por sección', M, y);
  y += 8;
  for (const t of input.tracks) {
    const pct = t.levels > 0 ? t.solved / t.levels : 0;
    doc.setTextColor(...C.texto);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(t.name, M, y);
    doc.setTextColor(...C.texto2);
    doc.text(`${t.solved}/${t.levels}`, PAGE_W - M, y, { align: 'right' });
    // barra de fondo
    const bx = M, bw = PAGE_W - 2 * M, by = y + 2.6;
    doc.setFillColor(232, 236, 241);
    doc.roundedRect(bx, by, bw, 3.6, 1.8, 1.8, 'F');
    // barra de avance con el color del track
    const [r, g, b] = hexToRgb(t.color);
    doc.setFillColor(r, g, b);
    if (pct > 0) doc.roundedRect(bx, by, Math.max(bw * pct, 2), 3.6, 1.8, 1.8, 'F');
    y += 9.4;
    if (y > PAGE_H - 24) { phase(doc); bandHeader(doc); y = 30; doc.text('(progreso, continúa)', M, y); y += 8; }
  }

  /* ── tabla de niveles resueltos ── */
  phase(doc);
  bandHeader(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C.texto);
  doc.text('Niveles resueltos', M, 24);
  const tableHead = ['nivel', 'XP', 'pistas', 'tiempo', 'fecha'];
  const colX = [M, 108, 128, 148, 172];
  const colW = colX[4] + 22 - M;

  const drawHead = (yy: number) => {
    doc.setFillColor(...C.base);
    doc.roundedRect(M, yy, colW, 8, 1.5, 1.5, 'F');
    doc.setTextColor(...C.ice);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    tableHead.forEach((h, i) => doc.text(h.toUpperCase(), colX[i] + 2, yy + 5.5));
  };

  let ty = 32;
  drawHead(ty);
  ty += 8;
  const rows = solved
    .map((p) => ({
      id: p.level_id,
      xp: p.xp_earned ?? 0,
      h: p.hints_used ?? 0,
      t: p.time_s ?? 0,
      date: (p as { solved_at?: string }).solved_at ?? '',
      track: p.track,
    }))
    .sort((a, b) => (a.track === b.track ? a.id.localeCompare(b.id, undefined, { numeric: true }) : a.track.localeCompare(b.track)));

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  for (const rw of rows) {
    if (ty > PAGE_H - 30) {
      // pie de página y repetir cabecera
      doc.setTextColor(...C.texto2);
      doc.text(`— página ${doc.getNumberOfPages()} —`, PAGE_W / 2, PAGE_H - 12, { align: 'center' });
      phase(doc);
      bandHeader(doc);
      drawHead(22);
      ty = 30;
    }
    if ((doc.getNumberOfPages() + 1) % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(M, ty, colW, 6.4, 'F');
    }
    doc.setTextColor(...C.texto);
    doc.text(rw.id.slice(0, 28), colX[0] + 2, ty + 4.6);
    doc.text(String(rw.xp), colX[1] + 2, ty + 4.6);
    doc.text(String(rw.h), colX[2] + 2, ty + 4.6);
    doc.text(rw.t >= 60 ? `${Math.round(rw.t / 60)}m` : `${rw.t}s`, colX[3] + 2, ty + 4.6);
    doc.setTextColor(...C.texto2);
    doc.text(rw.date ? rw.date.replace('T', ' ').slice(0, 16) : '—', colX[4] + 2, ty + 4.6);
    doc.setDrawColor(...C.linea);
    doc.setLineWidth(0.1);
    doc.line(M, ty + 6.4, M + colW, ty + 6.4);
    ty += 6.6;
  }
  if (rows.length === 0) {
    doc.setTextColor(...C.texto2);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('todavía no hay niveles resueltos: el informe es territorio vacío (¡por ahora!).', M, ty + 4);
  }

  /* ── logros ── */
  phase(doc);
  bandHeader(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C.texto);
  doc.text('Logros del dojo', M, 24);
  let ay = 34;
  doc.setFontSize(10);
  if (achievements.length === 0) {
    doc.setTextColor(...C.texto2);
    doc.setFont('helvetica', 'normal');
    doc.text('ninguno aún: la primera flag ya desbloquea «Primera flag».', M, ay);
    ay += 8;
  }
  for (const a of achievements) {
    doc.setFillColor(246, 248, 250);
    doc.setDrawColor(...C.linea);
    doc.roundedRect(M, ay - 5, PAGE_W - 2 * M, 9, 2, 2, 'FD');
    doc.setFillColor(...C.verde);
    doc.circle(M + 7, ay, 2.2, 'F');
    doc.setTextColor(...C.texto);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(a.name, M + 12, ay + 1);
    doc.setTextColor(...C.texto2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    if ('earned_at' in a && typeof a.earned_at === 'string') {
      doc.text(a.earned_at.replace('T', ' ').slice(0, 16), PAGE_W - M - 4, ay + 1, { align: 'right' });
    }
    ay += 11.5;
  }

  /* ── código de verificación ── */
  doc.setFillColor(...C.arena);
  doc.roundedRect(M, ay + 4, PAGE_W - 2 * M, 34, 3, 3, 'F');
  doc.setTextColor(46, 52, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Integridad del informe', M + 6, ay + 13);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  const wrap = 52;
  for (let i = 0; i * wrap < checksum.length; i++) {
    doc.text(checksum.slice(i * wrap, (i + 1) * wrap), M + 6, ay + 20 + i * 4.4);
    if (i >= 2) break;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('checksum8 (djb2) del estado JSON completo del progreso en el momento de exportar.', M + 6, ay + 34);
}

/** el extra creativo: página de diploma/certificado con sello dibujado a mano. */
function diplomaPage(doc: Doc, input: PdfProfileInput, solvedCount: number, checksum: string): void {
  phase(doc);
  const height = PAGE_H;

  // fondo claro con marco doble
  doc.setFillColor(252, 251, 247);
  doc.rect(0, 0, PAGE_W, height, 'F');
  doc.setDrawColor(...C.base);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, PAGE_W - 24, height - 24);
  doc.setLineWidth(0.2);
  doc.rect(14.5, 14.5, PAGE_W - 29, height - 29);
  // esquinas decorativas (gruesos)
  for (const [x, y, sx, sy] of [
    [12, 12, 1, 1], [PAGE_W - 12, 12, -1, 1], [12, height - 12, 1, -1], [PAGE_W - 12, height - 12, -1, -1],
  ] as [number, number, number, number][]) {
    doc.setDrawColor(...C.arena);
    doc.setLineWidth(0.6);
    doc.line(x, y, x + 10 * sx, y);
    doc.line(x, y, x, y + 10 * sy);
  }

  doc.setTextColor(...C.texto2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('el dojo certifica', PAGE_W / 2, 46, { align: 'center' });

  doc.setTextColor(...C.texto);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(`${input.playerName.slice(0, 34)}`, PAGE_W / 2, 62, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.texto2);
  doc.setFontSize(10.5);
  doc.text('por su trabajo en la terminal: contenedores reales, flags verificadas,', PAGE_W / 2, 76, { align: 'center' });
  doc.text('y ninguna red externa de la que arrepentirse', PAGE_W / 2, 83, { align: 'center' });

  // grandes métricas
  doc.setTextColor(...C.ice);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${solvedCount}`, PAGE_W / 2 - 30, 104, { align: 'center' });
  doc.text(`${input.xp}`, PAGE_W / 2 + 30, 104, { align: 'center' });
  doc.setTextColor(...C.texto2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('niveles resueltos', PAGE_W / 2 - 30, 110, { align: 'center' });
  doc.text('XP ganados', PAGE_W / 2 + 30, 110, { align: 'center' });

  // rango con banda
  doc.setFillColor(...C.base);
  doc.roundedRect(PAGE_W / 2 - 40, 120, 80, 12, 6, 6, 'F');
  doc.setTextColor(...C.arena);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(input.rank, PAGE_W / 2, 128, { align: 'center' });

  /* sello circular */
  const sx = PAGE_W / 2, sy = 170, sr = 22;
  doc.setDrawColor(...C.coral);
  doc.setLineWidth(0.9);
  doc.circle(sx, sy, sr, 'S');
  doc.setLineWidth(0.3);
  doc.circle(sx, sy, sr - 3, 'S');
  doc.circle(sx, sy, sr - 8, 'S');
  doc.setTextColor(...C.coral);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('dojo', sx, sy - 2, { align: 'center' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.text('aprobado', sx, sy + 4, { align: 'center' });
  doc.text('406 niveles', sx, sy + 9.5, { align: 'center' });

  doc.setTextColor(...C.texto2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`emitido el ${fecha}`, PAGE_W / 2, 210, { align: 'center' });

  // firma y verificación
  doc.setDrawColor(...C.texto2);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W / 2 - 55, 252, PAGE_W / 2 + 15, 252);
  doc.setFontSize(8);
  doc.text('Buffy · agente del dojo', PAGE_W / 2 - 20, 257, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.texto2);
  doc.text(`verificación: ${checksum.slice(0, 16)}…`, PAGE_W / 2, 270, { align: 'center' });
  doc.text(`jugador: ${input.playerId}`, PAGE_W / 2, 275, { align: 'center' });

}

/** genera y descarga el PDF. Devuelve el nombre de fichero creado. */
export async function exportProfilePdf(input: PdfProfileInput): Promise<string> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  (doc as unknown as { __arenaId: string }).__arenaId = input.playerId;

  // estado completo desde el servidor (merge-friendly con la UI del store)
  let state: ProgressPortFile | null = null;
  let checksum = '';
  try {
    const text = await fetchProgress(input.playerId);
    state = JSON.parse(text) as ProgressPortFile;
    checksum = checksum8(text);
  } catch {
    // si el servidor no responde, el informe se genera con la data del store
    state = null;
    checksum = checksum8(JSON.stringify({ playerId: input.playerId, xp: input.xp, rank: input.rank, solo: 'store' }));
  }

  const solvedCount = (state?.progress ?? []).filter((p) => p.solved === 1).length;

  mainContent(doc, input, state, checksum);
  diplomaPage(doc, input, solvedCount, checksum);

  // marca global de verificación bajo el pie de la última página
  const total = doc.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.texto2);
    doc.text(`${input.playerId} · ${checksum.slice(0, 8)} · página ${i}/${total}`, PAGE_W / 2, PAGE_H - 6, { align: 'center' });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `bash-arena-informe-${input.playerName.replace(/[^a-z0-9-]+/gi, '_').toLowerCase() || input.playerId.slice(0, 8)}-${stamp}.pdf`;
  doc.save(filename);
  return filename;
}

/** barra de progreso al siguiente rango (misma aritmética que la Sidebar). */
export function xpBarPct(xp: number, nextAt: number | null): number {
  if (!nextAt) return 100;
  const prev = [...RANK_STEPS].reverse().find((v) => v <= xp) ?? 0;
  const span = Math.max(nextAt - prev, 1);
  return Math.min(100, Math.round(((xp - prev) / span) * 100));
}
