/** Modelo declarativo de un nivel (mirror del YAML en /levels). */

export type TrackId =
  | 'fundamentos'
  | 'filtrado'
  | 'busqueda'
  | 'procesado'
  | 'permisos'
  | 'procesos'
  | 'redes'
  | 'archivos'
  | 'scripting'
  | 'forense'
  | 'boss';

export type SecurityProfile = 'default' | 'sudo';

export interface CheatsheetEntry {
  cmd: string;
  desc: string;
}

export interface LevelDefinition {
  id: string;              // p. ej. fundamentos-l1
  track: TrackId;
  index: number;           // 1-based dentro del track
  title: string;
  subtitle?: string;
  xp: number;              // XP al resolverlo
  difficulty: 1 | 2 | 3 | 4 | 5;
  brief: string;           // historia/misión
  goal: string;            // objetivo en una frase
  /** Script de setup (bash, se ejecuta como root con $DOJO_FLAG persistida). */
  setup: string;
  /** Solución de referencia: imprimible y no incluye lectura de $DOJO_FLAG. */
  solution: string;
  hints: string[];         // progresivas, en orden
  cheatsheet: CheatsheetEntry[];
  teach: string;           // explicación post-nivel
  /** Post-solución: evitar atajos triviales se controla por diseño del scenario */
  keywords: string[];
  profile: SecurityProfile;
}

export interface TrackMetadata {
  id: TrackId;
  name: string;
  icon: string;
  color: string;           // hex del tema Nord·Dracula
  description: string;
  order: number;
}

export interface LevelPackage {
  level: LevelDefinition;
  track: TrackMetadata;
}
