import React, { useState } from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { serializeToJson, deserializeFromJson } from '@/features/persistence/formatters/jsonSchema';
import { serializeToMarkdown } from '@/features/persistence/formatters/markdownParser';
import { X, Copy, Check, Download, Upload } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { nodes, edges, importMindMap } = useMindMapStore();
  const [tab, setTab] = useState<'json' | 'markdown' | 'import'>('json');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonContent = serializeToJson(nodes, edges);
  const markdownContent = serializeToMarkdown(nodes, edges);
  const activeContent = tab === 'json' ? jsonContent : markdownContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPng = async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#09090b',
        quality: 0.95,
      });
      const link = document.createElement('a');
      link.download = `mindcraft-map-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // export failure handling
    }
  };

  const handleImport = () => {
    setImportError(null);
    const parsed = deserializeFromJson(importText.trim());
    if (!parsed) {
      setImportError('Invalid MindCraft JSON payload.');
      return;
    }
    importMindMap(parsed.nodes, parsed.edges);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">Export & Import</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 text-xs">
          {(['json', 'markdown', 'import'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2.5 px-2 border-b-2 font-medium capitalize transition-colors ${
                tab === t ? 'border-zinc-200 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {tab === 'import' ? (
            <div className="space-y-3">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste valid MindCraft JSON schema..."
                rows={8}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono outline-none focus:border-zinc-400"
              />
              {importError && <p className="text-xs text-zinc-400 font-mono">{importError}</p>}
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Load Data</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono max-h-60 overflow-auto">
                {activeContent}
              </pre>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-750 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
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
