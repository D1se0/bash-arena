import { useEffect } from 'react';
import TerminalPane from './components/Terminal';
import Sidebar from './components/Sidebar';
import LevelPanel from './components/LevelPanel';
import { useArenaSocket } from './ws';
import { useArena } from './store';

export default function App() {
  useArenaSocket();
  const level = useArena((s) => s.level);

  // atajos: F11 pantalla completa · Ctrl+K foco terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
        <span className="ml-auto text-[11px] text-frost/40 hidden md:block">
          submit · hint · goal · status · next · reset · solution · start · help — Ctrl+C copia lo marcado (F11 = pantalla completa)
        </span>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <TerminalPane />
          </div>
          {level && <LevelPanel />}
        </div>
        <Sidebar />
      </main>

      <footer className="px-4 py-1.5 text-[11px] text-frost/40 border-t border-edge/30">
        bash-arena · MIT · un contenedor efímero por sesión, sin red externa, caps mínimos
      </footer>
    </div>
  );
}
