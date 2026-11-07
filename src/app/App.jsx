import { useState } from "react";
import { MindMapCanvas } from "@/features/canvas/components/MindMapCanvas";
import { TopNavigation } from "@/features/toolbar/components/TopNavigation";
import { NodeCustomizerPanel } from "@/features/toolbar/components/NodeCustomizerPanel";
import { ExportModal } from "@/features/toolbar/components/ExportModal";
import { ShortcutsDialog } from "@/features/toolbar/components/ShortcutsDialog";
import { SearchModal } from "@/features/search/components/SearchModal";
import { ProjectListModal } from "@/features/projects/components/ProjectListModal";
import { ThemeSelectorModal } from "@/features/theme/components/ThemeSelectorModal";
import { useThemeStore } from "@/features/theme/store/themeStore";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
const App = () => {
  const { isSearchOpen, closeSearch, isProjectModalOpen, closeProjectModal } = useMindMapStore();
  const { isThemeModalOpen, closeThemeModal } = useThemeStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  return <main className="w-screen h-screen relative overflow-hidden bg-[#09090b]">
      <TopNavigation
    onOpenExport={() => setIsExportOpen(true)}
    onOpenShortcuts={() => setIsShortcutsOpen(true)}
  />

      <MindMapCanvas />

      <NodeCustomizerPanel />

      <ExportModal
    isOpen={isExportOpen}
    onClose={() => setIsExportOpen(false)}
  />

      <ShortcutsDialog
    isOpen={isShortcutsOpen}
    onClose={() => setIsShortcutsOpen(false)}
  />

      <SearchModal
    isOpen={isSearchOpen}
    onClose={closeSearch}
  />

      <ProjectListModal
    isOpen={isProjectModalOpen}
    onClose={closeProjectModal}
  />

      <ThemeSelectorModal
    isOpen={isThemeModalOpen}
    onClose={closeThemeModal}
  />
    </main>;
};
var stdin_default = App;
export {
  App,
  stdin_default as default
};
