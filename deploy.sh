#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo "[*] MindCraft - Deployment Orchestrator"
echo "=================================================="

if command -v docker >/dev/null 2>&1; then
    echo "[*] Building and spinning up production container..."
    docker compose down --remove-orphans || true
    docker compose build --no-cache
    docker compose up -d

    echo "[*] Polling container health status..."
    TIMEOUT=30
    COUNT=0
    until docker inspect --format="{{json .State.Health.Status}}" mindcraft-app 2>/dev/null | grep -q '"healthy"' || [ $COUNT -ge $TIMEOUT ]; do
        sleep 1
        COUNT=$((COUNT + 1))
    done

    if [ $COUNT -ge $TIMEOUT ]; then
        echo "[!] Container did not report healthy within ${TIMEOUT}s, checking logs..."
        docker compose logs --tail=20
    else
        echo "[OK] MindCraft container is running and healthy."
    fi
    echo "[OK] Access endpoint: http://localhost:3000"
else
    echo "[*] Docker not found in host environment. Falling back to native npm build..."
    npm install
    npm run build
    echo "[OK] Static distribution ready in ./dist"
    echo "[*] Run 'npm run preview' to serve locally on http://localhost:4173"
fi

echo "=================================================="
echo "[OK] Deployment complete."
echo "=================================================="
