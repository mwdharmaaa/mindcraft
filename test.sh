#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo "[*] MindCraft - Test Suite & Verification"
echo "=================================================="

echo "[*] Running TypeScript typechecking and production build..."
npm run build

echo "[OK] Build verification succeeded without errors."
echo "=================================================="
