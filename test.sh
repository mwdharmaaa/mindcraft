#!/usr/bin/env bash
set -e

echo "[MindCraft] Running test suite & build verification..."

# 1. Typecheck and build verification
npm run build

# 2. Run unit tests
node scripts/run-tests.mjs

echo "[MindCraft] All tests and builds completed with 0 errors."
