import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/site.css';

const base = (import.meta as unknown as { env?: { VITE_BASE?: string } }).env?.VITE_BASE ?? '/';

// GitHub Pages: si venimos del redirect de 404.html, restauramos la ruta
// interna ANTES de montar el router para que el deep-link funcione.
try {
  const saved = sessionStorage.getItem('ba-redirect');
  if (saved) {
    sessionStorage.removeItem('ba-redirect');
    history.replaceState(null, '', base + saved);
  }
} catch {
  /* sessionStorage bloqueado: sin deep-link robusto, pero la app carga */
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
