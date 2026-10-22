export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // tripletas rgb definidas en site.css conmutables tema claro/oscuro
        base: 'rgb(var(--c-base) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        panel2: 'rgb(var(--c-panel2) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
        ice: 'rgb(var(--c-ice) / <alpha-value>)',
        frost: 'rgb(var(--c-frost) / <alpha-value>)',
        deep: 'rgb(var(--c-deep) / <alpha-value>)',
        morado: 'rgb(var(--c-morado) / <alpha-value>)',
        verde: 'rgb(var(--c-verde) / <alpha-value>)',
        arena: 'rgb(var(--c-arena) / <alpha-value>)',
        coral: 'rgb(var(--c-coral) / <alpha-value>)',
        naranja: 'rgb(var(--c-naranja) / <alpha-value>)',
        nord0: 'rgb(var(--c-nord0) / <alpha-value>)',
        nord1: 'rgb(var(--c-nord1) / <alpha-value>)',
        nord4: 'rgb(var(--c-nord4) / <alpha-value>)',
        nord6: 'rgb(var(--c-nord6) / <alpha-value>)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
