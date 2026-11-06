#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo "[*] MindCraft - Zero-Friction Redeployment"
echo "=================================================="

ACTIVE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "[*] Current branch: ${ACTIVE_BRANCH}"

echo "[*] Resetting untracked local modifications..."
git reset --hard HEAD

echo "[*] Pulling latest commits from origin/${ACTIVE_BRANCH}..."
git pull origin "${ACTIVE_BRANCH}"

echo "[*] Triggering fresh deployment..."
bash deploy.sh
