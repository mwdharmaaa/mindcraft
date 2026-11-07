import { useState } from "react";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { serializeToJson, deserializeFromJson } from "@/features/persistence/formatters/jsonSchema";
import { serializeToMarkdown, deserializeFromMarkdown } from "@/features/persistence/formatters/markdownParser";
import { serializeToOpml, deserializeFromOpml } from "@/features/persistence/formatters/opmlParser";
import { exportMindMapToSvg } from "@/features/persistence/formatters/svgExporter";
import { triggerFileDownload } from "@/features/persistence/utils/downloadHelper";
import { X, Copy, Check, Download, Upload, FileCode } from "lucide-react";
const ExportModal = ({ isOpen, onClose }) => {
  const { nodes, edges, importMindMap } = useMindMapStore();
  const [tab, setTab] = useState("json");
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState(null);
  if (!isOpen) return null;
  const jsonContent = serializeToJson(nodes, edges);
  const markdownContent = serializeToMarkdown(nodes, edges);
  const opmlContent = serializeToOpml(nodes, edges);
  const activeContent = tab === "json" ? jsonContent : tab === "markdown" ? markdownContent : opmlContent;
  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleDownloadFile = () => {
    const ext = tab === "json" ? "json" : tab === "markdown" ? "md" : "opml";
    const mime = tab === "json" ? "application/json" : tab === "markdown" ? "text/markdown" : "text/xml";
    triggerFileDownload(activeContent, `mindcraft-map-${Date.now()}.${ext}`, mime);
  };
  const handleDownloadSvg = () => {
    const svg = exportMindMapToSvg(nodes);
    triggerFileDownload(svg, `mindcraft-map-${Date.now()}.svg`, "image/svg+xml");
  };
  const handleExportPng = async () => {
    const viewport = document.querySelector(".react-flow__viewport");
    if (!viewport || nodes.length === 0) return;
    try {
      const { toPng } = await import("html-to-image");
      const minX = Math.min(...nodes.map((n) => n.position.x));
      const minY = Math.min(...nodes.map((n) => n.position.y));
      const maxX = Math.max(...nodes.map((n) => n.position.x + 280));
      const maxY = Math.max(...nodes.map((n) => n.position.y + 160));
      const padding = 70;
      const captureWidth = Math.max(maxX - minX + padding * 2, 800);
      const captureHeight = Math.max(maxY - minY + padding * 2, 600);
      const dataUrl = await toPng(viewport, {
        backgroundColor: "#09090b",
        quality: 0.95,
        width: captureWidth,
        height: captureHeight,
        style: {
          width: `${captureWidth}px`,
          height: `${captureHeight}px`,
          transform: `translate(${-minX + padding}px, ${-minY + padding}px) scale(1)`
        }
      });
      const link = document.createElement("a");
      link.download = `mindcraft-map-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
    }
  };
  const handleImport = () => {
    setImportError(null);
    const trimmed = importText.trim();
    if (!trimmed) {
      setImportError("Please enter valid content to import.");
      return;
    }
    if (trimmed.startsWith("<?xml") || trimmed.includes("<opml")) {
      const opmlResult = deserializeFromOpml(trimmed);
      if (opmlResult && opmlResult.nodes.length > 0) {
        importMindMap(opmlResult.nodes, opmlResult.edges);
        onClose();
        return;
      }
    }
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
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
    setImportError("Invalid format. Paste valid JSON, Markdown outline, or OPML XML.");
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">Export & Import</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 text-xs">
          {["json", "markdown", "opml", "import"].map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={`pb-2.5 px-2 border-b-2 font-medium uppercase transition-colors ${tab === t ? "border-zinc-200 text-zinc-100" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}
  >
              {t === "import" ? "Import" : t}
            </button>)}
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {tab === "import" ? <div className="space-y-3">
              <p className="text-[11px] text-zinc-400">
                Paste MindCraft JSON, Markdown outline, or OPML XML to import and auto-arrange cards.
              </p>
              <textarea
    value={importText}
    onChange={(e) => setImportText(e.target.value)}
    placeholder="# Central Idea\n- Inciting Incident\n  - Deliverable"
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
            </div> : <div className="space-y-3">
              <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono max-h-60 overflow-auto">
                {activeContent}
              </pre>
              <div className="flex items-center gap-2 flex-wrap">
                <button
    onClick={handleCopy}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
  >
                  {copied ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? "Copied" : "Copy Text"}</span>
                </button>
                <button
    onClick={handleDownloadFile}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
  >
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download .{tab === "json" ? "json" : tab === "markdown" ? "md" : "opml"}</span>
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
            </div>}
        </div>
      </div>
    </div>;
};
export {
  ExportModal
};
