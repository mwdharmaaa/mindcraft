import { create } from 'zustand';
import { ThemePreset } from '../types/theme.types';
import { THEME_PRESETS } from '../constants/themePresets';

interface ThemeStoreState {
  currentTheme: ThemePreset;
  isThemeModalOpen: boolean;
  setTheme: (presetId: string) => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
}

const STORAGE_THEME_KEY = 'mindcraft_active_theme_id_v1';

function loadSavedTheme(): ThemePreset {
  try {
    const savedId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_THEME_KEY) : null;
    const found = THEME_PRESETS.find((t) => t.id === savedId);
    if (found) return found;
  } catch {
    // fallback
  }
  return THEME_PRESETS[0];
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  currentTheme: loadSavedTheme(),
  isThemeModalOpen: false,

  setTheme: (presetId) => {
    const found = THEME_PRESETS.find((t) => t.id === presetId);
    if (found) {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, presetId);
      } catch {
        // quota
      }
      set({ currentTheme: found });
    }
  },

  openThemeModal: () => set({ isThemeModalOpen: true }),
  closeThemeModal: () => set({ isThemeModalOpen: false }),
}));
