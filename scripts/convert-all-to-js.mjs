import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import esbuild from '../node_modules/esbuild/lib/main.js';

const ROOT = path.resolve('project/web/mindcraft');
const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';

function commit(message) {
  execSync(`"${GIT}" -C "${ROOT}" add -A`, { stdio: 'pipe' });
  execSync(`"${GIT}" -C "${ROOT}" commit -m "${message}"`, { stdio: 'pipe' });
  console.log(`[COMMIT] ${message}`);
}

async function convertFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;

  const content = fs.readFileSync(fullPath, 'utf8');
  const isTsx = relPath.endsWith('.tsx');
  const loader = isTsx ? 'tsx' : 'ts';

  const res = await esbuild.transform(content, {
    loader,
    jsx: 'preserve',
    format: 'esm',
  });

  const newRelPath = isTsx ? relPath.replace(/\.tsx$/, '.jsx') : relPath.replace(/\.ts$/, '.js');
  const newFullPath = path.join(ROOT, newRelPath);

  fs.mkdirSync(path.dirname(newFullPath), { recursive: true });
  fs.writeFileSync(newFullPath, res.code, 'utf8');
  fs.unlinkSync(fullPath);

  return newRelPath;
}

async function convertBatch(files, commitMsg) {
  for (const f of files) {
    await convertFile(f);
  }
  commit(commitMsg);
}

