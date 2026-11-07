import React from 'react';
import { THEME_PRESETS } from '../constants/themePresets';
import { useThemeStore } from '../store/themeStore';
import { ThemePreviewCard } from './ThemePreviewCard';
import { Palette, X } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-100">Canvas Theme & Canvas Style</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {THEME_PRESETS.map((preset) => (
            <ThemePreviewCard
              key={preset.id}
              preset={preset}
              isActive={preset.id === currentTheme.id}
              onSelect={() => {
                setTheme(preset.id);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
