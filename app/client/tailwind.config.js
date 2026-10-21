/** Tailwind — paleta integrada Nord (frío) + Dracula (suave) */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#191D24',
        panel: '#22262E',
        panel2: '#2A2E37',
        edge: '#3B4252',
        nord0: '#2E3440',
        nord1: '#3B4252',
        nord4: '#D8DEE9',
        nord6: '#ECEFF4',
        ice: '#88C0D0',
        frost: '#81A1C1',
        deep: '#5E81AC',
        morado: '#B48EAD',
        verde: '#A3BE8C',
        arena: '#EBCB8B',
        coral: '#BF616A',
        naranja: '#D08770',
        ruby: '#F92672',
        tel: '#BD93F9',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 18px rgba(136,192,208,0.18)',
        glowP: '0 0 18px rgba(180,142,173,0.20)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
