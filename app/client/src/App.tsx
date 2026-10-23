import { useEffect } from 'react';
import TerminalPane from './components/Terminal';
import Sidebar from './components/Sidebar';
import LevelPanel from './components/LevelPanel';
import LevelBrowser from './components/LevelBrowser';
import { useArenaSocket } from './ws';
import { useArena } from './store';

export default function App() {
  useArenaSocket();
  const level = useArena((s) => s.level);
  const fullscreen = useArena((s) => s.termFullscreen);
  const setFullscreen = useArena((s) => s.setTermFullscreen);
  const browserOpen = useArena((s) => s.browserOpen);
  const setBrowserOpen = useArena((s) => s.setBrowserOpen);

  // atajos: F11 pantalla completa del navegador · Esc sale del zoom de terminal.
  // CAPTURE phase: xterm.js hace stopPropagation() del keydown en su textarea
  // y con un listener normal (bubble) el Esc nunca llegaría aquí.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
      if (e.key === 'Escape' && !browserOpen && useArena.getState().termFullscreen) {
        // consume el Esc para que no llegue al shell de la terminal
        e.preventDefault();
        e.stopPropagation();
        setFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [browserOpen, setFullscreen]);

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-2 border-b border-edge/40">
        <span className="font-mono text-ice text-sm" aria-hidden>
          <span className="text-morado">[</span>bash<span className="text-morado">-</span>arena
          <span className="text-morado">]</span>
        </span>
        <span className="text-xs text-frost/60 hidden sm:block">
          terminal real · Ubuntu en Docker · flags validadas en servidor
        </span>
        <button
          onClick={() => setBrowserOpen(true)}
          className="ml-auto rounded-lg bg-panel2 hover:bg-edge border border-edge/60 px-3 py-1.5 text-xs font-medium text-nord6 flex items-center gap-1.5"
          title="explorar todas las secciones y niveles del dojo"
        >
          <span aria-hidden>🗂</span> niveles
        </button>
        <span className="text-[11px] text-frost/40 hidden md:block">
          submit · hint · solution · next · status — Ctrl+C copia lo marcado
        </span>
      </header>

      {/* <lg el scroll vive aquí dentro (no en la página): nada de la App se
          desborda fuera del viewport */}
      <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* SIN min-h-0 aquí: la min-height natural de la rama (barra +
              terminal con su min-h-[280px]) es el piso del flexbox; el panel
              inferior — con min-h-0 y overflow-y-auto — es quien se encoge
              con scroll cuando el form/cheat sheet engordan. Con min-h-0 en
              la rama podía encogerse por debajo de sus 280px y la terminal
              desbordaba pintando sobre el panel. */}
          {/* shrink-0 también: en <lg el scroll lo lleva el main (los hijos no
              se encogen); en lg el piso lo da la min-height natural de la rama
              (barra + terminal 280px) y el panel inferior es quien cede */}
          <div className={fullscreen ? 'contents' : 'flex-1 shrink-0 flex flex-col gap-2'}>
            {/* barra de acciones de la terminal (en fullscreen es overlay) */}
            <div
              className={
                fullscreen
                  ? 'fixed top-1 left-1 right-1 z-40 flex items-center gap-2 rounded-lg bg-panel/90 border border-edge/60 px-3 py-1.5'
                  : 'flex items-center gap-2 text-xs text-frost/60'
              }
            >
              <span aria-hidden>⌨️</span>
              <span className={fullscreen ? 'text-xs text-frost/80' : ''}>
                {fullscreen ? 'terminal en pantalla completa' : 'terminal'}
              </span>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="ml-auto rounded border border-edge/60 hover:border-ice/60 hover:text-ice px-2 py-0.5 text-[11px] flex items-center gap-1"
                title={fullscreen ? 'salir de pantalla completa (Esc)' : 'ampliar la terminal a pantalla completa'}
              >
                <span aria-hidden>{fullscreen ? '×' : '⛶'}</span>
                {fullscreen ? 'salir (Esc)' : 'pantalla completa'}
              </button>
              <button
                onClick={() => setBrowserOpen(true)}
                className="ml-1 rounded border border-edge/60 hover:border-ice/60 hover:text-ice px-2 py-0.5 text-[11px] flex items-center gap-1"
                title="elegir qué comando practicar"
              >
                <span aria-hidden>🗂</span> niveles
              </button>
            </div>
            {/* min-h garantizado EN el wrapper (no en la caja interior): así
                flexbox nunca encoge la terminal por debajo de 280px y el panel
                inferior es quien cede espacio (scroll interno) — sin este
                wrapper la terminal desbordaba y solapaba el panel cuando el
                formulario de flag + cheat sheet engordan */}
            <div className={fullscreen ? 'fixed inset-x-1 top-9 bottom-1 z-40 min-h-0' : 'flex-1 min-h-[280px]'}>
              <TerminalPane fullscreen={fullscreen} />
            </div>
          </div>
          {level && <LevelPanel />}
        </div>
        <Sidebar />
      </main>

      <footer className="px-4 py-1.5 text-[11px] text-frost/40 border-t border-edge/30">
        bash-arena · MIT · un contenedor efímero por sesión, sin red externa, caps mínimos
      </footer>

      <LevelBrowser />
    </div>
  );
}
