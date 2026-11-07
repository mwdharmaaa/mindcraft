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

// 16. BrandLogo.tsx
writeFile(
  'src/features/toolbar/components/header/BrandLogo.tsx',
  `import React from 'react';
import { Network } from 'lucide-react';

export const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
        <Network className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-sm tracking-tight text-zinc-100">MindCraft</span>
        <span className="text-[10px] font-mono uppercase text-zinc-400">Story Studio</span>
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/header/BrandLogo.tsx'], 'feat(toolbar): extract BrandLogo header identity component');

// 17. HistoryControls.tsx
writeFile(
  'src/features/toolbar/components/header/HistoryControls.tsx',
  `import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo }) => {
  return (
    <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      <button
        onClick={onUndo}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/header/HistoryControls.tsx'], 'feat(toolbar): extract HistoryControls undo redo action group');

// 18. ConnectorSelector.tsx
writeFile(
  'src/features/toolbar/components/header/ConnectorSelector.tsx',
  `import React from 'react';
import { ConnectorType } from '@/features/canvas/store/mindMapStore.types';

interface ConnectorSelectorProps {
  current: ConnectorType;
  onChange: (type: ConnectorType) => void;
}

export const ConnectorSelector: React.FC<ConnectorSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      {(['smoothstep', 'bezier', 'straight'] as ConnectorType[]).map((conn) => (
        <button
          key={conn}
          onClick={() => onChange(conn)}
          className={\`px-2.5 py-1 text-xs rounded-lg capitalize transition-all \${
            current === conn
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-600 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }\`}
        >
          {conn === 'smoothstep' ? 'Step' : conn}
        </button>
      ))}
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/header/ConnectorSelector.tsx'], 'feat(toolbar): extract ConnectorSelector edge routing switcher');

// 19. LayoutSelector.tsx
writeFile(
  'src/features/toolbar/components/header/LayoutSelector.tsx',
  `import React from 'react';
import { LayoutDirection } from '@/features/canvas/store/mindMapStore.types';

interface LayoutSelectorProps {
  current: LayoutDirection;
  onApply: (dir: LayoutDirection) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ current, onApply }) => {
  return (
    <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
        {(['LR', 'TB', 'RADIAL'] as LayoutDirection[]).map((dir) => (
          <button
            key={dir}
            onClick={() => onApply(dir)}
            className={\`px-2 py-0.5 text-[11px] rounded transition-all \${
              current === dir
                ? 'bg-zinc-700 text-zinc-100 font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }\`}
            title={\`Auto-layout: \${dir === 'LR' ? 'Horizontal Tree' : dir === 'TB' ? 'Vertical Tree' : 'Radial'}\`}
          >
            {dir === 'LR' ? 'Tree H' : dir === 'TB' ? 'Tree V' : 'Radial'}
          </button>
        ))}
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/header/LayoutSelector.tsx'], 'feat(toolbar): extract LayoutSelector auto layout switcher');

// 20. CanvasStatusIndicator.tsx
writeFile(
  'src/features/toolbar/components/header/CanvasStatusIndicator.tsx',
  `import React from 'react';

interface CanvasStatusIndicatorProps {
  lastSavedAt: number | null;
}

export const CanvasStatusIndicator: React.FC<CanvasStatusIndicatorProps> = ({ lastSavedAt }) => {
  if (!lastSavedAt) return null;

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono pl-3 border-l border-zinc-800">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
      <span>Saved</span>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/header/CanvasStatusIndicator.tsx'], 'feat(toolbar): extract CanvasStatusIndicator local persistence status badge');

// 21. CanvasActionButtons.tsx
writeFile(
  'src/features/toolbar/components/header/CanvasActionButtons.tsx',
  `import React from 'react';
import { Share2, Keyboard, FilePlus, RotateCcw } from 'lucide-react';

interface CanvasActionButtonsProps {
  onExport: () => void;
  onShortcuts: () => void;
  onBlank: () => void;
  onReset: () => void;
}

export const CanvasActionButtons: React.FC<CanvasActionButtonsProps> = ({
  onExport,
  onShortcuts,
  onBlank,
  onReset,
}) => {
  return (
    <>
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg text-zinc-100 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 font-medium transition-all shadow-sm"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Export</span>
      </button>

      <button
        onClick={onShortcuts}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-0.5 pl-1 border-l border-zinc-800">
        <button
          onClick={onBlank}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="New blank map"
        >
          <FilePlus className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Reset to story template"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
`
);
commit(['src/features/toolbar/components/header/CanvasActionButtons.tsx'], 'feat(toolbar): extract CanvasActionButtons utility controls group');

// 22. TopNavigation.tsx refactor
writeFile(
  'src/features/toolbar/components/TopNavigation.tsx',
  `import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { BrandLogo } from './header/BrandLogo';
import { HistoryControls } from './header/HistoryControls';
import { ConnectorSelector } from './header/ConnectorSelector';
import { LayoutSelector } from './header/LayoutSelector';
import { CanvasStatusIndicator } from './header/CanvasStatusIndicator';
import { CanvasActionButtons } from './header/CanvasActionButtons';

interface TopNavigationProps {
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenExport,
  onOpenShortcuts,
}) => {
  const {
    undo,
    redo,
    resetCanvas,
    createBlankCanvas,
    connectorType,
    setConnectorType,
    layoutDirection,
    applyLayout,
    lastSavedAt,
  } = useMindMapStore();

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-2 pointer-events-auto shadow-xl">
        <BrandLogo />
        <CanvasStatusIndicator lastSavedAt={lastSavedAt} />
      </div>

      <div className="flex items-center gap-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-1 pointer-events-auto shadow-xl">
        <HistoryControls onUndo={undo} onRedo={redo} />
        <ConnectorSelector current={connectorType} onChange={setConnectorType} />
        <LayoutSelector current={layoutDirection} onApply={applyLayout} />
        <CanvasActionButtons
          onExport={onOpenExport}
          onShortcuts={onOpenShortcuts}
          onBlank={createBlankCanvas}
          onReset={resetCanvas}
        />
      </div>
    </header>
  );
};
`
);
commit(['src/features/toolbar/components/TopNavigation.tsx'], 'refactor(toolbar): compose TopNavigation using atomic header primitives');

// 23. ColorPalettePicker.tsx
writeFile(
  'src/features/toolbar/components/inspector/ColorPalettePicker.tsx',
  `import React from 'react';

const COLOR_PALETTE = [
  '#ffffff', // crisp white
  '#f4f4f5', // zinc 100
  '#e4e4e7', // zinc 200
  '#d4d4d8', // zinc 300
  '#a1a1aa', // zinc 400
  '#71717a', // zinc 500
  '#52525b', // zinc 600
  '#3f3f46', // zinc 700
  '#27272a', // zinc 800
];

interface ColorPalettePickerProps {
  currentColor?: string;
  onSelectColor: (hex: string) => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  currentColor,
  onSelectColor,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Accent Border</label>
      <div className="flex items-center gap-2 flex-wrap">
        {COLOR_PALETTE.map((hex) => (
          <button
            key={hex}
            onClick={() => onSelectColor(hex)}
            className={\`w-5 h-5 rounded-full border transition-transform \${
              currentColor === hex
                ? 'scale-125 border-white shadow-sm ring-2 ring-zinc-500/40'
                : 'border-zinc-700 hover:scale-110'
            }\`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/inspector/ColorPalettePicker.tsx'], 'feat(inspector): extract ColorPalettePicker swatch selector');

// 24. CardTypeSelector.tsx
writeFile(
  'src/features/toolbar/components/inspector/CardTypeSelector.tsx',
  `import React from 'react';
import { NodeTypeKind } from '@/features/nodes/types/node.types';

interface CardTypeSelectorProps {
  currentKind: NodeTypeKind;
  onSelectKind: (kind: NodeTypeKind) => void;
}

export const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({
  currentKind,
  onSelectKind,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Card Type</label>
      <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
        {(['topic', 'checklist', 'markdown'] as NodeTypeKind[]).map((kind) => (
          <button
            key={kind}
            onClick={() => onSelectKind(kind)}
            className={\`text-xs py-1 rounded capitalize font-medium transition-all \${
              currentKind === kind
                ? 'bg-zinc-700 text-zinc-100 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }\`}
          >
            {kind === 'topic' ? 'Card' : kind === 'markdown' ? 'Note' : 'Checklist'}
          </button>
        ))}
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/inspector/CardTypeSelector.tsx'], 'feat(inspector): extract CardTypeSelector card kind switcher');

// 25. CardShapeSelector.tsx
writeFile(
  'src/features/toolbar/components/inspector/CardShapeSelector.tsx',
  `import React from 'react';
import { NodeShape } from '@/features/nodes/types/node.types';

interface CardShapeSelectorProps {
  currentShape?: NodeShape;
  onSelectShape: (shape: NodeShape) => void;
}

export const CardShapeSelector: React.FC<CardShapeSelectorProps> = ({
  currentShape = 'rounded',
  onSelectShape,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Shape</label>
      <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
        {(['rounded', 'pill', 'rectangle'] as NodeShape[]).map((shape) => (
          <button
            key={shape}
            onClick={() => onSelectShape(shape)}
            className={\`text-xs py-1 rounded capitalize font-medium transition-all \${
              currentShape === shape
                ? 'bg-zinc-700 text-zinc-100 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }\`}
          >
            {shape}
          </button>
        ))}
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/inspector/CardShapeSelector.tsx'], 'feat(inspector): extract CardShapeSelector border geometry switcher');

// 26. PrioritySelector.tsx
writeFile(
  'src/features/toolbar/components/inspector/PrioritySelector.tsx',
  `import React from 'react';
import { NodePriority } from '@/features/nodes/types/node.types';

interface PrioritySelectorProps {
  currentPriority?: NodePriority;
  onSelectPriority: (priority: NodePriority) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  currentPriority = 'none',
  onSelectPriority,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Priority</label>
      <div className="flex items-center gap-1">
        {(['none', 'low', 'medium', 'high', 'urgent'] as NodePriority[]).map((p) => (
          <button
            key={p}
            onClick={() => onSelectPriority(p)}
            className={\`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors \${
              currentPriority === p
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60'
            }\`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/inspector/PrioritySelector.tsx'], 'feat(inspector): extract PrioritySelector priority level selector');

// 27. TagManager.tsx
writeFile(
  'src/features/toolbar/components/inspector/TagManager.tsx',
  `import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagManagerProps {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags = [],
  onAddTag,
  onRemoveTag,
}) => {
  const [tagInput, setTagInput] = useState('');

  const submitTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (!clean) return;
    onAddTag(clean);
    setTagInput('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
          <Tag className="w-3 h-3 text-zinc-400" />
          <span>Tags</span>
        </label>
      </div>
      {tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700"
            >
              <span>#{tag}</span>
              <button
                onClick={() => onRemoveTag(tag)}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submitTag())}
          placeholder="Add tag..."
          className="flex-1 bg-zinc-800 text-zinc-100 text-xs px-2 py-1 rounded border border-zinc-700 outline-none focus:border-zinc-400 placeholder:text-zinc-500"
        />
        <button
          onClick={submitTag}
          className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700"
          title="Add tag"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/inspector/TagManager.tsx'], 'feat(inspector): extract TagManager chip manager and input component');

// 28. NodeCustomizerPanel.tsx refactor
writeFile(
  'src/features/toolbar/components/NodeCustomizerPanel.tsx',
  `import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { Trash2, Plus, GitBranch, Layers } from 'lucide-react';
import { ColorPalettePicker } from './inspector/ColorPalettePicker';
import { CardTypeSelector } from './inspector/CardTypeSelector';
import { CardShapeSelector } from './inspector/CardShapeSelector';
import { PrioritySelector } from './inspector/PrioritySelector';
import { TagManager } from './inspector/TagManager';

export const NodeCustomizerPanel: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
    addChildNode,
    addSiblingNode,
    deleteSubtree,
  } = useMindMapStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;

  const data = selectedNode.data;
  const isRoot = data.kind === 'root';

  const handleAddTag = (newTag: string) => {
    const currentTags = data.tags || [];
    if (!currentTags.includes(newTag)) {
      updateNodeData(selectedNode.id, { tags: [...currentTags, newTag] });
    }
  };

  const handleRemoveTag = (targetTag: string) => {
    const currentTags = data.tags || [];
    updateNodeData(selectedNode.id, {
      tags: currentTags.filter((t) => t !== targetTag),
    });
  };

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-80 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl p-4 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-200" />
          <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            {isRoot ? 'Root Card' : 'Card Inspector'}
          </span>
        </div>
        {!isRoot && (
          <button
            onClick={() => deleteSubtree(selectedNode.id)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Delete card & branch"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ColorPalettePicker
        currentColor={data.color}
        onSelectColor={(color) => updateNodeData(selectedNode.id, { color })}
      />

      {!isRoot && (
        <>
          <CardTypeSelector
            currentKind={data.kind}
            onSelectKind={(kind) => updateNodeData(selectedNode.id, { kind })}
          />

          <CardShapeSelector
            currentShape={data.shape}
            onSelectShape={(shape) => updateNodeData(selectedNode.id, { shape })}
          />

          <PrioritySelector
            currentPriority={data.priority}
            onSelectPriority={(priority) => updateNodeData(selectedNode.id, { priority })}
          />

          <TagManager
            tags={data.tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </>
      )}

      <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <button
          onClick={() => addChildNode(selectedNode.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-300" />
          <span>Add Child Card</span>
        </button>
        {!isRoot && (
          <button
            onClick={() => addSiblingNode(selectedNode.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
          >
            <GitBranch className="w-3.5 h-3.5 text-zinc-300" />
            <span>Add Sibling Card</span>
          </button>
        )}
      </div>
    </aside>
  );
};
`
);
commit(['src/features/toolbar/components/NodeCustomizerPanel.tsx'], 'refactor(inspector): compose NodeCustomizerPanel using atomic sub components');

console.log('Batch 2 complete: 13 commits added.');
