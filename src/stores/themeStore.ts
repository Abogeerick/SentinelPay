import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,

  toggleTheme: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      set({ isDarkMode: true });
      document.documentElement.classList.add('dark');
    } else {
      set({ isDarkMode: false });
      document.documentElement.classList.remove('dark');
    }
  }
}));