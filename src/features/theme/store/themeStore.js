import { create } from "zustand";
import { THEME_PRESETS } from "../constants/themePresets";
const STORAGE_THEME_KEY = "mindcraft_active_theme_id_v1";
function loadSavedTheme() {
  try {
    const savedId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_THEME_KEY) : null;
    const found = THEME_PRESETS.find((t) => t.id === savedId);
    if (found) return found;
  } catch {
  }
  return THEME_PRESETS[0];
}
const useThemeStore = create((set) => ({
  currentTheme: loadSavedTheme(),
  isThemeModalOpen: false,
  setTheme: (presetId) => {
    const found = THEME_PRESETS.find((t) => t.id === presetId);
    if (found) {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, presetId);
      } catch {
      }
      set({ currentTheme: found });
    }
  },
  openThemeModal: () => set({ isThemeModalOpen: true }),
  closeThemeModal: () => set({ isThemeModalOpen: false })
}));
export {
  useThemeStore
};
