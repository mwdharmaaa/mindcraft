import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('project/web/mindcraft');
const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';

function commit(files, message) {
  const fileArgs = files.map((f) => `"${f}"`).join(' ');
  execSync(`"${GIT}" -C "${ROOT}" add ${fileArgs}`, { stdio: 'pipe' });
  execSync(`"${GIT}" -C "${ROOT}" commit -m "${message}"`, { stdio: 'pipe' });
  console.log(`[COMMIT] ${message}`);
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 73. theme.types.ts
writeFile(
  'src/features/theme/types/theme.types.ts',
  `import { BackgroundVariant } from '@xyflow/react';

export interface ThemePreset {
  id: string;
  name: string;
  canvasBg: string;
  dotColor: string;
  dotSize: number;
  dotGap: number;
  variant: BackgroundVariant;
  panelBg: string;
  borderColor: string;
  primaryAccent: string;
}
`
);
commit(['src/features/theme/types/theme.types.ts'], 'feat(theme): define ThemePreset and CanvasBackgroundConfig contracts');

// 74. themePresets.ts
writeFile(
  'src/features/theme/constants/themePresets.ts',
  `import { BackgroundVariant } from '@xyflow/react';
import { ThemePreset } from '../types/theme.types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'zinc-noir',
    name: 'Zinc Noir',
    canvasBg: '#09090b',
    dotColor: 'rgba(244, 244, 245, 0.12)',
    dotSize: 1.5,
    dotGap: 20,
    variant: BackgroundVariant.Dots,
    panelBg: '#18181b',
    borderColor: '#3f3f46',
    primaryAccent: '#f4f4f5',
  },
  {
    id: 'obsidian-grid',
    name: 'Obsidian Grid',
    canvasBg: '#0b0f14',
    dotColor: 'rgba(56, 189, 248, 0.12)',
    dotSize: 1,
    dotGap: 24,
    variant: BackgroundVariant.Lines,
    panelBg: '#111827',
    borderColor: '#1f2937',
    primaryAccent: '#38bdf8',
  },
  {
    id: 'monochrome-pure',
    name: 'Monochrome Pure',
    canvasBg: '#000000',
    dotColor: 'rgba(255, 255, 255, 0.15)',
    dotSize: 1.5,
    dotGap: 20,
    variant: BackgroundVariant.Dots,
    panelBg: '#121212',
    borderColor: '#262626',
    primaryAccent: '#ffffff',
  },
  {
    id: 'slate-cross',
    name: 'Slate Blueprint',
    canvasBg: '#0f172a',
    dotColor: 'rgba(148, 163, 184, 0.15)',
    dotSize: 2,
    dotGap: 28,
    variant: BackgroundVariant.Cross,
    panelBg: '#1e293b',
    borderColor: '#334155',
    primaryAccent: '#94a3b8',
  },
];
`
);
commit(['src/features/theme/constants/themePresets.ts'], 'feat(theme): define zinc noir slate and monochrome theme presets');

// 75. themeStore.ts
writeFile(
  'src/features/theme/store/themeStore.ts',
  `import { create } from 'zustand';
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
`
);
commit(['src/features/theme/store/themeStore.ts'], 'feat(theme): implement themeStore with localStorage persistence');

// 76. ThemePreviewCard.tsx
writeFile(
  'src/features/theme/components/ThemePreviewCard.tsx',
  `import React from 'react';
import { ThemePreset } from '../types/theme.types';
import { Check } from 'lucide-react';

interface ThemePreviewCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  preset,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={\`cursor-pointer rounded-xl border p-3.5 transition-all flex items-center justify-between \${
        isActive
          ? 'bg-zinc-800 border-zinc-200 shadow-md ring-2 ring-zinc-500/20'
          : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
      }\`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border border-zinc-700 shadow-inner flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: preset.canvasBg }}
        >
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: preset.primaryAccent }}
          />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-100">{preset.name}</h4>
          <p className="text-[11px] font-mono text-zinc-400 capitalize">
            {preset.variant} &bull; {preset.dotGap}px
          </p>
        </div>
      </div>
      {isActive && (
        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-950 flex items-center justify-center">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
`
);
commit(['src/features/theme/components/ThemePreviewCard.tsx'], 'feat(theme): create ThemePreviewCard visual swatch component');

// 77. ThemeSelectorModal.tsx
writeFile(
  'src/features/theme/components/ThemeSelectorModal.tsx',
  `import React from 'react';
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
`
);
commit(['src/features/theme/components/ThemeSelectorModal.tsx'], 'feat(theme): create ThemeSelectorModal palette selector dialog');

// 78. Add theme button trigger in CanvasActionButtons.tsx
const actionButtonsPath = path.join(ROOT, 'src/features/toolbar/components/header/CanvasActionButtons.tsx');
let actionButtonsContent = fs.readFileSync(actionButtonsPath, 'utf8');
actionButtonsContent = actionButtonsContent.replace(
  "import { Share2, Keyboard, FilePlus, RotateCcw, Search, FolderKanban } from 'lucide-react';",
  "import { Share2, Keyboard, FilePlus, RotateCcw, Search, FolderKanban, Palette } from 'lucide-react';"
);
actionButtonsContent = actionButtonsContent.replace(
  '  onProjects?: () => void;\n}',
  '  onProjects?: () => void;\n  onTheme?: () => void;\n}'
);
actionButtonsContent = actionButtonsContent.replace(
  '  onProjects,\n}) => {',
  '  onProjects,\n  onTheme,\n}) => {'
);
actionButtonsContent = actionButtonsContent.replace(
  '      <button\n        onClick={onExport}',
  `      {onTheme && (
        <button
          onClick={onTheme}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Customize theme (Ctrl+Shift+T)"
        >
          <Palette className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onExport}`
);
fs.writeFileSync(actionButtonsPath, actionButtonsContent, 'utf8');

const topNavPath = path.join(ROOT, 'src/features/toolbar/components/TopNavigation.tsx');
let topNavContent = fs.readFileSync(topNavPath, 'utf8');
topNavContent = topNavContent.replace(
  "import { CanvasActionButtons } from './header/CanvasActionButtons';",
  `import { CanvasActionButtons } from './header/CanvasActionButtons';
import { useThemeStore } from '@/features/theme/store/themeStore';`
);
topNavContent = topNavContent.replace(
  'export const TopNavigation: React.FC<TopNavigationProps> = ({\n  onOpenExport,\n  onOpenShortcuts,\n}) => {',
  `export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenExport,
  onOpenShortcuts,
}) => {
  const openThemeModal = useThemeStore((s) => s.openThemeModal);`
);
topNavContent = topNavContent.replace(
  '          onProjects={openProjectModal}\n        />',
  '          onProjects={openProjectModal}\n          onTheme={openThemeModal}\n        />'
);
fs.writeFileSync(topNavPath, topNavContent, 'utf8');
commit(
  ['src/features/toolbar/components/header/CanvasActionButtons.tsx', 'src/features/toolbar/components/TopNavigation.tsx'],
  'feat(toolbar): add theme palette switcher button in top navigation'
);

// 79. Update MindMapCanvas.tsx to read theme
const canvasPath = path.join(ROOT, 'src/features/canvas/components/MindMapCanvas.tsx');
let canvasContent = fs.readFileSync(canvasPath, 'utf8');
canvasContent = canvasContent.replace(
  "import { CanvasWheelController } from './CanvasWheelController';",
  `import { CanvasWheelController } from './CanvasWheelController';
import { useThemeStore } from '@/features/theme/store/themeStore';`
);
canvasContent = canvasContent.replace(
  '  useKeyboardNavigation();',
  `  useKeyboardNavigation();
  const currentTheme = useThemeStore((s) => s.currentTheme);`
);
canvasContent = canvasContent.replace(
  '<div\n      className="w-full h-full relative bg-[#09090b]"',
  '<div\n      className="w-full h-full relative"\n      style={{ backgroundColor: currentTheme.canvasBg }}'
);
canvasContent = canvasContent.replace(
  `        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="rgba(244, 244, 245, 0.12)"
        />`,
  `        <Background
          variant={currentTheme.variant}
          gap={currentTheme.dotGap}
          size={currentTheme.dotSize}
          color={currentTheme.dotColor}
        />`
);
fs.writeFileSync(canvasPath, canvasContent, 'utf8');
commit(['src/features/canvas/components/MindMapCanvas.tsx'], 'feat(canvas): bind dynamic theme styling to canvas background and minimap');

// 80. Mount ThemeSelectorModal in App.tsx
const appPath = path.join(ROOT, 'src/app/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(
  "import { ProjectListModal } from '@/features/projects/components/ProjectListModal';",
  `import { ProjectListModal } from '@/features/projects/components/ProjectListModal';
import { ThemeSelectorModal } from '@/features/theme/components/ThemeSelectorModal';
import { useThemeStore } from '@/features/theme/store/themeStore';`
);
appContent = appContent.replace(
  'const { isSearchOpen, closeSearch, isProjectModalOpen, closeProjectModal } = useMindMapStore();',
  `const { isSearchOpen, closeSearch, isProjectModalOpen, closeProjectModal } = useMindMapStore();
  const { isThemeModalOpen, closeThemeModal } = useThemeStore();`
);
appContent = appContent.replace(
  '      <ProjectListModal\n        isOpen={isProjectModalOpen}\n        onClose={closeProjectModal}\n      />\n    </main>',
  `      <ProjectListModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={closeThemeModal}
      />
    </main>`
);
fs.writeFileSync(appPath, appContent, 'utf8');
commit(['src/app/App.tsx'], 'feat(app): mount ThemeSelectorModal in root application');

// 81. themeContrast.ts
writeFile(
  'src/features/theme/utils/themeContrast.ts',
  `export function isDarkHexColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return true;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
`
);
commit(['src/features/theme/utils/themeContrast.ts'], 'feat(theme): implement themeContrast helper for dynamic text readability');

// 82. Add theme hotkey (Ctrl+Shift+T) in useKeyboardNavigation.ts
const keyNavPath = path.join(ROOT, 'src/features/canvas/hooks/useKeyboardNavigation.ts');
let keyNavContent = fs.readFileSync(keyNavPath, 'utf8');
keyNavContent = keyNavContent.replace(
  "import { useMindMapStore } from '@/features/canvas/store/mindMapStore';",
  `import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { useThemeStore } from '@/features/theme/store/themeStore';`
);
keyNavContent = keyNavContent.replace(
  'export function useKeyboardNavigation() {\n  const {',
  `export function useKeyboardNavigation() {
  const openThemeModal = useThemeStore((s) => s.openThemeModal);
  const {`
);
keyNavContent = keyNavContent.replace(
  '      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === \'k\') {\n        e.preventDefault();\n        openSearch();\n        return;\n      }\n',
  `      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openThemeModal();
        return;
      }
`
);
fs.writeFileSync(keyNavPath, keyNavContent, 'utf8');
commit(['src/features/canvas/hooks/useKeyboardNavigation.ts'], 'feat(canvas): add shortcut to toggle theme modal');

console.log('Batch 7 complete: 10 commits added.');
