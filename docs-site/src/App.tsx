import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import Learn from './pages/Learn';
import HowItWorks from './pages/HowItWorks';
import Deploy from './pages/Deploy';
import Technical from './pages/Technical';
import Extras from './pages/Extras';
import { searchIndex, SearchHit } from './search';
import { useTheme } from './theme';

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/aprende', label: 'Qué se aprende' },
  { to: '/funciona', label: 'Cómo funciona' },
  { to: '/desplegar', label: 'Desplegar' },
  { to: '/tecnico', label: 'Documentación técnica' },
  { to: '/extras', label: 'Roadmap y créditos' },
];

export default function App() {
  const { mode, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const location = useLocation();

  // scroll-to-top suave en cada navegación
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.className = mode;
  }, [mode]);

  const hits: SearchHit[] = useMemo(
    () => (query.trim().length >= 2 ? searchIndex(query) : []),
    [query],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-base/80 border-b border-edge/50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="font-mono text-ice">
            <span className="text-morado">[</span>bash-arena<span className="text-morado">]</span>
            <span className="text-frost/60 text-xs ml-2 hidden sm:inline">docs</span>
          </Link>
          <nav className="hidden md:flex gap-1 ml-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-2 py-1 rounded text-sm ${location.pathname === n.to ? 'bg-edge/60 text-nord6' : 'text-frost/80 hover:text-ice'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="buscar en la documentación…"
              aria-label="buscar en la documentación"
              className="w-36 sm:w-56 rounded-lg bg-panel border border-edge/60 px-3 py-1.5 text-sm focus:border-ice outline-none"
            />
            <button
              onClick={toggle}
              className="rounded-lg border border-edge/60 px-2 py-1.5 text-sm hover:bg-edge/40"
              title="claro/oscuro"
            >
              {mode === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
        {hits.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-3 w-full">
            <motion.div initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="rounded-xl bg-panel border border-edge/60 divide-y divide-edge/30">
              {hits.map((h) => (
                <Link key={h.to + h.label} to={h.to} onClick={() => setQuery('')}
                  className="block px-3 py-2 hover:bg-edge/30 text-sm">
                  <span className="text-ice">{h.label}</span>
                  <span className="text-frost/60 ml-2">{h.section}</span>
                </Link>
              ))}
              {hits.length === 0 && <div className="px-3 py-2 text-frost/60 text-sm">sin resultados</div>}
            </motion.div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {location.pathname === '/' && <Home />}
          {location.pathname === '/aprende' && <Learn />}
          {location.pathname === '/funciona' && <HowItWorks />}
          {location.pathname === '/desplegar' && <Deploy />}
          {location.pathname === '/tecnico' && <Technical />}
          {location.pathname === '/extras' && <Extras />}
        </motion.div>
      </main>

      <footer className="border-t border-edge/40 py-6 text-center text-xs text-frost/50">
        bash-arena · MIT · D1se0 ·^un contenedor efímero por sesión, sin red externa, flags validadas en servidor
      </footer>
    </div>
  );
}
