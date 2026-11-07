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

const keyNavPath = path.join(ROOT, 'src/features/canvas/hooks/useKeyboardNavigation.ts');
let navContent = fs.readFileSync(keyNavPath, 'utf8');
navContent = navContent.replace(
  '    openSearch,\n  } = useMindMapStore();',
  '    openSearch,\n    duplicateSubtree,\n    copySubtree,\n    pasteSubtree,\n  } = useMindMapStore();'
);
navContent = navContent.replace(
  '      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === \'y\') {\n        e.preventDefault();\n        redo();\n        return;\n      }\n',
  `      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedNodeId) {
          duplicateSubtree(selectedNodeId);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (selectedNodeId) {
          e.preventDefault();
          copySubtree(selectedNodeId);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteSubtree();
        return;
      }
`
);
navContent = navContent.replace(
  'undo, redo, openSearch]);',
  'undo, redo, openSearch, duplicateSubtree, copySubtree, pasteSubtree]);'
);
fs.writeFileSync(keyNavPath, navContent, 'utf8');
commit(['src/features/canvas/hooks/useKeyboardNavigation.ts'], 'feat(canvas): bind Ctrl+D Ctrl+C and Ctrl+V clipboard shortcuts');

// 50. Update ShortcutsDialog.tsx with duplicate and clipboard shortcuts
const shortcutsPath = path.join(ROOT, 'src/features/toolbar/components/ShortcutsDialog.tsx');
let shortcutsContent = fs.readFileSync(shortcutsPath, 'utf8');
shortcutsContent = shortcutsContent.replace(
  "  { key: 'Del / Backspace', desc: 'Delete card and descendants' },",
  `  { key: 'Del / Backspace', desc: 'Delete card and descendants' },
  { key: 'Ctrl + D', desc: 'Duplicate card & descendants' },
  { key: 'Ctrl + C / V', desc: 'Copy and paste branch' },
  { key: 'Ctrl + K or /', desc: 'Quick search cards' },`
);
fs.writeFileSync(shortcutsPath, shortcutsContent, 'utf8');
commit(['src/features/toolbar/components/ShortcutsDialog.tsx'], 'docs(shortcuts): document duplicate and clipboard shortcuts');

console.log('Batch 4 remainder complete.');
