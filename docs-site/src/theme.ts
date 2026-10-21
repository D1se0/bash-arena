import { create } from 'zustand';

type Mode = 'dark' | 'light';

export const useTheme = create<{ mode: Mode; toggle: () => void }>((set) => ({
  mode: (localStorage.getItem('docs-theme') as Mode) ?? 'dark',
  toggle: () =>
    set((s) => {
      const mode = s.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('docs-theme', mode);
      return { mode };
    }),
}));
