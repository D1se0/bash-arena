export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#191D24',
        panel: '#22262E',
        edge: '#3B4252',
        ice: '#88C0D0',
        frost: '#81A1C1',
        deep: '#5E81AC',
        morado: '#B48EAD',
        verde: '#A3BE8C',
        arena: '#EBCB8B',
        coral: '#BF616A',
        naranja: '#D08770',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
