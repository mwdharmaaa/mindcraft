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

// 91. downloadHelper.ts
writeFile(
  'src/features/persistence/utils/downloadHelper.ts',
  `export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
`
);
commit(['src/features/persistence/utils/downloadHelper.ts'], 'feat(persistence): implement downloadHelper for browser file downloads');

// 92 & 93. opmlParser.ts
writeFile(
  'src/features/persistence/formatters/opmlParser.ts',
  `import { Node, Edge, Position } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { runMindMapLayout } from '@/features/layout/layoutEngine';

export function serializeToOpml(nodes: Node<MindNodeData>[], edges: Edge[]): string {
  const root = nodes.find((n) => n.data.kind === 'root') || nodes[0];
  if (!root) return '';

  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    const list = childrenMap.get(edge.source) || [];
    list.push(edge.target);
    childrenMap.set(edge.source, list);
  });

  const renderOutline = (nodeId: string, depth: number): string => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '';

    const indent = '  '.repeat(depth);
    const childIds = childrenMap.get(nodeId) || [];
    const textAttr = (node.data.label || 'Untitled').replace(/"/g, '&quot;');

    if (childIds.length === 0) {
      return \`\${indent}<outline text="\${textAttr}" />\`;
    }

    const childrenXml = childIds.map((cid) => renderOutline(cid, depth + 1)).join('\\n');
    return \`\${indent}<outline text="\${textAttr}">\\n\${childrenXml}\\n\${indent}</outline>\`;
  };

  return \`<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>\${(root.data.label || 'MindCraft Map').replace(/"/g, '&quot;')}</title>
    <dateCreated>\${new Date().toUTCString()}</dateCreated>
  </head>
  <body>
\${renderOutline(root.id, 2)}
  </body>
</opml>\`;
}

export function deserializeFromOpml(
  opmlXml: string
): { nodes: Node<MindNodeData>[]; edges: Edge[] } | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlXml, 'text/xml');
  const body = doc.querySelector('body');
  if (!body) return null;

  const rootOutline = body.querySelector('outline');
  if (!rootOutline) return null;

  const nodes: Node<MindNodeData>[] = [];
  const edges: Edge[] = [];

  const traverse = (el: Element, parentId: string | null, depth: number) => {
    const text = el.getAttribute('text') || el.getAttribute('title') || 'Untitled';
    const id = \`opml-\${Date.now()}-\${nodes.length}\`;
    const isRoot = parentId === null;

    const node: Node<MindNodeData> = {
      id,
      type: isRoot ? 'root' : 'topic',
      position: { x: depth * 260, y: nodes.length * 80 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: text,
        kind: isRoot ? 'root' : 'topic',
        color: isRoot ? '#f4f4f5' : '#d4d4d8',
        priority: 'none',
        parentId,
      },
    };

    nodes.push(node);

    if (parentId) {
      edges.push({
        id: \`e-\${parentId}-\${id}\`,
        source: parentId,
        target: id,
        sourceHandle: 'source-r',
        targetHandle: 'target-l',
        type: 'smoothstep',
        style: { stroke: '#71717a', strokeWidth: 1.5 },
      });
    }

    const children = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'outline');
    children.forEach((child) => traverse(child, id, depth + 1));
  };

  traverse(rootOutline, null, 0);

  return runMindMapLayout(nodes, edges, 'LR');
}
`
);
commit(['src/features/persistence/formatters/opmlParser.ts'], 'feat(persistence): implement serializeToOpml and deserializeFromOpml');

// 94. svgExporter.ts
writeFile(
  'src/features/persistence/formatters/svgExporter.ts',
  `import { Node } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export function exportMindMapToSvg(nodes: Node<MindNodeData>[]): string {
  if (nodes.length === 0) return '';

  const minX = Math.min(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  const maxX = Math.max(...nodes.map((n) => n.position.x + 280));
  const maxY = Math.max(...nodes.map((n) => n.position.y + 160));

  const padding = 60;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const nodeElements = nodes
    .map((n) => {
      const x = n.position.x - minX + padding;
      const y = n.position.y - minY + padding;
      const label = (n.data.label || 'Card').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const isRoot = n.data.kind === 'root';

      return \`
    <g transform="translate(\${x}, \${y})">
      <rect width="\${isRoot ? 220 : 180}" height="48" rx="8" fill="#18181b" stroke="\${n.data.color || '#3f3f46'}" stroke-width="2" />
      <text x="16" y="28" fill="#f4f4f5" font-family="sans-serif" font-size="12" font-weight="\${isRoot ? 'bold' : 'normal'}">\${label}</text>
    </g>\`;
    })
    .join('');

  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="\${width}" height="\${height}" viewBox="0 0 \${width} \${height}">
  <rect width="100%" height="100%" fill="#09090b" />
  \${nodeElements}
</svg>\`;
}
`
);
commit(['src/features/persistence/formatters/svgExporter.ts'], 'feat(persistence): implement exportMindMapToSvg generator');

