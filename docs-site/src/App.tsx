import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Learn from './pages/Learn';
import HowItWorks from './pages/HowItWorks';
import Deploy from './pages/Deploy';
import Technical from './pages/Technical';
import Extras from './pages/Extras';
// la página de soluciones arrastra el catálogo entero (194 niveles): carga diferida
const Soluciones = lazy(() => import('./pages/Soluciones'));
import { searchIndex, SearchHit } from './search';
import { useTheme } from './theme';

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/aprende', label: 'Qué se aprende' },
  { to: '/funciona', label: 'Cómo funciona' },
  { to: '/desplegar', label: 'Desplegar' },
  { to: '/tecnico', label: 'Documentación técnica' },
  { to: '/extras', label: 'Roadmap y créditos' },
  { to: '/soluciones', label: 'Soluciones' },
];

export default function App() {
  const { mode, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // scroll-to-top suave en cada navegación
  useEffect(() => {
    setMenuOpen(false);
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
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3 sm:gap-4 min-w-0">
          <Link to="/" className="font-mono text-nord6 shrink-0 whitespace-nowrap">
            <span className="text-morado">[</span>bash-arena<span className="text-morado">]</span>
            <span className="text-frost/60 text-xs ml-2 hidden sm:inline">docs</span>
          </Link>
          <nav className="hidden xl:flex gap-1 ml-2 overflow-x-auto">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-2 py-1 rounded text-sm whitespace-nowrap ${location.pathname === n.to ? 'bg-edge/60 text-ice' : 'text-frost/80 hover:text-ice'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 min-w-0 flex-nowrap">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="buscar…"
              aria-label="buscar en la documentación"
              className="w-28 sm:w-56 min-w-0 rounded-lg bg-panel border border-edge/60 px-3 py-1.5 text-sm text-nord6 placeholder:text-frost/50 focus:border-ice outline-none"
            />
            <button
              onClick={toggle}
              className="rounded-lg border border-edge/60 px-2 py-1.5 text-sm hover:bg-edge/40"
              title="claro/oscuro"
            >
              {mode === 'dark' ? '🌞' : '🌙'}
            </button>
            {/* hamburguesa móvil */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="abrir menú"
              className="xl:hidden rounded-lg border border-edge/60 px-2.5 py-1.5 text-lg leading-none text-ice"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* resultados del buscador */}
        <AnimatePresence>
          {hits.length > 0 && (
            <motion.div
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              className="max-w-6xl mx-auto px-4 pb-3 w-full"
            >
              <div className="rounded-xl bg-panel border border-edge/60 divide-y divide-edge/30">
                {hits.map((h) => (
                  <Link key={h.to + h.label} to={h.to} onClick={() => setQuery('')}
                    className="block px-3 py-2 hover:bg-edge/30 text-sm">
                    <span className="text-ice">{h.label}</span>
                    <span className="text-frost/60 ml-2">{h.section}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* panel móvil */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden overflow-hidden border-t border-edge/40"
            >
              <nav className="flex flex-col gap-0.5 p-3">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      location.pathname === n.to ? 'bg-edge/60 text-ice' : 'text-frost/85 hover:bg-edge/30'
                    }`}>
                    {n.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Suspense fallback={<p className="text-sm text-frost/60">cargando soluciones…</p>}>
          {location.pathname === '/' && <Home />}
          {location.pathname === '/aprende' && <Learn />}
          {location.pathname === '/funciona' && <HowItWorks />}
          {location.pathname === '/desplegar' && <Deploy />}
          {location.pathname === '/tecnico' && <Technical />}
          {location.pathname === '/extras' && <Extras />}
          {location.pathname === '/soluciones' && <Soluciones />}
          </Suspense>
        </motion.div>
      </main>

      <footer className="border-t border-edge/40 py-6 text-center text-xs text-frost/50">
        bash-arena · MIT · D1se0 · un contenedor efímero por sesión, sin red externa, flags validadas en servidor
      </footer>
    </div>
  );
}
