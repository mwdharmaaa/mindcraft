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

// 83. ZoomInButton.tsx
writeFile(
  'src/features/canvas/components/controls/ZoomInButton.tsx',
  `import React from 'react';
import { Plus } from 'lucide-react';

interface ZoomInButtonProps {
  onClick: () => void;
}

export const ZoomInButton: React.FC<ZoomInButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Zoom in (+)"
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  );
};
`
);
commit(['src/features/canvas/components/controls/ZoomInButton.tsx'], 'feat(canvas): create ZoomInButton with discrete step zoom');

// 84. ZoomOutButton.tsx
writeFile(
  'src/features/canvas/components/controls/ZoomOutButton.tsx',
  `import React from 'react';
import { Minus } from 'lucide-react';

interface ZoomOutButtonProps {
  onClick: () => void;
}

export const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Zoom out (-)"
    >
      <Minus className="w-3.5 h-3.5" />
    </button>
  );
};
`
);
commit(['src/features/canvas/components/controls/ZoomOutButton.tsx'], 'feat(canvas): create ZoomOutButton with discrete step zoom');

// 85. ZoomFitButton.tsx
writeFile(
  'src/features/canvas/components/controls/ZoomFitButton.tsx',
  `import React from 'react';
import { Maximize2 } from 'lucide-react';

interface ZoomFitButtonProps {
  onClick: () => void;
}

export const ZoomFitButton: React.FC<ZoomFitButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Fit view (Ctrl+9)"
    >
      <Maximize2 className="w-3.5 h-3.5" />
    </button>
  );
};
`
);
commit(['src/features/canvas/components/controls/ZoomFitButton.tsx'], 'feat(canvas): create ZoomFitButton with animated viewport fitting');

// 86. ResetZoomButton.tsx
writeFile(
  'src/features/canvas/components/controls/ResetZoomButton.tsx',
  `import React from 'react';

interface ResetZoomButtonProps {
  zoomPercent: number;
  onClick: () => void;
}

export const ResetZoomButton: React.FC<ResetZoomButtonProps> = ({ zoomPercent, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
      title="Reset zoom to 100% (Ctrl+0)"
    >
      {zoomPercent}%
    </button>
  );
};
`
);
commit(['src/features/canvas/components/controls/ResetZoomButton.tsx'], 'feat(canvas): create ResetZoomButton to restore 100 percent scale');

// 87. CanvasZoomWidget.tsx
writeFile(
  'src/features/canvas/components/controls/CanvasZoomWidget.tsx',
  `import React from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { ZoomInButton } from './ZoomInButton';
import { ZoomOutButton } from './ZoomOutButton';
import { ZoomFitButton } from './ZoomFitButton';
import { ResetZoomButton } from './ResetZoomButton';

export const CanvasZoomWidget: React.FC = () => {
  const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);

  const handleResetZoom = () => {
    const vp = getViewport();
    setViewport({ x: vp.x, y: vp.y, zoom: 1 }, { duration: 200 });
  };

  return (
    <aside className="absolute bottom-6 right-6 z-20 flex items-center gap-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-1 shadow-2xl select-none">
      <ZoomOutButton onClick={() => zoomOut({ duration: 150 })} />
      <ResetZoomButton zoomPercent={zoomPercent} onClick={handleResetZoom} />
      <ZoomInButton onClick={() => zoomIn({ duration: 150 })} />
      <div className="w-px h-3.5 bg-zinc-800 mx-0.5" />
      <ZoomFitButton onClick={() => fitView({ padding: 0.2, duration: 250 })} />
    </aside>
  );
};
`
);
commit(['src/features/canvas/components/controls/CanvasZoomWidget.tsx'], 'feat(canvas): create floating CanvasZoomWidget container');

// 88. Mount CanvasZoomWidget in MindMapCanvas.tsx
const canvasPath = path.join(ROOT, 'src/features/canvas/components/MindMapCanvas.tsx');
let canvasContent = fs.readFileSync(canvasPath, 'utf8');
canvasContent = canvasContent.replace(
  "import { useThemeStore } from '@/features/theme/store/themeStore';",
  `import { useThemeStore } from '@/features/theme/store/themeStore';
import { CanvasZoomWidget } from './controls/CanvasZoomWidget';`
);
canvasContent = canvasContent.replace(
  '        <MiniMap\n',
  '        <CanvasZoomWidget />\n\n        <MiniMap\n'
);
fs.writeFileSync(canvasPath, canvasContent, 'utf8');
commit(['src/features/canvas/components/MindMapCanvas.tsx'], 'feat(canvas): mount CanvasZoomWidget inside canvas viewport overlay');

// 89. Add zoom hotkeys in useKeyboardNavigation.ts
const keyNavPath = path.join(ROOT, 'src/features/canvas/hooks/useKeyboardNavigation.ts');
let keyNavContent = fs.readFileSync(keyNavPath, 'utf8');
keyNavContent = keyNavContent.replace(
  "import { useThemeStore } from '@/features/theme/store/themeStore';",
  `import { useThemeStore } from '@/features/theme/store/themeStore';
import { useReactFlow } from '@xyflow/react';`
);
keyNavContent = keyNavContent.replace(
  'export function useKeyboardNavigation() {\n  const openThemeModal = useThemeStore((s) => s.openThemeModal);',
  `export function useKeyboardNavigation() {
  const { fitView, setViewport, getViewport } = useReactFlow();
  const openThemeModal = useThemeStore((s) => s.openThemeModal);`
);
keyNavContent = keyNavContent.replace(
  '      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === \'t\') {\n        e.preventDefault();\n        openThemeModal();\n        return;\n      }\n',
  `      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openThemeModal();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        const vp = getViewport();
        setViewport({ x: vp.x, y: vp.y, zoom: 1 }, { duration: 200 });
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '9') {
        e.preventDefault();
        fitView({ padding: 0.2, duration: 250 });
        return;
      }
`
);
keyNavContent = keyNavContent.replace(
  'undo, redo, openSearch, duplicateSubtree, copySubtree, pasteSubtree]);',
  'undo, redo, openSearch, duplicateSubtree, copySubtree, pasteSubtree, fitView, setViewport, getViewport]);'
);
fs.writeFileSync(keyNavPath, keyNavContent, 'utf8');
commit(['src/features/canvas/hooks/useKeyboardNavigation.ts'], 'feat(canvas): add Ctrl+0 and Ctrl+9 zoom navigation shortcuts');

// 90. Update ShortcutsDialog.tsx with zoom control shortcuts
const shortcutsPath = path.join(ROOT, 'src/features/toolbar/components/ShortcutsDialog.tsx');
let shortcutsContent = fs.readFileSync(shortcutsPath, 'utf8');
shortcutsContent = shortcutsContent.replace(
  "  { key: 'Ctrl + K or /', desc: 'Quick search cards' },",
  `  { key: 'Ctrl + K or /', desc: 'Quick search cards' },
  { key: 'Ctrl + 0', desc: 'Reset zoom to 100%' },
  { key: 'Ctrl + 9', desc: 'Fit canvas to view' },
  { key: 'Ctrl + Shift + T', desc: 'Open theme selector' },`
);
fs.writeFileSync(shortcutsPath, shortcutsContent, 'utf8');
commit(['src/features/toolbar/components/ShortcutsDialog.tsx'], 'docs(shortcuts): document canvas zoom control keyboard shortcuts');

console.log('Batch 8 complete: 8 commits added.');