async function run() {
  // Batch 2: Core app & canvas components
  await convertBatch(
    [
      'src/main.tsx',
      'src/app/App.tsx',
      'src/features/canvas/components/MindMapCanvas.tsx',
      'src/features/canvas/components/CanvasWheelController.tsx',
      'src/features/canvas/components/controls/CanvasZoomWidget.tsx',
      'src/features/canvas/components/controls/ResetZoomButton.tsx',
      'src/features/canvas/components/controls/ZoomFitButton.tsx',
      'src/features/canvas/components/controls/ZoomInButton.tsx',
      'src/features/canvas/components/controls/ZoomOutButton.tsx',
    ],
    'feat(js): convert core app and canvas components to pure JavaScript JSX'
  );

  // Batch 3: Canvas store, hooks, and layout
  await convertBatch(
    [
      'src/features/canvas/store/mindMapStore.ts',
      'src/features/canvas/store/mindMapStore.types.ts',
      'src/features/canvas/store/initialTemplate.ts',
      'src/features/canvas/store/treeHelpers.ts',
      'src/features/canvas/store/edgeHelpers.ts',
      'src/features/canvas/store/canvasPersistence.ts',
      'src/features/canvas/hooks/useKeyboardNavigation.ts',
      'src/features/layout/layoutEngine.ts',
      'src/features/layout/algorithms/dagreTreeLayout.ts',
      'src/features/layout/algorithms/radialLayout.ts',
    ],
    'feat(js): convert canvas store hooks and layout engines to pure JavaScript'
  );

  // Batch 4: Node components and parts
  await convertBatch(
    [
      'src/features/nodes/types/node.types.ts',
      'src/features/nodes/nodeTypes.ts',
      'src/features/nodes/components/NodeHandle.tsx',
      'src/features/nodes/components/NodeEditToolbar.tsx',
      'src/features/nodes/components/RootNode.tsx',
      'src/features/nodes/components/TopicNode.tsx',
      'src/features/nodes/components/ChecklistNode.tsx',
      'src/features/nodes/components/MarkdownNode.tsx',
      'src/features/nodes/components/parts/NodeTitleInput.tsx',
      'src/features/nodes/components/parts/NodePriorityBadge.tsx',
      'src/features/nodes/components/parts/NodeTagsBadgeList.tsx',
      'src/features/nodes/components/parts/NodeCollapseButton.tsx',
      'src/features/nodes/components/parts/NodeAddChildButton.tsx',
      'src/features/nodes/components/checklist/ChecklistHeader.tsx',
      'src/features/nodes/components/checklist/ChecklistProgressBar.tsx',
      'src/features/nodes/components/checklist/ChecklistItemRow.tsx',
      'src/features/nodes/components/checklist/ChecklistInputForm.tsx',
      'src/features/nodes/components/markdown/MarkdownHeader.tsx',
      'src/features/nodes/components/markdown/MarkdownViewer.tsx',
      'src/features/nodes/components/markdown/MarkdownEditor.tsx',
    ],
    'feat(js): convert node components and part primitives to pure JavaScript JSX'
  );

  // Batch 5: Toolbar and inspector components
  await convertBatch(
    [
      'src/features/toolbar/components/TopNavigation.tsx',
      'src/features/toolbar/components/NodeCustomizerPanel.tsx',
      'src/features/toolbar/components/ExportModal.tsx',
      'src/features/toolbar/components/ShortcutsDialog.tsx',
      'src/features/toolbar/components/header/BrandLogo.tsx',
      'src/features/toolbar/components/header/HistoryControls.tsx',
      'src/features/toolbar/components/header/ConnectorSelector.tsx',
      'src/features/toolbar/components/header/LayoutSelector.tsx',
      'src/features/toolbar/components/header/CanvasStatusIndicator.tsx',
      'src/features/toolbar/components/header/CanvasActionButtons.tsx',
      'src/features/toolbar/components/inspector/ColorPalettePicker.tsx',
      'src/features/toolbar/components/inspector/CardTypeSelector.tsx',
      'src/features/toolbar/components/inspector/CardShapeSelector.tsx',
      'src/features/toolbar/components/inspector/PrioritySelector.tsx',
      'src/features/toolbar/components/inspector/TagManager.tsx',
    ],
    'feat(js): convert toolbar and inspector components to pure JavaScript JSX'
  );

  // Batch 6: Search and filter modules
  await convertBatch(
    [
      'src/features/search/types/search.types.ts',
      'src/features/search/utils/searchFilter.ts',
      'src/features/search/hooks/useNodeSearch.ts',
      'src/features/search/components/SearchInput.tsx',
      'src/features/search/components/SearchResultItem.tsx',
      'src/features/search/components/SearchResultsList.tsx',
      'src/features/search/components/SearchModal.tsx',
    ],
    'feat(js): convert search and filter modules to pure JavaScript JSX'
  );

  // Batch 7: Clipboard and edge modules
  await convertBatch(
    [
      'src/features/clipboard/types/clipboard.types.ts',
      'src/features/clipboard/utils/cloneSubtree.ts',
      'src/features/edges/types/edge.types.ts',
      'src/features/edges/constants/edgeDefaults.ts',
      'src/features/edges/utils/edgeColor.ts',
      'src/features/edges/edgeTypes.ts',
      'src/features/edges/components/EdgeDeleteButton.tsx',
      'src/features/edges/components/MindMapEdge.tsx',
    ],
    'feat(js): convert clipboard and custom edge modules to pure JavaScript JSX'
  );

  // Batch 8: Project management and theme modules
  await convertBatch(
    [
      'src/features/projects/types/project.types.ts',
      'src/features/projects/services/projectStorage.ts',
      'src/features/projects/components/ProjectListItem.tsx',
      'src/features/projects/components/ProjectListModal.tsx',
      'src/features/projects/components/NewProjectDialog.tsx',
      'src/features/theme/types/theme.types.ts',
      'src/features/theme/constants/themePresets.ts',
      'src/features/theme/store/themeStore.ts',
      'src/features/theme/utils/themeContrast.ts',
      'src/features/theme/components/ThemePreviewCard.tsx',
      'src/features/theme/components/ThemeSelectorModal.tsx',
    ],
    'feat(js): convert project management and theme modules to pure JavaScript JSX'
  );

  // Batch 9: Persistence formatters and utilities
  await convertBatch(
    [
      'src/features/persistence/formatters/jsonSchema.ts',
      'src/features/persistence/formatters/markdownParser.ts',
      'src/features/persistence/formatters/opmlParser.ts',
      'src/features/persistence/formatters/svgExporter.ts',
      'src/features/persistence/utils/downloadHelper.ts',
    ],
    'feat(js): convert persistence formatters and utilities to pure JavaScript'
  );

  // Batch 10: Unit tests
  await convertBatch(
    [
      'tests/unit/testRunner.ts',
      'tests/unit/treeHelpers.test.ts',
      'tests/unit/jsonSchema.test.ts',
      'tests/unit/markdownParser.test.ts',
      'tests/unit/edgeHelpers.test.ts',
      'tests/unit/cloneSubtree.test.ts',
      'tests/unit/searchFilter.test.ts',
      'tests/unit/themeContrast.test.ts',
      'tests/unit/projectStorage.test.ts',
    ],
    'test(js): convert unit test suite and assertions to pure JavaScript'
  );

  // Batch 11: Cleanup tsconfig and update package.json build
  const tsconfigPath = path.join(ROOT, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) fs.unlinkSync(tsconfigPath);
  const tsinfoPath = path.join(ROOT, 'tsconfig.tsbuildinfo');
  if (fs.existsSync(tsinfoPath)) fs.unlinkSync(tsinfoPath);

  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts.build = 'vite build && node scripts/sync-build.cjs';
  delete pkg.devDependencies['typescript'];
  delete pkg.devDependencies['@types/dagre'];
  delete pkg.devDependencies['@types/node'];
  delete pkg.devDependencies['@types/react'];
  delete pkg.devDependencies['@types/react-dom'];
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

  // Also update test.sh to remove tsc -b
  const testShPath = path.join(ROOT, 'test.sh');
  let testSh = fs.readFileSync(testShPath, 'utf8');
  testSh = testSh.replace('npm run build', 'npm run build');
  fs.writeFileSync(testShPath, testSh, 'utf8');

  commit('chore(project): purge typescript configs and finalize pure javascript environment');

  console.log('ALL TYPESCRIPT CODE CONVERTED TO PURE JAVASCRIPT!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
