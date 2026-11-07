import React, { useState } from 'react';
import { MindMapCanvas } from '@/features/canvas/components/MindMapCanvas';
import { TopNavigation } from '@/features/toolbar/components/TopNavigation';
import { NodeCustomizerPanel } from '@/features/toolbar/components/NodeCustomizerPanel';
import { ExportModal } from '@/features/toolbar/components/ExportModal';
import { ShortcutsDialog } from '@/features/toolbar/components/ShortcutsDialog';
import { SearchModal } from '@/features/search/components/SearchModal';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export const App: React.FC = () => {
  const { isSearchOpen, closeSearch } = useMindMapStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-[#09090b]">
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
    </main>
  );
};

export default App;
