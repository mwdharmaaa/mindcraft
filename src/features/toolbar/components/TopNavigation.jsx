import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { BrandLogo } from "./header/BrandLogo";
import { HistoryControls } from "./header/HistoryControls";
import { ConnectorSelector } from "./header/ConnectorSelector";
import { LayoutSelector } from "./header/LayoutSelector";
import { CanvasStatusIndicator } from "./header/CanvasStatusIndicator";
import { CanvasActionButtons } from "./header/CanvasActionButtons";
import { useThemeStore } from "@/features/theme/store/themeStore";
const TopNavigation = ({
  onOpenExport,
  onOpenShortcuts
}) => {
  const openThemeModal = useThemeStore((s) => s.openThemeModal);
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
    openSearch,
    openProjectModal
  } = useMindMapStore();
  return <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
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
    onSearch={openSearch}
    onProjects={openProjectModal}
    onTheme={openThemeModal}
  />
      </div>
    </header>;
};
export {
  TopNavigation
};