// 95-98. Refactor ExportModal.tsx with OPML, SVG, Clipboard Copy, and downloadHelper
writeFile(
  'src/features/toolbar/components/ExportModal.tsx',
  `import React, { useState } from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { serializeToJson, deserializeFromJson } from '@/features/persistence/formatters/jsonSchema';
import { serializeToMarkdown, deserializeFromMarkdown } from '@/features/persistence/formatters/markdownParser';
import { serializeToOpml, deserializeFromOpml } from '@/features/persistence/formatters/opmlParser';
import { exportMindMapToSvg } from '@/features/persistence/formatters/svgExporter';
import { triggerFileDownload } from '@/features/persistence/utils/downloadHelper';
import { X, Copy, Check, Download, Upload, FileCode } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { nodes, edges, importMindMap } = useMindMapStore();
  const [tab, setTab] = useState<'json' | 'markdown' | 'opml' | 'import'>('json');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonContent = serializeToJson(nodes, edges);
  const markdownContent = serializeToMarkdown(nodes, edges);
  const opmlContent = serializeToOpml(nodes, edges);
  const activeContent = tab === 'json' ? jsonContent : tab === 'markdown' ? markdownContent : opmlContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = tab === 'json' ? 'json' : tab === 'markdown' ? 'md' : 'opml';
    const mime = tab === 'json' ? 'application/json' : tab === 'markdown' ? 'text/markdown' : 'text/xml';
    triggerFileDownload(activeContent, \`mindcraft-map-\${Date.now()}.\${ext}\`, mime);
  };

  const handleDownloadSvg = () => {
    const svg = exportMindMapToSvg(nodes);
    triggerFileDownload(svg, \`mindcraft-map-\${Date.now()}.svg\`, 'image/svg+xml');
  };

  const handleExportPng = async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport || nodes.length === 0) return;
    try {
      const { toPng } = await import('html-to-image');
      const minX = Math.min(...nodes.map((n) => n.position.x));
      const minY = Math.min(...nodes.map((n) => n.position.y));
      const maxX = Math.max(...nodes.map((n) => n.position.x + 280));
      const maxY = Math.max(...nodes.map((n) => n.position.y + 160));
      const padding = 70;
      const captureWidth = Math.max(maxX - minX + padding * 2, 800);
      const captureHeight = Math.max(maxY - minY + padding * 2, 600);

      const dataUrl = await toPng(viewport, {
        backgroundColor: '#09090b',
        quality: 0.95,
        width: captureWidth,
        height: captureHeight,
        style: {
          width: \`\${captureWidth}px\`,
          height: \`\${captureHeight}px\`,
          transform: \`translate(\${-minX + padding}px, \${-minY + padding}px) scale(1)\`,
        },
      });
      const link = document.createElement('a');
      link.download = \`mindcraft-map-\${Date.now()}.png\`;
      link.href = dataUrl;
      link.click();
    } catch {
      // export failure handling
    }
  };

  const handleImport = () => {
    setImportError(null);
    const trimmed = importText.trim();
    if (!trimmed) {
      setImportError('Please enter valid content to import.');
      return;
    }

    if (trimmed.startsWith('<?xml') || trimmed.includes('<opml')) {
      const opmlResult = deserializeFromOpml(trimmed);
      if (opmlResult && opmlResult.nodes.length > 0) {
        importMindMap(opmlResult.nodes, opmlResult.edges);
        onClose();
        return;
      }
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const jsonResult = deserializeFromJson(trimmed);
      if (jsonResult) {
        importMindMap(jsonResult.nodes, jsonResult.edges);
        onClose();
        return;
      }
    }

    const mdResult = deserializeFromMarkdown(trimmed);
    if (mdResult && mdResult.nodes.length > 0) {
      importMindMap(mdResult.nodes, mdResult.edges);
      onClose();
      return;
    }

    setImportError('Invalid format. Paste valid JSON, Markdown outline, or OPML XML.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">Export & Import</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 text-xs">
          {(['json', 'markdown', 'opml', 'import'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={\`pb-2.5 px-2 border-b-2 font-medium uppercase transition-colors \${
                tab === t ? 'border-zinc-200 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }\`}
            >
              {t === 'import' ? 'Import' : t}
            </button>
          ))}
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {tab === 'import' ? (
            <div className="space-y-3">
              <p className="text-[11px] text-zinc-400">
                Paste MindCraft JSON, Markdown outline, or OPML XML to import and auto-arrange cards.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="# Central Idea\\n- Inciting Incident\\n  - Deliverable"
                rows={9}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono outline-none focus:border-zinc-400"
              />
              {importError && <p className="text-xs text-rose-400 font-mono">{importError}</p>}
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Parse and Load Map</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono max-h-60 overflow-auto">
                {activeContent}
              </pre>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download .{tab === 'json' ? 'json' : tab === 'markdown' ? 'md' : 'opml'}</span>
                </button>
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={handleExportPng}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`
);
commit(['src/features/toolbar/components/ExportModal.tsx'], 'refactor(toolbar): streamline ExportModal with OPML SVG and downloadHelper');

console.log('Batch 9 complete: 4 major multi-step commits added.');
