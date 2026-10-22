export interface SearchHit {
  to: string;
  label: string;
  section: string;
}

const INDEX: SearchHit[] = [
  { to: '/', label: 'Inicio', section: 'hero, demo de terminal, características' },
  { to: '/aprende', label: 'Qué se aprende', section: 'fundamentos, filtrado, búsqueda, awk/sed, permisos, procesos, redes, compresión, bash scripting, forense, boss' },
  { to: '/aprende', label: 'head', section: 'cut, sort, uniq, tr, grep, find, xargs' },
  { to: '/funciona', label: 'Cómo funciona', section: 'arquitectura, WebSocket, dockerode, contenedor efímero, hardening, modo persistente' },
  { to: '/funciona', label: 'Seguridad', section: 'threat model, no-new-privileges, cap-drop, pids-limit, sin red externa' },
  { to: '/desplegar', label: 'Desplegar', section: 'deploy.sh, stop.sh, backup, restore, variables de entorno, FAQ, troubleshooting' },
  { to: '/tecnico', label: 'Documentación técnica', section: 'estructura del repo, protocolo WebSocket, crear niveles, formato YAML, contribuir' },
  { to: '/tecnico', label: 'Protocolo', section: 'hello, start, input, resize, submitFlag, submitResult, hint, levelState' },
  { to: '/extras', label: 'Roadmap', section: 'sandbox, reto diario, tabla de clasificación, multi-jugador' },
  { to: '/extras', label: 'Créditos', section: 'licencia MIT, xterm.js, dockerode, React, Tailwind, Framer Motion' },
];

export function searchIndex(q: string): SearchHit[] {
  const qn = q.toLowerCase();
  return INDEX.filter((h) => `${h.label} ${h.section}`.toLowerCase().includes(qn));
}
