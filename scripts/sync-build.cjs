const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy dist/assets to ./assets
const distAssets = path.join(__dirname, '..', 'dist', 'assets');
const rootAssets = path.join(__dirname, '..', 'assets');
if (fs.existsSync(distAssets)) {
  copyDirSync(distAssets, rootAssets);
  console.log('[*] Synchronized dist/assets to ./assets');
}

// Copy dist to docs for GitHub Pages docs-folder option
const distDir = path.join(__dirname, '..', 'dist');
const docsDir = path.join(__dirname, '..', 'docs');
if (fs.existsSync(distDir)) {
  copyDirSync(distDir, docsDir);
  console.log('[*] Synchronized dist to ./docs');
}
